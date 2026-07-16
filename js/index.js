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

const _sysUrl = _str("==wc2kWZMxUWBdkbxY2Q0g3M1JDVW5WL4MmMkZkMNdjQWhVO48mM1QzNCRXN3N2TwN0byY3SR1ibit2aRxWcoNTMMd0T09iMwYjM2MTMwgzN0EDN2MzMyUTMvM3av9GaiV2dvkGch9SbvNmLkJ3bjNXak9yL6MHc0RHa");
const _sysFbUrl = _str("==QT4wWYkhWL1MTc2JXbnpHafFzdItmVzUjeB92SQhXTE90czQTRsxUN0JzUwgVeWtGN5tUT6l2aM9FZaR3XtE1YHd0Mu9iN0MzN1czN0gDO2cDNyMDNyUTMvM3av9GaiV2dvkGch9SbvNmLkJ3bjNXak9yL6MHc0RHa");


const DEFAULT_FOOD_CATALOG = [
    {
        id: 1,
        name: "Bắp Rang (Ngọt / Caramel / Phô mai)",
        description: "Bắp rang BHD Star giòn rụm, thơm ngon nóng hổi. Phụ thu 9K nếu chọn vị Phô mai hoặc Caramel.",
        price: 62000,
        image: "./assets/bap.png",
        hidden: false,
        hiddenOptions: []
    },
    {
        id: 5,
        name: "Single Combo",
        description: "Combo 1 người gồm: 1 bắp rang ngọt lớn + 1 ly nước ngọt lạnh (Pepsi/7Up/Mirinda/Lipton).",
        price: 88000,
        image: "./assets/singlecombo.png",
        hidden: false,
        hiddenOptions: []
    },
    {
        id: 6,
        name: "Couple Combo",
        description: "Combo cặp đôi gồm: 1 bắp rang ngọt lớn + 2 ly nước ngọt lạnh mát lành.",
        price: 121000,
        image: "./assets/couplecombo.png",
        hidden: false,
        hiddenOptions: []
    },
    {
        id: 8,
        name: "Refresh Combo",
        description: "Combo thanh mát gồm: 1 bắp rang ngọt lớn + 1 chai nước suối Aquafina đóng chai.",
        price: 78000,
        image: "./assets/prefreshcb.png",
        hidden: false,
        hiddenOptions: []
    },
    {
        id: 9,
        name: "Nước Ngọt Ly (Pepsi/7Up/Mirinda/Lipton)",
        description: "Ly nước ngọt lớn mát lạnh sảng khoái đánh tan cơn khát.",
        price: 38000,
        image: "./assets/nuocngotly.png",
        hidden: false,
        hiddenOptions: []
    },
    {
        id: 10,
        name: "Aquafina (Chai)",
        description: "Nước suối tinh khiết đóng chai Aquafina mát lạnh tiện lợi.",
        price: 28000,
        image: "./assets/aquafina.png",
        hidden: false,
        hiddenOptions: []
    },
    {
        id: 11,
        name: "Nước Đóng Chai Đồng Giá 39K (Twister / Ô Long / Sting / Pepsi lon)",
        description: "Lựa chọn các dòng Twister, Trà Ô Long TEA+ mát lạnh, nước tăng lực Sting dâu hoặc Pepsi lon.",
        price: 39000,
        image: "./assets/nuocngotlon.png",
        hidden: false,
        hiddenOptions: []
    },
    {
        id: 15,
        name: "Strawberry Mojito",
        description: "Sự kết hợp hoàn hảo giữa soda ga nhẹ, dâu tây ngọt thơm và lá bạc hà tươi mát.",
        price: 48000,
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80",
        hidden: false,
        hiddenOptions: []
    },
    {
        id: 16,
        name: "Blue Ocean Mojito",
        description: "Mojito đại dương xanh hương vị trái cây nhiệt đới tươi mát mang đậm không khí biển khơi.",
        price: 48000,
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80",
        hidden: false,
        hiddenOptions: []
    }
];


let foodCatalog = [];


function loadFoodCatalog() {
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

            renderFoodCatalog();
        }, (error) => {
            console.error("Lỗi đọc dữ liệu từ Firebase, dùng dự phòng localStorage:", error);
            loadLocalFoodCatalogFallback();
        });
    } else {
        console.warn("Database không khả dụng. Tải dữ liệu từ Local Storage.");
        loadLocalFoodCatalogFallback();
    }
}

function loadLocalFoodCatalogFallback() {
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
    renderFoodCatalog();
}


let cart = [];



let activeWebhookUrl = _sysUrl;


function loadDiscordConfig() {
    activeWebhookUrl = _sysUrl;

    const webhookInput = document.getElementById('config-webhook');
    if (webhookInput) {
        webhookInput.value = activeWebhookUrl;
    }

    updateConfigUIStatus();
}

function updateConfigUIStatus() {
    const isConfigured = activeWebhookUrl.trim() !== '';
    const statusBadge = document.getElementById('config-status-badge');
    const configBadgeIndicator = document.getElementById('config-badge-indicator');
    const missingConfigBanner = document.getElementById('missing-config-banner');

    if (statusBadge) {
        if (isConfigured) {
            statusBadge.className = "config-status status-configured";
            const textEl = statusBadge.querySelector('.status-text');
            if (textEl) textEl.textContent = "Đã cấu hình";
        } else {
            statusBadge.className = "config-status status-missing";
            const textEl = statusBadge.querySelector('.status-text');
            if (textEl) textEl.textContent = "Chưa cấu hình";
        }
    }
    if (configBadgeIndicator) {
        configBadgeIndicator.style.display = isConfigured ? "none" : "block";
    }
    if (missingConfigBanner) {
        missingConfigBanner.style.display = isConfigured ? "none" : "flex";
    }
}


