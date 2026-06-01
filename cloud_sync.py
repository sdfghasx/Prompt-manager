import os
import json
import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

# Секретная соль для локального шифрования ключей на диске. 
# Это НЕ пароль пользователя, это просто соль для защиты файла credentials.bin от прямого чтения.
# В идеальном мире это хранится в Credential Manager ОС, но для Portable-режима мы делаем так.
HARDCODED_LOCAL_SALT = b"prompt_manager_v3_local_salt_123"

def _get_local_cipher():
    """Создает симметричный ключ для шифрования файла credentials.bin на основе стабильного отпечатка ПК."""
    import os
    import sys
    import platform
    
    machine_id = "unknown"
    try:
        # Получаем стабильный Machine ID, не зависящий от сетевых адаптеров
        if sys.platform == 'win32':
            import winreg
            with winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\Microsoft\Cryptography", 0, winreg.KEY_READ) as key:
                machine_id = winreg.QueryValueEx(key, "MachineGuid")[0]
        elif sys.platform == 'darwin':
            import subprocess
            output = subprocess.check_output(['ioreg', '-rd1', '-c', 'IOPlatformExpertDevice']).decode('utf-8')
            for line in output.split('\n'):
                if 'IOPlatformUUID' in line:
                    machine_id = line.split('"')[3]
                    break
        else:
            for path in ['/etc/machine-id', '/var/lib/dbus/machine-id']:
                if os.path.exists(path):
                    with open(path, 'r') as f:
                        machine_id = f.read().strip()
                    break
    except Exception:
        pass
        
    username = os.environ.get('USERNAME', os.environ.get('USER', 'default_user'))
    hostname = platform.node()
    
    # Комбинируем надежный Machine ID, пользователя и имя ПК
    final_id = f"{username}_{hostname}_{machine_id}".encode('utf-8')
    
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=HARDCODED_LOCAL_SALT,
        iterations=480000, # Значительно усложняем брутфорс
    )
    key = base64.urlsafe_b64encode(kdf.derive(final_id))
    return Fernet(key)



def save_credentials(app_data_dir, endpoint, bucket, access_key, secret_key, user_password):
    """Шифрует и сохраняет S3 ключи на диск."""
    credentials_file = os.path.join(app_data_dir, 'credentials.bin')
    
    data = {
        'endpoint': endpoint,
        'bucket': bucket,
        'access_key': access_key,
        'secret_key': secret_key,
        'user_password': user_password # Пароль пользователя для E2E шифрования заметок
    }
    
    json_data = json.dumps(data).encode('utf-8')
    cipher = _get_local_cipher()
    encrypted_data = cipher.encrypt(json_data)
    
    with open(credentials_file, 'wb') as f:
        f.write(encrypted_data)
        
    return True

def load_credentials(app_data_dir):
    """Читает и расшифровывает S3 ключи с диска."""
    credentials_file = os.path.join(app_data_dir, 'credentials.bin')
    if not os.path.exists(credentials_file):
        return None
        
    try:
        with open(credentials_file, 'rb') as f:
            encrypted_data = f.read()
            
        cipher = _get_local_cipher()
        decrypted_data = cipher.decrypt(encrypted_data)
        return json.loads(decrypted_data.decode('utf-8'))
    except Exception as e:
        print(f"Failed to decrypt credentials: {e}")
        return None

def disable_sync(app_data_dir):
    """Удаляет файл с ключами, отключая синхронизацию."""
    credentials_file = os.path.join(app_data_dir, 'credentials.bin')
    if os.path.exists(credentials_file):
        os.remove(credentials_file)
    return True

# --- 👇 НОВЫЙ БЛОК: S3 КЛИЕНТ И СЕТЬ ---
import io
import boto3
from botocore.exceptions import ClientError
from botocore.client import Config
import threading

# Глобальный транзакционный мьютекс (для защиты от гонки между GUI и Облаком)
VAULT_LOCK = threading.Lock()

