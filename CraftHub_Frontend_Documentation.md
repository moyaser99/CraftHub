# CraftHub Frontend Documentation

## Table of Contents
- [Overview](#overview)
- [Project Structure](#project-structure)
- [HTML Documentation](#html-documentation)
- [CSS Documentation](#css-documentation)
- [JavaScript Documentation](#javascript-documentation)
- [Component Guide](#component-guide)
- [Responsive Design](#responsive-design)
- [Browser Compatibility](#browser-compatibility)
- [Performance Optimization](#performance-optimization)

## Overview

CraftHub is a handmade crafts marketplace built with modern frontend technologies. This documentation covers the HTML structure, CSS styling, and JavaScript functionality that powers the user interface.

### Technology Stack
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox, Grid, and Custom Properties
- **JavaScript (ES6+)**: Interactive functionality and DOM manipulation
- **Font Awesome**: Icon library
- **Google Fonts**: Typography (Poppins)

## Project Structure

```
CraftHub/
├── index.html              # Homepage
├── crafts.html             # Product catalog
├── craft-details.html      # Individual product pages
├── categories.html         # Category browsing
├── artists.html            # Artist profiles
├── cart.html               # Shopping cart
├── checkout.html           # Purchase process
├── login.html              # User authentication
├── register.html           # User registration
├── profile.html            # User profile management
├── invoice.html            # Order confirmation
├── admin-dashboard.html    # Admin dashboard
├── admin-crafts.html       # Admin product management
├── admin-orders.html       # Admin order management
├── admin-reports.html      # Admin reports
├── admin-settings.html     # Admin settings
├── styles.css              # Main application styles
├── admin-styles.css        # Admin panel styles
├── main.js                 # Core application logic
├── admin.js                # Admin panel functionality
├── images/                 # Product and UI images
└── logos/                  # Brand assets
```

## HTML Documentation

### Page Structure

#### Standard Page Template
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title - CraftHub</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <header class="header">
        <!-- Navigation -->
    </header>
    
    <main>
        <!-- Page Content -->
    </main>
    
    <footer class="footer">
        <!-- Footer Content -->
    </footer>
    
    <script src="main.js"></script>
</body>
</html>
```

#### Navigation Structure
```html
<nav class="nav-container">
    <div class="logo">
        <a href="index.html">
            <img src="logos/logo_trunk_tools.svg" alt="CraftHub">
        </a>
    </div>
    <div class="nav-links">
        <a href="index.html" class="active">Home</a>
        <a href="crafts.html">Browse Crafts</a>
        <a href="categories.html">Categories</a>
        <a href="artists.html">Artists</a>
    </div>
    <div class="nav-actions">
        <a href="cart.html" class="cart-icon">
            <i class="fas fa-shopping-cart"></i>
            <span class="cart-count">0</span>
        </a>
        <a href="login.html" class="btn btn-outline">Login</a>
        <a href="register.html" class="btn btn-primary">Register</a>
    </div>
</nav>
```

### Key Components

#### Product Card
```html
<div class="product-card">
    <div class="product-image">
        <a href="craft-details.html">
            <img src="images/product.jpg" alt="Product Name">
        </a>
        <div class="product-tags">
            <span class="tag new">New</span>
        </div>
    </div>
    <div class="product-info">
        <h3><a href="craft-details.html">Product Name</a></h3>
        <p class="artist">By Artist Name</p>
        <p class="price">$99.99</p>
        <button class="btn btn-secondary add-to-cart" 
            data-craft-id="1"
            data-craft-name="Product Name"
            data-craft-price="99.99"
            data-craft-image="images/product.jpg">
            Add to Cart
        </button>
    </div>
</div>
```

#### Form Structure
```html
<form class="form" id="login-form">
    <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required>
    </div>
    <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required>
    </div>
    <button type="submit" class="btn btn-primary">Login</button>
</form>
```

## CSS Documentation

### CSS Architecture

#### CSS Custom Properties (Variables)
```css
:root {
    /* Colors */
    --primary-color: #4a90e2;
    --secondary-color: #f5f5f5;
    --accent-color: #ff6b6b;
    --text-color: #333;
    --text-light: #666;
    --border-color: #ddd;
    --background-color: #fff;
    
    /* Typography */
    --font-family: 'Poppins', sans-serif;
    --font-size-small: 0.875rem;
    --font-size-base: 1rem;
    --font-size-large: 1.125rem;
    --font-size-xl: 1.25rem;
    --font-size-2xl: 1.5rem;
    
    /* Spacing */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    
    /* Border Radius */
    --border-radius: 8px;
    --border-radius-lg: 12px;
    
    /* Shadows */
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.12);
    --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
    --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}
```

#### Layout System
```css
/* Container */
.container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
}

/* Grid System */
.grid {
    display: grid;
    gap: var(--spacing-lg);
}

.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-4 { grid-template-columns: repeat(4, 1fr); }

/* Flexbox Utilities */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-wrap { flex-wrap: wrap; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
```

#### Component Styles

##### Buttons
```css
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-sm) var(--spacing-lg);
    border: none;
    border-radius: var(--border-radius);
    font-family: var(--font-family);
    font-size: var(--font-size-base);
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-primary {
    background-color: var(--primary-color);
    color: white;
}

.btn-primary:hover {
    background-color: #357abd;
    transform: translateY(-1px);
}

.btn-secondary {
    background-color: var(--secondary-color);
    color: var(--text-color);
    border: 1px solid var(--border-color);
}

.btn-outline {
    background-color: transparent;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
}
```

##### Product Cards
```css
.product-card {
    background: var(--background-color);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
    transition: all 0.3s ease;
}

.product-card:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-4px);
}

.product-image {
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;
}

.product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
    transform: scale(1.05);
}

.product-info {
    padding: var(--spacing-lg);
}

.product-tags {
    position: absolute;
    top: var(--spacing-sm);
    left: var(--spacing-sm);
    display: flex;
    gap: var(--spacing-xs);
}

.tag {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: var(--font-size-small);
    font-weight: 500;
}

.tag.new {
    background-color: var(--accent-color);
    color: white;
}
```

##### Forms
```css
.form {
    max-width: 400px;
    margin: 0 auto;
}

.form-group {
    margin-bottom: var(--spacing-lg);
}

.form-group label {
    display: block;
    margin-bottom: var(--spacing-xs);
    font-weight: 500;
    color: var(--text-color);
}

.form-group input,
.form-group textarea,
.form-group select {
    width: 100%;
    padding: var(--spacing-sm);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    font-family: var(--font-family);
    font-size: var(--font-size-base);
    transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}
```

## JavaScript Documentation

### Core Functionality

#### Cart Management
```javascript
// Cart initialization
let cart = [];
try {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
} catch (error) {
    console.error('Error loading cart from localStorage:', error);
    cart = [];
}

// Add item to cart
function addToCart(event) {
    const button = event.target.closest('.add-to-cart');
    if (!button) return;

    const craftId = button.dataset.craftId;
    const craftName = button.dataset.craftName;
    const craftPrice = parseFloat(button.dataset.craftPrice);
    const craftImage = button.dataset.craftImage;

    if (!craftId || !craftName || !craftPrice || !craftImage) {
        console.error('Missing required data attributes');
        return;
    }

    const existingItem = cart.find(item => item.id === craftId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: craftId,
            name: craftName,
            price: craftPrice,
            image: craftImage,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartCount();
    showNotification('تمت إضافة المنتج إلى السلة');
}

// Remove item from cart
function removeFromCart(event) {
    const button = event.target.closest('.remove-item');
    if (!button) return;

    const index = parseInt(button.dataset.index);
    if (isNaN(index) || index < 0 || index >= cart.length) {
        console.error('Invalid index for cart item removal');
        return;
    }

    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartCount();
    showNotification('تم إزالة المنتج من السلة');
}

// Update cart count display
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElements = document.querySelectorAll('.cart-count');
    
    cartCountElements.forEach(el => {
        if (el) {
            el.textContent = cartItems.length;
            el.style.display = cartItems.length > 0 ? 'inline-block' : 'none';
        }
    });
}
```

#### Form Validation
```javascript
// Email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Password validation
function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
        isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
        errors: {
            length: password.length < minLength,
            uppercase: !hasUpperCase,
            lowercase: !hasLowerCase,
            numbers: !hasNumbers,
            special: !hasSpecialChar
        }
    };
}

// Phone number validation
function validatePhoneNumber(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Credit card validation
function validateCardNumber(cardNumber) {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cleanNumber)) return false;
    
    // Luhn algorithm
    let sum = 0;
    let isEven = false;
    
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cleanNumber[i]);
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return sum % 10 === 0;
}
```

#### Utility Functions
```javascript
// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
```

### Event Handlers

#### Page Initialization
```javascript
// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart
    updateCartCount();
    
    // Add event listeners
    addEventListeners();
    
    // Initialize page-specific functionality
    initializePage();
});