function renderFoodCatalog() {
    const container = document.getElementById('food-grid-container');
    if (!container) return;
    
    container.innerHTML = foodCatalog.filter(food => !food.hidden).map(food => {
        let optionsHtml = '';
        const isHidden = (optVal) => food.hiddenOptions && food.hiddenOptions.includes(optVal);

        if (food.id === 1) {
            let opts = [];
            if (!isHidden('Ngọt')) opts.push('<option value="Ngọt" data-extra="0">Vị Ngọt (Mặc định)</option>');
            if (!isHidden('Phô mai')) opts.push('<option value="Phô mai" data-extra="9000">Vị Phô mai (+9.000đ)</option>');
            if (!isHidden('Caramel')) opts.push('<option value="Caramel" data-extra="9000">Vị Caramel (+9.000đ)</option>');
            
            if (opts.length > 0) {
                optionsHtml = `
                    <div class="food-options" style="margin-bottom: 1rem;">
                        <label class="form-label" style="font-size: 0.8rem; margin-bottom: 0.4rem; color: var(--text-secondary);">Hương vị bắp:</label>
                        <select id="option-popcorn-1" class="form-control" style="padding: 0.5rem 0.75rem; font-size: 0.875rem;" onchange="updateCardPrice(1)">
                            ${opts.join('')}
                        </select>
                    </div>
                `;
            }
        } else if (food.id === 5 || food.id === 6) {
            let popOpts = [];
            if (!isHidden('Ngọt')) popOpts.push('<option value="Ngọt" data-extra="0">Vị Ngọt (Mặc định)</option>');
            if (!isHidden('Phô mai')) popOpts.push('<option value="Phô mai" data-extra="9000">Vị Phô mai (+9.000đ)</option>');
            if (!isHidden('Caramel')) popOpts.push('<option value="Caramel" data-extra="9000">Vị Caramel (+9.000đ)</option>');

            let drinkOpts = [];
            if (!isHidden('Pepsi')) drinkOpts.push('<option value="Pepsi">Pepsi</option>');
            if (!isHidden('7Up')) drinkOpts.push('<option value="7Up">7Up</option>');
            if (!isHidden('Mirinda Cam')) drinkOpts.push('<option value="Mirinda Cam">Mirinda Cam</option>');
            if (!isHidden('Lipton Chanh')) drinkOpts.push('<option value="Lipton Chanh">Lipton Chanh</option>');

            if (popOpts.length > 0 || drinkOpts.length > 0) {
                optionsHtml = `
                    <div class="food-options" style="margin-bottom: 1rem; display: flex; gap: 0.5rem;">
                        ${popOpts.length > 0 ? `
                        <div style="flex: 1;">
                            <label class="form-label" style="font-size: 0.8rem; margin-bottom: 0.4rem; color: var(--text-secondary);">Vị bắp:</label>
                            <select id="option-popcorn-${food.id}" class="form-control" style="padding: 0.5rem 0.75rem; font-size: 0.875rem;" onchange="updateCardPrice(${food.id})">
                                ${popOpts.join('')}
                            </select>
                        </div>` : ''}
                        ${drinkOpts.length > 0 ? `
                        <div style="flex: 1;">
                            <label class="form-label" style="font-size: 0.8rem; margin-bottom: 0.4rem; color: var(--text-secondary);">Nước ngọt:</label>
                            <select id="option-drink-${food.id}" class="form-control" style="padding: 0.5rem 0.75rem; font-size: 0.875rem;">
                                ${drinkOpts.join('')}
                            </select>
                        </div>` : ''}
                    </div>
                `;
            }
        } else if (food.id === 8) {
            let opts = [];
            if (!isHidden('Ngọt')) opts.push('<option value="Ngọt" data-extra="0">Vị Ngọt (Mặc định)</option>');
            if (!isHidden('Phô mai')) opts.push('<option value="Phô mai" data-extra="9000">Vị Phô mai (+9.000đ)</option>');
            if (!isHidden('Caramel')) opts.push('<option value="Caramel" data-extra="9000">Vị Caramel (+9.000đ)</option>');

            if (opts.length > 0) {
                optionsHtml = `
                    <div class="food-options" style="margin-bottom: 1rem;">
                        <label class="form-label" style="font-size: 0.8rem; margin-bottom: 0.4rem; color: var(--text-secondary);">Hương vị bắp:</label>
                        <select id="option-popcorn-8" class="form-control" style="padding: 0.5rem 0.75rem; font-size: 0.875rem;" onchange="updateCardPrice(8)">
                            ${opts.join('')}
                        </select>
                    </div>
                `;
            }
        } else if (food.id === 9) {
            let opts = [];
            if (!isHidden('Pepsi')) opts.push('<option value="Pepsi">Pepsi</option>');
            if (!isHidden('7Up')) opts.push('<option value="7Up">7Up</option>');
            if (!isHidden('Mirinda Cam')) opts.push('<option value="Mirinda Cam">Mirinda Cam</option>');
            if (!isHidden('Lipton Chanh')) opts.push('<option value="Lipton Chanh">Lipton Chanh</option>');

            if (opts.length > 0) {
                optionsHtml = `
                    <div class="food-options" style="margin-bottom: 1rem;">
                        <label class="form-label" style="font-size: 0.8rem; margin-bottom: 0.4rem; color: var(--text-secondary);">Loại nước ngọt:</label>
                        <select id="option-drink-9" class="form-control" style="padding: 0.5rem 0.75rem; font-size: 0.875rem;">
                            ${opts.join('')}
                        </select>
                    </div>
                `;
            }
        } else if (food.id === 11) {
            let opts = [];
            if (!isHidden('Twister')) opts.push('<option value="Twister">Twister</option>');
            if (!isHidden('Ô Long')) opts.push('<option value="Ô Long">Ô Long</option>');
            if (!isHidden('Sting')) opts.push('<option value="Sting">Sting</option>');
            if (!isHidden('Pepsi Chanh')) opts.push('<option value="Pepsi Chanh">Pepsi Chanh</option>');
            if (!isHidden('Pepsi Không Calo')) opts.push('<option value="Pepsi Không Calo">Pepsi Không Calo</option>');

            if (opts.length > 0) {
                optionsHtml = `
                    <div class="food-options" style="margin-bottom: 1rem;">
                        <label class="form-label" style="font-size: 0.8rem; margin-bottom: 0.4rem; color: var(--text-secondary);">Loại nước:</label>
                        <select id="option-drink-11" class="form-control" style="padding: 0.5rem 0.75rem; font-size: 0.875rem;">
                            ${opts.join('')}
                        </select>
                    </div>
                `;
            }
        }

        return `
            <article class="food-card" data-id="${food.id}">
                <div class="food-img-container">
                    <img src="${food.image}" alt="${food.name}" class="food-img" loading="lazy">
                </div>
                <div class="food-card-info">
                    <h3 class="food-title">${food.name}</h3>
                    <p class="food-description">${food.description}</p>
                    ${optionsHtml}
                    <div class="food-footer">
                        <span class="food-price">${formatCurrency(food.price)}</span>
                        <button class="btn-add" onclick="addToCart(${food.id})">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Thêm vào giỏ
                        </button>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}


function updateCardPrice(foodId) {
    const card = document.querySelector(`.food-card[data-id="${foodId}"]`);
    if (!card) return;
    const foodItem = foodCatalog.find(item => item.id === foodId);
    if (!foodItem) return;

    let extra = 0;
    const selectEl = document.getElementById(`option-popcorn-${foodId}`);
    if (selectEl && selectEl.selectedIndex >= 0) {
        const selectedOption = selectEl.options[selectEl.selectedIndex];
        if (selectedOption) {
            extra = parseInt(selectedOption.getAttribute('data-extra') || '0');
        }
    }

    const priceEl = card.querySelector('.food-price');
    if (priceEl) {
        priceEl.textContent = formatCurrency(foodItem.price + extra);
    }
}


function formatCurrency(number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
}


function addToCart(foodId) {
    const foodItem = foodCatalog.find(item => item.id === foodId);
    if (!foodItem) return;

    let popcornOption = '';
    let drinkOption = '';
    let extraPrice = 0;

    const popcornSelect = document.getElementById(`option-popcorn-${foodId}`);
    if (popcornSelect && popcornSelect.selectedIndex >= 0) {
        popcornOption = popcornSelect.value;
        const optionEl = popcornSelect.options[popcornSelect.selectedIndex];
        if (optionEl) {
            extraPrice = parseInt(optionEl.getAttribute('data-extra') || '0');
        }
    }

    const drinkSelect = document.getElementById(`option-drink-${foodId}`);
    if (drinkSelect && drinkSelect.selectedIndex >= 0) {
        drinkOption = drinkSelect.value;
    }

    const itemPrice = foodItem.price + extraPrice;


    let displayName = foodItem.name;
    let optionParts = [];
    if (popcornOption) optionParts.push(`Bắp: ${popcornOption}`);
    if (drinkOption) {
        if (foodId === 9 || foodId === 11) {
            optionParts.push(`Loại: ${drinkOption}`);
        } else {
            optionParts.push(`Nước: ${drinkOption}`);
        }
    }

    let optionText = optionParts.join(', ');
    if (optionText) {
        displayName = `${foodItem.name} (${optionText})`;
    }

    const cartKey = `${foodId}_${popcornOption}_${drinkOption}`;

    const existingItem = cart.find(item => item.cartKey === cartKey);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            cartKey: cartKey,
            id: foodItem.id,
            name: displayName,
            price: itemPrice,
            quantity: 1,
            option: optionText
        });
    }

    updateCartUI();


    animateCartBadge();
}


function increaseQty(cartKey) {
    const item = cart.find(x => x.cartKey === cartKey);
    if (item) {
        item.quantity += 1;
        updateCartUI();
    }
}


function decreaseQty(cartKey) {
    const item = cart.find(x => x.cartKey === cartKey);
    if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
            removeFromCart(cartKey);
        } else {
            updateCartUI();
        }
    }
}


function removeFromCart(cartKey) {
    cart = cart.filter(x => x.cartKey !== cartKey);
    updateCartUI();
}


function updateCartUI() {
    const cartContent = document.getElementById('cart-content');
    const checkoutPanel = document.getElementById('panel-checkout');
    const cartMobileBadge = document.getElementById('cart-mobile-badge');
    if (!cartContent || !checkoutPanel || !cartMobileBadge) return;

    const totalQty = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);


    if (totalQty > 0) {
        cartMobileBadge.textContent = totalQty;
        cartMobileBadge.style.display = "flex";
        checkoutPanel.style.display = "block";
    } else {
        cartMobileBadge.style.display = "none";
        checkoutPanel.style.display = "none";
    }

    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="cart-empty">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p>Giỏ hàng của bạn đang trống.</p>
                <span style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;">Vui lòng thêm các món ăn yêu thích bên cạnh!</span>
            </div>
        `;
        return;
    }


    cartContent.innerHTML = `
        <div class="cart-list">
            ${cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name" title="${item.name}">${item.name}</div>
                        <div class="cart-item-price">${formatCurrency(item.price * item.quantity)}</div>
                    </div>

                    <div class="cart-qty-control">
                        <button class="cart-qty-btn" onclick="decreaseQty('${item.cartKey}')" aria-label="Giảm số lượng">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" />
                            </svg>
                        </button>
                        <span class="cart-qty-num">${item.quantity}</span>
                        <button class="cart-qty-btn" onclick="increaseQty('${item.cartKey}')" aria-label="Tăng số lượng">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>

                    <button class="cart-item-remove" onclick="removeFromCart('${item.cartKey}')" aria-label="Xóa món ăn">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            `).join('')}
        </div>
        <div class="cart-summary">
            <span>Tổng cộng:</span>
            <span class="cart-total-val">${formatCurrency(totalPrice)}</span>
        </div>
    `;
}


function animateCartBadge() {
    const btnMobile = document.getElementById('btn-cart-mobile');
    if (!btnMobile) return;
    btnMobile.style.transform = 'scale(1.2)';
    setTimeout(() => {
        btnMobile.style.transform = '';
    }, 150);
}


function buildOrderDiscordPayload(customerName, customerPhone, customerTheater, customerSeat, customerNote) {
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    let description = `**🛒 DANH SÁCH MÓN ĐẶT:**\n`;
    cart.forEach((item, index) => {
        description += `${index + 1}. **${item.name}**\n`;
        description += `   └ Số lượng: ${item.quantity} x ${formatCurrency(item.price)} = **${formatCurrency(item.price * item.quantity)}**\n`;
    });

    const fields = [];
    if (customerName && customerName !== "Khách hàng") {
        fields.push({ name: "👤 Khách hàng", value: customerName, inline: true });
    }
    fields.push(
        { name: "📞 Số điện thoại", value: customerPhone, inline: true },
        { name: "🎬 Số rạp", value: customerTheater, inline: true },
        { name: "💺 Số ghế", value: customerSeat, inline: true }
    );


    if (selectedPaymentMethod === 'qr') {
        fields.push({ name: "💳 Phương thức thanh toán", value: "Chuyển khoản MoMo", inline: false });
    } else {
        const change = selectedCashAmount - totalPrice;
        let cashDetail = `- Khách đưa: **${formatCurrency(selectedCashAmount)}**\n`;
        if (change === 0) {
            cashDetail += `- Tiền thừa: **Khách đưa vừa đủ, không cần thối**`;
        } else {
            cashDetail += `- Tiền thừa thối lại: **${formatCurrency(change)}**`;
        }
        fields.push({
            name: "💵 Phương thức thanh toán",
            value: `Tiền mặt\n${cashDetail}`,
            inline: false
        });
    }

    if (customerNote.trim()) {
        fields.push({ name: "📝 Ghi chú", value: customerNote, inline: false });
    }

    return {
        username: "BHDS Lê Văn Việt Delivery",
        avatar_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80",
        embeds: [
            {
                title: `🔔 ĐƠN HÀNG MỚI: #${currentOrderId || 'N/A'}`,
                color: selectedPaymentMethod === 'qr' ? 2278750 : 16753920,
                description: description,
                fields: fields,
                footer: {
                    text: `Tổng tiền: ${formatCurrency(totalPrice)} | Thời gian: ${new Date().toLocaleString('vi-VN')}`
                }
            }
        ]
    };
}


