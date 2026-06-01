import os
import io
import json
import zipfile
import threading
from datetime import datetime
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64

import cloud_sync

# Декоратор для передачи статусов на фронтенд (JS) через Eel
def eel_notify_sync_status(status_state, message):
    import eel
    try:
        # Пытаемся вызвать JS функцию напрямую
        eel.update_sync_ui_state(status_state, message)()
    except Exception:
        pass # Если сокет закрыт или интерфейс еще не загружен - молчим

class SyncEngine:
    def __init__(self, app_data_dir, current_vault_path, vault_name):
        self.app_data_dir = app_data_dir
        self.vault_path = current_vault_path
        self.vault_name = vault_name
        self.creds = cloud_sync.load_credentials(app_data_dir)
        
        self.is_syncing = False
        
        if self.creds:
            self.s3 = cloud_sync.S3Client(
                endpoint_url=self.creds['endpoint'],
                access_key=self.creds['access_key'],
                secret_key=self.creds['secret_key'],
                bucket_name=self.creds['bucket']
            )
            # Если пароль есть - создаем шифратор. Если пусто - оставляем None (режим открытого ZIP)
            user_pass = self.creds.get('user_password', '')
            if user_pass:
                self.cipher = self._generate_e2e_cipher(user_pass)
            else:
                self.cipher = None
        else:
            self.s3 = None
            self.cipher = None

    def _generate_e2e_cipher(self, user_password):
        """Создает обертку шифрования со случайной солью (Random Salt Header)."""
        password_bytes = user_password.encode('utf-8')
        vault_name_for_fallback = self.vault_name
        
        class DynamicSaltCipher:
            def encrypt(self, data):
                # Генерируем 16 байт абсолютной случайности для каждого нового бэкапа
                salt = os.urandom(16)
                kdf = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=salt, iterations=600000)
                key = base64.urlsafe_b64encode(kdf.derive(password_bytes))
                
                # Прикрепляем магический заголовок SALTED__ и саму соль в начало файла
                return b"SALTED__" + salt + Fernet(key).encrypt(data)

            def decrypt(self, data):
                # Если файл зашифрован новым алгоритмом (есть заголовок)
                if data.startswith(b"SALTED__"):
                    salt = data[8:24]
                    payload = data[24:]
                    kdf = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=salt, iterations=600000)
                    key = base64.urlsafe_b64encode(kdf.derive(password_bytes))
                    return Fernet(key).decrypt(payload)
                else:
                    # Legacy fallback 1: Самая первая статичная соль (чтобы не потерять старые данные)
                    try:
                        kdf = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=b"prompt_manager_e2ee_global_salt_v1", iterations=480000)
                        key = base64.urlsafe_b64encode(kdf.derive(password_bytes))
                        return Fernet(key).decrypt(data)
                    except Exception:
                        # Legacy fallback 2: Динамическая соль по имени хранилища (промежуточный фикс)
                        vault_salt = f"prompt_manager_e2ee_{vault_name_for_fallback}".encode('utf-8')
                        kdf = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=vault_salt, iterations=600000)
                        key = base64.urlsafe_b64encode(kdf.derive(password_bytes))
                        return Fernet(key).decrypt(data)
                        
        # Возвращаем наш объект, который маскируется под стандартный интерфейс Fernet
        return DynamicSaltCipher()



    def _zip_vault(self):
        """Пакует текущее хранилище в ZIP с гибридным буфером (сброс на диск после 10 МБ)."""
        import tempfile
        import cloud_sync
        
        # Блокируем весь интерфейс (main.py) на время сборки архива, чтобы избежать записи "половинчатых" данных
        with cloud_sync.VAULT_LOCK:
            temp_zip = tempfile.SpooledTemporaryFile(max_size=10*1024*1024)
            with zipfile.ZipFile(temp_zip, 'w', zipfile.ZIP_DEFLATED) as zf:
                for root, dirs, files in os.walk(self.vault_path):
                    for file in files:
                        file_path = os.path.join(root, file)
                        rel_path = os.path.relpath(file_path, self.vault_path)
                        zf.write(file_path, rel_path)
            
            temp_zip.seek(0)
            data = temp_zip.read()
            temp_zip.close()
            return data

    def _unzip_vault(self, zip_bytes):
        """Распаковывает ZIP-архив в папку хранилища с защитой от Zip Slip (Directory Traversal)."""
        import tempfile
        import cloud_sync
        target_dir = os.path.abspath(self.vault_path)
        
        # Блокируем интерфейс на время распаковки, чтобы не перезаписать изменения пользователя
        with cloud_sync.VAULT_LOCK:
            with tempfile.SpooledTemporaryFile(max_size=10*1024*1024) as temp_zip:
                temp_zip.write(zip_bytes)
                temp_zip.seek(0)
                with zipfile.ZipFile(temp_zip, 'r') as zf:
                    for member in zf.namelist():
                        extracted_path = os.path.abspath(os.path.join(target_dir, member))
                        if os.path.commonpath([target_dir, extracted_path]) != target_dir:
                            raise Exception(f"Security Warning: Zip Slip vulnerability detected in cloud archive! Blocked file: {member}")
                            
                    zf.extractall(self.vault_path)

            
    def _get_sync_state(self):
        """Читает локальный 'паспорт' синхронизации."""
        state_file = os.path.join(self.vault_path, '.sync_state.json')
        if os.path.exists(state_file):
            try:
                with open(state_file, 'r', encoding='utf-8') as f:
                    return json.load(f).get('last_synced_mtime', 0)
            except:
                pass
        return 0
        
    def _update_sync_state(self, remote_mtime):
        """Обновляет 'паспорт', подтверждая, что мы синхронизированы с этой версией облака."""
        state_file = os.path.join(self.vault_path, '.sync_state.json')
        with open(state_file, 'w', encoding='utf-8') as f:
            json.dump({'last_synced_mtime': remote_mtime}, f)

    def _get_local_modified_time(self):
        """Определяет, когда хранилище было изменено в последний раз (по дате notes.json)."""
        notes_file = os.path.join(self.vault_path, 'notes.json')
        if os.path.exists(notes_file):
            return os.path.getmtime(notes_file)
        return 0

    def _ask_user_for_conflict_resolution(self):
        """Останавливает поток и просит JS показать диалог выбора."""
        import eel
        import time
        
        # Мы используем глобальную переменную из модуля для получения ответа из JS
        global _sync_conflict_resolution
        _sync_conflict_resolution = None
        
        # Вызываем JS окно (функция eel должна быть доступна на клиенте)
        try:
            eel.show_sync_conflict_dialog()()
        except Exception as e:
            # Если UI недоступен, по умолчанию выбираем cancel, чтобы не сломать ничего
            print(f"Failed to show conflict UI: {e}")
            return 'cancel'
        
        # Ждем, пока пользователь нажмет кнопку в UI (крутим цикл с микро-паузой)
        # Ограничим время ожидания 10 минутами (1200 * 0.5s), чтобы поток не висел вечно
        attempts = 0
        while _sync_conflict_resolution is None and attempts < 1200:
            time.sleep(0.5)
            attempts += 1
            
        return _sync_conflict_resolution or 'cancel'

    def run_sync(self, force_download=False, force_ext=None):

        """Главный метод синхронизации. Должен запускаться в отдельном потоке."""
        if not self.creds:
            eel_notify_sync_status('idle', 'Cloud Sync: Off')
            return

        if not self.s3:
            eel_notify_sync_status('error', 'Cloud client error')
            return

        if self.is_syncing:
            return
            
        self.is_syncing = True
        eel_notify_sync_status('syncing', 'Checking cloud...')

        try:
            base_filename = f"Vault_{self.vault_name.replace(' ', '_')}"
            enc_filename = f"{base_filename}.enc"
            zip_filename = f"{base_filename}.zip"
            
            success = False
            remote_data = None
            downloaded_ext = None
            
            # Если пользователь жестко указал, что качать (через меню Restore)
            if force_ext == '.enc':
                success, remote_data = self.s3.download_file(enc_filename)
                downloaded_ext = '.enc'
            elif force_ext == '.zip':
                success, remote_data = self.s3.download_file(zip_filename)
                downloaded_ext = '.zip'
            else:
                # --- АВТОМАТИЧЕСКАЯ УМНАЯ ЛОГИКА ---
                enc_time = self.s3.get_file_timestamp(enc_filename)
                zip_time = self.s3.get_file_timestamp(zip_filename)
                
                if enc_time > 0 or zip_time > 0:
                    if enc_time >= zip_time:
                        success, remote_data = self.s3.download_file(enc_filename)
                        downloaded_ext = '.enc'
                    else:
                        success, remote_data = self.s3.download_file(zip_filename)
                        downloaded_ext = '.zip'
            # ----------------------------------

            
            local_mtime = self._get_local_modified_time()
            
            if success:
                # В облаке есть файл. Расшифровываем или берем как есть.
                if downloaded_ext == '.enc':

                    if not self.cipher:
                        eel_notify_sync_status('error', 'Cloud file is encrypted, but you have no password set!')
                        self.is_syncing = False
                        return
                        
                    eel_notify_sync_status('syncing', 'Decrypting cloud data...')
                    try:
                        decrypted_zip = self.cipher.decrypt(remote_data)
                    except Exception:
                        eel_notify_sync_status('error', 'Decryption failed (Wrong password?)')
                        self.is_syncing = False
                        return
                else:
                    # Скачан обычный ZIP
                    if self.cipher:
                        eel_notify_sync_status('syncing', 'Warning: Cloud file is unencrypted.')
                    decrypted_zip = remote_data


                # Читаем метаданные архива в памяти, чтобы понять дату его создания
                memory_zip = io.BytesIO(decrypted_zip)
                with zipfile.ZipFile(memory_zip, 'r') as zf:
                    try:
                        info = zf.getinfo('notes.json')
                        remote_mtime = datetime(*info.date_time).timestamp()
                    except KeyError:
                        remote_mtime = 0

                last_synced_mtime = self._get_sync_state()

                # --- ПРОВЕРКА ЛОКАЛЬНОГО ФАЙЛА НА ПУСТОТУ ---
                is_local_empty = True
                local_notes_file = os.path.join(self.vault_path, 'notes.json')
                if os.path.exists(local_notes_file):
                    try:
                        with open(local_notes_file, 'r', encoding='utf-8') as f:
                            local_data = json.load(f)
                            if local_data.get('notes') or local_data.get('collections'):
                                is_local_empty = False
                    except:
                        pass
                # --------------------------------------------

                # --- ЛОГИКА РАЗРЕШЕНИЯ КОНФЛИКТОВ ---
                # 1. Принудительное скачивание (кнопка Restore)
                if force_download:
                    eel_notify_sync_status('syncing', 'Downloading (Forced)...')
                    self._unzip_vault(decrypted_zip)
                    self._update_sync_state(remote_mtime)
                    import eel
                    eel.reload_app()()
                    eel_notify_sync_status('success', 'Sync Complete (Restored)')
                    self.is_syncing = False
                    return

                # 2. Защита от случайной потери облака (Сброс устройства)
                if last_synced_mtime == 0:
                    if is_local_empty:
                        # Локально пусто - смело качаем бэкап
                        eel_notify_sync_status('syncing', 'Downloading missing cloud data...')
                        self._unzip_vault(decrypted_zip)
                        self._update_sync_state(remote_mtime)
                        import eel
                        eel.reload_app()()
                        eel_notify_sync_status('success', 'Sync Complete (Downloaded)')
                        
                    else:
                        # КОНФЛИКТ: Локально есть заметки, и в облаке есть бэкап! Спрашиваем пользователя.
                        eel_notify_sync_status('error', 'Conflict detected! Waiting for user...')
                        decision = self._ask_user_for_conflict_resolution()
                        
                        if decision == 'overwrite':
                            eel_notify_sync_status('syncing', 'Overwriting local data with cloud backup...')
                            self._unzip_vault(decrypted_zip)
                            self._update_sync_state(remote_mtime)
                            import eel
                            eel.reload_app()()
                            eel_notify_sync_status('success', 'Sync Complete (Restored)')
                            
                        elif decision == 'keep_both':
                            eel_notify_sync_status('syncing', 'Renaming local vault and downloading cloud backup...')
                            # 1. Переименовываем текущую локальную папку
                            timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S")
                            recovered_vault_name = f"{self.vault_name}_recovered_{timestamp_str}"
                            recovered_vault_path = os.path.join(os.path.dirname(self.vault_path), recovered_vault_name)
                            
                            import shutil
                            # Перемещаем текущие "конфликтные" заметки в папку recovered
                            shutil.move(self.vault_path, recovered_vault_path)
                            
                            # Создаем заново оригинальную папку (чтобы было куда распаковать)
                            os.makedirs(self.vault_path, exist_ok=True)
                            
                            # 2. Распаковываем облачный бэкап в оригинальную папку
                            self._unzip_vault(decrypted_zip)
                            self._update_sync_state(remote_mtime)
                            
                            import eel
                            eel.reload_app()()
                            eel_notify_sync_status('success', f'Saved both! Restored original & created "{recovered_vault_name}"')
                            
                        else:
                            # Cancelled (Нажата кнопка Отмена, кнопка Esc или таймаут)
                            eel_notify_sync_status('error', 'Sync Cancelled (Unresolved Conflict)')
                    
                    # ВАЖНО: При ЛЮБОМ исходе блока конфликта мы ОБЯЗАНЫ завершить функцию (return).
                    # Мы НИКОГДА не должны проваливаться ниже к шагу "Загрузка в облако".
                    self.is_syncing = False
                    return


                # 3. Обычная синхронизация (когда устройства знают друг друга)


                if remote_mtime > last_synced_mtime + 5:
                    # Кто-то другой (с ноутбука) обновил облако. Качаем!
                    eel_notify_sync_status('syncing', 'Downloading new changes...')
                    self._unzip_vault(decrypted_zip)
                    self._update_sync_state(remote_mtime)
                    import eel
                    eel.reload_app()()
                    eel_notify_sync_status('success', 'Sync Complete (Downloaded)')
                    self.is_syncing = False
                    return
                elif local_mtime > last_synced_mtime + 5:
                    # Мы изменили файл у себя (на этом ПК). Нужно залить.
                    pass # Переходим к шагу 3 (Загрузка)
                else:
                    # Никто ничего не менял
                    eel_notify_sync_status('success', 'Up to date')
                    self.is_syncing = False
                    return

            # 3. У нас более новая версия (или в облаке вообще пусто). Загружаем локальную в облако!
            raw_zip = self._zip_vault()
            
            if self.cipher:
                eel_notify_sync_status('syncing', 'Encrypting local data...')
                final_data_to_upload = self.cipher.encrypt(raw_zip)
                target_upload_name = enc_filename
                file_to_delete = zip_filename # Убиваем ZIP, раз перешли на шифрование
            else:
                eel_notify_sync_status('syncing', 'Preparing ZIP backup...')
                final_data_to_upload = raw_zip
                target_upload_name = zip_filename
                file_to_delete = enc_filename # Убиваем ENC, раз сняли пароль
            
            eel_notify_sync_status('syncing', 'Uploading to cloud...')
            up_success, up_msg = self.s3.upload_file(target_upload_name, final_data_to_upload)
            
            if up_success:
                # Удаляем старый формат из облака, чтобы не создавать коллизий при скачивании
                self.s3.delete_file(file_to_delete)
                
                # Обновляем паспорт синхронизации НАШИМ текущим временем
                self._update_sync_state(self._get_local_modified_time())
                eel_notify_sync_status('success', 'Sync Complete (Uploaded)')
            else:
                eel_notify_sync_status('error', f'Upload failed: {up_msg}')

        except Exception as e:
            eel_notify_sync_status('error', f'Sync Crash: {str(e)}')
            
        finally:
            self.is_syncing = False



# Глобальный экземпляр (для управления потоками)
_active_sync_thread = None
_sync_conflict_resolution = None

def resolve_conflict_from_ui(decision):
    """Вызывается из JS, когда пользователь делает выбор (download/upload)."""
    global _sync_conflict_resolution
    _sync_conflict_resolution = decision

def trigger_background_sync(app_data_dir, current_vault_path, vault_name):
    """Запускает процесс синхронизации в отдельном потоке (Thread)."""
    global _active_sync_thread
    
    # Защита от дублирования потоков (чтобы не запустить 10 загрузок одновременно)
    if _active_sync_thread and _active_sync_thread.is_alive():
        print("Sync already in progress. Ignoring trigger.")
        return

    engine = SyncEngine(app_data_dir, current_vault_path, vault_name)
    _active_sync_thread = threading.Thread(target=engine.run_sync, daemon=True)
    _active_sync_thread.start()