// Add global event listeners
function addEventListeners() {
    // Cart functionality
    document.addEventListener('click', function(event) {
        if (event.target.closest('.add-to-cart')) {
            addToCart(event);
        }
        if (event.target.closest('.remove-item')) {
            removeFromCart(event);
        }
    });
    
    // Form submissions
    document.addEventListener('submit', function(event) {
        if (event.target.matches('#login-form')) {
            handleLogin(event);
        }
        if (event.target.matches('#register-form')) {
            handleRegister(event);
        }
        if (event.target.matches('#checkout-form')) {
            handleCheckout(event);
        }
    });
    
    // Quantity updates
    document.addEventListener('change', function(event) {
        if (event.target.matches('input[type="number"]')) {
            updateQuantity(event);
        }
    });
}

// Initialize page-specific functionality
function initializePage() {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch (currentPage) {
        case 'index.html':
        case '':
            initializeHomePage();
            break;
        case 'crafts.html':
            initializeCraftsPage();
            break;
        case 'cart.html':
            initializeCartPage();
            break;
        case 'checkout.html':
            initializeCheckoutPage();
            break;
        case 'profile.html':
            initializeProfilePage();
            break;
    }
}
```

## Component Guide

### Navigation Component
```html
<!-- Navigation HTML -->
<nav class="nav-container">
    <div class="logo">
        <a href="index.html">
            <img src="logos/logo_trunk_tools.svg" alt="CraftHub">
        </a>
    </div>
    <div class="nav-links">
        <a href="index.html" class="active">Home</a>
        <a href="crafts.html">Browse Crafts</a>
        <a href="categories.html">Categories</a>
        <a href="artists.html">Artists</a>
    </div>
    <div class="nav-actions">
        <a href="cart.html" class="cart-icon">
            <i class="fas fa-shopping-cart"></i>
            <span class="cart-count">0</span>
        </a>
        <a href="login.html" class="btn btn-outline">Login</a>
        <a href="register.html" class="btn btn-primary">Register</a>
    </div>
