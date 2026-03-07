// Текущая версия приложения (ОБЯЗАТЕЛЬНО ОБНОВЛЯТЬ ПРИ КАЖДОМ РЕЛИЗЕ!)
const APP_VERSION = "v2.5";

// --- 👇 НОВЫЙ БЛОК: СЛОВАРЬ SVG ИКОНОК (В САМОМ ВЕРХУ - ГЛОБАЛЬНО) ---
const svgs = {
    // 📁 Базовые: Папки, Архивы, Коробки
    folder: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`,
    dash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="12" x2="16" y2="12"></line></svg>`,
    archive: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>`,

    box: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
    inbox: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>`,

    // ⭐ Важное: Звезды, Сердца, Флаги, Закладки
    star: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
    heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
    bookmark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>`,
    flag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>`,
    
    // 💻 IT & Dev: Код, Терминал, Базы, Серверы, Сети
    code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
    terminal: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>`,
    database: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>`,
    cpu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>`,
    server: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>`,
    command: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg>`,
    hash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>`,
    git_branch: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>`,
    
    // 💼 Работа & Обучение: Книги, Портфели, Списки, Графики
    book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
    briefcase: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
    list: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`,
    check_square: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>`,
    clipboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>`,
    bar_chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>`,
    pie_chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>`,
    
    // 🎨 Медиа & Дизайн: Картинки, Видео, Звук, Дизайн
    image: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`,
    camera: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`,
    film: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>`,
    headphones: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>`,
    pen_tool: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>`,
    
    // 🌐 Коммуникации: Мир, Письмо, Чат, Связь
    globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
    mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
    message_square: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
    link: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
    
    // 🛡️ Прочее: Замок, Щит, Ключ, Настройки
    lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
    shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
    key: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>`,
    settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`
};
// --- 👆 КОНЕЦ НОВОГО БЛОКА ---

// --- 👆 КОНЕЦ НОВОГО БЛОКА ---

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
    let initialNoteDesc = '';
    let currentOpenCollectionId = null;
    let currentEditingNoteId = null;
    let draggedElement = { id: null, type: null, source: null };
    let menuHideTimer;
    let tooltipTimer = null;
    let notificationTimer = null;
    let isSelectionModeActive = false;
// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    let selectedNoteIds = new Set();
    let activeDotContext = null;
    let previousThemeBase = null; 
    let parentIdForNewSubcollection = null;
    let isInteractingWithSubmenu = false; // <-- НОВЫЙ ФЛАГ (Замок закрытия)
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

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
// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
        hamburgerBtn: document.getElementById('hamburger-btn'),
        optionsBtn: document.getElementById('options-btn'),
// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
        viewModeBtn: document.getElementById('view-mode-btn'),
        viewModeIcon: document.getElementById('view-mode-icon'),
        collViewModeBtn: document.getElementById('collection-view-mode-btn'),
        collViewModeIcon: document.getElementById('collection-view-mode-icon'),
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

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
            tagsInput: document.getElementById('note-tags-input'),
            tagsPanel: document.getElementById('tags-autocomplete-panel'), // <-- ДОБАВЛЕНО
            descInput: document.getElementById('note-desc-input'),
            contentInput: document.getElementById('note-content-input'),
            saveBtn: document.querySelector('#note-modal [data-action="save"]'),
            cancelBtn: document.querySelector('#note-modal [data-action="cancel"]')
        },


// --- 👇 ВСТАВИТЬ ПОСЛЕ noteModal ---
        quickEditModal: {
            el: document.getElementById('quick-edit-modal'),
            title: document.getElementById('quick-edit-title'),
            contentInput: document.getElementById('quick-edit-content-input'),
            saveBtn: document.querySelector('#quick-edit-modal [data-action="save"]'),
            cancelBtn: document.querySelector('#quick-edit-modal [data-action="cancel"]')
        },
// --- 👆 КОНЕЦ ВСТАВКИ ---


        collectionModal: {
            el: document.getElementById('collection-modal'),
            title: document.getElementById('collection-modal-title'), 
            nameInput: document.getElementById('collection-name-input'),
            iconBtn: document.getElementById('collection-icon-btn'), 
            iconWrapper: document.getElementById('collection-icon-wrapper'), // <-- НОВОЕ
            iconGrid: document.getElementById('collection-icon-grid'), 
            colorBtn: document.getElementById('collection-color-btn'), 
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
        blue: { nameKey: 'themeDefault', color: '#589DF6' },
        purple: { nameKey: 'themePurple', color: '#B388FF' },
        orange: { nameKey: 'themeOrange', color: '#FFAB70' },
        red: { nameKey: 'themeRose', color: '#F06292' },
        cyan: { nameKey: 'themeCyan', color: '#4DD0E1' },
        custom: { nameKey: 'themeCustom', color: 'transparent' }
    };

    // --- 👇 НОВЫЙ БЛОК ---
    const textThemes = {
        default: { nameKey: 'themeDefault', color: '#B0B0B0' },
        sky: { nameKey: 'themeSky', color: '#A6D1E6' },
        lavender: { nameKey: 'themeLavender', color: '#CDB4DB' },
        sand: { nameKey: 'themeSand', color: '#E9D699' },
        blush: { nameKey: 'themeBlush', color: '#EBBAB9' },
        custom: { nameKey: 'themeCustom', color: 'transparent' }
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
            quickEdit: 'Quick Edit',
            changeColor: 'Change Color',
            resetColor: 'Reset to Default',
            chooseColor: 'Choose Color',
            tagsPlaceholder: 'Tags (comma separated)',
            descPlaceholder: 'Description (optional, max 500 chars)',
            changeStyle: 'Change Style',
            styleUpdated: 'Style updated',
            myWorkspace: 'My Workspace', 
            collections: 'Collections', 
            newCollection: 'New Collection',
            createSubcollection: 'Create Subcollection',
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
            collectionUpdated: 'Collection updated',
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
            sound: 'Sound Effects',
            updateAvailable: '🎉 Update Available',
            downloadUpdate: 'Download now)',
            infoTitle: 'Info',
            errorTitle: 'Error',
            noOtherVaults: 'No other vaults available to move or copy notes to.',
            importCheckFailed: 'Failed to check import:\n',
            importFailed: 'Failed to import vault:\n',
            exportFailed: 'Failed to export vault:\n',
            fatalInitError: 'Initialization Error: Could not load application data. The application will now close.',
            
            // Темы и Цвета
            themeDefault: 'Default',
            themePurple: 'Purple',
            themeOrange: 'Orange',
            themeRose: 'Rose',
            themeCyan: 'Cyan',
            themeSky: 'Sky',
            themeLavender: 'Lavender',
            themeSand: 'Sand',
            themeBlush: 'Blush',
            themeCustom: 'Custom',

            // Ошибки Бэкенда (Коды)
            err_note_in_collection: 'Note already in collection.',
            err_collection_not_found: 'Collection not found.',
            err_vault_name_empty: 'Vault name cannot be empty.',
            err_vault_exists: 'Vault with this name already exists.',
            err_vault_not_found: (name) => `Vault "${name}" not found.`,
            err_vault_name_taken: (name) => `A vault named "${name}" already exists.`,
            err_rename_failed: (e) => `Error renaming vault: ${e}`,
            err_delete_last_vault: 'Cannot delete the last remaining vault.',
            err_delete_failed: (e) => `Error deleting vault directory: ${e}`,
            err_export_cancelled: 'Export cancelled.',
            err_import_cancelled: 'Import cancelled.',
            err_missing_args: 'Missing note IDs or target vault.',
            err_target_vault_not_found: (name) => `Target vault "${name}" not found.`,
            err_dir_cancelled: 'Directory selection cancelled.'
        },
        ru: {
            changeStyle: 'Сменить стиль', 
            styleUpdated: 'Стиль обновлен', 
            chooseColor: 'Выберите цвет',
            myWorkspace: 'My Workspace', 
            collections: 'Коллекции',
            emptyStateMessage: "Пока нет ни одной записки. Нажмите Создать, чтобы добавить первую!",
            newCollection: 'Новая коллекция', 
            createSubcollection: 'Создать подколлекцию',
            tagsPlaceholder: 'Теги (через запятую)',
            descPlaceholder: 'Описание (необязательно, до 500 символов)',
            newNote: 'Создать', 
            searchPlaceholder: 'Поиск записок...', 
            changeTheme: 'Сменить тему', 
            language: 'Язык', 
            aboutApp: 'О приложении', 
            editNote: 'Редактировать записку', 
            noteNamePlaceholder: 'Название записки', 
            noteContentPlaceholder: 'Введите текст вашей записки...', 
            quickEdit: 'Редактор',
            changeColor: 'Изменить цвет',
            resetColor: 'Сбросить по умолчанию',
            collectionNamePlaceholder: 'Название коллекции', 
            ok: 'Да', 
            cancel: 'Отмена', 
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
            collectionUpdated: 'Коллекция обновлена',
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
            sound: 'Звуковые эффекты',
            updateAvailable: '🎉 Доступно обновление',
            downloadUpdate: 'Скачать)',
            infoTitle: 'Информация',
            errorTitle: 'Ошибка',
            noOtherVaults: 'Нет других хранилищ для перемещения или копирования.',
            importCheckFailed: 'Не удалось проверить импорт:\n',
            importFailed: 'Не удалось импортировать хранилище:\n',
            exportFailed: 'Не удалось экспортировать хранилище:\n',
            fatalInitError: 'Ошибка инициализации: Не удалось загрузить данные приложения. Программа будет закрыта.',
            
            // Темы и Цвета
            themeDefault: 'По умолчанию',
            themePurple: 'Фиолетовый',
            themeOrange: 'Оранжевый',
            themeRose: 'Розовый',
            themeCyan: 'Голубой',
            themeSky: 'Небесный',
            themeLavender: 'Лавандовый',
            themeSand: 'Песочный',
            themeBlush: 'Румянец',
            themeCustom: 'Пользовательский',

            // Ошибки Бэкенда (Коды)
            err_note_in_collection: 'Заметка уже в коллекции.',
            err_collection_not_found: 'Коллекция не найдена.',
            err_vault_name_empty: 'Имя хранилища не может быть пустым.',
            err_vault_exists: 'Хранилище с таким именем уже существует.',
            err_vault_not_found: (name) => `Хранилище "${name}" не найдено.`,
            err_vault_name_taken: (name) => `Хранилище с именем "${name}" уже существует.`,
            err_rename_failed: (e) => `Ошибка переименования: ${e}`,
            err_delete_last_vault: 'Нельзя удалить последнее хранилище.',
            err_delete_failed: (e) => `Ошибка удаления папки: ${e}`,
            err_export_cancelled: 'Экспорт отменен.',
            err_import_cancelled: 'Импорт отменен.',
            err_missing_args: 'Отсутствуют ID заметок или целевое хранилище.',
            err_target_vault_not_found: (name) => `Целевое хранилище "${name}" не найдено.`,
            err_dir_cancelled: 'Выбор папки отменен.'
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

    // Утилита для конвертации HEX (#ff0000) в строку RGB (255, 0, 0)
    function hexToRgbString(hex) {
        let r = 0, g = 0, b = 0;
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) {
            r = parseInt(hex.substring(1, 3), 16);
            g = parseInt(hex.substring(3, 5), 16);
            b = parseInt(hex.substring(5, 7), 16);
        }
        return `${r}, ${g}, ${b}`;
    }


    // Кастомный выбор цвета
    function openCustomColorPicker(initialColorHex) {
        return new Promise((resolve) => {
            const modal = document.getElementById('color-picker-modal');
            const preview = document.getElementById('color-picker-preview');
            const hueSlider = document.getElementById('color-picker-hue');
            const lightSlider = document.getElementById('color-picker-lightness');
            const btnOk = document.getElementById('color-picker-ok');
            const btnCancel = document.getElementById('color-picker-cancel');

            // Вспомогательная функция для обновления предпросмотра
            const updatePreview = () => {
                const color = `hsl(${hueSlider.value}, 100%, ${lightSlider.value}%)`;
                preview.style.backgroundColor = color;
                // Красим фон ползунка яркости в текущий оттенок
                lightSlider.style.background = `linear-gradient(to right, #000, hsl(${hueSlider.value}, 100%, 50%), #fff)`;
            };

            // Слушатели ползунков (обновление в реальном времени)
            hueSlider.oninput = updatePreview;
            lightSlider.oninput = updatePreview;

            // Сброс яркости на 50% при двойном клике
            lightSlider.ondblclick = () => {
                lightSlider.value = 50;
                updatePreview(); // Обязательно перерисовываем кружок
            };

            // Вспомогательная функция конвертации HSL в HEX

            const hslToHex = (h, s, l) => {
                l /= 100;
                const a = s * Math.min(l, 1 - l) / 100;
                const f = n => {
                    const k = (n + h / 30) % 12;
                    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
                    return Math.round(255 * color).toString(16).padStart(2, '0');
                };
                return `#${f(0)}${f(8)}${f(4)}`;
            };

            // Кнопки
            const close = () => {
                modal.classList.remove('visible');
                btnOk.onclick = null;
                btnCancel.onclick = null;
            };

            btnOk.onclick = () => {
                const hexColor = hslToHex(hueSlider.value, 100, lightSlider.value);
                close();
                resolve(hexColor);
            };

            btnCancel.onclick = () => {
                close();
                resolve(null);
            };

            // Примитивная инициализация (чтобы не усложнять конвертер HEX->HSL, просто сбрасываем в дефолт)
            hueSlider.value = 200; 
            lightSlider.value = 50;
            updatePreview();

            modal.classList.add('visible');
        });
    }



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

        // --- Блок 3: Теги ---
        let tagsHtml = '';
        if (note.tags && note.tags.trim() !== '') {
            // Разбиваем строку "tag1, tag2" в массив и форматируем каждый с решеткой
            const tagsArray = note.tags.split(',').map(t => t.trim()).filter(t => t);
            if (tagsArray.length > 0) {
                const tagsList = tagsArray.map(t => `<span style="display: block; color: var(--accent-color); padding-left: 8px;">#${t}</span>`).join('');
                tagsHtml = `<div class="dropdown-divider"></div><div style="font-size: 0.9em; color: var(--text-color);">Tags:<div style="margin-top: 4px;">${tagsList}</div></div>`;
            }
        }

        // --- Блок 3: Сборка финального HTML ---
        return dateHtml + collectionsHtml + tagsHtml;
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
        dom.noteModal.tagsInput.placeholder = t.tagsPlaceholder;
        dom.noteModal.descInput.placeholder = t.descPlaceholder;

        // Динамическое имя для тултипов цвета
        document.querySelectorAll('.theme-dot').forEach(dot => {
            const isText = dot.hasAttribute('data-theme-text');
            const key = isText ? dot.dataset.themeText : dot.dataset.themeAccent;
            const prefix = isText ? 'text_' : 'accent_';
            const defaultColor = isText ? textThemes[key].color : accentThemes[key].color;
            const nameKey = isText ? textThemes[key].nameKey : accentThemes[key].nameKey;
            
            let currentColor = defaultColor;
            
            if (key === 'custom') {
                currentColor = isText ? state.settings.custom_text : state.settings.custom_accent;
                dot.dataset.tooltipText = t[nameKey];
            } else if (state.settings.color_overrides && state.settings.color_overrides[`${prefix}${key}`]) {
                currentColor = state.settings.color_overrides[`${prefix}${key}`];
                dot.dataset.tooltipText = ColorNamer.getName(currentColor, lang);
            } else {
                dot.dataset.tooltipText = t[nameKey];
            }
        });
    }


    function applyTheme(base, accent) {
        state.settings.theme_base = base;
        state.settings.theme_accent = accent;

        document.body.dataset.themeBase = base;
        document.body.dataset.themeAccent = accent;

        const overrides = state.settings.color_overrides || {};
        const overrideKey = `accent_${accent}`;

        if (accent === 'custom') {
            const hex = state.settings.custom_accent;
            document.body.style.setProperty('--accent-color', hex);
            document.body.style.setProperty('--accent-color-rgb', hexToRgbString(hex));
        } else if (overrides[overrideKey]) {
            // Если пользователь перекрасил стандартную тему - применяем её
            const hex = overrides[overrideKey];
            document.body.style.setProperty('--accent-color', hex);
            document.body.style.setProperty('--accent-color-rgb', hexToRgbString(hex));
        } else {
            document.body.style.removeProperty('--accent-color');
            document.body.style.removeProperty('--accent-color-rgb');
        }

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
        // 1. Обновляем выделение только для Базовой Темы (Light/Dark)
        document.querySelectorAll('#theme-submenu-container [data-theme-base]').forEach(el => el.classList.remove('selected'));
        document.querySelector(`[data-theme-base="${base}"]`)?.classList.add('selected');
        
        // 2. Обновляем выделение ТОЛЬКО для точек АКЦЕНТА (игнорируя точки текста)
        document.querySelectorAll('#accent-colors-container .theme-dot').forEach(el => el.classList.remove('selected'));
        document.querySelector(`#accent-colors-container .theme-dot[data-theme-accent="${accent}"]`)?.classList.add('selected');
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

    }