class S3Client:
    """Обертка над boto3 для работы с любым S3-совместимым хранилищем."""
    def __init__(self, endpoint_url, access_key, secret_key, bucket_name):
        self.bucket = bucket_name
        self.s3 = None
        self.init_error = None
        
        # ЗАЩИТА ОТ SSRF (Server-Side Request Forgery)
        if endpoint_url:
            import urllib.parse
            try:
                parsed = urllib.parse.urlparse(endpoint_url)
                if parsed.scheme not in ['http', 'https']:
                    self.init_error = "Invalid URL scheme. Use http or https."
                    return
                
                hostname = parsed.hostname.lower() if parsed.hostname else ""
                
                # Блокируем доступ к localhost и AWS Metadata Service (IMDS)
                if hostname == '169.254.169.254' or hostname in ['localhost', '127.0.0.1', '::1'] or hostname.startswith('127.'):
                    self.init_error = "Security Warning: Blocked attempt to connect to restricted local/metadata address (SSRF protection)."
                    return
            except Exception:
                self.init_error = "Malformed Endpoint URL."
                return

        try:
            # Убираем жесткий addressing_style, позволяем boto3 решать самому
            self.s3 = boto3.client(
                's3',
                endpoint_url=endpoint_url if endpoint_url else None,
                aws_access_key_id=access_key if access_key else None,
                aws_secret_access_key=secret_key if secret_key else None,
                config=Config(signature_version='s3v4'),
                region_name='us-east-1'
            )
        except Exception as e:
            # Если пользователь ввел дичь (например, endpoint без http://), сохраняем ошибку, но не падаем!
            self.init_error = str(e)


    def test_connection(self):
        """Проверяет доступность бакета."""
        if self.init_error:
            return False, f"Invalid configuration: {self.init_error}"
        if not self.s3:
            return False, "S3 Client failed to initialize."
            
        try:

            # Некоторые сервисы не любят head_bucket без прав администратора. 
            # Самый надежный тест - запросить список файлов (ограничив до 1 штуки).
            self.s3.list_objects_v2(Bucket=self.bucket, MaxKeys=1)
            return True, "Connection successful"
        except ClientError as e:
            error_code = e.response.get("Error", {}).get("Code", "Unknown")
            # Если бакет не существует, AWS вернет NoSuchBucket, другие могут вернуть 404
            if error_code in ['404', 'NoSuchBucket']:
                return False, f"Bucket '{self.bucket}' does not exist or endpoint is wrong."
            elif error_code in ['403', 'AccessDenied', 'SignatureDoesNotMatch', 'InvalidAccessKeyId']:
                return False, f"Access Denied ({error_code}). Check your Access/Secret Keys."
            else:
                return False, f"Connection failed: {error_code}"
        except Exception as e:
            return False, f"Network error: {str(e)}"


    def upload_file(self, object_name, file_data_bytes):
        """Загружает бинарные данные в бакет как файл."""
        if not self.s3: return False, "S3 Client not initialized"
        try:
            self.s3.upload_fileobj(io.BytesIO(file_data_bytes), self.bucket, object_name)
            return True, ""
        except Exception as e:
            return False, str(e)

    def download_file(self, object_name):
        """Скачивает файл из бакета, не перегружая RAM."""
        if not self.s3: return False, "S3 Client not initialized"
        try:
            import tempfile
            # ИСПРАВЛЕНИЕ 4: Стримим файл прямо на диск (или в ОЗУ до 10МБ), избегая аллокации гигантского массива
            buffer = tempfile.SpooledTemporaryFile(max_size=10*1024*1024)
            self.s3.download_fileobj(self.bucket, object_name, buffer)
            buffer.seek(0)
            data = buffer.read() # Криптография Fernet все равно потребует загрузки в память, но мы срезали двойную аллокацию
            buffer.close()
            return True, data

        except ClientError as e:
            error_code = e.response.get("Error", {}).get("Code", "Unknown")
            if error_code == '404':
                return False, "File not found"
            return False, str(e)
        except Exception as e:
            return False, str(e)

    def delete_file(self, object_name):
        """Тихо удаляет файл из бакета (игнорирует ошибку, если файла нет)."""
        if not self.s3: return False
        try:
            self.s3.delete_object(Bucket=self.bucket, Key=object_name)
            return True
        except:
            return False

    def get_file_timestamp(self, object_name):
        """Возвращает дату изменения файла в S3 (timestamp) или 0, если файла нет."""
        if not self.s3: return 0
        try:
            response = self.s3.head_object(Bucket=self.bucket, Key=object_name)
            # Возвращаем UNIX timestamp
            return response['LastModified'].timestamp()
        except ClientError:
            return 0
        except Exception:
            return 0

    def list_vaults(self):
        """Возвращает список хранилищ (возвращает полные имена с расширениями, чтобы пользователь видел разницу)."""
        if not self.s3: return False, "S3 Client not initialized"
        try:
            response = self.s3.list_objects_v2(Bucket=self.bucket, Prefix='Vault_')
            vaults = []
            if 'Contents' in response:
                for obj in response['Contents']:
                    filename = obj['Key']
                    if filename.startswith('Vault_'):
                        # Сохраняем имя и расширение раздельно, чтобы красиво показать в UI
                        if filename.endswith('.enc'):
                            clean_name = filename[6:-4].replace('_', ' ')
                            vaults.append({'name': clean_name, 'ext': '.enc'})
                        elif filename.endswith('.zip'):
                            clean_name = filename[6:-4].replace('_', ' ')
                            vaults.append({'name': clean_name, 'ext': '.zip'})
            return True, vaults
        except Exception as e:
            return False, str(e)




def test_s3_connection(app_data_dir):
    """Считывает ключи с диска и пингует S3-облако."""
    creds = load_credentials(app_data_dir)
    if not creds:
        return {'success': False, 'message': 'No credentials found. Please save settings first.'}
    
    # Инициализируем наш клиент сохраненными ключами
    client = S3Client(
        endpoint_url=creds['endpoint'],
        access_key=creds['access_key'],
        secret_key=creds['secret_key'],
        bucket_name=creds['bucket']
    )
    
    # Пробуем достучаться до бакета
    success, msg = client.test_connection()
    return {'success': success, 'message': msg}

def get_remote_vaults(app_data_dir):
    """Возвращает список хранилищ из облака."""
    creds = load_credentials(app_data_dir)
    if not creds:
        return {'success': False, 'message': 'Not connected to cloud'}
    
    client = S3Client(
        endpoint_url=creds['endpoint'],
        access_key=creds['access_key'],
        secret_key=creds['secret_key'],
        bucket_name=creds['bucket']
    )
    
    success, result = client.list_vaults()
    if success:
        return {'success': True, 'vaults': result}
    return {'success': False, 'message': result}

# --- 👆 КОНЕЦ НОВОГО БЛОКА ---
