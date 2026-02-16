import eel
import os
import json
import uuid
import shutil
from datetime import datetime
import sys
from tkinter import filedialog, Tk

# --- Конфигурация ---
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
NOTES_APP_DIR = os.path.join(ROOT_DIR, 'Записки')
DEFAULT_VAULT_NAME = 'Default Vault'
STATE_FILE = os.path.join(ROOT_DIR, 'app_state.json')

# --- Глобальное состояние ---
CURRENT_VAULT_PATH = ''
APP_SETTINGS = {}

# --- Вспомогательные функции ---

# --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
def get_app_settings():
    """Читает глобальные настройки приложения из app_state.json с отказоустойчивостью."""
    global APP_SETTINGS
    
    default_settings = {
        'current_vault': DEFAULT_VAULT_NAME,
        'language': 'ru',
        'theme_base': 'dark',
        'theme_accent': 'blue',
        'notes_root_path': None,
        'theme_text': 'default',
        'current_style': 'default' # <-- НОВАЯ НАСТРОЙКА
    }

    if not os.path.exists(STATE_FILE):
        APP_SETTINGS = default_settings
        with open(STATE_FILE, 'w', encoding='utf-8') as f:
            json.dump(APP_SETTINGS, f, indent=4)
        return APP_SETTINGS

    try:
        with open(STATE_FILE, 'r', encoding='utf-8') as f:
            APP_SETTINGS = json.load(f)
    except (json.JSONDecodeError, IOError):
        backup_file = STATE_FILE + '.bak'
        if os.path.exists(backup_file):
            try:
                shutil.copy(backup_file, STATE_FILE)
                with open(STATE_FILE, 'r', encoding='utf-8') as f:
                    APP_SETTINGS = json.load(f)
            except (json.JSONDecodeError, IOError):
                APP_SETTINGS = default_settings
                with open(STATE_FILE, 'w', encoding='utf-8') as f:
                    json.dump(APP_SETTINGS, f, indent=4)
        else:
            APP_SETTINGS = default_settings
            with open(STATE_FILE, 'w', encoding='utf-8') as f:
                json.dump(APP_SETTINGS, f, indent=4)

    for key, value in default_settings.items():
        APP_SETTINGS.setdefault(key, value)
        
    return APP_SETTINGS
# --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

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
    
    # --- НОВАЯ ЛОГИКА ---
    # 1. Проверяем, есть ли в настройках кастомный путь
    custom_root = settings.get('notes_root_path')
    if custom_root and os.path.isdir(custom_root):
        # Если есть и он существует, используем его
        NOTES_APP_DIR = custom_root
    else:
        # Иначе, используем путь по умолчанию
        NOTES_APP_DIR = os.path.join(ROOT_DIR, 'Записки')
    # --- КОНЕЦ НОВОЙ ЛОГИКИ ---

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
            "show_tutorial": True  # <-- ФЛАГ ДЛЯ НОВЫХ ХРАНИЛИЩ
        }
        with open(metadata_file, 'w', encoding='utf-8') as f:
            json.dump(initial_data, f, indent=4)

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


