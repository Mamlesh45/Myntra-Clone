// Myntra Clone - JavaScript Functionality

// Global State Management
const state = {
    cart: [],
    wishlist: [],
    products: []
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadFromStorage();
    setupEventListeners();
    updateCartCount();
    updateWishlistCount();
    setupSearch();
    setupCategoryFilters();
}

// Load data from memory storage
function loadFromStorage() {
    // Initialize with empty arrays if nothing exists
    state.cart = state.cart || [];
    state.wishlist = state.wishlist || [];
}

// Save data to memory storage
function saveToStorage() {
    // Data persists in memory during the session
    console.log('Cart items:', state.cart.length);
    console.log('Wishlist items:', state.wishlist.length);
}

// Setup Event Listeners
function setupEventListeners() {
    // Profile dropdown
    const profileContainer = document.querySelector('.action_container:nth-child(1)');
    if (profileContainer) {
        profileContainer.addEventListener('click', toggleProfileMenu);
    }

    // Wishlist click
    const wishlistContainer = document.querySelector('.action_container:nth-child(2)');
    if (wishlistContainer) {
        wishlistContainer.addEventListener('click', openWishlist);
    }

    // Cart/Bag click
    const bagContainer = document.querySelector('.action_container:nth-child(3)');
    if (bagContainer) {
        bagContainer.addEventListener('click', openCart);
    }

    // Add click handlers to category items
    setupCategoryItemHandlers();
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.querySelector('.search_input');
    const searchIcon = document.querySelector('.search_icon');

    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
    }

    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            performSearch(searchInput.value);
        });
    }
}

// Handle search input
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm.length > 2) {
        // Show search suggestions
        showSearchSuggestions(searchTerm);
    } else {
        hideSearchSuggestions();
    }
}

// Perform search
function performSearch(searchTerm) {
    if (!searchTerm.trim()) {
        showNotification('Please enter a search term', 'warning');
        return;
    }

    showNotification(`Searching for "${searchTerm}"...`, 'info');
    
    // Filter category items based on search
    const categoryItems = document.querySelectorAll('.sale_item');
    let foundCount = 0;

    categoryItems.forEach(item => {
        const parent = item.closest('a');
        const imgSrc = item.src.toLowerCase();
        
        if (imgSrc.includes(searchTerm.toLowerCase())) {
            parent.style.display = 'block';
            foundCount++;
        } else {
            parent.style.display = 'none';
        }
    });

    if (foundCount === 0) {
        showNotification(`No products found for "${searchTerm}"`, 'warning');
    } else {
        showNotification(`Found ${foundCount} products`, 'success');
    }
}

// Show search suggestions
function showSearchSuggestions(searchTerm) {
    const suggestions = [
        'T-Shirts', 'Jeans', 'Shoes', 'Dresses', 'Kurtas',
        'Sarees', 'Shirts', 'Watches', 'Bags', 'Jackets'
    ];

    const filtered = suggestions.filter(s => 
        s.toLowerCase().includes(searchTerm)
    );

    if (filtered.length > 0) {
        // You can implement a dropdown here
        console.log('Suggestions:', filtered);
    }
}

// Hide search suggestions
function hideSearchSuggestions() {
    // Implementation for hiding suggestions
}

// Setup category item handlers
function setupCategoryItemHandlers() {
    const categoryItems = document.querySelectorAll('.sale_item');
    
    categoryItems.forEach((item, index) => {
        const parent = item.closest('a');
        parent.style.cursor = 'pointer';
        
        // Add hover effect
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });

        // Add click handler to show product details
        parent.addEventListener('click', function(e) {
            e.preventDefault();
            showProductModal(item, index);
        });
    });
}

