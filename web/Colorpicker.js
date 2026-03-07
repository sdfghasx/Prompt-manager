// colorpicker.js - Изолированный модуль продвинутого выбора цвета
const AdvancedColorPicker = (function() {
    // --- 1. Математика цветов (HEX <-> RGB <-> HSV/HSL) ---
    function hexToRgb(hex) {
        let r=0,g=0,b=0;
        hex = hex.replace('#','');
        if(hex.length===3){ r=parseInt(hex[0]+hex[0],16); g=parseInt(hex[1]+hex[1],16); b=parseInt(hex[2]+hex[2],16); }
        else if(hex.length===6){ r=parseInt(hex.substring(0,2),16); g=parseInt(hex.substring(2,4),16); b=parseInt(hex.substring(4,6),16); }
        return {r,g,b};
    }
    function rgbToHex(r, g, b) {
        return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
    }
    function rgbToHsv(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, v = max;
        let d = max - min;
        s = max === 0 ? 0 : d / max;
        if (max === min) h = 0;
        else {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
    }
    function hsvToRgb(h, s, v) {
        let r, g, b;
        h /= 360; s /= 100; v /= 100;
        let i = Math.floor(h * 6);
        let f = h * 6 - i;
        let p = v * (1 - s);
        let q = v * (1 - f * s);
        let t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
    }
    function rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) h = s = 0;
        else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }
    function hslToRgb(h, s, l) {
        let r, g, b;
        h /= 360; s /= 100; l /= 100;
        if (s === 0) r = g = b = l;
        else {
            let hue2rgb = function(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
    }

    // --- 2. Состояние и DOM ---
    let state = { hex: '#FF0000', hsv: {h:0, s:100, v:100}, hsl: {h:0, s:100, l:50} };
    let currentScreen = 0; // 0=Сетка, 1=Ползунки, 2=Квадрат
    let resolvePromise = null;
    let isDragging = false;
    let dom = {};
    let customGridDot = null;

    function initDOM() {
        if (dom.modal) return; // Инициализируем 1 раз
        dom = {
            modal: document.getElementById('color-picker-modal'),
            preview: document.getElementById('cp-preview'),
            carousel: document.getElementById('cp-carousel'),
            prevBtn: document.getElementById('cp-prev'),
            nextBtn: document.getElementById('cp-next'),
            grid: document.getElementById('cp-grid'),
            customZone: document.getElementById('cp-custom-dot-zone'), // <-- ДОБАВЛЕНО
        //    hslHue: document.getElementById('cp-hsl-hue'),
         //   hslLight: document.getElementById('cp-hsl-light'),
            square: document.getElementById('cp-square'),
            squareThumb: document.getElementById('cp-square-thumb'),
            squareHue: document.getElementById('cp-square-hue'),
            btnOk: document.getElementById('cp-ok'),
            btnCancel: document.getElementById('cp-cancel')
        };

        // Заполняем сетку из colornamer.js
        if(typeof ColorNamer !== 'undefined' && ColorNamer.colors) {
            
            // Отключаем машинную математику. 
            // Используем идеальную ручную группировку (Красные, Синие, Желтые), которая уже прописана в colornamer.js
            let sortedColors = ColorNamer.colors;

            // Создаем скрытый кастомный кружок в самом начале
            customGridDot = document.createElement('div');
            customGridDot.className = 'cp-grid-dot';
            customGridDot.style.display = 'none';
            customGridDot.dataset.tooltipText = 'Custom';
            customGridDot.onclick = () => updateFromHex(customGridDot.dataset.hex);
            dom.grid.appendChild(customGridDot);

            // Отрисовываем массив
            sortedColors.forEach(c => {
                let dot = document.createElement('div');
                dot.className = 'cp-grid-dot';
                dot.dataset.hex = c.hex.toUpperCase(); // <-- ДОБАВИЛИ МЕТКУ

                dot.style.backgroundColor = c.hex;
                // Наша красивая стеклянная подсказка перехватит этот dataset
                dot.dataset.tooltipText = c.ru || c.en; 
                dot.onclick = () => updateFromHex(c.hex);
                dom.grid.appendChild(dot);
            });
        }



        // Кнопки карусели
        dom.prevBtn.onclick = () => switchScreen(-1);
        dom.nextBtn.onclick = () => switchScreen(1);
        
        // Экран 2: Ползунки
 //       dom.hslHue.oninput = () => updateFromHsl();
  //      dom.hslLight.oninput = () => updateFromHsl();
   //     dom.hslLight.ondblclick = () => { dom.hslLight.value = 50; updateFromHsl(); };

        // Экран 3: Квадрат
        dom.squareHue.oninput = () => { state.hsv.h = parseInt(dom.squareHue.value); updateFromHsv(); };
        dom.square.onmousedown = (e) => { isDragging = true; handleSquareMove(e); };
        window.addEventListener('mousemove', (e) => { if(isDragging) handleSquareMove(e); });
        window.addEventListener('mouseup', () => { isDragging = false; });

        // Основные кнопки
        dom.btnOk.onclick = () => close(state.hex);
        dom.btnCancel.onclick = () => close(null);
    }

    // --- 3. Логика ---
// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ (colorpicker.js) ---
    function switchScreen(dir) {
        currentScreen += dir;
        // Зацикливаем между экранами 0 и 1
        if (currentScreen < 0) currentScreen = 1; 
        if (currentScreen > 1) currentScreen = 0; 
        
        // Смещаем на 50% (так как ширина контейнера 200%)
        dom.carousel.style.transform = `translateX(-${currentScreen * 50}%)`;
    }
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ (colorpicker.js) ---


    function handleSquareMove(e) {
        let rect = dom.square.getBoundingClientRect();
        let x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        let y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
        state.hsv.s = Math.round((x / rect.width) * 100);
        state.hsv.v = Math.round(100 - (y / rect.height) * 100);
        updateFromHsv();
    }

// --- 👇 НАЧАЛО БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ (colorpicker.js) ---
    // Главная функция: обновляет ВСЕ экраны одновременно
    function updateUI() {
        dom.preview.style.backgroundColor = state.hex;
        highlightCurrentColor(state.hex); 

        // Экран 2 (бывший Экран 3): 2D Квадрат
        dom.squareHue.value = state.hsv.h;
        dom.square.style.backgroundColor = `hsl(${state.hsv.h}, 100%, 50%)`;
        dom.squareThumb.style.left = `${state.hsv.s}%`;
        dom.squareThumb.style.top = `${100 - state.hsv.v}%`;
    }
// --- 👆 КОНЕЦ БЛОКА ДЛЯ ПОЛНОЙ ЗАМЕНЫ (colorpicker.js) ---


    // Три точки входа для синхронизации
    function updateFromHex(hex) {
        state.hex = hex;
        let rgb = hexToRgb(hex);
        state.hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
        state.hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        updateUI();
    }
    function updateFromHsl() {
        state.hsl.h = parseInt(dom.hslHue.value);
        state.hsl.l = parseInt(dom.hslLight.value);
        let rgb = hslToRgb(state.hsl.h, state.hsl.s, state.hsl.l);
        state.hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        state.hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
        updateUI();
    }
    function updateFromHsv() {
        let rgb = hsvToRgb(state.hsv.h, state.hsv.s, state.hsv.v);
        state.hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        state.hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        updateUI();
    }

    function highlightCurrentColor(hex) {
        // Очищаем старые выделения
        document.querySelectorAll('.cp-grid-dot.selected-dot').forEach(el => el.classList.remove('selected-dot'));
        
        const targetRGB = hexToRgb(hex);
        let closestDotHex = null;
        let minDistance = Infinity;

        // Ищем ближайший цвет в базе (ColorNamer.colors)
        if (typeof ColorNamer !== 'undefined' && ColorNamer.colors) {
            ColorNamer.colors.forEach(c => {
                const rgb = hexToRgb(c.hex);
                const distance = Math.sqrt(
                    Math.pow(targetRGB.r - rgb.r, 2) +
                    Math.pow(targetRGB.g - rgb.g, 2) +
                    Math.pow(targetRGB.b - rgb.b, 2)
                );
                if (distance < minDistance) {
                    minDistance = distance;
                    closestDotHex = c.hex.toUpperCase();
                }
            });
        }

        // Порог похожести (допуск). 30 - это небольшое отклонение (несколько единиц)
        if (minDistance <= 15 && closestDotHex) {
            // Прячем кастомный кружок, выделяем найденный
            customGridDot.style.display = 'none';
            const dot = dom.grid.querySelector(`.cp-grid-dot[data-hex="${closestDotHex}"]`);
            if (dot) dot.classList.add('selected-dot');
        } else {
            // Цвет уникальный - показываем кастомный кружок первым
            customGridDot.style.backgroundColor = hex;
            customGridDot.dataset.hex = hex;
            customGridDot.style.display = 'block';
            customGridDot.classList.add('selected-dot');
        }
    }

    function close(result) {
        dom.modal.classList.remove('visible');
        if(resolvePromise) {
            resolvePromise(result);
            resolvePromise = null; // Очищаем ссылку для Garbage Collector
        }
    }


    return {
        open: function(initialHex) {
            initDOM();
            const startHex = initialHex || '#589DF6';
            updateFromHex(startHex);
            highlightCurrentColor(startHex); // <-- ВЫЗЫВАЕМ ПРОВЕРКУ ЗДЕСЬ
            dom.modal.classList.add('visible');
            return new Promise(res => { resolvePromise = res; });
        }
    };
})();
