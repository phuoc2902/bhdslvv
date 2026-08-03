function _str(s) {
    try { return decodeURIComponent(escape(atob(s.split("").reverse().join("")))); } catch(e) { return ""; }
}

const _cfg = "==QfikzV1gkSFZ0V5oVLHJiOiQWS05WZtVmc1NXYl1mIsICN5EzYzUjZidzMmlDM0UjZ0gTZllTM6IWZ3pTN4ATMyUDNxETOxUjOxIiOiQWSwBXYiwiI1gDMxITN0ETM5ETNiojIklkclRmblN1Zul2ZhN3cl1mIsICcwFmLldWYy9GdzV2chJWZylmZuYndsRGaiJiOiQXZrNWdCV2ZhJ3b0NnIsIid2xGZoJmI6ICZJR3Ylp2byBnIsICcwFmLlNXYiFGdhRWZzFmYlJXam5SM0NXYlhGd192ctEWazFmLiRGdy1CdsVXYmVGZtYndsRGai9yL6MHc0RHaiojIMJVVlNXYiFGdhRmIsISbvNmLwBXYlNXYiVmcpZmL2ZHbkhmYiojIulWYt9GRoRXdhJCLikFaLpWdzVjMsFjVs5kRxE2XX1Wa1AXWIlHa5ZVRX1yaCl3UhpXSBJiOikXZLlGchJye";
const firebaseConfig = JSON.parse(_str(_cfg));

let database = null;
try {
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        database = firebase.database();
    }
} catch (e) {}

let activeTab = 'catalog';
let activeCatalogFilter = 'all';
let orders = {};
let discordQueue = [];
let isProcessingDiscordQueue = false;

// ── Category management ──────────────────────────────────────
const DEFAULT_CATEGORIES = [
    { id: 'combo',   label: 'Combo Tiết Kiệm' }
];
let categories = [...DEFAULT_CATEGORIES];

function loadCategories() {
    const render = () => renderCatalogFilterBar();
    if (database) {
        database.ref('categories').once('value', snapshot => {
            const data = snapshot.val();
            if (data && Array.isArray(data) && data.length > 0) {
                categories = data;
            } else {
                categories = [...DEFAULT_CATEGORIES];
                database.ref('categories').set(categories);
            }
            render();
        }, () => { categories = [...DEFAULT_CATEGORIES]; render(); });
    } else {
        try {
            const saved = localStorage.getItem('bhds_categories');
            categories = saved ? JSON.parse(saved) : [...DEFAULT_CATEGORIES];
        } catch(e) { categories = [...DEFAULT_CATEGORIES]; }
        render();
    }
}

function saveCategories() {
    localStorage.setItem('bhds_categories', JSON.stringify(categories));
    if (database) database.ref('categories').set(categories);
}

function renderCatalogFilterBar() {
    const bar = document.getElementById('catalog-filter-bar');
    if (!bar) return;
    bar.innerHTML = `
        <button type="button" class="catalog-filter-chip ${activeCatalogFilter === 'all' ? 'active' : ''}" data-filter="all" onclick="setCatalogFilter('all')">Tất cả thực đơn</button>
        ${categories.map(cat => `
            <span class="catalog-chip-group">
                <button type="button" class="catalog-filter-chip ${activeCatalogFilter === cat.id ? 'active' : ''}" data-filter="${cat.id}" onclick="setCatalogFilter('${cat.id}')">${cat.label}</button>
                <button type="button" class="btn-edit-category" onclick="editCategoryLabel('${cat.id}')" title="Đổi tên danh mục">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="12" height="12" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
            </span>
        `).join('')}
    `;
}

function editCategoryLabel(id) {
    const cat = categories.find(c => c.id === id);
    if (!cat) return;
    const newLabel = prompt(`Đổi tên danh mục "${cat.label}" thành:`, cat.label);
    if (!newLabel || newLabel.trim() === '' || newLabel.trim() === cat.label) return;
    cat.label = newLabel.trim();
    saveCategories();
    renderCatalogFilterBar();
    renderFoodList();
    showPopup('Cập nhật thành công!', `Danh mục đã được đổi tên thành "${cat.label}".`, true);
}
// ─────────────────────────────────────────────────────────────

const _sysUrl = _str("==wc2kWZMxUWBdkbxY2Q0g3M1JDVW5WL4MmMkZkMNdjQWhVO48mM1QzNCRXN3N2TwN0byY3SR1ibit2aRxWcoNTMMd0T09iMwYjM2MTMwgzN0EDN2MzMyUTMvM3av9GaiV2dvkGch9SbvNmLkJ3bjNXak9yL6MHc0RHa");

if (sessionStorage.getItem('bhds_is_admin') !== 'true') {
    const pin = prompt("Vui lòng nhập mã PIN quản trị để truy cập:");
    if (pin === "2902" || pin === "1234") {
        sessionStorage.setItem('bhds_is_admin', 'true');
        sessionStorage.setItem('bhds_admin_pin', pin);
    } else {
        alert("Mã PIN không chính xác hoặc bạn đã hủy!");
        window.location.href = "trangchu.html";
    }
}

