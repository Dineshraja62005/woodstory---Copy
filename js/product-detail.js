// js/product-detail.js

// Product data (Ensure this object is complete and accurate)
const productData = {
    'spoon-chair': {
        id: 'spoon-chair', name: 'Spoon Design Chair', price: 140.00,
        description: 'Elegant spoon-shaped chair, perfect for modern interiors. Crafted with high-quality materials for durability and comfort.',
        image: 'image/product-1.png', category: 'Chairs', tags: ['modern', 'designer', 'spoon', 'unique'], availability: 'In Stock', sku: 'CHR-SPN-001',
        thumbnails: ['image/product-1.png', 'image/thumb-spoon-side.png', 'image/thumb-spoon-back.png'],
        features: ['Ergonomic design', 'Durable polypropylene shell', 'Solid wood legs', 'Easy assembly'],
        specifications: { 'Dimensions': '32" H x 18" W x 20" D', 'Seat Height': '17.5"', 'Material': 'Polypropylene, Wood', 'Weight Capacity': '250 lbs' },
        colors: [{ name: 'White', value: '#FFFFFF' }, { name: 'Black', value: '#000000' }, { name: 'Grey', value: '#808080' }],
        sizes: ['One Size']
    },
    'bunny-sofa': {
        id: 'bunny-sofa', name: 'Bunny Cushion Sofa', price: 140.00,
        description: 'Adorable bunny cushion sofa, great for kids rooms or playful spaces. Soft, huggable, and easy to clean.',
        image: 'image/product-2.png', category: 'Kids Furniture', tags: ['bunny', 'cushion', 'children', 'soft', 'playroom'], availability: 'In Stock', sku: 'KID-SOFA-BUN-001',
        thumbnails: ['image/product-2.png', 'image/product-5.png', 'image/product-3.png', 'image/product-6.png'],
        features: ['Premium soft fabric cover', 'High-density foam filling', 'Removable and washable cover', 'Non-slip bottom surface', 'Child-friendly materials'],
        specifications: { 'Dimensions': '24" W x 18" D x 20" H (Medium)', 'Material': 'Polyester Plush, Foam', 'Recommended Age': '2+ years', 'Weight': '3.5 lbs' },
        colors: [{ name: 'Pink', value: '#F8DFD2' }, { name: 'Blue', value: '#E1EBF2' }, { name: 'Green', value: '#D8E4D5' }, { name: 'Beige', value: '#F2E9D8' }],
        sizes: ['Small', 'Medium', 'Large']
    },
     'bear-sofa': {
        id: 'bear-sofa', name: 'Bear Cushion Sofa', price: 140.00,
        description: 'A cozy bear-shaped cushion sofa that adds character and warmth to any room. Perfect for snuggling and reading.',
        image: 'image/product-5.png', category: 'Kids Furniture', tags: ['bear', 'cushion', 'children', 'cozy', 'brown'], availability: 'In Stock', sku: 'KID-SOFA-BEAR-001',
        thumbnails: ['image/product-5.png', 'image/thumb-bear-side.png'],
        features: ['Soft teddy fabric', 'Supportive foam filling', 'Friendly bear design', 'Lightweight and portable'],
        specifications: { 'Dimensions': '25" W x 19" D x 21" H', 'Material': 'Teddy Fabric, Foam', 'Recommended Age': '2+ years' },
        colors: [{ name: 'Brown', value: '#A0522D' }, { name: 'Cream', value: '#FFFDD0' }],
        sizes: ['One Size']
    },
    'coconut-sofa': {
        id: 'coconut-sofa', name: 'Coconut Cushion Sofa', price: 140.00,
        description: 'A natural-inspired coconut design sofa with white cushions for your living space. Brings a touch of the tropics indoors.',
        image: 'image/product-3.png', category: 'Sofas', tags: ['coconut', 'cushion', 'modern', 'natural', 'tropical'], availability: 'Limited Stock', sku: 'SOFA-COCO-001',
        thumbnails: ['image/product-3.png'],
        features: ['Unique coconut shell inspired base', 'Plush white seat cushions', 'Durable construction', 'Statement piece'],
        specifications: { 'Dimensions': '60" W x 30" D x 28" H', 'Material': 'Resin base, Fabric cushions', 'Seating Capacity': '2' },
        colors: [{ name: 'Natural/White', value: '#FFFFFF' }], // Example color
        sizes: ['One Size']
    },
     'modern-chair': {
        id: 'modern-chair', name: 'Modern Wooden Chair', price: 140.00,
        description: 'Sleek and stylish modern wooden chair for dining or office use. Combines minimalist design with natural materials.',
        image: 'image/product-4.png', category: 'Chairs', tags: ['modern', 'wooden', 'dining', 'office', 'minimalist'], availability: 'In Stock', sku: 'CHR-MODW-001',
        thumbnails: ['image/product-4.png'],
        features: ['Solid wood construction', 'Comfortable curved backrest', 'Mid-century modern style', 'Versatile use'],
        specifications: { 'Dimensions': '30" H x 19" W x 21" D', 'Seat Height': '18"', 'Material': 'Solid Ash Wood', 'Finish': 'Natural Oil' },
        colors: [{ name: 'Natural Ash', value: '#D2B48C' }, { name: 'Walnut Stain', value: '#5C4033' }],
        sizes: ['One Size']
    },
    'rainbow-chair': {
        id: 'rainbow-chair', name: 'Rainbow Rocking Chair', price: 140.00,
        description: 'A playful rainbow-themed rocking chair perfect for nurseries and playrooms. Brightens up any space.',
        image: 'image/product-6.png', category: 'Kids Furniture', tags: ['rainbow', 'rocking', 'children', 'playful', 'colorful'], availability: 'In Stock', sku: 'KID-ROCK-RAIN-001',
        thumbnails: ['image/product-6.png'],
        features: ['Vibrant rainbow colors', 'Gentle rocking motion', 'Sturdy wooden construction', 'Child-safe paint'],
        specifications: { 'Dimensions': '22" H x 15" W x 24" D', 'Material': 'Solid Wood', 'Recommended Age': '1-4 years' },
        colors: [{ name: 'Rainbow', value: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)' }], // Example gradient
        sizes: ['One Size']
    },
    't-handle-chair': {
        id: 't-handle-chair', name: 'T-Handle Chair', price: 140.00,
        description: 'Unique chair design featuring a distinctive T-shaped handle for easy movement and a modern aesthetic.',
        image: 'image/product-7.png', category: 'Chairs', tags: ['modern', 'unique', 'handle', 'designer'], availability: 'Out of Stock', sku: 'CHR-THAN-001',
        thumbnails: ['image/product-7.png'],
        features: ['Integrated T-handle', 'Stackable design', 'Durable plastic seat', 'Metal legs'],
        specifications: { 'Dimensions': '31" H x 20" W x 20" D', 'Material': 'Plastic, Metal', 'Color': 'White' },
        colors: [{ name: 'White', value: '#FFFFFF' }, { name: 'Black', value: '#000000' }],
        sizes: ['One Size']
    },
    'pouf-chair': {
        id: 'pouf-chair', name: 'Modern Pouf Chair', price: 140.00,
        description: 'Comfortable and versatile pouf chair for casual seating. Adds a relaxed vibe to living rooms or bedrooms.',
        image: 'image/product-8.png', category: 'Chairs', tags: ['pouf', 'modern', 'casual', 'seating', 'ottoman'], availability: 'In Stock', sku: 'CHR-POUF-001',
        thumbnails: ['image/product-8.png'],
        features: ['Soft knit cover', 'Polystyrene bead filling', 'Lightweight and easy to move', 'Can be used as footrest or seat'],
        specifications: { 'Dimensions': '16" H x 20" Diameter', 'Material': 'Cotton Knit, Polystyrene Beads', 'Color': 'Grey' },
        colors: [{ name: 'Grey', value: '#808080' }, { name: 'Navy', value: '#000080' }, { name: 'Mustard', value: '#FFDB58' }],
        sizes: ['One Size']
    }
};

// Function to load product data based on URL parameter
function loadProductData() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');
    const product = productData[productId];

    // Get references to page elements
    const titleElement = document.getElementById('product-title');
    const priceElement = document.getElementById('product-price');
    const descriptionContainer = document.querySelector('.product-description'); // Target the container div
    const descriptionPlaceholder = document.getElementById('description-placeholder'); // Target the placeholder P tag
    const imageElement = document.getElementById('main-image');
    const breadcrumbProductSpan = document.getElementById('product-name-breadcrumb');
    const productNameMiniSpan = document.getElementById('product-name-mini');
    const categoryBreadcrumbLink = document.querySelector('.heading p a:nth-of-type(2)');
    const miniCategoryBreadcrumbLink = document.querySelector('.product-info .breadcrumb a:first-of-type');
    const featuresList = document.querySelector('.product-features ul');
    const availabilityMeta = document.querySelector('.product-meta-accordion details:nth-of-type(4) .meta-value');
    const skuMeta = document.querySelector('.product-meta-accordion details:nth-of-type(1) .meta-value');
    const categoryMeta = document.querySelector('.product-meta-accordion details:nth-of-type(2) .meta-value');
    const tagsMeta = document.querySelector('.product-meta-accordion details:nth-of-type(3) .meta-value');
    const thumbnailContainer = document.querySelector('.gallery-thumbnails');
    const specificationsContainer = document.querySelector('#specifications .specifications-list');
    const descriptionTabContent = document.querySelector('#description');
    const colorsContainer = document.querySelector('.colors-container');
    const sizesContainer = document.querySelector('.size-options');


    // --- **MODIFICATION: Remove placeholder text first** ---
    if (descriptionPlaceholder) {
        descriptionPlaceholder.remove(); // Remove the "Loading..." paragraph
    }
    // --- End Modification ---

    if (product) {
        // --- Product FOUND - Update page content ---
        if (titleElement) titleElement.textContent = product.name;
        if (priceElement) priceElement.textContent = `$${product.price.toFixed(2)}`;

        // Update Description (add new paragraph)
        if (descriptionContainer && product.description) {
            const descP = document.createElement('p');
            descP.textContent = product.description;
            descriptionContainer.appendChild(descP); // Append the actual description
        }
         // Also update the description in the Description Tab
        if (descriptionTabContent && product.description) {
             const tabDescP = descriptionTabContent.querySelector('p'); // Find existing p or create new
             if (tabDescP) {
                 tabDescP.textContent = product.description; // Update existing
             } else {
                 const newTabP = document.createElement('p');
                 newTabP.textContent = product.description;
                 const tabH3 = descriptionTabContent.querySelector('h3');
                 if (tabH3) tabH3.insertAdjacentElement('afterend', newTabP); // Insert after title
                 else descriptionTabContent.appendChild(newTabP); // Fallback
             }
         }


        if (imageElement) {
            imageElement.src = product.image || 'image/placeholder.png';
            imageElement.alt = product.name;
            imageElement.onerror = () => { imageElement.src = 'image/placeholder.png'; imageElement.alt = 'Image not available'; };
        }
        if (breadcrumbProductSpan) breadcrumbProductSpan.textContent = product.name;
        if (productNameMiniSpan) productNameMiniSpan.textContent = product.name;

        if (product.category) {
            if (categoryBreadcrumbLink) categoryBreadcrumbLink.textContent = product.category;
            if (miniCategoryBreadcrumbLink) miniCategoryBreadcrumbLink.textContent = product.category;
        }

        if (featuresList && product.features && Array.isArray(product.features)) {
            featuresList.innerHTML = '';
            product.features.forEach(feature => {
                const li = document.createElement('li');
                li.textContent = feature;
                featuresList.appendChild(li);
            });
        } else if (featuresList) {
             featuresList.innerHTML = '<li>Details not available.</li>'; // Placeholder if no features
        }


        // Update Meta Information (Accordion)
        if (skuMeta) skuMeta.textContent = product.sku || 'N/A';
        if (categoryMeta && product.category) categoryMeta.innerHTML = `<a href="#">${product.category}</a>`;
        else if (categoryMeta) categoryMeta.textContent = 'N/A';
        if (tagsMeta && product.tags && Array.isArray(product.tags)) tagsMeta.innerHTML = product.tags.map(tag => `<a href="#">${tag}</a>`).join(', ');
        else if (tagsMeta) tagsMeta.textContent = 'N/A';
        if (availabilityMeta) availabilityMeta.textContent = product.availability || 'N/A';


        // Update Thumbnails
        if (thumbnailContainer && product.thumbnails && Array.isArray(product.thumbnails)) {
            thumbnailContainer.innerHTML = '';
            product.thumbnails.forEach((thumbUrl, index) => {
                const thumbDiv = document.createElement('div');
                thumbDiv.classList.add('thumbnail');
                if (index === 0) thumbDiv.classList.add('active');
                thumbDiv.dataset.image = thumbUrl;

                const thumbImg = document.createElement('img');
                thumbImg.src = thumbUrl;
                thumbImg.alt = `${product.name} - Thumbnail ${index + 1}`;
                thumbImg.onerror = () => { thumbImg.src = 'image/placeholder.png'; };

                thumbDiv.appendChild(thumbImg);
                thumbnailContainer.appendChild(thumbDiv);
            });
            setupThumbnailClickListeners(); // Re-attach listeners
        } else if (thumbnailContainer) {
             thumbnailContainer.innerHTML = ''; // Clear if no thumbnails
        }

         // Update Color Options
        if (colorsContainer && product.colors && Array.isArray(product.colors)) {
            colorsContainer.innerHTML = ''; // Clear existing
            product.colors.forEach((color, index) => {
                const colorDiv = document.createElement('div');
                colorDiv.classList.add('color-option');
                if (index === 0) colorDiv.classList.add('selected'); // Select first by default
                colorDiv.style.backgroundColor = color.value; // Use color value for background
                colorDiv.dataset.color = color.name;
                colorDiv.title = color.name; // Tooltip for color name
                colorsContainer.appendChild(colorDiv);
            });
            setupColorOptionListeners(); // Add listeners for color selection
        } else if (colorsContainer) {
            colorsContainer.parentElement.style.display = 'none'; // Hide color section if no colors
        }

        // Update Size Options
        if (sizesContainer && product.sizes && Array.isArray(product.sizes)) {
            sizesContainer.innerHTML = ''; // Clear existing
            product.sizes.forEach((size, index) => {
                const sizeDiv = document.createElement('div');
                sizeDiv.classList.add('size-option');
                if (index === 0) sizeDiv.classList.add('selected'); // Select first by default
                sizeDiv.textContent = size;
                sizeDiv.dataset.size = size;
                sizesContainer.appendChild(sizeDiv);
            });
            setupSizeOptionListeners(); // Add listeners for size selection
        } else if (sizesContainer) {
             sizesContainer.parentElement.style.display = 'none'; // Hide size section if no sizes
        }


        // Update Specifications Tab
        if (specificationsContainer && product.specifications) {
             specificationsContainer.innerHTML = '';
             for (const key in product.specifications) {
                 const specItem = document.createElement('div');
                 specItem.classList.add('spec-item');
                 specItem.innerHTML = `<div class="spec-name">${key}:</div><div class="spec-value">${product.specifications[key]}</div>`;
                 specificationsContainer.appendChild(specItem);
             }
         } else if (specificationsContainer) {
             specificationsContainer.innerHTML = '<p>No specifications available.</p>';
         }

        document.title = `${product.name} - WoodStory`;

    } else {
        // --- Product NOT FOUND ---
        console.error('Product not found for ID:', productId);
        if (titleElement) titleElement.textContent = "Product Not Found";
        if (priceElement) priceElement.closest('.product-price-container')?.remove();
        if (descriptionContainer) descriptionContainer.innerHTML = '<p>Sorry, the product you are looking for could not be found.</p>';
        if (imageElement) { imageElement.src = 'image/placeholder.png'; imageElement.alt = 'Product not found'; }
        if (breadcrumbProductSpan) breadcrumbProductSpan.textContent = "Not Found";
        if (productNameMiniSpan) productNameMiniSpan.textContent = "Not Found";
        if (categoryBreadcrumbLink) categoryBreadcrumbLink.textContent = "Shop";
        if (miniCategoryBreadcrumbLink) miniCategoryBreadcrumbLink.textContent = "Shop";
        document.title = "Product Not Found - WoodStory";
        // Hide sections
        document.querySelector('.product-rating')?.remove();
        document.querySelector('.product-features')?.remove();
        document.querySelector('.options-section')?.remove(); // Hide colors/sizes container
        document.querySelector('.actions-section')?.remove(); // Hide quantity/buttons container
        document.querySelector('.delivery-info')?.remove();
        document.querySelector('.product-meta-accordion')?.remove();
        document.querySelector('.product-tabs')?.remove();
        document.querySelector('.related-products')?.remove();
        if(thumbnailContainer) thumbnailContainer.innerHTML = '';
    }
}

