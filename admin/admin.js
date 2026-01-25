// API Base URL
const API_URL = "http://127.0.0.1:8000/api";

const TRANSLATIONS = {
    ru: {
        login_subtitle: "Вход в панель",
        login_owner_id: "ID Владельца",
        login_password: "Пароль",
        login_btn: "Войти",
        nav_content: "Контент",
        nav_analytics: "Аналитика",
        nav_open_site: "Открыть сайт",
        nav_logout: "Выйти",
        page_title_content: "Управление контентом",
        page_title_stats: "Аналитика",
        auto_translate_hint: "✨ Авто-перевод при сохранении",
        save_btn: "Сохранить",
        save_btn_saving: "⏳ Сохранение...",
        loading: "Загрузка контента...",
        no_blocks: "Нет блоков. Требуется сидинг.",
        block_title_placeholder: "Заголовок блока",
        block_subtitle_placeholder: "Подзаголовок",
        btn_add_card: "+ Добавить",
        card_untitled: "Без названия",
        card_cat_placeholder: "Категория",
        modal_edit_title: "Редактировать карточку",
        modal_sect_general: "Основная информация",
        label_title_ru: "Название (RU)",
        label_title_en: "Name (EN)",
        label_cat_ru: "Категория (RU)",
        label_cat_en: "Category (EN)",
        modal_sect_action: "Действие и Ссылка",
        label_kind: "Тип",
        opt_venue: "📍 Заведение (Карта)",
        opt_service: "📞 Сервис (Контакты)",
        label_action_url: "Ссылка (Action URL)",
        modal_sect_desc: "Описание",
        label_desc_ru: "Описание (RU)",
        label_desc_en: "Description (EN)",
        modal_sect_visuals: "Изображения",
        label_img_dark: "Темная / Основная",
        label_img_light: "Светлая тема",
        btn_upload: "Загрузить",
        btn_cancel: "Отмена",
        btn_save_modal: "Сохранить",
        msg_saved: "Успешно сохранено!",
        msg_max_cards: "Максимум 5 карточек!",
        msg_card_added: "Карточка добавлена. Сохраните изменения!",
        msg_card_deleted: "Карточка удалена. Сохраните изменения.",
        new_card_title_ru: "Новое место",
        new_card_title_en: "New Place",
        new_card_type_ru: "Категория",
        new_card_type_en: "Category",
        modal_info_title: "Как работает авто-перевод",
        modal_info_desc_1: "Заполняйте описание и другие текстовые поля только на русском языке.",
        modal_info_desc_2: "Поля на английском языке можно оставить пустыми.",
        modal_info_desc_3: "При нажатии кнопки «Сохранить» система автоматически переведёт русский текст и заполнит недостающие поля на английском языке.",
        modal_info_desc_4: "Если английские поля уже заполнены вручную, автоматический перевод не выполняется.",
        btn_ok: "Понятно"
    },
    en: {
        login_subtitle: "Panel Access",
        login_owner_id: "Owner ID",
        login_password: "Password",
        login_btn: "Sign In",
        nav_content: "Content",
        nav_analytics: "Analytics",
        nav_open_site: "Open Website",
        nav_logout: "Logout",
        page_title_content: "Content Manager",
        page_title_stats: "Analytics",
        auto_translate_hint: "✨ Auto-translate on Save",
        save_btn: "Save Changes",
        save_btn_saving: "⏳ Saving...",
        loading: "Loading content...",
        no_blocks: "No blocks defined. Need seeding.",
        block_title_placeholder: "Block Title",
        block_subtitle_placeholder: "Subtitle",
        btn_add_card: "+ Add Card",
        card_untitled: "Untitled",
        card_cat_placeholder: "Category",
        modal_edit_title: "Edit Card",
        modal_sect_general: "General Info",
        label_title_ru: "Title (RU)",
        label_title_en: "Title (EN)",
        label_cat_ru: "Category (RU)",
        label_cat_en: "Category (EN)",
        modal_sect_action: "Action & Link",
        label_kind: "Kind",
        opt_venue: "📍 Venue (Map)",
        opt_service: "📞 Service (Contact)",
        label_action_url: "Action URL",
        modal_sect_desc: "Description",
        label_desc_ru: "Description (RU)",
        label_desc_en: "Description (EN)",
        modal_sect_visuals: "Visuals",
        label_img_dark: "Dark / Default",
        label_img_light: "Light Theme",
        btn_upload: "Upload Image",
        btn_cancel: "Cancel",
        btn_save_modal: "Save Changes",
        msg_saved: "Saved successfully!",
        msg_max_cards: "Max 5 cards per block limit reached!",
        msg_card_added: "New card added locally. Remember to Save!",
        msg_card_deleted: "Card deleted locally. Save to apply.",
        new_card_title_ru: "Новое место",
        new_card_title_en: "New Place",
        new_card_type_ru: "Категория",
        new_card_type_en: "Category",
        modal_info_title: "How Auto-Translate Works",
        modal_info_desc_1: "Fill in descriptions and other text fields in Russian only.",
        modal_info_desc_2: "You can leave the English fields empty.",
        modal_info_desc_3: "When you click “Save”, the system will automatically translate the Russian text and fill in the missing English fields.",
        modal_info_desc_4: "If the English fields are already filled manually, automatic translation will not be applied.",
        btn_ok: "Got it"
    }
};

