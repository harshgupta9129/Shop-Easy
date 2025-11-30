// --- GLOBAL STATE ---
let allUsers = JSON.parse(localStorage.getItem('allUsers')) || [
    { email: 'user@example.com', password: 'password123', name: 'Demo User', joined: '2023-01-01', orders: [] }
];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let products = [];
let visibleProductCount = 8; 

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async function() {
    // 1. Load Data
    products = getBigProductList();
    
    // 2. Fix Old Cart Data (Crucial for fixing broken images/buttons in cart)
    fixCartData();

    // 3. Setup Global UI
    setupAuthUI();
    updateCartCount();
    setupEventListeners();
    setupTheme();
    
    // 4. Page Specific Logic
    const path = window.location.pathname;

    // Homepage
    if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
        renderFeaturedProducts(visibleProductCount);
        setupLoadMore();
    }
    
    // Products Page
    if (path.includes('products.html')) {
        initializeFilters(); // Now defined below!
        renderProducts(products); 
    }
    
    // Product Detail Page
    if (path.includes('product-detail.html')) {
        loadProductDetailFromURL(); // Now defined below!
    }

    // Cart Page
    if (path.includes('cart.html')) {
        renderCartItems(); 
    }

    // Profile Page
    if (path.includes('profile.html')) {
        if (!currentUser) window.location.href = 'index.html';
        else initializeProfile(); // Now defined below!
    }
    
    updateWishlistUI();
});