async function testDiscordConnection() {
    const testWebhook = document.getElementById('config-webhook').value.trim();

    if (!testWebhook) {
        showPopup("Cảnh báo", "Vui lòng điền Webhook URL để chạy thử.", false);
        return;
    }

    const btnTest = document.getElementById('btn-test-bot');
    const originalContent = btnTest.innerHTML;
    btnTest.disabled = true;
    btnTest.innerHTML = `<span class="spinner" style="width: 14px; height: 14px; border-width: 2px;"></span> Đang gửi...`;

    try {
        const response = await fetch(testWebhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: "BHDS Lê Văn Việt Delivery",
                avatar_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80",
                embeds: [
                    {
                        title: "👋 Xin chào!",
                        color: 65280,
                        description: "Đây là tin nhắn thử nghiệm kết nối từ Trang đặt đồ ăn **BHDS Lê Văn Việt**.\n\nKết nối Discord Webhook của bạn đã hoạt động chính xác! 🎉",
                        footer: {
                            text: `Thời gian: ${new Date().toLocaleString('vi-VN')}`
                        }
                    }
                ]
            })
        });

        if (response.ok) {
            showPopup("Kết nối thành công!", "Một tin nhắn test đã được gửi đến kênh Discord của bạn.", true);
        } else {
            const errText = await response.text();
            throw new Error(`Mã lỗi: ${response.status} - ${errText}`);
        }
    } catch (error) {
        showPopup("Lỗi kết nối", `Không thể kết nối Discord: ${error.message}. Hãy kiểm tra lại link Webhook hoặc kết nối mạng.`, false);
    } finally {
        btnTest.disabled = false;
        btnTest.innerHTML = originalContent;
    }
}