// Show product modal
function showProductModal(item, index) {
    const modal = createModal();
    const imgSrc = item.src;
    const productName = `Product ${index + 1}`;
    const price = Math.floor(Math.random() * 3000) + 500;
    const originalPrice = Math.floor(price * 1.5);
    const discount = Math.floor(((originalPrice - price) / originalPrice) * 100);

    const product = {
        id: index,
        name: productName,
        image: imgSrc,
        price: price,
        originalPrice: originalPrice,
        discount: discount
    };

    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <span class="modal-close" onclick="closeModal()">&times;</span>
                <div class="modal-body">
                    <div class="modal-image">
                        <img src="${imgSrc}" alt="${productName}">
                    </div>
                    <div class="modal-details">
                        <h2>${productName}</h2>
                        <div class="product-rating">
                            <span class="stars">★★★★☆</span>
                            <span class="rating-count">(234 ratings)</span>
                        </div>
                        <div class="price-container">
                            <span class="current-price">₹${price}</span>
                            <span class="original-price">₹${originalPrice}</span>
                            <span class="discount">(${discount}% OFF)</span>
                        </div>
                        <div class="size-selector">
                            <h3>SELECT SIZE</h3>
                            <div class="sizes">
                                <button class="size-btn" onclick="selectSize(this)">S</button>
                                <button class="size-btn" onclick="selectSize(this)">M</button>
                                <button class="size-btn" onclick="selectSize(this)">L</button>
                                <button class="size-btn" onclick="selectSize(this)">XL</button>
                                <button class="size-btn" onclick="selectSize(this)">XXL</button>
                            </div>
                        </div>
                        <div class="action-buttons">
                            <button class="btn-wishlist" onclick='addToWishlist(${JSON.stringify(product)})'>
                                <span class="material-symbols-outlined">favorite</span>
                                WISHLIST
                            </button>
                            <button class="btn-cart" onclick='addToCart(${JSON.stringify(product)})'>
                                <span class="material-symbols-outlined">shopping_bag</span>
                                ADD TO BAG
                            </button>
                        </div>
                        <div class="product-description">
                            <h3>PRODUCT DETAILS</h3>
                            <p>Premium quality product with excellent fabric and finish. 
                            Perfect for casual and semi-formal occasions.</p>
                            <ul>
                                <li>100% Original Products</li>
                                <li>Easy 30 days return</li>
                                <li>Cash on Delivery available</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    addModalStyles();
}

// Create modal element
function createModal() {
    const modal = document.createElement('div');
    modal.id = 'product-modal';
    modal.className = 'modal';
    return modal;
}

// Close modal
function closeModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.remove();
    }
}

// Select size
function selectSize(btn) {
    const sizeBtns = document.querySelectorAll('.size-btn');
    sizeBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
}

// Add to cart
function addToCart(product) {
    const selectedSize = document.querySelector('.size-btn.selected');
    
    if (!selectedSize) {
        showNotification('Please select a size', 'warning');
        return;
    }

    product.size = selectedSize.textContent;
    
    const existingItem = state.cart.find(item => 
        item.id === product.id && item.size === product.size
    );

    if (existingItem) {
        existingItem.quantity += 1;
        showNotification('Item quantity updated in bag', 'success');
    } else {
        product.quantity = 1;
        state.cart.push(product);
        showNotification('Item added to bag', 'success');
    }

    updateCartCount();
    saveToStorage();
}

// Add to wishlist
function addToWishlist(product) {
    const existingItem = state.wishlist.find(item => item.id === product.id);

    if (existingItem) {
        showNotification('Item already in wishlist', 'info');
        return;
    }

    state.wishlist.push(product);
    showNotification('Item added to wishlist', 'success');
    updateWishlistCount();
    saveToStorage();
}

// Update cart count
function updateCartCount() {
    const bagContainer = document.querySelector('.action_container:nth-child(3)');
    
    // Remove existing badge if any
    const existingBadge = bagContainer.querySelector('.count-badge');
    if (existingBadge) {
        existingBadge.remove();
    }

    // Add new badge if items exist
    if (state.cart.length > 0) {
        const badge = document.createElement('span');
        badge.className = 'count-badge';
        badge.textContent = state.cart.length;
        bagContainer.style.position = 'relative';
        bagContainer.appendChild(badge);
    }
}

// Update wishlist count
function updateWishlistCount() {
    const wishlistContainer = document.querySelector('.action_container:nth-child(2)');
    
    // Remove existing badge if any
    const existingBadge = wishlistContainer.querySelector('.count-badge');
    if (existingBadge) {
        existingBadge.remove();
    }

    // Add new badge if items exist
    if (state.wishlist.length > 0) {
        const badge = document.createElement('span');
        badge.className = 'count-badge';
        badge.textContent = state.wishlist.length;
        wishlistContainer.style.position = 'relative';
        wishlistContainer.appendChild(badge);
    }
}