// --- 👇 ЗАМЕНА APPLY TEXT THEME ---
    function applyTextTheme(theme) {
        state.settings.theme_text = theme;
        document.body.dataset.themeText = theme;

        if (theme === 'custom') {
            const hex = state.settings.custom_text;
            document.body.style.setProperty('--note-title-color', hex);
            // Текст делаем тем же цветом, но чуть прозрачнее для иерархии
            document.body.style.setProperty('--note-text-color', `color-mix(in srgb, ${hex} 70%, transparent)`);
        } else {
            document.body.style.removeProperty('--note-title-color');
            document.body.style.removeProperty('--note-text-color');
        }

        const textColorsContainer = document.getElementById('text-colors-container');
        if (textColorsContainer) {
            textColorsContainer.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
            textColorsContainer.querySelector(`[data-theme-text="${theme}"]`)?.classList.add('selected');
        }
    }
// --- 👆 КОНЕЦ ЗАМЕНЫ ---


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

    function getErrorMessage(result) {
        // НОВЫЙ БЛОК: Проверка на фатальный краш бэкенда
        if (result && result.is_fatal) {
            // Закрываем все модалки, если открыты
            document.querySelectorAll('.modal.visible').forEach(m => m.classList.remove('visible'));
            // Вызываем HTML экран смерти, передавая ему чистый трейсбэк из Python!
            showFatalErrorScreen(result.errorArg);
            // Возвращаем пустую строку, чтобы предотвратить дальнейшие алерты
            return ""; 
        }

        const t = translations[state.settings.language];
        if (result.errorCode) {
            if (result.errorArg) {
                return t[result.errorCode](result.errorArg);
            }
            return t[result.errorCode] || result.errorCode;
        }
        return result.message || 'Unknown error';
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

// --- 👇 ВСТАВИТЬ СЮДА ---
    // Движок плавной перестройки сетки (FLIP Animation)
    function animateGridFLIP(grid, actionCallback) {
        // 1. First: Запоминаем текущие позиции и размеры всех карточек
        const children = Array.from(grid.querySelectorAll('.note-tile'));
        const firstPositions = new Map();
        children.forEach(child => firstPositions.set(child.dataset.id, child.getBoundingClientRect()));

        // 2. Выполняем мгновенное переключение класса (Grid -> List)
        actionCallback();

        // 3. Last: Запоминаем новые позиции и размеры, куда браузер их мгновенно перекинул
        const newChildren = Array.from(grid.querySelectorAll('.note-tile'));
        const lastPositions = new Map();
        newChildren.forEach(child => lastPositions.set(child.dataset.id, child.getBoundingClientRect()));

        // 4. Invert & Play: Возвращаем карточки в прошлое и плавно отпускаем
        newChildren.forEach(child => {
            const id = child.dataset.id;
            const first = firstPositions.get(id);
            const last = lastPositions.get(id);

            if (first && last) {
                const dx = first.left - last.left;
                const dy = first.top - last.top;
                const dw = first.width / last.width;
                const dh = first.height / last.height;
                
                if (dx !== 0 || dy !== 0 || dw !== 1 || dh !== 1) {
                    // Возвращаем в прошлое (сдвигаем и масштабируем)
                    child.style.transformOrigin = 'top left';
                    child.style.transform = `translate(${dx}px, ${dy}px) scale(${dw}, ${dh})`;
                    child.style.transition = 'none'; // Отключаем CSS-переходы на кадр
                    
                    // Гасим текст, чтобы он не плющился
                    const innerText = child.querySelector('.note-text');
                    if (innerText) innerText.style.opacity = '0';
                    
// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
                    // Плавно и РЕЗКО отпускаем в настоящее
                    requestAnimationFrame(() => {
                        child.style.transform = '';
                        // Сократили время до 0.25s и сделали резкий старт с плавным торможением (ease-out)
                        child.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
                        if (innerText) {
                            innerText.style.opacity = '';
                            // Текст появляется быстрее
                            innerText.style.transition = 'opacity 0.15s ease 0.1s';
                        }
                        
                        // Очищаем стили чуть раньше
                        setTimeout(() => {
                            child.style.transition = '';
                            child.style.transformOrigin = '';
                            if (innerText) innerText.style.transition = '';
                        }, 300);
                    });
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

                }
            }
        });
    }
// --- 👆 КОНЕЦ ВСТАВКИ ---


    function createNoteTileElement(noteId) {
        const note = state.notes[noteId];
        if (!note) return null;
        const tile = document.createElement('div');
        tile.className = 'note-tile';
        tile.dataset.id = noteId;
        tile.setAttribute('draggable', 'true');
        const content = state.notePreviews[noteId] || '';
        
        const quickActionsHtml = `
            <div class="quick-actions-bar">
                <button class="qa-btn qa-edit" data-qa-action="edit"></button>
                <button class="qa-btn qa-delete" data-qa-action="delete"></button>
            </div>
        `;

        // --- УМНАЯ ПОДКРАСКА ЛИНИИ ---
        const parentCollections = Object.keys(state.collectionNotes).filter(collId => state.collectionNotes[collId].includes(noteId));
        
        let lineStyleHTML = '';
        if (parentCollections.length > 0) {
            // Берем первую коллекцию
            const firstCollId = parentCollections[0];
            const coll = state.collections[firstCollId];
            
            // Если у коллекции ЕСТЬ кастомный цвет - жестко вшиваем его в инлайн-стиль!
            // Псевдоэлемент ::after нельзя стилизовать через HTML, поэтому мы добавим реальный <div> линии.
            if (coll && coll.color) {
                lineStyleHTML = `<div class="note-custom-line" style="background: linear-gradient(90deg, ${coll.color}, transparent);"></div>`;
            }
        }
        
        // Если кастомного цвета нет - генерируем стандартную линию
        if (!lineStyleHTML) {
            lineStyleHTML = `<div class="note-custom-line default-line"></div>`;
        }
        // ------------------------------

        tile.innerHTML = `
            <div class="note-title" data-name="${note.title.replace(/"/g, '&quot;')}">${note.title}</div>
            ${lineStyleHTML}
            <div class="note-text">${content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
            ${quickActionsHtml}
        `;
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

        // Если иконка не задана: для подколлекций ставим 'dash', для главных 'folder'
        let defaultIcon = collection.parentId ? 'dash' : 'folder';
        const iconKey = collection.icon && svgs[collection.icon] ? collection.icon : defaultIcon;
        
        // --- НОВАЯ ЛОГИКА ОКРАСКИ ---
        const customColorStyle = collection.color ? `style="color: ${collection.color};"` : '';
        
        // Если это дефис, мы можем немного сузить его, чтобы сымитировать старый дизайн, но оставить его полноценной иконкой
        const extraClass = iconKey === 'dash' ? 'icon-dash' : '';
        const iconHtml = svgs[iconKey].replace('<svg ', `<svg class="icon ${extraClass}" ${customColorStyle} `); 

        // Внутренности кнопки
        item.innerHTML = `
            <span class="expander-icon">▶</span>
            ${iconHtml}
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
        
        // Вычисляем цвет линии, как при создании
        const parentCollections = Object.keys(state.collectionNotes).filter(collId => state.collectionNotes[collId].includes(noteId));
        let lineColorStyle = '';
        if (parentCollections.length > 0) {
            const firstCollId = parentCollections[0];
            const coll = state.collections[firstCollId];
            if (coll && coll.color) {
                lineColorStyle = `linear-gradient(90deg, ${coll.color}, transparent)`;
            }
        }

        const mainTile = dom.notesGrid.querySelector(`.note-tile[data-id="${noteId}"]`);
        if (mainTile) {
            const titleEl = mainTile.querySelector('.note-title');
            if (titleEl) {
                titleEl.textContent = note.title;
                titleEl.dataset.name = note.title;
            }
            const textEl = mainTile.querySelector('.note-text');
            if (textEl) textEl.textContent = preview;
            
            // Обновляем линию
            const lineEl = mainTile.querySelector('.note-custom-line');
            if (lineEl) {
                if (lineColorStyle) {
                    lineEl.style.background = lineColorStyle;
                    lineEl.classList.remove('default-line');
                } else {
                    lineEl.style.background = ''; // Сбрасываем инлайн
                    lineEl.classList.add('default-line');
                }
            }
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

            // Обновляем линию
            const lineEl = collectionTile.querySelector('.note-custom-line');
            if (lineEl) {
                if (lineColorStyle) {
                    lineEl.style.background = lineColorStyle;
                    lineEl.classList.remove('default-line');
                } else {
                    lineEl.style.background = '';
                    lineEl.classList.add('default-line');
                }
            }
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

        // Запоминаем ID всех открытых папок перед очисткой
        const expandedGroups = Array.from(document.querySelectorAll('.collection-group.expanded')).map(g => g.dataset.groupId);

        // Очистка (теперь не трогаем пустой экран, так как он снаружи)
        dom.notesGrid.innerHTML = '<div id="notes-grid-curtain"></div>';
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

        expandedGroups.forEach(id => {
            const group = dom.collectionsList.querySelector(`.collection-group[data-group-id="${id}"]`);
            if (group) group.classList.add('expanded');
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

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
        dom.hamburgerMenu.innerHTML = hamburgerHTML;
        
        applyTranslations(state.settings.language);
        updateCounters(); 
        renderTagsBar(); // <-- ЖЕЛЕЗНЫЙ ВЫЗОВ ПРИ КАЖДОЙ ПЕРЕРИСОВКЕ
        applyFilters(); 
    }
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

    
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

    // --- 👇 НАЧАЛО ВСТАВКИ ---
// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    function closeModalAnimated(modalEl) {
        if (!modalEl.classList.contains('visible') || modalEl.classList.contains('is-closing')) return;
        
        modalEl.classList.add('is-closing');
        
        setTimeout(() => {
            // ПРОВЕРКА: удаляем классы только если окно всё ещё находится в состоянии закрытия.
            // Если пользователь успел снова нажать Ctrl+N, класс is-closing будет снят, и мы ничего не сломаем.
            if (modalEl.classList.contains('is-closing')) {
                modalEl.classList.remove('visible');
                modalEl.classList.remove('is-closing');
            }
        }, 150); 
    }
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---


// --- 👆 КОНЕЦ ВСТАВКИ ---


// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    function showNotification(messageKey) {
    if (messageKey === 'noteDeleted' || messageKey === 'collectionDeleted') {
        SoundManager.play('delete');
    } else {
        SoundManager.play('success');
    }

    const t = translations[state.settings.language];
    const container = dom.notification; // Используем старый элемент как контейнер

    // 1. Создаем новую плашку
    const toast = document.createElement('div');
    toast.className = 'notification-toast';
    toast.textContent = t[messageKey] || messageKey;

    // 2. Добавляем её в конец контейнера (она появится снизу, сдвинув старые вверх)
    container.appendChild(toast);

    // 3. Запускаем индивидуальный таймер на удаление именно ЭТОЙ плашки
    setTimeout(() => {
        toast.classList.add('hiding');
        // Как только анимация исчезновения закончится, удаляем элемент из HTML
        toast.addEventListener('animationend', () => {
            toast.remove();
        }, { once: true });
    }, 2000); // 2 секунды на экране
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
    

// --- 👇 ВСТАВИТЬ ПЕРЕД async function openNoteModal ---
    async function openQuickEditModal(noteId) {
        currentEditingNoteId = noteId;
        const note = state.notes[noteId];
        const t = translations[state.settings.language];
        
        dom.quickEditModal.title.textContent = note.title; // Показываем название для контекста
        dom.quickEditModal.cancelBtn.textContent = t.cancel;
        
        if (state.noteContentsCache[noteId] !== undefined) {
            initialNoteContent = state.noteContentsCache[noteId];
            dom.quickEditModal.contentInput.value = initialNoteContent;
        } else {
            dom.quickEditModal.contentInput.value = 'Loading...';
            const content = await eel.get_note_content(noteId)();
            state.noteContentsCache[noteId] = content;
            initialNoteContent = content;
            dom.quickEditModal.contentInput.value = content;
        }
        
        dom.quickEditModal.el.classList.add('visible');
        dom.quickEditModal.contentInput.focus();
    }

    async function closeQuickEditModal() {
        if (dom.quickEditModal.contentInput.value !== initialNoteContent) {
            const t = translations[state.settings.language];
            if (!await showCustomConfirm('unsavedChangesTitle', t.unsavedChangesMessage, 'discard', 'cancel', true)) {
                return;
            }
        }
        closeModalAnimated(dom.quickEditModal.el);
        currentEditingNoteId = null;
        initialNoteContent = '';
    }

    // Слушатели кнопок для Quick Edit
    dom.quickEditModal.saveBtn.addEventListener('click', async () => {
        const content = dom.quickEditModal.contentInput.value;
        const noteId = currentEditingNoteId;
        const note = state.notes[noteId];
        
        closeModalAnimated(dom.quickEditModal.el);
        
        // Отправляем старые данные для всего, кроме контента
        const result = await eel.update_note(noteId, note.title, content, note.tags, note.description)();
        if (result) {
            state.notes[noteId] = result.data;
            state.noteContentsCache[noteId] = content;
            state.notePreviews[noteId] = content.substring(0, 150).replace(/\n/g, ' ');
            updateNoteInDOM(noteId);
            
            const tile = dom.notesGrid.querySelector(`.note-tile[data-id="${noteId}"]`) || 
                         dom.collectionView.grid.querySelector(`.note-tile[data-id="${noteId}"]`);
            highlightElement(tile);
            showNotification('noteUpdated');
            renderTagsBar(); // <-- ИСПРАВЛЕНИЕ: На всякий случай обновляем, хотя теги тут не меняются
            applyFilters();
        }
        currentEditingNoteId = null;
        initialNoteContent = '';

    });

    dom.quickEditModal.cancelBtn.addEventListener('click', closeQuickEditModal);
// --- 👆 КОНЕЦ ВСТАВКИ ---



// --- 👇 ЗАМЕНИТЕ ОБЕ ФУНКЦИИ НА ЭТИ ВЕРСИИ ---
// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    async function openNoteModal(noteId = null) {
        currentEditingNoteId = noteId;
        const t = translations[state.settings.language];
        
        dom.noteModal.title.textContent = noteId ? t.editNote : t.newNote;
        dom.noteModal.saveBtn.textContent = 'OK'; // Всегда OK
        dom.noteModal.cancelBtn.textContent = t.cancel; // Переводится (Нет / Отмена)
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---


        if (noteId) {
            const note = state.notes[noteId];
            initialNoteTitle = note.title;
            initialNoteDesc = note.description || '';
            dom.noteModal.titleInput.value = note.title;
            dom.noteModal.tagsInput.value = note.tags || '';
            dom.noteModal.descInput.value = note.description || '';
            
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
            dom.noteModal.tagsInput.value = '';
            dom.noteModal.descInput.value = '';
            initialNoteDesc = '';
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
                        delete state.notePreviews[id];
                        Object.keys(state.collectionNotes).forEach(cId => {

                            state.collectionNotes[cId] = state.collectionNotes[cId].filter(nId => nId !== id);
                        });
                        removeNoteFromDOM(id);
                    });
                    updateCounters();
                    showNotification('noteDeleted');
                    applyFilters(); // <--- ДОБАВИТЬ СЮДА
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
                await showCustomAlert('infoTitle', t.noOtherVaults);
                deactivateSelectionMode();
            }
        }

    });
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    let currentSelectedIconKey = 'folder';
    let currentSelectedIconColor = null; // <-- НОВОЕ: Храним выбранный цвет (null = стандартный)
    let currentEditingCollectionId = null; 

    // Инициализация сетки иконок (выполняется 1 раз)

    function renderIconGrid() {
        // Жесткая проверка: если внутри уже есть "опции", значит сетка построена
        if (dom.collectionModal.iconGrid.querySelector('.collection-icon-option')) return;
        
        let gridHtml = '';
        for (const [key, svgCode] of Object.entries(svgs)) {
            gridHtml += `<div class="collection-icon-option" data-icon-key="${key}">${svgCode}</div>`;
        }
        dom.collectionModal.iconGrid.innerHTML = gridHtml;

        // --- Физическая модель короткой инерции (Без CSS-лагов) ---
        let isScrolling = false;
        let velocity = 0;

        dom.collectionModal.iconGrid.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                
                // Мгновенно добавляем скорость. 
                // e.deltaY обычно равно 100 на один "тик" колесика.
                // Множитель 0.5 делает шаг адекватным.
                velocity += e.deltaY * 0.5; 
                
                // Если цикл анимации еще не запущен — стартуем
                if (!isScrolling) {
                    isScrolling = true;
                    requestAnimationFrame(updateScroll);
                }
            }
        });

        function updateScroll() {
            const grid = dom.collectionModal.iconGrid;
            
            // Применяем текущую скорость к позиции прокрутки
            grid.scrollLeft += velocity;
            
            // Сильное трение (0.75). Чем меньше число, тем быстрее останавливается.
            // При 0.75 скорость падает очень быстро (короткая инерция).
            velocity *= 0.75; 

            // Если скорость упала ниже порога восприятия (0.5 пикселя за кадр)
            if (Math.abs(velocity) > 0.5) {
                requestAnimationFrame(updateScroll);
            } else {
                // Полная остановка
                velocity = 0;
                isScrolling = false;
            }
        }
        // ------------------------------------------------

        dom.collectionModal.iconGrid.addEventListener('click', (e) => {

            const option = e.target.closest('.collection-icon-option');
            if (!option) return;
            
            // Снимаем выделение со всех
            dom.collectionModal.iconGrid.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
            
            // Выделяем текущую
            option.classList.add('selected');
            currentSelectedIconKey = option.dataset.iconKey;
            
            // <-- ЗАМЕНА: Вызываем новую общую функцию обновления превью
            updateIconPreview();
            
            // Автоматически прячем сетку после выбора
            dom.collectionModal.iconWrapper.classList.add('hidden-grid');
        });
    }

    dom.collectionModal.iconBtn.addEventListener('click', () => {
        dom.collectionModal.iconWrapper.classList.toggle('hidden-grid');
    });

    // --- НОВАЯ ЛОГИКА ЦВЕТА ---

    dom.collectionModal.colorBtn.addEventListener('click', async () => {
        // Открываем палитру, передавая текущий цвет (или цвет акцента по умолчанию)
        const startColor = currentSelectedIconColor || getComputedStyle(document.body).getPropertyValue('--accent-color').trim();
        const newColor = await AdvancedColorPicker.open(startColor);
        
        if (newColor) {
            currentSelectedIconColor = newColor;
        } else {
            currentSelectedIconColor = null; 
        }
        updateIconPreview();
    });

    function updateIconPreview() {
        let svg = svgs[currentSelectedIconKey];
        if (currentSelectedIconColor) {
            svg = svg.replace('<svg ', `<svg style="color: ${currentSelectedIconColor};" `);
            dom.collectionModal.colorBtn.style.backgroundColor = currentSelectedIconColor;
            dom.collectionModal.colorBtn.style.borderColor = 'transparent';
        } else {
            dom.collectionModal.colorBtn.style.backgroundColor = 'transparent';
            dom.collectionModal.colorBtn.style.borderColor = 'rgba(255,255,255,0.3)';
        }
        dom.collectionModal.iconBtn.innerHTML = svg;
    }
    // --- 👆 КОНЕЦ НОВОЙ ЛОГИКИ ---

    function openCollectionModal(collId = null) {

        renderIconGrid(); // Генерируем сетку, если еще не создана
        currentEditingCollectionId = collId;
        
        const t = translations[state.settings.language];
        dom.collectionModal.title.textContent = collId ? t.edit : t.newCollection;
        dom.collectionModal.saveBtn.textContent = 'OK';
        dom.collectionModal.cancelBtn.textContent = t.cancel;
        
        dom.collectionModal.iconWrapper.classList.add('hidden-grid');

        if (collId) {

            const collection = state.collections[collId];
            dom.collectionModal.nameInput.value = collection.name;
            currentSelectedIconKey = collection.icon && svgs[collection.icon] ? collection.icon : 'folder';
            if (currentSelectedIconKey === 'folder.svg') currentSelectedIconKey = 'folder'; // Совместимость со старой версий
            currentSelectedIconColor = collection.color || null; // <-- ДОБАВЛЕНО
        } else {
            dom.collectionModal.nameInput.value = '';
            currentSelectedIconKey = 'folder';
            currentSelectedIconColor = null; // <-- ДОБАВЛЕНО
        }

        // <-- ЗАМЕНА: Вызов общей функции
        updateIconPreview(); 
        
        dom.collectionModal.iconGrid.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));

        const activeOption = dom.collectionModal.iconGrid.querySelector(`.collection-icon-option[data-icon-key="${currentSelectedIconKey}"]`);
        if (activeOption) activeOption.classList.add('selected');

        dom.collectionModal.el.classList.add('visible');
        dom.collectionModal.nameInput.focus();
    }

    function closeCollectionModal() {
        dom.collectionModal.el.classList.remove('visible');
        currentEditingCollectionId = null;
    }
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---


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

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ (script.js) ---
    function createDragGhost(count, noteId) {
        const ghost = dom.dragGhost;
        ghost.innerHTML = ''; // Очищаем старое

        const note = state.notes[noteId];
        const previewText = state.notePreviews[noteId] || '';

        // Определяем, сколько визуальных "слоев" стопки рисовать (максимум 3)
        const numTiles = Math.min(count, 3); 

        for (let i = 0; i < numTiles; i++) {
            // Создаем мини-копию карточки для каждого слоя
            const miniTile = document.createElement('div');
            // Если это первый (верхний) слой, вешаем базовый класс. Если нижние - добавляем классы для поворота.
            miniTile.className = `ghost-mini-tile ${i === 1 ? 'ghost-layer-2' : ''} ${i === 2 ? 'ghost-layer-3' : ''}`;
            
            // Вставляем реальные данные заметки (только для верхнего слоя, остальные можно оставить пустыми для оптимизации, но так красивее)
            miniTile.innerHTML = `
                <div class="note-title">${note ? note.title : 'Note'}</div>
                <div class="note-text">${previewText.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
            `;
            
            ghost.appendChild(miniTile);
        }

        // Если тянем несколько заметок сразу - вешаем бэйджик с цифрой поверх всех
        if (count > 1) {
            const counter = document.createElement('div');
            counter.className = 'ghost-counter';
            counter.textContent = `+${count - 1}`;
            ghost.appendChild(counter);
        }
    }
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ (script.js) ---


// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    function updateDragGhostPosition(e) {
        // Уменьшили отступы от курсора, чтобы призрак держался ближе.
        // Оставляем 15px вправо и 15px вниз (как раз хватает, чтобы не перекрыть курсором счетчик)
        dom.dragGhost.style.left = `${e.clientX + 15}px`;
        dom.dragGhost.style.top = `${e.clientY + 15}px`;
    }
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---


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
// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    Mousetrap.bind('mod+s', () => {
        if (dom.noteModal.el.classList.contains('visible')) {
            dom.noteModal.saveBtn.click();
        } 
        // ДОБАВИЛИ ЭТУ ПРОВЕРКУ:
        else if (dom.quickEditModal.el.classList.contains('visible')) {
            dom.quickEditModal.saveBtn.click();
        }
        else if (dom.collectionModal.el.classList.contains('visible')) {
            dom.collectionModal.saveBtn.click();
        }
        else if (dom.promptModal.classList.contains('visible')) {
            const okBtn = dom.promptModal.querySelector('.modal-btn.accent');
            if (okBtn) okBtn.click();
        }
        return false;
    });
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

    Mousetrap.bind('mod+f', () => {
        dom.searchInput.focus();
        dom.searchInput.select();
        return false;
    });

    Mousetrap.bind('esc', () => {
        // --- ИСПРАВЛЕНИЕ: ПРОВЕРЯЕМ ПАЛИТРУ ЦВЕТОВ В ПЕРВУЮ ОЧЕРЕДЬ ---
        const colorPicker = document.getElementById('color-picker-modal');
        if (colorPicker && colorPicker.classList.contains('visible')) {
            // Имитируем нажатие "Отмена", чтобы корректно завершить Promise в AdvancedColorPicker
            document.getElementById('cp-cancel').click();
            return false;
        }

        // --- НОВАЯ ЛОГИКА: Сначала проверяем режим выделения ---
        if (isSelectionModeActive) {
            deactivateSelectionMode();
        } 
        // --- КОНЕЦ НОВОЙ ЛОГИКИ ---
        else if (dom.quickEditModal.el.classList.contains('visible')) {
            closeQuickEditModal();
        }
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
        renderTagsBar(); 

        const searchTerm = dom.searchInput.value.toLowerCase().trim();
        const uncollectedOnly = dom.uncollectedFilterToggle.checked;


        // --- УМНАЯ ЛОГИКА ПОИСКА ---

        const isTagSearch = searchTerm.startsWith('#');
        let searchWords = [];
        let searchTags = [];

        if (activeFilterTag) {
            searchTags = [activeFilterTag];
        } else if (isTagSearch) {
            searchTags = searchTerm.substring(1).split(',').map(t => t.trim().toLowerCase()).filter(t => t);
        } else {
            searchWords = searchTerm.split(/\s+/).filter(word => word.length > 0);
        }

        let collectedNotesSet;
        if (uncollectedOnly) {
            collectedNotesSet = new Set(Object.values(state.collectionNotes).flat());
        }

        let visibleCount = 0; // <-- НОВАЯ ПЕРЕМЕННАЯ: Считаем видимые заметки

        document.querySelectorAll('#notes-grid .note-tile').forEach(tile => {
            const noteId = tile.dataset.id;
            const title = tile.querySelector('.note-title').textContent.toLowerCase();
            const note = state.notes[noteId];
            
            let searchMatch = true;

            if (isTagSearch || activeFilterTag) {
                if (!note || !note.tags) {
                    searchMatch = false;
                } else {
                    const noteTags = note.tags.toLowerCase().split(',').map(t => t.trim());
                    searchMatch = searchTags.every(searchTag => noteTags.some(nt => nt.includes(searchTag)));
                }
            } else if (searchWords.length > 0) {
                searchMatch = searchWords.every(word => title.includes(word));
            }

            let uncollectedMatch = true;

            if (uncollectedOnly) {
                uncollectedMatch = !collectedNotesSet.has(noteId);
            }

            if (searchMatch && uncollectedMatch) {
                tile.style.display = 'flex';
                visibleCount++; // <-- Увеличиваем счетчик
            } else {
                tile.style.display = 'none';
            }
        });

        // --- НОВАЯ ЛОГИКА: УПРАВЛЕНИЕ EMPTY STATE ---
        // Если после всех фильтраций на экране 0 заметок - показываем надпись
        if (visibleCount === 0) {
            dom.notesGrid.classList.add('is-empty');
            document.body.classList.add('no-notes-present');
        } else {
            dom.notesGrid.classList.remove('is-empty');
            document.body.classList.remove('no-notes-present');
        }
        // ----------------------------------------------
    }
// --- 👆 КОНЕЦ ЗАМЕНЫ ---



// --- 👇 ВСТАВИТЬ ПЕРЕД dom.newNoteBtn ---
    // SVG Иконки для кнопки (чтобы не создавать внешние файлы)
    const iconGrid = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>';
    const iconList = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>';

    function applyViewMode(mode, targetGrid, targetIcon) {
        if (mode === 'list') {
            targetGrid.classList.add('list-view');
            targetIcon.src = iconGrid; 
        } else {
            targetGrid.classList.remove('list-view');
            targetIcon.src = iconList;
        }
    }

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    // Кнопка главного окна
    dom.viewModeBtn.addEventListener('click', async () => {
        SoundManager.play('click');
        const newMode = dom.notesGrid.classList.contains('list-view') ? 'grid' : 'list';
        
        // Используем FLIP для плавной перестройки всей сетки
        animateGridFLIP(dom.notesGrid, () => {
            applyViewMode(newMode, dom.notesGrid, dom.viewModeIcon);
            return null;
        });
        
        state.settings.view_mode = newMode;
        await eel.save_settings({ view_mode: newMode })();
    });

    // Кнопка панели коллекции
    dom.collViewModeBtn.addEventListener('click', async (e) => {
        e.stopPropagation(); 
        SoundManager.play('click');
        const newMode = dom.collectionView.grid.classList.contains('list-view') ? 'grid' : 'list';
        
        // Используем FLIP для боковой панели
        animateGridFLIP(dom.collectionView.grid, () => {
            applyViewMode(newMode, dom.collectionView.grid, dom.collViewModeIcon);
            return null;
        });
        
        state.settings.collection_view_mode = newMode;
        await eel.save_settings({ collection_view_mode: newMode })();
    });
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---




    dom.newNoteBtn.addEventListener('click', () => { openNoteModal(); });
    dom.addCollectionBtn.addEventListener('click', () => { openCollectionModal(); });


    // --- 👇 НОВЫЙ БЛОК: АВТОДОПОЛНЕНИЕ ТЕГОВ ---
    let currentAutocompleteIndex = -1;

    function getAllExistingTags() {
        const tagSet = new Set();
        Object.values(state.notes).forEach(note => {
            if (note.tags && note.tags.trim() !== '') {
                note.tags.split(',').forEach(t => {
                    const clean = t.trim().toLowerCase();
                    if (clean) tagSet.add(clean);
                });
            }
        });
        return Array.from(tagSet);
    }

    function showAutocompletePanel(matches) {
        const panel = dom.noteModal.tagsPanel;
        if (matches.length === 0) {
            panel.classList.remove('visible');
            return;
        }

        panel.innerHTML = matches.map((tag, index) => 
            `<div class="autocomplete-item" data-index="${index}"><span style="opacity:0.5">#</span> ${tag}</div>`
        ).join('');
        
        currentAutocompleteIndex = -1;
        panel.classList.add('visible');
    }

    // Слушаем ввод текста
    dom.noteModal.tagsInput.addEventListener('input', (e) => {
        const val = e.target.value;
        
        // Находим текущее слово (после последней запятой)
        const words = val.split(',');
        const currentWord = words[words.length - 1].trim().toLowerCase();
        
        // Если ничего не введено или введен только пробел - прячем
        if (!currentWord || currentWord.length === 0) {
            dom.noteModal.tagsPanel.classList.remove('visible');
            return;
        }

        const allTags = getAllExistingTags();
        // Ищем теги, которые начинаются с введенных букв
        const matches = allTags.filter(tag => tag.startsWith(currentWord));
        
        showAutocompletePanel(matches);
    });

    // Управление стрелочками (Вверх/Вниз) и Enter для выбора
    dom.noteModal.tagsInput.addEventListener('keydown', (e) => {
        const panel = dom.noteModal.tagsPanel;
        if (!panel.classList.contains('visible')) return;

        const items = panel.querySelectorAll('.autocomplete-item');
        if (items.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            currentAutocompleteIndex = (currentAutocompleteIndex + 1) % items.length;
            updateAutocompleteSelection(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            currentAutocompleteIndex = (currentAutocompleteIndex - 1 + items.length) % items.length;
            updateAutocompleteSelection(items);
        } else if (e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault();
            if (currentAutocompleteIndex >= 0) {
                // Если выбран элемент списка - кликаем по нему программно
                items[currentAutocompleteIndex].click();
            } else {
                // Если ничего не выбрано, просто берем первый из списка
                items[0].click();
            }
        } else if (e.key === 'Escape') {
            panel.classList.remove('visible');
            e.stopPropagation(); // Не закрываем само модальное окно
        }
    });

    function updateAutocompleteSelection(items) {
        items.forEach(item => item.classList.remove('selected'));
        if (currentAutocompleteIndex >= 0) {
            const selectedItem = items[currentAutocompleteIndex];
            selectedItem.classList.add('selected');
            selectedItem.scrollIntoView({ block: 'nearest' });
        }
    }

    // Клик по элементу списка мышкой
    dom.noteModal.tagsPanel.addEventListener('click', (e) => {
        const item = e.target.closest('.autocomplete-item');
        if (!item) return;

        const selectedTag = item.textContent.replace('#', '').trim();
        const currentInputVal = dom.noteModal.tagsInput.value;
        
        // Отрезаем последнее незавершенное слово и приклеиваем выбранный тег
        const words = currentInputVal.split(',');
        words.pop(); // Удаляем то, что мы начали писать
        
        // Формируем новую строку тегов
        let newValue = words.join(', ').trim();
        if (newValue.length > 0) newValue += ', ';
        newValue += selectedTag + ', '; // Автоматически добавляем запятую и пробел для следующего тега
        
        dom.noteModal.tagsInput.value = newValue;
        dom.noteModal.tagsPanel.classList.remove('visible');
        dom.noteModal.tagsInput.focus();
    });

    // Прячем панель при клике вне её
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#tags-autocomplete-panel') && e.target !== dom.noteModal.tagsInput) {
            if (dom.noteModal.tagsPanel) {
                dom.noteModal.tagsPanel.classList.remove('visible');
            }
        }
    });
    // --- 👆 КОНЕЦ НОВОГО БЛОКА ---