def write_metadata(data):
    """Выполняет атомарную запись метаданных для предотвращения повреждения."""
    metadata_file = os.path.join(CURRENT_VAULT_PATH, 'notes.json')
    temp_file = metadata_file + '.tmp'
    backup_file = metadata_file + '.bak'
    if os.path.exists(metadata_file):
        shutil.copy(metadata_file, backup_file)
    with open(temp_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    os.replace(temp_file, metadata_file)

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
        note_file = os.path.join(notes_path, f"{note_id}.txt")
        if os.path.exists(note_file):
            try:
                with open(note_file, 'r', encoding='utf-8') as f:
                    preview_text = f.read(150).replace('\n', ' ')
                    content_previews[note_id] = preview_text
            except Exception:
                content_previews[note_id] = ""
        else:
            content_previews[note_id] = ""
    return {
        'metadata': metadata,
        'vaults': get_vaults(),
        'settings': get_app_settings(),
        'content_previews': content_previews
    }

@eel.expose
def get_note_content(note_id):
    """Возвращает содержимое только ОДНОЙ запрошенной заметки."""
    note_file = os.path.join(CURRENT_VAULT_PATH, 'notes', f"{note_id}.txt")
    if os.path.exists(note_file):
        with open(note_file, 'r', encoding='utf-8') as f:
            return f.read()
    return ""

@eel.expose
def save_settings(settings):
    """Сохраняет переданные настройки в app_state.json."""
    save_app_settings(settings)
    return {'success': True}

@eel.expose
def create_note(title, content):
    """Создает новую заметку и возвращает только ее метаданные."""
    note_id = str(uuid.uuid4())
    notes_path = os.path.join(CURRENT_VAULT_PATH, 'notes')
    note_file_path = os.path.join(notes_path, f"{note_id}.txt")
    with open(note_file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    metadata = read_metadata()
    metadata['notes'][note_id] = {
        'title': title,
        'created_at': datetime.now().isoformat(),
        'modified_at': datetime.now().isoformat()
    }
    write_metadata(metadata)
    return {'id': note_id, 'data': metadata['notes'][note_id]}

@eel.expose
def update_note(note_id, new_title, new_content):
    """Обновляет заметку и возвращает обновленные метаданные."""
    metadata = read_metadata()
    if note_id in metadata['notes']:
        metadata['notes'][note_id]['title'] = new_title
        metadata['notes'][note_id]['modified_at'] = datetime.now().isoformat()
        note_file = os.path.join(CURRENT_VAULT_PATH, 'notes', f"{note_id}.txt")
        with open(note_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        write_metadata(metadata)
        return {'id': note_id, 'data': metadata['notes'][note_id]}
    return None

@eel.expose
def delete_note(note_id):
    """Удаляет заметку и возвращает ID удаленной заметки."""
    metadata = read_metadata()
    if note_id in metadata['notes']:
        del metadata['notes'][note_id]
    for coll_id in metadata.get('collection_notes', {}):
        if note_id in metadata['collection_notes'][coll_id]:
            metadata['collection_notes'][coll_id].remove(note_id)
    write_metadata(metadata)
    note_file = os.path.join(CURRENT_VAULT_PATH, 'notes', f"{note_id}.txt")
    if os.path.exists(note_file):
        os.remove(note_file)
    return {'success': True, 'deleted_id': note_id}

# --- 👇 НОВЫЙ БЛОК ---
@eel.expose
def delete_notes_batch(note_ids):
    """Удаляет несколько заметок за один раз."""
    metadata = read_metadata()
    deleted_ids = []
    
    for note_id in note_ids:
        if note_id in metadata['notes']:
            del metadata['notes'][note_id]
            deleted_ids.append(note_id)
            
            # Удаляем заметку из всех коллекций
            for coll_id in metadata.get('collection_notes', {}):
                if note_id in metadata['collection_notes'][coll_id]:
                    metadata['collection_notes'][coll_id].remove(note_id)
            
            # Удаляем физический файл
            note_file = os.path.join(CURRENT_VAULT_PATH, 'notes', f"{note_id}.txt")
            if os.path.exists(note_file):
                os.remove(note_file)

    if deleted_ids:
        write_metadata(metadata)
        
    return {'success': True, 'deleted_ids': deleted_ids}
# --- 👆 КОНЕЦ НОВОГО БЛОКА ---

@eel.expose
def create_collection(name):
    """Создает новую коллекцию."""
    coll_id = 'coll_' + str(uuid.uuid4())
    metadata = read_metadata()
    metadata.setdefault('collections', {})[coll_id] = {'name': name, 'icon': 'folder.svg'}
    metadata.setdefault('collection_notes', {})[coll_id] = []
    write_metadata(metadata)
    return {'id': coll_id, 'data': metadata['collections'][coll_id]}

@eel.expose
def rename_collection(coll_id, new_name):
    metadata = read_metadata()
    if coll_id in metadata.get('collections', {}):
        metadata['collections'][coll_id]['name'] = new_name
        write_metadata(metadata)
        return {'id': coll_id, 'data': metadata['collections'][coll_id]}
    return None

@eel.expose
def delete_collection(coll_id):
    metadata = read_metadata()
    if coll_id in metadata.get('collections', {}):
        del metadata['collections'][coll_id]
        if coll_id in metadata.get('collection_notes', {}):
            del metadata['collection_notes'][coll_id]
        write_metadata(metadata)
        return {'success': True, 'deleted_id': coll_id}
    return {'success': False}

# --- 👇 Добавьте новую функцию после delete_collection ---
@eel.expose
def mark_tutorial_as_seen():
    """Убирает флаг show_tutorial из notes.json."""
    metadata = read_metadata()
    if "show_tutorial" in metadata:
        metadata["show_tutorial"] = False
        write_metadata(metadata)
    return {'success': True}
# --- 👆 КОНЕЦ НОВОГО БЛОКА ---

@eel.expose
def add_note_to_collection(note_id, collection_id):
    metadata = read_metadata()
    notes_in_coll = metadata.setdefault('collection_notes', {}).setdefault(collection_id, [])
    if note_id not in notes_in_coll:
        notes_in_coll.append(note_id)
        write_metadata(metadata)
        return {'success': True, 'note_id': note_id, 'collection_id': collection_id}
    return {'success': False, 'message': 'Note already in collection.'}

# --- 👇 НОВЫЙ БЛОК ---
@eel.expose
def add_notes_to_collection_batch(note_ids, collection_id):
    """Добавляет несколько заметок в одну коллекцию."""
    metadata = read_metadata()
    if collection_id not in metadata.setdefault('collection_notes', {}):
        metadata['collection_notes'][collection_id] = []
        
    notes_in_coll = metadata['collection_notes'][collection_id]
    added_count = 0
    for note_id in note_ids:
        if note_id not in notes_in_coll:
            notes_in_coll.append(note_id)
            added_count += 1
            
    if added_count > 0:
        write_metadata(metadata)
        
    return {'success': True, 'added_count': added_count, 'collection_id': collection_id}
# --- 👆 КОНЕЦ НОВОГО БЛОКА ---

@eel.expose
def remove_note_from_collection(note_id, collection_id):
    metadata = read_metadata()
    if collection_id in metadata.get('collection_notes', {}) and note_id in metadata['collection_notes'][collection_id]:
        metadata['collection_notes'][collection_id].remove(note_id)
        write_metadata(metadata)
        return {'success': True, 'note_id': note_id, 'collection_id': collection_id}
    return {'success': False}

@eel.expose
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

@eel.expose
def save_note_order_in_collection(collection_id, note_ids_list):
    """Сохраняет новый порядок заметок внутри указанной коллекции."""
    metadata = read_metadata()
    if collection_id in metadata.get('collection_notes', {}):
        # Просто заменяем старый массив отсортированным списком с фронтенда
        metadata['collection_notes'][collection_id] = note_ids_list
        write_metadata(metadata)
        return {'success': True}
    return {'success': False, 'message': 'Collection not found.'}

@eel.expose
def get_vaults():
    """Возвращает список всех доступных хранилищ."""
    if not os.path.exists(NOTES_APP_DIR):
        os.makedirs(NOTES_APP_DIR)
    return [d for d in os.listdir(NOTES_APP_DIR) if os.path.isdir(os.path.join(NOTES_APP_DIR, d))]

@eel.expose
def switch_vault(vault_name):
    """Переключается на другое хранилище и перезагружает приложение."""
    save_app_settings({'current_vault': vault_name})
    eel.reload_app()()

@eel.expose
def create_vault(vault_name):
    """Создает новое пустое хранилище."""
    if not vault_name or not vault_name.strip():
        return {'success': False, 'message': 'Vault name cannot be empty.'}
    new_vault_path = os.path.join(NOTES_APP_DIR, vault_name)
    if not os.path.exists(new_vault_path):
        setup_vault(new_vault_path)
        switch_vault(vault_name)
        return {'success': True}
    return {'success': False, 'message': 'Vault with this name already exists.'}

@eel.expose
def rename_vault(old_name, new_name):
    """Переименовывает хранилище."""
    if not new_name or not new_name.strip():
        return {'success': False, 'message': 'New name cannot be empty.'}
    old_path = os.path.join(NOTES_APP_DIR, old_name)
    new_path = os.path.join(NOTES_APP_DIR, new_name)
    if not os.path.exists(old_path):
        return {'success': False, 'message': f'Vault "{old_name}" not found.'}
    if os.path.exists(new_path):
        return {'success': False, 'message': f'A vault named "{new_name}" already exists.'}
    try:
        os.rename(old_path, new_path)
        settings = get_app_settings()
        if settings.get('current_vault') == old_name:
            save_app_settings({'current_vault': new_name})
        return {'success': True}
    except OSError as e:
        return {'success': False, 'message': f'Error renaming vault: {e}'}

@eel.expose
def delete_vault(vault_name):
    """Удаляет хранилище."""
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
        return {'success': False, 'message': f'Error deleting vault directory: {e}'}

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
            return {'success': False, 'message': 'Export cancelled.'} # <--- ИЗМЕНЕНО

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
            return {'success': False, 'message': 'Import cancelled.'}

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
    if not new_vault_name or not new_vault_name.strip():
        return {'success': False, 'message': 'Vault name cannot be empty.'}
    if new_vault_name in get_vaults():
        return {'success': False, 'message': f'A vault named "{new_vault_name}" already exists.'}
        
    try:
        new_vault_path = os.path.join(NOTES_APP_DIR, new_vault_name)
        shutil.unpack_archive(archive_path, new_vault_path, 'zip')
        switch_vault(new_vault_name)
        return {'success': True}
    except Exception as e:
        return {'success': False, 'message': str(e)}
    
# --- 👇 НОВЫЙ БЛОК ---
@eel.expose
def move_notes_to_vault(note_ids, target_vault_name):
    """Перемещает заметки из текущего хранилища в другое."""
    if not note_ids or not target_vault_name:
        return {'success': False, 'message': 'Missing note IDs or target vault.'}

    target_vault_path = os.path.join(NOTES_APP_DIR, target_vault_name)
    if not os.path.exists(target_vault_path):
        return {'success': False, 'message': f'Target vault "{target_vault_name}" not found.'}

    # Убедимся, что целевое хранилище готово к работе
    setup_vault(target_vault_path)
    
    # Загружаем метаданные обоих хранилищ
    source_metadata = read_metadata()
    with open(os.path.join(target_vault_path, 'notes.json'), 'r', encoding='utf-8') as f:
        target_metadata = json.load(f)

    moved_count = 0
    for note_id in note_ids:
        if note_id in source_metadata['notes']:
            # 1. Копируем метаданные
            target_metadata['notes'][note_id] = source_metadata['notes'][note_id]
            
            # 2. Копируем физический файл
            source_file = os.path.join(CURRENT_VAULT_PATH, 'notes', f"{note_id}.txt")
            target_file = os.path.join(target_vault_path, 'notes', f"{note_id}.txt")
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
def copy_notes_to_vault(note_ids, target_vault_name):
    """Копирует заметки из текущего хранилища в другое."""
    if not note_ids or not target_vault_name:
        return {'success': False, 'message': 'Missing note IDs or target vault.'}

    target_vault_path = os.path.join(NOTES_APP_DIR, target_vault_name)
    if not os.path.exists(target_vault_path):
        return {'success': False, 'message': f'Target vault "{target_vault_name}" not found.'}

    setup_vault(target_vault_path)
    
    source_metadata = read_metadata()
    with open(os.path.join(target_vault_path, 'notes.json'), 'r', encoding='utf-8') as f:
        target_metadata = json.load(f)

    copied_count = 0
    for note_id in note_ids:
        if note_id in source_metadata['notes'] and note_id not in target_metadata['notes']:
            # 1. Копируем метаданные
            target_metadata['notes'][note_id] = source_metadata['notes'][note_id]
            
            # 2. Копируем физический файл
            source_file = os.path.join(CURRENT_VAULT_PATH, 'notes', f"{note_id}.txt")
            target_file = os.path.join(target_vault_path, 'notes', f"{note_id}.txt")
            if os.path.exists(source_file):
                shutil.copy(source_file, target_file)

            copied_count += 1
            
    if copied_count > 0:
        # Сохраняем изменения ТОЛЬКО в целевом хранилище
        with open(os.path.join(target_vault_path, 'notes.json'), 'w', encoding='utf-8') as f:
            json.dump(target_metadata, f, indent=4, ensure_ascii=False)
            
    return {'success': True, 'copied_count': copied_count}
# --- 👆 КОНЕЦ НОВОГО БЛОКА ---


# --- 👇 НОВЫЙ БЛОК ---
@eel.expose
def change_notes_directory():
    """Открывает диалог выбора новой корневой папки для заметок."""
    try:
        root = Tk()
        root.withdraw()
        root.attributes('-topmost', True)
        
        new_path = filedialog.askdirectory(title="Select a new root directory for notes")
        
        if not new_path:
            return {'success': False, 'message': 'Directory selection cancelled.'}
            
        save_app_settings({'notes_root_path': new_path})
        eel.reload_app()() # Перезагружаем приложение, чтобы изменения вступили в силу
        
        return {'success': True, 'path': new_path}
        
    except Exception as e:
        return {'success': False, 'message': str(e)}
# --- 👆 КОНЕЦ НОВОГО БЛОКА ---


if __name__ == '__main__':
    get_current_vault_path()
    setup_vault(CURRENT_VAULT_PATH)
    eel.init('web')
    try:
        eel.start('main.html', cmdline_args=['--start-maximized'], suppress_error=True)
    except (SystemExit, MemoryError, KeyboardInterrupt):
        sys.exit(0)