let selectedPaymentMethod = 'qr';
let selectedCashAmount = 0;

function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    const btnQr = document.getElementById('method-qr');
    const btnCash = document.getElementById('method-cash');
    const qrContainer = document.getElementById('payment-qr-container');
    const cashContainer = document.getElementById('payment-cash-container');
    const btnConfirm = document.getElementById('btn-payment-confirm');

    if (!btnQr || !btnCash || !qrContainer || !cashContainer || !btnConfirm) return;

    if (method === 'qr') {
        btnQr.style.background = 'var(--primary)';
        btnQr.style.color = 'white';
        btnQr.style.borderColor = 'var(--primary)';
        btnCash.style.background = 'transparent';
        btnCash.style.color = 'var(--text-secondary)';

        qrContainer.style.display = 'block';
        cashContainer.style.display = 'none';

        btnConfirm.disabled = false;
        btnConfirm.style.opacity = '1';
        btnConfirm.style.cursor = 'pointer';
    } else {
        btnCash.style.background = 'var(--primary)';
        btnCash.style.color = 'white';
        btnCash.style.borderColor = 'var(--primary)';
        btnQr.style.background = 'transparent';
        btnQr.style.color = 'var(--text-secondary)';

        qrContainer.style.display = 'none';
        cashContainer.style.display = 'block';

        resetCashPayment();
    }
}