// --- DATA SOURCE (Real Images) ---
function getBigProductList() {
    return [
        { id: 1, name: "Premium Wireless Headphones", price: 129.99, category: "electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80", rating: 4.8, reviews: 210, badge: "Best Seller" },
        { id: 2, name: "Minimalist Watch", price: 89.99, category: "fashion", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80", rating: 4.5, reviews: 105, badge: "New" },
        { id: 3, name: "Ergonomic Office Chair", price: 249.99, category: "home", image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=600&q=80", rating: 4.9, reviews: 50, badge: "Sale" },
        { id: 4, name: "Polaroid Camera", price: 99.99, category: "electronics", image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80", rating: 4.7, reviews: 300, badge: "" },
        { id: 5, name: "Organic Face Serum", price: 45.00, category: "beauty", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80", rating: 4.6, reviews: 88, badge: "Organic" },
        { id: 6, name: "Running Sneakers", price: 110.00, category: "fashion", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80", rating: 4.8, reviews: 412, badge: "Trending" },
        { id: 7, name: "Mechanical Keyboard", price: 159.99, category: "electronics", image: "https://images.unsplash.com/photo-1587829741301-dc798b91a05c?auto=format&fit=crop&w=600&q=80", rating: 4.9, reviews: 150, badge: "RGB" },
        { id: 8, name: "Ceramic Plant Pot", price: 25.00, category: "home", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80", rating: 4.4, reviews: 67, badge: "" },
        { id: 9, name: "Leather Backpack", price: 140.00, category: "fashion", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80", rating: 4.7, reviews: 95, badge: "" },
        { id: 10, name: "Smart Speaker", price: 49.99, category: "electronics", image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&w=600&q=80", rating: 4.3, reviews: 120, badge: "Sale" },
        { id: 11, name: "Yoga Mat", price: 35.00, category: "beauty", image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=600&q=80", rating: 4.5, reviews: 200, badge: "" },
        { id: 12, name: "Sunglasses", price: 150.00, category: "fashion", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80", rating: 4.6, reviews: 180, badge: "Summer" },
        { id: 13, name: "Coffee Maker", price: 85.00, category: "home", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80", rating: 4.7, reviews: 310, badge: "" },
        { id: 14, name: "Drone 4K", price: 499.00, category: "electronics", image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=600&q=80", rating: 4.9, reviews: 50, badge: "Pro" },
        { id: 15, name: "Denim Jacket", price: 75.00, category: "fashion", image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=600&q=80", rating: 4.4, reviews: 85, badge: "" },
        { id: 16, name: "Luxury Perfume", price: 120.00, category: "beauty", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80", rating: 4.8, reviews: 140, badge: "Luxury" },
        { id: 17, name: "Gaming Headset", price: 80.00, category: "electronics", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=600&q=80", rating: 4.6, reviews: 220, badge: "" },
        { id: 18, name: "Table Lamp", price: 40.00, category: "home", image: "https://images.unsplash.com/photo-1507473888900-52a1b2d8f744?auto=format&fit=crop&w=600&q=80", rating: 4.5, reviews: 90, badge: "" },
        { id: 19, name: "Digital Watch", price: 199.00, category: "electronics", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80", rating: 4.7, reviews: 110, badge: "Smart" },
        { id: 20, name: "Hiking Boots", price: 130.00, category: "fashion", image: "https://images.unsplash.com/photo-1520639888713-7851188b43c5?auto=format&fit=crop&w=600&q=80", rating: 4.8, reviews: 160, badge: "Outdoor" }
    ];
}

// Helper: Ensure Cart has valid data (Fixes broken buttons issue)
function fixCartData() {
    let updated = false;
    cart.forEach(item => {
        // Find product details from fresh list
        const fresh = products.find(p => p.id == item.id);
        if (fresh) {
            // Update image and price if they changed
            if (item.image !== fresh.image) { item.image = fresh.image; updated = true; }
            if (item.price !== fresh.price) { item.price = fresh.price; updated = true; }
        }
    });
    if (updated) localStorage.setItem('cart', JSON.stringify(cart));
}

// --- CORE FUNCTIONS (Attached to Window) ---

window.addToCart = function(productId, quantity = 1) {
    if (!currentUser) {
        showToast("Please login to add items", "error");
        openLoginModal();
        return;
    }

    const product = products.find(p => p.id == productId); // Use loose equality (==) to catch string/number mismatches
    if (!product) return;

    const existing = cart.find(item => item.id == productId);
    if (existing) existing.quantity += quantity;
    else cart.push({ ...product, quantity: quantity });

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast(`${product.name} added!`);
    
    // Animate Icon
    const icon = document.querySelector('.cart-icon');
    if(icon) {
        icon.style.transform = "scale(1.2)";
        setTimeout(()=> icon.style.transform = "scale(1)", 200);
    }
};

window.removeFromCart = function(productId) {
    // Filter out the item
    cart = cart.filter(item => item.id != productId); 
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update UI
    updateCartCount();
    renderCartItems(); 
    showToast("Item removed");
};

window.updateCartQuantity = function(productId, newQty) {
    if (newQty < 1) return;
    
    const item = cart.find(i => i.id == productId);
    if (item) {
        item.quantity = newQty;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartCount();
    }
};

window.toggleWishlist = function(productId) {
    if(!currentUser) {
        showToast("Login to use wishlist", "error");
        return;
    }
    // Toggle Logic
    const index = wishlist.indexOf(productId);
    if (index === -1) {
        wishlist.push(productId);
        showToast("Added to Wishlist");
    } else {
        wishlist.splice(index, 1);
        showToast("Removed from Wishlist", "info");
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistUI();
};

// --- AUTH FUNCTIONS ---

window.openLoginModal = function() {
    const existing = document.getElementById('auth-modal');
    if(existing) existing.remove();

    const html = `
    <div class="modal-overlay open" id="auth-modal">
        <div class="modal-content">
            <button class="modal-close" onclick="closeModals()">&times;</button>
            <h2>Login</h2>
            <div class="form-group">
                <label>Email (user@example.com)</label>
                <input type="email" id="login-email" class="form-control" value="user@example.com">
            </div>
            <div class="form-group">
                <label>Password (password123)</label>
                <input type="password" id="login-password" class="form-control" value="password123">
            </div>
            <button class="btn btn-primary w-100" onclick="performLogin()">Login</button>
            <div class="switch-auth" style="margin-top:10px; text-align:center;">
                New here? <a onclick="switchToRegister()" style="color:blue; cursor:pointer;">Register</a>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
};

window.switchToRegister = function() {
    const container = document.querySelector('.modal-content');
    container.innerHTML = `
        <button class="modal-close" onclick="closeModals()">&times;</button>
        <h2>Register</h2>
        <div class="form-group">
            <label>Name</label>
            <input type="text" id="reg-name" class="form-control" placeholder="Your Name">
        </div>
        <div class="form-group">
            <label>Email</label>
            <input type="email" id="reg-email" class="form-control" placeholder="email@example.com">
        </div>
        <div class="form-group">
            <label>Password</label>
            <input type="password" id="reg-password" class="form-control" placeholder="******">
        </div>
        <button class="btn btn-primary w-100" onclick="performRegister()">Register</button>
        <div class="switch-auth" style="margin-top:10px; text-align:center;">
            Have account? <a onclick="openLoginModal()" style="color:blue; cursor:pointer;">Login</a>
        </div>
    `;
};

window.performLogin = function() {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;
    const user = allUsers.find(u => u.email === email && u.password === pass);
    
    if(user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        closeModals();
        setupAuthUI();
        showToast("Logged in successfully");
        if(window.location.pathname.includes('cart')) location.reload();
    } else {
        showToast("Invalid credentials", "error");
    }
};

window.performRegister = function() {
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-password').value;
    
    if(!name || !email || !pass) { showToast("Fill all fields", "error"); return; }
    
    const newUser = { name, email, password: pass, joined: new Date().toLocaleDateString(), orders: [] };
    allUsers.push(newUser);
    localStorage.setItem('allUsers', JSON.stringify(allUsers));
    
    // Auto login
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    closeModals();
    setupAuthUI();
    showToast("Registered successfully!");
};

window.logout = function() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
};

window.closeModals = function() {
    document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
};

// --- RENDERING LOGIC ---

function renderFeaturedProducts(count) {
    const container = document.getElementById('featured-products');
    if(!container) return;
    
    const itemsToShow = products.slice(0, count);
    container.innerHTML = itemsToShow.map(p => createProductCard(p)).join('');
    updateWishlistUI();
}

function setupLoadMore() {
    const container = document.getElementById('featured-products');
    if(!container) return;
    
    // Avoid duplicate buttons
    if(document.getElementById('load-more-btn')) return;

    const btnContainer = document.createElement('div');
    btnContainer.className = 'text-center mt-4';
    btnContainer.style.margin = "40px 0";
    btnContainer.innerHTML = `<button id="load-more-btn" class="btn btn-outline">Load More Products</button>`;
    
    container.parentNode.insertBefore(btnContainer, container.nextSibling);

    document.getElementById('load-more-btn').addEventListener('click', function() {
        visibleProductCount += 4;
        renderFeaturedProducts(visibleProductCount);
        
        if(visibleProductCount >= products.length) {
            this.style.display = 'none';
        }
    });
}

function renderProducts(productList) {
    const container = document.getElementById('products-container');
    if(!container) return;
    
    if(!productList || productList.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:40px; width:100%;"><h3>No products found</h3></div>';
        return;
    }
    
    container.innerHTML = productList.map(p => createProductCard(p)).join('');
    updateWishlistUI();
}

function initializeFilters() {
    const categorySelect = document.getElementById('category');
    const sortSelect = document.getElementById('sort');
    
    if(categorySelect) {
        categorySelect.addEventListener('change', function() {
            const cat = this.value;
            let filtered = (cat === 'all' || cat === 'All Categories') 
                ? products 
                : products.filter(p => p.category === cat);
            renderProducts(filtered);
        });
    }
    
    if(sortSelect) {
        sortSelect.addEventListener('change', function() {
            const val = this.value;
            // Get current list (naive approach: just sort global)
            // Better: sort the displayed list, but for now sorting global is fine
            let sorted = [...products];
            if(val === 'price-low') sorted.sort((a,b) => a.price - b.price);
            if(val === 'price-high') sorted.sort((a,b) => b.price - a.price);
            if(val === 'name') sorted.sort((a,b) => a.name.localeCompare(b.name));
            renderProducts(sorted);
        });
    }
}

// *** CART PAGE RENDERING ***
function renderCartItems() {
    const container = document.getElementById('cart-items');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:30px;">Your cart is empty. <a href="products.html">Shop Now</a></td></tr>';
        updateCartTotals();
        return;
    }

    container.innerHTML = cart.map(item => `
        <tr>
            <td>
                <div style="display:flex; align-items:center; gap:10px;">
                    <img src="${item.image}" style="width:60px; height:60px; object-fit:cover; border-radius:4px;">
                    <div>
                        <div style="font-weight:600;">${item.name}</div>
                        <div style="font-size:12px; color:#888;">${item.category}</div>
                    </div>
                </div>
            </td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <div class="quantity-control" style="display:flex; align-items:center; gap:10px;">
                    <button class="btn-sm" style="width:30px; height:30px; border:1px solid #ddd; background:#fff; cursor:pointer;" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button class="btn-sm" style="width:30px; height:30px; border:1px solid #ddd; background:#fff; cursor:pointer;" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
            <td>
                <button style="color:red; border:none; background:none; cursor:pointer; font-size:16px;" onclick="removeFromCart(${item.id})" title="Remove">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    updateCartTotals();
}

function updateCartTotals() {
    const subtotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const tax = subtotal * 0.10;
    
    if(document.getElementById('cart-subtotal')) document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    if(document.getElementById('cart-tax')) document.getElementById('cart-tax').textContent = `$${tax.toFixed(2)}`;
    if(document.getElementById('cart-total')) document.getElementById('cart-total').textContent = `$${(subtotal + tax).toFixed(2)}`;
}

// --- PROFILE PAGE LOGIC ---
function initializeProfile() {
    document.getElementById('profile-name').textContent = currentUser.name;
    document.getElementById('profile-email').textContent = currentUser.email;

    // Refresh user data from allUsers to get latest orders
    const freshUser = allUsers.find(u => u.email === currentUser.email) || currentUser;
    
    const ordersContainer = document.getElementById('orders-container');
    if (ordersContainer && freshUser.orders && freshUser.orders.length > 0) {
        ordersContainer.innerHTML = freshUser.orders.reverse().map(order => `
            <div class="order-history-item" style="border:1px solid #eee; padding:15px; margin-bottom:15px; border-radius:8px;">
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #eee; padding-bottom:10px; margin-bottom:10px;">
                    <strong>Order #${order.id}</strong>
                    <span>${order.date}</span>
                </div>
                <div>
                    <p>Total: <strong>$${order.total.toFixed(2)}</strong></p>
                    <p>Items: ${order.items.length}</p>
                </div>
            </div>
        `).join('');
    } else if(ordersContainer) {
        ordersContainer.innerHTML = '<p>No orders yet.</p>';
    }

    // Tab Switching
    document.querySelectorAll('.profile-tab-btn').forEach(btn => {
        if(btn.classList.contains('logout-btn')) return;
        btn.addEventListener('click', () => {
            document.querySelectorAll('.profile-tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.profile-pane').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const target = btn.dataset.target;
            if(document.getElementById(target)) document.getElementById(target).classList.add('active');
        });
    });
}

// --- DETAIL PAGE ---
function loadProductDetailFromURL() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const product = products.find(p => p.id == id);
    
    if (product) {
        document.querySelector('h1').textContent = product.name;
        document.querySelector('.price').textContent = `$${product.price.toFixed(2)}`;
        document.getElementById('main-image').src = product.image;
        
        // Remove old event listeners by cloning
        const oldBtn = document.querySelector('.add-to-cart-btn');
        if(oldBtn) {
            const newBtn = oldBtn.cloneNode(true);
            oldBtn.parentNode.replaceChild(newBtn, oldBtn);
            newBtn.addEventListener('click', () => addToCart(product.id));
        }
    }
}

// --- HELPERS ---
function createProductCard(p) {
    const isWishlisted = wishlist.includes(p.id) ? 'active' : '';
    const heartIcon = wishlist.includes(p.id) ? 'fas fa-heart' : 'far fa-heart';
    
    return `
        <div class="product-card fade-in" data-id="${p.id}">
            <div class="product-image">
                <a href="product-detail.html?id=${p.id}">
                    <img src="${p.image}" alt="${p.name}">
                </a>
                ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
                <button class="action-btn wishlist-btn ${isWishlisted}" onclick="toggleWishlist(${p.id})">
                    <i class="${heartIcon}"></i>
                </button>
            </div>
            <div class="product-info">
                <div class="product-category">${p.category}</div>
                <h3 class="product-title"><a href="product-detail.html?id=${p.id}">${p.name}</a></h3>
                <div class="product-price">$${p.price.toFixed(2)}</div>
                <button class="btn btn-primary w-100" onclick="addToCart(${p.id})">
                    ${!currentUser ? '<i class="fas fa-lock"></i>' : '<i class="fas fa-cart-plus"></i>'} Add to Cart
                </button>
            </div>
        </div>
    `;
}

function setupAuthUI() {
    const actions = document.querySelector('.user-actions');
    if(!actions) return;
    
    if(currentUser) {
        actions.innerHTML = `
            <div class="theme-toggle" onclick="toggleTheme()"><i class="fas fa-adjust"></i></div>
            <a href="profile.html" class="user-icon"><i class="fas fa-user-circle"></i> ${currentUser.name.split(' ')[0]}</a>
            <a href="cart.html" class="cart-icon"><i class="fas fa-shopping-cart"></i> <span class="cart-count">0</span></a>
        `;
    } else {
        actions.innerHTML = `
            <div class="theme-toggle" onclick="toggleTheme()"><i class="fas fa-adjust"></i></div>
            <a onclick="openLoginModal()" style="cursor:pointer; margin-right:15px; font-weight:600;">Login</a>
            <a class="cart-icon"><i class="fas fa-shopping-cart"></i> <span class="cart-count">0</span></a>
        `;
    }
}

function updateWishlistUI() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => { /* Logic inside createProductCard handles init state */ });
}

function updateCartCount() {
    const count = cart.reduce((a,b)=>a+b.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
}

function showToast(msg, type='success') {
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.style.cssText = `position:fixed; top:20px; right:20px; background:white; padding:15px; border-left:4px solid ${type==='error'?'red':'green'}; z-index:9999; box-shadow:0 5px 15px rgba(0,0,0,0.1); border-radius:4px; font-weight:500; animation: slideInRight 0.3s ease;`;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

function setupTheme() {
    if(localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
}

function setupEventListeners() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if(hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}