</nav>
```

```css
/* Navigation CSS */
.nav-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-md) var(--spacing-lg);
    background-color: var(--background-color);
    box-shadow: var(--shadow-sm);
}

.nav-links {
    display: flex;
    gap: var(--spacing-lg);
}

.nav-links a {
    text-decoration: none;
    color: var(--text-color);
    font-weight: 500;
    transition: color 0.2s ease;
}

.nav-links a:hover,
.nav-links a.active {
    color: var(--primary-color);
}

.nav-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
}

.cart-icon {
    position: relative;
    text-decoration: none;
    color: var(--text-color);
}

.cart-count {
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: var(--accent-color);
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-small);
    font-weight: 500;
}
```

### Product Grid Component
```html
<!-- Product Grid HTML -->
<div class="product-grid">
    <div class="product-card">
        <div class="product-image">
            <a href="craft-details.html">
                <img src="images/product.jpg" alt="Product Name">
            </a>
            <div class="product-tags">
                <span class="tag new">New</span>
            </div>
        </div>
        <div class="product-info">
            <h3><a href="craft-details.html">Product Name</a></h3>
            <p class="artist">By Artist Name</p>
            <p class="price">$99.99</p>
            <button class="btn btn-secondary add-to-cart" 
                data-craft-id="1"
                data-craft-name="Product Name"
                data-craft-price="99.99"
                data-craft-image="images/product.jpg">
                Add to Cart
            </button>
        </div>
    </div>