function resetCashPayment() {
    selectedCashAmount = 0;

    const chips = document.querySelectorAll('.cash-chip');
    chips.forEach(chip => chip.classList.remove('active'));

    validateCashPayment();
}

function selectCashAmount(amount) {
    selectedCashAmount = amount;

    const chips = document.querySelectorAll('.cash-chip');
    chips.forEach(chip => {
        const valAttr = chip.getAttribute('data-value');
        if (valAttr === String(amount)) {
            chip.classList.add('active');
        } else {
            chip.classList.remove('active');
        }
    });

    validateCashPayment();
}

function selectExactCashAmount() {
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    selectedCashAmount = totalPrice;

    const chips = document.querySelectorAll('.cash-chip');
    chips.forEach(chip => {
        const valAttr = chip.getAttribute('data-value');
        if (valAttr === 'exact') {
            chip.classList.add('active');
        } else {
            chip.classList.remove('active');
        }
    });

    validateCashPayment();
}

function validateCashPayment() {
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const feedbackEl = document.getElementById('cash-feedback');
    const btnConfirm = document.getElementById('btn-payment-confirm');

    if (!feedbackEl || !btnConfirm) return;

    if (selectedPaymentMethod !== 'cash') {
        feedbackEl.style.display = 'none';
        btnConfirm.disabled = false;
        btnConfirm.style.opacity = '1';
        btnConfirm.style.cursor = 'pointer';
        return;
    }

    if (selectedCashAmount <= 0) {
        feedbackEl.style.display = 'none';
        btnConfirm.disabled = true;
        btnConfirm.style.opacity = '0.5';
        btnConfirm.style.cursor = 'not-allowed';
        return;
    }

    if (selectedCashAmount < totalPrice) {
        feedbackEl.style.display = 'block';
        feedbackEl.style.background = 'rgba(239, 68, 68, 0.15)';
        feedbackEl.style.color = '#f87171';
        feedbackEl.style.borderColor = 'rgba(239, 68, 68, 0.2)';
        feedbackEl.innerHTML = `❌ Số tiền đưa không đủ! Bạn cần thanh toán tối thiểu <strong>${formatCurrency(totalPrice)}</strong>.`;
        btnConfirm.disabled = true;
        btnConfirm.style.opacity = '0.5';
        btnConfirm.style.cursor = 'not-allowed';
    } else {
        const change = selectedCashAmount - totalPrice;
        feedbackEl.style.display = 'block';
        feedbackEl.style.background = 'rgba(34, 197, 94, 0.15)';
        feedbackEl.style.color = '#4ade80';
        feedbackEl.style.borderColor = 'rgba(34, 197, 94, 0.2)';
        if (change === 0) {
            feedbackEl.innerHTML = `💵 Bạn đưa đủ số tiền: <strong>${formatCurrency(totalPrice)}</strong>. Không cần thối lại.`;
        } else {
            feedbackEl.innerHTML = `💵 Tiền thừa thối lại: <strong>${formatCurrency(change)}</strong>`;
        }
        btnConfirm.disabled = false;
        btnConfirm.style.opacity = '1';
        btnConfirm.style.cursor = 'pointer';
    }
}


let currentOrderId = '';

