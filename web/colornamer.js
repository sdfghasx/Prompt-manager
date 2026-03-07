// colornamer.js - Премиум-палитра и алгоритм распознавания цветов
const ColorNamer = {
    colors: [
        // --- ХОЛОДНЫЕ ОТТЕНКИ ---
        
        // Синие (Blue)
        { hex: '#0000FF', en: 'Blue', ru: 'Синий' },
        { hex: '#00008B', en: 'Dark Blue', ru: 'Темно-синий' },
        { hex: '#000080', en: 'Navy', ru: 'Нави (Морской)' },
        { hex: '#0F52BA', en: 'Sapphire', ru: 'Сапфировый' },
        { hex: '#0047AB', en: 'Cobalt', ru: 'Кобальтовый' },
        { hex: '#1560BD', en: 'Denim', ru: 'Джинсовый' },
        { hex: '#4169E1', en: 'Royal Blue', ru: 'Королевский синий' },
        { hex: '#4682B4', en: 'Steel Blue', ru: 'Стальной' },
        { hex: '#5F9EA0', en: 'Cadet Blue', ru: 'Серо-синий' },
        { hex: '#6495ED', en: 'Cornflower', ru: 'Васильковый' },
        { hex: '#B0C4DE', en: 'Powder Blue', ru: 'Пороховой синий' },
        
        // Голубые и Бирюзовые (Cyan/Teal)
        { hex: '#00FFFF', en: 'Cyan', ru: 'Голубой' },
        { hex: '#589DF6', en: 'Light Blue', ru: 'Светло-синий' },
        { hex: '#87CEEB', en: 'Sky Blue', ru: 'Небесный' },
        { hex: '#00BFFF', en: 'Deep Sky Blue', ru: 'Глубокий небесный' },
        { hex: '#ADD8E6', en: 'Ice Blue', ru: 'Ледяной синий' },
        { hex: '#007BA7', en: 'Cerulean', ru: 'Лазурный' },
        { hex: '#40E0D0', en: 'Turquoise', ru: 'Бирюзовый' },
        { hex: '#48D1CC', en: 'Medium Turquoise', ru: 'Умеренно-бирюзовый' },
        { hex: '#00CED1', en: 'Dark Turquoise', ru: 'Темно-бирюзовый' },
        { hex: '#20B2AA', en: 'Light Sea Green', ru: 'Светло-морской' },
        { hex: '#008B8B', en: 'Dark Cyan', ru: 'Темно-голубой' },
        { hex: '#008080', en: 'Teal', ru: 'Бирюзово-зеленый' },
        { hex: '#7FFFD4', en: 'Aquamarine', ru: 'Аквамарин' },

        // Фиолетовые и Лиловые (Purple/Violet)
        { hex: '#800080', en: 'Purple', ru: 'Фиолетовый' },
        { hex: '#4B0082', en: 'Indigo', ru: 'Индиго' },
        { hex: '#483D8B', en: 'Dark Slate Blue', ru: 'Темный аспидно-синий' },
        { hex: '#6A5ACD', en: 'Slate Blue', ru: 'Аспидно-синий' },
        { hex: '#9966CC', en: 'Amethyst', ru: 'Аметистовый' },
        { hex: '#8A2BE2', en: 'Blue Violet', ru: 'Сине-фиолетовый' },
        { hex: '#9400D3', en: 'Dark Violet', ru: 'Темно-фиолетовый' },
        { hex: '#9932CC', en: 'Dark Orchid', ru: 'Темно-орхидеевый' },
        { hex: '#BA55D3', en: 'Orchid', ru: 'Орхидеевый' },
        { hex: '#DDA0DD', en: 'Plum', ru: 'Сливовый' },
        { hex: '#D8BFD8', en: 'Thistle', ru: 'Чертополох' },
        { hex: '#E6E6FA', en: 'Lavender', ru: 'Лавандовый' },
        { hex: '#EE82EE', en: 'Violet', ru: 'Светло-фиолетовый' },

        // --- ТЕПЛЫЕ ОТТЕНКИ ---

        // Желтые (Yellow)
        { hex: '#FFFF00', en: 'Yellow', ru: 'Желтый' },
        { hex: '#FFF700', en: 'Lemon', ru: 'Лимонный' },
        { hex: '#FFD700', en: 'Gold', ru: 'Золотой' },
        { hex: '#DAA520', en: 'Goldenrod', ru: 'Золотистый' },
        { hex: '#B8860B', en: 'Dark Goldenrod', ru: 'Темно-золотистый' },
        { hex: '#F4C430', en: 'Saffron', ru: 'Шафрановый' },
        { hex: '#FFDB58', en: 'Mustard', ru: 'Горчичный' },
        { hex: '#F0E68C', en: 'Khaki', ru: 'Хаки' },
        { hex: '#BDB76B', en: 'Dark Khaki', ru: 'Темный хаки' },
        { hex: '#EEE8AA', en: 'Pale Goldenrod', ru: 'Бледно-золотистый' },

        // --- ЗЕЛЕНЫЕ (GREEN) ---
        { hex: '#008000', en: 'Green', ru: 'Зеленый' },
        { hex: '#006400', en: 'Dark Green', ru: 'Темно-зеленый' },
        { hex: '#228B22', en: 'Forest', ru: 'Лесной' },
        { hex: '#00A86B', en: 'Jade', ru: 'Нефритовый' },
        { hex: '#50C878', en: 'Emerald', ru: 'Изумрудный' },
        { hex: '#0BDA51', en: 'Malachite', ru: 'Малахитовый' },
        { hex: '#2E8B57', en: 'Sea Green', ru: 'Морской зеленый' },
        { hex: '#3CB371', en: 'Medium Sea Green', ru: 'Светло-морской зеленый' },
        { hex: '#8FBC8F', en: 'Dark Cyan Green', ru: 'Темный циан-зеленый' },
        { hex: '#00FF00', en: 'Lime', ru: 'Лаймовый' },
        { hex: '#32CD32', en: 'Lime Green', ru: 'Зелено-лаймовый' },
        { hex: '#7FFF00', en: 'Chartreuse', ru: 'Шартрез' },
        { hex: '#7CFC00', en: 'Lawn Green', ru: 'Цвет лужайки' },
        { hex: '#ADFF2F', en: 'Green Yellow', ru: 'Зелено-желтый' },
        { hex: '#9ACD32', en: 'Yellow Green', ru: 'Желто-зеленый' },
        { hex: '#98FF98', en: 'Mint', ru: 'Мятный' },
        { hex: '#90EE90', en: 'Light Green', ru: 'Светло-зеленый' },
        { hex: '#98FB98', en: 'Pale Green', ru: 'Бледно-зеленый' },
        { hex: '#8FBC8B', en: 'Dark Sea Green', ru: 'Темно-морской зеленый' },
        { hex: '#6B8E23', en: 'Olive Drab', ru: 'Оливково-серый' },
        { hex: '#808000', en: 'Olive', ru: 'Оливковый' },
        { hex: '#556B2F', en: 'Dark Olive', ru: 'Темно-оливковый' },

        // Оранжевые (Orange)
        { hex: '#FFA500', en: 'Orange', ru: 'Оранжевый' },
        { hex: '#FF8C00', en: 'Dark Orange', ru: 'Темно-оранжевый' },
        { hex: '#F28500', en: 'Tangerine', ru: 'Мандариновый' },
        { hex: '#FFBF00', en: 'Amber', ru: 'Янтарный' },
        { hex: '#CC7722', en: 'Ocher', ru: 'Охра' },
        { hex: '#FF4500', en: 'Orange Red', ru: 'Оранжево-красный' },
        { hex: '#E2725B', en: 'Terracotta', ru: 'Терракотовый' },

        // Красные (Red)
        { hex: '#FF0000', en: 'Red', ru: 'Красный' },
        { hex: '#DC143C', en: 'Crimson', ru: 'Малиновый' },
        { hex: '#E0115F', en: 'Ruby', ru: 'Рубиновый' },
        { hex: '#C21E56', en: 'Rose Red', ru: 'Розово-красный' },
        { hex: '#FF6347', en: 'Tomato', ru: 'Томатный' },
        { hex: '#B22222', en: 'Firebrick', ru: 'Кирпичный' },
        { hex: '#8B0000', en: 'Dark Red', ru: 'Темно-красный' },
        { hex: '#800000', en: 'Maroon', ru: 'Бордовый' },
        { hex: '#722F37', en: 'Wine', ru: 'Винный' },

        // Розовые (Pink)
        { hex: '#FF00FF', en: 'Fuchsia', ru: 'Фуксия' },
        { hex: '#FF1493', en: 'Deep Pink', ru: 'Глубокий розовый' },
        { hex: '#FF69B4', en: 'Hot Pink', ru: 'Ярко-розовый' },
        { hex: '#FFC0CB', en: 'Pink', ru: 'Розовый' },
        { hex: '#FFB6C1', en: 'Light Pink', ru: 'Светло-розовый' },
        { hex: '#DB7093', en: 'Pale Violet Red', ru: 'Бледно-фиолетово-красный' },
        { hex: '#C71585', en: 'Medium Violet Red', ru: 'Умеренно-фиолетово-красный' },
        { hex: '#FF7F50', en: 'Coral', ru: 'Коралловый' },
        { hex: '#F08080', en: 'Light Coral', ru: 'Светло-коралловый' },
        { hex: '#FA8072', en: 'Salmon', ru: 'Лососевый' },
        { hex: '#E9967A', en: 'Dark Salmon', ru: 'Темно-лососевый' },
        { hex: '#FFA07A', en: 'Light Salmon', ru: 'Светло-лососевый' },

        // --- ПАСТЕЛЬНЫЕ И ЗЕМЛЯНЫЕ ---

        // Коричневые и Бежевые (Brown/Beige)
        { hex: '#8B4513', en: 'Brown', ru: 'Коричневый' },
        { hex: '#A52A2A', en: 'Auburn', ru: 'Каштановый' },
        { hex: '#7B3F00', en: 'Chocolate', ru: 'Шоколадный' },
        { hex: '#6F4E37', en: 'Coffee', ru: 'Кофейный' },
        { hex: '#704214', en: 'Sepia', ru: 'Сепия' },
        { hex: '#800020', en: 'Burgundy', ru: 'Бургундский' },
        { hex: '#B87333', en: 'Copper', ru: 'Медный' },
        { hex: '#CD7F32', en: 'Bronze', ru: 'Бронзовый' },
        { hex: '#D2691E', en: 'Cinnamon', ru: 'Коричный' },
        { hex: '#A0522D', en: 'Sienna', ru: 'Сиена' },
        { hex: '#DEB887', en: 'Burlywood', ru: 'Светло-коричневый' },
        { hex: '#D2B48C', en: 'Tan', ru: 'Смуглый' },
        { hex: '#F4A460', en: 'Sandy Brown', ru: 'Песочный' },
        { hex: '#FFDAB9', en: 'Peach Puff', ru: 'Персиковый (светлый)' },
        { hex: '#FFE5B4', en: 'Peach', ru: 'Персиковый' },
        { hex: '#F5DEB3', en: 'Wheat', ru: 'Пшеничный' },
        { hex: '#FFDEAD', en: 'Navajo White', ru: 'Светло-персиковый' },
        { hex: '#FFE4C4', en: 'Bisque', ru: 'Бисквитный' },
        { hex: '#FFE4B5', en: 'Moccasin', ru: 'Мокасиновый' },
        { hex: '#F5F5DC', en: 'Beige', ru: 'Бежевый' },
        { hex: '#FFF8DC', en: 'Cornsilk', ru: 'Шелковый' },
        { hex: '#FFFFF0', en: 'Ivory', ru: 'Слоновая кость' },
        { hex: '#FFFDD0', en: 'Cream', ru: 'Кремовый' },
        { hex: '#FAEBD7', en: 'Antique White', ru: 'Античный белый' },

        // --- АХРОМАТИЧЕСКИЕ (В САМОМ НИЗУ) ---
        { hex: '#FFFFFF', en: 'White', ru: 'Белый' },
        { hex: '#F0F8FF', en: 'Alice Blue', ru: 'Льдисто-белый' },
        { hex: '#F5F5F5', en: 'White Smoke', ru: 'Дымчато-белый' },
        { hex: '#DCDCDC', en: 'Gainsboro', ru: 'Светло-серый' },
        { hex: '#C0C0C0', en: 'Silver', ru: 'Серебряный' },
        { hex: '#A9A9A9', en: 'Ash', ru: 'Пепельный' },
        { hex: '#808080', en: 'Gray', ru: 'Серый' },
        { hex: '#696969', en: 'Dim Gray', ru: 'Тускло-серый' },
        { hex: '#4B4B4B', en: 'Graphite', ru: 'Графитовый' },
        { hex: '#2F4F4F', en: 'Dark Slate Gray', ru: 'Аспидно-серый' },
        { hex: '#000000', en: 'Black', ru: 'Черный' }
    ],




    hexToRgb: function(hex) {
        let r = 0, g = 0, b = 0;
        hex = hex.replace('#', '');
        if (hex.length === 3) {
            r = parseInt(hex[0] + hex[0], 16);
            g = parseInt(hex[1] + hex[1], 16);
            b = parseInt(hex[2] + hex[2], 16);
        } else if (hex.length === 6) {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        }
        return { r, g, b };
    },

    getName: function(targetHex, lang) {
        const targetRGB = this.hexToRgb(targetHex);
        let closestColor = this.colors[0];
        let minDistance = Infinity;

        for (let color of this.colors) {
            const rgb = this.hexToRgb(color.hex);
            const distance = Math.sqrt(
                Math.pow(targetRGB.r - rgb.r, 2) +
                Math.pow(targetRGB.g - rgb.g, 2) +
                Math.pow(targetRGB.b - rgb.b, 2)
            );

            if (distance < minDistance) {
                minDistance = distance;
                closestColor = color;
            }
        }
        return closestColor[lang] || closestColor.en;
    }
};