</div>
```

```css
/* Product Grid CSS */
.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--spacing-xl);
    padding: var(--spacing-xl) 0;
}

.product-card {
    background: var(--background-color);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
    transition: all 0.3s ease;
}

.product-card:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-4px);
}

.product-image {
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;
}

.product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
    transform: scale(1.05);
}

.product-info {
    padding: var(--spacing-lg);
}

.product-info h3 {
    margin: 0 0 var(--spacing-sm) 0;
    font-size: var(--font-size-large);
    font-weight: 600;
}

.product-info h3 a {
    text-decoration: none;
    color: var(--text-color);
}

.product-info h3 a:hover {
    color: var(--primary-color);
}

.artist {
    color: var(--text-light);
    font-size: var(--font-size-small);
    margin: 0 0 var(--spacing-sm) 0;
}

.price {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--primary-color);
    margin: 0 0 var(--spacing-md) 0;
}
```

## Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
/* Base styles for mobile (320px and up) */

/* Tablet (768px and up) */
@media (min-width: 768px) {
    .container {
        padding: 0 var(--spacing-lg);
    }
    
    .product-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .nav-container {
        padding: var(--spacing-lg) var(--spacing-xl);
    }
}

/* Desktop (1024px and up) */
@media (min-width: 1024px) {
    .product-grid {
        grid-template-columns: repeat(3, 1fr);
    }
    
    .hero-content {
        max-width: 600px;
    }
}

/* Large Desktop (1200px and up) */
@media (min-width: 1200px) {
    .product-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}
```

### Mobile Navigation
```css
/* Mobile menu toggle */
.mobile-menu-toggle {
    display: none;
    background: none;
    border: none;
    font-size: var(--font-size-xl);
    color: var(--text-color);
    cursor: pointer;
}

@media (max-width: 767px) {
    .mobile-menu-toggle {
        display: block;
    }
    
    .nav-links {
        position: fixed;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100vh;
        background-color: var(--background-color);
        flex-direction: column;
        justify-content: center;
        align-items: center;
        transition: left 0.3s ease;
        z-index: 1000;
    }
    
    .nav-links.active {
        left: 0;
    }
    
    .nav-links a {
        font-size: var(--font-size-xl);
        margin: var(--spacing-md) 0;
    }
}
```

## Browser Compatibility

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### CSS Features Used
- CSS Grid
- CSS Flexbox
- CSS Custom Properties (Variables)
- CSS Transitions and Transforms
- CSS Aspect Ratio
- CSS Object Fit

### JavaScript Features Used
- ES6+ Arrow Functions
- ES6+ Template Literals
- ES6+ Destructuring
- ES6+ Spread Operator
- ES6+ Classes
- ES6+ Modules
- Fetch API
- Local Storage API
- Intersection Observer API

## Performance Optimization

### CSS Optimization
```css
/* Use efficient selectors */
.product-card .product-image img { /* Good */ }
.product-card .product-image .product-image img { /* Avoid */ }

/* Minimize reflows */
.product-card {
    transform: translateZ(0); /* Hardware acceleration */
}

/* Use will-change for animations */
.product-card:hover .product-image img {
    will-change: transform;
}
```

### JavaScript Optimization
```javascript
// Use event delegation
document.addEventListener('click', function(event) {
    if (event.target.closest('.add-to-cart')) {
        addToCart(event);
    }
});

// Debounce expensive operations
const debouncedSearch = debounce(function(searchTerm) {
    performSearch(searchTerm);
}, 300);

// Use Intersection Observer for lazy loading
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});
```

### Image Optimization
```html
<!-- Lazy loading -->
<img src="placeholder.jpg" data-src="actual-image.jpg" class="lazy" alt="Product">

<!-- Responsive images -->
<img srcset="image-320w.jpg 320w,
             image-480w.jpg 480w,
             image-800w.jpg 800w"
     sizes="(max-width: 320px) 280px,
            (max-width: 480px) 440px,
            800px"
     src="image-800w.jpg" alt="Product">
```

---

This frontend documentation provides comprehensive coverage of the HTML structure, CSS styling, and JavaScript functionality for the CraftHub project. For additional questions or clarifications, please refer to the specific component sections or contact the development team. 