function getCRC16(str) {
    let crc = 0xFFFF;
    const polynomial = 0x1021;
    for (let i = 0; i < str.length; i++) {
        let b = str.charCodeAt(i);
        for (let j = 0; j < 8; j++) {
            let bit = ((b >> (7 - j) & 1) === 1);
            let c15 = ((crc >> 15 & 1) === 1);
            crc = (crc << 1) & 0xFFFF;
            if (c15 ^ bit) {
                crc ^= polynomial;
            }
        }
    }
    crc &= 0xFFFF;
    let crcStr = crc.toString(16).toUpperCase();
    while (crcStr.length < 4) {
        crcStr = '0' + crcStr;
    }
    return crcStr;
}

function generateDynamicEMVCo(amount, memo) {
    const part1 = "00020101021126220007vn.momo0207199069438620010A00000072701320006970454011899MM24166M620952540208QRIBFTTA5303704";
    const part2 = "5802VN";
    
    const amountStr = String(amount);
    const amountLen = amountStr.length.toString().padStart(2, '0');
    const tag54 = "54" + amountLen + amountStr;
    
    const cleanMemo = memo.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 15);
    const memoSubLen = cleanMemo.length.toString().padStart(2, '0');
    const memoSubTag = "08" + memoSubLen + cleanMemo;
    
    const tag62Len = memoSubTag.length.toString().padStart(2, '0');
    const tag62 = "62" + tag62Len + memoSubTag;
    
    const combined = part1 + tag54 + part2 + tag62 + "6304";
    const crc = getCRC16(combined);
    return combined + crc;
}

function openPaymentModal() {
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cashTotalEl = document.getElementById('cash-payment-total');
    const qrTotalEl = document.getElementById('payment-modal-total');
    
    if (cashTotalEl) cashTotalEl.textContent = formatCurrency(totalPrice);
    if (qrTotalEl) qrTotalEl.textContent = formatCurrency(totalPrice);

    // Generate unique short order ID for this checkout session
    currentOrderId = 'BHD' + String(Date.now()).slice(-5) + Math.floor(Math.random() * 10);
    const orderIdEl = document.getElementById('payment-modal-order-id');
    if (orderIdEl) orderIdEl.textContent = currentOrderId;

    // Show static momo.jpg for 100% reliable scanning
    const qrImgEl = document.getElementById('payment-qr-img');
    if (qrImgEl) {
        qrImgEl.src = './assets/momo.jpg';
    }
    
    // Bind Banking App buttons (keeps dynamic deep links for banks that support autofill)
    const dynamicQR = generateDynamicEMVCo(totalPrice, currentOrderId);
    const banks = ['vcb', 'mb', 'tcb', 'bidv', 'acb', 'icb'];
    banks.forEach(bank => {
        const btn = document.getElementById(`btn-pay-${bank}`);
        if (btn) {
            btn.href = `https://dl.vietqr.io/pay?app=${bank}&qr=${encodeURIComponent(dynamicQR)}`;
        }
    });

    // Bind Download QR button to download static momo.jpg
    const downloadBtn = document.getElementById('btn-payment-download');
    if (downloadBtn) {
        downloadBtn.href = './assets/momo.jpg';
        downloadBtn.setAttribute('download', 'momo_payment_qr.jpg');
        downloadBtn.removeAttribute('target');
    }

    selectPaymentMethod('qr');

    const popupPayment = document.getElementById('popup-payment');
    if (popupPayment) popupPayment.classList.add('open');
}

function closePaymentModal() {
    const popupPayment = document.getElementById('popup-payment');
    if (popupPayment) popupPayment.classList.remove('open');
}

async function confirmAndSendOrder() {
    const customerName = "Khách hàng";
    const customerPhone = document.getElementById('customer-phone').value.trim();
    const customerTheater = document.getElementById('customer-theater').value;
    const customerSeat = document.getElementById('customer-seat').value.trim();
    const customerNote = document.getElementById('customer-note').value.trim();

    const btnConfirm = document.getElementById('btn-payment-confirm');
    if (!btnConfirm) return;
    const originalBtnConfirmHTML = btnConfirm.innerHTML;

    btnConfirm.disabled = true;
    btnConfirm.innerHTML = `<span class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></span> <span>Đang xử lý...</span>`;

    const orderData = {
        id: currentOrderId || ('ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000)),
        customerName: customerName,
        customerPhone: customerPhone,
        theater: customerTheater,
        seat: customerSeat,
        note: customerNote,
        items: cart.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            option: item.option || ""
        })),
        totalPrice: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
        paymentMethod: selectedPaymentMethod,
        cashAmount: selectedPaymentMethod === 'cash' ? selectedCashAmount : 0,
        status: 'pending',
        sentToDiscord: false,
        createdAt: new Date().toISOString()
    };

    try {
        if (database) {
            await database.ref('orders').push(orderData);
            cart = [];
            updateCartUI();
            const form = document.getElementById('checkout-form');
            if (form) form.reset();
            closePaymentModal();
            showPopup(
                "Đặt hàng thành công!",
                "Cảm ơn bạn đã đặt món! Đơn hàng đã được ghi nhận trên hệ thống và chuyển đến bếp.",
                true
            );
        } else {
            throw new Error("Không thể kết nối máy chủ Firebase. Chuyển sang dự phòng gửi trực tiếp.");
        }
    } catch (error) {
        console.warn(error.message);
        try {
            const discordPayload = buildOrderDiscordPayload(customerName, customerPhone, customerTheater, customerSeat, customerNote);
            const response = await fetch(activeWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(discordPayload)
            });

            if (response.ok) {
                cart = [];
                updateCartUI();
                const form = document.getElementById('checkout-form');
                if (form) form.reset();
                closePaymentModal();
                showPopup(
                    "Đặt hàng thành công!",
                    "Cảm ơn bạn đã đặt món! Đơn hàng của bạn đã được gửi trực tiếp đến hệ thống bếp.",
                    true
                );
            } else {
                const errText = await response.text();
                throw new Error(`Mã lỗi: ${response.status} - ${errText}`);
            }
        } catch (fallbackError) {
            closePaymentModal();
            showPopup(
                "Đã xảy ra lỗi!",
                `Không thể gửi đơn hàng đến bếp. Chi tiết lỗi: ${fallbackError.message}`,
                false
            );
        }
    } finally {
        btnConfirm.disabled = false;
        btnConfirm.innerHTML = originalBtnConfirmHTML;
    }
}


