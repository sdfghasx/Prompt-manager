import eel
import os
import json
import uuid
import shutil
from datetime import datetime
import sys
from tkinter import filedialog, Tk
import cloud_sync
import sync_engine
import threading

# Глобальный таймер для отложенной синхронизации
_auto_sync_timer = None

def schedule_auto_sync():
    """Сбрасывает таймер и запускает синхронизацию через 5 секунд простоя."""
    global _auto_sync_timer
    if _auto_sync_timer is not None:
        _auto_sync_timer.cancel()
        
    settings = get_app_settings()
    vault_name = settings.get('current_vault', DEFAULT_VAULT_NAME)
    
    _auto_sync_timer = threading.Timer(5.0, sync_engine.trigger_background_sync, args=[APP_DATA_DIR, CURRENT_VAULT_PATH, vault_name])
    _auto_sync_timer.daemon = True
    _auto_sync_timer.start()

# --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
# --- Конфигурация ---



ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

def get_writable_app_dir():
    """
    Определяет, куда безопасно сохранять данные пользователя.
    Если есть права на запись в папку с программой (Portable mode) - использует её.
    Если установлена в Program Files (нет прав) - использует AppData.
    """
    try:
        # Пытаемся создать скрытый временный файл для проверки прав
        test_file = os.path.join(ROOT_DIR, '.write_test')
        with open(test_file, 'w') as f:
            f.write('test')
        os.remove(test_file)
        # Если ошибки не было, значит у нас есть полные права в этой папке!
        return ROOT_DIR
    except (IOError, PermissionError):
        # Если прав нет, падаем в надежную AppData
        user_appdata = os.environ.get('APPDATA', os.path.expanduser('~'))
        app_data_dir = os.path.join(user_appdata, 'PromptManager')
        os.makedirs(app_data_dir, exist_ok=True)
        return app_data_dir

# Получаем умный путь
APP_DATA_DIR = get_writable_app_dir()

# Прописываем пути на основе выбранной папки
NOTES_APP_DIR = os.path.join(APP_DATA_DIR, 'Notes')
DEFAULT_VAULT_NAME = 'Default Vault'
STATE_FILE = os.path.join(APP_DATA_DIR, 'app_state.json')

# Убеждаемся, что директория для заметок существует
os.makedirs(NOTES_APP_DIR, exist_ok=True)

# --- Глобальное состояние ---
CURRENT_VAULT_PATH = ''
APP_SETTINGS = {}

# --- НОВАЯ СИСТЕМА ПЕРЕХВАТА ОШИБОК ДЛЯ EEL ---
import functools
import traceback

