// product-detail.js

// Product data (ideally this would come from a server/API)
const productData = {
    'spoon-chair': {
        name: 'Spoon Design Chair',
        price: 140.00,
        description: 'Elegant spoon-shaped chair, perfect for modern interiors.',
        image: 'image/product-1.png'
        // Add other details like thumbnails if needed
    },
    'bunny-sofa': {
        name: 'Bunny Cushion Sofa',
        price: 140.00,
        description: 'Adorable bunny cushion sofa, great for kids rooms or playful spaces.',
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
    'modern-chair': {
        name: 'Modern Wooden Chair',
        price: 140.00,
        description: 'Sleek and stylish modern wooden chair for dining or office use.',
        image: 'image/product-4.png'
    },
    'rainbow-chair': {
        name: 'Rainbow Rocking Chair',
        price: 140.00,
        description: 'A playful rainbow-themed rocking chair perfect for nurseries and playrooms.',
        image: 'image/product-6.png'
    },
    't-handle-chair': {
        name: 'T-Handle Chair',
        price: 140.00,
        description: 'Unique chair design featuring a distinctive T-shaped handle.',
        image: 'image/product-7.png'
    },
    'pouf-chair': {
        name: 'Modern Pouf Chair',
        price: 140.00,
        description: 'Comfortable and versatile pouf chair for casual seating.',
        image: 'image/product-8.png'
    }
    // Add all other products referenced in shop.html data-product-id attributes here
};

// Function to load product data based on URL parameter
function loadProductData() {
    const urlParams = new URLSearchParams(window.location.search);
    // Get the product ID from the '?product=...' query parameter
    const productId = urlParams.get('product');

    // Find the product data using the ID, or default if ID is missing/invalid
    const product = productData[productId] || productData['bunny-sofa']; // Fallback example

    if (product) {
        // --- Corrected Selectors using IDs from product-detail.html ---
        const titleElement = document.getElementById('product-title');
        const priceElement = document.getElementById('product-price');
        const descriptionElement = document.getElementById('product-description');
        const imageElement = document.getElementById('main-image'); // Ensure your main image tag has id="main-image"

        // Update the HTML elements if they exist
        if (titleElement) titleElement.textContent = product.name;
        if (priceElement) priceElement.textContent = `$${product.price.toFixed(2)}`; // Format price
        if (descriptionElement) descriptionElement.textContent = product.description;
        if (imageElement) {
            imageElement.src = product.image;
            imageElement.alt = product.name; // Update alt text for accessibility
        }

        // Optional: Update breadcrumb or other elements if needed
        const breadcrumbProductSpan = document.querySelector('.heading span'); // Assuming this structure exists
        if (breadcrumbProductSpan) {
            breadcrumbProductSpan.textContent = product.name;
        }
         // Update the browser tab title
        document.title = `${product.name} - WoodStory`;

    } else {
        // Handle case where product ID from URL is not found in productData
        console.error('Product not found for ID:', productId);
        // Optionally display a "Product not found" message on the page
        const titleElement = document.getElementById('product-title');
        if (titleElement) titleElement.textContent = "Product Not Found";
        // Clear other fields or hide sections as needed
         document.getElementById('product-price').textContent = '';
         document.getElementById('product-description').textContent = 'Sorry, the product you are looking for could not be found.';
         document.getElementById('main-image').src = ''; // Clear image or set default
         document.getElementById('main-image').alt = 'Product not found';
    }
}


document.addEventListener('DOMContentLoaded', function() {

    // --- Load Product Data ---
    // This function reads the URL parameter and updates the page content
    loadProductData();

    // --- Keep Existing Functionality ---

    // Initialize quantity controls
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.querySelector('.quantity-btn.decrease');
    const increaseBtn = document.querySelector('.quantity-btn.increase');

    if (quantityInput && decreaseBtn && increaseBtn) {
        decreaseBtn.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });

        increaseBtn.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value);
            quantityInput.value = currentValue + 1;
        });

        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
            }
        });
    }

    // Add to cart functionality (placeholder / example)
    const addToCartBtn = document.getElementById('add-to-cart');
    const addToWishlistBtn = document.getElementById('add-to-wishlist');
    const notification = document.querySelector('.product-notification'); // Ensure this element exists in HTML

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const quantity = parseInt(quantityInput ? quantityInput.value : 1);
            console.log(`Added ${quantity} item(s) to cart.`); // Replace with actual cart logic (e.g., calling a function from cart.js)
            // Show notification
            if (notification) {
                notification.classList.add('show');
                setTimeout(() => {
                    notification.classList.remove('show');
                }, 3000); // Hide after 3 seconds
            }
        });
    }

     if (addToWishlistBtn) {
        addToWishlistBtn.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default link behavior if it's an anchor
            console.log('Added item to wishlist.'); // Replace with actual wishlist logic
             // Optional: Add visual feedback like changing the heart icon
             this.classList.toggle('active'); // Example: toggle an 'active' class
             const icon = this.querySelector('i');
             if (icon) {
                 icon.classList.toggle('ri-heart-line');
                 icon.classList.toggle('ri-heart-fill'); // Change to filled heart
             }
        });
    }

    // --- Tab Functionality ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            // Update button states
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Update content visibility
            tabContents.forEach(content => {
                if (content.id === targetTab) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });

    // --- Thumbnail Click Functionality ---
    // Assuming you have thumbnail images like <div class="thumbnail"><img src="..."></div>
    // and a main image like <img id="main-image" src="...">
    const thumbnails = document.querySelectorAll('.thumbnail img');
    const mainImage = document.getElementById('main-image');

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            if (mainImage) {
                mainImage.src = this.src; // Update main image source
                mainImage.alt = this.alt; // Update alt text
            }
            // Optional: Add active state to thumbnail parent div
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            this.closest('.thumbnail').classList.add('active');
        });
    });

});