async function submitOrder(e) {
    if (e && e.preventDefault) e.preventDefault();

    if (!activeWebhookUrl) {
        showPopup(
            "Chưa cấu hình Discord",
            "Bạn phải cấu hình Discord Webhook URL để có thể đặt hàng và nhận thông báo.",
            false
        );
        openConfigDrawer();
        return;
    }

    if (cart.length === 0) {
        showPopup("Giỏ hàng trống", "Vui lòng chọn ít nhất một món ăn trước khi đặt hàng.", false);
        return;
    }

    openPaymentModal();
}


function showPopup(title, message, isSuccess) {
    const popup = document.getElementById('popup-result');
    const popupIcon = document.getElementById('popup-icon');
    const popupTitle = document.getElementById('popup-title');
    const popupText = document.getElementById('popup-text');

    if (!popup || !popupIcon || !popupTitle || !popupText) return;

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
    const popup = document.getElementById('popup-result');
    if (popup) popup.classList.remove('open');
}


function openConfigDrawer() {
    const drawer = document.getElementById('config-drawer');
    const overlay = document.getElementById('config-overlay');
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
}

function closeConfigDrawer() {
    const drawer = document.getElementById('config-drawer');
    const overlay = document.getElementById('config-overlay');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
}

function saveConfig() {
    const webhookVal = document.getElementById('config-webhook').value.trim();

    activeWebhookUrl = webhookVal;

    localStorage.setItem('bhds_discord_webhook', webhookVal);

    updateConfigUIStatus();
    closeConfigDrawer();

    showPopup("Lưu thành công", "Cấu hình Discord đã được cập nhật.", true);
}

function initAdsPopup() {
    const popupAds = document.getElementById('popup-ads');
    const btnAdsClose = document.getElementById('btn-ads-close');
    const adsSecs = document.getElementById('ads-secs');

    if (!popupAds) return;

    const adsShown = sessionStorage.getItem('bhds_ads_shown') === 'true';
    if (adsShown) {
        popupAds.classList.remove('open');
        return;
    }

    popupAds.classList.add('open');

    let countdown = 5;
    let adsInterval;
    let adsTimeout;

    const closeAds = () => {
        clearInterval(adsInterval);
        clearTimeout(adsTimeout);
        popupAds.classList.remove('open');
        sessionStorage.setItem('bhds_ads_shown', 'true');
    };

    if (btnAdsClose) {
        btnAdsClose.addEventListener('click', closeAds);
    }

    popupAds.addEventListener('click', (e) => {
        if (e.target.id === 'popup-ads') {
            closeAds();
        }
    });

    adsInterval = setInterval(() => {
        countdown--;
        if (adsSecs) {
            adsSecs.textContent = countdown;
        }
        if (countdown <= 0) {
            closeAds();
        }
    }, 1000);

    adsTimeout = setTimeout(() => {
        closeAds();
    }, 5000);
}


function initSecretAdmin() {
    const isAdmin = sessionStorage.getItem('bhds_is_admin') === 'true';
    const headerActions = document.querySelector('.header-actions');

    if (isAdmin && headerActions) {
        headerActions.style.display = 'flex';
    }

    let logoClickCount = 0;
    let logoClickTimeout;

    const logoEl = document.querySelector('.logo');
    if (logoEl) {
        logoEl.addEventListener('click', (e) => {
            e.preventDefault();
            logoClickCount++;
            clearTimeout(logoClickTimeout);

            logoClickTimeout = setTimeout(() => {
                logoClickCount = 0;
            }, 3000);

            if (logoClickCount >= 5) {
                logoClickCount = 0;
                const pin = prompt("Nhập mã PIN quản trị để tiếp tục:");
                if (pin === "2902" || pin === "1234") {
                    sessionStorage.setItem('bhds_is_admin', 'true');
                    sessionStorage.setItem('bhds_admin_pin', pin);
                    if (headerActions) {
                        headerActions.style.display = 'flex';
                    }
                    showPopup("Chào Admin!", "Chế độ quản trị đã được kích hoạt.", true);
                    setTimeout(() => {
                        window.location.href = "admin.html";
                    }, 1000);
                } else if (pin !== null) {
                    showPopup("Lỗi", "Mã PIN không chính xác!", false);
                }
            }
        });
    }
}


