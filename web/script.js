// --- Точка входа: ожидаем загрузки DOM ---
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Глобальное состояние приложения ---
    let state = {
        notes: {},
        collections: {},
        collectionNotes: {},
        notePreviews: {},
        noteContentsCache: {},
        vaults: [],
        settings: { current_vault: '', language: 'en', theme_base: 'dark', theme_accent: 'blue' }
    };

    let initialNoteTitle = '';
    let initialNoteContent = '';
    let currentOpenCollectionId = null;
    let currentEditingNoteId = null;
    let draggedElement = { id: null, type: null, source: null };
    let menuHideTimer;
    let tooltipTimer = null;
    let notificationTimer = null;
    let isSelectionModeActive = false;
    let selectedNoteIds = new Set();
    let previousThemeBase = null; 
   let parentIdForNewSubcollection = null;

    // --- 2. Ссылки на DOM-элементы ---
    const dom = {
        uncollectedFilterToggle: document.getElementById('uncollected-filter-toggle'),
        appContainer: document.querySelector('.app-container'),
        contentArea: document.querySelector('.content-area'),
        notesGrid: document.getElementById('notes-grid'),
        notesGridCurtain: document.getElementById('notes-grid-curtain'),
        collectionsList: document.getElementById('collections-list'),
        newNoteBtn: document.getElementById('new-note-btn'),
        addCollectionBtn: document.getElementById('add-collection-btn'),
        hamburgerBtn: document.getElementById('hamburger-btn'),
        optionsBtn: document.getElementById('options-btn'),
        hamburgerMenu: document.getElementById('hamburger-menu'),
        optionsMenu: document.getElementById('options-menu'),
        contextMenu: document.getElementById('context-menu'),
        searchInput: document.getElementById('search-input'),
        vaultDisplay: document.getElementById('current-vault-display'),
        notification: document.getElementById('clipboard-notification'),
        noteTooltip: document.getElementById('note-tooltip'),
        noteModal: {
            el: document.getElementById('note-modal'),
            title: document.getElementById('modal-title'),
            titleInput: document.getElementById('note-title-input'),
            contentInput: document.getElementById('note-content-input'),
            saveBtn: document.querySelector('#note-modal [data-action="save"]'),
            cancelBtn: document.querySelector('#note-modal [data-action="cancel"]')
        },
        collectionModal: {
            el: document.getElementById('collection-modal'),
            nameInput: document.getElementById('collection-name-input'),
            saveBtn: document.querySelector('#collection-modal [data-action="save"]'),
            cancelBtn: document.querySelector('#collection-modal [data-action="cancel"]')
        },
        alertModal: document.getElementById('alert-modal'),
        promptModal: document.getElementById('prompt-modal'),
        loadingOverlay: document.getElementById('loading-overlay'),
        collectionView: {
            panel: document.getElementById('collection-view-panel'),
            title: document.getElementById('collection-view-title'),
            grid: document.getElementById('collection-notes-grid'),
            curtain: document.getElementById('collection-view-curtain')
        },
        
        themeSubmenuContainer: document.getElementById('theme-submenu-container'),
        languageSubmenuContainer: document.getElementById('language-submenu-container'),
        accentColorsContainer: document.getElementById('accent-colors-container'),
        dragDeleteZone: document.getElementById('drag-delete-zone'),

        // 👇 НОВЫЙ БЛОК
        selectionToolbar: document.getElementById('selection-toolbar'),
        selectionCounter: document.getElementById('selection-counter'),
        selectionDoneBtn: document.getElementById('selection-done-btn'),
        dragGhost: document.getElementById('drag-ghost')
        // 👆 КОНЕЦ НОВОГО БЛОКА

    };

    // --- 3. Словари и утилиты для UI ---
    const accentThemes = {
        blue: { name: 'Blue', color: '#589DF6' },
        green: { name: 'Green', color: '#6DC274' },
        purple: { name: 'Purple', color: '#B388FF' },
        orange: { name: 'Orange', color: '#FFAB70' },
        red: { name: 'Rose', color: '#F06292' },
        cyan: { name: 'Cyan', color: '#4DD0E1' }
    };

    // --- 👇 НОВЫЙ БЛОК ---
    const textThemes = {
        default: { name: 'Default', color: '#B0B0B0' },
        sky: { name: 'Sky', color: '#A6D1E6' },
        mint: { name: 'Mint', color: '#A4E8C2' },
        sand: { name: 'Sand', color: '#E9D699' },
        blush: { name: 'Blush', color: '#EBBAB9' }
    };
// --- 👆 КОНЕЦ НОВОГО БЛОКА ---

// --- 👇 НОВЫЙ БЛОК ---
    const visualStyles = {
        'default': { name: 'Default', file: '' },
        'soft-pastel': { name: 'Soft Pastel', file: 'styles/soft-pastel.css' },
        'apple': { name: 'Apple Style', file: 'styles/apple.css' },
        'arc': { name: 'Arc Arc', file: 'styles/arc.css' },
        'cyber-tech': { name: 'Cyber Tech', file: 'styles/cyber-tech.css' },
        'synthwave': { name: 'Synthwave', file: 'styles/synthwave.css' },
        'frosted-glass': { name: 'Frosted Glass', file: 'styles/frosted-glass.css' },
        'glass': { name: 'True Glass', file: 'styles/glass.css' },
        'sketch': { name: 'Sketch & Ink', file: 'styles/sketch.css' }
    };
// --- 👆 КОНЕЦ НОВОГО БЛОКА ---
    
// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    const translations = {
        en: {
            changeStyle: 'Change Style',
            styleUpdated: 'Style updated',
            myWorkspace: 'My Workspace', 
            collections: 'Collections', 
            newCollection: 'New Collection',
            createSubcollection: 'Create Subcollection',
            createSubcollection: 'Create Subcollection', // <-- НОВОЕ
            newNote: 'New', 
            searchPlaceholder: 'Search Prompts...', 
            changeTheme: 'Change Theme', 
            language: 'Language', 
            aboutApp: 'About app', 
            editNote: 'Edit Note', 
            noteNamePlaceholder: 'Prompt Name', 
            noteContentPlaceholder: 'Enter your prompt text here...', 
            collectionNamePlaceholder: 'Collection Name', 
            ok: 'OK', 
            cancel: 'Cancel', 
            copied: 'Copied to clipboard',
            noteDeleted: 'Note deleted',
            noteAddedToCollection: 'Note added to collection', 
            removeFromCollection: 'Remove note from collection',
            dropToDelete: 'Drop to delete', 
            emptyCollection: 'This collection is empty.', 
            addVault: 'Add Vault', 
            renameVault: 'Rename Vault', 
            deleteVault: 'Delete Vault', 
            switchVault: 'Switch Vault', 
            exportVault: 'Export Vault', 
            importVault: 'Import Vault', 
            edit: 'Edit', 
            delete: 'Delete', 
            addToCollection: 'Add to Collection', 
            rename: 'Rename', 
            inputError: 'Input Error', 
            titleRequired: 'Title is required.', 
            collectionNameRequired: 'Collection name is required.', 
            deleteNoteTitle: 'Delete Note?', 
            deleteNoteMessage: 'Are you sure you want to delete this note permanently?',
            deleteNotesMessage: (count) => `Are you sure you want to delete ${count} selected notes?`,
            deleteCollectionTitle: 'Delete Collection?', 
            deleteCollectionMessage: (name) => `Are you sure you want to delete "${name}"? Notes inside will not be deleted.`, 
            deleteVaultTitle: 'Delete Vault?', 
            deleteVaultMessage: (name) => `Are you sure you want to delete the vault "${name}"?`, 
            finalWarningTitle: 'Final Warning', 
            finalWarningMessage: 'All notes and collections within this vault will be PERMANENTLY deleted.\n\nThis action cannot be undone.', 
            deleteAction: 'Delete', 
            deletePermanentlyAction: 'Delete Permanently', 
            enterNewName: 'Enter new name', 
            darkTheme: 'Dark Theme', 
            lightTheme: 'Light Theme', 
            total: 'total', 
            metadata: 'Metadata',
            uncollected: 'Uncollected',
            unsavedChangesTitle: 'Unsaved Changes',
            unsavedChangesMessage: 'You have unsaved changes. Are you sure you want to close without saving?',
            discard: 'Discard',
            noteCreated: 'Note created',
            collectionCreated: 'Collection created',
            collectionDeleted: 'Collection deleted',
            languageUpdated: 'Language updated',
            themeUpdated: 'Theme updated',
            vaultCreated: 'Vault created. Reloading...',
            vaultRenamed: 'Vault renamed. Reloading...',
            vaultDeleted: 'Vault deleted. Reloading...',
            vaultExported: 'Vault exported successfully',
            vaultImported: 'Vault imported. Reloading...',
            noteUpdated: 'Note updated',
            vaultNameConflictTitle: 'Name Conflict',
            vaultNameConflictMessage: (name) => `A vault named "${name}" already exists.\nPlease enter a new name for the imported vault.`,
            vaultNameStillExists: (name) => `A vault named "${name}" also exists. Please choose a different name.`,
            changeNotesDir: 'Notes Directory...',
            showTutorial: 'Show Tutorial',
            tutorialPromptTitle: 'Welcome!',
            tutorialPromptMessage: 'Would you like to take a quick tour of the main features?',
            tutorialReminder: 'You can always start the tutorial from the options menu.',
            notesAddedToCollection: (count, name) => `${count} notes added to "${name}"`,
            notesMovedToVault: (count, name) => `${count} notes moved to "${name}"`,
            copyToAction: 'Copy to',
            moveToAction: 'Move to',
            notesCopiedToVault: (count, name) => `${count} notes copied to "${name}"`,
            select: 'Select',
            collection: 'Collection',
            move: 'Move',
            done: 'Done',
            selected: 'Selected',
            sound: 'Sound Effects'
        },
        ru: {
            changeStyle: 'Сменить стиль', 
            styleUpdated: 'Стиль обновлен', 
            myWorkspace: 'My Workspace', 
            collections: 'Коллекции',
            emptyStateMessage: "Пока нет ни одной записки. Нажмите Создать, чтобы добавить первую!",
            newCollection: 'Новая коллекция', 
            createSubcollection: 'Создать подколлекцию',
            createSubcollection: 'Создать подколлекцию', // <-- НОВОЕ
            newNote: 'Создать', 
            searchPlaceholder: 'Поиск записок...', 
            changeTheme: 'Сменить тему', 
            language: 'Язык', 
            aboutApp: 'О приложении', 
            editNote: 'Редактировать записку', 
            noteNamePlaceholder: 'Название записки', 
            noteContentPlaceholder: 'Введите текст вашей записки...', 
            collectionNamePlaceholder: 'Название коллекции', 
            ok: 'Да', 
            cancel: 'Нет', 
            copied: 'Скопировано в буфер',
            noteDeleted: 'Записка удалена',
            noteAddedToCollection: 'Заметка добавлена в коллекцию', 
            removeFromCollection: 'Убрать заметку из коллекции',
            dropToDelete: 'Drop to delete',
            emptyCollection: 'В этой коллекции нет записок.', 
            addVault: 'Добавить хранилище', 
            renameVault: 'Переименовать хранилище', 
            deleteVault: 'Удалить хранилище', 
            switchVault: 'Сменить хранилище', 
            exportVault: 'Экспорт хранилища', 
            importVault: 'Импорт хранилища', 
            edit: 'Изменить', 
            delete: 'Удалить', 
            addToCollection: 'Добавить в коллекцию', 
            rename: 'Переименовать', 
            inputError: 'Ошибка ввода', 
            titleRequired: 'Требуется название.', 
            collectionNameRequired: 'Требуется название коллекции.', 
            deleteNoteTitle: 'Удалить записку?', 
            deleteNoteMessage: 'Вы уверены, что хотите безвозвратно удалить эту записку?',
            deleteNotesMessage: (count) => `Вы уверены, что хотите удалить ${count} выбранных заметок?`,
            deleteCollectionTitle: 'Удалить коллекцию?', 
            deleteCollectionMessage: (name) => `Вы уверены, что хотите удалить "${name}"? Вместе с ней будут удалены все ее подколлекции.`, // <-- ИЗМЕНЕНО
            deleteVaultTitle: 'Удалить хранилище?', 
            deleteVaultMessage: (name) => `Вы уверены, что хотите удалить хранилище "${name}"?`, 
            finalWarningTitle: 'Последнее предупреждение', 
            finalWarningMessage: 'Все записки и коллекции в этом хранилище будут УДАЛЕНЫ НАВСЕГДА.\n\nЭто действие необратимо.', 
            deleteAction: 'Удалить', 
            deletePermanentlyAction: 'Удалить навсегда', 
            enterNewName: 'Введите новое имя', 
            darkTheme: 'Темная тема', 
            lightTheme: 'Светлая тема', 
            total: 'всего', 
            metadata: 'Метаданные',
            uncollected: 'Uncollected',
            unsavedChangesTitle: 'Несохраненные изменения',
            unsavedChangesMessage: 'У вас есть несохраненные изменения. Вы уверены, что хотите выйти без сохранения?',
            discard: 'Сбросить',
            noteCreated: 'Записка создана',
            collectionCreated: 'Коллекция создана',
            collectionDeleted: 'Коллекция удалена',
            languageUpdated: 'Язык обновлен',
            themeUpdated: 'Тема обновлена',
            vaultCreated: 'Хранилище создано. Перезагрузка...',
            vaultRenamed: 'Хранилище переименовано. Перезагрузка...',
            vaultDeleted: 'Хранилище удалено. Перезагрузка...',
            vaultExported: 'Хранилище успешно экспортировано',
            vaultImported: 'Хранилище импортировано. Перезагрузка...',
            noteUpdated: 'Записка обновлена',
            vaultNameConflictTitle: 'Конфликт имен',
            vaultNameConflictMessage: (name) => `Хранилище с именем "${name}" уже существует.\nПожалуйста, введите новое имя для импортируемого хранилища.`,
            vaultNameStillExists: (name) => `Хранилище с именем "${name}" также существует. Пожалуйста, выберите другое имя.`,
            changeNotesDir: 'Папка для заметок...',
            showTutorial: 'Показать обучение',
            tutorialPromptTitle: 'Добро пожаловать!',
            tutorialPromptMessage: 'Хотите пройти краткое обучение по основным функциям?',
            tutorialReminder: 'Вы всегда можете запустить обучение из меню опций.',
            notesAddedToCollection: (count, name) => `${count} заметок добавлено в "${name}"`,
            notesMovedToVault: (count, name) => `${count} заметок перемещено в "${name}"`,
            copyToAction: 'Копировать в',
            moveToAction: 'Переместить в',
            notesCopiedToVault: (count, name) => `${count} заметок скопировано в "${name}"`,
            select: 'Выделить',
            collection: 'В коллекцию',
            move: 'Переместить',
            done: 'Готово',
            selected: 'Выделено',
            sound: 'Звуковые эффекты'
        }
    };
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---


// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    const SoundManager = {
        USE_GLOBAL_SOUNDS: true, 
        cache: {},

        play(name) {
            if (!state || state.settings.sound_enabled === false) return;

            const theme = state.settings.theme_accent || 'blue';
            let path = '';
            
            if (this.USE_GLOBAL_SOUNDS) {
                path = `sounds/${name}.mp3`;
            } else {
                path = `sounds/themes/${theme}/${name}.mp3`;
            }

            if (!this.cache[path]) {
                this.cache[path] = new Audio(path);
            }

            const sound = this.cache[path];
            sound.currentTime = 0; 
            sound.volume = 0.2; // Делаем звуки наведения ОЧЕНЬ тихими
            
            const playPromise = sound.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {});
            }
        }
    };
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---


