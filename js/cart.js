// Cart Page Functionality

// Initialize Cart Page
function initializeCartPage() {
    renderCartItems();
    setupCartEventListeners();
    updateCartSummary();
}

// Render Cart Items
function renderCartItems() {
    const cartContainer = document.getElementById('cart-items');
    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart fa-3x"></i>
                        <h3>Your cart is empty</h3>
                        <p>Browse our products and add items to your cart</p>
                        <a href="products.html" class="btn btn-primary">Start Shopping</a>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    cartContainer.innerHTML = cart.map(item => `
        <tr class="cart-item" data-id="${item.id}">
            <td>
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='images/placeholder.jpg'">
                </div>
            </td>
            <td>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="item-category">${getProductCategory(item.id)}</p>
                </div>
            </td>
            <td class="item-price">$${item.price.toFixed(2)}</td>
            <td>
                <div class="quantity-control">
                    <button class="quantity-btn minus-btn" onclick="ecommerce.updateCartQuantity(${item.id}, ${item.quantity - 1})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus-btn" onclick="ecommerce.updateCartQuantity(${item.id}, ${item.quantity + 1})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </td>
            <td class="item-total">$${(item.price * item.quantity).toFixed(2)}</td>
            <td>
                <button class="remove-btn" onclick="ecommerce.removeFromCart(${item.id})" title="Remove item">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Get Product Category
function getProductCategory(productId) {
    const product = products.find(p => p.id === productId);
    return product ? product.category : 'General';
}

// Setup Cart Event Listeners
function setupCartEventListeners() {
    // Continue shopping button
    const continueShoppingBtn = document.querySelector('.continue-shopping');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'products.html';
        });
    }

    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (cart.length === 0) {
                ecommerce.showToast('Your cart is empty!', 'error');
                return;
            }
            window.location.href = 'checkout.html';
        });
    }

    // Clear cart button
    const clearCartBtn = document.querySelector('.clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (cart.length === 0) return;
            
            if (confirm('Are you sure you want to clear your cart?')) {
                cart = [];
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCartItems();
                updateCartSummary();
                updateCartCount();
                ecommerce.showToast('Cart cleared successfully', 'success');
            }
        });
    }
}

// Update Cart Summary
function updateCartSummary() {
    const subtotalElement = document.getElementById('cart-subtotal');
    const shippingElement = document.getElementById('cart-shipping');
    const taxElement = document.getElementById('cart-tax');
    const totalElement = document.getElementById('cart-total');

    if (!subtotalElement) return;

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? (subtotal > 50 ? 0 : 5.99) : 0;
    const tax = subtotal * 0.08; // 8% tax

    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    shippingElement.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    taxElement.textContent = `$${tax.toFixed(2)}`;
    totalElement.textContent = `$${(subtotal + shipping + tax).toFixed(2)}`;
}

// Update cart when quantity changes
function updateCartItemQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        ecommerce.removeFromCart(productId);
    } else {
        ecommerce.updateCartQuantity(productId, newQuantity);
    }
    updateCartSummary();
}