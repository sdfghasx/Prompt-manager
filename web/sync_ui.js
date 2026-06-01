// sync_ui.js - Контроллер интерфейса облачной синхронизации

const CloudSyncUI = (function() {
    let dom = {};

    document.addEventListener('DOMContentLoaded', () => {
        dom = {
            modal: document.getElementById('sync-modal'),
            endpoint: document.getElementById('sync-endpoint-input'),
            bucket: document.getElementById('sync-bucket-input'),
            accessKey: document.getElementById('sync-access-key-input'),
            secretKey: document.getElementById('sync-secret-key-input'),
            password: document.getElementById('sync-encryption-password-input'),
            btnSave: document.querySelector('#sync-modal [data-action="save"]'),
            btnCancel: document.querySelector('#sync-modal [data-action="cancel"]'),
            btnDisable: document.getElementById('sync-btn-disable'),
            
            // Новые элементы для окна Help
            helpBtn: document.getElementById('sync-help-btn'),
            helpView: document.getElementById('sync-help-view'),
            formView: document.getElementById('sync-form-view'),
            backBtn: document.getElementById('hw-back-btn'),
            accordion: document.getElementById('hw-accordion'),

            statusContainer: document.getElementById('sync-status-container'),

            statusIcon: document.getElementById('sync-icon'),
            statusText: document.getElementById('sync-status-text')
        };

        // Открытие настроек при клике на весь контейнер индикатора в левом меню
        if (dom.statusContainer) {
            dom.statusContainer.addEventListener('click', openSettings);
        }

        // Если пользователь нажимает ИМЕННО на текст индикатора - запускаем ручную синхронизацию
        if (dom.statusText) {
            dom.statusText.addEventListener('click', (e) => {
                e.stopPropagation(); // Чтобы не открывалось меню настроек
                setSyncStatus('syncing', 'Starting sync...');
                eel.trigger_manual_sync()();
            });
        }

        // --- ЛОГИКА ГЛАЗИКОВ ДЛЯ ПАРОЛЕЙ (С ЗАМЕНОЙ SVG) ---
        const svgEyeOpen = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
        const svgEyeClosed = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;

        document.querySelectorAll('.password-toggle-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                // Ищем инпут внутри родительского div'а
                const input = this.parentElement.querySelector('input');
                if (input.type === 'password') {
                    input.type = 'text';
                    this.innerHTML = svgEyeOpen; // Меняем на открытый глаз
                    this.style.color = 'var(--accent-color)'; // Подсвечиваем цветом акцента
                } else {
                    input.type = 'password';
                    this.innerHTML = svgEyeClosed; // Возвращаем перечеркнутый глаз
                    this.style.color = 'var(--text-color-dark)'; // Возвращаем тусклый цвет
                }
            });
        });
        // ------------------------------------


        // --- ЛОГИКА ОКНА ПОМОЩИ (HOW IT WORKS) ---
        if (dom.helpBtn) {
            dom.helpBtn.addEventListener('click', () => {
                dom.formView.style.opacity = '0';
                dom.formView.style.transform = 'translateX(-20px)';
                dom.formView.style.pointerEvents = 'none';
                
                dom.helpView.classList.add('active');
            });
        }

        if (dom.backBtn) {
            dom.backBtn.addEventListener('click', () => {
                dom.helpView.classList.remove('active');
                
                dom.formView.style.opacity = '1';
                dom.formView.style.transform = 'translateX(0)';
                dom.formView.style.pointerEvents = 'auto';
            });
        }

        // Логика Аккордеона Провайдеров
        if (dom.accordion) {
            dom.accordion.addEventListener('click', (e) => {
                const header = e.target.closest('.hw-provider-header');
                if (!header) return;

                const item = header.parentElement;
                const isExpanded = item.classList.contains('expanded');

                // Закрываем все остальные
                dom.accordion.querySelectorAll('.hw-provider-item.expanded').forEach(el => {
                    if (el !== item) el.classList.remove('expanded');
                });

                // Переключаем текущий
                if (isExpanded) {
                    item.classList.remove('expanded');
                } else {
                    item.classList.add('expanded');
                }
            });
        }
        // ----------------------------------------

        // Обработчики кнопок модального окна
        if (dom.btnCancel) dom.btnCancel.addEventListener('click', closeSettings);


        
        if (dom.btnSave) {
            dom.btnSave.addEventListener('click', async () => {
                const endpoint = dom.endpoint.value.trim();
                const bucket = dom.bucket.value.trim();
                const accessKey = dom.accessKey.value.trim();
                const secretKey = dom.secretKey.value.trim();
                const password = dom.password.value.trim();

                // Получаем текущие переводы
                const currentLang = window.state ? window.state.settings.language : 'en';
                const t = window.translations ? window.translations[currentLang] : {};

                if (!endpoint || !bucket || !accessKey) {
                    // ИСПРАВЛЕНИЕ: Используем переведенный текст из словаря
                    await window.showCustomAlert('errorTitle', t.keysRequired || 'Endpoint, Bucket and Access Key are required!');
                    return;
                }

                // БЛОКИРУЕМ КНОПКУ ОТ ДВОЙНОГО КЛИКА И МЕНЯЕМ ТЕКСТ
                const originalBtnText = dom.btnSave.textContent;
                dom.btnSave.textContent = t.loading || 'Connecting...';
                dom.btnSave.style.pointerEvents = 'none';
                dom.btnSave.style.opacity = '0.7';

                setSyncStatus('syncing', 'Saving credentials...');
                const result = await eel.save_sync_credentials(endpoint, bucket, accessKey, secretKey, password)();
                
                if (result.success) {
                    setSyncStatus('syncing', 'Testing connection...');
                    const testResult = await eel.test_cloud_connection()();
                    
                    if (testResult && testResult.success) {
                        setSyncStatus('success', 'Connected to S3');
                        dom.btnSave.textContent = 'Success!';
                        dom.btnSave.style.backgroundColor = '#30D158'; // Делаем кнопку зеленой на мгновение
                        
                        // Ждем 300мс перед закрытием окна
                        setTimeout(() => {
                            closeSettings();
                            eel.trigger_manual_sync()();
                            // Восстанавливаем кнопку для будущего использования
                            setTimeout(() => {
                                dom.btnSave.textContent = originalBtnText;
                                dom.btnSave.style.pointerEvents = 'auto';
                                dom.btnSave.style.opacity = '1';
                                dom.btnSave.style.backgroundColor = ''; 
                            }, 300);
                        }, 300);
                        
                    } else {
                        setSyncStatus('error', 'Connection Failed');
                        await window.showCustomAlert('errorTitle', `Could not connect to S3 Bucket:\n\n${testResult ? testResult.message : 'Unknown Error'}`);
                        // РАЗБЛОКИРУЕМ КНОПКУ ПОСЛЕ ЗАКРЫТИЯ АЛЕРТА
                        dom.btnSave.textContent = originalBtnText;
                        dom.btnSave.style.pointerEvents = 'auto';
                        dom.btnSave.style.opacity = '1';
                    }
                } else {
                    setSyncStatus('error', 'Encryption Error');
                    await window.showCustomAlert('errorTitle', result.message || "Failed to save credentials locally.");
                    // РАЗБЛОКИРУЕМ КНОПКУ ПОСЛЕ ЗАКРЫТИЯ АЛЕРТА
                    dom.btnSave.textContent = originalBtnText;
                    dom.btnSave.style.pointerEvents = 'auto';
                    dom.btnSave.style.opacity = '1';
                }
            });
        }


        if (dom.btnDisable) {
            dom.btnDisable.addEventListener('click', async () => {
                await eel.disable_cloud_sync()();
                closeSettings();
                
                // Очищаем инпуты
                dom.endpoint.value = '';
                dom.bucket.value = '';
                dom.accessKey.value = '';
                dom.secretKey.value = '';
                dom.password.value = '';
                
                // Достаем переводы из глобального объекта (инициализированного в script.js)
                const currentLang = window.state ? window.state.settings.language : 'en';
                const t = window.translations ? window.translations[currentLang] : {};
                setSyncStatus('idle', t.cloudSyncOff || 'Cloud Sync: Off');
            });
        }

    });

    async function openSettings() {
        dom.endpoint.value = '';
        dom.bucket.value = '';
        dom.accessKey.value = '';
        dom.secretKey.value = '';
        dom.password.value = '';

        // Переводы плейсхолдеров
        const currentLang = window.state ? window.state.settings.language : 'en';
        const t = window.translations ? window.translations[currentLang] : {};
        
        dom.endpoint.placeholder = t.syncEndpointPh || 'https://...';
        dom.bucket.placeholder = t.syncBucketPh || 'bucket-name';
        dom.accessKey.placeholder = t.syncAccessPh || 'Key';

        const passLabel = document.getElementById('sync-password-label');

        const creds = await eel.get_sync_credentials()();
        if (creds) {
            dom.endpoint.value = creds.endpoint || '';
            dom.bucket.value = creds.bucket || '';
            dom.accessKey.value = creds.access_key || ''; 
            dom.secretKey.value = creds.secret_key || ''; 
            
            dom.secretKey.placeholder = t.syncSecretPh || 'Secret Key';
            dom.password.placeholder = creds.has_password ? '********' : (t.syncPasswordPh || 'Leave empty');
            
            // ИСПРАВЛЕНИЕ 3: Если пароль уже установлен, убираем "(Необязательно)", оставляем чистый лейбл
            if (creds.has_password && passLabel) {
                // Извлекаем чистый текст без span (например "Encryption Password")
                const fullText = t.syncPasswordLabel || 'Encryption Password';
                passLabel.innerHTML = fullText.split('<span')[0].trim();
            } else if (passLabel) {
                passLabel.innerHTML = t.syncPasswordLabel || 'Encryption Password <span style="color: #30D158;">(Optional)</span>';
            }

            dom.btnDisable.style.display = 'block';
        } else {
            dom.secretKey.placeholder = t.syncSecretPh || 'Secret Key';
            dom.password.placeholder = t.syncPasswordPh || 'Leave empty';
            
            // Если ключей нет - показываем дефолтный лейбл с (Необязательно)
            if (passLabel) {
                passLabel.innerHTML = t.syncPasswordLabel || 'Encryption Password <span style="color: #30D158;">(Optional)</span>';
            }
            
            dom.btnDisable.style.display = 'none';
        }
        
        dom.modal.classList.add('visible');
    }



    function closeSettings() {
        if (!dom.modal.classList.contains('visible')) return;
        
        // --- СБРОС СОСТОЯНИЯ ГЛАЗИКОВ ---
        const svgEyeClosed = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
        document.querySelectorAll('.password-toggle-btn').forEach(btn => {
            const input = btn.parentElement.querySelector('input');
            if (input && input.type === 'text') {
                input.type = 'password';
                btn.innerHTML = svgEyeClosed;
                btn.style.color = 'var(--text-color-dark)';
            }
        });
        // ---------------------------------
        
        dom.modal.classList.add('is-closing');
        setTimeout(() => {
            dom.modal.classList.remove('visible', 'is-closing');
        }, 150);
    }

    function setSyncStatus(state, text) {
        if (!dom.statusText || !dom.statusIcon) return; // Защита от вызова до загрузки DOM

        
        dom.statusText.textContent = text;
        dom.statusIcon.classList.remove('sync-spinning', 'sync-error', 'sync-success');
        
        if (state === 'syncing') {
            dom.statusIcon.classList.add('sync-spinning');
        } else if (state === 'error') {
            dom.statusIcon.classList.add('sync-error');
        } else if (state === 'success') {
            dom.statusIcon.classList.add('sync-success');
            setTimeout(() => { 
                dom.statusIcon.classList.remove('sync-success'); 
            }, 5000); 
        }
    }

    // Экспортируем функцию для Python Eel, чтобы бэкенд мог дергать интерфейс
    window.eel.expose(update_sync_ui_state, 'update_sync_ui_state');
    function update_sync_ui_state(status_state, message) {
        setSyncStatus(status_state, message);
    }

    // Экспортируем функцию для вызова Окна Разрешения Конфликтов
    window.eel.expose(show_sync_conflict_dialog, 'show_sync_conflict_dialog');
    function show_sync_conflict_dialog() {
        const currentLang = window.state ? window.state.settings.language : 'en';
        const t = window.translations ? window.translations[currentLang] : {};

        const alertModal = document.getElementById('alert-modal');
        const titleEl = alertModal.querySelector('#alert-title');
        const msgEl = alertModal.querySelector('#alert-message');
        const buttonsContainer = alertModal.querySelector('#alert-buttons');

        titleEl.textContent = t.syncConflictTitle || '☁️ Sync Conflict Detected';
        msgEl.innerHTML = t.syncConflictMsg || `You have <b>local notes</b>, but a backup also exists in the <b>Cloud</b>.<br><br>Which version do you want to keep?`;
        
        buttonsContainer.innerHTML = '';
        
        const btnKeepBoth = document.createElement('button');
        btnKeepBoth.className = 'modal-btn accent';
        btnKeepBoth.style.backgroundColor = '#30D158';
        btnKeepBoth.innerHTML = t.keepBothBtn || '🗂 Keep Both (Rename Local)';
        btnKeepBoth.onclick = () => { 
            alertModal.classList.remove('visible'); 
            eel.resolve_sync_conflict('keep_both')(); 
        };

        // Опция 1: Перезаписать локальное (Удаляет новые заметки)
        const btnOverwrite = document.createElement('button');
        btnOverwrite.className = 'modal-btn';
        btnOverwrite.style.borderColor = 'var(--accent-color-danger)';
        btnOverwrite.style.color = 'var(--accent-color-danger)';
        btnOverwrite.innerHTML = t.overwriteBtn || '⬇ Overwrite Local Notes';
        
        // Делаем обработчик асинхронным, чтобы дождаться ответа от кастомного окна
        btnOverwrite.onclick = async () => { 
            // Временно прячем текущее окно конфликта, чтобы не было наслоения
            alertModal.classList.remove('visible'); 
            
            // Вызываем наше красивое окно подтверждения (оно вернет true или false)
            const warningText = t.overwriteWarning || "FINAL WARNING: This will permanently delete your current local notes. Are you sure?";
            // Передаем 'finalWarningTitle' для заголовка, текст, 'ok_btn' для кнопки и флаг isDangerous = true (красная кнопка)
            const isConfirmed = await window.showCustomConfirm('finalWarningTitle', warningText, 'ok_btn', 'cancel', true);
            
            if (isConfirmed) {
                // Если пользователь нажал "ОК" в красном окне - уничтожаем локальные файлы
                eel.resolve_sync_conflict('overwrite')(); 
            } else {
                // Если он испугался и нажал "Cancel" - возвращаем окно конфликта обратно на экран!
                alertModal.classList.add('visible'); 
            }
        };

        const btnCancel = document.createElement('button');

        btnCancel.className = 'modal-btn';
        btnCancel.textContent = t.cancel || 'Cancel';
        btnCancel.onclick = () => { 
            alertModal.classList.remove('visible'); 
            eel.resolve_sync_conflict('cancel')(); 
        };

        buttonsContainer.appendChild(btnCancel);
        buttonsContainer.appendChild(btnOverwrite);
        buttonsContainer.appendChild(btnKeepBoth);
        
        alertModal.classList.add('visible');
    }



    // Если пользователь нажимает на текст индикатора - запускаем ручную синхронизацию
    if (dom.statusText) {
        dom.statusText.addEventListener('click', (e) => {
            e.stopPropagation(); 
            setSyncStatus('syncing', 'Starting sync...');
            eel.trigger_manual_sync()();
        });
    }

    return {
        openSettings: openSettings,
        closeSettings: closeSettings, // <-- ВОТ ОН, ЖЕЛЕЗОБЕТОННЫЙ ЭКСПОРТ
        setSyncStatus: setSyncStatus
    };
})();
