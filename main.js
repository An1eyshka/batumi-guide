// import { REPOSITORY } from './content.js'; // Больше не нужно, берем с сервера

/**
 * Класс App (Приложение)
 * Теперь получает данные с Python-сервера (FastAPI)
 */
class App {
    constructor() {
        this.data = null; // Данные загрузятся позже
        this.apiUrl = "http://127.0.0.1:8000/api/public/batumi-guide"; // URL нашего API

        // Начальное состояние (State) приложения
        this.state = {
            lang: this.getInitialLang(), // Какой язык выбрать?
            theme: this.getInitialTheme() // Какую тему выбрать?
        };

        // Запускаем инициализацию
        this.init();
    }

    // Определяем начальный язык
    getInitialLang() {
        // 1. Проверяем адресную строку (если есть ?lang=ru)
        const params = new URLSearchParams(window.location.search);
        if (params.has('lang')) return params.get('lang') === 'ru' ? 'ru' : 'en';

        // 2. Проверяем сохраненные настройки в браузере (LocalStorage)
        const stored = localStorage.getItem("lang");
        if (stored) return stored;

        // 3. Проверяем язык самого браузера пользователя
        const browser = navigator.language || navigator.userLanguage;
        return browser.startsWith('ru') ? 'ru' : 'en';
    }