// Open cart
function openCart() {
    if (state.cart.length === 0) {
        showNotification('Your bag is empty', 'info');
        return;
    }

    const modal = createModal();
    let cartHTML = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="cart-modal" onclick="event.stopPropagation()">
                <div class="cart-header">
                    <h2>Shopping Bag (${state.cart.length} items)</h2>
                    <span class="modal-close" onclick="closeModal()">&times;</span>
                </div>
                <div class="cart-items">
    `;

    let total = 0;
    state.cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        cartHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>Size: ${item.size}</p>
                    <div class="price-info">
                        <span class="price">₹${item.price}</span>
                        <span class="original-price">₹${item.originalPrice}</span>
                    </div>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index})">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
        `;
    });

    cartHTML += `
                </div>
                <div class="cart-footer">
                    <div class="cart-total">
                        <span>Total:</span>
                        <span class="total-price">₹${total}</span>
                    </div>
                    <button class="checkout-btn" onclick="checkout()">PLACE ORDER</button>
                </div>
            </div>
        </div>
    `;

    modal.innerHTML = cartHTML;
    document.body.appendChild(modal);
    addModalStyles();
}

// Update quantity
function updateQuantity(index, change) {
    if (state.cart[index]) {
        state.cart[index].quantity += change;
        
        if (state.cart[index].quantity <= 0) {
            state.cart.splice(index, 1);
        }
        
        saveToStorage();
        updateCartCount();
        closeModal();
        openCart();
    }
}

// Remove from cart
function removeFromCart(index) {
    state.cart.splice(index, 1);
    saveToStorage();
    updateCartCount();
    closeModal();
    
    if (state.cart.length > 0) {
        openCart();
    } else {
        showNotification('Your bag is now empty', 'info');
    }
}

// Checkout
function checkout() {
    if (state.cart.length === 0) {
        showNotification('Your bag is empty', 'warning');
        return;
    }

    const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    showNotification(`Order placed successfully! Total: ₹${total}`, 'success');
    
    // Clear cart
    state.cart = [];
    saveToStorage();
    updateCartCount();
    closeModal();
}

