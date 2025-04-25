// Simple product detail page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize quantity controls
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.querySelector('.quantity-btn.decrease');
    const increaseBtn = document.querySelector('.quantity-btn.increase');
    
    if (quantityInput && decreaseBtn && increaseBtn) {
        // Decrease quantity
        decreaseBtn.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
        
        // Increase quantity
        increaseBtn.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value);
            quantityInput.value = currentValue + 1;
        });
        
        // Validate manual input
        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
            }
        });
    }
    
    // Add to cart functionality
    const addToCartBtn = document.getElementById('add-to-cart');
    const addToWishlistBtn = document.getElementById('add-to-wishlist');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const quantity = parseInt(quantityInput.value) || 1;
            const productName = document.querySelector('.product-name').textContent;
            const productPrice = parseFloat(document.querySelector('.product-price').textContent.replace('$', ''));
            const productImage = document.querySelector('.product-image img').src;
            
            // Create product object
            const product = {
                id: getProductIdFromUrl(),
                name: productName,
                price: productPrice,
                image: productImage
            };
            
            // Add to cart using cart manager if available
            if (window.cartManager) {
                window.cartManager.addToCart(product, quantity);
            } else {
                // Fallback if cart manager is not available
                showNotification(`Added ${quantity} ${productName}(s) to cart`);
            }
        });
    }
    
    // Add to wishlist functionality
    if (addToWishlistBtn) {
        addToWishlistBtn.addEventListener('click', function() {
            const productName = document.querySelector('.product-name').textContent;
            showNotification(`Added ${productName} to wishlist`);
            
            // Toggle heart icon
            const heartIcon = this.querySelector('i');
            if (heartIcon.classList.contains('ri-heart-line')) {
                heartIcon.classList.remove('ri-heart-line');
                heartIcon.classList.add('ri-heart-fill');
            } else {
                heartIcon.classList.remove('ri-heart-fill');
                heartIcon.classList.add('ri-heart-line');
            }
        });
    }
    
    // Load product data based on URL
    loadProductData();
});

// Helper function to get product ID from URL
function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('product') || 'bunny-sofa';
}

// Show notification
function showNotification(message) {
    // Check for existing notification
    let notification = document.querySelector('.product-notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.classList.add('product-notification');
        document.body.appendChild(notification);
    }
    
    // Set message and show notification
    notification.textContent = message;
    notification.classList.add('show');
    
    // Hide notification after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Load product data based on URL parameter
function loadProductData() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product') || 'bunny-sofa';
    
    // Product data mapping - this would ideally come from a database
    const productData = {
        'bunny-sofa': {
            name: 'Bunny Cushion Sofa',
            price: 140.00,
            description: 'A cute and comfortable bunny-shaped cushion sofa, ideal for children\'s rooms and playful spaces.',
            image: 'image/product-2.png'
        },
        'bear-sofa': {
            name: 'Bear Cushion Sofa',
            price: 140.00,
            description: 'A cozy bear-shaped cushion sofa that adds character and warmth to any room.',
            image: 'image/product-5.png'
        },
        'coconut-sofa': {
            name: 'Coconut Cushion Sofa',
            price: 140.00,
            description: 'A natural-inspired coconut design sofa with white cushions for your living space.',
            image: 'image/product-3.png'
        },
        'rainbow-chair': {
            name: 'Rainbow Rocking Chair',
            price: 140.00,
            description: 'A playful rainbow-themed rocking chair perfect for nurseries and playrooms.',
            image: 'image/product-6.png'
        }
    };
    
    // Get product data
    const product = productData[productId];
    
    if (product) {
        // Update page elements
        document.querySelector('.product-name').textContent = product.name;
        document.querySelector('.product-price').textContent = `$${product.price.toFixed(2)}`;
        document.querySelector('.product-description p').textContent = product.description;
        document.querySelector('.product-image img').src = product.image;
        document.querySelector('.product-image img').alt = product.name;
        
        // Update page title
        document.title = `${product.name} - WoodStory`;
    }
}