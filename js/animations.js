// Advanced Animations and Interactions

// Initialize Animations
function initializeAnimations() {
    setupScrollAnimations();
    setupHoverEffects();
    setupLoadingStates();
    setupProgressBar();
    setupFloatingActionButton();
}

// Scroll Animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Stagger children animations
                const staggerItems = entry.target.querySelectorAll('.stagger-item');
                staggerItems.forEach((item, index) => {
                    item.style.animationDelay = `${index * 0.1}s`;
                });
            }
        });
    }, observerOptions);

    // Observe elements
    const elementsToAnimate = document.querySelectorAll(
        '.category-card, .product-card, .feature-card, .about-content, .contact-item'
    );
    
    elementsToAnimate.forEach(el => observer.observe(el));
}

// Hover Effects
function setupHoverEffects() {
    // Product card hover effects
    document.addEventListener('mouseover', function(e) {
        const productCard = e.target.closest('.product-card');
        if (productCard) {
            productCard.classList.add('hover-active');
        }
    });

    document.addEventListener('mouseout', function(e) {
        const productCard = e.target.closest('.product-card');
        if (productCard) {
            productCard.classList.remove('hover-active');
        }
    });

    // Button ripple effects
    document.addEventListener('click', function(e) {
        if (e.target.matches('.btn, .action-btn, .category-link')) {
            createRippleEffect(e);
        }
    });
}

// Ripple Effect
function createRippleEffect(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add('ripple-effect');

    const ripple = button.querySelector('.ripple-effect');
    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);

    setTimeout(() => circle.remove(), 600);
}

// Loading States
function setupLoadingStates() {
    // Add loading states to buttons
    document.addEventListener('click', function(e) {
        if (e.target.matches('.btn[data-loading]') || e.target.closest('.btn[data-loading]')) {
            const button = e.target.matches('.btn') ? e.target : e.target.closest('.btn');
            showButtonLoading(button);
        }
    });
}

function showButtonLoading(button) {
    const originalText = button.innerHTML;
    button.innerHTML = `
        <span class="loading-dots">
            <span></span>
            <span></span>
            <span></span>
        </span>
    `;
    button.disabled = true;

    // Simulate loading completion after 2 seconds
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
    }, 2000);
}

// Progress Bar
function setupProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
    });
}

// Floating Action Button
function setupFloatingActionButton() {
    const fab = document.createElement('button');
    fab.className = 'fab';
    fab.innerHTML = '<i class="fas fa-shopping-cart"></i>';
    fab.title = 'Quick Cart View';
    document.body.appendChild(fab);

    fab.addEventListener('click', showQuickCart);
}

function showQuickCart() {
    if (cart.length === 0) {
        ecommerce.showToast('Your cart is empty!', 'warning');
        return;
    }

    const quickCart = document.createElement('div');
    quickCart.className = 'quick-cart';
    quickCart.innerHTML = `
        <div class="quick-cart-header">
            <h4>Your Cart (${cart.reduce((sum, item) => sum + item.quantity, 0)})</h4>
            <button class="close-quick-cart"><i class="fas fa-times"></i></button>
        </div>
        <div class="quick-cart-items">
            ${cart.map(item => `
                <div class="quick-cart-item">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='images/placeholder.jpg'">
                    <div class="quick-cart-details">
                        <h5>${item.name}</h5>
                        <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="quick-cart-footer">
            <a href="cart.html" class="btn btn-primary">View Cart</a>
        </div>
    `;

    // Add styles
    quickCart.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        width: 90%;
        max-width: 400px;
        max-height: 80vh;
        display: flex;
        flex-direction: column;
    `;

    document.body.appendChild(quickCart);

    // Add overlay
    const overlay = document.createElement('div');
    overlay.className = 'quick-cart-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 9999;
    `;
    document.body.appendChild(overlay);

    // Close functionality
    const closeBtn = quickCart.querySelector('.close-quick-cart');
    closeBtn.addEventListener('click', closeQuickCart);
    overlay.addEventListener('click', closeQuickCart);

    function closeQuickCart() {
        quickCart.remove();
        overlay.remove();
    }
}

// Product Image Zoom
function setupImageZoom() {
    const productImages = document.querySelectorAll('.product-image img');
    
    productImages.forEach(img => {
        img.addEventListener('click', function() {
            openImageZoom(this);
        });
    });
}

function openImageZoom(img) {
    const zoomOverlay = document.createElement('div');
    zoomOverlay.className = 'image-zoom-overlay';
    zoomOverlay.innerHTML = `
        <div class="zoomed-image-container">
            <img src="${img.src}" alt="${img.alt}">
            <button class="close-zoom"><i class="fas fa-times"></i></button>
        </div>
    `;

    document.body.appendChild(zoomOverlay);

    const closeBtn = zoomOverlay.querySelector('.close-zoom');
    closeBtn.addEventListener('click', () => zoomOverlay.remove());
    zoomOverlay.addEventListener('click', (e) => {
        if (e.target === zoomOverlay) zoomOverlay.remove();
    });
}

// Parallax Scrolling
function setupParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(el => {
            const speed = el.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// CountUp Animation
function setupCountUp() {
    const counters = document.querySelectorAll('.count-up');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        const duration = parseInt(counter.dataset.duration) || 2000;
        const increment = target / (duration / 16); // 60fps
        
        let current = 0;
        
        const updateCount = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCount);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCount();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    
    // Add CSS for dynamic elements
    const style = document.createElement('style');
    style.textContent = `
        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .quick-cart-header {
            padding: 20px;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .quick-cart-items {
            padding: 20px;
            flex: 1;
            overflow-y: auto;
        }
        
        .quick-cart-item {
            display: flex;
            gap: 15px;
            padding: 10px 0;
            border-bottom: 1px solid var(--border-color);
        }
        
        .quick-cart-item img {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 4px;
        }
        
        .quick-cart-footer {
            padding: 20px;
            border-top: 1px solid var(--border-color);
        }
        
        .image-zoom-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }
        
        .zoomed-image-container {
            position: relative;
            max-width: 90%;
            max-height: 90%;
        }
        
        .zoomed-image-container img {
            max-width: 100%;
            max-height: 90vh;
            object-fit: contain;
        }
        
        .close-zoom {
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.5);
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }
        
        .animate-in {
            animation: fadeInUp 0.6s ease-out forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
});