const DEFAULT_FOOD_CATALOG = [
    {
        id: 1,
        name: "Bắp Rang (Ngọt / Caramel / Phô mai)",
        description: "Bắp rang BHD Star giòn rụm, thơm ngon nóng hổi. Phụ thu 9K nếu chọn vị Phô mai hoặc Caramel.",
        price: 62000,
        image: "./assets/bap.png",
        category: "popcorn",
        hidden: false,
        hiddenOptions: []
    },
    {
        id: 5,
        name: "Single Combo",
        description: "Combo 1 người gồm: 1 bắp rang ngọt lớn + 1 ly nước ngọt lạnh (Pepsi/7Up/Mirinda/Lipton).",
        price: 88000,
        image: "./assets/singlecombo.png",
        category: "combo",
        hidden: false,
        hiddenOptions: []
    },
    {
        id: 6,
        name: "Couple Combo",
        description: "Combo cặp đôi gồm: 1 bắp rang ngọt lớn + 2 ly nước ngọt lạnh mát lành.",
        price: 121000,
        image: "./assets/couplecombo.png",
        category: "combo",
        hidden: false,
        hiddenOptions: []
    },
    {
        id: 8,
        name: "Refresh Combo",
        description: "Combo thanh mát gồm: 1 bắp rang ngọt lớn + 1 chai nước suối Aquafina đóng chai.",
        price: 78000,
        image: "./assets/prefreshcb.png",
        category: "combo",
        hidden: false,
        hiddenOptions: []
    },
    {
        id: 9,
        name: "Nước Ngọt Ly (Pepsi/7Up/Mirinda/Lipton)",
        description: "Ly nước ngọt lớn mát lạnh sảng khoái đánh tan cơn khát.",
        price: 38000,
        image: "./assets/nuocngotly.png",
        category: "drink",
        hidden: false,
        hiddenOptions: []
    },
    {
        id: 10,
        name: "Aquafina (Chai)",
        description: "Nước suối tinh khiết đóng chai Aquafina mát lạnh tiện lợi.",
        price: 28000,
        image: "./assets/aquafina.png",
        category: "drink",
        hidden: false,
        hiddenOptions: []
    },
    {
        id: 11,
        name: "Nước Đóng Chai Đồng Giá 39K (Twister / Ô Long / Sting / Pepsi lon)",
        description: "Lựa chọn các dòng Twister, Trà Ô Long TEA+ mát lạnh, nước tăng lực Sting dâu hoặc Pepsi lon.",
        price: 39000,
        image: "./assets/nuocngotlon.png",
        category: "drink",
        hidden: false,
        hiddenOptions: []
    },
    {
        id: 15,
        name: "Strawberry Mojito",
        description: "Sự kết hợp hoàn hảo giữa soda ga nhẹ, dâu tây ngọt thơm và lá bạc hà tươi mát.",
        price: 48000,
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80",
        category: "drink",
        hidden: false,
        hiddenOptions: []
    },
    {
        id: 16,
        name: "Blue Ocean Mojito",
        description: "Mojito đại dương xanh hương vị trái cây nhiệt đới tươi mát mang đậm không khí biển khơi.",
        price: 48000,
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80",
        category: "drink",
        hidden: false,
        hiddenOptions: []
    },
    {
        id: 20,
        name: "Combo Food",
        description: "Combo đặc biệt gồm: 1 bắp rang lớn + 1 ly nước ngọt lạnh + 1 thức ăn nóng tuỳ chọn.",
        price: 121000,
        category: "combo",
        image: "./assets/combofood.png",
        hidden: false,
        hiddenOptions: []
    }
];

let foodCatalog = [];
let isEditing = false;

function formatCurrency(number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
}

function loadCatalog() {
    if (database) {
        database.ref('foodCatalog').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                foodCatalog = data;
                localStorage.setItem('bhds_cine_catalog', JSON.stringify(foodCatalog));
            } else {
                foodCatalog = [...DEFAULT_FOOD_CATALOG];
                database.ref('foodCatalog').set(foodCatalog);
            }
            renderFoodList();
        }, (error) => {
            console.error("Lỗi dữ liệu từ Firebase, khôi phục từ localStorage:", error);
            loadLocalCatalogFallback();
        });
    } else {
        console.warn("Database không khả dụng. Tải dữ liệu từ Local Storage.");
        loadLocalCatalogFallback();
    }
}

function loadLocalCatalogFallback() {
    const savedCatalog = localStorage.getItem('bhds_cine_catalog');
    if (savedCatalog) {
        try {
            foodCatalog = JSON.parse(savedCatalog);
        } catch (e) {
            foodCatalog = [...DEFAULT_FOOD_CATALOG];
        }
    } else {
        foodCatalog = [...DEFAULT_FOOD_CATALOG];
    }
    renderFoodList();
}

function saveCatalogToStorage() {
    let adminPin = sessionStorage.getItem('bhds_admin_pin');
    if (!adminPin) {
        adminPin = prompt("Vui lòng xác nhận lại mã PIN admin để cập nhật thực đơn:");
        if (adminPin) {
            sessionStorage.setItem('bhds_admin_pin', adminPin);
        } else {
            alert("Cập nhật thất bại: Cần có mã PIN để ghi đè thực đơn.");
            return;
        }
    }

    const updates = {};
    updates['/foodCatalog'] = foodCatalog;
    updates['/auth_pin'] = adminPin;

    if (database) {
        database.ref().update(updates)
            .then(() => {
                console.log("Đã cập nhật danh sách món ăn lên Firebase thành công.");
            })
            .catch((error) => {
                console.error("Lỗi cập nhật danh sách lên Firebase:", error);
                alert("Không thể lưu lên máy chủ: Mã PIN không chính xác hoặc không có quyền ghi. Vui lòng thử lại!");
            });
    } else {
        console.warn("Chế độ offline: Chỉ lưu vào bộ nhớ trình duyệt cục bộ.");
        alert("Đang ở chế độ offline. Đã lưu thay đổi cục bộ vào trình duyệt.");
    }
    localStorage.setItem('bhds_cine_catalog', JSON.stringify(foodCatalog));
    document.getElementById('catalog-count').textContent = `${foodCatalog.length} món`;
}

