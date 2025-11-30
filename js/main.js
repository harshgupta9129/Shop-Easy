/**
 * ShopEasy Main JavaScript
 * Handles Slider, Cart, Auth, and Dynamic UI
 */

// --- PRODUCT DATA (Simulated Database) ---
const productsData = [
    { id: 1, name: "Wireless Noise Cancelling", price: 299.00, category: "Electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80", rating: 4.8 },
    { id: 2, name: "Classic Leather Watch", price: 129.50, category: "Fashion", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80", rating: 4.5 },
    { id: 3, name: "Smart Fitness Tracker", price: 89.99, category: "Electronics", image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&q=80", rating: 4.2 },
    { id: 4, name: "Premium Sunglasses", price: 159.00, category: "Fashion", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80", rating: 4.7 },
    { id: 5, name: "Organic Face Serum", price: 45.00, category: "Beauty", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80", rating: 4.9 },
    { id: 6, name: "Running Sneakers", price: 110.00, category: "Sports", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80", rating: 4.6 },
    { id: 7, name: "Ergonomic Office Chair", price: 249.99, category: "Home", image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80", rating: 4.8 },
    { id: 8, name: "Modern Table Lamp", price: 79.00, category: "Home", image: "https://images.unsplash.com/photo-1507473888900-52a1b2d8f744?w=500&q=80", rating: 4.3 }
];

// --- APP STATE ---
const App = {
    cart: JSON.parse(localStorage.getItem('shopEasy_cart')) || [],
    user: JSON.parse(localStorage.getItem('shopEasy_user')) || null,

    init() {
        this.renderHeader();
        this.setupEventListeners();
        this.updateCartCount();
        
        // Page specific initializers
        const path = window.location.pathname;
        if (path.includes('index') || path === '/') {
            this.initSlider();
            this.renderFeaturedProducts();
        } else if (path.includes('products')) {
            this.renderProductsPage();
        } else if (path.includes('cart')) {
            this.renderCartPage();
        } else if (path.includes('contact')) {
            this.initMap();
        }
    },

    // --- SLIDER LOGIC ---
    initSlider() {
        const slides = document.querySelectorAll('.slide');
        if (slides.length === 0) return;
        let current = 0;
        
        setInterval(() => {
            slides[current].classList.remove('active');
            current = (current + 1) % slides.length;
            slides[current].classList.add('active');
        }, 5000); // Change slide every 5 seconds
    },

    // --- CART FUNCTIONS ---
    addToCart(id) {
        if (!this.user) {
            this.showToast('Please login to add items', 'error');
            return;
        }
        
        const product = productsData.find(p => p.id === id);
        const existing = this.cart.find(item => item.id === id);
        
        if (existing) {
            existing.quantity++;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }
        
        this.saveCart();
        this.updateCartCount();
        this.showToast(`${product.name} added to cart!`);
    },

    removeFromCart(id) {
        this.cart = this.cart.filter(item => item.id !== id);
        this.saveCart();
        this.updateCartCount();
        this.renderCartPage(); // Re-render if on cart page
    },

    updateQuantity(id, change) {
        const item = this.cart.find(i => i.id === id);
        if (item) {
            item.quantity += change;
            if (item.quantity < 1) {
                this.removeFromCart(id);
            } else {
                this.saveCart();
                this.updateCartCount();
                this.renderCartPage();
            }
        }
    },

    saveCart() {
        localStorage.setItem('shopEasy_cart', JSON.stringify(this.cart));
    },

    updateCartCount() {
        const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
    },

    // --- AUTH LOGIC ---
    login() {
        // Simulation
        this.user = { name: "Demo User", email: "user@shopeasy.com" };
        localStorage.setItem('shopEasy_user', JSON.stringify(this.user));
        this.renderHeader();
        this.showToast('Welcome back, Demo User!');
    },

    logout() {
        this.user = null;
        localStorage.removeItem('shopEasy_user');
        this.renderHeader();
        this.showToast('Logged out successfully');
        if(window.location.pathname.includes('cart')) window.location.href = 'index.html';
    },

    // --- RENDERING ---
    renderHeader() {
        const authContainer = document.getElementById('auth-buttons');
        if (!authContainer) return;

        if (this.user) {
            authContainer.innerHTML = `
                <a href="profile.html" class="icon-btn" title="Profile"><i class="fas fa-user-circle"></i></a>
                <button onclick="App.logout()" class="icon-btn" title="Logout"><i class="fas fa-sign-out-alt"></i></button>
            `;
        } else {
            authContainer.innerHTML = `
                <button onclick="App.login()" class="icon-btn" title="Login"><i class="fas fa-user"></i></button>
            `;
        }
        
        // Dark Mode Check
        if(localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
    },

    createProductCard(product) {
        return `
            <div class="product-card">
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-overlay">
                        <button class="card-btn" onclick="App.addToCart(${product.id})" title="Add to Cart"><i class="fas fa-shopping-cart"></i></button>
                        <a href="product-detail.html?id=${product.id}" class="card-btn" title="View Details"><i class="fas fa-eye"></i></a>
                    </div>
                </div>
                <div class="product-details">
                    <span class="category-tag">${product.category}</span>
                    <div class="rating"><i class="fas fa-star"></i> ${product.rating}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                </div>
            </div>
        `;
    },

    renderFeaturedProducts() {
        const container = document.getElementById('featured-products');
        if (container) {
            // Display first 4 items
            container.innerHTML = productsData.slice(0, 4).map(p => this.createProductCard(p)).join('');
        }
    },

    renderProductsPage() {
        const container = document.getElementById('all-products-container');
        if (container) {
            container.innerHTML = productsData.map(p => this.createProductCard(p)).join('');
        }
    },

    renderCartPage() {
        const container = document.getElementById('cart-table-body');
        const summary = document.getElementById('cart-total-amount');
        if (!container) return;

        if (this.cart.length === 0) {
            container.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:30px;">Your cart is empty. <a href="products.html" style="color:#4a6cf7; text-decoration:underline;">Start Shopping</a></td></tr>';
            if(summary) summary.innerText = '$0.00';
            return;
        }

        container.innerHTML = this.cart.map(item => `
            <tr>
                <td style="display:flex; align-items:center; gap:10px;">
                    <img src="${item.image}" style="width:50px; height:50px; object-fit:cover; border-radius:5px;">
                    <div>${item.name}</div>
                </td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                    <div style="display:flex; align-items:center; gap:5px; border:1px solid #ddd; width:fit-content; padding:2px 5px; border-radius:4px;">
                        <button onclick="App.updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="App.updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
        `).join('');

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if(summary) summary.innerText = `$${total.toFixed(2)}`;
    },

    // --- UTILS ---
    showToast(message, type = 'success') {
        const container = document.getElementById('toast-box') || this.createToastContainer();
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.style.borderLeftColor = type === 'error' ? '#ff6b6b' : '#4a6cf7';
        toast.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}" style="color:${type === 'error' ? '#ff6b6b' : '#4a6cf7'}"></i>
            <span>${message}</span>
        `;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },

    createToastContainer() {
        const div = document.createElement('div');
        div.id = 'toast-box';
        div.className = 'toast-container';
        document.body.appendChild(div);
        return div;
    },

    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    },

    setupEventListeners() {
        const hamburger = document.querySelector('.hamburger');
        const nav = document.querySelector('.nav-menu');
        if(hamburger) {
            hamburger.addEventListener('click', () => {
                nav.classList.toggle('active');
                hamburger.innerHTML = nav.classList.contains('active') ? '<i class="fas fa-times" style="font-size:24px;"></i>' : '<span class="bar"></span><span class="bar"></span><span class="bar"></span>';
            });
        }
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => App.init());