class AdminApp {
    // ... existing constructor & init ...

    // ... existing showInfoModal and closeInfoModal methods if any ...

    showInfoModal() {
        document.getElementById('info-modal').classList.remove('hidden');
    }

    closeInfoModal() {
        document.getElementById('info-modal').classList.add('hidden');
    }

    // ... rest of the class ...
    constructor() {
        this.token = localStorage.getItem("access_token");
        this.ownerId = localStorage.getItem("owner_id");
        this.cards = [];
        this.blocks = [];
        this.uiLang = 'ru';

        this.views = {
            login: document.getElementById("login-view"),
            dashboard: document.getElementById("dashboard-view")
        };

        this.init();
    }

    init() {
        if (this.token) {
            this.showDashboard();
        } else {
            this.showLogin();
        }

        this.bindEvents();
        this.updateInterfaceLanguage();
    }

    bindEvents() {
        const loginForm = document.getElementById("login-form");
        if (loginForm) {
            loginForm.addEventListener("submit", (e) => this.handleLogin(e));
        }

        const logoutBtn = document.getElementById("logout-btn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => this.logout());
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const errorMsg = document.getElementById("login-error");
        errorMsg.textContent = "";

        const formData = new FormData(e.target);
        const slug = formData.get("slug");
        const password = formData.get("password");

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: slug, password })
            });

            if (!response.ok) {
                const data = await response.json();
                let msg = data.detail || "Ошибка входа";
                if (typeof msg === 'object') {
                    msg = JSON.stringify(msg);
                }
                throw new Error(msg);
            }

            const data = await response.json();
            this.token = data.access_token;
            this.ownerId = data.owner_id;

            localStorage.setItem("access_token", this.token);
            if (data.owner_id) localStorage.setItem("owner_id", data.owner_id);

            this.showDashboard();

        } catch (err) {
            console.error(err);
            errorMsg.textContent = err.message;
        }
    }

    logout() {
        this.token = null;
        this.ownerId = null;
        localStorage.removeItem("access_token");
        localStorage.removeItem("owner_id");
        this.showLogin();
    }

    showLogin() {
        this.views.login.classList.remove("hidden");
        this.views.dashboard.classList.add("hidden");
    }

    showDashboard() {
        this.views.login.classList.add("hidden");
        this.views.dashboard.classList.remove("hidden");

        if (!this.ownerId) {
            this.ownerId = localStorage.getItem("owner_id");
        }

        if (this.ownerId) {
            this.fetchData();
        } else {
            console.error("Owner ID missing. Please logout and login again.");
        }

        this.setupTabs();
        this.updateLangToggleUI();
    }

    setupTabs() {
        const tabs = document.querySelectorAll('.nav-item[data-tab]');

        tabs.forEach(btn => {
            btn.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('hidden'));
                btn.classList.add('active');

                const startId = btn.getAttribute('data-tab');
                const pane = document.getElementById(`tab-${startId}`);
                if (pane) pane.classList.remove('hidden');

                const pageTitle = document.getElementById('page-title');
                if (pageTitle) {
                    if (startId === 'content') pageTitle.textContent = TRANSLATIONS[this.uiLang].page_title_content;
                    if (startId === 'stats') pageTitle.textContent = TRANSLATIONS[this.uiLang].page_title_stats;
                    pageTitle.setAttribute('data-i18n', startId === 'content' ? 'page_title_content' : 'page_title_stats');
                }

                if (startId === 'stats') {
                    window.adminApp.fetchStats();
                }
            });
        });
    }

    setLang(lang) {
        this.uiLang = lang;
        this.updateLangToggleUI();
        this.updateInterfaceLanguage();
        this.renderContent();

        const activeTab = document.querySelector('.nav-item.active');
        if (activeTab) {
            const tabId = activeTab.getAttribute('data-tab');
            const pageTitle = document.getElementById('page-title');
            if (pageTitle) {
                if (tabId === 'content') pageTitle.textContent = TRANSLATIONS[this.uiLang].page_title_content;
                if (tabId === 'stats') pageTitle.textContent = TRANSLATIONS[this.uiLang].page_title_stats;
            }
        }
    }

    updateInterfaceLanguage() {
        const t = TRANSLATIONS[this.uiLang];
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) {
                el.textContent = t[key];
            }
        });
    }

    updateLangToggleUI() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.textContent.toLowerCase() === this.uiLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }


    // --- Stats ---

    async fetchStats(period = 'all') {
        const container = document.getElementById('tab-stats');

        try {
            const response = await fetch(`${API_URL}/admin/owners/${this.ownerId}/stats?period=${period}`, {
                headers: { "Authorization": `Bearer ${this.token}` }
            });

            if (!response.ok) throw new Error("Failed to fetch stats");
            const data = await response.json();

            this.renderStats(data, period);
        } catch (err) {
            console.error(err);
            const t = TRANSLATIONS[this.uiLang];
            container.innerHTML = `<h2>${t.page_title_stats}</h2><p style="color:red">Error: ${err.message}</p>`;
        }
    }

    renderStats(data, currentPeriod) {
        const container = document.getElementById('tab-stats');
        const t = TRANSLATIONS[this.uiLang];

        const rows = data.top_cards.map((item, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${item.title_ru || item.title_en || t.card_untitled}</td>
                <td>${item.click_count}</td>
            </tr>
        `).join('');

        const opts = {
            'all': this.uiLang === 'ru' ? 'За все время' : 'All Time',
            '30d': this.uiLang === 'ru' ? 'За 30 дней' : '30 Days',
            '7d': this.uiLang === 'ru' ? 'За 7 дней' : '7 Days'
        };
        const btnExport = this.uiLang === 'ru' ? 'Скачать CSV' : 'Export CSV';
        const labelTotal = this.uiLang === 'ru' ? 'Всего кликов' : 'Total Clicks';
        const labelTop = this.uiLang === 'ru' ? 'Топ популярных мест' : 'Top Places';
        const thName = this.uiLang === 'ru' ? 'Название' : 'Name';
        const thClicks = this.uiLang === 'ru' ? 'Клики' : 'Clicks';
        const noData = this.uiLang === 'ru' ? 'Нет данных за этот период' : 'No data for this period';

        container.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                <h2>${t.page_title_stats}</h2>
                <div style="display:flex; gap:10px;">
                    <select id="stats-period" onchange="adminApp.fetchStats(this.value)" style="padding:0.5rem; border-radius:6px; border:1px solid #e2e8f0">
                        <option value="all" ${currentPeriod === 'all' ? 'selected' : ''}>${opts['all']}</option>
                        <option value="30d" ${currentPeriod === '30d' ? 'selected' : ''}>${opts['30d']}</option>
                        <option value="7d" ${currentPeriod === '7d' ? 'selected' : ''}>${opts['7d']}</option>
                    </select>
                    <button class="btn-secondary" onclick="window.open('${API_URL}/admin/owners/${this.ownerId}/stats/export', '_blank')">${btnExport}</button>
                </div>
            </div>

            <div class="stats-summary" style="margin-bottom:2rem; display:flex; gap:1.5rem;">
                <div class="stat-box" style="background:white; padding:1.5rem; border-radius:12px; border:1px solid var(--border-color); width:200px; box-shadow:var(--shadow-sm);">
                    <h3 style="margin:0 0 0.5rem 0; font-size:0.9rem; color:var(--text-secondary);">${labelTotal}</h3>
                    <p style="font-size:2rem; font-weight:700; margin:0; color:var(--primary);">${data.total_clicks}</p>
                </div>
            </div>
            
            <h3>${labelTop}</h3>
            <table class="stats-table" style="width:100%; border-collapse:collapse; background:white; border-radius:12px; overflow:hidden;">
                <thead style="background:#F8FAFC;">
                    <tr>
                        <th style="text-align:left; padding:1rem;">#</th>
                        <th style="text-align:left; padding:1rem;">${thName}</th>
                        <th style="text-align:left; padding:1rem;">${thClicks}</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows.length ? rows : `<tr><td colspan="3" style="padding:1rem;">${noData}</td></tr>`}
                </tbody>
            </table>
        `;
    }

    // --- Content Management ---

    async fetchData() {
        const container = document.getElementById('blocks-container');
        const t = TRANSLATIONS[this.uiLang];
        if (container) container.innerHTML = `<p style="color:var(--text-secondary);">${t.loading}</p>`;

        try {
            const headers = { "Authorization": `Bearer ${this.token}` };

            const [cardsRes, blocksRes] = await Promise.all([
                fetch(`${API_URL}/admin/owners/${this.ownerId}/cards`, { headers }),
                fetch(`${API_URL}/admin/owners/${this.ownerId}/blocks`, { headers })
            ]);

            if (!cardsRes.ok || !blocksRes.ok) throw new Error("Failed to fetch data");

            this.cards = await cardsRes.json();
            this.blocks = await blocksRes.json();

            // Initialize dirty tracking
            this.cards.forEach(c => c._dirty = new Set());
            this.blocks.forEach(b => b._dirty = new Set());

            this.renderContent();

        } catch (err) {
            console.error(err);
            if (container) container.innerHTML = `<p style="color:red">Data loading error: ${err.message}</p>`;
        }
    }

    renderContent() {
        const container = document.getElementById('blocks-container');
        if (!container) return;

        const t = TRANSLATIONS[this.uiLang];

        container.innerHTML = '';

        const cardsByBlock = {};
        this.cards.forEach(card => {
            if (!cardsByBlock[card.block_key]) cardsByBlock[card.block_key] = [];
            cardsByBlock[card.block_key].push(card);
        });

        if (this.blocks.length === 0) {
            container.innerHTML = `<div style="text-align:center; padding:2rem; color:#6B7280;">${t.no_blocks}</div>`;
        }
        // Render based on Blocks list (preserving order)
        this.blocks.sort((a, b) => a.sort_order - b.sort_order).forEach((block, index) => {
            const blockCard = document.createElement('div');
            blockCard.className = 'block-card';
            blockCard.setAttribute('draggable', 'true');
            blockCard.setAttribute('data-index', index);

            // DnD Events
            blockCard.addEventListener('dragstart', (e) => this.dragBlockStart(e, index));
            blockCard.addEventListener('dragover', (e) => this.dragBlockOver(e));
            blockCard.addEventListener('drop', (e) => this.dropBlock(e, index));
            blockCard.addEventListener('dragend', (e) => this.dragBlockEnd(e));

            const cards = cardsByBlock[block.key] || [];
            const isFull = cards.length >= 5;

            // Render Cards (Show relevant language)
            let cardsHTML = cards.map(card => {
                const imgStyle = card.img_dark_path ? `background-image: url('../${card.img_dark_path}')` : '';
                const imgClass = card.img_dark_path ? 'card-img' : 'card-img empty';
                const imgContent = card.img_dark_path ? '' : '📷';

                // Choose text based on Global Lang Toggle
                const title = this.uiLang === 'ru' ? (card.title_ru || card.title_en) : (card.title_en || card.title_ru);
                const subtitle = this.uiLang === 'ru' ? (card.type_ru || card.type_en) : (card.type_en || card.type_ru);
                const titlePlaceholder = t.card_untitled;

                return `
                <div class="content-card">
                    <div class="${imgClass}" style="${imgStyle}">${imgContent}</div>
                    <div class="card-body">
                        <h4 class="card-title" title="${title}">${title || titlePlaceholder}</h4>
                        <p class="card-subtitle">${subtitle || t.card_cat_placeholder}</p>
                        <div class="card-footer">
                            <button class="btn-icon" onclick="adminApp.editCard('${card.id || ''}')" title="Edit">✏️</button>
                            ${card.id ?
                        `<button class="btn-icon delete" onclick="adminApp.deleteCard('${card.id}')" title="Delete">🗑️</button>` :
                        `<button class="btn-icon delete" onclick="adminApp.deleteNewCard(${this.cards.indexOf(card)})" title="Delete">🗑️</button>`
                    }
                        </div>
                    </div>
                </div>
                `;
            }).join('');

            // Block Header with Clean Inputs based on Language
            const titleValue = this.uiLang === 'ru' ? (block.title_ru || '') : (block.title_en || '');
            const subValue = this.uiLang === 'ru' ? (block.subtitle_ru || '') : (block.subtitle_en || '');
            const titleField = this.uiLang === 'ru' ? 'title_ru' : 'title_en';
            const subField = this.uiLang === 'ru' ? 'subtitle_ru' : 'subtitle_en';
            const titlePlaceholder = t.block_title_placeholder;
            const subPlaceholder = t.block_subtitle_placeholder;

            blockCard.innerHTML = `
                <div class="block-header" style="cursor: grab;">
                    <div class="block-titles-inputs">
                        <div style="display:flex; align-items:center; gap:8px;">
                            <span style="font-size:1.2rem; color:var(--text-secondary); opacity:0.5;">☰</span>
                            <input type="text" class="input-invisible input-lg" value="${titleValue}" placeholder="${titlePlaceholder}" onchange="adminApp.updateBlockLocal('${block.key}', '${titleField}', this.value)">
                        </div>
                        <input type="text" class="input-invisible input-sm" value="${subValue}" style="margin-left: 28px;" placeholder="${subPlaceholder}" onchange="adminApp.updateBlockLocal('${block.key}', '${subField}', this.value)">
                    </div>
                     <div class="block-controls">
                        <span class="count-badge ${isFull ? 'max' : ''}">
                            ${cards.length} / 5
                        </span>
                        <button class="btn-primary" style="font-size:0.85rem; padding: 0.4rem 0.8rem;" onclick="adminApp.addCard('${block.key}')" ${isFull ? 'disabled style="opacity:0.5; cursor:not-allowed; background:#9CA3AF;"' : ''}>
                            ${t.btn_add_card}
                        </button>
                    </div>
                </div>
                
                <div class="cards-grid">
                    ${cardsHTML}
                </div>
            `;
            container.appendChild(blockCard);
        });
    }

    // --- Drag & Drop Logic ---
    dragBlockStart(e, index) {
        this.dragSourceIndex = index;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        // e.dataTransfer.setData('text/html', e.target.innerHTML); // Required for Firefox sometimes
    }

    dragBlockOver(e) {
        if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    dropBlock(e, targetIndex) {
        e.stopPropagation(); // stops the browser from redirecting.

        if (this.dragSourceIndex !== targetIndex) {
            const movedItem = this.blocks[this.dragSourceIndex];

            // Remove from old pos
            this.blocks.splice(this.dragSourceIndex, 1);
            // Insert at new pos
            this.blocks.splice(targetIndex, 0, movedItem);

            // Update sort_order for ALL blocks to match new array order
            this.blocks.forEach((block, idx) => {
                block.sort_order = idx;

                // Mark as dirty if order changed? 
                // Technically saveAllChanges sends the array logic. 
                // But we should ensure dirty set exists if we tracked per-field.
                // For sort_order, simpler is just trusting the save payload which maps current array order.
            });

            this.renderContent();
            this.showToast("Block order updated", "info");
        }
        return false;
    }

    dragBlockEnd(e) {
        e.target.classList.remove('dragging');
        document.querySelectorAll('.block-card').forEach(card => card.classList.remove('dragging'));
    }

    addCard(blockKey) {
        const count = this.cards.filter(c => c.block_key === blockKey).length;
        const t = TRANSLATIONS[this.uiLang];

        if (count >= 5) {
            this.showToast(t.msg_max_cards, 'error');
            return;
        }

        const newCard = {
            id: null,
            block_key: blockKey,
            kind: 'venue',
            title_ru: t.new_card_title_ru,
            title_en: t.new_card_title_en,
            type_ru: t.new_card_type_ru,
            type_en: t.new_card_type_en,
            desc_ru: '',
            desc_en: '',
            action_url: '',
            img_dark_path: null,
            img_light_path: null,
            sort_order: 999,
            _dirty: new Set() // Track changes
        };

        this.cards.push(newCard);
        this.renderContent();
        this.showToast(t.msg_card_added, 'info');
    }

    deleteCard(id) {
        const t = TRANSLATIONS[this.uiLang];
        this.cards = this.cards.filter(c => c.id !== id);
        this.renderContent();
        this.showToast(t.msg_card_deleted, 'info');
    }

    deleteNewCard(index) {
        this.cards.splice(index, 1);
        this.renderContent();
    }

    showToast(message, type = 'success') {
        let toast = document.getElementById('toast-notification');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast-notification';
            document.body.appendChild(toast);
        }

        toast.className = `toast toast-${type} show`;
        toast.textContent = message;

        setTimeout(() => {
            toast.className = toast.className.replace('show', '');
        }, 3000);
    }

    updateBlockLocal(key, field, value) {
        const blk = this.blocks.find(b => b.key === key);
        if (blk) {
            if (blk[field] !== value) {
                blk[field] = value;
                if (!blk._dirty) blk._dirty = new Set();
                blk._dirty.add(field);
            }
        }
    }

    editCard(id) {
        const card = this.cards.find(c => c.id === id);
        if (!card) return;

        const form = document.getElementById('edit-form');
        form.id.value = card.id;
        form.title_ru.value = card.title_ru || "";
        form.title_en.value = card.title_en || "";
        form.type_ru.value = card.type_ru || "";
        form.type_en.value = card.type_en || "";
        form.action_url.value = card.action_url || "";
        form.desc_ru.value = card.desc_ru || "";
        form.desc_en.value = card.desc_en || "";
        form.img_dark_path.value = card.img_dark_path || "";
        form.img_light_path.value = card.img_light_path || "";
        form.kind.value = card.kind || "venue";

        document.getElementById('preview-dark').style.backgroundImage = card.img_dark_path ? `url('../${card.img_dark_path}')` : 'none';
        document.getElementById('preview-light').style.backgroundImage = card.img_light_path ? `url('../${card.img_light_path}')` : 'none';

        document.getElementById('edit-modal').classList.remove('hidden');
    }

    closeModal() {
        document.getElementById('edit-modal').classList.add('hidden');
    }

    applyEdit() {
        const form = document.getElementById('edit-form');
        const id = form.id.value;
        const cardIndex = this.cards.findIndex(c => c.id === id);

        if (cardIndex === -1) return;

        const currentCard = this.cards[cardIndex];
        const updatedFields = {
            title_ru: form.title_ru.value,
            title_en: form.title_en.value,
            type_ru: form.type_ru.value,
            type_en: form.type_en.value,
            action_url: form.action_url.value,
            desc_ru: form.desc_ru.value,
            desc_en: form.desc_en.value,
            img_dark_path: form.img_dark_path.value,
            img_light_path: form.img_light_path.value,
            kind: form.kind.value
        };

        // Track dirty fields
        if (!currentCard._dirty) currentCard._dirty = new Set();

        for (const [key, val] of Object.entries(updatedFields)) {
            if (currentCard[key] !== val) {
                currentCard._dirty.add(key);
                currentCard[key] = val; // Apply the change
            }
        }

        this.renderContent();
        this.closeModal();
    }

    async uploadImage(input, type) {
        const file = input.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const parent = input.parentElement;
            parent.style.opacity = "0.5";
            parent.textContent = "Uploading...";

            const response = await fetch(`${API_URL}/admin/upload`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${this.token}` },
                body: formData
            });

            if (!response.ok) throw new Error("Upload failed");

            const data = await response.json();
            const filePath = data.url;

            const form = document.getElementById('edit-form');
            if (type === 'dark') form.img_dark_path.value = filePath;
            else form.img_light_path.value = filePath;

            const previewId = type === 'dark' ? 'preview-dark' : 'preview-light';
            document.getElementById(previewId).style.backgroundImage = `url('../${filePath}')`;

            parent.style.opacity = "1";
            parent.innerHTML = `Replace Image <input type="file" class="file-input" onchange="adminApp.uploadImage(this, '${type}')">`;


        } catch (err) {
            console.error(err);
            alert("Upload Error");
            input.parentElement.style.opacity = "1";
            input.parentElement.innerHTML = `Try Again <input type="file" class="file-input" onchange="adminApp.uploadImage(this, '${type}')">`;
        }
    }

    async saveAllChanges() {
        const btn = document.getElementById('save-all-btn');
        const originalText = btn.innerHTML; // Note: originalText might contain the icon span, so we need to restore carefully or use translation

        await this.autoTranslateCards();

        const t = TRANSLATIONS[this.uiLang];
        btn.innerHTML = `<span>⏳</span> ${t.save_btn_saving}`;
        btn.disabled = true;

        try {
            // 1. Save Cards
            const cardsToSend = this.cards.map(c => ({
                block_key: c.block_key,
                sort_order: c.sort_order,
                is_active: c.is_active,
                kind: c.kind,
                action_url: c.action_url,
                title_ru: c.title_ru,
                title_en: c.title_en,
                type_ru: c.type_ru,
                type_en: c.type_en,
                desc_ru: c.desc_ru,
                desc_en: c.desc_en,
                img_dark_path: c.img_dark_path,
                img_light_path: c.img_light_path
            }));

            // 2. Blocks Payload
            const blocksToSend = this.blocks.map(b => ({
                key: b.key,
                sort_order: b.sort_order,
                title_ru: b.title_ru,
                title_en: b.title_en,
                subtitle_ru: b.subtitle_ru,
                subtitle_en: b.subtitle_en
            }));

            // 3. Cards Payload (fix ID)
            const cardsPayload = this.cards.map(c => ({
                ...c,
                id: c.id
            }));

            const headers = {
                "Authorization": `Bearer ${this.token}`,
                "Content-Type": "application/json"
            };

            await Promise.all([
                fetch(`${API_URL}/admin/owners/${this.ownerId}/cards`, { method: "PUT", headers, body: JSON.stringify(cardsPayload) }),
                fetch(`${API_URL}/admin/owners/${this.ownerId}/blocks`, { method: "PUT", headers, body: JSON.stringify(blocksToSend) })
            ]);

            // Clear dirty flags on success
            this.cards.forEach(c => c._dirty = new Set());
            this.blocks.forEach(b => b._dirty = new Set());

            this.showToast(t.msg_saved, "success");

            // Reload to get fresh IDs
            setTimeout(() => this.fetchData(), 1000);

        } catch (err) {
            console.error(err);
            this.showToast("Save Error: " + err.message, "error");
        } finally {
            // Restore button text using translation
            const t = TRANSLATIONS[this.uiLang];
            btn.innerHTML = `<span>💾</span> <span data-i18n="save_btn">${t.save_btn}</span>`;
            btn.disabled = false;
        }
    }

    async autoTranslateCards() {
        let tasks = [];

        // Helper: Is dirty?
        const isDirty = (obj, field) => obj._dirty && obj._dirty.has(field);

        // 1. Blocks
        this.blocks.forEach(block => {
            // Smart RU -> EN: RU is dirty AND EN is NOT dirty (or vice versa is not pending)
            // If both dirty -> manual override -> skip
            // If RU dirty, EN clean -> update EN
            if (isDirty(block, 'title_ru') && !isDirty(block, 'title_en')) {
                tasks.push(this.translateField(block.title_ru, 'en').then(res => block.title_en = res));
            } else if (isDirty(block, 'title_en') && !isDirty(block, 'title_ru')) {
                // Smart EN -> RU
                tasks.push(this.translateField(block.title_en, 'ru').then(res => block.title_ru = res));
            }

            if (isDirty(block, 'subtitle_ru') && !isDirty(block, 'subtitle_en')) {
                tasks.push(this.translateField(block.subtitle_ru, 'en').then(res => block.subtitle_en = res));
            } else if (isDirty(block, 'subtitle_en') && !isDirty(block, 'subtitle_ru')) {
                tasks.push(this.translateField(block.subtitle_en, 'ru').then(res => block.subtitle_ru = res));
            }

            // Fallback for empty fields (legacy/imported data without dirty flags)
            // Only if NOT dirty at all (fresh load), we can still auto-fill empty ones? 
            // The user said: "regardless of whether empty or not". 
            // The dirty flag covers "modified". What if I just loaded and one is empty?
            // If I loaded it, dirty is empty. If I don't touch it, it won't translate. 
            // This is safer. User must touch to trigger translation.
        });

        // 2. Cards
        this.cards.forEach(card => {
            // Title
            if (isDirty(card, 'title_ru') && !isDirty(card, 'title_en')) {
                tasks.push(this.translateField(card.title_ru, 'en').then(res => card.title_en = res));
            } else if (isDirty(card, 'title_en') && !isDirty(card, 'title_ru')) {
                tasks.push(this.translateField(card.title_en, 'ru').then(res => card.title_ru = res));
            }

            // Category
            if (isDirty(card, 'type_ru') && !isDirty(card, 'type_en')) {
                tasks.push(this.translateField(card.type_ru, 'en').then(res => card.type_en = res));
            } else if (isDirty(card, 'type_en') && !isDirty(card, 'type_ru')) {
                tasks.push(this.translateField(card.type_en, 'ru').then(res => card.type_ru = res));
            }

            // Description
            if (isDirty(card, 'desc_ru') && !isDirty(card, 'desc_en')) {
                tasks.push(this.translateField(card.desc_ru, 'en').then(res => card.desc_en = res));
            } else if (isDirty(card, 'desc_en') && !isDirty(card, 'desc_ru')) {
                tasks.push(this.translateField(card.desc_en, 'ru').then(res => card.desc_ru = res));
            }
        });

        if (tasks.length > 0) {
            this.showToast(`Auto-translating ${tasks.length} fields...`, "info");
            await Promise.all(tasks);
            this.showToast("Translation complete!", "success");
            this.renderContent();
        }
    }

    async translateField(text, targetLang) {
        if (!text) return "";
        try {
            const response = await fetch(`${API_URL}/admin/translate`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${this.token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ text: text, target_lang: targetLang })
            });
            const data = await response.json();
            return data.translated_text;
        } catch (err) {
            console.error("Translate error", err);
            return text; // Fallback
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    window.adminApp = new AdminApp();
});