def safe_eel(func):
    """Декоратор для перехвата крашей внутри функций Eel."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            # Получаем полный стек ошибки
            tb_lines = traceback.format_exception(type(e), e, e.__traceback__)
            tb_text = "".join(tb_lines)
            
            # Скрываем пути
            if ROOT_DIR in tb_text:
                tb_text = tb_text.replace(ROOT_DIR, '[APP_DIR]')
            
            # Логируем в консоль для отладки
            print(f"CRITICAL ERROR IN EEL FUNCTION '{func.__name__}':\n{tb_text}")
            
            # Отправляем специальный объект ошибки обратно в JavaScript!
            return {
                'success': False, 
                'errorCode': 'CRITICAL_CRASH', 
                'errorArg': tb_text,
                'is_fatal': True # Специальный флаг
            }
    return wrapper

def metadata_lock(func):
    """Декоратор для предотвращения Race Condition (TOCTOU) при конкурентной записи метаданных."""
    import functools
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        # Используем глобальный замок из cloud_sync
        with cloud_sync.VAULT_LOCK:
            return func(*args, **kwargs)
    return wrapper

# -----------------------------------------------

# --- Вспомогательные функции ---


def sanitize_vault_name(name):
    """Очищает имя хранилища от запрещенных символов и путей."""
    if not name:
        return ""
    import re
    # Удаляем любые слеши и другие опасные символы, оставляем только буквы, цифры, пробелы, дефисы и подчеркивания
    safe_name = re.sub(r'[^\w\s\-_]', '', str(name)).strip()
    
    # Зарезервированные имена Windows
    reserved = {'CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'}
    if safe_name.upper() in reserved:
        return safe_name + "_vault"
        
    return safe_name

def get_app_settings():
    """Читает глобальные настройки приложения из app_state.json с отказоустойчивостью."""
    global APP_SETTINGS
    
    default_settings = {
        'current_vault': DEFAULT_VAULT_NAME,
        'language': 'ru',
        'theme_base': 'dark',
        'theme_accent': 'red', 
        'current_style': 'frosted-glass', 
        'notes_root_path': None, 
        'theme_text': 'default',
        'sound_enabled': True,
        'view_mode': 'grid',
        'collection_view_mode': 'grid', 
        'custom_accent': '#FFD700',  
        'custom_text': '#FFD700',    
        'color_overrides': {},
        'fg_hue': 230,           
        'fg_lightness': 60       
    }

    if not os.path.exists(STATE_FILE):
        APP_SETTINGS = default_settings.copy()
        with open(STATE_FILE, 'w', encoding='utf-8') as f:
            json.dump(APP_SETTINGS, f, indent=4)
        return APP_SETTINGS

    try:
        with open(STATE_FILE, 'r', encoding='utf-8') as f:
            loaded_settings = json.load(f)
            # Защита от поврежденного (пустого или не-словаря) JSON
            if not isinstance(loaded_settings, dict):
                raise ValueError("app_state.json is not a dictionary")
            APP_SETTINGS = loaded_settings
    except Exception:
        backup_file = STATE_FILE + '.bak'
        if os.path.exists(backup_file):
            try:
                shutil.copy(backup_file, STATE_FILE)
                with open(STATE_FILE, 'r', encoding='utf-8') as f:
                    loaded_settings = json.load(f)
                    if not isinstance(loaded_settings, dict):
                        raise ValueError("app_state.json.bak is not a dictionary")
                    APP_SETTINGS = loaded_settings
            except Exception:
                APP_SETTINGS = default_settings.copy()
                with open(STATE_FILE, 'w', encoding='utf-8') as f:
                    json.dump(APP_SETTINGS, f, indent=4)
        else:
            APP_SETTINGS = default_settings.copy()
            with open(STATE_FILE, 'w', encoding='utf-8') as f:
                json.dump(APP_SETTINGS, f, indent=4)

    # Железная гарантия: если в файле нет новых ключей (fg_hue), они добавляются
    needs_save = False
    for key, value in default_settings.items():
        if key not in APP_SETTINGS:
            APP_SETTINGS[key] = value
            needs_save = True
            
    # Если мы обновили файл старой версии новыми ключами - сохраняем его на диск
    if needs_save:
        try:
            with open(STATE_FILE, 'w', encoding='utf-8') as f:
                json.dump(APP_SETTINGS, f, indent=4)
        except Exception:
            pass # Игнорируем ошибку записи при старте, чтобы не ронять приложение
            
    return APP_SETTINGS


def save_app_settings(new_settings):
    """Выполняет атомарную и безопасную запись глобальных настроек."""
    global APP_SETTINGS
    # --- ИЗМЕНЕНИЕ: УБРАН РЕКУРСИВНЫЙ ВЫЗОВ ---
    # Мы предполагаем, что APP_SETTINGS уже загружен при старте
    if not APP_SETTINGS:
        get_app_settings()

    APP_SETTINGS.update(new_settings)

    temp_file = STATE_FILE + '.tmp'
    backup_file = STATE_FILE + '.bak'
    
    if os.path.exists(STATE_FILE):
        shutil.copy(STATE_FILE, backup_file)
        
    with open(temp_file, 'w', encoding='utf-8') as f:
        json.dump(APP_SETTINGS, f, indent=4)
        
    os.replace(temp_file, STATE_FILE)
    
    global CURRENT_VAULT_PATH
    CURRENT_VAULT_PATH = os.path.join(NOTES_APP_DIR, APP_SETTINGS.get('current_vault', DEFAULT_VAULT_NAME))

# --- 👇 ЗАМЕНИТЕ ВСЮ ЭТУ ФУНКЦИЮ ---
def get_current_vault_path():
    """Определяет и возвращает путь к текущему активному хранилищу, учитывая кастомный путь."""
    global CURRENT_VAULT_PATH, NOTES_APP_DIR # Добавляем NOTES_APP_DIR в глобальные
    
    settings = get_app_settings()
    
# --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    # --- НОВАЯ ЛОГИКА ---
    # 1. Проверяем, есть ли в настройках кастомный путь, заданный пользователем
    custom_root = settings.get('notes_root_path')
    if custom_root and os.path.isdir(custom_root):
        NOTES_APP_DIR = custom_root
    else:
        # Иначе, используем динамический путь (ROOT_DIR если есть права, иначе AppData)
        NOTES_APP_DIR = os.path.join(APP_DATA_DIR, 'Notes')
    # --- КОНЕЦ НОВОЙ ЛОГИКИ ---
# --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---



    vault_name = settings.get('current_vault', DEFAULT_VAULT_NAME)
    CURRENT_VAULT_PATH = os.path.join(NOTES_APP_DIR, vault_name)
    return CURRENT_VAULT_PATH
# --- 👆 КОНЕЦ ЗАМЕНЫ ---

def setup_vault(vault_path):
    """Создает необходимую структуру папок и файлов для хранилища, если их нет."""
    notes_dir = os.path.join(vault_path, 'notes')
    metadata_file = os.path.join(vault_path, 'notes.json')
    os.makedirs(notes_dir, exist_ok=True)
    if not os.path.exists(metadata_file):
        initial_data = {
            "notes": {}, 
            "collections": {}, 
            "collection_notes": {},
            "show_tutorial": False  # <-- ОТКЛЮЧИЛИ АВТОСТАРТ ТУТОРИАЛА ПО УМОЛЧАНИЮ
        }
        with open(metadata_file, 'w', encoding='utf-8') as f:
            json.dump(initial_data, f, indent=4)
            
    # Запускаем миграцию форматов при каждом открытии хранилища
    migrate_txt_to_md(vault_path)

def migrate_txt_to_md(vault_path):
    """Мигрирует старые текстовые файлы (.txt) в новый формат Markdown (.md)."""
    notes_dir = os.path.join(vault_path, 'notes')
    if not os.path.exists(notes_dir): return
    
    try:
        for filename in os.listdir(notes_dir):
            if filename.endswith('.txt'):
                old_file = os.path.join(notes_dir, filename)
                new_file = os.path.join(notes_dir, filename.replace('.txt', '.md'))
                # Если каким-то чудом .md уже существует, не трогаем
                if not os.path.exists(new_file):
                    os.rename(old_file, new_file)
    except Exception as e:
        print(f"Migration error: {e}")

def read_metadata():

    """Читает файл метаданных notes.json из текущего хранилища с отказоустойчивостью."""
    metadata_file = os.path.join(CURRENT_VAULT_PATH, 'notes.json')
    initial_data = {"notes": {}, "collections": {}, "collection_notes": {}}

    if not os.path.exists(metadata_file):
        setup_vault(CURRENT_VAULT_PATH) # Создаст пустой файл
    
    try:
        with open(metadata_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        backup_file = metadata_file + '.bak'
        if os.path.exists(backup_file):
            try:
                shutil.copy(backup_file, metadata_file)
                with open(metadata_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except (json.JSONDecodeError, IOError):
                # Бэкап тоже поврежден, создаем пустой
                with open(metadata_file, 'w', encoding='utf-8') as f:
                    json.dump(initial_data, f, indent=4)
                return initial_data
        else:
            # Бэкапа нет, создаем пустой
            with open(metadata_file, 'w', encoding='utf-8') as f:
                json.dump(initial_data, f, indent=4)
            return initial_data


# --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
def write_metadata(data):
    """Выполняет атомарную запись метаданных для предотвращения повреждения."""
    metadata_file = os.path.join(CURRENT_VAULT_PATH, 'notes.json')
    temp_file = metadata_file + '.tmp'
    backup_file = metadata_file + '.bak'
    try:
        if os.path.exists(metadata_file):
            shutil.copy(metadata_file, backup_file)
        with open(temp_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        os.replace(temp_file, metadata_file)
        
        # Планируем фоновую авто-синхронизацию после успешного сохранения на диск
        schedule_auto_sync()
        
    except Exception as e:
        # Логируем ошибку в консоль, скрывая полный путь (защита приватности)
        error_type = type(e).__name__

        print(f"CRITICAL WRITE ERROR: {error_type} occurred during file save.")
        raise e

# --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---


# --- Функции, доступные из JavaScript ---

@eel.expose
def get_initial_data():
    """Возвращает метаданные и КОРОТКИЕ ФРАГМЕНТЫ контента для предпросмотра."""
    get_current_vault_path()
    setup_vault(CURRENT_VAULT_PATH)
    metadata = read_metadata()
    content_previews = {}
    notes_path = os.path.join(CURRENT_VAULT_PATH, 'notes')
    for note_id in metadata.get('notes', {}):
        # ИСПРАВЛЕНИЕ: Сначала ищем новый .md формат
        note_file_md = os.path.join(notes_path, f"{note_id}.md")
        note_file_txt = os.path.join(notes_path, f"{note_id}.txt")
        
        target_file = note_file_md if os.path.exists(note_file_md) else note_file_txt
        
        if os.path.exists(target_file):
            try:
                with open(target_file, 'r', encoding='utf-8') as f:
                    # УВЕЛИЧЕНО до 400 символов, чтобы текста хватало на 4+ строчки
                    preview_text = f.read(400).replace('\n', ' ')
                    content_previews[note_id] = preview_text
            except Exception:
                content_previews[note_id] = ""
        else:
            content_previews[note_id] = ""

            
    # Запускаем фоновую проверку облака (Sync) через 2 секунды после инициализации
    import threading
    
    # ЖЕЛЕЗНАЯ ЗАЩИТА: Гарантируем, что settings всегда словарь
    settings = get_app_settings()
    if not isinstance(settings, dict):
        settings = {}
        
    vault_name = settings.get('current_vault', DEFAULT_VAULT_NAME)
    threading.Timer(2.0, sync_engine.trigger_background_sync, args=[APP_DATA_DIR, CURRENT_VAULT_PATH, vault_name]).start()
    
    return {
        'metadata': metadata,
        'vaults': get_vaults(),
        'settings': settings,
        'content_previews': content_previews
    }



@eel.expose
@safe_eel
def get_note_content(note_id):
    """Возвращает содержимое только ОДНОЙ запрошенной заметки."""
    note_id = os.path.basename(str(note_id)) # ЗАЩИТА ОТ LFI
    
    # Сначала ищем новый .md файл
    note_file_md = os.path.join(CURRENT_VAULT_PATH, 'notes', f"{note_id}.md")
    if os.path.exists(note_file_md):
        with open(note_file_md, 'r', encoding='utf-8') as f:
            return f.read()
            
    # Fallback: если миграция еще не прошла, читаем старый .txt
    note_file_txt = os.path.join(CURRENT_VAULT_PATH, 'notes', f"{note_id}.txt")
    if os.path.exists(note_file_txt):
        with open(note_file_txt, 'r', encoding='utf-8') as f:
            return f.read()
            
    return ""




@eel.expose
def save_settings(settings):
    """Сохраняет переданные настройки в app_state.json."""
    save_app_settings(settings)
    return {'success': True}

@eel.expose
@metadata_lock
def create_note(title, content, tags="", description=""):
    """Создает новую заметку и возвращает только ее метаданные."""
    note_id = str(uuid.uuid4())
    notes_path = os.path.join(CURRENT_VAULT_PATH, 'notes')
    note_file_path = os.path.join(notes_path, f"{note_id}.md")
    with open(note_file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    metadata = read_metadata()
# --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    metadata['notes'][note_id] = {
        'title': title,
        'created_at': datetime.now().isoformat(),
        'modified_at': datetime.now().isoformat(),
        'tags': tags,
        'description': description
    }
    try:
        write_metadata(metadata)
        return {'id': note_id, 'data': metadata['notes'][note_id]}
    except Exception as e:
        return {'success': False, 'message': f'File system write error: {str(e)}'}
# --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---


@eel.expose
@metadata_lock
def update_note(note_id, new_title, new_content, new_tags="", new_description=""):

    """Обновляет заметку и возвращает обновленные метаданные."""
    note_id = os.path.basename(str(note_id)) # ЗАЩИТА ОТ LFI
    metadata = read_metadata()
    if note_id in metadata['notes']:
        metadata['notes'][note_id]['title'] = new_title
        metadata['notes'][note_id]['tags'] = new_tags
        metadata['notes'][note_id]['description'] = new_description
        metadata['notes'][note_id]['modified_at'] = datetime.now().isoformat()
        note_file = os.path.join(CURRENT_VAULT_PATH, 'notes', f"{note_id}.md")
        with open(note_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        write_metadata(metadata)

        return {'id': note_id, 'data': metadata['notes'][note_id]}
    return None


@eel.expose
@metadata_lock
def delete_note(note_id):

    """Удаляет заметку и возвращает ID удаленной заметки."""
    note_id = os.path.basename(str(note_id)) # ЗАЩИТА ОТ LFI
    metadata = read_metadata()
    if note_id in metadata['notes']:
        del metadata['notes'][note_id]
    for coll_id in metadata.get('collection_notes', {}):
        if note_id in metadata['collection_notes'][coll_id]:
            metadata['collection_notes'][coll_id].remove(note_id)
    write_metadata(metadata)
    note_file = os.path.join(CURRENT_VAULT_PATH, 'notes', f"{note_id}.md")
    if os.path.exists(note_file):
        os.remove(note_file)
    return {'success': True, 'deleted_id': note_id}



# --- 👇 НОВЫЙ БЛОК ---
@eel.expose
@metadata_lock
def delete_notes_batch(note_ids):

    """Удаляет несколько заметок за один раз."""
    metadata = read_metadata()
    deleted_ids = []
    
    for raw_note_id in note_ids:
        note_id = os.path.basename(str(raw_note_id)) # ЗАЩИТА ОТ LFI
        if note_id in metadata['notes']:
            del metadata['notes'][note_id]
            deleted_ids.append(note_id)
            
            # Удаляем заметку из всех коллекций
            for coll_id in metadata.get('collection_notes', {}):
                if note_id in metadata['collection_notes'][coll_id]:
                    metadata['collection_notes'][coll_id].remove(note_id)
            
            # Удаляем физический файл (безопасно)
            note_file = os.path.join(CURRENT_VAULT_PATH, 'notes', f"{note_id}.md")
            try:
                if os.path.exists(note_file):
                    os.remove(note_file)
            except OSError:

                pass # Игнорируем ошибку удаления конкретного файла, продолжаем пакетную работу

    if deleted_ids:

        write_metadata(metadata)
        
    return {'success': True, 'deleted_ids': deleted_ids}

# --- 👆 КОНЕЦ НОВОГО БЛОКА ---

# --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
@eel.expose
@metadata_lock
def create_collection(name, icon_key='folder', color=None, parent_id=None):

    """Создает новую коллекцию или подколлекцию."""
    coll_id = 'coll_' + str(uuid.uuid4())
    metadata = read_metadata()
    
    metadata.setdefault('collections', {})[coll_id] = {
        'name': name, 
        'icon': icon_key,
        'color': color, # ИСПРАВЛЕНИЕ 2: Обязательно сохраняем цвет при создании!
        'parentId': parent_id
    }
    metadata.setdefault('collection_notes', {})[coll_id] = []
    
    write_metadata(metadata)
    return {'id': coll_id, 'data': metadata['collections'][coll_id]}


@eel.expose
@metadata_lock
def update_collection(coll_id, new_name, new_icon, new_color):

    """Обновляет имя, иконку и цвет коллекции."""
    metadata = read_metadata()
    if coll_id in metadata.get('collections', {}):
        metadata['collections'][coll_id]['name'] = new_name
        metadata['collections'][coll_id]['icon'] = new_icon
        metadata['collections'][coll_id]['color'] = new_color # <-- НОВОЕ ПОЛЕ
        write_metadata(metadata)
        return {'id': coll_id, 'data': metadata['collections'][coll_id]}
    return None



@eel.expose
@metadata_lock
def delete_collection(coll_id):

    """Удаляет коллекцию и ВСЕ ее подколлекции."""
    metadata = read_metadata()
    deleted_ids = []

    if coll_id in metadata.get('collections', {}):
        # Ищем все подколлекции этого родителя
        children = [k for k, v in metadata['collections'].items() if v.get('parentId') == coll_id]
        
        # Удаляем родителя и всех детей
        ids_to_delete = [coll_id] + children
        
        for id_to_del in ids_to_delete:
            if id_to_del in metadata['collections']:
                del metadata['collections'][id_to_del]
                deleted_ids.append(id_to_del)
            if id_to_del in metadata.get('collection_notes', {}):
                del metadata['collection_notes'][id_to_del]
                
        write_metadata(metadata)
        return {'success': True, 'deleted_ids': deleted_ids}
        
    return {'success': False}
# --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

# --- 👇 Добавьте новую функцию после delete_collection ---
@eel.expose
@metadata_lock
def mark_tutorial_as_seen():

    """Убирает флаг show_tutorial из notes.json."""
    metadata = read_metadata()
    if "show_tutorial" in metadata:
        metadata["show_tutorial"] = False
        write_metadata(metadata)
    return {'success': True}
# --- 👆 КОНЕЦ НОВОГО БЛОКА ---

@eel.expose
@metadata_lock
def add_note_to_collection(note_id, collection_id):
    metadata = read_metadata()
    notes_in_coll = metadata.setdefault('collection_notes', {}).setdefault(collection_id, [])
    if note_id not in notes_in_coll:
        notes_in_coll.insert(0, note_id) # Добавляем в самое начало списка
        write_metadata(metadata)
        return {'success': True, 'note_id': note_id, 'collection_id': collection_id}
    return {'success': False, 'errorCode': 'err_note_in_collection'}


# --- 👇 НОВЫЙ БЛОК ---
@eel.expose
@metadata_lock
def add_notes_to_collection_batch(note_ids, collection_id):
    """Добавляет несколько заметок в одну коллекцию."""
    metadata = read_metadata()
    if collection_id not in metadata.setdefault('collection_notes', {}):
        metadata['collection_notes'][collection_id] = []
        
    notes_in_coll = metadata['collection_notes'][collection_id]
    
    # Отбираем только новые заметки и ставим их ПЕРЕД старыми
    new_notes = [nid for nid in note_ids if nid not in notes_in_coll]
    if new_notes:
        metadata['collection_notes'][collection_id] = new_notes + notes_in_coll
        write_metadata(metadata)
        
    return {'success': True, 'added_count': len(new_notes), 'collection_id': collection_id}

# --- 👆 КОНЕЦ НОВОГО БЛОКА ---

@eel.expose
@metadata_lock
def remove_note_from_collection(note_id, collection_id):

    metadata = read_metadata()
    if collection_id in metadata.get('collection_notes', {}) and note_id in metadata['collection_notes'][collection_id]:
        metadata['collection_notes'][collection_id].remove(note_id)
        write_metadata(metadata)
        return {'success': True, 'note_id': note_id, 'collection_id': collection_id}
    return {'success': False}

@eel.expose
@metadata_lock
def save_collections_order(collections_list):

    """Принимает отсортированный список ID коллекций и сохраняет новый порядок."""
    metadata = read_metadata()
    ordered_collections = {coll_id: metadata['collections'][coll_id] for coll_id in collections_list if coll_id in metadata['collections']}
    for coll_id, data in metadata['collections'].items():
        if coll_id not in ordered_collections:
            ordered_collections[coll_id] = data
    metadata['collections'] = ordered_collections
    write_metadata(metadata)
    return {'success': True}


# --- 👇 НОВЫЙ БЛОК: СМЕНА УРОВНЯ ВЛОЖЕННОСТИ ---
@eel.expose
@metadata_lock
def update_collection_parent(coll_id, parent_id):

    """Обновляет принадлежность папки (делает её главной или подпапкой)"""
    metadata = read_metadata()
    if coll_id in metadata.get('collections', {}):
        metadata['collections'][coll_id]['parentId'] = parent_id
        write_metadata(metadata)
        return {'success': True}
    return {'success': False}
# --- 👆 КОНЕЦ НОВОГО БЛОКА ---


@eel.expose
@metadata_lock
def save_note_order_in_collection(collection_id, note_ids_list):

    """Сохраняет новый порядок заметок внутри указанной коллекции."""
    metadata = read_metadata()
    if collection_id in metadata.get('collection_notes', {}):
        # Просто заменяем старый массив отсортированным списком с фронтенда
        metadata['collection_notes'][collection_id] = note_ids_list
        write_metadata(metadata)
        return {'success': True}
    return {'success': False, 'errorCode': 'err_collection_not_found'}

@eel.expose
def get_vaults():
    """Возвращает список всех доступных хранилищ."""
    if not os.path.exists(NOTES_APP_DIR):
        os.makedirs(NOTES_APP_DIR)
    return [d for d in os.listdir(NOTES_APP_DIR) if os.path.isdir(os.path.join(NOTES_APP_DIR, d))]

@eel.expose
def switch_vault(vault_name):
    """Переключается на другое хранилище и перезагружает приложение."""
    vault_name = sanitize_vault_name(vault_name)
    if not vault_name:
        return
    save_app_settings({'current_vault': vault_name})
    eel.reload_app()()


@eel.expose
def create_vault(vault_name):
    """Создает новое пустое хранилище."""
    vault_name = sanitize_vault_name(vault_name)
    if not vault_name:
        return {'success': False, 'errorCode': 'err_vault_name_empty'}
    new_vault_path = os.path.join(NOTES_APP_DIR, vault_name)

    if not os.path.exists(new_vault_path):

        setup_vault(new_vault_path)
        switch_vault(vault_name)
        return {'success': True}
    return {'success': False, 'errorCode': 'err_vault_exists'}

@eel.expose
def rename_vault(old_name, new_name):
    """Переименовывает хранилище."""
    old_name = sanitize_vault_name(old_name) # ЗАЩИТА ОТ LFI
    new_name = sanitize_vault_name(new_name)
    if not old_name or not new_name:
        return {'success': False, 'errorCode': 'err_vault_name_empty'}
    old_path = os.path.join(NOTES_APP_DIR, old_name)
    new_path = os.path.join(NOTES_APP_DIR, new_name)
    if not os.path.exists(old_path):
        return {'success': False, 'errorCode': 'err_vault_not_found', 'errorArg': old_name}

    if os.path.exists(new_path):
        return {'success': False, 'errorCode': 'err_vault_name_taken', 'errorArg': new_name}
    try:

        os.rename(old_path, new_path)
        settings = get_app_settings()
        if settings.get('current_vault') == old_name:
            save_app_settings({'current_vault': new_name})
        return {'success': True}
    except OSError as e:
        return {'success': False, 'errorCode': 'err_rename_failed', 'errorArg': str(e)}
    

@eel.expose
def delete_vault(vault_name):
    """Удаляет хранилище."""
    vault_name = sanitize_vault_name(vault_name)
    if not vault_name:
        return {'success': False, 'message': 'Invalid vault name.'}
        
    all_vaults = get_vaults()
    if len(all_vaults) <= 1:
        return {'success': False, 'message': 'Cannot delete the last remaining vault.'}
    vault_path = os.path.join(NOTES_APP_DIR, vault_name)

    if not os.path.exists(vault_path):
        return {'success': False, 'message': 'Vault to delete was not found.'}
    try:
        shutil.rmtree(vault_path)
        remaining_vaults = get_vaults()
        next_vault = DEFAULT_VAULT_NAME if DEFAULT_VAULT_NAME in remaining_vaults else remaining_vaults[0]
        save_app_settings({'current_vault': next_vault})
        return {'success': True}
    except OSError as e:
        return {'success': False, 'errorCode': 'err_delete_failed', 'errorArg': str(e)}

# --- 👇 ИЗМЕНЕННЫЙ БЛОК ---

@eel.expose
def backup_current_vault():
    """Экспортирует текущее хранилище в zip-архив."""
    try:
        root = Tk()
        root.withdraw()
        root.attributes('-topmost', True)

        # 1. Генерируем имя файла по умолчанию
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        default_filename = f"export_{CURRENT_VAULT_PATH.split(os.sep)[-1]}_{timestamp}.zip"

        # 2. Используем asksaveasfilename
        archive_path_with_ext = filedialog.asksaveasfilename(
            title="Export vault as...", # <--- ИЗМЕНЕНО
            initialfile=default_filename,
            defaultextension=".zip",
            filetypes=[("Zip archives", "*.zip")]
        )
        
        if not archive_path_with_ext:
            return {'success': False, 'errorCode': 'err_export_cancelled'}

        # 3. Готовим путь для shutil.make_archive
        archive_path_base = os.path.splitext(archive_path_with_ext)[0]

        
        shutil.make_archive(archive_path_base, 'zip', CURRENT_VAULT_PATH)
        
        return {'success': True, 'path': archive_path_with_ext}
        
    except Exception as e:
        return {'success': False, 'message': str(e)}
# --- 👆 КОНЕЦ ИЗМЕНЕНИЙ ---

@eel.expose
def check_import_for_conflict():
    """Открывает диалог выбора файла и проверяет имя на конфликт."""
    try:
        root = Tk()
        root.withdraw()
        root.attributes('-topmost', True)
        archive_path = filedialog.askopenfilename(
            title="Select a vault archive to import",
            filetypes=[("Zip archives", "*.zip")]
        )
        if not archive_path:
            return {'success': False, 'errorCode': 'err_import_cancelled'}

        base_name = os.path.basename(archive_path).replace('.zip', '')

        if '_backup_' in base_name: base_name = base_name.split('_backup_')[0]
        elif '_export_' in base_name: base_name = base_name.split('_export_')[0]
        elif '_' in base_name and len(base_name.rsplit('_', 1)[-1]) > 5:
             base_name = base_name.rsplit('_', 1)[0]
        
        is_conflict = base_name in get_vaults()
        
        return {
            'success': True,
            'is_conflict': is_conflict,
            'original_name': base_name,
            'archive_path': archive_path
        }
    except Exception as e:
        return {'success': False, 'message': str(e)}
    
@eel.expose
def perform_import(archive_path, new_vault_name):
    """Выполняет фактический импорт с предоставленным именем."""
    new_vault_name = sanitize_vault_name(new_vault_name)
    if not new_vault_name:
        return {'success': False, 'message': 'Vault name cannot be empty.'}
    if new_vault_name in get_vaults():
        return {'success': False, 'message': f'A vault named "{new_vault_name}" already exists.'}
        
    try:
        import zipfile
        new_vault_path = os.path.join(NOTES_APP_DIR, new_vault_name)
        target_dir = os.path.abspath(new_vault_path)
        
        # Лимиты защиты от Zip Bomb (500 MB и 50,000 файлов)
        MAX_EXTRACT_SIZE = 500 * 1024 * 1024
        MAX_FILES = 50000
        
        with zipfile.ZipFile(archive_path, 'r') as zf:
            total_size = 0
            file_count = 0
            
            # Комплексная защита от Zip Bomb и Zip Slip
            for zip_info in zf.infolist():
                file_count += 1
                total_size += zip_info.file_size
                
                if file_count > MAX_FILES:
                    raise Exception("Security Warning: Archive contains too many files (Zip Bomb protection).")
                if total_size > MAX_EXTRACT_SIZE:
                    raise Exception("Security Warning: Archive is too large when uncompressed (Zip Bomb protection).")
                    
                extracted_path = os.path.abspath(os.path.join(target_dir, zip_info.filename))
                if os.path.commonpath([target_dir, extracted_path]) != target_dir:
                    raise Exception("Security Warning: Zip Slip vulnerability detected in archive.")
                    
            zf.extractall(target_dir)
            
        switch_vault(new_vault_name)
        return {'success': True}
    except Exception as e:
        return {'success': False, 'message': str(e)}


    
# --- 👇 НОВЫЙ БЛОК ---
@eel.expose
@metadata_lock
def move_notes_to_vault(note_ids, target_vault_name):
    """Перемещает заметки из текущего хранилища в другое."""
    if not note_ids or not target_vault_name:
        return {'success': False, 'errorCode': 'err_missing_args'}

    target_vault_name = sanitize_vault_name(target_vault_name)
    if not target_vault_name:
        return {'success': False, 'errorCode': 'err_target_vault_not_found', 'errorArg': 'Invalid vault name'}

    target_vault_path = os.path.join(NOTES_APP_DIR, target_vault_name)
    if not os.path.exists(target_vault_path):
        return {'success': False, 'errorCode': 'err_target_vault_not_found', 'errorArg': target_vault_name}

    # Убедимся, что целевое хранилище готово к работе


    setup_vault(target_vault_path)
    
    # Загружаем метаданные обоих хранилищ
    source_metadata = read_metadata()
    with open(os.path.join(target_vault_path, 'notes.json'), 'r', encoding='utf-8') as f:
        target_metadata = json.load(f)

    moved_count = 0
    for raw_note_id in note_ids:
        note_id = os.path.basename(str(raw_note_id)) # ЗАЩИТА ОТ LFI
        if note_id in source_metadata['notes']:
            # 1. Копируем метаданные
            target_metadata['notes'][note_id] = source_metadata['notes'][note_id]
            
            # 2. Копируем физический файл
            source_file = os.path.join(CURRENT_VAULT_PATH, 'notes', f"{note_id}.md")
            target_file = os.path.join(target_vault_path, 'notes', f"{note_id}.md")
            if os.path.exists(source_file):
                shutil.copy(source_file, target_file)

            
            # 3. Удаляем из исходного хранилища
            del source_metadata['notes'][note_id]
            for coll_id in source_metadata.get('collection_notes', {}):
                if note_id in source_metadata['collection_notes'][coll_id]:
                    source_metadata['collection_notes'][coll_id].remove(note_id)
            if os.path.exists(source_file):
                os.remove(source_file)

            moved_count += 1
            
    if moved_count > 0:

        # Сохраняем изменения в обоих хранилищах
        write_metadata(source_metadata)
        with open(os.path.join(target_vault_path, 'notes.json'), 'w', encoding='utf-8') as f:
            json.dump(target_metadata, f, indent=4, ensure_ascii=False)
            
    return {'success': True, 'moved_count': moved_count}
# --- 👆 КОНЕЦ НОВОГО БЛОКА ---

# --- 👇 НОВЫЙ БЛОК ---
@eel.expose
@metadata_lock
def copy_notes_to_vault(note_ids, target_vault_name):
    """Копирует заметки из текущего хранилища в другое."""
    if not note_ids or not target_vault_name:
        return {'success': False, 'errorCode': 'err_missing_args'}

    target_vault_name = sanitize_vault_name(target_vault_name)
    if not target_vault_name:
        return {'success': False, 'errorCode': 'err_target_vault_not_found', 'errorArg': 'Invalid vault name'}

    target_vault_path = os.path.join(NOTES_APP_DIR, target_vault_name)
    if not os.path.exists(target_vault_path):
        return {'success': False, 'errorCode': 'err_target_vault_not_found', 'errorArg': target_vault_name}

    setup_vault(target_vault_path)


    
    source_metadata = read_metadata()
    with open(os.path.join(target_vault_path, 'notes.json'), 'r', encoding='utf-8') as f:
        target_metadata = json.load(f)

    copied_count = 0
    for raw_note_id in note_ids:
        note_id = os.path.basename(str(raw_note_id)) # ЗАЩИТА ОТ LFI
        if note_id in source_metadata['notes'] and note_id not in target_metadata['notes']:
            # 1. Копируем метаданные
            target_metadata['notes'][note_id] = source_metadata['notes'][note_id]
            
            # 2. Копируем физический файл
            source_file = os.path.join(CURRENT_VAULT_PATH, 'notes', f"{note_id}.md")
            target_file = os.path.join(target_vault_path, 'notes', f"{note_id}.md")
            if os.path.exists(source_file):
                shutil.copy(source_file, target_file)


            copied_count += 1
            
    if copied_count > 0:

        # Сохраняем изменения ТОЛЬКО в целевом хранилище
        with open(os.path.join(target_vault_path, 'notes.json'), 'w', encoding='utf-8') as f:
            json.dump(target_metadata, f, indent=4, ensure_ascii=False)
            
    return {'success': True, 'copied_count': copied_count}
# --- 👆 КОНЕЦ НОВОГО БЛОКА ---

@eel.expose
@safe_eel
def get_all_note_previews():
    """Возвращает словарь с превью (первые 400 символов) для всех заметок."""
    metadata = read_metadata()
    previews = {}
    for note_id in metadata['notes']:
        # ИСПРАВЛЕНИЕ: Сначала ищем .md файлы, а если их нет (еще не мигрировали) — .txt
        note_file_md = os.path.join(CURRENT_VAULT_PATH, 'notes', f"{note_id}.md")
        note_file_txt = os.path.join(CURRENT_VAULT_PATH, 'notes', f"{note_id}.txt")
        
        if os.path.exists(note_file_md):
            with open(note_file_md, 'r', encoding='utf-8') as f:
                content = f.read(400)
                previews[note_id] = content.replace('\n', ' ')
        elif os.path.exists(note_file_txt):
            with open(note_file_txt, 'r', encoding='utf-8') as f:
                content = f.read(400)
                previews[note_id] = content.replace('\n', ' ')
        else:
            previews[note_id] = ""
    return previews


@eel.expose
def pick_notes_directory():
    """Открывает диалог выбора новой корневой папки без применения настроек."""
    try:
        root = Tk()
        root.withdraw()
        root.attributes('-topmost', True)
        
        new_path = filedialog.askdirectory(title="Select a new root directory for notes")
        if not new_path:
            return {'success': False, 'errorCode': 'err_dir_cancelled'}
            
        return {'success': True, 'path': new_path}
    except Exception as e:
        return {'success': False, 'message': str(e)}

@eel.expose
@metadata_lock
def apply_notes_directory(new_path, move_data):
    """Применяет новую папку и опционально копирует туда текущие данные."""
    try:
        global NOTES_APP_DIR
        target_path = os.path.abspath(new_path)
        current_path = os.path.abspath(NOTES_APP_DIR)
        
        # Если выбрали ту же самую папку - ничего не делаем
        if target_path == current_path:
            return {'success': True}
            
        if move_data:
            # Защита: нельзя скопировать папку саму в себя (рекурсия)
            if os.path.commonpath([current_path, target_path]) == current_path:
                return {'success': False, 'message': "Cannot copy data into a subfolder of the current directory. Please choose another location."}
                
            import shutil
            # Полностью копируем текущие хранилища со всеми заметками в новую локацию
            shutil.copytree(current_path, target_path, dirs_exist_ok=True)
            
        save_app_settings({'notes_root_path': target_path})
        eel.reload_app()() 
        return {'success': True}
    except Exception as e:
        return {'success': False, 'message': str(e)}



# --- 👇 НОВЫЙ БЛОК: ФУНКЦИИ CLOUD SYNC ---
@eel.expose
@safe_eel
def get_sync_credentials():
    """Отдает сохраненные настройки синхронизации на фронтенд."""
    creds = cloud_sync.load_credentials(APP_DATA_DIR)
    if creds:
        # Отдаем ключи S3, но E2E пароль не возвращаем (только флаг наличия)
        return {
            'endpoint': creds.get('endpoint', ''),
            'bucket': creds.get('bucket', ''),
            'access_key': creds.get('access_key', ''),
            'secret_key': creds.get('secret_key', ''), # <-- ТЕПЕРЬ ОТДАЕМ SECRET KEY
            'has_password': bool(creds.get('user_password'))
        }
    return None


@eel.expose
@safe_eel
def save_sync_credentials(endpoint, bucket, access_key, secret_key, user_password):
    """Принимает ключи от пользователя и сохраняет их в зашифрованный бинарник."""
    old_creds = cloud_sync.load_credentials(APP_DATA_DIR) or {}
    
    final_secret = secret_key if secret_key else old_creds.get('secret_key', '')
    
    # Пароль теперь может быть пустой строкой, если пользователь передал пустоту
    final_pass = user_password
    
    if not final_secret:
        return {'success': False, 'message': 'Secret Key is required.'}
        
    cloud_sync.save_credentials(APP_DATA_DIR, endpoint, bucket, access_key, final_secret, final_pass)
    return {'success': True}


@eel.expose
@safe_eel
def disable_cloud_sync():
    """Полностью удаляет ключи с устройства."""
    cloud_sync.disable_sync(APP_DATA_DIR)
    return {'success': True}

@eel.expose
@safe_eel
def test_cloud_connection():
    """Пингует облако S3 для проверки ключей, вызывается из JS."""
    return cloud_sync.test_s3_connection(APP_DATA_DIR)

@eel.expose
@safe_eel
def trigger_manual_sync():
    """Запускается из JS, когда пользователь кликает по кнопке или принудительно."""
    settings = get_app_settings()
    vault_name = settings.get('current_vault', DEFAULT_VAULT_NAME)
    sync_engine.trigger_background_sync(APP_DATA_DIR, CURRENT_VAULT_PATH, vault_name)
    return {'success': True}

@eel.expose
@safe_eel
def fetch_remote_vaults():
    """Запрашивает у облака список доступных хранилищ."""
    return cloud_sync.get_remote_vaults(APP_DATA_DIR)

@eel.expose
def resolve_sync_conflict(decision):
    """Передает ответ пользователя в ожидающий поток синхронизации."""
    sync_engine.resolve_conflict_from_ui(decision)

@eel.expose
@safe_eel
def download_vault_from_cloud(target_vault_name, target_ext=None):
    """Создает локальную папку для облачного хранилища и принудительно скачивает в нее данные."""
    target_vault_name = sanitize_vault_name(target_vault_name)
    if not target_vault_name:
        return {'success': False, 'message': 'Invalid vault name.'}
        
    new_vault_path = os.path.join(NOTES_APP_DIR, target_vault_name)
    if not os.path.exists(new_vault_path):
        setup_vault(new_vault_path)
    
    # Переключаемся на него локально
    save_app_settings({'current_vault': target_vault_name})

    
    # ПРИНУДИТЕЛЬНО запускаем синхронизацию в режиме Force Download
    engine = sync_engine.SyncEngine(APP_DATA_DIR, new_vault_path, target_vault_name)
    
    # Передаем конкретное расширение, если пользователь кликнул по нему в меню
    engine.run_sync(force_download=True, force_ext=target_ext)
    
    return {'success': True}

# --- 👆 КОНЕЦ НОВОГО БЛОКА ---


# --- Вспомогательные функции ---




# --- 👇 ВСТАВИТЬ ПЕРЕД if __name__ == '__main__': ---
@eel.expose
def get_app_paths():
    """Возвращает словарик со всеми ключевыми путями приложения для окна About."""
    import sys
    
    # 1. Путь установки (где лежит сам .exe)
    if getattr(sys, 'frozen', False):
        install_dir = os.path.dirname(sys.executable)
    else:
        install_dir = ROOT_DIR
        
    return {
        'install_dir': install_dir,
        'app_data_dir': APP_DATA_DIR,
        'notes_dir': NOTES_APP_DIR
    }

@eel.expose
def open_folder_in_explorer(path_to_open):
    """Открывает системный проводник по указанному пути (только разрешенные папки)."""
    import os
    import sys
    import subprocess
    
    # 1. Защита от RCE: проверяем, что переданный путь — это именно директория, а не файл
    if not os.path.isdir(path_to_open):
        return
        
    # 2. Белый список: разрешаем открывать только 3 системные папки нашего приложения
    install_dir = os.path.dirname(sys.executable) if getattr(sys, 'frozen', False) else ROOT_DIR
    allowed_paths = [
        os.path.abspath(install_dir),
        os.path.abspath(APP_DATA_DIR),
        os.path.abspath(NOTES_APP_DIR)
    ]
    
    target_path = os.path.abspath(path_to_open)
    if target_path not in allowed_paths:
        return # Игнорируем попытки открыть произвольные системные папки
        
    if os.path.exists(target_path):
        if sys.platform == 'win32':
            os.startfile(target_path)
        elif sys.platform == 'darwin': # macOS
            subprocess.Popen(['open', target_path])
        else: # linux
            subprocess.Popen(['xdg-open', target_path])

# --- 👆 КОНЕЦ ВСТАВКИ ---


# --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
if __name__ == '__main__':
    def show_custom_fatal_error(error_message):
        """Отрисовывает кастомное окно ошибки с функцией копирования баг-репорта."""
        try:
            from tkinter import Tk, Label, Button, Frame
            
            root = Tk()
            try:
                root.overrideredirect(True)
            except:
                pass
                
            root.title("Fatal Error")
            root.attributes('-topmost', True) 
            
            window_width = 450
            window_height = 280
            screen_width = root.winfo_screenwidth()
            screen_height = root.winfo_screenheight()
            x_cordinate = int((screen_width/2) - (window_width/2))
            y_cordinate = int((screen_height/2) - (window_height/2))
            root.geometry(f"{window_width}x{window_height}+{x_cordinate}+{y_cordinate}")

            main_frame = Frame(root, bg='#1C1C20', highlightbackground='#FF453A', highlightthickness=2)
            main_frame.pack(expand=True, fill='both')

            lbl_title = Label(main_frame, text="Application Error", bg='#1C1C20', fg='#FF453A', font=("Segoe UI", 16, "bold"))
            lbl_title.pack(pady=(20, 10))

            lbl_msg = Label(main_frame, text=error_message, bg='#1C1C20', fg='#E0E0E0', font=("Segoe UI", 10), wraplength=400, justify="center")
            lbl_msg.pack(padx=20, pady=(0, 15), expand=True)

            def copy_to_clipboard():
                import platform
                report = f"### Bug Report - Prompt Manager (Backend)\n\n**Error Details:**\n```text\n{error_message}\n```\n\n**Environment Context:**\n- **OS:** {platform.system()} {platform.release()}\n- **Python:** {platform.python_version()}"
                
                root.clipboard_clear()
                root.clipboard_append(report)
                root.update() 
                
                btn_copy.config(text="COPIED!", bg="#2ea043", activebackground="#238636")
                root.after(2000, root.destroy)

            btn_frame = Frame(main_frame, bg='#1C1C20')
            btn_frame.pack(pady=(0, 20))

            btn_close = Button(btn_frame, text="CLOSE", bg='#333333', fg='white', font=("Segoe UI", 9, "bold"), 
                         relief='flat', activebackground='#444444', activeforeground='white',
                         command=root.destroy, padx=15, pady=5)
            btn_close.pack(side="left", padx=5)

            btn_copy = Button(btn_frame, text="COPY BUG REPORT", bg='#FF453A', fg='white', font=("Segoe UI", 9, "bold"), 
                         relief='flat', activebackground='#D32F2F', activeforeground='white',
                         command=copy_to_clipboard, padx=15, pady=5)
            btn_copy.pack(side="left", padx=5)

            root.focus_force()
            root.mainloop()
        except Exception as fallback_err:
            print(f"CRITICAL: {error_message}")
            print(f"GUI Error: {fallback_err}")

    # --- НОВЫЙ ГЛОБАЛЬНЫЙ ПЕРЕХВАТЧИК ОШИБОК PYTHON ---
    def global_exception_handler(exc_type, exc_value, exc_traceback):
        """Перехватывает ЛЮБУЮ необработанную ошибку во время работы приложения"""
        # Игнорируем штатные сигналы закрытия
        if issubclass(exc_type, KeyboardInterrupt) or issubclass(exc_type, SystemExit):
            sys.__excepthook__(exc_type, exc_value, exc_traceback)
            return

        # Извлекаем полный Traceback для отчета
        import traceback
        tb_lines = traceback.format_exception(exc_type, exc_value, exc_traceback)
        tb_text = "".join(tb_lines)
        
        # Скрываем реальный путь к папке пользователя для приватности
        if ROOT_DIR in tb_text:
            tb_text = tb_text.replace(ROOT_DIR, '[APP_DIR]')
            
        error_msg = f"An unexpected runtime error occurred:\n\n{exc_type.__name__}: {exc_value}\n\n(See Bug Report for full trace)"
        
        # Вызываем наше красивое окно
        show_custom_fatal_error(tb_text) # Передаем полный лог для кнопки копирования
        
        # Завершаем процесс после закрытия окна
        sys.exit(1)

    # Устанавливаем перехватчик
    sys.excepthook = global_exception_handler
    # --------------------------------------------------

    try:   
        get_current_vault_path()
        setup_vault(CURRENT_VAULT_PATH)
        eel.init('web')
        # Eel сам попробует найти Chrome, Chromium, Edge или Brave
        eel.start('main.html', cmdline_args=['--start-maximized'], suppress_error=True)
        
    except EnvironmentError:
        # Если ни один поддерживаемый браузер не найден, рисуем специальное окно
        import webbrowser
        from tkinter import Tk, Label, Button, Frame
        
        root = Tk()
        try: root.overrideredirect(True)
        except: pass
        root.title("Browser Not Found")
        root.attributes('-topmost', True) 
        
        w, h = 450, 250
        x = int((root.winfo_screenwidth()/2) - (w/2))
        y = int((root.winfo_screenheight()/2) - (h/2))
        root.geometry(f"{w}x{h}+{x}+{y}")

        mf = Frame(root, bg='#1C1C20', highlightbackground='#FF9F0A', highlightthickness=2)
        mf.pack(expand=True, fill='both')

        Label(mf, text="Browser Required", bg='#1C1C20', fg='#FF9F0A', font=("Segoe UI", 16, "bold")).pack(pady=(20, 10))
        Label(mf, text="Prompt Manager requires Google Chrome or Microsoft Edge to run its interface.\n\nPlease install a supported browser and try again.", bg='#1C1C20', fg='#E0E0E0', font=("Segoe UI", 10), wraplength=400, justify="center").pack(padx=20, pady=(0, 20), expand=True)

        bf = Frame(mf, bg='#1C1C20')
        bf.pack(pady=(0, 20))

        Button(bf, text="EXIT", bg='#333333', fg='white', font=("Segoe UI", 9, "bold"), relief='flat', activebackground='#444444', activeforeground='white', command=root.destroy, padx=15, pady=5).pack(side="left", padx=5)
        Button(bf, text="DOWNLOAD CHROME", bg='#0A84FF', fg='white', font=("Segoe UI", 9, "bold"), relief='flat', activebackground='#0066CC', activeforeground='white', command=lambda: [webbrowser.open("https://www.google.com/chrome/"), root.destroy()], padx=15, pady=5).pack(side="left", padx=5)

        root.focus_force()
        root.mainloop()
        sys.exit(1)

    except (SystemExit, MemoryError, KeyboardInterrupt):
        sys.exit(0)
    except Exception as e:
        import traceback
        tb_text = "".join(traceback.format_exception(type(e), e, e.__traceback__))
        if ROOT_DIR in tb_text:
            tb_text = tb_text.replace(ROOT_DIR, '[APP_DIR]')
        show_custom_fatal_error(tb_text)
        sys.exit(1)

# --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