// --- 👇 ЗАМЕНИТЕ ВЕСЬ ЭТОТ ОБРАБОТЧИК НА ЭТОТ БЛОК ---
    dom.noteModal.saveBtn.addEventListener('click', async () => {

        const title = dom.noteModal.titleInput.value.trim();
        const content = dom.noteModal.contentInput.value;
        const tags = dom.noteModal.tagsInput.value.trim();
        // Убираем решетки (если пользователь их случайно написал) и лишние пробелы, сохраняем как чистую строку (например "tag1, tag2")
        const cleanTags = tags.replace(/#/g, '').split(',').map(t => t.trim()).filter(t => t).join(', ');
        const desc = dom.noteModal.descInput.value.trim();
        if (!title) { return await showCustomAlert('inputError', 'titleRequired'); }


        dom.noteModal.el.classList.remove('visible');

        if (currentEditingNoteId) {
            const result = await eel.update_note(currentEditingNoteId, title, content, cleanTags, desc)();
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
                renderTagsBar(); // <-- ИСПРАВЛЕНИЕ: Обновляем теги
                applyFilters();
            }
        } else {
            // Логика создания новой заметки (остается без изменений)
            const wasEmpty = Object.keys(state.notes).length === 0;
            const result = await eel.create_note(title, content, cleanTags, desc)();
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
                renderTagsBar(); // <-- ИСПРАВЛЕНИЕ: Обновляем теги
                applyFilters();              
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
        const currentDesc = dom.noteModal.descInput.value;

        if (currentTitle !== initialNoteTitle || currentContent !== initialNoteContent || currentDesc !== initialNoteDesc) {

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
        
        if (currentEditingCollectionId) {
            // Режим РЕДАКТИРОВАНИЯ (Передаем 4 аргумента: ID, Имя, Иконка, Цвет)
            const result = await eel.update_collection(currentEditingCollectionId, name, currentSelectedIconKey, currentSelectedIconColor)();
            if (result) {
                // ОБНОВЛЯЕМ STATE ВСЕМИ НОВЫМИ ДАННЫМИ (ВКЛЮЧАЯ ЦВЕТ)
                state.collections[currentEditingCollectionId] = result.data;
                
                const oldGroup = dom.collectionsList.querySelector(`.collection-group[data-group-id="${currentEditingCollectionId}"]`);
                if (oldGroup) {
                    const isExpanded = oldGroup.classList.contains('expanded');
                    const hasChildren = oldGroup.classList.contains('has-children');
                    
                    // ПЕРЕРИСОВЫВАЕМ (функция возьмет цвет из обновленного state)
                    const newGroup = createCollectionGroupElement(currentEditingCollectionId);
                    if (isExpanded) newGroup.classList.add('expanded');
                    if (hasChildren) {
                        newGroup.classList.add('has-children');
                        const oldSubs = oldGroup.querySelector('.subcollections-list');
                        const newSubs = newGroup.querySelector('.subcollections-list');
                        if (oldSubs && newSubs) {
                            while (oldSubs.firstChild) newSubs.appendChild(oldSubs.firstChild);
                        }
                    }
                    oldGroup.parentNode.replaceChild(newGroup, oldGroup);
                }
                
                if (currentOpenCollectionId === currentEditingCollectionId) {
                    dom.collectionView.title.textContent = name;
                }

                // --- НОВАЯ ЛОГИКА: МГНОВЕННОЕ ОБНОВЛЕНИЕ ЦВЕТОВ ЗАМЕТОК ---
                // Если у этой коллекции есть заметки, мы должны перерисовать их линии
                const notesInThisCollection = state.collectionNotes[currentEditingCollectionId] || [];
                notesInThisCollection.forEach(noteId => {
                    updateNoteInDOM(noteId); // Эта функция сама пересчитает и обновит цвет линии
                });
                // -----------------------------------------------------------

                showNotification('collectionUpdated'); // <-- ИСПРАВЛЕНИЕ: Правильное уведомление
            }
        } else {
            // Режим СОЗДАНИЯ


            const result = await eel.create_collection(name, currentSelectedIconKey, parentIdForNewSubcollection)();
            
            if (result) {
                state.collections[result.id] = result.data;
                state.collectionNotes[result.id] = [];
                
                if (parentIdForNewSubcollection) {
                    const parentGroup = dom.collectionsList.querySelector(`.collection-group[data-group-id="${parentIdForNewSubcollection}"]`);
                    if (parentGroup && !parentGroup.classList.contains('has-children')) {
                        parentGroup.classList.add('has-children');
                    }
                }
                
                addCollectionToDOM(result.id, true);
                showNotification('collectionCreated');
            }
        }
        
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
// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    async function handleNoteClick(event) {
        const tile = event.target.closest('.note-tile');
        if (!tile) return;
        const noteId = tile.dataset.id;

        // --- ЛОГИКА QUICK ACTIONS ---
        const qaBtn = event.target.closest('.qa-btn');
        if (qaBtn) {
            event.stopPropagation(); // Не копируем текст!
            const action = qaBtn.dataset.qaAction;
            
            if (action === 'edit') {
                await openNoteModal(noteId);
            } 
            else if (action === 'delete') {
                const t = translations[state.settings.language];
                if (await showCustomConfirm('deleteNoteTitle', t.deleteNoteMessage, 'deleteAction', 'cancel', true)) {
                    const result = await eel.delete_note(noteId)();
                    if (result.success) {
                        delete state.notes[result.deleted_id];
                        delete state.noteContentsCache[result.deleted_id];
                        delete state.notePreviews[result.deleted_id];
                        Object.keys(state.collectionNotes).forEach(cId => {
                            state.collectionNotes[cId] = state.collectionNotes[cId].filter(nId => nId !== result.deleted_id);
                        });
                        
                        renderFullUI();
                        updateCounters();
                        if (currentOpenCollectionId) {
                            renderCollectionView(currentOpenCollectionId);
                        }
                        showNotification('noteDeleted');
                        applyFilters();
                    }
                }
            }
            return; // Выходим из функции, чтобы не сработало выделение или копирование
        }
        // --- КОНЕЦ QUICK ACTIONS ---

        if (isSelectionModeActive) {
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

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
    
    async function updateTooltipContent(e, tile, isHoveringTitle) {
        const tooltip = dom.noteTooltip;
        
        if (isHoveringTitle) {
            const titleText = isHoveringTitle.dataset.name;
            if (!titleText) return;
            tooltip.textContent = titleText;
            tooltip.classList.add('metadata-tooltip');
        } else {
            const noteId = tile.dataset.id;
            const note = state.notes[noteId];
            
            const rect = tile.getBoundingClientRect();
            const isLeftHalf = (e.clientX - rect.left) < (rect.width / 2);

            // Запоминаем текущую половину
            const currentHalf = isLeftHalf ? 'left' : 'right';
            tooltip.dataset.currentHalf = currentHalf;

            if (isLeftHalf && note && note.description && note.description.trim() !== '') {
                tooltip.textContent = note.description.substring(0, 500);
                tooltip.classList.remove('metadata-tooltip');
            } else {
                let content = state.noteContentsCache[noteId];
                if (content === undefined) {
                    content = await eel.get_note_content(noteId)();
                    state.noteContentsCache[noteId] = content;
                }
                if (!content) return;
                
                tooltip.textContent = content.substring(0, 750);
                tooltip.classList.remove('metadata-tooltip');
            }
        }

        tooltip.classList.add('visible');

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
    }
    
// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    const handleNoteMouseOver = (e) => {

        const tile = e.target.closest('.note-tile');
        if (!tile) return;
        
        // --- 👇 ЗАЩИТА ОТ ТУЛТИПОВ ---
        // Не показываем, если открыто меню ИЛИ если активен Drag & Drop
        if (dom.contextMenu.classList.contains('visible') || draggedElement.id) {
            return; 
        }
        // --- 👆 КОНЕЦ ЗАЩИТЫ ---
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

        
        // Определяем, на что именно навели: на заголовок или на остальную часть карточки
        const isHoveringTitle = e.target.closest('.note-title');
        
        tooltipTimer = setTimeout(() => {
            updateTooltipContent(e, tile, isHoveringTitle);
        }, 500);
    };

// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

    const handleNoteMouseOut = (e) => {
        clearTimeout(tooltipTimer);
        dom.noteTooltip.classList.remove('visible');
    };

// --- 👇 ВСТАВЬТЕ ЭТОТ НОВЫЙ БЛОК ---
    const handleNoteMouseMove = (e) => {
        const tooltip = dom.noteTooltip;
        // Работаем только если тултип УЖЕ виден (таймер уже отработал)
        if (!tooltip.classList.contains('visible')) return;

        const tile = e.target.closest('.note-tile');
        if (!tile || dom.contextMenu.classList.contains('visible')) return;

        // Если мы на заголовке, деление на половины не работает
        const isHoveringTitle = e.target.closest('.note-title');
        if (isHoveringTitle) return;

        // Определяем, на какой половине мы СЕЙЧАС
        const rect = tile.getBoundingClientRect();
        const isLeftHalf = (e.clientX - rect.left) < (rect.width / 2);
        const newHalf = isLeftHalf ? 'left' : 'right';

        // Если мы перешли границу (лево -> право или право -> лево)
        if (tooltip.dataset.currentHalf !== newHalf) {
            // МГНОВЕННО обновляем содержимое, без таймера!
            updateTooltipContent(e, tile, false);
        }
    };
// --- 👆 КОНЕЦ ВСТАВКИ ---

    
    const handleGridScroll = () => {
        clearTimeout(tooltipTimer);
        dom.noteTooltip.classList.remove('visible');
    };

    dom.notesGrid.addEventListener('mouseover', handleNoteMouseOver);
    dom.notesGrid.addEventListener('mouseout', handleNoteMouseOut);
    dom.notesGrid.addEventListener('mousemove', handleNoteMouseMove); // <-- ДОБАВЛЕНО
    dom.notesGrid.addEventListener('scroll', handleGridScroll);
    
    dom.collectionView.grid.addEventListener('mouseover', handleNoteMouseOver);
    dom.collectionView.grid.addEventListener('mouseout', handleNoteMouseOut);
    dom.collectionView.grid.addEventListener('mousemove', handleNoteMouseMove); // <-- ДОБАВЛЕНО
    dom.collectionView.grid.addEventListener('scroll', handleGridScroll);

    
// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    // --- Кастомный тултип для коллекций ---
    let collectionTooltipTimer = null;

    dom.collectionsList.addEventListener('mouseover', (e) => {
        const item = e.target.closest('.collection-item');
        if (!item || item.id === 'add-collection-btn') return;
        
        // ЗАЩИТА: Если открыто ПКМ-меню ИЛИ мы прямо сейчас что-то перетаскиваем - тултип не показываем!
        if (dom.contextMenu.classList.contains('visible') || draggedElement.id) {
            return; 
        }
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---


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

    // --- 👇 НОВЫЙ БЛОК: Кастомный тултип для цветов ---
    let dotTooltipTimer = null;

    // Слушаем весь документ, чтобы ловить тултипы и из меню, и из модального окна
    document.addEventListener('mouseover', (e) => {
        // Ищем элементы, у которых есть наш кастомный атрибут (цвета или кнопки)
        const dot = e.target.closest('.theme-dot, .cp-grid-dot, [data-tooltip-text]');
        
        // Не показываем тултип, если открыто меню ПКМ (чтобы не мешал)
        if (!dot || dom.contextMenu.classList.contains('visible') || activeDotContext) return;

        const text = dot.dataset.tooltipText;

        if (!text) return;

        dotTooltipTimer = setTimeout(() => {
            const tooltip = dom.noteTooltip;
            tooltip.textContent = text;
            tooltip.classList.add('metadata-tooltip'); // Делаем тултип компактным
            
            // Показываем перед вычислением координат
            tooltip.classList.add('visible');

            const rect = dot.getBoundingClientRect();
            // Выравниваем по центру по горизонтали
            tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
            
            // Если элемент прижат к верхнему краю окна (Top Bar) ИЛИ это цвет текста - показываем СНИЗУ
            if (rect.top < 60 || dot.hasAttribute('data-theme-text')) {
                tooltip.style.top = `${rect.bottom + 8}px`;
                tooltip.style.zIndex = '3000'; // Поднимаем над шторками и меню
            } 
            // Если это точка из сетки (colorpicker) - показываем строго СВЕРХУ, чтобы не закрывать другие кружки
            else if (dot.classList.contains('cp-grid-dot')) {
                tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
                tooltip.style.zIndex = '3000';
            } 
            // Обычные точки акцента (и всё остальное) - показываем СВЕРХУ
            else {
                tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
            }

        }, 300); // Показываем с небольшой задержкой

    });


    document.addEventListener('mouseout', (e) => {
        const dot = e.target.closest('.theme-dot, .cp-grid-dot, [data-tooltip-text]');
        if (dot) {
            clearTimeout(dotTooltipTimer);
            dom.noteTooltip.classList.remove('visible');
            dom.noteTooltip.classList.remove('metadata-tooltip');
            dom.noteTooltip.style.zIndex = ''; // Сбрасываем z-index
        }
    });

    // --- 👆 КОНЕЦ НОВОГО БЛОКА ---


    
// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    dom.collectionView.grid.addEventListener('dragover', (e) => {
        if (draggedElement.type === 'note') {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            handleAutoScroll(e, dom.collectionView.grid);

            if (draggedElement.source === 'collection-notes-grid') {
                // НОВАЯ ЛОГИКА: Live Reordering (Сортировка в реальном времени)
                const targetTile = e.target.closest('.note-tile:not(.dragging)'); // Ищем плитку, над которой мы находимся (не ту, что тащим)
                
                if (targetTile && targetTile.dataset.id !== draggedElement.id) {
                    const draggedTile = dom.collectionView.grid.querySelector(`.note-tile[data-id="${draggedElement.id}"]`);
                    
                    if (draggedTile) {
                        // Определяем, куда вставить: До или После
                        // Если курсор ниже центра целевой плитки - вставляем после неё, если выше - до.
                        const bounding = targetTile.getBoundingClientRect();
                        const offset = bounding.y + (bounding.height / 2);
                        
                        // Используем FLIP для плавной перестановки остальных плиток
                        animateGridFLIP(dom.collectionView.grid, () => {
                            if (e.clientY - offset > 0) {
                                targetTile.after(draggedTile);
                            } else {
                                targetTile.before(draggedTile);
                            }
                            return null;
                        });
                    }
                }
            } else if (draggedElement.source === 'notes-grid') {
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

                // НОВАЯ ЛОГИКА: если тащим С ГЛАВНОГО ОКНА - подсвечиваем всю панель
                dom.collectionView.panel.classList.add('drag-over-panel');
            }
        }
    });

    // Убираем подсветку, если увели курсор с панели
    dom.collectionView.grid.addEventListener('dragleave', (e) => {
        if (!dom.collectionView.grid.contains(e.relatedTarget)) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
            if (draggedElement.source === 'notes-grid') {
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
                    applyFilters();
                }
            }
            deactivateSelectionMode();
            return;
        }

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
        // 2. ЛОГИКА СОРТИРОВКИ (СОХРАНЕНИЕ LIVE-РЕЗУЛЬТАТА)
        if (draggedElement.source === 'collection-notes-grid') {
            // Поскольку элементы уже физически переставлены местами в DOM во время dragover,
            // нам нужно просто считать их новый порядок сверху вниз.
            const newOrderIds = Array.from(dom.collectionView.grid.querySelectorAll('.note-tile'))
                                     .map(tile => tile.dataset.id);
            
            // Если порядок изменился (сравниваем длины на всякий случай)
            if (newOrderIds.length === state.collectionNotes[currentOpenCollectionId].length) {
                const result = await eel.save_note_order_in_collection(currentOpenCollectionId, newOrderIds)();
                if (result.success) {
                    state.collectionNotes[currentOpenCollectionId] = newOrderIds;
                    // Мы НЕ вызываем renderCollectionView(), чтобы не было лишних морганий, всё и так красиво стоит на местах
                }
            }
        }
    });
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    
// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    dom.collectionsList.addEventListener('contextmenu', (e) => {
        hideTooltip();
        if (dom.contextMenu.classList.contains('visible')) {
            dom.contextMenu.classList.remove('visible');
            dom.contextMenu.classList.remove('is-closing');
        }

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

        // Заменили rename на edit
        menuItems.push({ label: t.edit, action: 'edit-collection' });
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
        activeDotContext = null; // Сбрасываем блокировку

        const menu = dom.contextMenu;
        if (!menu.classList.contains('visible') || menu.classList.contains('is-closing')) {
            return; // Прерываем, если меню и так закрыто
        }

        // Таймер запускается ТОЛЬКО если контекстное меню реально закрывается прямо сейчас
        setTimeout(() => {
            // Добавлена защита: если мышь на кнопке опций - не закрывать
            if (!dom.optionsMenu.matches(':hover') && !dom.contextMenu.matches(':hover') && !dom.optionsBtn.matches(':hover')) {
                hideOptionsMenuAnimated();
            }
        }, 50);

        menu.classList.add('is-closing');

        // УМНАЯ ПРОВЕРКА: Слушатель сработает, только если меню все еще закрывается
        menu.addEventListener('animationend', () => {
            if (menu.classList.contains('is-closing')) {
                menu.classList.remove('visible');
                menu.classList.remove('is-closing');
                activeDotContext = null; // <-- Сбрасываем активную точку
            }
        }, { once: true });

    }
// --- 👆 КОНЕЦ НОВОГО БЛОКА ---
    
    dom.optionsMenu.addEventListener('contextmenu', (e) => {
        const dot = e.target.closest('.theme-dot');
        // Кастомную точку (радужную) изменять через ПКМ не будем, она меняется ЛКМ
        if (!dot || dot.dataset.isCustom === "true") return;

        activeDotContext = dot;
        const t = translations[state.settings.language];
        
        const menuItems = [
            { label: t.changeColor, action: 'change-dot-color' },
            { type: 'divider' },
            { label: t.resetColor, action: 'reset-dot-color' }
        ];

        // 4-й аргумент true = не закрывать основное меню опций!
        showContextMenu(e, menuItems, false, true); 
    });

    // --- 👇 НОВЫЙ БЛОК: УМНОЕ АВТОЗАКРЫТИЕ ---
    dom.optionsMenu.addEventListener('mouseover', (e) => {
        if (!activeDotContext) return; 

        const dot = e.target.closest('.theme-dot');
        const isHoveringCurrentDot = (dot === activeDotContext);
        
        // Если курсор на контекстном меню (кнопки "Изменить" / "Сбросить") - НИЧЕГО НЕ ДЕЛАЕМ
        if (e.target.closest('#context-menu')) return; 

        if (!isHoveringCurrentDot) {
            hideContextMenuAnimated();
        }
    });

    // Дополнительная защита: предотвращаем закрытие, если мышь вернулась на само контекстное меню
    dom.contextMenu.addEventListener('mouseover', () => {
        clearTimeout(menuHideTimer);
    });
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
    
    dom.optionsMenu.addEventListener('mouseleave', () => { 
        // Если открыто меню изменения цвета, то при уходе мыши таймер начинает закрывать ЕГО
        if (activeDotContext) {
            menuHideTimer = setTimeout(hideContextMenuAnimated, 300);
            return;
        }
        menuHideTimer = setTimeout(hideOptionsMenuAnimated, 300); 
    });

    dom.optionsMenu.addEventListener('mouseenter', () => { clearTimeout(menuHideTimer); });
    
    // ЕДИНСТВЕННЫЙ обработчик для контекстного меню
    dom.contextMenu.addEventListener('mouseleave', () => { 
        menuHideTimer = setTimeout(hideContextMenuAnimated, 300); 
    });
    dom.contextMenu.addEventListener('mouseenter', () => { 
        clearTimeout(menuHideTimer); 
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
        if (activeDotContext) return; // <-- ЗАЩИТА ОКНА ТЕМ
        
        const submenuContainer = e.target.closest('.dropdown-submenu-container');
        if (!submenuContainer) return;

        const submenu = submenuContainer.querySelector('.submenu');

        if (submenu) {
            // Когда курсор ПОКИНУЛ контейнер, запускаем таймер на его закрытие
            submenu.hideTimer = setTimeout(() => {
                hideSubmenu(submenu);
            }, 500);
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
        if (activeDotContext) return; // <-- ЗАЩИТА ОКНА ТЕМ
        
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
            }, 500); // <-- Увеличили до 500мс
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
                            await showCustomAlert('errorTitle', getErrorMessage(result));
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
                    if (checkResult.errorCode !== 'err_import_cancelled') {
                        await showCustomAlert('errorTitle', t.importCheckFailed + getErrorMessage(checkResult));
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
                    await showCustomAlert('errorTitle', t.importFailed + getErrorMessage(importResult));
                }
                break;
            }

            case 'backup-vault-btn': {
                showLoader();
                const result = await eel.backup_current_vault()();
                hideLoader();
                if (result.success) {
                    showNotification('vaultExported');
                } else if (result.errorCode !== 'err_export_cancelled') {
                    await showCustomAlert('errorTitle', t.exportFailed + getErrorMessage(result));
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

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ (script.js) ---
            if (isSelectionModeActive && selectedNoteIds.has(noteId)) {
                isBatchDrag = true;
                idsToDrag = Array.from(selectedNoteIds);
            } else {
                isBatchDrag = false;
                idsToDrag = [noteId];
            }
            
            // Передаем и количество, и ID карточки, которую тащим
            createDragGhost(idsToDrag.length, noteId);
            setTimeout(() => dom.dragGhost.classList.add('visible'), 0);
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ (script.js) ---


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
    let autoScrollInterval = null;
    let autoScrollSpeed = 0;

    // --- 👇 ВСТАВИТЬ СЮДА ---
    // Умная функция авто-прокрутки для любого скроллящегося контейнера
    function handleAutoScroll(e, container) {
        if (!draggedElement.id) return;

        const rect = container.getBoundingClientRect();
        // Задаем "горячие зоны" сверху и снизу (40 пикселей от края)
        const hotZone = 40; 
        
        // Вычисляем, насколько курсор зашел в верхнюю или нижнюю горячую зону
        if (e.clientY < rect.top + hotZone) {
            // Курсор вверху -> крутим вверх
            autoScrollSpeed = -15; // Скорость (отрицательная)
        } else if (e.clientY > rect.bottom - hotZone) {
            // Курсор внизу -> крутим вниз
            autoScrollSpeed = 15;
        } else {
            // Курсор в центре -> останавливаем скролл
            autoScrollSpeed = 0;
        }

        // Если мы в горячей зоне и интервал еще не запущен
        if (autoScrollSpeed !== 0 && !autoScrollInterval) {
            autoScrollInterval = setInterval(() => {
                container.scrollTop += autoScrollSpeed;
            }, 20); // Плавный шаг каждые 20 мс (50 FPS)
        } 
        // Если вышли из горячей зоны
        else if (autoScrollSpeed === 0 && autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
    }
// --- 👆 КОНЕЦ ВСТАВКИ ---


// --- 👇 НАЧАЛО НОВОГО БЛОКА: ПРОКРУТКА КОЛЕСИКОМ ПРИ D&D ---
    // Слушаем прокрутку колесиком в любой точке приложения
    document.addEventListener('wheel', (e) => {
        // Работает ТОЛЬКО если мы сейчас что-то перетаскиваем
        if (draggedElement.id) {
            
            // Если курсор находится над списком коллекций (левая панель)
            const isOverCollections = e.target.closest('#collections-list');
            if (isOverCollections) {
                // Принудительно крутим список вверх/вниз
                dom.collectionsList.scrollTop += e.deltaY;
            }
            
            // Если курсор находится над открытой панелью коллекции (правая шторка)
            const isOverCollectionGrid = e.target.closest('#collection-notes-grid');
            if (isOverCollectionGrid) {
                dom.collectionView.grid.scrollTop += e.deltaY;
            }
            
            // Если курсор находится над главной сеткой
            const isOverNotesGrid = e.target.closest('#notes-grid');
            if (isOverNotesGrid) {
                dom.notesGrid.scrollTop += e.deltaY;
            }
        }
    }, { passive: true }); // passive: true делает скролл плавным, не блокируя браузер
// --- 👆 КОНЕЦ НОВОГО БЛОКА ---



    // МЫ ПОЛНОСТЬЮ УДАЛИЛИ ГЛЮЧНЫЙ dragenter. 
    // Всё работает через dragover (срабатывает постоянно при движении)
    dom.collectionsList.addEventListener('dragover', (e) => { 
        e.preventDefault(); 
        e.dataTransfer.dropEffect = 'move'; 
        handleAutoScroll(e, dom.collectionsList);
        
// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ В DRAGOVER ---
        if (draggedElement.type === 'collection') {
            document.querySelectorAll('.collection-item').forEach(el => {
                el.classList.remove('drag-over-indicator', 'drag-over-nest');
            });

            const target = e.target.closest('.collection-item:not(#add-collection-btn)');
            
            if (target && draggedElement.id !== target.dataset.id && target.dataset.id !== 'coll_favorites') {
                const targetId = target.dataset.id;
                const draggedId = draggedElement.id;
                
                const rect = target.getBoundingClientRect();
                const y = e.clientY - rect.top;
                
                // Проверки: перетаскиваемая не имеет детей, целевая не имеет заметок, целевая - главная папка
                const draggedHasChildren = Object.values(state.collections).some(c => c.parentId === draggedId);
                const targetHasNotes = state.collectionNotes[targetId] && state.collectionNotes[targetId].length > 0;
                const isTargetSub = !!state.collections[targetId].parentId;

                // Если курсор в центре (от 25% до 75% высоты) и вложение допустимо
                if (y > rect.height * 0.25 && y < rect.height * 0.75 && !draggedHasChildren && !targetHasNotes && !isTargetSub) {
                    target.classList.add('drag-over-nest');
                    draggedElement.dropAction = 'nest';
                } else {
                    // Иначе обычная линия сортировки
                    target.classList.add('drag-over-indicator');
                    draggedElement.dropAction = 'sort';
                }
            }
            return;
        }
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ В DRAGOVER ---

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
        // Останавливаем автоскролл при выходе мыши
        if (!dom.collectionsList.contains(e.relatedTarget)) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
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
                    // <-- ОБНОВЛЕНИЕ ЛИНИИ: Сразу перекрашиваем плитку на экране после добавления
                    updateNoteInDOM(id);
                });
                updateCounters();
                if (result.added_count > 0) {
                    showNotification(t.notesAddedToCollection(result.added_count, state.collections[collectionId].name));
                }

                // Перерисовываем, если бросили в открытую сейчас коллекцию
                if (currentOpenCollectionId === collectionId) {
                    renderCollectionView(collectionId);
                }
                applyFilters();
            }
            deactivateSelectionMode();
        } 


        
        // --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
        // --- Логика сортировки коллекций ---
        // --- Логика сортировки коллекций ---
        else if (draggedElement.type === 'collection' && draggedElement.id !== dropTarget.dataset.id) {
            const draggedId = draggedElement.id;
            const targetId = dropTarget.dataset.id;
            const action = draggedElement.dropAction || 'sort';

            const draggedGroup = dom.collectionsList.querySelector(`.collection-group[data-group-id="${draggedId}"]`);
            const targetGroup = dom.collectionsList.querySelector(`.collection-group[data-group-id="${targetId}"]`);
            
            if (!draggedGroup || !targetGroup) {
                dropTarget.classList.remove('drag-over-indicator', 'drag-over-nest');
                return;
            }

            const draggedHasChildren = Object.values(state.collections).some(c => c.parentId === draggedId);
            let newParentId;

            // 1. ЕСЛИ БРОСИЛИ В ЦЕНТР ПАПКИ (ВЛОЖЕНИЕ)
            if (action === 'nest') {
                newParentId = targetId;
                const subsList = targetGroup.querySelector('.subcollections-list');
                if (subsList) subsList.appendChild(draggedGroup);
                // Автоматически раскрываем папку, в которую только что вложили другую
                targetGroup.classList.add('expanded', 'has-children');
                // Автоматически раскрываем папку, в которую только что вложили другую
                targetGroup.classList.add('expanded', 'has-children');
            } 
            // 2. ЕСЛИ БРОСИЛИ НА КРАЙ (СОРТИРОВКА)
            else {
                newParentId = state.collections[targetId].parentId || null;
                
                // Защита: папку с детьми нельзя сделать подколлекцией
                if (newParentId !== null && draggedHasChildren) {
                    dropTarget.classList.remove('drag-over-indicator', 'drag-over-nest');
                    return; 
                }

                if (draggedGroup.parentNode === targetGroup.parentNode) {
                    const container = draggedGroup.parentNode;
                    const groups = Array.from(container.children);
                    if (groups.indexOf(draggedGroup) < groups.indexOf(targetGroup)) {
                        targetGroup.after(draggedGroup);
                    } else {
                        targetGroup.before(draggedGroup);
                    }
                } else {
                    targetGroup.before(draggedGroup);
                }
            }

            dropTarget.classList.remove('drag-over-indicator', 'drag-over-nest');

            const oldParentId = state.collections[draggedId].parentId || null;

            // 3. ОБНОВЛЕНИЕ БАЗЫ ДАННЫХ И СОХРАНЕНИЕ
            if (newParentId !== oldParentId) {
                state.collections[draggedId].parentId = newParentId;
                await eel.update_collection_parent(draggedId, newParentId)();
            }

            const newOrderIds = [];
            dom.collectionsList.querySelectorAll(':scope > .collection-group').forEach(group => {
                if (group.dataset.groupId) newOrderIds.push(group.dataset.groupId);
                group.querySelectorAll('.subcollections-list > .collection-group').forEach(subGroup => {
                    if (subGroup.dataset.groupId) newOrderIds.push(subGroup.dataset.groupId);
                });
            });

            const result = await eel.save_collections_order(newOrderIds)();
            if (result.success) {
                const newCollections = {};
                newOrderIds.forEach(id => { if (state.collections[id]) newCollections[id] = state.collections[id]; });
                state.collections = newCollections;
                
                if (newParentId !== oldParentId) renderFullUI();
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

    dom.notesGrid.addEventListener('dragover', (e) => { if (draggedElement.type === 'note' && currentOpenCollectionId && draggedElement.source === 'collection-notes-grid') { e.preventDefault(); e.dataTransfer.dropEffect = 'move';             handleAutoScroll(e, dom.notesGrid);
 } });

    dom.notesGrid.addEventListener('dragleave', (e) => {
        if (!dom.notesGrid.contains(e.relatedTarget)) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
    });

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
            applyFilters(); // <--- ДОБАВИТЬ СЮД
            // --- КОНЕЦ НОВОЙ ЛОГИКИ ---
        }
    });
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    dom.appContainer.addEventListener('dragend', () => {

        clearInterval(autoScrollInterval);
        autoScrollInterval = null;

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
            item.classList.remove('drag-over', 'drag-over-indicator', 'drag-hovered', 'drag-over-nest'); // <-- добавили drag-over-nest
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

        // --- НОВАЯ ЛОГИКА: Сброс тега при клике в пустоту ---
        // Если выбран тег, и мы кликнули не по поиску и не по панели тегов - сбрасываем фильтр
        if (activeFilterTag && !e.target.closest('.search-container') && !e.target.closest('#tags-bar')) {
            activeFilterTag = null;
            dom.searchInput.value = '';
            renderTagsBar();
            applyFilters();
        }
        // --- КОНЕЦ НОВОЙ ЛОГИКИ ---
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
                    delete state.notePreviews[id];
                    Object.keys(state.collectionNotes).forEach(cId => {

                        state.collectionNotes[cId] = state.collectionNotes[cId].filter(nId => nId !== id);
                    });
                    removeNoteFromDOM(id);
                });
                updateCounters();
                showNotification('noteDeleted');
                applyFilters(); // <--- ДОБАВИТЬ СЮДА
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
            
            if (newAccent === 'custom') {
                hideAllAnimatedMenus(); // Прячем меню перед открытием окна
                
                const newColor = await AdvancedColorPicker.open(state.settings.custom_accent);
                
                    if (newColor) {
                        state.settings.custom_accent = newColor;
                        target.style.background = `linear-gradient(135deg, ${newColor}, #ffffff)`;
                        target.dataset.tooltipText = ColorNamer.getName(newColor, state.settings.language);
                        
                        applyTheme(state.settings.theme_base, 'custom');

                    await eel.save_settings({ theme_accent: 'custom', custom_accent: newColor })();
                    showNotification('themeUpdated');
                }
            } else if (newAccent !== state.settings.theme_accent) {
                applyTheme(state.settings.theme_base, newAccent);
                await eel.save_settings({ theme_accent: newAccent })();
                showNotification('themeUpdated');
            }
            return; 
        }

        if (target.matches('[data-theme-text]')) {
            const newTextTheme = target.dataset.themeText;
            
            if (newTextTheme === 'custom') {
                hideAllAnimatedMenus(); // Прячем меню перед открытием окна
                
                const newColor = await AdvancedColorPicker.open(state.settings.custom_text);
                
                    if (newColor) {
                        state.settings.custom_text = newColor;
                        target.style.background = `linear-gradient(135deg, ${newColor}, #ffffff)`;
                        target.dataset.tooltipText = ColorNamer.getName(newColor, state.settings.language);
                        
                        applyTextTheme('custom');

                    target.style.background = `linear-gradient(135deg, ${newColor}, #ffffff)`;
                    
                    applyTextTheme('custom');
                    await eel.save_settings({ theme_text: 'custom', custom_text: newColor })();
                    showNotification('themeUpdated');
                }
            } else if (newTextTheme !== state.settings.theme_text) {
                applyTextTheme(newTextTheme);
                await eel.save_settings({ theme_text: newTextTheme })();
                showNotification('themeUpdated');
            }
            return;
        }


        if (target.matches('[data-theme-text]')) {
            const newTextTheme = target.dataset.themeText;
            
            if (newTextTheme === 'custom') {
                // Если кликнули на Custom текст - открываем палитру
                const picker = document.getElementById('custom-text-picker');
                picker.value = state.settings.custom_text;
                
                picker.onchange = async (ev) => {
                    const newColor = ev.target.value;
                    state.settings.custom_text = newColor;
                    target.style.background = `linear-gradient(135deg, ${newColor}, #ffffff)`;
                    
                    applyTextTheme('custom');
                    await eel.save_settings({ theme_text: 'custom', custom_text: newColor })();
                    showNotification('themeUpdated');
                };
                picker.click();
            } else if (newTextTheme !== state.settings.theme_text) {
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

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
        if (target.matches('[data-action="about-app"]')) {
            hideAllAnimatedMenus();
            
            const paths = await eel.get_app_paths()();
            
            // HTML сжат в одну строку, чтобы избежать багов с переносом строк (pre-wrap)
            const htmlMessage = `<div style="text-align: center; margin-bottom: 20px;"><h2 style="color: var(--accent-color); margin-bottom: 5px; font-weight:700;">Prompt Manager v2.5</h2><span style="font-size: 0.8em; color: var(--text-color-dark);">The Customization & Architecture Update</span></div><div style="font-size: 0.85em; text-align: left; background: rgba(0,0,0,0.2); padding: 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); max-width: 100%; overflow: hidden;"><div style="margin-bottom: 12px;"><strong style="color: var(--text-color);">Installation Folder</strong><br><span style="color: var(--text-color-dark); font-size: 0.85em;">Deleted on uninstall.</span><br><a href="#" onclick="eel.open_folder_in_explorer('${paths.install_dir.replace(/\\/g, '\\\\')}')" style="color: var(--accent-color); text-decoration: none; word-wrap: anywhere; display: inline-block; margin-top: 2px;">${paths.install_dir}</a></div><div style="margin-bottom: 12px;"><strong style="color: var(--text-color);">Data & Settings</strong><br><span style="color: var(--text-color-dark); font-size: 0.85em;">Kept safe on uninstall.</span><br><a href="#" onclick="eel.open_folder_in_explorer('${paths.app_data_dir.replace(/\\/g, '\\\\')}')" style="color: var(--accent-color); text-decoration: none; word-wrap: anywhere; display: inline-block; margin-top: 2px;">${paths.app_data_dir}</a></div><div><strong style="color: var(--text-color);">Active Vault</strong><br><span style="color: var(--text-color-dark); font-size: 0.85em;">Contains your notes and metadata.</span><br><a href="#" onclick="eel.open_folder_in_explorer('${paths.notes_dir.replace(/\\/g, '\\\\')}')" style="color: var(--accent-color); text-decoration: none; word-wrap: anywhere; display: inline-block; margin-top: 2px;">${paths.notes_dir}</a></div></div>`;
            
            const t = translations[state.settings.language];
            dom.alertModal.querySelector('#alert-title').textContent = t.aboutApp || 'About App';
            
            // На время показа About отключаем pre-wrap у контейнера
            const msgContainer = dom.alertModal.querySelector('#alert-message');
            msgContainer.style.whiteSpace = 'normal';
            msgContainer.innerHTML = htmlMessage;
            
// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
            const buttonsContainer = dom.alertModal.querySelector('#alert-buttons');
            buttonsContainer.innerHTML = ''; 
            
            // 1. Создаем красивую зеленую кнопку GitHub
            const githubBtn = document.createElement('button');
            githubBtn.className = 'modal-btn';
            githubBtn.textContent = 'GitHub';
            // Используем инлайн-стили, чтобы перебить стандартные
            githubBtn.style.backgroundColor = '#2ea043'; // Цвет GitHub
            githubBtn.style.color = '#ffffff';
            githubBtn.style.borderColor = 'transparent';
            githubBtn.style.boxShadow = '0 4px 15px rgba(46, 160, 67, 0.3)';
            githubBtn.onclick = () => {
                window.open('https://github.com/sdfghasx/Prompt-manager', '_blank');
            };
            
            // 2. Стандартная кнопка ОК
            const okBtn = document.createElement('button');
            okBtn.className = 'modal-btn accent';
            okBtn.textContent = 'OK';
            okBtn.onclick = () => { 
                closeModalAnimated(dom.alertModal); 
                // Возвращаем стандартное поведение текстового контейнера
                setTimeout(() => {
                    msgContainer.textContent = '';
                    msgContainer.style.whiteSpace = '';
                }, 300);
            };
            
            // Добавляем обе кнопки (GitHub слева, OK справа)
            buttonsContainer.appendChild(githubBtn);
            buttonsContainer.appendChild(okBtn);
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

            dom.alertModal.classList.add('visible');
        }
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

    });

// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    function showContextMenu(e, items, center = false, keepOptionsOpen = false) {
        e.preventDefault();
        e.stopPropagation();
        if (!keepOptionsOpen) hideOtherMenus();


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
                        <div class="dropdown-menu submenu" style="max-height: 400px; overflow-y: auto; overflow-x: hidden; min-width: 180px;">
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
            // Мгновенно сбрасываем старое меню без анимации, чтобы оно перепрыгнуло
            dom.contextMenu.classList.remove('visible');
            dom.contextMenu.classList.remove('is-closing');
        }

        const tile = e.target.closest('.note-tile');

        if (!tile) return;
        hideTooltip();
        
        const noteId = tile.dataset.id;
        dom.contextMenu.dataset.noteId = noteId;
        dom.contextMenu.dataset.collId = '';
        const t = translations[state.settings.language];

        let menuItems = [
            { label: t.metadata, action: 'show-metadata' },
            { type: 'divider' },
            { label: t.quickEdit, action: 'quick-edit' }, // <-- ДОБАВЛЕНО
            { label: t.edit, action: 'edit-note' },
            { label: t.delete, action: 'delete-note' },
            { type: 'divider' },
            { label: t.select, action: 'select-note' }
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
            dom.contextMenu.classList.remove('visible');
            dom.contextMenu.classList.remove('is-closing');
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
            { label: t.quickEdit, action: 'quick-edit' }, // <-- ДОБАВЛЕНО
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
// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    dom.contextMenu.addEventListener('mouseover', (e) => {
        // Как только мышь вернулась на любой элемент меню - снимаем блокировку закрытия
        isInteractingWithSubmenu = false; 
        
        const container = e.target.closest('.context-submenu-container');
        if (container) {
            const submenu = container.querySelector('.submenu');
            if (submenu) {
                clearTimeout(submenu.hideTimer);
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

                submenu.classList.remove('is-closing');
                submenu.classList.add('visible');
                
                // Изначальное позиционирование (открывается вправо и вниз)
                submenu.style.top = '-5px';
                submenu.style.bottom = 'auto';
                submenu.style.left = '100%';
                submenu.style.right = 'auto';
                
                const rect = submenu.getBoundingClientRect();
                
                // Проверка по горизонтали: если не влезает вправо, открываем влево
                if (rect.right > window.innerWidth) {
                    submenu.style.left = 'auto';
                    submenu.style.right = '100%';
                }
                
                // Проверка по вертикали: если выпадает за нижний край экрана, открываем вверх
                if (rect.bottom > window.innerHeight) {
                    submenu.style.top = 'auto';
                    submenu.style.bottom = '-5px'; // Заставляем список расти вверх от пункта меню
                }

            }
        }
    });