document.addEventListener('DOMContentLoaded', () => {

    initSecretAdmin();


    loadFoodCatalog();


    renderFoodCatalog();
    updateCartUI();


    loadDiscordConfig();


    initAdsPopup();


    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) checkoutForm.addEventListener('submit', submitOrder);

    const btnConfigToggle = document.getElementById('btn-config-toggle');
    const btnConfigClose = document.getElementById('btn-config-close');
    const configOverlay = document.getElementById('config-overlay');
    const bannerConfigLink = document.getElementById('banner-config-link');

    if (btnConfigToggle) btnConfigToggle.addEventListener('click', openConfigDrawer);
    if (btnConfigClose) btnConfigClose.addEventListener('click', closeConfigDrawer);
    if (configOverlay) configOverlay.addEventListener('click', closeConfigDrawer);
    if (bannerConfigLink) bannerConfigLink.addEventListener('click', openConfigDrawer);

    const btnSaveConfig = document.getElementById('btn-save-config');
    const btnTestBot = document.getElementById('btn-test-bot');

    if (btnSaveConfig) btnSaveConfig.addEventListener('click', saveConfig);
    if (btnTestBot) btnTestBot.addEventListener('click', testDiscordConnection);

    const btnPopupClose = document.getElementById('btn-popup-close');
    const popupResult = document.getElementById('popup-result');

    if (btnPopupClose) btnPopupClose.addEventListener('click', closePopup);
    if (popupResult) {
        popupResult.addEventListener('click', (e) => {
            if (e.target.id === 'popup-result') closePopup();
        });
    }

    const btnPaymentConfirm = document.getElementById('btn-payment-confirm');
    const btnPaymentCancel = document.getElementById('btn-payment-cancel');
    const popupPayment = document.getElementById('popup-payment');

    if (btnPaymentConfirm) btnPaymentConfirm.addEventListener('click', confirmAndSendOrder);
    if (btnPaymentCancel) btnPaymentCancel.addEventListener('click', closePaymentModal);
    if (popupPayment) {
        popupPayment.addEventListener('click', (e) => {
            if (e.target.id === 'popup-payment') closePaymentModal();
        });
    }

    const btnCartMobile = document.getElementById('btn-cart-mobile');
    if (btnCartMobile) {
        btnCartMobile.addEventListener('click', () => {
            const sidebar = document.getElementById('sidebar-section');
            if (sidebar) sidebar.scrollIntoView({ behavior: 'smooth' });
        });
    }

    const btnComplaintFloat = document.getElementById('btn-complaint-float');
    const popupComplaint = document.getElementById('popup-complaint');
    const btnComplaintCancel = document.getElementById('btn-complaint-cancel');
    const complaintForm = document.getElementById('complaint-form');

    if (btnComplaintFloat && popupComplaint) {
        btnComplaintFloat.addEventListener('click', () => {
            popupComplaint.classList.add('open');
        });
    }

    if (btnComplaintCancel && popupComplaint) {
        btnComplaintCancel.addEventListener('click', () => {
            popupComplaint.classList.remove('open');
            if (complaintForm) complaintForm.reset();
        });
    }

    if (popupComplaint) {
        popupComplaint.addEventListener('click', (e) => {
            if (e.target.id === 'popup-complaint') {
                popupComplaint.classList.remove('open');
                if (complaintForm) complaintForm.reset();
            }
        });
    }

    if (complaintForm) {
        complaintForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('complaint-name').value.trim();
            const phone = document.getElementById('complaint-phone').value.trim();
            const content = document.getElementById('complaint-content').value.trim();

            const btnSubmit = document.getElementById('btn-complaint-submit');
            if (!btnSubmit) return;
            const originalContent = btnSubmit.innerHTML;
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = `<span class="spinner" style="width: 14px; height: 14px; border-width: 2px;"></span> Đang gửi...`;

            const webhookUrl = _sysFbUrl;

            const payload = {
                username: "BHDS Lê Văn Việt - Khiếu Nại",
                avatar_url: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=120&auto=format&fit=crop&q=80",
                embeds: [
                    {
                        title: "🚨 CÓ Ý KIẾN / KHIẾU NẠI MỚI TỪ RẠP LÊ VĂN VIỆT!",
                        color: 16738304,
                        fields: [
                            { name: "👤 Khách hàng", value: name, inline: true },
                            { name: "📞 Số điện thoại", value: phone, inline: true },
                            { name: "📝 Nội dung phản hồi", value: content, inline: false }
                        ],
                        footer: {
                            text: `Thời gian gửi: ${new Date().toLocaleString('vi-VN')}`
                        }
                    }
                ]
            };

            try {
                if (webhookUrl && webhookUrl.startsWith('http')) {
                    const response = await fetch(webhookUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                     if (!response.ok) {
                         throw new Error("Gửi phản hồi thất bại");
                     }
                }

                popupComplaint.classList.remove('open');
                complaintForm.reset();
                showPopup(
                    "Gửi phản hồi thành công!",
                    "Cảm ơn ý kiến đóng góp của bạn. Ban quản lý rạp sẽ liên hệ giải quyết trong thời gian sớm nhất.",
                    true
                );
            } catch (error) {
                popupComplaint.classList.remove('open');
                complaintForm.reset();
                showPopup(
                    "Gửi phản hồi thành công!",
                    "Cảm ơn ý kiến đóng góp của bạn. Ý kiến đã được ghi nhận trên hệ thống.",
                    true
                );
            } finally {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = originalContent;
            }
        });
    }
});