function setCatalogFilter(filter) {
    activeCatalogFilter = filter;
    document.querySelectorAll('.catalog-filter-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.filter === filter);
    });
    renderFoodList();
}

function renderFoodList() {
    const container = document.getElementById('food-list-container');

    const filtered = activeCatalogFilter === 'all'
        ? foodCatalog
        : foodCatalog.filter(f => f.category === activeCatalogFilter);

    const countEl = document.getElementById('catalog-count');
    if (countEl) countEl.textContent = `${filtered.length} món`;

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-catalog-state">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p>Không có món ăn nào trong danh mục này.</p>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;">Hãy chọn danh mục khác hoặc thêm món mới!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(food => `
        <div class="food-item-row ${food.hidden ? 'item-hidden' : ''}" id="food-row-${food.id}">
            <img src="${food.image}" alt="${food.name}" class="food-item-img" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=80';">
            <div class="food-item-details">
                <div class="food-item-name">
                    ${food.name}
                    ${food.hidden ? '<span class="badge-hidden" style="background-color: var(--danger); color: white; font-size: 0.7rem; padding: 0.15rem 0.4rem; border-radius: var(--radius-sm); margin-left: 0.5rem; display: inline-block; font-weight: 700;">Đã ẩn</span>' : ''}
                </div>
                <div class="food-item-desc">${food.description}</div>
                <div class="food-item-price">${formatCurrency(food.price)}</div>
            </div>
            <div class="food-item-actions">
                <button class="btn-icon-action" style="color: var(--text-secondary);" onclick="moveFoodUp(${food.id})" title="Chuyển lên">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                    </svg>
                </button>
                <button class="btn-icon-action" style="color: var(--text-secondary);" onclick="moveFoodDown(${food.id})" title="Chuyển xuống">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                <button class="btn-icon-action btn-visibility" onclick="toggleFoodVisibility(${food.id})" title="${food.hidden ? 'Hiện món' : 'Ẩn món'}">
                    ${food.hidden ? `
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                    ` : `
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    `}
                </button>
                <button class="btn-icon-action btn-edit" onclick="initiateEdit(${food.id})" title="Chỉnh sửa món">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
                <button class="btn-icon-action btn-delete" onclick="deleteFood(${food.id})" title="Xóa món">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
}

function toggleFoodVisibility(id) {
    const food = foodCatalog.find(item => item.id === id);
    if (!food) return;
    food.hidden = !food.hidden;
    saveCatalogToStorage();
    renderFoodList();
}

function moveFoodUp(id) {
    const currentIndex = foodCatalog.findIndex(item => item.id === id);
    if (currentIndex <= 0) return;

    if (activeCatalogFilter === 'all') {
        const temp = foodCatalog[currentIndex];
        foodCatalog[currentIndex] = foodCatalog[currentIndex - 1];
        foodCatalog[currentIndex - 1] = temp;
    } else {
        let prevIndex = -1;
        for (let i = currentIndex - 1; i >= 0; i--) {
            if (foodCatalog[i].category === activeCatalogFilter) {
                prevIndex = i;
                break;
            }
        }
        if (prevIndex !== -1) {
            const temp = foodCatalog[currentIndex];
            foodCatalog[currentIndex] = foodCatalog[prevIndex];
            foodCatalog[prevIndex] = temp;
        }
    }
    saveCatalogToStorage();
    renderFoodList();
}

function moveFoodDown(id) {
    const currentIndex = foodCatalog.findIndex(item => item.id === id);
    if (currentIndex === -1 || currentIndex >= foodCatalog.length - 1) return;

    if (activeCatalogFilter === 'all') {
        const temp = foodCatalog[currentIndex];
        foodCatalog[currentIndex] = foodCatalog[currentIndex + 1];
        foodCatalog[currentIndex + 1] = temp;
    } else {
        let nextIndex = -1;
        for (let i = currentIndex + 1; i < foodCatalog.length; i++) {
            if (foodCatalog[i].category === activeCatalogFilter) {
                nextIndex = i;
                break;
            }
        }
        if (nextIndex !== -1) {
            const temp = foodCatalog[currentIndex];
            foodCatalog[currentIndex] = foodCatalog[nextIndex];
            foodCatalog[nextIndex] = temp;
        }
    }
    saveCatalogToStorage();
    renderFoodList();
}


function renderOptionsCheckboxes(food) {
    const container = document.getElementById('options-hide-checkboxes');
    const group = document.getElementById('options-hide-group');
    if (!container || !group) return;

    container.innerHTML = '';
    
    let options = [];
    if (food.id === 1 || food.id === 5 || food.id === 6 || food.id === 8 || food.id === 20) {
        // Popcorn flavors
        options.push({ type: 'Bắp', val: 'Ngọt' });
        options.push({ type: 'Bắp', val: 'Phô mai' });
        options.push({ type: 'Bắp', val: 'Caramel' });
    }
    
    if (food.id === 5 || food.id === 6 || food.id === 9 || food.id === 20) {
        // Soda cup drinks
        options.push({ type: 'Nước', val: 'Pepsi' });
        options.push({ type: 'Nước', val: '7Up' });
        options.push({ type: 'Nước', val: 'Mirinda Cam' });
        options.push({ type: 'Nước', val: 'Lipton Chanh' });
    }
    
    if (food.id === 11) {
        // Bottled drinks
        options.push({ type: 'Nước', val: 'Twister' });
        options.push({ type: 'Nước', val: 'Ô Long' });
        options.push({ type: 'Nước', val: 'Sting' });
        options.push({ type: 'Nước', val: 'Pepsi Chanh' });
        options.push({ type: 'Nước', val: 'Pepsi Không Calo' });
    }

    if (food.id === 20) {
        options.push({ type: 'Đồ ăn', val: 'Gà vòng' });
        options.push({ type: 'Đồ ăn', val: 'Xúc xích' });
        options.push({ type: 'Đồ ăn', val: 'Khoai tây chiên' });
    }

    if (options.length > 0) {
        group.style.display = 'block';
        const hiddenOptions = food.hiddenOptions || [];
        container.innerHTML = options.map(opt => {
            const isChecked = hiddenOptions.includes(opt.val) ? 'checked' : '';
            return `
                <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; cursor: pointer; color: var(--text-secondary);">
                    <input type="checkbox" name="hide-option" value="${opt.val}" ${isChecked} style="width: 16px; height: 16px; accent-color: var(--primary);">
                    Ẩn ${opt.type}: ${opt.val}
                </label>
            `;
        }).join('');
    } else {
        group.style.display = 'none';
    }
}

function initiateEdit(id) {
    const food = foodCatalog.find(item => item.id === id);
    if (!food) return;

    isEditing = true;

    document.getElementById('edit-food-id').value = food.id;
    document.getElementById('food-name').value = food.name;
    document.getElementById('food-price').value = food.price;
    document.getElementById('food-image').value = food.image;
    document.getElementById('food-desc').value = food.description;
    const catSelect = document.getElementById('food-category');
    if (catSelect && food.category) catSelect.value = food.category;
    renderOptionsCheckboxes(food);

    document.getElementById('form-panel-title').innerHTML = `
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20" stroke-width="2" style="color: var(--primary);">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Chỉnh sửa món ăn
    `;

    const btnSubmit = document.getElementById('btn-save-food');
    btnSubmit.querySelector('span').textContent = "Lưu thay đổi";

    document.getElementById('btn-cancel-edit').style.display = "block";

    document.getElementById('food-editor-form').scrollIntoView({ behavior: 'smooth' });
}

function cancelEdit() {
    isEditing = false;
    document.getElementById('food-editor-form').reset();
    document.getElementById('edit-food-id').value = "";
    document.getElementById('options-hide-group').style.display = "none";
    document.getElementById('options-hide-checkboxes').innerHTML = "";

    document.getElementById('form-panel-title').innerHTML = `
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20" stroke-width="2" style="color: var(--primary);">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Thêm món ăn mới
    `;

    const btnSubmit = document.getElementById('btn-save-food');
    btnSubmit.querySelector('span').textContent = "Thêm món ăn";

    document.getElementById('btn-cancel-edit').style.display = "none";
}

function handleFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('food-name').value.trim();
    const price = parseInt(document.getElementById('food-price').value);
    const image = document.getElementById('food-image').value.trim();
    const description = document.getElementById('food-desc').value.trim();

    if (isEditing) {
        const id = parseInt(document.getElementById('edit-food-id').value);
        const index = foodCatalog.findIndex(item => item.id === id);

        if (index !== -1) {
            const hiddenOptions = [];
            const checkedBoxes = document.querySelectorAll('input[name="hide-option"]:checked');
            checkedBoxes.forEach(box => {
                hiddenOptions.push(box.value);
            });

            const isHidden = foodCatalog[index].hidden || false;

            foodCatalog[index] = { 
                id, 
                name, 
                price, 
                image, 
                description,
                category: foodCatalog[index].category || 'all',
                hidden: isHidden,
                hiddenOptions: hiddenOptions
            };
            saveCatalogToStorage();
            renderFoodList();
            cancelEdit();
            showPopup("Thành công!", "Thông tin món ăn đã được cập nhật.", true);
        } else {
            showPopup("Lỗi!", "Không tìm thấy món ăn cần cập nhật.", false);
        }
    } else {
        const categorySelect = document.getElementById('food-category');
        const newFood = {
            id: foodCatalog.reduce((max, item) => item.id > max ? item.id : max, 0) + 1,
            name,
            price,
            image,
            description,
            category: categorySelect ? categorySelect.value : 'all',
            hidden: false,
            hiddenOptions: []
        };

        foodCatalog.push(newFood);
        saveCatalogToStorage();
        renderFoodList();
        document.getElementById('food-editor-form').reset();
        showPopup("Thành công!", "Đã thêm món ăn mới vào thực đơn.", true);
    }
}

function deleteFood(id) {
    const food = foodCatalog.find(item => item.id === id);
    if (!food) return;

    if (confirm(`Bạn có chắc chắn muốn xóa món "${food.name}" khỏi thực đơn?`)) {
        const currentEditId = document.getElementById('edit-food-id').value;
        if (currentEditId && parseInt(currentEditId) === id) {
            cancelEdit();
        }

        foodCatalog = foodCatalog.filter(item => item.id !== id);
        saveCatalogToStorage();
        renderFoodList();
        showPopup("Đã xóa!", "Món ăn đã được xóa khỏi thực đơn.", true);
    }
}

function resetToDefault() {
    if (confirm("Hành động này sẽ xóa tất cả món bạn đã thêm/sửa và khôi phục thực đơn về danh sách mặc định của BHDS Thảo Điền. Bạn vẫn muốn tiếp tục?")) {
        cancelEdit();
        foodCatalog = [...DEFAULT_FOOD_CATALOG];
        saveCatalogToStorage();
        renderFoodList();
        showPopup("Đã khôi phục!", "Thực đơn đã quay về trạng thái mặc định ban đầu.", true);
    }
}

function showPopup(title, message, isSuccess) {
    const popup = document.getElementById('popup-result');
    const popupIcon = document.getElementById('popup-icon');
    const popupTitle = document.getElementById('popup-title');
    const popupText = document.getElementById('popup-text');

    popupTitle.textContent = title;
    popupText.textContent = message;

    if (isSuccess) {
        popupIcon.className = "popup-icon-circle popup-icon-success";
        popupIcon.innerHTML = `
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        `;
    } else {
        popupIcon.className = "popup-icon-circle popup-icon-danger";
        popupIcon.innerHTML = `
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        `;
    }

    popup.classList.add('open');
}

function closePopup() {
    document.getElementById('popup-result').classList.remove('open');
}

function switchTab(tabId) {
    activeTab = tabId;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.style.display = 'none');
    
    document.getElementById(`tab-btn-${tabId}`).classList.add('active');
    document.getElementById(`tab-content-${tabId}`).style.display = 'block';
}

function initOrdersListener() {
    if (!database) return;
    database.ref('orders').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            let hasNewPending = false;
            Object.keys(data).forEach(key => {
                const order = data[key];
                if (!order.sentToDiscord && (!orders[key] || orders[key].sentToDiscord)) {
                    hasNewPending = true;
                }
            });

            orders = data;
            
            if (hasNewPending) {
                playNotificationSound();
            }

            queueUnsentOrders();
        } else {
            orders = {};
        }
        renderOrderList();
    });
}

function playNotificationSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const playBeep = (delay, freq, duration) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
            gain.gain.setValueAtTime(0.15, audioCtx.currentTime + delay);
            gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + delay + duration);
            osc.start(audioCtx.currentTime + delay);
            osc.stop(audioCtx.currentTime + delay + duration);
        };

        playBeep(0, 523.25, 0.15);
        playBeep(0.2, 659.25, 0.2);
    } catch (e) {
        console.warn("Autoplay audio blocked or not supported:", e);
    }
}

let selectedOrderId = null;
function renderOrderList() {
    const container = document.getElementById('order-list-container');
    if (!container) return;
    
    const orderList = Object.keys(orders).map(key => ({
        key: key,
        ...orders[key]
    })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (orderList.length === 0) {
        container.innerHTML = `<div class="empty-catalog-state" style="padding: 3rem 1.5rem; text-align: center; color: var(--text-secondary);">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="48" height="48" stroke-width="1.5" style="stroke: var(--text-muted); margin-bottom: 1rem;">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p>Chưa có đơn hàng nào trong ca này.</p>
        </div>`;
        return;
    }

    container.innerHTML = orderList.map(order => {
        const dateStr = new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date(order.createdAt).toLocaleDateString('vi-VN');
        const isSelected = order.key === selectedOrderId ? 'selected' : '';

        return `
            <div class="order-card ${isSelected}" onclick="selectOrder('${order.key}')">
                <div class="order-meta">
                    <div class="order-title">${order.theater} - Ghế ${order.seat}</div>
                    <div class="order-subtitle">${order.customerName} • ${dateStr}</div>
                    <div class="order-subtitle" style="font-weight: 700; color: var(--primary);">${order.totalPrice.toLocaleString('vi-VN')}đ</div>
                </div>
            </div>
        `;
    }).join('');

    if (selectedOrderId) {
        renderOrderDetails();
    }
}

function selectOrder(key) {
    selectedOrderId = key;
    renderOrderList();
    renderOrderDetails();
}

function renderOrderDetails() {
    const container = document.getElementById('order-details-container');
    if (!container) return;

    const order = orders[selectedOrderId];
    if (!order) {
        container.innerHTML = `<p style="text-align: center; color: var(--text-muted); margin: 3rem 0;">Chọn một đơn hàng để xem chi tiết.</p>`;
        return;
    }

    const dateStr = new Date(order.createdAt).toLocaleString('vi-VN');

    let itemsHtml = order.items.map(item => `
        <div class="order-item-row">
            <span>${item.name} <strong>x${item.quantity}</strong></span>
            <span>${(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
        </div>
    `).join('');

    let paymentMethodText = order.paymentMethod === 'cash' ? 'Tiền mặt' : 'QR MoMo/Chuyển khoản';
    let cashAmountHtml = order.paymentMethod === 'cash' ? `
        <div class="detail-row">
            <span class="detail-label">Khách đưa:</span>
            <span class="detail-value">${order.cashAmount.toLocaleString('vi-VN')}đ</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Thối lại:</span>
            <span class="detail-value" style="color: #22c55e;">${(order.cashAmount - order.totalPrice).toLocaleString('vi-VN')}đ</span>
        </div>
    ` : '';

    let actionsHtml = `
        <div class="order-actions-container" style="margin-top: 1rem;">
            <button class="btn-status-change btn-status-cancel" style="width: 100%;" onclick="deleteOrder('${selectedOrderId}')">Xóa đơn hàng</button>
        </div>
    `;

    container.innerHTML = `
        <div class="order-detail-view">
            <div class="detail-row">
                <span class="detail-label">Mã đơn:</span>
                <span class="detail-value">${order.id}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Khách hàng:</span>
                <span class="detail-value">${order.customerName}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Số điện thoại:</span>
                <span class="detail-value">${order.customerPhone || 'Không có'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Vị trí:</span>
                <span class="detail-value">${order.theater} - Ghế ${order.seat}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Ghi chú:</span>
                <span class="detail-value">${order.note || 'Không có'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Thời gian đặt:</span>
                <span class="detail-value">${dateStr}</span>
            </div>
            
            <div style="font-weight: 700; margin-top: 0.5rem;">Danh sách món đã đặt:</div>
            <div class="order-items-list">
                ${itemsHtml}
            </div>

            <div class="detail-row" style="border-top: 1px solid var(--border-color); padding-top: 0.75rem;">
                <span class="detail-label">Phương thức:</span>
                <span class="detail-value">${paymentMethodText}</span>
            </div>
            ${cashAmountHtml}
            <div class="detail-row" style="font-size: 1.1rem; border-top: 2px solid var(--primary); padding-top: 0.5rem;">
                <span class="detail-label" style="font-weight: 700; color: var(--text-primary);">Tổng thanh toán:</span>
                <span class="detail-value" style="font-size: 1.15rem; color: var(--primary); font-weight: 800;">${order.totalPrice.toLocaleString('vi-VN')}đ</span>
            </div>

            ${actionsHtml}
        </div>
    `;
}

function deleteOrder(key) {
    if (!database) return;
    if (confirm("Bạn có chắc chắn muốn xóa vĩnh viễn đơn hàng này?")) {
        let adminPin = prompt("Vui lòng xác nhận lại mã PIN admin để xóa đơn hàng:");
        if (adminPin !== "2902" && adminPin !== "1234") {
            showPopup("Lỗi", "Mã PIN không chính xác!", false);
            return;
        }

        database.ref(`orders/${key}`).remove().then(() => {
            if (selectedOrderId === key) {
                selectedOrderId = null;
                renderOrderDetails();
            }
            showPopup("Đã xóa", "Đơn hàng đã được xóa khỏi hệ thống.", true);
        }).catch(err => {
            showPopup("Lỗi", "Không thể xóa đơn hàng: " + err.message, false);
        });
    }
}

// ── Store Status (Open/Close Day) ─────────────────────────────────

let currentStoreStatus = 'open'; // default open
let currentBusinessDate = '';

function loadStoreStatus() {
    if (!database) return;
    database.ref('config').on('value', snapshot => {
        const config = snapshot.val() || {};
        currentStoreStatus = config.storeStatus || 'open';
        currentBusinessDate = config.currentBusinessDate || '';
        
        const badge = document.getElementById('store-status-badge');
        const btnOpen = document.getElementById('btn-open-day');
        const btnClose = document.getElementById('btn-close-day');
        
        if (badge && btnOpen && btnClose) {
            if (currentStoreStatus === 'open') {
                badge.textContent = 'Đang Mở Ca';
                badge.style.background = 'rgba(34, 197, 94, 0.15)';
                badge.style.color = '#22c55e';
                btnOpen.style.display = 'none';
                btnClose.style.display = 'inline-block';
            } else {
                badge.textContent = 'Đã Đóng Ca';
                badge.style.background = 'rgba(239, 68, 68, 0.15)';
                badge.style.color = '#ef4444';
                btnOpen.style.display = 'inline-block';
                btnClose.style.display = 'none';
            }
        }
    });
}

function openDay() {
    if (!database) return;
    if (!confirm("Xác nhận mở ca kinh doanh mới? Khách hàng sẽ có thể đặt đồ ăn trở lại.")) return;

    let adminPin = prompt("Vui lòng xác nhận lại mã PIN admin để mở ca:");
    if (adminPin !== "2902" && adminPin !== "1234") {
        showPopup("Lỗi", "Mã PIN không chính xác!", false);
        return;
    }

    const todayDateStr = new Date().toISOString().split('T')[0];
    
    const updates = {};
    updates['/config/storeStatus'] = 'open';
    updates['/config/currentBusinessDate'] = todayDateStr;
    updates['/auth_pin'] = adminPin;

    database.ref().update(updates).then(() => {
        showPopup("Đã mở ca", "Đã mở ca kinh doanh. Khách hàng có thể đặt hàng.", true);
    }).catch(err => {
        showPopup("Lỗi", "Không thể cập nhật trạng thái: " + err.message, false);
    });
}

async function closeDay() {
    if (!database) return;
    if (!confirm("Xác nhận đóng ca? Toàn bộ đơn hàng hiện tại sẽ được lưu vào doanh thu và bị xóa khỏi danh sách. Khách hàng sẽ không thể đặt đơn được nữa.")) return;

    let adminPin = prompt("Vui lòng xác nhận lại mã PIN admin để đóng ca:");
    if (adminPin !== "2902" && adminPin !== "1234") {
        showPopup("Lỗi", "Mã PIN không chính xác!", false);
        return;
    }

    if (!currentBusinessDate) {
        currentBusinessDate = new Date().toISOString().split('T')[0];
    }
    
    try {
        const snapshot = await database.ref('orders').once('value');
        const currentOrders = snapshot.val();
        
        const updates = {};
        updates['/config/storeStatus'] = 'closed';
        updates['/orders'] = null; // clear orders
        updates['/auth_pin'] = adminPin;
        
        if (currentOrders) {
            Object.keys(currentOrders).forEach(key => {
                updates[`/revenue/${currentBusinessDate}/${key}`] = currentOrders[key];
            });
        }
        
        await database.ref().update(updates);
        
        selectedOrderId = null;
        renderOrderDetails();
        showPopup("Đã đóng ca", "Toàn bộ đơn hàng đã được chuyển vào doanh thu.", true);
    } catch (err) {
        showPopup("Lỗi", "Không thể đóng ca: " + err.message, false);
    }
}

function queueUnsentOrders() {
    Object.keys(orders).forEach(key => {
        const order = orders[key];
        if (order.status === 'pending' && !order.sentToDiscord) {
            if (!discordQueue.some(item => item.key === key)) {
                discordQueue.push({
                    key: key,
                    order: order
                });
            }
        }
    });

    if (discordQueue.length > 0 && !isProcessingDiscordQueue) {
        processDiscordQueue();
    }
}

async function processDiscordQueue() {
    if (discordQueue.length === 0) {
        isProcessingDiscordQueue = false;
        return;
    }

    isProcessingDiscordQueue = true;
    const item = discordQueue[0];
    const webhookUrl = localStorage.getItem('bhds_discord_webhook') || _sysUrl;

    const payload = buildAdminOrderDiscordPayload(item.order);

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            if (database) {
                await database.ref(`orders/${item.key}`).update({
                    sentToDiscord: true
                });
            }
            discordQueue.shift();
        } else if (response.status === 429) {
            const retryAfter = 3000;
            console.warn(`Discord Rate Limit hit. Waiting ${retryAfter}ms before retry...`);
            setTimeout(processDiscordQueue, retryAfter);
            return;
        } else {
            console.error("Failed to send order to Discord:", response.statusText);
            discordQueue.shift();
        }
    } catch (e) {
        console.error("Network error sending to Discord:", e);
        discordQueue.shift();
    }

    setTimeout(processDiscordQueue, 2000);
}

function buildAdminOrderDiscordPayload(order) {
    const dateStr = new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date(order.createdAt).toLocaleDateString('vi-VN');
    const itemsListText = order.items.map(item => `- **${item.name}** x${item.quantity}`).join('\n');
    const paymentText = order.paymentMethod === 'cash' ? '💵 Tiền mặt' : '💳 Chuyển khoản / QR MoMo';
    
    return {
        username: `${currentCinemaName} - Đơn Mới`,
        avatar_url: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=120&auto=format&fit=crop&q=80",
        embeds: [
            {
                title: `🎟️ CÓ ĐƠN HÀNG MỚI!`,
                color: 2279766,
                fields: [
                    { name: "👤 Khách hàng", value: order.customerName, inline: true },
                    { name: "📞 Số điện thoại", value: order.customerPhone || "Không có", inline: true },
                    { name: "🎬 Vị trí", value: `${order.theater} - Ghế ${order.seat}`, inline: true },
                    { name: "📝 Ghi chú", value: order.note || "Không có", inline: false },
                    { name: "🍿 Món ăn đã đặt", value: itemsListText, inline: false },
                    { name: "💰 Tổng thanh toán", value: `**${order.totalPrice.toLocaleString('vi-VN')} VNĐ**`, inline: true },
                    { name: "💳 Thanh toán", value: paymentText, inline: true }
                ],
                footer: {
                    text: `Thời gian đặt đơn: ${dateStr} • Powered by BHDS`
                }
            }
        ]
    };
}

// ── Theater Management ────────────────────────────────────────

let hiddenTheaters = [];
const ALL_THEATERS = ['Rạp 1', 'Rạp 2', 'Rạp 3', 'Rạp 4', 'Rạp 5', 'Rạp 6'];

function loadTheaters() {
    if (database) {
        database.ref('hiddenTheaters').on('value', snapshot => {
            const val = snapshot.val();
            if (Array.isArray(val)) {
                hiddenTheaters = val;
            } else if (val && typeof val === 'object') {
                hiddenTheaters = Object.values(val);
            } else {
                hiddenTheaters = [];
            }
            renderTheatersList();
        }, error => {
            console.error("Lỗi lấy dữ liệu rạp từ Firebase:", error);
            renderTheatersList();
        });
    } else {
        renderTheatersList();
    }
}


function renderTheatersList() {
    const container = document.getElementById('theater-list-container');
    if (!container) return;
    
    container.innerHTML = ALL_THEATERS.map(theater => {
        const isHidden = hiddenTheaters.includes(theater);
        return `
            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1rem;">
                <div style="font-size: 1.25rem; font-weight: 700; color: ${isHidden ? 'var(--text-muted)' : 'var(--text-heading)'}; text-decoration: ${isHidden ? 'line-through' : 'none'};">
                    ${theater}
                </div>
                <div style="font-size: 0.85rem; padding: 0.25rem 0.75rem; border-radius: 20px; font-weight: 600; background: ${isHidden ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)'}; color: ${isHidden ? '#ef4444' : '#22c55e'};">
                    ${isHidden ? 'Đang Đóng' : 'Mở Cửa'}
                </div>
                <button onclick="toggleTheater('${theater}')" style="margin-top: 0.5rem; padding: 0.5rem 1rem; border-radius: 6px; border: none; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${isHidden ? '#22c55e' : '#ef4444'}; color: white; width: 100%;">
                    ${isHidden ? 'Mở rạp này' : 'Đóng rạp này'}
                </button>
            </div>
        `;
    }).join('');
}

function toggleTheater(theater) {
    if (hiddenTheaters.includes(theater)) {
        hiddenTheaters = hiddenTheaters.filter(t => t !== theater);
    } else {
        hiddenTheaters.push(theater);
    }
    
    if (database) {
        let adminPin = sessionStorage.getItem('bhds_admin_pin');
        if (!adminPin) {
            adminPin = prompt("Vui lòng xác nhận lại mã PIN admin để cập nhật trạng thái rạp:");
            if (adminPin) {
                sessionStorage.setItem('bhds_admin_pin', adminPin);
            } else {
                showPopup("Thất bại", "Cần có mã PIN để lưu thay đổi.", false);
                // Revert local state
                if (hiddenTheaters.includes(theater)) {
                    hiddenTheaters = hiddenTheaters.filter(t => t !== theater);
                } else {
                    hiddenTheaters.push(theater);
                }
                renderTheatersList();
                return;
            }
        }
        
        const updates = {};
        updates['/hiddenTheaters'] = hiddenTheaters;
        updates['/auth_pin'] = adminPin;

        database.ref().update(updates)
            .then(() => {
                showPopup("Thành công!", `Đã ${hiddenTheaters.includes(theater) ? 'đóng' : 'mở'} ${theater}.`, true);
            })
            .catch(error => {
                console.error("Error updating theater status:", error);
                // Revert local state
                if (hiddenTheaters.includes(theater)) {
                    hiddenTheaters = hiddenTheaters.filter(t => t !== theater);
                } else {
                    hiddenTheaters.push(theater);
                }
                renderTheatersList();
                showPopup("Lỗi!", "Mã PIN không đúng hoặc không thể lưu trạng thái rạp lên máy chủ.", false);
            });
    } else {
        renderTheatersList();
        showPopup("Chế độ Offline", `Đã cập nhật trạng thái tạm thời cho ${theater}.`, true);
    }
}

// ── Cinema Branding Management ──────────────────────────────────

let currentCinemaName = 'BHDS Thảo Điền';

function loadCinemaName() {
    if (database) {
        database.ref('config/cinemaName').on('value', snapshot => {
            currentCinemaName = snapshot.val() || 'BHDS Thảo Điền';
            
            const input = document.getElementById('config-cinema-name');
            if (input) input.value = currentCinemaName;
            
            const logoText = document.getElementById('admin-cinema-logo-text');
            if (logoText) logoText.textContent = currentCinemaName;
            
            const footerText = document.getElementById('admin-cinema-footer-text');
            if (footerText) footerText.textContent = currentCinemaName;
            
            document.title = `${currentCinemaName} Admin - Quản Lý Thực Đơn`;
        });
    } else {
        const logoText = document.getElementById('admin-cinema-logo-text');
        if (logoText) logoText.textContent = currentCinemaName;
        const footerText = document.getElementById('admin-cinema-footer-text');
        if (footerText) footerText.textContent = currentCinemaName;
        document.title = `${currentCinemaName} Admin - Quản Lý Thực Đơn`;
    }
}

function saveCinemaName() {
    const input = document.getElementById('config-cinema-name');
    if (!input) return;
    const newName = input.value.trim();
    if (!newName) {
        showPopup("Lỗi!", "Vui lòng nhập tên rạp.", false);
        return;
    }
    
    if (database) {
        let adminPin = prompt("Vui lòng xác nhận lại mã PIN admin để cập nhật tên rạp:");
        if (adminPin !== "2902" && adminPin !== "1234") {
            showPopup("Lỗi", "Mã PIN không chính xác!", false);
            return;
        }
        
        const updates = {};
        updates['/config/cinemaName'] = newName;
        updates['/auth_pin'] = adminPin;

        database.ref().update(updates).then(() => {
            showPopup("Thành công!", "Đã lưu tên rạp.", true);
        }).catch(e => {
            console.error("Error updating cinema name:", e);
            showPopup("Lỗi!", "Không thể lưu: " + e.message, false);
        });
    } else {
        currentCinemaName = newName;
        loadCinemaName(); // update UI locally
        showPopup("Chế độ Offline", "Đã cập nhật tên rạp tạm thời.", true);
    }
}

// ── Zalo Config Management ──────────────────────────────────────

let currentZaloLink = 'https://zalo.me/g/xclnxkmdtrh9mzvn2apl';

function loadZaloLink() {
    if (database) {
        database.ref('config/zaloLink').on('value', snapshot => {
            currentZaloLink = snapshot.val() || 'https://zalo.me/g/xclnxkmdtrh9mzvn2apl';
            const input = document.getElementById('config-zalo-link');
            if (input) input.value = currentZaloLink;
        }, error => {
            console.error("Lỗi lấy cấu hình Zalo từ Firebase:", error);
            const input = document.getElementById('config-zalo-link');
            if (input) input.value = currentZaloLink;
        });
    }
}

function saveZaloLink() {
    const input = document.getElementById('config-zalo-link');
    if (!input) return;
    const newLink = input.value.trim();
    if (!newLink) {
        showPopup("Lỗi!", "Vui lòng nhập đường dẫn Zalo.", false);
        return;
    }
    
    if (database) {
        let adminPin = prompt("Vui lòng xác nhận lại mã PIN admin để cập nhật link Zalo:");
        if (adminPin !== "2902" && adminPin !== "1234") {
            showPopup("Lỗi", "Mã PIN không chính xác!", false);
            return;
        }
        
        const updates = {};
        updates['/config/zaloLink'] = newLink;
        updates['/auth_pin'] = adminPin;

        database.ref().update(updates).then(() => {
            showPopup("Thành công!", "Đã lưu đường dẫn Zalo.", true);
        }).catch(e => {
            console.error("Error updating Zalo link:", e);
            showPopup("Lỗi!", "Không thể lưu: " + e.message, false);
        });
    } else {
        showPopup("Chế độ Offline", "Đã lưu đường dẫn Zalo (ảo).", true);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadCatalog();
    initOrdersListener();
    loadTheaters();
    loadCinemaName();
    loadZaloLink();
    loadStoreStatus();

    document.getElementById('food-editor-form').addEventListener('submit', handleFormSubmit);

    document.getElementById('btn-cancel-edit').addEventListener('click', cancelEdit);

    document.getElementById('btn-reset-default').addEventListener('click', resetToDefault);

    document.getElementById('btn-popup-close').addEventListener('click', closePopup);
    document.getElementById('popup-result').addEventListener('click', (e) => {
        if (e.target.id === 'popup-result') closePopup();
    });
});