// Open wishlist
function openWishlist() {
    if (state.wishlist.length === 0) {
        showNotification('Your wishlist is empty', 'info');
        return;
    }

    const modal = createModal();
    let wishlistHTML = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="wishlist-modal" onclick="event.stopPropagation()">
                <div class="cart-header">
                    <h2>My Wishlist (${state.wishlist.length} items)</h2>
                    <span class="modal-close" onclick="closeModal()">&times;</span>
                </div>
                <div class="wishlist-items">
    `;

    state.wishlist.forEach((item, index) => {
        wishlistHTML += `
            <div class="wishlist-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="wishlist-item-details">
                    <h3>${item.name}</h3>
                    <div class="price-info">
                        <span class="price">₹${item.price}</span>
                        <span class="original-price">₹${item.originalPrice}</span>
                        <span class="discount">${item.discount}% OFF</span>
                    </div>
                </div>
                <div class="wishlist-actions">
                    <button class="move-to-bag-btn" onclick='moveToCart(${JSON.stringify(item)}, ${index})'>
                        MOVE TO BAG
                    </button>
                    <button class="remove-btn" onclick="removeFromWishlist(${index})">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
            </div>
        `;
    });

    wishlistHTML += `
                </div>
            </div>
        </div>
    `;

    modal.innerHTML = wishlistHTML;
    document.body.appendChild(modal);
    addModalStyles();
}

// Move to cart from wishlist
function moveToCart(product, wishlistIndex) {
    // Remove from wishlist
    state.wishlist.splice(wishlistIndex, 1);
    updateWishlistCount();
    
    // Add to cart with default size
    product.size = 'M';
    product.quantity = 1;
    state.cart.push(product);
    updateCartCount();
    
    saveToStorage();
    showNotification('Item moved to bag', 'success');
    
    closeModal();
    if (state.wishlist.length > 0) {
        openWishlist();
    }
}

// Remove from wishlist
function removeFromWishlist(index) {
    state.wishlist.splice(index, 1);
    saveToStorage();
    updateWishlistCount();
    closeModal();
    
    if (state.wishlist.length > 0) {
        openWishlist();
    } else {
        showNotification('Your wishlist is now empty', 'info');
    }
}

// Toggle profile menu
function toggleProfileMenu() {
    const profileContainer = document.querySelector('.action_container:nth-child(1)');
    let menu = document.getElementById('profile-menu');

    if (menu) {
        menu.remove();
        return;
    }

    menu = document.createElement('div');
    menu.id = 'profile-menu';
    menu.className = 'dropdown-menu';
    menu.innerHTML = `
        <div class="menu-item" onclick="showNotification('Login feature coming soon!', 'info')">
            <span class="material-symbols-outlined">login</span>
            Login / Sign Up
        </div>
        <div class="menu-item" onclick="showNotification('Orders feature coming soon!', 'info')">
            <span class="material-symbols-outlined">shopping_bag</span>
            Orders
        </div>
        <div class="menu-item" onclick="openWishlist()">
            <span class="material-symbols-outlined">favorite</span>
            Wishlist
        </div>
        <div class="menu-item" onclick="showNotification('Coupons feature coming soon!', 'info')">
            <span class="material-symbols-outlined">confirmation_number</span>
            Coupons
        </div>
        <div class="menu-item" onclick="showNotification('Settings feature coming soon!', 'info')">
            <span class="material-symbols-outlined">settings</span>
            Settings
        </div>
    `;

    profileContainer.appendChild(menu);
    addModalStyles();

    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!profileContainer.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}

// Setup category filters
function setupCategoryFilters() {
    const navLinks = document.querySelectorAll('.nav_bar a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.textContent.trim();
            showNotification(`Showing ${category} collection`, 'info');
        });
    });
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <span class="notification-close" onclick="this.parentElement.remove()">×</span>
    `;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Add modal and notification styles
function addModalStyles() {
    if (document.getElementById('dynamic-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'dynamic-styles';
    styles.textContent = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
        }

        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .modal-content {
            background: white;
            border-radius: 8px;
            max-width: 900px;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .modal-close {
            position: absolute;
            top: 15px;
            right: 20px;
            font-size: 30px;
            cursor: pointer;
            color: #666;
            z-index: 10;
        }

        .modal-close:hover {
            color: #f54e77;
        }

        .modal-body {
            display: flex;
            padding: 30px;
            gap: 30px;
        }

        .modal-image {
            flex: 1;
            max-width: 400px;
        }

        .modal-image img {
            width: 100%;
            border-radius: 8px;
        }

        .modal-details {
            flex: 1;
            padding: 20px;
        }

        .modal-details h2 {
            font-size: 24px;
            color: #282c3f;
            margin-bottom: 10px;
        }

        .product-rating {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
        }

        .stars {
            color: #ffa500;
            font-size: 18px;
        }

        .rating-count {
            color: #94969f;
            font-size: 14px;
        }

        .price-container {
            margin: 20px 0;
        }

        .current-price {
            font-size: 28px;
            font-weight: 700;
            color: #282c3f;
            margin-right: 10px;
        }

        .original-price {
            font-size: 20px;
            color: #94969f;
            text-decoration: line-through;
            margin-right: 10px;
        }

        .discount {
            color: #ff905a;
            font-size: 16px;
            font-weight: 600;
        }

        .size-selector {
            margin: 25px 0;
        }

        .size-selector h3 {
            font-size: 14px;
            color: #282c3f;
            margin-bottom: 15px;
            font-weight: 700;
        }

        .sizes {
            display: flex;
            gap: 10px;
        }

        .size-btn {
            width: 50px;
            height: 50px;
            border: 1px solid #d4d5d9;
            border-radius: 50%;
            background: white;
            cursor: pointer;
            font-weight: 600;
            color: #282c3f;
            transition: all 0.2s;
        }

        .size-btn:hover {
            border-color: #f54e77;
        }

        .size-btn.selected {
            border-color: #f54e77;
            border-width: 2px;
            color: #f54e77;
        }

        .action-buttons {
            display: flex;
            gap: 15px;
            margin: 30px 0;
        }

        .btn-wishlist, .btn-cart {
            flex: 1;
            padding: 15px;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.3s;
        }

        .btn-wishlist {
            background: white;
            color: #282c3f;
            border: 1px solid #d4d5d9;
        }

        .btn-wishlist:hover {
            border-color: #f54e77;
            color: #f54e77;
        }

        .btn-cart {
            background: #ff3f6c;
            color: white;
        }

        .btn-cart:hover {
            background: #f54e77;
        }

        .product-description {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9e9ed;
        }

        .product-description h3 {
            font-size: 14px;
            color: #282c3f;
            margin-bottom: 15px;
            font-weight: 700;
        }

        .product-description p {
            color: #94969f;
            line-height: 1.6;
            margin-bottom: 15px;
        }

        .product-description ul {
            list-style: none;
            padding: 0;
        }

        .product-description li {
            color: #282c3f;
            padding: 8px 0;
            padding-left: 20px;
            position: relative;
        }

        .product-description li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #03a685;
            font-weight: bold;
        }

        .cart-modal, .wishlist-modal {
            background: white;
            border-radius: 8px;
            width: 90%;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            animation: slideUp 0.3s ease;
        }

        .cart-header {
            padding: 20px 30px;
            border-bottom: 1px solid #e9e9ed;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .cart-header h2 {
            font-size: 20px;
            color: #282c3f;
        }

        .cart-items, .wishlist-items {
            padding: 20px;
        }

        .cart-item, .wishlist-item {
            display: flex;
            gap: 20px;
            padding: 20px;
            border: 1px solid #e9e9ed;
            border-radius: 8px;
            margin-bottom: 15px;
            position: relative;
        }

        .cart-item img, .wishlist-item img {
            width: 120px;
            height: 150px;
            object-fit: cover;
            border-radius: 4px;
        }

        .cart-item-details, .wishlist-item-details {
            flex: 1;
        }

        .cart-item-details h3, .wishlist-item-details h3 {
            font-size: 16px;
            color: #282c3f;
            margin-bottom: 8px;
        }

        .cart-item-details p {
            color: #94969f;
            font-size: 14px;
            margin-bottom: 10px;
        }

        .price-info {
            margin: 10px 0;
        }

        .price-info .price {
            font-size: 18px;
            font-weight: 600;
            color: #282c3f;
            margin-right: 10px;
        }

        .quantity-controls {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-top: 15px;
        }

        .quantity-controls button {
            width: 30px;
            height: 30px;
            border: 1px solid #d4d5d9;
            border-radius: 50%;
            background: white;
            cursor: pointer;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .quantity-controls button:hover {
            background: #f5f5f6;
        }

        .remove-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            cursor: pointer;
            color: #94969f;
        }

        .remove-btn:hover {
            color: #f54e77;
        }

        .cart-footer {
            padding: 20px 30px;
            border-top: 1px solid #e9e9ed;
            background: #f5f5f6;
        }

        .cart-total {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            font-size: 18px;
            font-weight: 600;
        }

        .total-price {
            color: #282c3f;
            font-size: 24px;
        }

        .checkout-btn {
            width: 100%;
            padding: 15px;
            background: #ff3f6c;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s;
        }

        .checkout-btn:hover {
            background: #f54e77;
        }

        .wishlist-actions {
            display: flex;
            flex-direction: column;
            gap: 10px;
            justify-content: center;
        }

        .move-to-bag-btn {
            padding: 10px 20px;
            background: #ff3f6c;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            white-space: nowrap;
        }

        .move-to-bag-btn:hover {
            background: #f54e77;
        }

        .dropdown-menu {
            position: absolute;
            top: 60px;
            right: 0;
            background: white;
            border: 1px solid #e9e9ed;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            min-width: 200px;
            z-index: 100;
            animation: slideDown 0.2s ease;
        }

        @keyframes slideDown {
            from { 
                opacity: 0;
                transform: translateY(-10px);
            }
            to { 
                opacity: 1;
                transform: translateY(0);
            }
        }

        .menu-item {
            padding: 15px 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            color: #282c3f;
            font-size: 14px;
            transition: background 0.2s;
        }

        .menu-item:hover {
            background: #f5f5f6;
        }

        .menu-item .material-symbols-outlined {
            font-size: 20px;
            color: #94969f;
        }

        .count-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #ff3f6c;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: 700;
        }

        .notification {
            position: fixed;
            top: 90px;
            right: 20px;
            background: white;
            padding: 15px 20px;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            min-width: 300px;
            z-index: 2000;
            animation: slideInRight 0.3s ease;
        }

        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .notification-success {
            border-left: 4px solid #03a685;
        }

        .notification-error {
            border-left: 4px solid #ff3f6c;
        }

        .notification-warning {
            border-left: 4px solid #ff905a;
        }

        .notification-info {
            border-left: 4px solid #535766;
        }

        .notification-message {
            color: #282c3f;
            font-size: 14px;
            flex: 1;
        }

        .notification-close {
            cursor: pointer;
            font-size: 20px;
            color: #94969f;
            font-weight: 600;
        }

        .notification-close:hover {
            color: #282c3f;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .modal-body {
                flex-direction: column;
            }

            .modal-image {
                max-width: 100%;
            }

            .cart-modal, .wishlist-modal {
                width: 95%;
            }

            .cart-item, .wishlist-item {
                flex-direction: column;
            }

            .cart-item img, .wishlist-item img {
                width: 100%;
                height: 200px;
            }

            .notification {
                right: 10px;
                left: 10px;
                min-width: auto;
            }
        }

        /* Smooth scroll */
        html {
            scroll-behavior: smooth;
        }

        /* Loading animation */
        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255,255,255,.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
        }
    `;

    document.head.appendChild(styles);
}

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button
window.addEventListener('scroll', function() {
    let scrollBtn = document.getElementById('scroll-top-btn');
    
    if (window.pageYOffset > 300) {
        if (!scrollBtn) {
            scrollBtn = document.createElement('button');
            scrollBtn.id = 'scroll-top-btn';
            scrollBtn.innerHTML = '<span class="material-symbols-outlined">arrow_upward</span>';
            scrollBtn.style.cssText = `
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: #ff3f6c;
                color: white;
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 999;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s;
            `;
            scrollBtn.onclick = scrollToTop;
            document.body.appendChild(scrollBtn);
        }
    } else {
        if (scrollBtn) {
            scrollBtn.remove();
        }
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape key to close modals
    if (e.key === 'Escape') {
        closeModal();
        const profileMenu = document.getElementById('profile-menu');
        if (profileMenu) profileMenu.remove();
    }
    
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search_input');
        if (searchInput) searchInput.focus();
    }
});

// Add animation to category items on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe category items
document.addEventListener('DOMContentLoaded', function() {
    const categoryItems = document.querySelectorAll('.sale_item');
    categoryItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(item);
    });
});

// Add quick view functionality
function addQuickViewButtons() {
    const categoryItems = document.querySelectorAll('.sale_item');
    
    categoryItems.forEach((item, index) => {
        const parent = item.parentElement;
        parent.style.position = 'relative';
        
        const quickViewBtn = document.createElement('button');
        quickViewBtn.className = 'quick-view-btn';
        quickViewBtn.innerHTML = 'QUICK VIEW';
        quickViewBtn.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 20px;
            background: white;
            border: 1px solid #282c3f;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s;
            z-index: 10;
        `;
        
        parent.addEventListener('mouseenter', function() {
            quickViewBtn.style.opacity = '1';
        });
        
        parent.addEventListener('mouseleave', function() {
            quickViewBtn.style.opacity = '0';
        });
        
        quickViewBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            showProductModal(item, index);
        });
        
        parent.appendChild(quickViewBtn);
    });
}

// Initialize quick view buttons after page load
window.addEventListener('load', function() {
    setTimeout(addQuickViewButtons, 500);
});

// Console welcome message
console.log('%c Welcome to Myntra Clone! ', 'background: #ff3f6c; color: white; font-size: 20px; padding: 10px;');
console.log('%c Created with ❤️ ', 'color: #ff3f6c; font-size: 14px;');
console.log('🛍️ Happy Shopping!');

// Export functions to global scope for inline onclick handlers
window.closeModal = closeModal;
window.selectSize = selectSize;
window.addToCart = addToCart;
window.addToWishlist = addToWishlist;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.checkout = checkout;
window.moveToCart = moveToCart;
window.removeFromWishlist = removeFromWishlist;