// --- 👇 Добавьте этот блок после translations ---
// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    const tutorialSteps = [
        { 
            element: '#new-note-btn', 
            text: '1. Создайте новую заметку. Заполните её и нажмите "OK".',
            waitFor: { element: '#note-modal [data-action="save"]', event: 'click' }
        },
        { 
            element: '.note-tile', 
            text: '2. Отлично! Теперь, один клик по этой плитке скопирует её содержимое. Попробуйте.',
            waitFor: { element: '.note-tile', event: 'click' }
        },
        { 
            element: '#add-collection-btn', 
            text: '3. Нажмите здесь, чтобы создать коллекцию для ваших заметок. Дайте ей имя и нажмите "OK".',
            waitFor: { element: '#collection-modal [data-action="save"]', event: 'click' }
        },
        {
            element: '.note-tile',
            text: '4. Чтобы организовать работу, перетащите заметку на новую коллекцию.',
            waitFor: { element: '#collections-list', event: 'drop' }
        },
        {
            element: '.collection-item',
            text: '5. Нажмите на заметку правой кнопкой мыши, чтобы увидеть её функции. Измените ее.',
            waitFor: { element: '#note-modal [data-action="save"]', event: 'click' }
        },
        {
            element: '.note-tile',
            text: "6. Нажмите ПКМ на заметку, наведите на 'Метаданные', чтобы увидеть дату создания и в каких коллекциях она состоит."
        },
        {
            element: '.note-tile',
            text: '7. Если просто задержать курсор над заметкой, появится подсказка с частью текста.'
        },
        {
            element: '.collection-item',
            text: '8. Теперь, кликните на коллекцию, чтобы посмотреть её содержимое.',
            waitFor: { element: '.collection-item', event: 'click' }
        },
        {
            element: '#collection-notes-grid .note-tile',
            text: '9. Чтобы убрать заметку из коллекции, просто перетащите её из панели и бросьте в отмеченном месте.',
            waitFor: { element: '#notes-grid', event: 'drop' }
        },
        {
            element: null,
            text: '10. Чтобы закрыть просмотр коллекции, кликните на пустое место по центру.',
            waitFor: { element: '.content-area', event: 'click' }
        },
        {
            element: '.note-tile',
            text: '12. Вы можете удалить заметку, перетащив её в корзину которая появится наверху.',
            waitFor: { element: '#drag-delete-zone', event: 'drop' }
        },
        {
            element: '.collection-item',
            text: '13. Вы также можете удалить коллекцию, просто перетащив её в корзину.',
            waitFor: { element: '#drag-delete-zone', event: 'drop' }
        },
        {
            element: '#options-btn',
            text: '14. Нажмите сюда, чтобы открыть меню опций.',
            waitFor: { element: '#options-btn', event: 'click' }
        },
        {
            element: '#hamburger-btn',
            text: "15. Это меню позволяет вам управлять Хранилищами — это отдельные рабочие пространства для ваших заметок."
        },
        {
            element: '#uncollected-filter-container',
            text: '16. Этот переключатель отфильтровывает заметки, которые не состоят ни в одной коллекции.'
        },
        { 
            element: null, 
            text: '17. Приятного пользования, извините!' 
        },
    ];
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---


        function formatDate(isoString) {
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}.${month}.${year} ${hours}:${minutes}`;
    }



// --- 👇 ЗАМЕНИТЕ ВСЮ ЭТУ ФУНКЦИЮ ---
    function createMetadataHtml(note, noteId) {
        // --- Блок 1: Даты (остается без изменений) ---
        const createdDate = `Created: ${formatDate(note.created_at)}`;
        let modifiedDateHtml = '';
        const createdTime = new Date(note.created_at).getTime();
        const modifiedTime = new Date(note.modified_at).getTime();
        
        if (modifiedTime - createdTime > 5000) {
            modifiedDateHtml = `<br>Modified: ${formatDate(note.modified_at)}`;
        }

        let dateHtml = `<div style="font-size: 0.9em; color: var(--text-color);">${createdDate}<i style="font-size: 0.9em; color: var(--text-color-dark);">${modifiedDateHtml}</i></div>`;


        // --- Блок 2: Поиск коллекций (НОВЫЙ) ---
        const noteCollections = Object.keys(state.collectionNotes).filter(collId => 
            state.collectionNotes[collId].includes(noteId)
        );
        
        let collectionsHtml = '';
        if (noteCollections.length > 0) {
            const listHtml = noteCollections.map(collId => `<span style="display: block; color: var(--text-color-dark); padding-left: 8px;">- ${state.collections[collId].name}</span>`).join('');
            collectionsHtml = `<div class="dropdown-divider"></div><div style="font-size: 0.9em; color: var(--text-color);">In collections:<div style="margin-top: 4px;">${listHtml}</div></div>`;
        }

        // --- Блок 3: Сборка финального HTML ---
        return dateHtml + collectionsHtml;
    }
// --- 👆 КОНЕЦ ЗАМЕНЫ ---

    function applyTranslations(lang) {
        state.settings.language = lang;
        const t = translations[lang];
        document.querySelectorAll('[data-translate]').forEach(el => {
            if (t[el.dataset.translate]) {
                el.textContent = t[el.dataset.translate];
            }
        });
        dom.searchInput.placeholder = t.searchPlaceholder;
        dom.noteModal.titleInput.placeholder = t.noteNamePlaceholder;
        dom.noteModal.contentInput.placeholder = t.noteContentPlaceholder;
        dom.collectionModal.nameInput.placeholder = t.collectionNamePlaceholder;
    }

// --- 👇 ЗАМЕНИТЕ ВСЮ ЭТУ ФУНКЦИЮ ---
    function applyTheme(base, accent) {
        // 1. Сохраняем выбор в локальном state
        state.settings.theme_base = base;
        state.settings.theme_accent = accent;

        // 2. Устанавливаем data-атрибуты на body, что меняет цвета через CSS
        document.body.dataset.themeBase = base;
        document.body.dataset.themeAccent = accent;

        // 3. Визуально обновляем "выбранные" пункты в меню
        // Сначала убираем все старые выделения
        document.querySelectorAll('#theme-submenu-container .selected').forEach(el => el.classList.remove('selected'));
        // Затем добавляем новые
        document.querySelector(`[data-theme-base="${base}"]`)?.classList.add('selected');
        document.querySelector(`.theme-dot[data-theme-accent="${accent}"]`)?.classList.add('selected');
    }
// --- 👆 КОНЕЦ ЗАМЕНЫ ---

// --- 👇 НОВЫЙ БЛОК ---
    function applyTextTheme(theme) {
        state.settings.theme_text = theme;
        document.body.dataset.themeText = theme;

        const textColorsContainer = document.getElementById('text-colors-container');
        if (textColorsContainer) {
            textColorsContainer.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
            textColorsContainer.querySelector(`[data-theme-text="${theme}"]`)?.classList.add('selected');
        }
    }
// --- 👆 КОНЕЦ НОВОГО БЛОКА ---

// --- 👇 ЗАМЕНИТЕ ЭТУ ФУНКЦИЮ ---
    function applyVisualStyle(styleKey) {
        const styleLink = document.getElementById('theme-style-link');
        const styleData = visualStyles[styleKey];
        
        if (styleData) {
            styleLink.href = styleData.file;
            state.settings.current_style = styleKey;
            
            // --- НОВАЯ ЛОГИКА: АВТО-ПЕРЕКЛЮЧЕНИЕ ТЕМЫ ---
            if (styleKey === 'sketch') {
                // Если тема темная, запоминаем ее и переключаем на светлую
                if (state.settings.theme_base === 'dark') {
                    previousThemeBase = 'dark';
                    applyTheme('light', state.settings.theme_accent);
                    // Важно: не сохраняем это изменение в settings, чтобы не перезаписать выбор пользователя навсегда
                }
            } else {
                // Если мы ушли со стиля sketch и у нас была сохранена темная тема
                if (previousThemeBase === 'dark') {
                    applyTheme('dark', state.settings.theme_accent);
                    previousThemeBase = null; // Сбрасываем
                }
            }
            // --- КОНЕЦ НОВОЙ ЛОГИКИ ---
            
            document.querySelectorAll('[data-visual-style]').forEach(el => {
                if (el.dataset.visualStyle === styleKey) {
                    el.classList.add('selected');
                } else {
                    el.classList.remove('selected');
                }
            });
        }
    }
// --- 👆 КОНЕЦ ЗАМЕНЫ ---

    function generateAccentColorButtons() {
        dom.accentColorsContainer.innerHTML = '';
        for (const [key, value] of Object.entries(accentThemes)) {
            const item = document.createElement('div');
            item.className = 'theme-dot';
            item.dataset.themeAccent = key;
            item.style.backgroundColor = value.color;
            item.title = value.name;
            dom.accentColorsContainer.appendChild(item);
        }
    }

// --- 👇 ЗАМЕНИТЕ ВСЕ ТРИ ФУНКЦИИ (`showCustomAlert`, `showCustomConfirm`, `showCustomPrompt`) НА ЭТОТ БЛОК ---
    const showCustomAlert = (titleKey, messageKey) => {
        const t = translations[state.settings.language];
        return new Promise(resolve => {
            dom.alertModal.querySelector('#alert-title').textContent = t[titleKey] || titleKey;
            dom.alertModal.querySelector('#alert-message').textContent = t[messageKey] || messageKey;
            const buttonsContainer = dom.alertModal.querySelector('#alert-buttons');
            buttonsContainer.innerHTML = ''; 
            const okBtn = document.createElement('button');
            okBtn.className = 'modal-btn accent';
            okBtn.textContent = t.ok;
            okBtn.onclick = () => { dom.alertModal.classList.remove('visible'); resolve(); };
            buttonsContainer.appendChild(okBtn);
            dom.alertModal.classList.add('visible');
        });
    };

    const showCustomConfirm = (titleKey, message, okTextKey, cancelTextKey, isDangerous = false) => {
        const t = translations[state.settings.language];
        return new Promise(resolve => {
            dom.alertModal.querySelector('#alert-title').textContent = t[titleKey] || titleKey;
            dom.alertModal.querySelector('#alert-message').textContent = message;
            const buttonsContainer = dom.alertModal.querySelector('#alert-buttons');
            buttonsContainer.innerHTML = '';
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'modal-btn';
            cancelBtn.textContent = t[cancelTextKey];
            cancelBtn.onclick = () => { dom.alertModal.classList.remove('visible'); resolve(false); };
            const okBtn = document.createElement('button');
            okBtn.className = `modal-btn ${isDangerous ? 'danger' : 'accent'}`;
            okBtn.textContent = t[okTextKey];
            okBtn.onclick = () => { dom.alertModal.classList.remove('visible'); resolve(true); };
            buttonsContainer.appendChild(cancelBtn);
            buttonsContainer.appendChild(okBtn);
            dom.alertModal.classList.add('visible');
        });
    };
    
    const showCustomPrompt = (titleKey, message, defaultValue = "") => {
        const t = translations[state.settings.language];
        return new Promise(resolve => {
            dom.promptModal.querySelector('#prompt-title').textContent = t[titleKey] || titleKey;
            dom.promptModal.querySelector('#prompt-message').textContent = message;
            const input = dom.promptModal.querySelector('#prompt-input');
            input.value = defaultValue;
            const buttonsContainer = dom.promptModal.querySelector('#prompt-buttons');
            buttonsContainer.innerHTML = '';
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'modal-btn';
            cancelBtn.textContent = t.cancel;
            cancelBtn.onclick = () => { dom.promptModal.classList.remove('visible'); resolve(null); };
            const okBtn = document.createElement('button');
            okBtn.className = 'modal-btn accent';
            okBtn.textContent = t.ok;
            okBtn.onclick = () => { dom.promptModal.classList.remove('visible'); resolve(input.value.trim()); };
            buttonsContainer.appendChild(cancelBtn);
            buttonsContainer.appendChild(okBtn);
            dom.promptModal.classList.add('visible');
            input.focus(); input.select();
        });
    };
// --- 👆 КОНЕЦ ЗАМЕНЫ ---

    // --- 4. Функции рендеринга и обновления DOM ---
    function createNoteTileElement(noteId) {
        const note = state.notes[noteId];
        if (!note) return null;
        const tile = document.createElement('div');
        tile.className = 'note-tile';
        tile.dataset.id = noteId;
        tile.setAttribute('draggable', 'true');
        const content = state.notePreviews[noteId] || '';
        tile.innerHTML = `<div class="note-title" data-name="${note.title.replace(/"/g, '&quot;')}">${note.title}</div><div class="note-text">${content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>`;
        return tile;
    }
    
// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    function createCollectionGroupElement(collId) {
        const collection = state.collections[collId];
        if (!collection) return null;

        // Создаем контейнер-обертку
        const group = document.createElement('div');
        group.className = 'collection-group';
        group.dataset.groupId = collId;

        // Сама кнопка коллекции
        const item = document.createElement('div');
        item.className = 'collection-item';
        if (collection.parentId) item.classList.add('subcollection');
        item.dataset.id = collId;
        item.setAttribute('draggable', 'true');

        // УСЛОВИЕ: Дефис теперь имеет уменьшенную ширину и отрицательный отступ справа
        const iconOrDash = collection.parentId 
            ? `<span style="color: var(--text-color-dark); font-weight: 400; font-size: 1em; display: flex; align-items: center; justify-content: center; width: 10px; margin-right: -6px;">-</span>` 
            : `<img src="icons/${collection.icon}" class="icon">`;

        // Внутренности кнопки
        item.innerHTML = `
            <span class="expander-icon">▶</span>
            ${iconOrDash}
            <span data-name="${collection.name}">${collection.name}</span>
            <span class="note-count">0</span>
        `;
        group.appendChild(item);

        // Контейнер для детей (подколлекций)
        if (!collection.parentId) {
            const subsList = document.createElement('div');
            subsList.className = 'subcollections-list';
            group.appendChild(subsList);
        }

        return group;
    }
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    function addNoteToDOM(noteId, animate = false) {
        const tile = createNoteTileElement(noteId);
        if (tile) {
            if (animate) {
                tile.classList.add('newly-added-note');
                dom.notesGrid.prepend(tile);
                
                tile.addEventListener('animationend', function handler(e) {
                    // Умная проверка: проверяем, что анимация закончилась именно на самой плитке,
                    // независимо от того, как эта анимация называется в CSS!
                    if (e.target === tile) {
                        tile.classList.remove('newly-added-note');
                        highlightElement(tile);
                        tile.removeEventListener('animationend', handler);
                    }
                });
            } else {
                dom.notesGrid.prepend(tile);
            }
        }
    }
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    
    function removeNoteFromDOM(noteId) {
        const tile = dom.notesGrid.querySelector(`.note-tile[data-id="${noteId}"]`);
        if (tile) {
            // Запускаем текучее сжатие
            tile.classList.add('fluid-removing');
            tile.addEventListener('animationend', () => {
                tile.remove(); // Удаляем из DOM только когда ширина стала 0
            }, { once: true });
        }
        
        const collectionTile = dom.collectionView.grid.querySelector(`.note-tile[data-id="${noteId}"]`);
        if (collectionTile) {
            collectionTile.classList.add('fluid-removing');
            collectionTile.addEventListener('animationend', () => {
                collectionTile.remove();
            }, { once: true });
        }
    }
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    
// --- 👇 ЗАМЕНА ДЛЯ ПУНКТА 3 ---
    function updateNoteInDOM(noteId) {
        const note = state.notes[noteId];
        const preview = state.notePreviews[noteId] || '';
        
        const mainTile = dom.notesGrid.querySelector(`.note-tile[data-id="${noteId}"]`);
        if (mainTile) {
            const titleEl = mainTile.querySelector('.note-title');
            if (titleEl) {
                titleEl.textContent = note.title;
                titleEl.dataset.name = note.title;
            }
            const textEl = mainTile.querySelector('.note-text');
            if (textEl) textEl.textContent = preview;
        }
        
        const collectionTile = dom.collectionView.grid.querySelector(`.note-tile[data-id="${noteId}"]`);
        if (collectionTile) {
            const titleEl = collectionTile.querySelector('.note-title');
            if (titleEl) {
                titleEl.textContent = note.title;
                titleEl.dataset.name = note.title;
            }
            const textEl = collectionTile.querySelector('.note-text');
            if (textEl) textEl.textContent = preview;
        }
    }
// --- 👆 КОНЕЦ ЗАМЕНЫ ---
    
// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    function addCollectionToDOM(collId, animate = false) {
        const collection = state.collections[collId];
        const groupElement = createCollectionGroupElement(collId);
        
        if (!groupElement) return;

        if (collection.parentId) {
            // Это подколлекция. Ищем родителя и добавляем в его список
            const parentGroup = dom.collectionsList.querySelector(`.collection-group[data-group-id="${collection.parentId}"]`);
            if (parentGroup) {
                const subsList = parentGroup.querySelector('.subcollections-list');
                subsList.appendChild(groupElement);
                parentGroup.classList.add('has-children');
                
                // ИСПРАВЛЕНИЕ: Раскрываем родителя ТОЛЬКО если пользователь прямо сейчас создал эту подколлекцию (animate = true).
                // При загрузке страницы (animate = false) папки останутся закрытыми.
                if (animate) {
                    parentGroup.classList.add('expanded'); 
                }
            }
        } else {
            // Это главная коллекция. Добавляем в основной список
            dom.collectionsList.appendChild(groupElement);
        }

        if (animate) {
            groupElement.querySelector('.collection-item').classList.add('newly-added');
            groupElement.addEventListener('animationend', () => groupElement.querySelector('.collection-item').classList.remove('newly-added'), {once: true});
        }
    }
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    
    function removeCollectionFromDOM(collId, animate = false) {
        const item = dom.collectionsList.querySelector(`.collection-item[data-id="${collId}"]`);
        if (item) {
             if (animate) {
                item.classList.add('fading-out');
                item.addEventListener('transitionend', () => item.remove());
            } else {
                item.remove();
            }
        }
    }

    function updateCounters() {
        const t = translations[state.settings.language];
        const totalNotes = Object.keys(state.notes).length;
        const totalEl = document.querySelector('.workspace-header .note-count-total');
        if (totalEl) {
            totalEl.textContent = `(${t.total}: ${totalNotes})`;
        }

            document.querySelectorAll('#collections-list .collection-item').forEach(item => {
            const collId = item.dataset.id;
            if (collId) {
                const countEl = item.querySelector('.note-count');
                let count = state.collectionNotes[collId] ? state.collectionNotes[collId].length : 0;
                
                // Приплюсовываем заметки из всех подколлекций этой коллекции
                Object.keys(state.collections).forEach(childId => {
                    if (state.collections[childId].parentId === collId) {
                        count += state.collectionNotes[childId] ? state.collectionNotes[childId].length : 0;
                    }
                });

                if (countEl) countEl.textContent = count;
            }
        });

    }

    function updateCollectionInDOM(collId) {
        const collection = state.collections[collId];
        const item = dom.collectionsList.querySelector(`.collection-item[data-id="${collId}"]`);
        if (item) {
            const nameSpan = item.querySelector('span[data-name]');
            if (nameSpan) {
                nameSpan.textContent = collection.name;
                nameSpan.dataset.name = collection.name;
            }
        }
        if (currentOpenCollectionId === collId) {
            dom.collectionView.title.textContent = collection.name;
        }
    }
    
// --- 👇 ЗАМЕНИТЕ ВСЮ ФУНКЦИЮ НА ЭТОТ БЛОК ---
    function renderFullUI() {
        // Очистка
        dom.notesGrid.innerHTML = '<div class="empty-state-container"><p data-translate="emptyStateMessage"></p></div><div id="notes-grid-curtain"></div>';
        dom.collectionsList.innerHTML = ''; 
        dom.hamburgerMenu.innerHTML = '';
        
        // Рендеринг
        dom.vaultDisplay.textContent = state.settings.current_vault;
        dom.vaultDisplay.title = state.settings.current_vault;
        
        const noteIds = Object.keys(state.notes);

        if (noteIds.length > 0) {
            dom.notesGrid.classList.remove('is-empty');
            document.body.classList.remove('no-notes-present');
            
            // --- ИЗМЕНЕННАЯ ЛОГИКА ---
            // 1. Сортируем как и раньше (от новой к старой)
            const sortedNoteIds = noteIds.sort((a, b) => new Date(state.notes[b].modified_at) - new Date(state.notes[a].modified_at));
            
            // 2. Создаем и ДОБАВЛЯЕМ В КОНЕЦ (appendChild)
            sortedNoteIds.forEach(noteId => {
                const tile = createNoteTileElement(noteId);
                if (tile) {
                    dom.notesGrid.appendChild(tile);
                }
            });
            // --- КОНЕЦ ИЗМЕНЕНИЙ ---

        } else {
            dom.notesGrid.classList.add('is-empty');
            document.body.classList.add('no-notes-present');
        }

        // Сначала рендерим основные коллекции (родителей)
        Object.keys(state.collections).forEach(collId => {
            if (!state.collections[collId].parentId) addCollectionToDOM(collId);
        });
        
        // Затем рендерим подколлекции (детей)
        Object.keys(state.collections).forEach(collId => {
            if (state.collections[collId].parentId) addCollectionToDOM(collId);
        });
        
        const t = translations[state.settings.language];
        let hamburgerHTML = `<div class="dropdown-menu-item" id="add-vault-btn" data-translate="addVault">${t.addVault}</div><div class="dropdown-menu-item" id="rename-vault-btn" data-translate="renameVault">${t.renameVault}</div><div class="dropdown-menu-item" id="delete-vault-btn" data-translate="deleteVault">${t.deleteVault}</div><div class="dropdown-divider"></div><div class="dropdown-menu-item" id="import-vault-btn" data-translate="importVault">${t.importVault}</div><div class="dropdown-menu-item" id="backup-vault-btn" data-translate="exportVault">${t.exportVault}</div>`;
        
        if (state.vaults.length > 1) {
            hamburgerHTML += `<div class="dropdown-divider"></div><div class="dropdown-header" data-translate="switchVault">${t.switchVault}</div>`;
            state.vaults.forEach(vault => {
                if (vault !== state.settings.current_vault) {
                    hamburgerHTML += `<div class="dropdown-menu-item vault-item" data-vault="${vault}">${vault}</div>`;
                }
            });
        }

        dom.hamburgerMenu.innerHTML = hamburgerHTML;
        
        applyTranslations(state.settings.language);
        updateCounters(); // <--- Убедимся, что счетчики обновляются
    }
    
    async function renderCollectionView(collId) {
        const collection = state.collections[collId];
        const notesInCollection = state.collectionNotes[collId] || [];
        dom.collectionView.title.textContent = collection.name;
        dom.collectionView.grid.innerHTML = '';
        if (notesInCollection.length > 0) {
            await Promise.all(notesInCollection.map(async (noteId) => {
                if (state.notes[noteId] && state.noteContentsCache[noteId] === undefined) {
                    const content = await eel.get_note_content(noteId)();
                    state.noteContentsCache[noteId] = content;
                }
            }));
            notesInCollection.forEach(noteId => {
                if (state.notes[noteId]) {
                    const tile = createNoteTileElement(noteId);
                    if (tile) dom.collectionView.grid.appendChild(tile);
                }
            });
        } else {
            const t = translations[state.settings.language];
            dom.collectionView.grid.innerHTML = `<p class="empty-message">${t.emptyCollection}</p>`;
        }
        document.querySelectorAll('.collection-item.selected').forEach(el => el.classList.remove('selected'));
        dom.collectionsList.querySelector(`.collection-item[data-id="${collId}"]`)?.classList.add('selected');
    }
    
    function closeCollectionView() {
        currentOpenCollectionId = null;
        document.querySelectorAll('.collection-item.selected').forEach(el => el.classList.remove('selected'));
        dom.collectionView.grid.classList.remove('is-shown');

        dom.notesGridCurtain.classList.add('active');
        setTimeout(() => {
            dom.collectionView.panel.classList.remove('visible');
            dom.notesGrid.classList.remove('shifted');
            dom.notesGridCurtain.classList.remove('active');
        }, 200);
    }

    // --- 5. Управление UI (модалки, меню) ---
    function showLoader() { dom.loadingOverlay.classList.add('visible'); }
    function hideLoader() { dom.loadingOverlay.classList.remove('visible'); }

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    function showNotification(messageKey) {
        if (messageKey === 'noteDeleted' || messageKey === 'collectionDeleted') {
            SoundManager.play('delete');
        } else {
            SoundManager.play('success');
        }

        const t = translations[state.settings.language];
        const notification = dom.notification;

        // Сбрасываем старые таймеры и классы
        clearTimeout(notificationTimer);
        notification.classList.remove('show');
        notification.classList.remove('hide');
        notification.onanimationend = null; // Очищаем старые слушатели

        notification.textContent = t[messageKey] || messageKey;

        // Принудительный рефлоу для перезапуска анимации
        void notification.offsetWidth; 
        
        notification.classList.add('show');

        // Ждем 1.5 секунды, затем запускаем анимацию скрытия
        notificationTimer = setTimeout(() => {
            notification.classList.remove('show');
            notification.classList.add('hide');
            
            // Как только уехало - полностью сбрасываем
            notification.onanimationend = () => {
                notification.classList.remove('hide');
                notification.onanimationend = null;
            };
        }, 1500); // 1.5 секунды на экране
    }
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    
// --- 👇 ЗАМЕНА ДЛЯ ПУНКТА 5 ---
    function showDropdown(menu, button) {
        const rect = button.getBoundingClientRect();
        
        // Учитываем смещение главной стеклянной панели (main-panel)
        const parentPanel = document.querySelector('.main-panel');
        const parentRect = parentPanel.getBoundingClientRect();
        
        // Вычисляем позицию строго относительно панели
        menu.style.top = `${rect.bottom - parentRect.top + 5}px`;
        
        if (menu === dom.optionsMenu) {
            menu.style.left = 'auto';
            menu.style.right = `${parentRect.right - rect.right}px`;
        } else {
            menu.style.right = 'auto';
            menu.style.left = `${rect.left - parentRect.left}px`;
        }
        
        menu.classList.add('visible');
    }
// --- 👆 КОНЕЦ ЗАМЕНЫ ---
    
// --- 👇 ЗАМЕНИТЕ ОБЕ ФУНКЦИИ НА ЭТИ ВЕРСИИ ---
    async function openNoteModal(noteId = null) {
        currentEditingNoteId = noteId;
        const t = translations[state.settings.language];
        
        dom.noteModal.title.textContent = noteId ? t.editNote : t.newNote;
        dom.noteModal.saveBtn.textContent = t.ok;
        dom.noteModal.cancelBtn.textContent = t.cancel;

        if (noteId) {
            const note = state.notes[noteId];
            initialNoteTitle = note.title; // Сохраняем исходное
            dom.noteModal.titleInput.value = note.title;
            
            if (state.noteContentsCache[noteId] !== undefined) {
                initialNoteContent = state.noteContentsCache[noteId]; // Сохраняем исходное
                dom.noteModal.contentInput.value = initialNoteContent;
            } else {
                dom.noteModal.contentInput.value = 'Loading...';
                const content = await eel.get_note_content(noteId)();
                state.noteContentsCache[noteId] = content;
                initialNoteContent = content; // Сохраняем исходное
                dom.noteModal.contentInput.value = content;
            }
        } else {
            // Для новой заметки исходное состояние - пустое
            initialNoteTitle = '';
            initialNoteContent = '';
            dom.noteModal.titleInput.value = '';
            dom.noteModal.contentInput.value = '';
        }
        
        dom.noteModal.el.classList.add('visible');
        dom.noteModal.titleInput.focus();
    }
    
    // --- 👇 ЗАМЕНИТЕ ВСЮ ФУНКЦИЮ НА ЭТУ ---

    async function closeNoteModal() {
        const currentTitle = dom.noteModal.titleInput.value;
        const currentContent = dom.noteModal.contentInput.value;

        // Проверяем, были ли изменения
        if (currentTitle !== initialNoteTitle || currentContent !== initialNoteContent) {
            const t = translations[state.settings.language];
            const confirmed = await showCustomConfirm(
                'unsavedChangesTitle',
                t.unsavedChangesMessage,
                'discard', // "Сбросить"
                'cancel',  // "Отмена"
                true
            );

            // Если пользователь нажал "Отмена" в диалоге, прерываем выход
            if (!confirmed) {
                return;
            }
        }
        
        // Если изменений не было ИЛИ пользователь подтвердил сброс, закрываем окно
        dom.noteModal.el.classList.remove('visible');
        currentEditingNoteId = null;
        initialNoteTitle = '';
        initialNoteContent = '';
    }
    // --- 👆 КОНЕЦ ЗАМЕНЫ ---

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    dom.selectionToolbar.addEventListener('click', async (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        const action = button.dataset.action;
        const t = translations[state.settings.language];
        const selectedIds = Array.from(selectedNoteIds);

        if (button.id === 'selection-done-btn') {
            deactivateSelectionMode();
            return;
        }

        if (action === 'delete-selected') {
            if (await showCustomConfirm('deleteNoteTitle', t.deleteNotesMessage(selectedIds.length), 'deleteAction', 'cancel', true)) {
                const result = await eel.delete_notes_batch(selectedIds)();
                if (result.success) {
                    result.deleted_ids.forEach(id => {
                        delete state.notes[id];
                        delete state.noteContentsCache[id];
                        Object.keys(state.collectionNotes).forEach(cId => {
                            state.collectionNotes[cId] = state.collectionNotes[cId].filter(nId => nId !== id);
                        });
                        removeNoteFromDOM(id);
                    });
                    updateCounters();
                    showNotification('noteDeleted');
                }
                deactivateSelectionMode();
            }
        } 
        else if (action === 'add-to-collection') {
            const menuItems = [];
            Object.keys(state.collections).forEach(collId => {
                menuItems.push({ 
                    label: state.collections[collId].name, 
                    action: `batch-add-to-${collId}` 
                });
            });
            showContextMenu(e, menuItems, true);
        } 
        else if (action === 'move-to-vault') {
            const menuItems = [];
            const otherVaults = state.vaults.filter(v => v !== state.settings.current_vault);

            if (otherVaults.length > 0) {
                menuItems.push({ type: 'header', labelKey: 'copyToAction' });
                otherVaults.forEach(vaultName => {
                    menuItems.push({ label: vaultName, action: `batch-copy-to-${vaultName}` });
                });
                
                menuItems.push({ type: 'divider' });

                menuItems.push({ type: 'header', labelKey: 'moveToAction' });
                otherVaults.forEach(vaultName => {
                    menuItems.push({ label: vaultName, action: `batch-move-to-${vaultName}` });
                });
                
                showContextMenu(e, menuItems, true);
            } else {
                await showCustomAlert('Info', 'No other vaults available to move or copy notes to.');
                deactivateSelectionMode();
            }
        }
    });
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

    function openCollectionModal() {
        const t = translations[state.settings.language];
        dom.collectionModal.el.querySelector('h3').textContent = t.newCollection;
        dom.collectionModal.saveBtn.textContent = t.ok;
        dom.collectionModal.cancelBtn.textContent = t.cancel;
        dom.collectionModal.nameInput.value = '';
        dom.collectionModal.el.classList.add('visible');
        dom.collectionModal.nameInput.focus();
    }

    function closeCollectionModal() {
        dom.collectionModal.el.classList.remove('visible');
    }

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    function activateSelectionMode(noteId) {
        isSelectionModeActive = true;
        selectedNoteIds.clear();
        selectedNoteIds.add(noteId);

        document.querySelectorAll('.note-tile.is-selected').forEach(t => t.classList.remove('is-selected'));
        
        // --- НОВАЯ ЛОГИКА С ЗАДЕРЖКОЙ ---
        // Даем DOM мгновение, чтобы "прийти в себя" после закрытия контекстного меню
        setTimeout(() => {
            const tile = document.querySelector(`.note-tile[data-id="${noteId}"]`);
            if (tile) {
                tile.classList.add('is-selected');
            }
        }, 30);
        // --- КОНЕЦ НОВОЙ ЛОГИКИ ---
        
        dom.selectionToolbar.classList.remove('hidden');
        updateSelectionCounter();
    }
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

    function deactivateSelectionMode() {
        isSelectionModeActive = false;
        selectedNoteIds.clear();
        document.querySelectorAll('.note-tile.is-selected').forEach(t => t.classList.remove('is-selected'));
        dom.selectionToolbar.classList.add('hidden');
    }

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    function updateSelectionCounter() {
        const count = selectedNoteIds.size;
        const t = translations[state.settings.language];
        dom.selectionCounter.textContent = `${t.selected}: ${count}`;
    }
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