// --- 👇 ЕДИНСТВЕННЫЙ ПРАВИЛЬНЫЙ ОБРАБОТЧИК ПОДМЕНЮ В CONTEXT MENU ---
    dom.contextMenu.addEventListener('mouseout', (e) => {
        const container = e.target.closest('.context-submenu-container');
        if (container) {
            // Если курсор перешел на дочерний элемент ЭТОГО ЖЕ контейнера - ничего не делаем
            if (container.contains(e.relatedTarget)) return;
            
            // Если включена защита клика аккордеона - игнорируем уход мыши
            if (isInteractingWithSubmenu) return;
            
            const submenu = container.querySelector('.submenu');
            if (submenu) hideContextSubmenu(submenu);
        }
    });
// --- 👆 КОНЕЦ БЛОКА ---


// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    dom.contextMenu.addEventListener('click', async (e) => {
        const target = e.target.closest('.dropdown-menu-item');
        if (!target) return;

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
        // --- ЛОГИКА АККОРДЕОНА В МЕНЮ ---
        if (target.classList.contains('context-collection-parent')) {
            e.stopPropagation(); 
            
            // ВАЖНО: Блокируем автозакрытие. 
            // Это защитит меню от закрытия, даже если оно сожмется и курсор окажется в пустоте.
            isInteractingWithSubmenu = true;
            
            // Замок сам снимется через 1 секунду (этого с запасом хватит на анимацию сжатия меню
            // и на то, чтобы пользователь перевел курсор обратно на меню или кликнул мимо)
            setTimeout(() => {
                isInteractingWithSubmenu = false;
            }, 1000);
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

            
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
            return; 
        }
        // --- КОНЕЦ ЛОГИКИ АККОРДЕОНА ---

        
        const action = target.dataset.action;

        if (!action) return;

        if (action === 'change-dot-color' && activeDotContext) {
            // СОХРАНЯЕМ В ЛОКАЛЬНУЮ ПЕРЕМЕННУЮ ДО ЗАКРЫТИЯ МЕНЮ
            const dotToChange = activeDotContext; 
            hideAllAnimatedMenus(); // Прячем все меню перед открытием окна
            
            const isText = dotToChange.hasAttribute('data-theme-text');
            const key = isText ? dotToChange.dataset.themeText : dotToChange.dataset.themeAccent;

            const prefix = isText ? 'text_' : 'accent_';
            const defaultColor = isText ? textThemes[key].color : accentThemes[key].color;
            
            const overrides = state.settings.color_overrides || {};
            const currentColor = overrides[`${prefix}${key}`] || defaultColor;

            const newColor = await AdvancedColorPicker.open(currentColor);
            if (newColor) {
                state.settings.color_overrides = overrides;
                state.settings.color_overrides[`${prefix}${key}`] = newColor;
                dotToChange.style.backgroundColor = newColor; // ИСПОЛЬЗУЕМ СОХРАНЕННУЮ
                dotToChange.dataset.tooltipText = ColorNamer.getName(newColor, state.settings.language);
                
                await eel.save_settings({ color_overrides: state.settings.color_overrides })();

                
                if (!isText && state.settings.theme_accent === key) applyTheme(state.settings.theme_base, key);
                if (isText && state.settings.theme_text === key) applyTextTheme(key);
            }
            activeDotContext = null;
            return;
        }
// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
        else if (action === 'reset-dot-color' && activeDotContext) {
            // СОХРАНЯЕМ В ЛОКАЛЬНУЮ ПЕРЕМЕННУЮ ДО ЗАКРЫТИЯ МЕНЮ (как и в change-dot-color)
            const dotToReset = activeDotContext;
            
            // Теперь можно безопасно скрывать меню
            hideContextMenuAnimated();
            
            const isText = dotToReset.hasAttribute('data-theme-text');
            const key = isText ? dotToReset.dataset.themeText : dotToReset.dataset.themeAccent;
            const prefix = isText ? 'text_' : 'accent_';
            const defaultColor = isText ? textThemes[key].color : accentThemes[key].color;

            if (state.settings.color_overrides) {
                delete state.settings.color_overrides[`${prefix}${key}`];
                await eel.save_settings({ color_overrides: state.settings.color_overrides })();
            }
            
            dotToReset.style.backgroundColor = defaultColor;
            dotToReset.dataset.tooltipText = ColorNamer.getName(defaultColor, state.settings.language);

            if (!isText && state.settings.theme_accent === key) applyTheme(state.settings.theme_base, key);
            if (isText && state.settings.theme_text === key) applyTextTheme(key);
            
            activeDotContext = null;
            return;
        }
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---


        
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
                await showCustomAlert('errorTitle', getErrorMessage(result));
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
                deactivateSelectionMode();
                setTimeout(() => reload_app(), 1200);
            } else {
                await showCustomAlert('errorTitle', getErrorMessage(result));
                // НЕ снимаем выделение при ошибке, даем пользователю шанс повторить!
            }
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
                applyFilters(); // <--- ДОБАВИТЬ СЮДА
                
            }
            deactivateSelectionMode();
            return;
        }
        
// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
        if (action === 'select-note') {
            activateSelectionMode(noteId);
            return;
        }

        if (action === 'quick-edit') {
            await openQuickEditModal(noteId);
        }
        else if (action === 'edit-note') {
            await openNoteModal(noteId);
        }
        else if (action === 'delete-note') {
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

            if (await showCustomConfirm('deleteNoteTitle', t.deleteNoteMessage, 'deleteAction', 'cancel', true)) {
                const result = await eel.delete_note(noteId)();
                if (result.success) {
                    delete state.notes[result.deleted_id];
                    delete state.noteContentsCache[result.deleted_id];
                    delete state.notePreviews[result.deleted_id];
                    Object.keys(state.collectionNotes).forEach(cId => {

                        state.collectionNotes[cId] = state.collectionNotes[cId].filter(nId => nId !== result.deleted_id);
                    });
                    
                    renderFullUI();
                    updateCounters();
                    if (currentOpenCollectionId) {
                        renderCollectionView(currentOpenCollectionId);
                    }
                    showNotification('noteDeleted');
                    applyFilters(); // <--- ДОБАВИТЬ СЮДА
                    
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
                applyFilters(); // <--- ДОБАВИТЬ СЮДА

            }
        }
        else if (action === 'remove-from-collection') {
            const result = await eel.remove_note_from_collection(noteId, collId)();
            if (result.success) {
                state.collectionNotes[collId] = state.collectionNotes[collId].filter(id => id !== noteId);
                renderCollectionView(collId);
                updateCounters();
                showNotification('removeFromCollection');
                applyFilters(); // <--- ДОБАВИТЬ СЮДА
                
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

        else if (action === 'edit-collection') {
            // Открываем модалку для редактирования
            openCollectionModal(collId);
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
                    applyFilters(); // Обновляем список нераспределенных
                }
            }
        }
    });

// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---


// --- 👇 НАЧАЛО НОВОГО БЛОКА ---
    // --- СИСТЕМА ПРОВЕРКИ ОБНОВЛЕНИЙ ---
    async function checkForUpdates() {
        try {
            // Делаем запрос к публичному API GitHub (не требует авторизации)
            // ЗАМЕНИ НА СВОЙ ЮЗЕРНЕЙМ И РЕПОЗИТОРИЙ, ЕСЛИ ОНИ ДРУГИЕ!
            const repoUrl = "sdfghasx/Prompt-manager"; 
            const response = await fetch(`https://api.github.com/repos/${repoUrl}/releases/latest`);
            
            if (!response.ok) return; // Если нет интернета или API недоступен - тихо выходим
            
            const data = await response.json();
            const latestVersion = data.tag_name; // Например "v2.6"
            
            // Если версии не совпадают (простейшая проверка)
            if (latestVersion && latestVersion !== APP_VERSION) {
                showUpdateIndicator(latestVersion, data.html_url);
            }
        } catch (e) {
            console.log("Update check failed (offline mode):", e);
        }
    }

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    function showUpdateIndicator(latestVersion, releaseUrl) {
        const t = translations[state.settings.language];
        
        // 1. Рисуем красную точку на кнопке опций
        dom.optionsBtn.style.position = 'relative';
        dom.optionsBtn.innerHTML += `<span style="position: absolute; top: 4px; right: 4px; width: 8px; height: 8px; background-color: var(--accent-color-danger); border-radius: 50%; box-shadow: 0 0 5px var(--accent-color-danger);"></span>`;
        
        // 2. Добавляем яркую кнопку с использованием data-translate, чтобы она переводилась на лету
        const updateHtml = `
            <div class="dropdown-menu-item" style="background: rgba(var(--accent-color-rgb), 0.15); color: var(--accent-color); font-weight: 700; justify-content: center; margin-bottom: 5px;" onclick="window.open('${releaseUrl}', '_blank')">
                <span data-translate="updateAvailable">${t.updateAvailable || 'Update Available'}</span>&nbsp;(${latestVersion})
            </div>
            <div class="dropdown-divider"></div>
        `;
        
        // Вставляем кнопку в самое начало меню опций
        dom.optionsMenu.insertAdjacentHTML('afterbegin', updateHtml);
    }
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

// --- 👆 КОНЕЦ НОВОГО БЛОКА ---


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
            
            const overrides = state.settings.color_overrides || {};
            
            // Генерируем кнопки для акцентного цвета
            for (const [key, value] of Object.entries(accentThemes)) {
                const item = document.createElement('div');
                item.className = 'theme-dot';
                item.dataset.themeAccent = key;
                item.dataset.tooltipText = value.name; // Убрали системную подсказку, добавили свою

                
                if (key === 'custom') {
                    item.style.background = `linear-gradient(135deg, ${state.settings.custom_accent}, #ffffff)`;
                    item.dataset.isCustom = "true";
                } else {
                    item.style.backgroundColor = overrides[`accent_${key}`] || value.color;
                }
                dom.accentColorsContainer.appendChild(item);
            }

            // Генерируем кнопки для цвета текста
            for (const [key, value] of Object.entries(textThemes)) {
                const item = document.createElement('div');
                item.className = 'theme-dot';
                item.dataset.themeText = key;
                item.dataset.tooltipText = value.name; // Убрали системную подсказку, добавили свою


                if (key === 'custom') {
                    item.style.background = `linear-gradient(135deg, ${state.settings.custom_text}, #ffffff)`;
                    item.dataset.isCustom = "true";
                } else {
                    item.style.backgroundColor = overrides[`text_${key}`] || value.color;
                }
                textColorsContainer.appendChild(item);
            }


            
            // Применяем все загруженные настройки
            applyTranslations(state.settings.language);
            applyTheme(state.settings.theme_base, state.settings.theme_accent);
            applyTextTheme(state.settings.theme_text || 'default');
// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
            applyVisualStyle(state.settings.current_style || 'default');
            
            // Восстанавливаем сохраненные виды для обеих сеток

            applyViewMode(state.settings.view_mode || 'grid', dom.notesGrid, dom.viewModeIcon);
            applyViewMode(state.settings.collection_view_mode || 'grid', dom.collectionView.grid, dom.collViewModeIcon);
            
            // Отрисовываем основной интерфейс
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

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

            setTimeout(checkForUpdates, 3000);
            
// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
        } catch (error) {
            console.error("Fatal: Failed to initialize app.", error);
            const fallbackT = translations[state.settings.language] || translations.en;
            
            // Вызываем наш красивый экран смерти вместо alert()
            const crashScreen = document.getElementById('fatal-error-overlay');
            if (crashScreen) {
                // Меняем текст на ошибку инициализации
                crashScreen.querySelector('h1').textContent = "Initialization Error";
                crashScreen.querySelector('p').textContent = fallbackT.fatalInitError || "Could not load application data.";
                crashScreen.classList.add('visible');
            }
        }
    }
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---


// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---

// --- 👇 ВСТАВИТЬ ПЕРЕД initializeApp(); ---
    let activeFilterTag = null;

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
    function renderTagsBar() {
        const tagsListContainer = document.getElementById('tags-list-container');
        const tagsBarMenu = document.getElementById('tags-bar');
        if (!tagsListContainer || !tagsBarMenu) return;

        // Получаем текущее значение строки поиска
        const searchValue = dom.searchInput.value.toLowerCase().trim();
        
        // НОВАЯ ЛОГИКА: Прячем панель, если вводим текст без решетки
        if (searchValue.length > 0 && !searchValue.startsWith('#')) {
            tagsBarMenu.classList.add('force-hide');
            return;
        } else {
            tagsBarMenu.classList.remove('force-hide');
        }

        // Какую часть тега мы ищем (если ввели #py, ищем "py")
        const searchTagInput = searchValue.startsWith('#') ? searchValue.substring(1).trim() : '';

        const tagCounts = {};
        Object.values(state.notes).forEach(note => {
            if (note.tags && note.tags.trim() !== '') {
                note.tags.split(',').map(t => t.trim().toLowerCase()).filter(t => t).forEach(tag => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
            }
        });

        // НОВАЯ ЛОГИКА: Сначала фильтруем по совпадению, потом сортируем по популярности
        const filteredTags = Object.entries(tagCounts)
            .filter(([tag]) => tag.includes(searchTagInput))
            .sort((a, b) => {
                // Если тег начинается с введенных букв - он в приоритете
                const aStartsWith = a[0].startsWith(searchTagInput);
                const bStartsWith = b[0].startsWith(searchTagInput);
                if (aStartsWith && !bStartsWith) return -1;
                if (!aStartsWith && bStartsWith) return 1;
                // Иначе сортируем по популярности (количеству заметок)
                return b[1] - a[1];
            })
            .slice(0, 15);

        if (filteredTags.length === 0) {
            tagsListContainer.innerHTML = '<div style="color: var(--text-color-dark); font-size: 0.85em; padding-left: 4px;">No tags found...</div>';
        } else {
            tagsListContainer.innerHTML = filteredTags.map(([tag, count]) => `
                <span class="tag-pill ${activeFilterTag === tag ? 'active' : ''}" data-tag="${tag}">
                    #${tag} <span>${count}</span>
                </span>
            `).join('');
        }

        // Оставляем класс для удержания панели, если тег был нажат мышкой
        if (activeFilterTag) {
            tagsBarMenu.classList.add('has-active-tag');
        } else {
            tagsBarMenu.classList.remove('has-active-tag');
        }
    }
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---


// --- 👇 ВСТАВИТЬ ПЕРЕД initializeApp(); ---
    // Обработка кликов по тегам-бейджикам (ПЕРЕПИСАНО БЕЗОПАСНО)
    document.addEventListener('click', (e) => {
        const tagPill = e.target.closest('.tag-pill');
        if (!tagPill) return;

        e.stopPropagation(); 
        const clickedTag = tagPill.dataset.tag;
        
        if (activeFilterTag === clickedTag) {
            activeFilterTag = null;
            dom.searchInput.value = ''; 
        } else {
            activeFilterTag = clickedTag;
            dom.searchInput.value = `#${clickedTag}`;
        }
        
        renderTagsBar(); // Обновляем цвет активного тега
        applyFilters();
    });

    dom.searchInput.addEventListener('input', () => {
        if (activeFilterTag && !dom.searchInput.value.includes(`#${activeFilterTag}`)) {
            activeFilterTag = null;
            renderTagsBar();
        }
    });
// --- 👆 КОНЕЦ ВСТАВКИ ---


    initializeApp();
});

// --- Глобальные функции ---
eel.expose(reload_app, 'reload_app');
function reload_app() {
    location.reload();
}


// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
// --- СИСТЕМА BUG REPORT И ПЕРЕХВАТ ПАДЕНИЙ ---

// Глобальная переменная для хранения последней ошибки
let lastFatalError = "Connection to local Python server was lost.";

function showFatalErrorScreen(errorMessage) {
    const crashScreen = document.getElementById('fatal-error-overlay');
    if (!crashScreen) return;
    
    lastFatalError = errorMessage;
    
    const msgElement = document.getElementById('fatal-error-message');
    if (msgElement) msgElement.textContent = errorMessage;
    
    crashScreen.classList.add('visible');
}

// 1. Перехват обрыва связи с Eel
let checkSocketInterval = setInterval(() => {
    if (window.eel && window.eel._websocket) {
        clearInterval(checkSocketInterval);
        
        window.eel._websocket.onclose = function () {
            showFatalErrorScreen("WebSocket Connection Lost. The local Python server might have crashed.");
        };
    }
}, 50);

// 2. Глобальный перехват непредсказуемых JS-ошибок (краш фронтенда)
window.addEventListener('error', function(event) {
    // Игнорируем мелкие ошибки загрузки картинок
    if (event.target && (event.target.tagName === 'IMG' || event.target.tagName === 'LINK')) return;
    
    showFatalErrorScreen(`Frontend Error: ${event.message} at ${event.filename}:${event.lineno}`);
});

// НОВЫЙ БЛОК: Перехват ошибок от сервера Eel (Promise rejections)
window.addEventListener('unhandledrejection', function(event) {
    const reason = event.reason;
    // Проверяем, похож ли объект на стандартную ошибку от Eel
    if (reason && reason.errorText && reason.errorTraceback) {
        event.preventDefault(); // Предотвращаем вывод в системную консоль
        
        // Очищаем трейсбэк от личных путей (на всякий случай, если Python-декоратор пропустил)
        let cleanTraceback = reason.errorTraceback;
        if (cleanTraceback.includes('Users\\')) {
            // Простейшая очистка пути до папки пользователя
            cleanTraceback = cleanTraceback.replace(/C:\\Users\\[^\\]+\\/gi, '[USER_DIR]\\');
        }

        showFatalErrorScreen(`Backend Crash:\n\n${cleanTraceback}`);
    } else if (reason instanceof Error) {
        // Обычная JS ошибка в промисе
        showFatalErrorScreen(`Frontend Promise Error: ${reason.message}\n${reason.stack}`);
    }
});

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---
// 3. Глобальная функция копирования (вызывается напрямую из HTML)

window.copyFatalErrorLog = function() {
    const appVersion = "v2.5";
    const userAgent = navigator.userAgent;
    
    let currentLang = 'unknown';
    try {
        if (typeof state !== 'undefined' && state.settings) {
            currentLang = state.settings.language || 'unknown';
        }
    } catch (e) {
        console.warn("Could not read state for bug report.");
    }
    
    const report = `
### Bug Report - Prompt Manager ${appVersion}

**Error Details:**
\`\`\`text
${lastFatalError}
\`\`\`

**Environment Context:**
- **Language:** ${currentLang}
- **User Agent:** ${userAgent}
- **Time:** ${new Date().toISOString()}


**Steps to reproduce:**
1. [Please describe what you were doing right before the crash]
    `.trim();

    // Запасной план копирования
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(report).then(transformButtonToLink).catch(fallbackCopy);
    } else {
        fallbackCopy();
    }

    function fallbackCopy() {
        const textArea = document.createElement("textarea");
        textArea.value = report;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            transformButtonToLink();
        } catch (err) {
            console.error('Fallback copy failed', err);
            alert("Copy failed. Please open console (F12).");
        }
        textArea.remove();
    }

    // НОВАЯ ЛОГИКА: Превращаем кнопку копирования в кнопку перехода
    function transformButtonToLink() {
        const msgObj = document.getElementById('bug-report-copied-msg');
        if (msgObj) {
            msgObj.textContent = "Copied to clipboard!";
            msgObj.style.opacity = '1';
            setTimeout(() => { msgObj.style.opacity = '0'; }, 3000);
        }

        const btn = document.getElementById('copy-bug-report-btn');

        if (btn) {
            // Меняем текст и стиль кнопки
            btn.textContent = "Open GitHub Issues";
            btn.style.backgroundColor = "#2ea043"; // Зеленый цвет GitHub
            btn.style.boxShadow = "0 4px 15px rgba(46, 160, 67, 0.4)";
            
            // Снимаем старый обработчик (он был прописан в HTML через onclick)
            btn.onclick = null;
            
            // Вешаем новый обработчик, который откроет ссылку с АВТОЗАПОЛНЕНИЕМ
            btn.onclick = () => {
                // Кодируем наш сформированный отчет в формат URL
                const encodedBody = encodeURIComponent(report);

                const githubIssueUrl = `https://github.com/sdfghasx/Prompt-manager/issues/new?title=[Bug]%20Crash%20Report&body=${encodedBody}`;
                
                // Открываем браузер
                window.open(githubIssueUrl, '_blank');
            };
        }
    }
};
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ ---