// API Base URL
const API_URL = "http://127.0.0.1:8000/api";

class AdminApp {
    constructor() {
        this.token = localStorage.getItem("access_token");
        this.ownerId = localStorage.getItem("owner_id");
        this.cards = [];
        this.blocks = []; // New: Local store for blocks

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
    }

    bindEvents() {
        // Логин
        const loginForm = document.getElementById("login-form");
        if (loginForm) {
            loginForm.addEventListener("submit", (e) => this.handleLogin(e));
        }

        // Логаут
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
            this.fetchData(); // Changed name to generic fetchData
        } else {
            console.error("Owner ID missing. Please logout and login again.");
        }

        this.setupTabs();
    }

    setupTabs() {
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active
                tabs.forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('hidden'));

                // Add active
                btn.classList.add('active');
                const startId = btn.getAttribute('data-tab'); // content or stats
                const pane = document.getElementById(`tab-${startId}`);
                if (pane) pane.classList.remove('hidden');

                // Fetch stats if stats tab
                if (startId === 'stats') {
                    window.adminApp.fetchStats();
                }
            });
        });
    }

    // --- Stats ---

    async fetchStats() {
        const container = document.getElementById('tab-stats');
        // Keep header, clear content
        container.innerHTML = '<h2>Статистика кликов</h2><p>Загрузка...</p>';

        try {
            const response = await fetch(`${API_URL}/admin/owners/${this.ownerId}/stats`, {
                headers: { "Authorization": `Bearer ${this.token}` }
            });

            if (!response.ok) throw new Error("Failed to fetch stats");
            const data = await response.json();

            this.renderStats(data);
        } catch (err) {
            console.error(err);
            container.innerHTML = `<h2>Статистика кликов</h2><p style="color:red">Ошибка: ${err.message}</p>`;
        }
    }

    renderStats(data) {
        const container = document.getElementById('tab-stats');

        const rows = data.top_cards.map((item, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${item.title_ru || item.title_en || 'Без названия'}</td>
                <td>${item.click_count}</td>
            </tr>
        `).join('');

        container.innerHTML = `
            <h2>Статистика кликов</h2>
            <div class="stats-summary">
                <div class="stat-box">
                    <h3>Всего кликов</h3>
                    <p class="stat-number">${data.total_clicks}</p>
                </div>
            </div>
            
            <h3>Топ популярных мест</h3>
            <table class="stats-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Название</th>
                        <th>Клики</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows.length ? rows : '<tr><td colspan="3">Нет данных</td></tr>'}
                </tbody>
            </table>
        `;
    }

    // --- Content Management ---

    async fetchData() {
        const container = document.getElementById('blocks-container');
        if (container) container.innerHTML = '<p class="loading-text">Загрузка...</p>';

        try {
            // Parallel fetch: cards and blocks
            const headers = { "Authorization": `Bearer ${this.token}` };

            const [cardsRes, blocksRes] = await Promise.all([
                fetch(`${API_URL}/admin/owners/${this.ownerId}/cards`, { headers }),
                fetch(`${API_URL}/admin/owners/${this.ownerId}/blocks`, { headers })
            ]);

            if (!cardsRes.ok || !blocksRes.ok) throw new Error("Failed to fetch data");

            this.cards = await cardsRes.json();
            this.blocks = await blocksRes.json();

            this.renderContent();

        } catch (err) {
            console.error(err);
            if (container) container.innerHTML = `<p style="color:red">Ошибка загрузки: ${err.message}</p>`;
        }
    }

    renderContent() {
        const container = document.getElementById('blocks-container');
        if (!container) return;

        container.innerHTML = '';

        // Group cards
        const cardsByBlock = {};
        this.cards.forEach(card => {
            if (!cardsByBlock[card.block_key]) cardsByBlock[card.block_key] = [];
            cardsByBlock[card.block_key].push(card);
        });

        if (this.blocks.length === 0) {
            container.innerHTML = '<p>Нет блоков. Нужно запустить сидинг базы.</p>';
            return;
        }

        // Render based on Blocks list (preserving order)
        this.blocks.sort((a, b) => a.sort_order - b.sort_order).forEach(block => {
            const blockSection = document.createElement('div');
            blockSection.className = 'block-section';

            const cards = cardsByBlock[block.key] || [];

            let cardsHTML = cards.map(card => `
                <div class="card-item">
                    <div class="image-preview-mini" style="background-image: url('../${card.img_dark_path || ''}'); height: ${card.img_dark_path ? '60px' : '0'}; margin-bottom: 0.5rem; background-size: cover; border-radius: 4px;"></div>
                    <div class="card-header">
                        <h4 class="card-title">${card.title_ru || card.title_en || "Без названия"}</h4>
                        <div class="card-actions">
                            <button class="btn-icon" onclick="adminApp.editCard('${card.id}')">✏️</button>
                        </div>
                    </div>
                    <p style="font-size:0.8rem; color:#666;">${card.type_ru || card.type_en || "Тип"}</p>
                </div>
            `).join('');

            // Block Header with Editable Title inputs (Inline for MVP simplicity)
            blockSection.innerHTML = `
                <div class="block-header-edit">
                    <div class="block-inputs">
                        <input type="text" class="input-title" value="${block.title_ru || ''}" placeholder="Заголовок (RU)" onchange="adminApp.updateBlockLocal('${block.key}', 'title_ru', this.value)">
                         <span style="font-size:0.8rem; color:#999">(${block.key})</span>
                         <!-- Could add EN title edit here too -->
                    </div>
                    <h3 class="block-count">Карточек: ${cards.length}</h3>
                </div>
                
                <div class="cards-grid">
                    ${cardsHTML}
                </div>
            `;
            container.appendChild(blockSection);
        });
    }

    updateBlockLocal(key, field, value) {
        const blk = this.blocks.find(b => b.key === key);
        if (blk) {
            blk[field] = value;
        }
    }

    // --- Edit Modal Logic ---

    editCard(id) {
        const card = this.cards.find(c => c.id === id);
        if (!card) return;

        // Заполняем форму
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

        // Превью картинок
        document.getElementById('preview-dark').style.backgroundImage = card.img_dark_path ? `url('../${card.img_dark_path}')` : 'none';
        document.getElementById('preview-light').style.backgroundImage = card.img_light_path ? `url('../${card.img_light_path}')` : 'none';

        // Открываем модалку
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

        // Обновляем локальный объект
        const updatedCard = {
            ...this.cards[cardIndex],
            title_ru: form.title_ru.value,
            title_en: form.title_en.value,
            type_ru: form.type_ru.value,
            type_en: form.type_en.value,
            action_url: form.action_url.value,
            desc_ru: form.desc_ru.value,
            desc_en: form.desc_en.value,
            img_dark_path: form.img_dark_path.value,
            img_light_path: form.img_light_path.value
        };

        this.cards[cardIndex] = updatedCard;

        // Перерисовываем список
        this.renderContent();
        this.closeModal();
    }

    // --- Image Upload ---

    async uploadImage(input, type) {
        const file = input.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            // Показываем индикатор (можно добавить спиннер)
            const parent = input.parentElement;
            parent.style.opacity = "0.5";

            const response = await fetch(`${API_URL}/admin/upload`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${this.token}` },
                body: formData
            });

            if (!response.ok) throw new Error("Upload failed");

            const data = await response.json();
            const filePath = data.url;

            // Обновляем скрытое поле
            const form = document.getElementById('edit-form');
            if (type === 'dark') form.img_dark_path.value = filePath;
            else form.img_light_path.value = filePath;

            // Обновляем превью
            const previewId = type === 'dark' ? 'preview-dark' : 'preview-light';
            document.getElementById(previewId).style.backgroundImage = `url('../${filePath}')`;

            parent.style.opacity = "1";

        } catch (err) {
            console.error(err);
            alert("Ошибка загрузки изображения");
            input.parentElement.style.opacity = "1";
        }
    }

    // --- Save All ---

    async saveAllChanges() {
        const btn = document.getElementById('save-all-btn');
        const originalText = btn.textContent;
        btn.textContent = "Сохранение...";
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

            // 2. Save Blocks
            const blocksToSend = this.blocks.map(b => ({
                key: b.key,
                sort_order: b.sort_order,
                title_ru: b.title_ru,
                title_en: b.title_en,
                subtitle_ru: b.subtitle_ru,
                subtitle_en: b.subtitle_en
            }));

            // Parallel Save
            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.token}`
            };

            const [cardsRes, blocksRes] = await Promise.all([
                fetch(`${API_URL}/admin/owners/${this.ownerId}/cards`, { method: "PUT", headers, body: JSON.stringify(cardsToSend) }),
                fetch(`${API_URL}/admin/owners/${this.ownerId}/blocks`, { method: "PUT", headers, body: JSON.stringify(blocksToSend) })
            ]);

            if (!cardsRes.ok || !blocksRes.ok) throw new Error("Failed to save changes (cards or blocks)");

            alert("Все изменения успешно сохранены!");
            this.fetchData();

        } catch (err) {
            console.error(err);
            alert(`Ошибка сохранения: ${err.message}`);
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    window.adminApp = new AdminApp();
});