// Function to set up thumbnail click listeners
function setupThumbnailClickListeners() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => {
        thumb.removeEventListener('click', handleThumbnailClick);
        thumb.addEventListener('click', handleThumbnailClick);
    });
}

// Handler function for thumbnail clicks
function handleThumbnailClick() {
    const mainImage = document.getElementById('main-image');
    if (mainImage) {
        mainImage.src = this.dataset.image || this.querySelector('img')?.src || 'image/placeholder.png';
        mainImage.alt = this.querySelector('img')?.alt || 'Product Image';
    }
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
}

// Function to set up color option listeners
function setupColorOptionListeners() {
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.removeEventListener('click', handleColorOptionClick); // Prevent duplicates
        option.addEventListener('click', handleColorOptionClick);
    });
}

// Handler for color option clicks
function handleColorOptionClick() {
    document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
    this.classList.add('selected');
    console.log('Selected color:', this.dataset.color); // For debugging or further logic
}

// Function to set up size option listeners
function setupSizeOptionListeners() {
    const sizeOptions = document.querySelectorAll('.size-option');
    sizeOptions.forEach(option => {
        option.removeEventListener('click', handleSizeOptionClick); // Prevent duplicates
        option.addEventListener('click', handleSizeOptionClick);
    });
}

// Handler for size option clicks
function handleSizeOptionClick() {
    document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
    this.classList.add('selected');
    console.log('Selected size:', this.dataset.size); // For debugging or further logic
}