// --- 👇 НОВЫЙ БЛОК: ФУНКЦИИ ДЛЯ "ПРИЗРАКА" ---
    let emptyImage = new Image(); // Пустое изображение для скрытия стандартного призрака
    emptyImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    function createDragGhost(count) {
        const ghost = dom.dragGhost;
        ghost.innerHTML = ''; // Очищаем

        const numTiles = Math.min(count, 3); // Показываем максимум 3 плитки
        for (let i = 0; i < numTiles; i++) {
            const tile = document.createElement('div');
            tile.className = 'ghost-tile';
            ghost.appendChild(tile);
        }

        if (count > 1) {
            const counter = document.createElement('div');
            counter.className = 'ghost-counter';
            counter.textContent = `+${count - 1}`;
            ghost.appendChild(counter);
        }
    }

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    function updateDragGhostPosition(e) {
        // Увеличили отступы от курсора (с 15px до 25px вправо и 30px вниз),
        // чтобы курсор не перекрывал счетчик или верхний угол призрака
        dom.dragGhost.style.left = `${e.clientX + 25}px`;
        dom.dragGhost.style.top = `${e.clientY + 30}px`;
    }
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

// --- 👆 КОНЕЦ НОВОГО БЛОКА ---

    // --- 👇 НОВЫЙ БЛОК ---
    function pointToTutorialButton() {
        const pointer = document.getElementById('tutorial-pointer');
        const optionsBtnRect = dom.optionsBtn.getBoundingClientRect();
        
        // Позиционируем указатель точно над кнопкой
        pointer.style.top = `${optionsBtnRect.top + optionsBtnRect.height / 2 - 20}px`;
        pointer.style.left = `${optionsBtnRect.left + optionsBtnRect.width / 2 - 20}px`;

        // Показываем с анимацией
        pointer.classList.add('visible');

        // Показываем текстовое уведомление
        showNotification('tutorialReminder');

        // Прячем указатель после завершения анимации
        setTimeout(() => {
            pointer.classList.remove('visible');
        }, 6000); // 2 секунды на анимацию * 3 раза
    }
// --- 👆 КОНЕЦ НОВОГО БЛОКА ---

    function hideHamburgerMenuAnimated() {
        const menu = dom.hamburgerMenu;
        if (!menu.classList.contains('visible') || menu.classList.contains('is-closing')) {
            return;
        }
        menu.classList.add('is-closing');
        // УМНАЯ ПРОВЕРКА: Слушатель сработает, только если меню все еще закрывается
        menu.addEventListener('animationend', () => {
            if (menu.classList.contains('is-closing')) {
                menu.classList.remove('visible');
                menu.classList.remove('is-closing');
            }
        }, { once: true });
    }

    // --- 👇 ВСТАВЬТЕ ЭТОТ НЕДОСТАЮЩИЙ БЛОК ---
    // Вспомогательная функция, которая прячет все, КРОМЕ контекстного меню.
    function hideOtherMenus() {
        hideHamburgerMenuAnimated();
        hideOptionsMenuAnimated();
    }
    // --- 👆 КОНЕЦ НОВОГО БЛОКА ---

// --- 👇 ЗАМЕНИТЕ ВСЮ ФУНКЦИЮ НА ЭТОТ БЛОК ---
    function hideOptionsMenuAnimated() {
        const menu = dom.optionsMenu;
        if (!menu.classList.contains('visible') || menu.classList.contains('is-closing')) {
            return;
        }

        menu.querySelectorAll('.submenu').forEach(submenu => {
            clearTimeout(submenu.hideTimer);
            submenu.classList.remove('visible');
            submenu.classList.remove('is-closing');
        });

        menu.classList.add('is-closing');
        // УМНАЯ ПРОВЕРКА: Слушатель сработает, только если меню все еще закрывается
        menu.addEventListener('animationend', () => {
            if (menu.classList.contains('is-closing')) {
                menu.classList.remove('visible');
                menu.classList.remove('is-closing');
            }
        }, { once: true });
    }
// --- 👆 КОНЕЦ ЗАМЕНЫ ---
    
// --- 👇 ЗАМЕНИТЕ ВСЮ ФУНКЦИЮ НА ЭТОТ БЛОК ---
    function hideAllAnimatedMenus() {
        hideHamburgerMenuAnimated();
        hideOptionsMenuAnimated();
        hideContextMenuAnimated(); // <--- ИЗМЕНЕНО
    }
// --- 👆 КОНЕЦ ЗАМЕНЫ ---

    // --- 6. Обработчики событий ---

    dom.selectionDoneBtn.addEventListener('click', deactivateSelectionMode);


// --- 👇 ЗАМЕНИТЕ ВЕСЬ БЛОК С MOUSENTRAP НА ЭТОТ ---

    // --- ПРАВИЛЬНАЯ ОБРАБОТКА ГОРЯЧИХ КЛАВИШ С MOUSENTRAP ---

    Mousetrap.bind('mod+n', () => {
        openNoteModal();
        return false;
    });

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    Mousetrap.bind('mod+s', () => {
        // Если открыто окно редактирования/создания заметки
        if (dom.noteModal.el.classList.contains('visible')) {
            dom.noteModal.saveBtn.click();
        } 
        // Если открыто окно создания коллекции (или подколлекции)
        else if (dom.collectionModal.el.classList.contains('visible')) {
            dom.collectionModal.saveBtn.click();
        }
        return false;
    });
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

    Mousetrap.bind('mod+f', () => {
        dom.searchInput.focus();
        dom.searchInput.select();
        return false;
    });

    Mousetrap.bind('esc', () => {
        // --- НОВАЯ ЛОГИКА: Сначала проверяем режим выделения ---
        if (isSelectionModeActive) {
            deactivateSelectionMode();
        } 
        // --- КОНЕЦ НОВОЙ ЛОГИКИ ---
        else if (dom.noteModal.el.classList.contains('visible')) {
            closeNoteModal();
        } else if (dom.collectionModal.el.classList.contains('visible')) {
            closeCollectionModal();
        } else if (dom.alertModal.classList.contains('visible')) {
            dom.alertModal.classList.remove('visible');
        } else if (dom.promptModal.classList.contains('visible')) {
            dom.promptModal.classList.remove('visible');
        }
        return false;
    });

    // --- 👇 ВСТАВИТЬ ДЛЯ ПУНКТА 1 ---
    function highlightElement(element) {
        if (!element) return;
        element.classList.add('is-highlighted');
        element.addEventListener('animationend', () => {
            element.classList.remove('is-highlighted');
        }, { once: true });
    }
// --- 👆 КОНЕЦ ВСТАВКИ ---


// --- 👆 КОНЕЦ ЗАМЕНЫ ---

    // --- 👇 НОВЫЙ БЛОК ---
    function highlightElement(element) {
        if (!element) return;
        
        element.classList.add('is-highlighted');
        element.addEventListener('animationend', () => {
            element.classList.remove('is-highlighted');
        }, { once: true });
    }
    // --- 👆 КОНЕЦ НОВОГО БЛОКА ---


// --- 👇 ЗАМЕНИТЕ ВСЮ ЭТУ ФУНКЦИЮ НА ЭТОТ БЛОК ---
    function applyFilters() {
        const searchTerm = dom.searchInput.value.toLowerCase().trim();
        const uncollectedOnly = dom.uncollectedFilterToggle.checked;

        // --- УМНАЯ ЛОГИКА ПОИСКА ---
        // 1. Разбиваем поисковый запрос на отдельные слова.
        //    Фильтруем пустые строки, если пользователь ввел несколько пробелов.
        const searchWords = searchTerm.split(/\s+/).filter(word => word.length > 0);
        // --- КОНЕЦ НОВОЙ ЛОГИКИ ---

        let collectedNotesSet;
        if (uncollectedOnly) {
            collectedNotesSet = new Set(Object.values(state.collectionNotes).flat());
        }

        document.querySelectorAll('#notes-grid .note-tile').forEach(tile => {
            const noteId = tile.dataset.id;
            const title = tile.querySelector('.note-title').textContent.toLowerCase();
            
            // --- УМНАЯ ЛОГИКА ПОИСКА ---
            // 2. Проверяем, что КАЖДОЕ слово из поиска есть в заголовке.
            const searchMatch = searchWords.every(word => title.includes(word));
            // --- КОНЕЦ НОВОЙ ЛОГИКИ ---

            let uncollectedMatch = true;
            if (uncollectedOnly) {
                uncollectedMatch = !collectedNotesSet.has(noteId);
            }

            if (searchMatch && uncollectedMatch) {
                tile.style.display = 'flex';
            } else {
                tile.style.display = 'none';
            }
        });
    }
// --- 👆 КОНЕЦ ЗАМЕНЫ ---

    dom.newNoteBtn.addEventListener('click', () => { openNoteModal(); });
    dom.addCollectionBtn.addEventListener('click', () => { openCollectionModal(); });


// --- 👇 ЗАМЕНИТЕ ВЕСЬ ЭТОТ ОБРАБОТЧИК НА ЭТОТ БЛОК ---
    dom.noteModal.saveBtn.addEventListener('click', async () => {
        const title = dom.noteModal.titleInput.value.trim();
        const content = dom.noteModal.contentInput.value;
        if (!title) { return await showCustomAlert('inputError', 'titleRequired'); }

        dom.noteModal.el.classList.remove('visible');

        if (currentEditingNoteId) {
            const result = await eel.update_note(currentEditingNoteId, title, content)();
            if (result) {
                // 1. Обновляем данные в state
                state.notes[result.id] = result.data;
                state.noteContentsCache[result.id] = content;
                state.notePreviews[result.id] = content.substring(0, 150).replace(/\n/g, ' ');
                
                // 2. Обновляем текст на самой плитке
                updateNoteInDOM(result.id);
                
                const tile = dom.notesGrid.querySelector(`.note-tile[data-id="${result.id}"]`);


                // 4. Подсвечиваем плитку и показываем уведомление
                highlightElement(tile);
                showNotification('noteUpdated');
            }
        } else {
            // Логика создания новой заметки (остается без изменений)
            const wasEmpty = Object.keys(state.notes).length === 0;
            const result = await eel.create_note(title, content)();
            if (result) {
                state.notes[result.id] = result.data;
                state.noteContentsCache[result.id] = content;
                state.notePreviews[result.id] = content.substring(0, 150).replace(/\n/g, ' ');
                
                if (wasEmpty) {
                    dom.notesGrid.classList.remove('is-empty');
                    document.body.classList.remove('no-notes-present');
                }
                
                addNoteToDOM(result.id, true);
                updateCounters();
                showNotification('noteCreated');
            }
        }
        
        currentEditingNoteId = null;
        initialNoteTitle = '';
        initialNoteContent = '';
    });
// --- 👆 КОНЕЦ ЗАМЕНЫ ---

    dom.noteModal.cancelBtn.addEventListener('click', closeNoteModal);
    
    async function closeNoteModal() {
        const currentTitle = dom.noteModal.titleInput.value;
        const currentContent = dom.noteModal.contentInput.value;

        if (currentTitle !== initialNoteTitle || currentContent !== initialNoteContent) {
            const t = translations[state.settings.language];
            const confirmed = await showCustomConfirm(
                'unsavedChangesTitle',
                t.unsavedChangesMessage,
                'discard',
                'cancel',
                true
            );

            if (!confirmed) {
                return;
            }
        }
        
        dom.noteModal.el.classList.remove('visible');
        currentEditingNoteId = null;
        initialNoteTitle = '';
        initialNoteContent = '';
    }


// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    dom.collectionModal.saveBtn.addEventListener('click', async () => {
        const name = dom.collectionModal.nameInput.value.trim();
        if (!name) { return await showCustomAlert('inputError', 'collectionNameRequired'); }
        
        // Передаем parentIdForNewSubcollection на бэкенд (если он есть)
        const result = await eel.create_collection(name, parentIdForNewSubcollection)();
        
        if (result) {
            state.collections[result.id] = result.data;
            state.collectionNotes[result.id] = [];
            
            // Если мы создали подколлекцию, нужно добавить стрелочку раскрытия (класс has-children) родительской папке
            if (parentIdForNewSubcollection) {
                const parentGroup = dom.collectionsList.querySelector(`.collection-group[data-group-id="${parentIdForNewSubcollection}"]`);
                if (parentGroup && !parentGroup.classList.contains('has-children')) {
                    parentGroup.classList.add('has-children');
                }
            }
            
            addCollectionToDOM(result.id, true);
            showNotification('collectionCreated');
        }
        
        // Обязательно сбрасываем глобальную переменную после создания!
        parentIdForNewSubcollection = null; 
        closeCollectionModal();
    });
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

    dom.collectionModal.cancelBtn.addEventListener('click', () => {
        parentIdForNewSubcollection = null;
        closeCollectionModal();
    });
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    


// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    async function handleNoteClick(event) {
        const tile = event.target.closest('.note-tile');
        if (!tile) return;
        const noteId = tile.dataset.id;

        if (isSelectionModeActive) {
            SoundManager.play('click'); // <-- ЗВУК ВЫДЕЛЕНИЯ
            if (selectedNoteIds.has(noteId)) {
                selectedNoteIds.delete(noteId);
                tile.classList.remove('is-selected');
            } else {
                selectedNoteIds.add(noteId);
                tile.classList.add('is-selected');
            }
            updateSelectionCounter();

            if (selectedNoteIds.size === 0) {
                deactivateSelectionMode();
            }
            return;
        }

        if (!dom.contextMenu.classList.contains('visible')) {
            let fullContent = state.noteContentsCache[noteId];
            if (fullContent === undefined) {
                fullContent = await eel.get_note_content(noteId)();
                state.noteContentsCache[noteId] = fullContent;
            }
            
            navigator.clipboard.writeText(fullContent);
            showNotification('copied'); // Звук 'success' сработает внутри showNotification
        }
    }
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    
    dom.notesGrid.addEventListener('click', handleNoteClick);
    dom.collectionView.grid.addEventListener('click', handleNoteClick);
    
// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    // Действия при клике на любое свободное место
    dom.contentArea.addEventListener('click', (e) => {
        // Если кликнули по самой заметке - прерываемся, пусть работает логика копирования
        if (e.target.closest('.note-tile')) {
            return;
        }

        // Действие 1: Закрываем правую шторку с содержимым коллекции (если она открыта)
        if (currentOpenCollectionId) {
            closeCollectionView();
        } 
        // Действие 2: ИНАЧЕ, если шторка закрыта, сворачиваем раскрытое дерево подколлекций слева
        else {
            const expandedGroup = document.querySelector('.collection-group.expanded');
            if (expandedGroup) {
                expandedGroup.classList.remove('expanded');
            }
        }
    });
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---


    const hideTooltip = () => {
        clearTimeout(tooltipTimer);
        dom.noteTooltip.classList.remove('visible');
    };
    
// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    const handleNoteMouseOver = (e) => {
        const tile = e.target.closest('.note-tile');
        if (!tile) return;
        
        // --- 👇 ЗАЩИТА ОТ ТУЛТИПА ПРИ ОТКРЫТОМ МЕНЮ ---
        if (dom.contextMenu.classList.contains('visible')) {
            return; 
        }
        // --- 👆 КОНЕЦ ЗАЩИТЫ ---
        
        // Определяем, на что именно навели: на заголовок или на остальную часть карточки
        const isHoveringTitle = e.target.closest('.note-title');
        
        tooltipTimer = setTimeout(async () => {
            const tooltip = dom.noteTooltip;
            
            if (isHoveringTitle) {
                // ПОКАЗЫВАЕМ ПОЛНЫЙ ЗАГОЛОВОК
                const titleText = isHoveringTitle.dataset.name;
                if (!titleText) return;
                
                tooltip.textContent = titleText;
                tooltip.classList.add('metadata-tooltip'); // Делаем тултип компактным (как для коллекций)
                
            } else {
                // ПОКАЗЫВАЕМ СОДЕРЖИМОЕ ЗАМЕТКИ
                const noteId = tile.dataset.id;
                let content = state.noteContentsCache[noteId];
                if (content === undefined) {
                    content = await eel.get_note_content(noteId)();
                    state.noteContentsCache[noteId] = content;
                }
                if (!content) return;
                
                tooltip.textContent = content.substring(0, 750);
                tooltip.classList.remove('metadata-tooltip'); // Обычный широкий тултип
            }

            tooltip.classList.add('visible');

            // --- Позиционирование ---
            const { offsetWidth: tooltipWidth, offsetHeight: tooltipHeight } = tooltip;
            const { clientX: mouseX, clientY: mouseY } = e;
            const { innerWidth, innerHeight } = window;
            const offset = 15;
            const margin = 5;
            let x, y;
            
            if (mouseX + offset + tooltipWidth + margin < innerWidth) { x = mouseX + offset; } 
            else if (mouseX - offset - tooltipWidth - margin > 0) { x = mouseX - offset - tooltipWidth; }
            else { x = innerWidth - tooltipWidth - margin; }
            
            if (mouseY + offset + tooltipHeight + margin < innerHeight) { y = mouseY + offset; }
            else if (mouseY - offset - tooltipHeight - margin > 0) { y = mouseY - offset - tooltipHeight; }
            else { y = innerHeight - tooltipHeight - margin; }
            
            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${y}px`;

        }, 500);
    };
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

    const handleNoteMouseOut = (e) => {
        clearTimeout(tooltipTimer);
        dom.noteTooltip.classList.remove('visible');
    };
    
    const handleGridScroll = () => {
        clearTimeout(tooltipTimer);
        dom.noteTooltip.classList.remove('visible');
    };

    dom.notesGrid.addEventListener('mouseover', handleNoteMouseOver);
    dom.notesGrid.addEventListener('mouseout', handleNoteMouseOut);
    dom.notesGrid.addEventListener('scroll', handleGridScroll);
    dom.collectionView.grid.addEventListener('mouseover', handleNoteMouseOver);
    dom.collectionView.grid.addEventListener('mouseout', handleNoteMouseOut);
    dom.collectionView.grid.addEventListener('scroll', handleGridScroll);
    
        // --- Кастомный тултип для коллекций ---
    let collectionTooltipTimer = null;

    dom.collectionsList.addEventListener('mouseover', (e) => {
        const item = e.target.closest('.collection-item');
        if (!item || item.id === 'add-collection-btn') return;
        
        if (dom.contextMenu.classList.contains('visible')) {
            return; 
        }

        const collId = item.dataset.id;
        const collection = state.collections[collId];
        if (!collection) return;

        collectionTooltipTimer = setTimeout(() => {
            const tooltip = dom.noteTooltip;
            tooltip.textContent = collection.name;
            tooltip.classList.add('metadata-tooltip'); // Делает тултип компактным
            tooltip.classList.add('visible');

            // Позиционируем справа от коллекции
            const itemRect = item.getBoundingClientRect();
            tooltip.style.top = `${itemRect.top + (itemRect.height / 2) - (tooltip.offsetHeight / 2)}px`;
            tooltip.style.left = `${itemRect.right + 10}px`;
        }, 500); // Появится через 0.5 сек
    });

    dom.collectionsList.addEventListener('mouseout', () => {
        clearTimeout(collectionTooltipTimer);
        dom.noteTooltip.classList.remove('visible');
        dom.noteTooltip.classList.remove('metadata-tooltip');
    });
    
// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    dom.collectionView.grid.addEventListener('dragover', (e) => {
        if (draggedElement.type === 'note') {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';

            if (draggedElement.source === 'collection-notes-grid') {
                // Старая логика: если тащим ВНУТРИ коллекции - показываем линию сортировки
                const targetTile = e.target.closest('.note-tile');
                if (targetTile && targetTile.dataset.id !== draggedElement.id) {
                    const oldIndicator = dom.collectionView.grid.querySelector('.drag-over-indicator');
                    if (oldIndicator) oldIndicator.classList.remove('drag-over-indicator');
                    targetTile.classList.add('drag-over-indicator');
                }
            } else if (draggedElement.source === 'notes-grid') {
                // НОВАЯ ЛОГИКА: если тащим С ГЛАВНОГО ОКНА - подсвечиваем всю панель
                dom.collectionView.panel.classList.add('drag-over-panel');
            }
        }
    });

    // Убираем подсветку, если увели курсор с панели
    dom.collectionView.grid.addEventListener('dragleave', (e) => {
        if (draggedElement.source === 'notes-grid') {
            if (!dom.collectionView.grid.contains(e.relatedTarget)) {
                dom.collectionView.panel.classList.remove('drag-over-panel');
            }
        }
    });

    dom.collectionView.grid.addEventListener('drop', async (e) => {
        e.preventDefault();
        
        // Очищаем любые эффекты наведения
        dom.collectionView.panel.classList.remove('drag-over-panel');
        const indicator = dom.collectionView.grid.querySelector('.drag-over-indicator');
        if (indicator) indicator.classList.remove('drag-over-indicator');

        if (draggedElement.type !== 'note') return;

        // 1. НОВАЯ ЛОГИКА: ДОБАВЛЕНИЕ ЗАМЕТКИ ИЗ ГЛАВНОГО ОКНА
        if (draggedElement.source === 'notes-grid' && currentOpenCollectionId) {
            const collectionId = currentOpenCollectionId;
            const idsToProcess = draggedElement.isBatch ? Array.from(selectedNoteIds) : [draggedElement.id];
            
            // Фильтруем: берем только те заметки, которых ЕЩЕ НЕТ в этой коллекции
            const notesToAdd = idsToProcess.filter(id => !(state.collectionNotes[collectionId] && state.collectionNotes[collectionId].includes(id)));
            
            if (notesToAdd.length > 0) {
                const t = translations[state.settings.language];
                const result = await eel.add_notes_to_collection_batch(notesToAdd, collectionId)();
                
                if (result.success) {
                    notesToAdd.forEach(id => {
                        if (!state.collectionNotes[collectionId].includes(id)) {
                            state.collectionNotes[collectionId].push(id);
                        }
                    });
                    updateCounters();
                    showNotification(t.notesAddedToCollection(result.added_count, state.collections[collectionId].name));
                    renderCollectionView(collectionId); // Мгновенно перерисовываем
                }
            }
            deactivateSelectionMode();
            return;
        }

        // 2. СТАРУЮ ЛОГИКА: СОРТИРОВКА ВНУТРИ КОЛЛЕКЦИИ
        const dropTarget = e.target.closest('.note-tile');
        if (dropTarget && draggedElement.source === 'collection-notes-grid' && draggedElement.id !== dropTarget.dataset.id) {
            const draggedId = draggedElement.id;
            const targetId = dropTarget.dataset.id;
            
            let noteIds = [...state.collectionNotes[currentOpenCollectionId]];
            noteIds = noteIds.filter(id => id !== draggedId);

            const targetIndex = noteIds.indexOf(targetId);
            noteIds.splice(targetIndex, 0, draggedId);
            
            const result = await eel.save_note_order_in_collection(currentOpenCollectionId, noteIds)();
            
            if (result.success) {
                state.collectionNotes[currentOpenCollectionId] = noteIds;
                await renderCollectionView(currentOpenCollectionId);
            }
        }
    });
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    
// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    dom.collectionsList.addEventListener('contextmenu', (e) => {
        // --- НОВАЯ ЛОГИКА: ПЕРЕКЛЮЧЕНИЕ (TOGGLE) ---
        hideTooltip();
        if (dom.contextMenu.classList.contains('visible')) {
            e.preventDefault();
            hideContextMenuAnimated();
            return;
        }
        // --- КОНЕЦ НОВОЙ ЛОГИКИ ---

        const item = e.target.closest('.collection-item');
        if (!item || item.id === 'add-collection-btn') return;
        
        const collId = item.dataset.id;
        const collection = state.collections[collId];
        
        dom.contextMenu.dataset.noteId = '';
        dom.contextMenu.dataset.collId = collId;
        
        const t = translations[state.settings.language];
        const menuItems = [];

        // Проверяем условия для появления кнопки "Создать подколлекцию"
        const notesCount = state.collectionNotes[collId] ? state.collectionNotes[collId].length : 0;
        const isSubcollection = !!collection.parentId;

        // Если это не подколлекция (главная папка) и в ней НЕТ записок -> добавляем кнопку
        if (!isSubcollection && notesCount === 0) {
            menuItems.push({ label: t.createSubcollection, action: 'create-subcollection' });
            menuItems.push({ type: 'divider' });
        }

        menuItems.push({ label: t.rename, action: 'rename-collection' });
        menuItems.push({ label: t.delete, action: 'delete-collection' });
        
        showContextMenu(e, menuItems);
    });
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    // Глобальная переменная для отслеживания, куда создаем подколлекцию

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    dom.collectionsList.addEventListener('click', async (e) => {
        const item = e.target.closest('.collection-item');
        if (!item || item.id === 'add-collection-btn') return;

        const collId = item.dataset.id;
        const group = item.closest('.collection-group');
        const hasChildren = Object.values(state.collections).some(c => c.parentId === collId);

        // Условие 1: Если есть подколлекции - работает как аккордеон.
        if (hasChildren) {
            // Закрываем ВСЕ остальные раскрытые коллекции, кроме той, на которую нажали
            document.querySelectorAll('.collection-group.expanded').forEach(expandedGroup => {
                if (expandedGroup !== group) {
                    expandedGroup.classList.remove('expanded');
                }
            });

            // Переключаем текущую (открываем, если была закрыта; закрываем, если была открыта)
            group.classList.toggle('expanded');
            return;
        }

        // Условие 2: Обычная коллекция или подколлекция (без детей) - открываем панель с записками
        if (collId === currentOpenCollectionId) {
            closeCollectionView();
        } else if (currentOpenCollectionId !== null) {
            dom.collectionView.curtain.classList.add('active');
            setTimeout(async () => {
                dom.collectionView.grid.classList.add('no-transition');
                dom.collectionView.grid.classList.remove('is-shown');
                void dom.collectionView.grid.offsetHeight;
                dom.collectionView.grid.classList.remove('no-transition');

                currentOpenCollectionId = collId;
                await renderCollectionView(collId);
                
                void dom.collectionView.grid.offsetHeight;
                dom.collectionView.grid.classList.add('is-shown');
                dom.collectionView.curtain.classList.remove('active');
            }, 150);
        } else {
            currentOpenCollectionId = collId;
            await renderCollectionView(collId);

            dom.notesGridCurtain.classList.add('active');
            setTimeout(() => {
                dom.collectionView.panel.classList.add('visible');
                dom.notesGrid.classList.add('shifted');
                dom.notesGridCurtain.classList.remove('active');
                
                void dom.collectionView.grid.offsetHeight;
                dom.collectionView.grid.classList.add('is-shown');
            }, 200);
        }
    });
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

        // Теперь оба фильтра вызывают одну и ту же функцию
    dom.searchInput.addEventListener('input', applyFilters);
    dom.uncollectedFilterToggle.addEventListener('change', applyFilters);

    dom.hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (dom.hamburgerMenu.classList.contains('visible')) {
            hideHamburgerMenuAnimated();
        } else {
            hideAllAnimatedMenus();
            showDropdown(dom.hamburgerMenu, dom.hamburgerBtn);
        }
    });

    // --- 👇 НОВЫЙ БЛОК ---
    function hideContextMenuAnimated() {
        const menu = dom.contextMenu;
        if (!menu.classList.contains('visible') || menu.classList.contains('is-closing')) {
            return;
        }
        menu.classList.add('is-closing');
        // УМНАЯ ПРОВЕРКА: Слушатель сработает, только если меню все еще закрывается
        menu.addEventListener('animationend', () => {
            if (menu.classList.contains('is-closing')) {
                menu.classList.remove('visible');
                menu.classList.remove('is-closing');
            }
        }, { once: true });
    }
// --- 👆 КОНЕЦ НОВОГО БЛОКА ---
    
    dom.optionsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (dom.optionsMenu.classList.contains('visible')) {
            hideOptionsMenuAnimated();
        } else {
            hideAllAnimatedMenus();
            showDropdown(dom.optionsMenu, dom.optionsBtn);
        }
    });

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    // Чистые обработчики без дубликатов
    dom.hamburgerMenu.addEventListener('mouseleave', () => { menuHideTimer = setTimeout(hideHamburgerMenuAnimated, 300); });
    dom.hamburgerMenu.addEventListener('mouseenter', () => { clearTimeout(menuHideTimer); });
    
    dom.optionsMenu.addEventListener('mouseleave', () => { menuHideTimer = setTimeout(hideOptionsMenuAnimated, 300); });
    dom.optionsMenu.addEventListener('mouseenter', () => { clearTimeout(menuHideTimer); });
    
    // ЕДИНСТВЕННЫЙ обработчик для контекстного меню
    dom.contextMenu.addEventListener('mouseleave', () => { 
        menuHideTimer = setTimeout(hideContextMenuAnimated, 300); 
    });
    dom.contextMenu.addEventListener('mouseenter', () => { 
        clearTimeout(menuHideTimer); 
    });
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

    dom.contextMenu.addEventListener('mouseout', (e) => {
        const container = e.target.closest('.context-submenu-container');
        if (!container) return;

        // 🔥 САМАЯ ВАЖНАЯ ПРОВЕРКА: 
        // Если мы перевели курсор на элемент ВНУТРИ этого же контейнера 
        // (например, на треугольник или на всплывшее подменю) - мы игнорируем уход!
        if (container.contains(e.relatedTarget)) {
            return;
        }

        const submenu = container.querySelector('.submenu');
        if (submenu) {
            clearTimeout(submenu.hideTimer);
            submenu.hideTimer = setTimeout(() => {
                submenu.classList.add('is-closing');
                submenu.addEventListener('animationend', () => {
                    if (submenu.classList.contains('is-closing')) {
                        submenu.classList.remove('visible');
                        submenu.classList.remove('is-closing');
                    }
                }, { once: true });
            }, 200);
        }
    });
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

    dom.contextMenu.addEventListener('mouseout', (e) => {
        const container = e.target.closest('.context-submenu-container');
        if (container) {
            const submenu = container.querySelector('.submenu');
            if (submenu) {
                // Как только курсор уходит с кнопки ИЛИ с меню - запускаем таймер
                clearTimeout(submenu.hideTimer); // сброс на всякий случай
                submenu.hideTimer = setTimeout(() => {
                    submenu.classList.add('is-closing');
                    submenu.addEventListener('animationend', () => {
                        if (submenu.classList.contains('is-closing')) {
                            submenu.classList.remove('visible');
                            submenu.classList.remove('is-closing');
                        }
                    }, { once: true });
                }, 200); // Даем ровно 200мс, чтобы успеть перевести мышку
            }
        }
    });
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

    // --- 👇 НОВЫЙ БЛОК: ВОССТАНОВЛЕНИЕ ЛОГИКИ НАВЕДЕНИЯ НА МЕНЮ ОПЦИЙ ---



// --- 👇 ЗАМЕНИТЕ ДВА ПРЕДЫДУЩИХ ОБРАБОТЧИКА НА ЭТОТ БЛОК ---
    // "Умный" делегированный обработчик для всех подменю в меню опций
    dom.optionsMenu.addEventListener('mouseover', (e) => {
        const submenuContainer = e.target.closest('.dropdown-submenu-container');
        if (!submenuContainer) return;

        const submenu = submenuContainer.querySelector('.submenu');
        if (submenu) {
            // Когда курсор НАД контейнером, отменяем любой таймер на его закрытие
            clearTimeout(submenu.hideTimer);
            showSubmenu(submenu);
        }
    });

    dom.optionsMenu.addEventListener('mouseout', (e) => {
        const submenuContainer = e.target.closest('.dropdown-submenu-container');
        if (!submenuContainer) return;

        const submenu = submenuContainer.querySelector('.submenu');
        if (submenu) {
            // Когда курсор ПОКИНУЛ контейнер, запускаем таймер на его закрытие
            submenu.hideTimer = setTimeout(() => {
                hideSubmenu(submenu);
            }, 300);
        }
    });

    // Новая вспомогательная функция для показа подменю
    function showSubmenu(submenu) {
        // Прячем все ДРУГИЕ подменю
        dom.optionsMenu.querySelectorAll('.submenu').forEach(otherSubmenu => {
            if (otherSubmenu !== submenu) {
                hideSubmenu(otherSubmenu);
            }
        });
        
        clearTimeout(submenu.hideTimer);
        submenu.classList.remove('is-closing');
        submenu.classList.add('visible');
    }

    // Новая вспомогательная функция для скрытия подменю
    function hideSubmenu(submenu) {
        if (submenu.classList.contains('visible') && !submenu.classList.contains('is-closing')) {
            submenu.classList.add('is-closing');
            submenu.addEventListener('animationend', () => {
                submenu.classList.remove('visible');
                submenu.classList.remove('is-closing');
            }, { once: true });
        }
    }

    // Обработчик для запуска таймера закрытия
    dom.optionsMenu.addEventListener('mouseleave', (e) => {
        const submenuContainer = e.target.closest('.dropdown-submenu-container');
        if (!submenuContainer) return;

        const submenu = submenuContainer.querySelector('.submenu');
        if (submenu && submenu.classList.contains('visible')) {
            // Запускаем таймер на закрытие
            submenu.hideTimer = setTimeout(() => {
                submenu.classList.add('is-closing');
                submenu.addEventListener('animationend', () => {
                    submenu.classList.remove('visible');
                    submenu.classList.remove('is-closing');
                }, { once: true });
            }, 300);
        }
    });
// --- 👆 КОНЕЦ ЗАМЕНЫ ---


// --- 👇 ЗАМЕНИТЕ ВЕСЬ ЭТОТ ОБРАБОТЧИК НА ЭТОТ БЛОК ---
    dom.hamburgerMenu.addEventListener('click', async (e) => {
        const target = e.target.closest('.dropdown-menu-item');
        if (!target) return;
        hideAllAnimatedMenus();
        const t = translations[state.settings.language];
        
        switch (target.id) {
            case 'add-vault-btn': {
                const vaultName = await showCustomPrompt('addVault', '');
                if (vaultName) {
                    const result = await eel.create_vault(vaultName)();
                    if (result.success) {
                        showNotification('vaultCreated');
                    } else {
                        await showCustomAlert('Error', result.message);
                    }
                }
                break;
            }
            case 'rename-vault-btn': {
                const newVaultName = await showCustomPrompt('renameVault', '', state.settings.current_vault);
                if (newVaultName && newVaultName !== state.settings.current_vault) {
                    const result = await eel.rename_vault(state.settings.current_vault, newVaultName)();
                    if (result.success) {
                        showNotification('vaultRenamed');
                        reload_app();
                    } else {
                        await showCustomAlert('Error', result.message);
                    }
                }
                break;
            }
            case 'delete-vault-btn': {
                const confirmDelete = await showCustomConfirm('deleteVaultTitle', t.deleteVaultMessage(state.settings.current_vault), 'deleteAction', 'cancel', true);
                if (confirmDelete) {
                    const confirmFinal = await showCustomConfirm('finalWarningTitle', t.finalWarningMessage, 'deletePermanentlyAction', 'cancel', true);
                    if (confirmFinal) {
                        const result = await eel.delete_vault(state.settings.current_vault)();
                        if (result.success) {
                            showNotification('vaultDeleted');
                            reload_app();
                        } else {
                            await showCustomAlert('Error', result.message);
                        }
                    }
                }
                break;
            }
            case 'import-vault-btn': {
                showLoader();
                const checkResult = await eel.check_import_for_conflict()();
                
                if (!checkResult.success) {
                    hideLoader();
                    if (checkResult.message !== 'Import cancelled.') {
                        await showCustomAlert('Error', `Failed to check import:\n${checkResult.message}`);
                    }
                    break;
                }

                let finalName = checkResult.original_name;

                if (checkResult.is_conflict) {
                    hideLoader();
                    let isStillConflict = true;

                    while (isStillConflict) {
                        const newName = await showCustomPrompt(
                            t.vaultNameConflictTitle, 
                            t.vaultNameConflictMessage(finalName), 
                            finalName
                        );

                        if (newName === null) {
                            finalName = null;
                            break;
                        }

                        if (state.vaults.includes(newName)) {
                            await showCustomAlert('Error', t.vaultNameStillExists(newName));
                            finalName = newName;
                        } else {
                            finalName = newName;
                            isStillConflict = false;
                        }
                    }

                    if (finalName === null) {
                        break;
                    }

                    showLoader();
                }

                const importResult = await eel.perform_import(checkResult.archive_path, finalName)();
                
                if (importResult.success) {
                    showNotification('vaultImported');
                } else {
                    hideLoader();
                    await showCustomAlert('Error', `Failed to import vault:\n${importResult.message}`);
                }
                break;
            }
            case 'backup-vault-btn': {
                showLoader();
                const result = await eel.backup_current_vault()();
                hideLoader();
                if (result.success) {
                    showNotification('vaultExported');
                } else if (result.message !== 'Export cancelled.') {
                    await showCustomAlert('Error', `Failed to export vault:\n${result.message}`);
                }
                break;
            }
        }
        
        if (target.classList.contains('vault-item')) {
            const vaultName = target.dataset.vault;
            if (vaultName && vaultName !== state.settings.current_vault) {
                await eel.switch_vault(vaultName)();
            }
        }
    });
// --- 👆 КОНЕЦ ЗАМЕНЫ ---


// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    dom.appContainer.addEventListener('dragstart', (e) => {

            function canDropNoteIntoCollection(collId) {
        if (collId === 'coll_favorites') return false;
        const hasChildren = Object.values(state.collections).some(c => c.parentId === collId);
        return !hasChildren;
        }

        hideTooltip();
        const noteTile = e.target.closest('.note-tile');
        const collectionItem = e.target.closest('.collection-item:not(#add-collection-btn)');
    
        e.dataTransfer.effectAllowed = 'move';
        
        if (collectionItem) {
            if (collectionItem.dataset.id === 'coll_favorites') {
                e.preventDefault();
                return;
            }
            document.body.classList.add('is-dragging-collection');
            draggedElement = { id: collectionItem.dataset.id, type: 'collection', source: 'collections-list' };
            setTimeout(() => collectionItem.classList.add('dragging'), 0);
            return;
        }
    
        if (noteTile) {
            e.dataTransfer.setDragImage(emptyImage, 0, 0);

            const noteId = noteTile.dataset.id;
            let isBatchDrag = false;
            let idsToDrag = [];

            if (isSelectionModeActive && selectedNoteIds.has(noteId)) {
                isBatchDrag = true;
                idsToDrag = Array.from(selectedNoteIds);
            } else {
                isBatchDrag = false;
                idsToDrag = [noteId];
            }
            
            createDragGhost(idsToDrag.length);
            setTimeout(() => dom.dragGhost.classList.add('visible'), 0);

            document.body.classList.add('is-dragging-note');
            
            const sourceGrid = noteTile.closest('#collection-notes-grid') ? 'collection-notes-grid' : 'notes-grid';
            draggedElement = { 
                id: noteId, 
                type: 'note', 
                isBatch: isBatchDrag,
                source: sourceGrid 
            };
            
            idsToDrag.forEach(id => {
                document.querySelector(`.note-tile[data-id="${id}"]`)?.classList.add('dragging');
            });
    
            // --- ВОТ ИСПРАВЛЕНИЕ ---
            // Если тащим из панели коллекции, подсвечиваем основную сетку
            if (sourceGrid === 'collection-notes-grid') {
                dom.notesGrid.classList.add('drag-over');
            } 
            // Иначе (тащим из основной сетки), подсвечиваем коллекции
            else {
                document.querySelectorAll('#collections-list .collection-item').forEach(item => {
                    const collId = item.dataset.id;
                    if (collId && canDropNoteIntoCollection(collId) && !idsToDrag.some(id => state.collectionNotes[collId]?.includes(id))) {
                        item.classList.add('drag-over');
                    }
                });
            }
            // --- КОНЕЦ ИСПРАВЛЕНИЯ ---
        }
    });


// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    let dragExpandTimer = null;
    let currentHoveredGroup = null;

    // МЫ ПОЛНОСТЬЮ УДАЛИЛИ ГЛЮЧНЫЙ dragenter. 
    // Всё работает через dragover (срабатывает постоянно при движении)
    dom.collectionsList.addEventListener('dragover', (e) => { 
        e.preventDefault(); 
        e.dataTransfer.dropEffect = 'move'; 
        
        if (draggedElement.type === 'collection') {
            const oldIndicator = document.querySelector('.collection-item.drag-over-indicator'); 
            if (oldIndicator) { oldIndicator.classList.remove('drag-over-indicator'); } 
            const target = e.target.closest('.collection-item'); 
            if (target && draggedElement.id !== target.dataset.id) { 
                target.classList.add('drag-over-indicator'); 
            }
            return;
        }

        if (draggedElement.type === 'note') {
            const item = e.target.closest('.collection-item');
            
            // 1. УПРАВЛЕНИЕ ИСЧЕЗНОВЕНИЕМ ВЫДЕЛЕНИЯ
            // Сначала очищаем класс со ВСЕХ остальных папок, чтобы не залипало
            document.querySelectorAll('.collection-item.drag-hovered').forEach(el => {
                if (el !== item) el.classList.remove('drag-hovered');
            });
            
            // Если мы над валидной папкой - гасим её выделение
            if (item && item.classList.contains('drag-over')) {
                item.classList.add('drag-hovered');
            }

            // 2. ТАЙМЕР РАСКРЫТИЯ ПОДКОЛЛЕКЦИЙ
            const group = e.target.closest('.collection-group');
            if (group && group.classList.contains('has-children')) {
                if (currentHoveredGroup !== group) {
                    clearTimeout(dragExpandTimer);
                    currentHoveredGroup = group;
                    dragExpandTimer = setTimeout(() => {
                        if (currentHoveredGroup === group) {
                            group.classList.add('drag-expanded');
                        }
                    }, 600);
                }
            } else {
                clearTimeout(dragExpandTimer);
                currentHoveredGroup = null;
            }
        }
    });

    dom.collectionsList.addEventListener('dragleave', (e) => { 
        if (draggedElement.type === 'note') {
            const item = e.target.closest('.collection-item'); 
            // Возвращаем выделение, когда курсор покинул папку
            if (item && !item.contains(e.relatedTarget)) { 
                item.classList.remove('drag-hovered'); 
            }

            const group = e.target.closest('.collection-group');
            if (group && !group.contains(e.relatedTarget)) {
                group.classList.remove('drag-expanded'); 
                if (currentHoveredGroup === group) {
                    clearTimeout(dragExpandTimer);
                    currentHoveredGroup = null;
                }
            }
        }
    });
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---


// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    dom.collectionsList.addEventListener('drop', async (e) => {
        e.preventDefault();
        const dropTarget = e.target.closest('.collection-item');
        if (!dropTarget) return;

        if (dropTarget.dataset.id === 'coll_favorites') {
            dropTarget.classList.remove('drag-over', 'drag-hovered');
            return;
        }

        const collectionId = dropTarget.dataset.id;

        // Железно сбрасываем все стили наведения при броске
        dropTarget.classList.remove('drag-over', 'drag-over-indicator', 'drag-hovered');

        if (draggedElement.type === 'note') {
            // ЗАЩИТА: Запрещаем бросать в коллекцию с детьми
            if (!canDropNoteIntoCollection(collectionId)) {
                return;
            }

            const t = translations[state.settings.language];
            
            const idsToProcess = draggedElement.isBatch ? Array.from(selectedNoteIds) : [draggedElement.id];

            const result = await eel.add_notes_to_collection_batch(idsToProcess, collectionId)();
            if (result.success) {
                idsToProcess.forEach(id => {
                    if (!state.collectionNotes[collectionId].includes(id)) {
                        state.collectionNotes[collectionId].push(id);
                    }
                });
                updateCounters();
                if (result.added_count > 0) {
                    showNotification(t.notesAddedToCollection(result.added_count, state.collections[collectionId].name));
                }

                // Перерисовываем, если бросили в открытую сейчас коллекцию
                if (currentOpenCollectionId === collectionId) {
                    renderCollectionView(collectionId);
                }
            }
            deactivateSelectionMode();
        } 

        
        // --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
        else if (draggedElement.type === 'collection' && draggedElement.id !== dropTarget.dataset.id) {
            const draggedId = draggedElement.id;
            const targetId = dropTarget.dataset.id;

            // Ищем новые КОНТЕЙНЕРЫ (группы), а не просто кнопки
            const draggedGroup = dom.collectionsList.querySelector(`.collection-group[data-group-id="${draggedId}"]`);
            const targetGroup = dom.collectionsList.querySelector(`.collection-group[data-group-id="${targetId}"]`);
            
            // Если пытаемся переместить в разные иерархии (родителя к детям) - отменяем
            if (!draggedGroup || !targetGroup || draggedGroup.parentNode !== targetGroup.parentNode) {
                dropTarget.classList.remove('drag-over-indicator');
                return;
            }

            // 1. Мгновенная визуальная перестановка
            const container = draggedGroup.parentNode;
            const groups = Array.from(container.children);
            if (groups.indexOf(draggedGroup) < groups.indexOf(targetGroup)) {
                targetGroup.after(draggedGroup);
            } else {
                targetGroup.before(draggedGroup);
            }
            dropTarget.classList.remove('drag-over-indicator');

            // 2. Правильный сбор ID для сохранения с учетом групп
            const newOrderIds = [];
            dom.collectionsList.querySelectorAll(':scope > .collection-group').forEach(group => {
                if (group.dataset.groupId) newOrderIds.push(group.dataset.groupId);
                group.querySelectorAll('.subcollections-list > .collection-group').forEach(subGroup => {
                    if (subGroup.dataset.groupId) newOrderIds.push(subGroup.dataset.groupId);
                });
            });

            // 3. Сохранение
            const result = await eel.save_collections_order(newOrderIds)();
            if (result.success) {
                const newCollections = {};
                newOrderIds.forEach(id => { if (state.collections[id]) newCollections[id] = state.collections[id]; });
                state.collections = newCollections;
            } else {
                renderFullUI(); 
            }
        }
    }); // <-- Закрывающая скобка обработчика
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---


// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    // Вспомогательная функция, чтобы определить, можно ли кидать заметку в коллекцию
    function canDropNoteIntoCollection(collId) {
        if (collId === 'coll_favorites') return false;
        // Нельзя кидать в коллекцию, если у нее есть дети (подколлекции)
        const hasChildren = Object.values(state.collections).some(c => c.parentId === collId);
        return !hasChildren;
    }
    

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    dom.appContainer.addEventListener('dragover', (e) => {
        if (draggedElement.id) {
            e.preventDefault();
            
            if (draggedElement.type === 'note') {
                updateDragGhostPosition(e);
            }
            
            // Эта часть кода отвечает за подсветку корзины при наведении
            const deleteZone = dom.dragDeleteZone;
            const isOverDeleteZone = e.target === deleteZone || deleteZone.contains(e.target);
            if (isOverDeleteZone) {
                e.dataTransfer.dropEffect = 'move';
                deleteZone.classList.add('drag-over');
            } else {
                deleteZone.classList.remove('drag-over');
            }
        }
    });
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ --- 

    dom.notesGrid.addEventListener('dragover', (e) => { if (draggedElement.type === 'note' && currentOpenCollectionId && draggedElement.source === 'collection-notes-grid') { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; } });

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    dom.notesGrid.addEventListener('drop', async (e) => {
        e.preventDefault();
        dom.notesGrid.classList.remove('drag-over');

        if (draggedElement.type === 'note' && currentOpenCollectionId && draggedElement.source === 'collection-notes-grid') {
            
            // --- НОВАЯ, УМНАЯ ЛОГИКА ---
            const idsToRemove = draggedElement.isBatch ? Array.from(selectedNoteIds) : [draggedElement.id];

            // Нам нужно вызвать eel.remove_note_from_collection для каждого.
            // Создадим новую "пакетную" функцию для эффективности.
            // А пока - используем цикл.
            for (const noteId of idsToRemove) {
                await eel.remove_note_from_collection(noteId, currentOpenCollectionId)();
                state.collectionNotes[currentOpenCollectionId] = state.collectionNotes[currentOpenCollectionId].filter(id => id !== noteId);
            }
            
            showNotification('removeFromCollection');
            updateCounters();
            renderCollectionView(currentOpenCollectionId); // Перерисовываем панель
            deactivateSelectionMode();
            // --- КОНЕЦ НОВОЙ ЛОГИКИ ---
        }
    });
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    dom.appContainer.addEventListener('dragend', () => {

        dom.dragGhost.classList.remove('visible');
        dom.dragGhost.innerHTML = '';
        
        // Очищаем подсветку открытой панели коллекций
        dom.collectionView.panel.classList.remove('drag-over-panel');

        // Очищаем таймер раскрытия
        clearTimeout(dragExpandTimer);
        currentHoveredGroup = null;

        // 1. Прячем призрак
        dom.dragGhost.classList.remove('visible');
        dom.dragGhost.innerHTML = '';

        // 2. Убираем глобальные классы перетаскивания
        document.body.classList.remove('is-dragging-note');
        document.body.classList.remove('is-dragging-collection');
        
        // 3. Убираем класс .dragging со всех заметок И коллекций
        document.querySelectorAll('.note-tile.dragging, .collection-item.dragging').forEach(el => {
            el.classList.remove('dragging');
        });
        
        // 4. Убираем классы подсветки
        dom.notesGrid.classList.remove('drag-over');
        
        // 5. ТЩАТЕЛЬНАЯ ОЧИСТКА КОЛЛЕКЦИЙ
        document.querySelectorAll('.collection-item').forEach(item => {
            item.classList.remove('drag-over');
            item.classList.remove('drag-over-indicator');
            item.classList.remove('drag-hovered'); // <-- ДОБАВИЛИ
            // Принудительно сбрасываем стиль, если он "залип"
            item.style.backgroundColor = ''; 
        });

        document.querySelectorAll('.collection-group').forEach(group => {
        group.classList.remove('drag-expanded');
        });

        // 6. Очистка корзины
        dom.dragDeleteZone.classList.remove('drag-over');

        draggedElement = { id: null, type: null, source: null, isBatch: false };
    });
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---


    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown-menu') && !e.target.closest('.icon-btn')) {
            hideAllAnimatedMenus();
        }
    });

// --- 👇 НОВЫЙ БЛОК: ЗВУК ПРИ НАВЕДЕНИИ НА МЕНЮ ---
    document.addEventListener('mouseover', (e) => {
        // Ищем ближайший родительский элемент, который является пунктом меню
        const menuItem = e.target.closest('.dropdown-menu-item');
        
        // Если нашли и это новое наведение (не внутри того же элемента)
        if (menuItem && e.relatedTarget && !menuItem.contains(e.relatedTarget)) {
            SoundManager.play('hover');
        }
    });
// --- 👆 КОНЕЦ НОВОГО БЛОКА ---

    // --- 👇 НОВЫЙ БЛОК: ОБРАБОТЧИКИ ДЛЯ КОРЗИНЫ ---
    dom.dragDeleteZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        dom.dragDeleteZone.classList.add('drag-over');
    });

    dom.dragDeleteZone.addEventListener('dragleave', () => {
        dom.dragDeleteZone.classList.remove('drag-over');
    });

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    dom.dragDeleteZone.addEventListener('drop', async (e) => {
        e.preventDefault();
        dom.dragDeleteZone.classList.remove('drag-over');
        const t = translations[state.settings.language];

        const idsToProcess = draggedElement.isBatch ? Array.from(selectedNoteIds) : [draggedElement.id];

        // --- ЛОГИКА ДЛЯ ЗАМЕТКИ ---
        if (draggedElement.type === 'note') {
            const result = await eel.delete_notes_batch(idsToProcess)();
            if (result.success) {
                result.deleted_ids.forEach(id => {
                    delete state.notes[id];
                    delete state.noteContentsCache[id];
                    Object.keys(state.collectionNotes).forEach(cId => {
                        state.collectionNotes[cId] = state.collectionNotes[cId].filter(nId => nId !== id);
                    });
                    removeNoteFromDOM(id);
                });
                updateCounters();
                showNotification('noteDeleted');
            }
            deactivateSelectionMode();
        } 
        // --- ЛОГИКА ДЛЯ КОЛЛЕКЦИИ ---
        else if (draggedElement.type === 'collection') {
            const collId = draggedElement.id;
            const collName = state.collections[collId].name;
            
            if (await showCustomConfirm('deleteCollectionTitle', t.deleteCollectionMessage(collName), 'deleteAction', 'cancel', true)) {
                const result = await eel.delete_collection(collId)();
                if (result.success) {
                    
                    // Если удаляемая коллекция (или одна из ее подколлекций) сейчас открыта справа - закрываем шторку
                    if (result.deleted_ids.includes(currentOpenCollectionId)) {
                        closeCollectionView();
                    }
                    
                    // Удаляем коллекцию и все её подколлекции из state и DOM
                    result.deleted_ids.forEach(id => {
                        delete state.collections[id];
                        delete state.collectionNotes[id];
                        
                        const groupToRemove = dom.collectionsList.querySelector(`.collection-group[data-group-id="${id}"]`);
                        if (groupToRemove) {
                            groupToRemove.remove(); // Удаляем мгновенно и без зависаний
                        }
                    });
                    
                    updateCounters();
                    showNotification('collectionDeleted');
                }
            }
            deactivateSelectionMode();
        }
    });
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    
    document.addEventListener('contextmenu', (e) => { e.preventDefault(); });
    
// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    dom.optionsMenu.addEventListener('click', async (e) => {
        const target = e.target.closest('.dropdown-menu-item, .theme-dot');
        if (!target) return;

        // --- НОВЫЙ БЛОК: СМЕНА СТИЛЯ ---
        if (target.matches('[data-visual-style]')) {
            const newStyle = target.dataset.visualStyle;
            if (newStyle !== state.settings.current_style) {
                applyVisualStyle(newStyle);
                await eel.save_settings({ current_style: newStyle })();
                showNotification('styleUpdated');
            }
            return;
        }
        // --- КОНЕЦ НОВОГО БЛОКА ---

        if (target.matches('[data-theme-accent]')) {
            const newAccent = target.dataset.themeAccent;
            if (newAccent !== state.settings.theme_accent) {
                applyTheme(state.settings.theme_base, newAccent);
                await eel.save_settings({ theme_accent: newAccent })();
                showNotification('themeUpdated');
            }
            return; 
        }

        if (target.matches('[data-theme-text]')) {
            const newTextTheme = target.dataset.themeText;
            if (newTextTheme !== state.settings.theme_text) {
                applyTextTheme(newTextTheme);
                await eel.save_settings({ theme_text: newTextTheme })();
                showNotification('themeUpdated');
            }
            return;
        }

        if (target.matches('[data-theme-base]')) {
            const newBase = target.dataset.themeBase;
            if (newBase !== state.settings.theme_base) {
                applyTheme(newBase, state.settings.theme_accent);
                await eel.save_settings({ theme_base: newBase })();
                showNotification('themeUpdated');
            }
            return;
        }
        
        if (target.matches('[data-lang]')) {
            const newLang = target.dataset.lang;
            if (newLang !== state.settings.language) {
                applyTranslations(newLang);
                await eel.save_settings({ language: newLang })();
                showNotification('languageUpdated');
            }
            return;
        }

        if (target.matches('[data-action="change-notes-dir"]')) {
            hideAllAnimatedMenus();
            await eel.change_notes_directory()();
            return;
        }

        // --- ИЗМЕНЕННАЯ ЛОГИКА ---
        if (target.matches('[data-action="tutorial"]')) {
            hideAllAnimatedMenus();
            // Напрямую запускаем обучение без лишних вопросов
            startTutorial(tutorialSteps, state.settings.language);
            return;
        }
        // --- КОНЕЦ ИЗМЕНЕНИЯ ---

        if (target.matches('[data-action="about-app"]')) {
            await showCustomAlert('About app', 'Prompt Manager v2.0');
            hideAllAnimatedMenus();
        }
    });
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    function showContextMenu(e, items, center = false) {
        e.preventDefault();
        e.stopPropagation();
        hideOtherMenus();

        const t = translations[state.settings.language];
        dom.contextMenu.innerHTML = items.map(item => {
            if (item.type === 'divider') return '<div class="dropdown-divider"></div>';
            if (item.type === 'short-divider') return '<div class="short-divider"></div>';
            if (item.type === 'header') return `<div class="dropdown-header">${t[item.labelKey]}</div>`;
            if (item.type === 'collections-submenu') return item.html; // <-- НОВАЯ СТРОКА
            return `<div class="dropdown-menu-item" data-action="${item.action}">${item.label}</div>`;
        }).join('');

        const metadataItem = dom.contextMenu.querySelector('[data-action="show-metadata"]');
        if (metadataItem) {
            let metadataTimer;
            const tooltip = dom.noteTooltip;

            const showMetaTooltip = (event) => {
                clearTimeout(metadataTimer);
                const noteId = dom.contextMenu.dataset.noteId;
                const note = state.notes[noteId];
                if (!note) return;

                tooltip.classList.add('metadata-tooltip');
                tooltip.innerHTML = createMetadataHtml(note, noteId);
                tooltip.classList.add('visible');

                const itemRect = event.currentTarget.getBoundingClientRect();
                const menuRect = dom.contextMenu.getBoundingClientRect();
                const tooltipRect = tooltip.getBoundingClientRect();
                const spaceRight = window.innerWidth - menuRect.right;
                
                tooltip.style.top = `${itemRect.top}px`;
                
                if (spaceRight > tooltipRect.width + 10) {
                    tooltip.style.left = `${itemRect.right + 5}px`;
                } else {
                    tooltip.style.left = `${itemRect.left - tooltipRect.width - 5}px`;
                }
            };
            
            const hideMetaTooltip = () => {
                metadataTimer = setTimeout(() => {
                    tooltip.classList.remove('visible');
                    tooltip.classList.remove('metadata-tooltip');
                }, 200);
            };

            metadataItem.addEventListener('mouseover', showMetaTooltip);
            metadataItem.addEventListener('mouseleave', hideMetaTooltip);
            tooltip.addEventListener('mouseenter', () => clearTimeout(metadataTimer));
            tooltip.addEventListener('mouseleave', hideMetaTooltip);
        }

        dom.contextMenu.classList.remove('is-closing');
        dom.contextMenu.classList.add('visible');
        
        const { offsetWidth: menuWidth, offsetHeight: menuHeight } = dom.contextMenu;
        
        // --- НОВАЯ ЛОГИКА ПОЗИЦИОНИРОВАНИЯ ---
        if (center) {
            // Показываем по центру экрана
            dom.contextMenu.style.left = `calc(50% - ${menuWidth / 2}px)`;
            dom.contextMenu.style.top = `calc(50% - ${menuHeight / 2}px)`;
        } else {
            // Показываем у курсора (старое поведение)
            const { clientX: mouseX, clientY: mouseY } = e;
            const { innerWidth, innerHeight } = window;
            const x = mouseX + menuWidth > innerWidth ? innerWidth - menuWidth - 5 : mouseX;
            const y = mouseY + menuHeight > innerHeight ? innerHeight - menuHeight - 5 : mouseY;
            dom.contextMenu.style.left = `${x}px`;
            dom.contextMenu.style.top = `${y}px`;
        }
        // --- КОНЕЦ НОВОЙ ЛОГИКИ ---
    }
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

// --- 👇 НАЧАЛО НОВОГО БЛОКА ---
    function generateCollectionsSubmenu(noteId, excludeCollId = null) {
        const t = translations[state.settings.language];
        let collectionsHtml = '';
        const parents = Object.keys(state.collections).filter(c => !state.collections[c].parentId);
        let hasAddableCollections = false;

        parents.forEach(parentId => {
            if (parentId === excludeCollId) return;

            const children = Object.keys(state.collections).filter(c => state.collections[c].parentId === parentId);
            
            if (children.length > 0) {
                // Если есть подколлекции - фильтруем их
                const availableChildren = children.filter(childId => 
                    childId !== excludeCollId && 
                    !(state.collectionNotes[childId] && state.collectionNotes[childId].includes(noteId))
                );
                
                if (availableChildren.length > 0) {
                    hasAddableCollections = true;
                    collectionsHtml += `
                        <div class="context-collection-group">
                            <div class="dropdown-menu-item context-collection-parent" style="justify-content: flex-start;">
                                <span class="expander-icon" style="visibility:visible; transform: scale(0.55); margin-right: 8px; transition: transform 0.2s;">▶</span>
                                <span style="pointer-events: none;">${state.collections[parentId].name}</span>
                            </div>
                            <div class="context-subcollections-list" style="display:none; flex-direction:column; padding-left: 15px; background: rgba(0,0,0,0.1); border-radius: 4px; margin: 2px 5px;">
                                ${availableChildren.map(childId => `
                                    <div class="dropdown-menu-item" data-action="add-to-collection-${childId}">
                                        <span style="color: var(--text-color-dark); margin-right: 5px; font-weight:300;">-</span> ${state.collections[childId].name}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
                }
            } else {
                // Если нет подколлекций (обычная папка)
                if (!(state.collectionNotes[parentId] && state.collectionNotes[parentId].includes(noteId))) {
                    hasAddableCollections = true;
                    collectionsHtml += `<div class="dropdown-menu-item" data-action="add-to-collection-${parentId}">${state.collections[parentId].name}</div>`;
                }
            }
        });

        if (hasAddableCollections) {
            return {
                type: 'collections-submenu',
                html: `
                    <div class="dropdown-submenu-container context-submenu-container">
                        <div class="dropdown-menu-item" style="justify-content: space-between;">
                            ${t.addToCollection || 'Add to Collection'}
                            <span style="font-size: 0.8em; color: var(--text-color-dark);">►</span>
                        </div>
                        <div class="dropdown-menu submenu" style="max-height: 300px; overflow-y: auto; overflow-x: hidden; min-width: 180px;">
                            ${collectionsHtml}
                        </div>
                    </div>
                `
            };
        }
        return null;
    }
// --- 👆 КОНЕЦ НОВОГО БЛОКА ---

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    dom.notesGrid.addEventListener('contextmenu', (e) => {
        if (dom.contextMenu.classList.contains('visible')) {
            e.preventDefault();
            hideContextMenuAnimated();
            return;
        }

        const tile = e.target.closest('.note-tile');
        if (!tile) return;
        hideTooltip();
        
        const noteId = tile.dataset.id;
        dom.contextMenu.dataset.noteId = noteId;
        dom.contextMenu.dataset.collId = '';
        const t = translations[state.settings.language];

        let menuItems = [
            { label: t.select, action: 'select-note' },
            { type: 'divider' },
            { label: t.metadata, action: 'show-metadata' },
            { type: 'divider' },
            { label: t.edit, action: 'edit-note' },
            { label: t.delete, action: 'delete-note' }
        ];

        const submenuItem = generateCollectionsSubmenu(noteId);
        if (submenuItem) {
            menuItems.push({ type: 'divider' });
            menuItems.push(submenuItem);
        }
        
        showContextMenu(e, menuItems);
    });
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    dom.collectionView.grid.addEventListener('contextmenu', (e) => {
        if (dom.contextMenu.classList.contains('visible')) {
            e.preventDefault();
            hideContextMenuAnimated();
            return;
        }

        const tile = e.target.closest('.note-tile');
        if (!tile) return;
        hideTooltip();

        const noteId = tile.dataset.id;
        dom.contextMenu.dataset.noteId = noteId;
        dom.contextMenu.dataset.collId = currentOpenCollectionId;
        const t = translations[state.settings.language];

        // 1. Базовые пункты меню для заметки внутри коллекции
        let menuItems = [
            { label: t.metadata, action: 'show-metadata' },
            { type: 'divider' },
            { label: t.edit, action: 'edit-note' },
            { label: t.delete, action: 'delete-note' },
            { type: 'divider' },
            { label: t.removeFromCollection, action: 'remove-from-collection' }
        ];

        // 2. Генерируем всплывающее меню с коллекциями
        // Передаем currentOpenCollectionId, чтобы исключить текущую коллекцию из списка
        const submenuItem = generateCollectionsSubmenu(noteId, currentOpenCollectionId);
        
        // 3. Если есть куда добавлять, вставляем подменю
        if (submenuItem) {
            menuItems.push({ type: 'divider' });
            menuItems.push(submenuItem);
        }
        
        // 4. Показываем меню
        showContextMenu(e, menuItems);
    });
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    // Всплытие подменю в контекстном меню (защита от моргания)
    
    // Вспомогательная функция для принудительного показа
    function showContextSubmenu(submenu) {
        clearTimeout(submenu.hideTimer);
        
        // Жестко сбрасываем состояние закрытия
        submenu.classList.remove('is-closing');
        
        // Важно: если анимация закрытия еще шла, она может "выстрелить" позже.
        // Убираем клоны элемента, чтобы сбросить все слушатели animationend
        const newSubmenu = submenu.cloneNode(true);
        submenu.parentNode.replaceChild(newSubmenu, submenu);
        
        newSubmenu.classList.add('visible');
        
        // Позиционируем
        newSubmenu.style.top = '-5px';
        newSubmenu.style.left = '100%';
        newSubmenu.style.right = 'auto';
        
        // Если не влезает в экран справа - открываем влево
        const rect = newSubmenu.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            newSubmenu.style.left = 'auto';
            newSubmenu.style.right = '100%';
        }
    }

    // Вспомогательная функция для плавного скрытия
    function hideContextSubmenu(submenu) {
        if (!submenu.classList.contains('visible') || submenu.classList.contains('is-closing')) {
            return;
        }

        submenu.hideTimer = setTimeout(() => {
            submenu.classList.add('is-closing');
            
            // Используем onanimationend вместо addEventListener, чтобы легче переопределять
            submenu.onanimationend = () => {
                if (submenu.classList.contains('is-closing')) {
                    submenu.classList.remove('visible');
                    submenu.classList.remove('is-closing');
                }
                submenu.onanimationend = null; // Очищаем за собой
            };
        }, 150); // Уменьшили задержку со 300мс до 150мс для более четкой реакции
    }

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    // Управление подменю коллекций
    dom.contextMenu.addEventListener('mouseover', (e) => {
        const container = e.target.closest('.context-submenu-container');
        if (container) {
            const submenu = container.querySelector('.submenu');
            if (submenu) {
                clearTimeout(submenu.hideTimer);
                submenu.classList.remove('is-closing');
                submenu.classList.add('visible');
                
                // Позиционируем
                submenu.style.top = '-5px';
                submenu.style.left = '100%';
                submenu.style.right = 'auto';
                
                const rect = submenu.getBoundingClientRect();
                if (rect.right > window.innerWidth) {
                    submenu.style.left = 'auto';
                    submenu.style.right = '100%';
                }
            }
        }
    });

    dom.contextMenu.addEventListener('mouseout', (e) => {
        const container = e.target.closest('.context-submenu-container');
        if (container) {
            const submenu = container.querySelector('.submenu');
            if (submenu) {
                // Если мы перешли на элемент внутри этого же подменю - ничего не делаем
                if (container.contains(e.relatedTarget)) return;

                clearTimeout(submenu.hideTimer);
                submenu.hideTimer = setTimeout(() => {
                    submenu.classList.add('is-closing');
                    submenu.addEventListener('animationend', () => {
                        if (submenu.classList.contains('is-closing')) {
                            submenu.classList.remove('visible');
                            submenu.classList.remove('is-closing');
                        }
                    }, { once: true });
                }, 200); // Твои 200мс на перевод мышки
            }
        }
    });
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

    dom.contextMenu.addEventListener('mouseout', (e) => {
        const container = e.target.closest('.context-submenu-container');
        if (container) {
            // Если курсор перешел на дочерний элемент ЭТОГО ЖЕ контейнера - ничего не делаем
            if (container.contains(e.relatedTarget)) return;
            
            const submenu = container.querySelector('.submenu');
            if (submenu) hideContextSubmenu(submenu);
        }
    });
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    dom.contextMenu.addEventListener('click', async (e) => {
        const target = e.target.closest('.dropdown-menu-item');
        if (!target) return;

                // --- ЛОГИКА АККОРДЕОНА В МЕНЮ ---
        if (target.classList.contains('context-collection-parent')) {
            e.stopPropagation(); // Останавливаем закрытие меню
            const group = target.closest('.context-collection-group');
            const list = group.querySelector('.context-subcollections-list');
            const icon = group.querySelector('.expander-icon');
            
            if (list.style.display === 'none') {
                list.style.display = 'flex';
                icon.style.transform = 'scale(0.55) rotate(90deg)';
            } else {
                list.style.display = 'none';
                icon.style.transform = 'scale(0.55)';
            }
            return; // Прерываем выполнение, чтобы не сработал основной клик
        }
        // --- КОНЕЦ ЛОГИКИ АККОРДЕОНА ---
        
        const action = target.dataset.action;
        if (!action) return;
        
        const noteId = dom.contextMenu.dataset.noteId;
        const collId = dom.contextMenu.dataset.collId;
        
        hideContextMenuAnimated(); 
        
        const t = translations[state.settings.language];
        
        if (action.startsWith('batch-copy-to-')) {
            const targetVaultName = action.replace('batch-copy-to-', '');
            const selectedIds = Array.from(selectedNoteIds);
            
            showLoader();
            const result = await eel.copy_notes_to_vault(selectedIds, targetVaultName)();
            hideLoader();

            if (result.success) {
                if (result.copied_count > 0) {
                    showNotification(t.notesCopiedToVault(result.copied_count, targetVaultName));
                }
            } else {
                await showCustomAlert('Error', result.message);
            }
            
            deactivateSelectionMode();
            return;
        }

        if (action.startsWith('batch-move-to-')) {
            const targetVaultName = action.replace('batch-move-to-', '');
            const selectedIds = Array.from(selectedNoteIds);
            
            showLoader();
            const result = await eel.move_notes_to_vault(selectedIds, targetVaultName)();
            hideLoader();
            
            if (result.success) {
                showNotification(t.notesMovedToVault(result.moved_count, targetVaultName));
                setTimeout(() => reload_app(), 1200);
            } else {
                await showCustomAlert('Error', result.message);
            }
            
            deactivateSelectionMode();
            return;
        }
        
        if (action.startsWith('batch-add-to-')) {
            const collectionId = action.replace('batch-add-to-', '');
            const selectedIds = Array.from(selectedNoteIds);
            
            const result = await eel.add_notes_to_collection_batch(selectedIds, collectionId)();
            if (result.success && result.added_count > 0) {
                selectedIds.forEach(id => {
                    if (!state.collectionNotes[collectionId].includes(id)) {
                        state.collectionNotes[collectionId].push(id);
                    }
                });
                updateCounters();
                showNotification(t.notesAddedToCollection(result.added_count, state.collections[collectionId].name));
            }
            deactivateSelectionMode();
            return;
        }
        
        if (action === 'select-note') {
            activateSelectionMode(noteId);
            return;
        }

        if (action === 'edit-note') {
            await openNoteModal(noteId);
        }
        else if (action === 'delete-note') {
            if (await showCustomConfirm('deleteNoteTitle', t.deleteNoteMessage, 'deleteAction', 'cancel', true)) {
                const result = await eel.delete_note(noteId)();
                if (result.success) {
                    delete state.notes[result.deleted_id];
                    delete state.noteContentsCache[result.deleted_id];
                    Object.keys(state.collectionNotes).forEach(cId => {
                        state.collectionNotes[cId] = state.collectionNotes[cId].filter(nId => nId !== result.deleted_id);
                    });
                    
                    renderFullUI();
                    updateCounters();
                    if (currentOpenCollectionId) {
                        renderCollectionView(currentOpenCollectionId);
                    }
                    showNotification('noteDeleted');
                }
            }
        }
        else if (action.startsWith('add-to-collection-')) {
            const collectionId = action.replace('add-to-collection-', '');
            const result = await eel.add_note_to_collection(noteId, collectionId)();
            if (result.success) {
                state.collectionNotes[collectionId] = state.collectionNotes[collectionId] || [];
                if (!state.collectionNotes[collectionId].includes(noteId)) {
                    state.collectionNotes[collectionId].push(noteId);
                }
                showNotification('noteAddedToCollection');
                updateCounters();
                if (currentOpenCollectionId === collectionId) renderCollectionView(collectionId);
            }
        }
        else if (action === 'remove-from-collection') {
            const result = await eel.remove_note_from_collection(noteId, collId)();
            if (result.success) {
                state.collectionNotes[collId] = state.collectionNotes[collId].filter(id => id !== noteId);
                renderCollectionView(collId);
                updateCounters();
                showNotification('removeFromCollection');
            }
        }
        else if (action === 'create-subcollection') {
            parentIdForNewSubcollection = collId;
            openCollectionModal(); // Открываем стандартное окно
        }

                else if (action === 'create-subcollection') {
            parentIdForNewSubcollection = collId; // Запоминаем, куда кладем
            openCollectionModal(); // Открываем стандартное окно ввода имени
        }

        else if (action === 'rename-collection') {
            
            const newName = await showCustomPrompt('rename', t.enterNewName, state.collections[collId].name);
            if (newName && newName !== state.collections[collId].name) {
                const result = await eel.rename_collection(collId, newName)();
                if (result) {
                    state.collections[collId] = result.data;
                    const item = dom.collectionsList.querySelector(`.collection-item[data-id="${collId}"]`);
                    if (item) {
                        item.querySelector('span[data-name]').textContent = newName;
                        item.querySelector('span[data-name]').dataset.name = newName;
                    }
                }
            }
        }
        else if (action === 'delete-collection') {
            if (await showCustomConfirm('deleteCollectionTitle', t.deleteCollectionMessage(state.collections[collId].name), 'deleteAction', 'cancel', true)) {
                const result = await eel.delete_collection(collId)();
                if (result.success) {
                    // Закрываем просмотр, если удалили открытую
                    if (currentOpenCollectionId === collId || result.deleted_ids.includes(currentOpenCollectionId)) {
                        closeCollectionView();
                    }
                    // Удаляем из state
                    result.deleted_ids.forEach(id => {
                        delete state.collections[id];
                        delete state.collectionNotes[id];

                        const groupToRemove = dom.collectionsList.querySelector(`.collection-group[data-group-id="${id}"]`);
                        if (groupToRemove) {
                            groupToRemove.classList.add('fading-out');
                            groupToRemove.addEventListener('transitionend', () => groupToRemove.remove(), { once: true });
                        }

                    });
                    
                    renderFullUI(); // Проще перерисовать дерево целиком
                    updateCounters();
                    showNotification('collectionDeleted');
                }
            }
        }
    });
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---


    // --- 7. Инициализация приложения ---

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    async function initializeApp() {
        // Устанавливаем иконки при запуске
        document.querySelector('.collections-header .icon').src = 'icons/icon_collections.svg';
        document.getElementById('add-collection-btn').querySelector('.icon').src = 'icons/icon_add.svg';
        document.getElementById('hamburger-btn').querySelector('img').src = 'icons/icon_menu.svg';
        document.getElementById('options-btn').querySelector('img').src = 'icons/icon_options.svg';
        document.querySelector('.search-icon').src = 'icons/icon_search.svg';
        
        try {
            // Сначала получаем данные
            const initialData = await eel.get_initial_data()();
            
            // Заполняем state
            state.notes = initialData.metadata.notes || {};
            state.collections = initialData.metadata.collections || {};
            state.collectionNotes = initialData.metadata.collection_notes || {};
            state.notePreviews = initialData.content_previews || {};
            state.vaults = initialData.vaults || [];
            state.settings = initialData.settings || state.settings;
            
            // РИСУЕМ МЕНЮ ОПЦИЙ НА ОСНОВЕ ЗАГРУЖЕННЫХ ДАННЫХ
            const t = translations[state.settings.language] || translations.en;

            // 👇 ВСТАВЬТЕ ЭТОТ БЛОК ПЕРЕД dom.optionsMenu.innerHTML = ...
            let stylesMenuHtml = '';
            for (const [key, value] of Object.entries(visualStyles)) {
                stylesMenuHtml += `<div class="dropdown-menu-item" data-visual-style="${key}">${value.name}</div>`;
            }
            // 👆 КОНЕЦ БЛОКА

            dom.optionsMenu.innerHTML = `
                <div class="dropdown-submenu-container" id="theme-submenu-container">
                    <div class="dropdown-menu-item"><span data-translate="changeTheme">${t.changeTheme}</span></div>
                    <div class="dropdown-menu submenu">
                        <div class="dropdown-menu-item" data-theme-base="dark"><span data-translate="darkTheme">${t.darkTheme}</span></div>
                        <div class="dropdown-menu-item" data-theme-base="light"><span data-translate="lightTheme">${t.lightTheme}</span></div>
                        <div class="dropdown-divider"></div>
                        <div id="accent-colors-container"></div>
                        
                        <!-- 👇 ВОТ ВОССТАНОВЛЕННЫЙ БЛОК -->
                        <div class="dropdown-divider"></div>
                        <div id="text-colors-container"></div>
                        <!-- 👆 КОНЕЦ ВОССТАНОВЛЕННОГО БЛОКА -->

                    </div>
                </div>

                <!-- 👇 ВСТАВЬТЕ ЭТОТ БЛОК -->
                <div class="dropdown-submenu-container">
                    <div class="dropdown-menu-item"><span data-translate="changeStyle">${t.changeStyle}</span></div>
                    <div class="dropdown-menu submenu">
                        ${stylesMenuHtml}
                    </div>
                </div>
                <!-- 👆 КОНЕЦ БЛОКА -->

                <div class="dropdown-submenu-container" id="language-submenu-container">
                    <div class="dropdown-menu-item"><span data-translate="language">${t.language}</span></div>
                    <div class="dropdown-menu submenu">
                        <div class="dropdown-menu-item" data-lang="ru">Русский</div>
                        <div class="dropdown-menu-item" data-lang="en">English</div>
                    </div>
                </div>

                <div class="dropdown-menu-item" style="justify-content: space-between; padding-right: 8px;">
                    <span data-translate="sound">${t.sound}</span>
                    <!-- Используем тот же ID, но добавляем pointer-events: none на сам пункт меню, 
                         чтобы клик точно попадал на label со слайдером -->
                    <label class="switch" style="transform: scale(0.8); margin: 0; cursor: pointer;" onclick="event.stopPropagation();">
                        <input type="checkbox" id="sound-toggle" style="display: none;" ${state.settings.sound_enabled !== false ? 'checked' : ''}>
                        <div class="slider-track"><div class="slider-nub"></div></div>
                    </label>
                </div>

                <div class="dropdown-divider"></div>
                <div class="dropdown-menu-item" data-action="change-notes-dir"><span data-translate="changeNotesDir">${t.changeNotesDir}</span></div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-menu-item" data-action="tutorial"><span data-translate="showTutorial">${t.showTutorial}</span></div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-menu-item" data-action="about-app"><span data-translate="aboutApp">${t.aboutApp}</span></div>

            `;

            // 👇 ВСТАВЬТЕ ЭТОТ ОБРАБОТЧИК
            document.getElementById('sound-toggle').addEventListener('change', async (e) => {
                const isEnabled = e.target.checked;
                state.settings.sound_enabled = isEnabled;
                await eel.save_settings({ sound_enabled: isEnabled })();
                if (isEnabled) SoundManager.play('success'); 
            });
            // 👆 КОНЕЦ           
            
            // Мы должны заново найти все наши контейнеры после перерисовки
            dom.accentColorsContainer = document.getElementById('accent-colors-container');
            const textColorsContainer = document.getElementById('text-colors-container');
            
            // Генерируем кнопки для акцентного цвета
            for (const [key, value] of Object.entries(accentThemes)) {
                const item = document.createElement('div');
                item.className = 'theme-dot';
                item.dataset.themeAccent = key;
                item.style.backgroundColor = value.color;
                item.title = value.name;
                dom.accentColorsContainer.appendChild(item);
            }

            // Генерируем кнопки для цвета текста
            for (const [key, value] of Object.entries(textThemes)) {
                const item = document.createElement('div');
                item.className = 'theme-dot';
                item.dataset.themeText = key;
                item.style.backgroundColor = value.color;
                item.title = value.name;
                textColorsContainer.appendChild(item);
            }
            
            // Применяем все загруженные настройки
            applyTranslations(state.settings.language);
            applyTheme(state.settings.theme_base, state.settings.theme_accent);
            applyTextTheme(state.settings.theme_text || 'default');
            applyVisualStyle(state.settings.current_style || 'default');
            
            // Отрисовываем основной интерфейс
            renderFullUI();
            updateCounters();

            // Запускаем обучение, если нужно
            if (initialData.metadata.show_tutorial) {
                setTimeout(async () => {
                    const takeTour = await showCustomConfirm(
                        'tutorialPromptTitle', 
                        t.tutorialPromptMessage, 
                        'ok',
                        'cancel'
                    );

                    eel.mark_tutorial_as_seen()();

                    if (takeTour) {
                        startTutorial(tutorialSteps, state.settings.language);
                    } else {
                        pointToTutorialButton();
                    }
                }, 800);
            }

        } catch (error) {
            console.error("Fatal: Failed to initialize app.", error);
            alert('Initialization Error: Could not load application data. The application will now close.');
            window.close();
        }
    }
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

    initializeApp();
});

// --- Глобальные функции ---
eel.expose(reload_app, 'reload_app');
function reload_app() {
    location.reload();
}