    // Определяем начальную тему
    getInitialTheme() {
        // 1. Проверяем сохраненные настройки
        const stored = localStorage.getItem("theme");
        if (stored) return stored;

        // 2. Проверяем системные настройки (Dark Mode в Windows/macOS/iOS)
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Метод инициализации
    async init() {
        this.applyTheme(this.state.theme); // Применяем тему сразу, чтобы не моргало

        // Показываем прелоадер (если бы он был), пока грузим данные
        try {
            await this.fetchData();
            this.render(); // Рисуем контент, когда данные пришли
            this.bindEvents(); // Подключаем кнопки
        } catch (error) {
            console.error("Ошибка загрузки данных:", error);
            document.getElementById('render-target').innerHTML = `<p style="text-align:center; padding: 2rem; color: red;">Failed to load properties. Is the server running?</p>`;
        }
    }

    // Загрузка данных с сервера
    async fetchData() {
        const response = await fetch(this.apiUrl);
        if (!response.ok) throw new Error("API Network response was not ok");
        this.data = await response.json();

        // Если пришлел contact_url владельца, можем его обновить в футере
        if (this.data.contact_url) {
            const footerLink = document.querySelector('.footer-link');
            if (footerLink) footerLink.href = this.data.contact_url;
        }
    }

    // Подключение обработчиков событий (кликов)
    bindEvents() {
        // Кнопка смены темы
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                // Меняем тему на противоположную
                this.state.theme = this.state.theme === 'dark' ? 'light' : 'dark';
                this.applyTheme(this.state.theme);
                localStorage.setItem('theme', this.state.theme); // Запоминаем выбор
            });
        }

        // Кнопка смены языка
        const langBtn = document.getElementById('lang-toggle');
        if (langBtn) {
            langBtn.addEventListener('click', () => {
                // Меняем язык на противоположный
                this.setLanguage(this.state.lang === 'en' ? 'ru' : 'en');
            });
        }

        // Обработка изменения размера окна
        // Нужно, чтобы пересчитать высоту карточек, если экран изменился
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.recalculateHeights(), 200);
        });

        // КЛИК-ТРЕКИНГ: Делегирование событий на весь документ
        // Ловим клики по кнопкам с классом .place-map-btn
        document.body.addEventListener('click', (e) => {
            const btn = e.target.closest('.place-map-btn');
            if (btn) {
                const cardId = btn.getAttribute('data-id');
                const action = btn.getAttribute('data-action');
                if (cardId && action) {
                    this.trackClick(cardId, action);
                }
            }
        });
    }

    // Отправка события клика на сервер
    trackClick(cardId, actionType) {
        // Используем sendBeacon для надежности (чтобы запрос ушел, даже если страница закроется/перейдет)
        // Или fetch с keepalive
        const url = "http://127.0.0.1:8000/api/events/action_click";
        const payload = {
            card_id: cardId,
            action_type: actionType,
            lang: this.state.lang
        };

        try {
            fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                keepalive: true
            }).catch(err => console.error("Track click error:", err));
        } catch (e) {
            console.error("Track click exception:", e);
        }
    }

    // Установка языка
    setLanguage(lang) {
        this.state.lang = lang;
        localStorage.setItem('lang', lang); // Запоминаем выбор
        document.documentElement.setAttribute('lang', lang); // Ставим атрибут для CSS
        this.render(); // Перерисовываем весь контент на новом языке

        // Ждем чуть-чуть, пока браузер отрисует текст, и пересчитываем высоту карточек
        setTimeout(() => this.recalculateHeights(), 50);
    }

    // Применение темы (Dark/Light)
    applyTheme(theme) {
        // Ставим атрибут data-theme на <html>, чтобы CSS знал, какую тему показывать
        document.documentElement.setAttribute("data-theme", theme);
        const btn = document.getElementById("theme-toggle");
        if (btn) btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    }

    // Функция перевода (t - translate) для простых фраз
    t(key) {
        return this.data.translations[this.state.lang][key] || key;
    }

    // Функция локализации (loc) для объектов {en: "...", ru: "..."}
    loc(obj) {
        if (!obj) return "";
        return obj[this.state.lang] || obj['en'] || "";
    }

    // Главный метод отрисовки (Render)
    render() {
        this.updateStaticText(); // Обновляем статический текст (футер и т.д.)
        this.updateButtons(); // Обновляем текст на кнопках

        const mainContainer = document.getElementById('render-target');
        if (mainContainer) {
            this.renderIndex(mainContainer); // Рисуем главную страницу
        }
    }

    // Обновление статических текстов (с атрибутом data-i18n)
    updateStaticText() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = this.t(key);
        });
    }

    // Обновление состояния кнопок (RU/EN)
    updateButtons() {
        const langBtn = document.getElementById("lang-toggle");
        if (langBtn) {
            const span = langBtn.querySelector("span");
            if (span) span.textContent = this.state.lang === 'ru' ? 'RU' : 'EN';
            langBtn.setAttribute("aria-label", this.t('switch_lang'));
        }
    }

    // Создание HTML для одной карточки места
    createCardHTML(item) {
        const title = this.loc(item.title);
        const type = this.loc(item.type);
        const tags = this.loc(item.tags);
        const desc = this.loc(item.desc);

        // Определяем тип действия (button text и action_type)
        const isService = item.kind === 'service';
        const btnText = isService ? this.t('contacts') : this.t('open_map');
        const actionType = isService ? 'contacts' : 'open_on_map';

        // Логика обработки картинок (строка или объект {dark, light})
        let darkImage = null;
        let lightImage = null;
        let hasImageClass = '';

        if (item.image) {
            if (typeof item.image === 'string') {
                // Если передана просто строка — это картинка для темной темы
                darkImage = item.image;
                hasImageClass = 'has-bg-image has-dark-only';
            } else {
                // Если передан объект — берем картинки для обеих тем
                darkImage = item.image.dark;
                lightImage = item.image.light;
                hasImageClass = 'has-bg-image';
                if (lightImage) hasImageClass += ' has-light-bg';
            }
        }

        const imageHTML = item.image
            ? `
                <div class="card-bg-layer">
                    ${darkImage ? `<img src="${darkImage}" alt="" class="bg-dark" loading="lazy">` : ''}
                    ${lightImage ? `<img src="${lightImage}" alt="" class="bg-light" loading="lazy">` : ''}
                    <div class="card-overlay"></div>
                </div>
              `
            : '';

        // Возвращаем HTML-код карточки
        // ДОБАВЛЕНО: data-id и data-action для трекинга
        return `
            <div class="swiper-slide">
                <article class="place-card ${hasImageClass}">
                    ${imageHTML}
                    <div class="place-content">
                        <div class="place-header">
                            <h3 class="place-title">${title}</h3>
                            <span class="place-type">${type}</span>
                        </div>
                        <p class="place-tags">${tags}</p>
                        <p class="place-desc">${desc}</p>
                        <div class="place-meta">
                            <a class="place-map-btn" href="${item.url}" target="_blank" rel="noopener noreferrer"
                               data-id="${item.id}" data-action="${actionType}">
                               ${btnText}
                            </a>
                        </div>
                    </div>
                </article>
            </div>
        `;
    }

    // Отрисовка главной страницы (слайдеров)
    renderIndex(container) {
        container.innerHTML = ''; // Очищаем контейнер перед отрисовкой
        const slidersToInit = []; // Список слайдеров, которые нужно запустить

        // Проходимся по всем блокам данных (Где поесть, В городе и т.д.)
        this.data.blocks.forEach(block => {
            const section = document.createElement('section');
            section.className = 'category-section';
            section.id = block.key; // id="eat", id="city" и т.д.

            const title = this.loc(block.title);
            const subtitle = this.loc(block.subtitle);
            // Создаем HTML для всех карточек в этом блоке
            const slidesHTML = block.items.map(item => this.createCardHTML(item)).join('');

            // Вставляем HTML секции
            section.innerHTML = `
                <div class="inner">
                    <header class="major">
                        <h2 class="category-title">${title}</h2>
                        <p class="category-description">${subtitle}</p>
                    </header>
                    <div class="swiper ${block.key}-slider">
                        <div class="swiper-wrapper">
                            ${slidesHTML}
                        </div>
                        <div class="swiper-pagination"></div>
                    </div>
                </div>
            `;
            container.appendChild(section);
            slidersToInit.push({ key: block.key, section });
        });

        // Инициализация Swiper (слайдеров)
        if (typeof Swiper !== 'undefined') {
            slidersToInit.forEach(({ key, section }) => {
                this.equalizeHeights(section); // Сначала выравниваем высоту

                new Swiper(`.${key}-slider`, {
                    loop: true, // Бесконечная прокрутка
                    slidesPerView: 1, // Показывать по 1 слайду
                    spaceBetween: 16, // Отступ между слайдами
                    // autoHeight: true, // ОТКЛЮЧЕНО, так как мы фиксируем высоту сами
                    pagination: { el: section.querySelector('.swiper-pagination'), clickable: true }
                });
            });
        }

        // Повторная проверка высоты после загрузки шрифтов
        setTimeout(() => this.recalculateHeights(), 200);
    }

    // Пересчет высоты для всех секций
    recalculateHeights() {
        document.querySelectorAll('.category-section').forEach(section => this.equalizeHeights(section));
    }

    // Выравнивание высоты карточек
    // Находит самую высокую карточку и подгоняет остальные под неё
    equalizeHeights(container) {
        const cards = container.querySelectorAll('.place-card');
        if (!cards.length) return;

        // 1. Сбрасываем высоту
        cards.forEach(c => c.style.height = 'auto');

        // 2. Измеряем максимальную высоту
        let max = 0;
        cards.forEach(c => {
            const h = c.offsetHeight;
            if (h > max) max = h;
        });

        // 3. Применяем максимальную высоту ко всем карточкам
        if (max > 0) {
            cards.forEach(c => c.style.height = `${max}px`);
        }
    }
}

// Запуск приложения, когда HTML полностью загрузился
document.addEventListener("DOMContentLoaded", () => {
    window.app = new App();
});