// --- DOMContentLoaded Event Listener ---
document.addEventListener('DOMContentLoaded', function() {
    loadProductData(); // Load data initially

    // Initialize quantity controls (if product loaded successfully)
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.querySelector('.quantity-btn.decrease');
    const increaseBtn = document.querySelector('.quantity-btn.increase');

    if (quantityInput && decreaseBtn && increaseBtn) {
        decreaseBtn.addEventListener('click', () => {
            let val = parseInt(quantityInput.value);
            if (val > 1) quantityInput.value = val - 1;
        });
        increaseBtn.addEventListener('click', () => {
            let val = parseInt(quantityInput.value);
            // Add max check if needed: if (val < quantityInput.max)
            quantityInput.value = val + 1;
        });
        quantityInput.addEventListener('change', () => {
            let val = parseInt(quantityInput.value);
            if (isNaN(val) || val < 1) quantityInput.value = 1;
            // Add max check if needed
        });
    }

    // Add to cart button listener (if button exists)
    const addToCartBtn = document.getElementById('add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            if (window.cartManager) {
                const urlParams = new URLSearchParams(window.location.search);
                const productId = urlParams.get('product');
                const product = productData[productId];
                if (product && quantityInput) {
                    const quantity = parseInt(quantityInput.value);
                    // Get selected color/size if applicable
                    const selectedColor = document.querySelector('.color-option.selected')?.dataset.color;
                    const selectedSize = document.querySelector('.size-option.selected')?.dataset.size;
                    // You might want to pass color/size to addToCart or handle variations there
                    console.log(`Adding ${quantity} of ${product.name} (Color: ${selectedColor}, Size: ${selectedSize})`);
                    window.cartManager.addToCart(product, quantity);
                } else {
                    alert("Could not add item. Product data missing.");
                }
            } else {
                alert("Cart functionality unavailable.");
            }
        });
    }

    // Wishlist button listener (if button exists)
     const addToWishlistBtn = document.getElementById('add-to-wishlist');
     if (addToWishlistBtn) {
        addToWishlistBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Toggled wishlist.');
            const icon = addToWishlistBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('ri-heart-line');
                icon.classList.toggle('ri-heart-fill');
                addToWishlistBtn.classList.toggle('active'); // Optional class for styling active state
            }
            // Add actual wishlist logic here (e.g., save to localStorage or send to backend)
        });
    }

    // Tab functionality (if tabs exist)
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');
                tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                tabContents.forEach(content => {
                    content.classList.toggle('active', content.id === targetTab);
                });
            });
        });
    }

    // Initial setup for thumbnail listeners (might be called again in loadProductData if dynamic)
    setupThumbnailClickListeners();
    setupColorOptionListeners();
    setupSizeOptionListeners();

}); // End DOMContentLoaded
