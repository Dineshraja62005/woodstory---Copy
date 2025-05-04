// checkout.js - Handles checkout page functionality including promo codes

document.addEventListener('DOMContentLoaded', function() {
    // --- DOM Element References ---
    const checkoutForm = document.getElementById('checkout-form');
    const paymentMethods = document.querySelectorAll('.payment-method');
    const creditCardForm = document.getElementById('creditCardForm');
    const paypalInfo = document.getElementById('paypalInfo'); // Assuming you have a div for PayPal info

    // Order Summary Elements
    const orderItemsContainer = document.getElementById('order-items');
    const subtotalElement = document.getElementById('checkout-subtotal');
    const shippingElement = document.getElementById('checkout-shipping');
    const taxElement = document.getElementById('checkout-tax');
    const totalElement = document.getElementById('checkout-total');

    // Promo Code Elements
    const promoCodeInput = document.getElementById('promo-code');
    const applyPromoBtn = document.getElementById('apply-promo-btn');
    const promoMessageElement = document.getElementById('promo-message');
    const discountRow = document.querySelector('.discount-row'); // Target the discount row
    const discountElement = document.getElementById('checkout-discount'); // Target the span inside the discount row

    // --- State Variables ---
    let currentSubtotal = 0;
    let currentShipping = 0;
    let currentTax = 0;
    let currentDiscount = 0;
    let appliedPromoCode = null; // To track the currently applied promo code

    // --- Sample Promo Codes (Replace with backend validation) ---
    const validPromoCodes = {
        "SAVE10": { type: "percentage", value: 10 }, // 10% off
        "WOOD20": { type: "fixed", value: 20 },      // $20 off
        "FREESHIP": { type: "shipping", value: 0 }   // Free shipping
    };
    // -------------------------------------------------------------

    // --- Functions ---

    // Function to update the visibility of payment forms based on selection
    function updatePaymentFormVisibility() {
        const selectedMethod = document.querySelector('.payment-method.active')?.dataset.method; // Use optional chaining

        if (creditCardForm) {
            creditCardForm.style.display = selectedMethod === 'creditCard' ? 'block' : 'none';
             // Add/remove required attribute for card fields based on visibility
            const cardFields = creditCardForm.querySelectorAll('input');
            cardFields.forEach(field => {
                if (selectedMethod === 'creditCard') {
                    field.setAttribute('required', '');
                } else {
                    field.removeAttribute('required');
                }
            });
        }
        if (paypalInfo) {
            paypalInfo.style.display = selectedMethod === 'paypal' ? 'block' : 'none';
        }
        // Add logic for other payment methods if necessary
    }

    // Function to calculate discount based on promo code and current subtotal/shipping
    function calculateDiscount(code) {
        const promo = validPromoCodes[code];
        let calculatedDiscount = 0;
        let freeShipping = false;

        if (!promo) return { discount: 0, freeShipping: false }; // Invalid code

        if (promo.type === "percentage") {
            calculatedDiscount = (currentSubtotal * promo.value) / 100;
        } else if (promo.type === "fixed") {
            // Ensure fixed discount doesn't exceed subtotal
            calculatedDiscount = Math.min(promo.value, currentSubtotal);
        } else if (promo.type === "shipping") {
            freeShipping = true;
            // The discount value itself might be 0 if it only affects shipping
            calculatedDiscount = 0; // Or apply a fixed amount if desired
        }

        return { discount: calculatedDiscount, freeShipping: freeShipping };
    }

    // Function to update all totals displayed in the order summary
    function updateTotalsDisplay() {
        // Recalculate shipping based on subtotal *before* discount, unless free shipping is applied
        const baseShipping = currentSubtotal > 100 ? 0 : 10; // Your base shipping rule
        let freeShippingApplied = false;

        // Apply promo code discount
        let calculatedDiscount = 0;
        if (appliedPromoCode && validPromoCodes[appliedPromoCode]) {
             const promoDetails = calculateDiscount(appliedPromoCode);
             calculatedDiscount = promoDetails.discount;
             freeShippingApplied = promoDetails.freeShipping;
        }
        currentDiscount = calculatedDiscount; // Update global discount state

        // Determine final shipping cost
        currentShipping = freeShippingApplied ? 0 : baseShipping;

        // Recalculate tax based on subtotal *after* discount (common practice, but verify requirements)
        const taxableAmount = Math.max(0, currentSubtotal - currentDiscount);
        currentTax = taxableAmount * 0.07; // 7% tax

        // Calculate final total
        const finalTotal = Math.max(0, currentSubtotal - currentDiscount + currentShipping + currentTax);

        // Update DOM elements
        subtotalElement.textContent = `$${currentSubtotal.toFixed(2)}`;
        shippingElement.textContent = currentShipping === 0 ? 'Free' : `$${currentShipping.toFixed(2)}`;
        taxElement.textContent = `$${currentTax.toFixed(2)}`;

        if (currentDiscount > 0 || freeShippingApplied) {
            discountElement.textContent = `-$${currentDiscount.toFixed(2)}`;
            discountRow.style.display = 'flex'; // Show discount row
        } else {
            discountRow.style.display = 'none'; // Hide discount row
        }

        totalElement.textContent = `$${finalTotal.toFixed(2)}`;
    }


    // Populate order summary from cart data
    function populateOrderSummary() {
        // Ensure cartManager and cart are available
        if (!window.cartManager || !window.cartManager.cart) {
            console.error("Cart manager or cart not found.");
             orderItemsContainer.innerHTML = '<p style="text-align: center; color: #dc3545;">Could not load cart items.</p>';
            return;
        }

        const cart = window.cartManager.cart;
        orderItemsContainer.innerHTML = ''; // Clear previous items or loading message

        // Check if cart is empty
        if (cart.length === 0) {
            orderItemsContainer.innerHTML = '<p style="text-align: center; color: #845f51;">Your cart is empty.</p>';
            // Optionally disable checkout button or redirect
            document.getElementById('place-order-btn').disabled = true;
            document.getElementById('place-order-btn').style.opacity = '0.6';
            document.getElementById('place-order-btn').style.cursor = 'not-allowed';
             // Clear totals if cart becomes empty
            currentSubtotal = 0;
            currentDiscount = 0;
            appliedPromoCode = null;
            updateTotalsDisplay();
            return;
        } else {
             // Ensure button is enabled if cart has items
             document.getElementById('place-order-btn').disabled = false;
             document.getElementById('place-order-btn').style.opacity = '1';
             document.getElementById('place-order-btn').style.cursor = 'pointer';
        }


        currentSubtotal = 0; // Reset subtotal before recalculating

        // Add cart items to order summary
        cart.forEach(item => {
            const orderItem = document.createElement('div');
            orderItem.classList.add('order-item');

            // Basic check for item properties
            const itemName = item.name || 'Unknown Item';
            const itemPrice = typeof item.price === 'number' ? item.price : 0;
            const itemQuantity = typeof item.quantity === 'number' ? item.quantity : 0;
            const itemImage = item.image || 'images/placeholder.png'; // Provide a fallback image

            orderItem.innerHTML = `
                <img src="${itemImage}" alt="${itemName}" class="order-item-image" onerror="this.src='images/placeholder.png'; this.alt='Image not found';"> <div class="order-item-details">
                    <div class="order-item-name">${itemName}</div>
                    <div class="order-item-price">$${itemPrice.toFixed(2)}</div>
                </div>
                <div class="order-item-quantity">${itemQuantity}</div>
            `;

            orderItemsContainer.appendChild(orderItem);
            currentSubtotal += itemPrice * itemQuantity; // Calculate subtotal
        });

        // Update totals display after populating items
        updateTotalsDisplay();
    }

    // Form validation (simplified from original, add more checks as needed)
    function validateForm() {
        let isValid = true;
        const requiredFields = checkoutForm.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            // Check if field is visible (relevant for payment sections)
            const isVisible = !!( field.offsetWidth || field.offsetHeight || field.getClientRects().length );

            if (isVisible && !field.value.trim()) {
                highlightField(field, true);
                isValid = false;
            } else {
                highlightField(field, false);
            }
        });

        // Add specific validations (email, card details) if needed here
        const emailField = document.getElementById('email');
        if (emailField && emailField.value && !isValidEmail(emailField.value)) {
             highlightField(emailField, true);
             isValid = false;
        } else if (emailField) {
             highlightField(emailField, false);
        }

        // Basic card validation if visible
        if (creditCardForm && creditCardForm.style.display !== 'none') {
             const cardNumber = document.getElementById('cardNumber');
             const expDate = document.getElementById('expDate');
             const cvv = document.getElementById('cvv');

             if (cardNumber && !isValidCardNumber(cardNumber.value)) { highlightField(cardNumber, true); isValid = false; } else if (cardNumber) { highlightField(cardNumber, false); }
             if (expDate && !isValidExpDate(expDate.value)) { highlightField(expDate, true); isValid = false; } else if (expDate) { highlightField(expDate, false); }
             if (cvv && !isValidCVV(cvv.value)) { highlightField(cvv, true); isValid = false; } else if (cvv) { highlightField(cvv, false); }
        }


        if (!isValid) {
            alert('Please fill in all required fields correctly.');
        }
        return isValid;
    }

    // Highlight field with error
    function highlightField(field, isError) {
        if (!field) return; // Guard clause
        if (isError) {
            field.classList.add('error'); // Assumes 'error' class exists in CSS for styling
             field.style.borderColor = '#dc3545'; // Example: Add red border
        } else {
            field.classList.remove('error');
             field.style.borderColor = '#caab9f'; // Reset to default border
        }
    }

    // Email validation regex
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

     // Credit card validation (basic Luhn algorithm check can be added)
    function isValidCardNumber(cardNumber) {
        const card = cardNumber.replace(/[\s-]/g, '');
        return /^\d{13,19}$/.test(card); // Basic length check
    }

    // Expiration date validation (MM/YY format, checks if in future)
    function isValidExpDate(expDate) {
        const re = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/; // Allows MM/YY or MMYY
        if (!re.test(expDate)) return false;

        const parts = expDate.match(re);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10); // Last two digits of year

        const now = new Date();
        const currentYearLastTwoDigits = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1; // January is 0

        // Check if year is in the future, or current year and month is not passed
        return (year > currentYearLastTwoDigits) || (year === currentYearLastTwoDigits && month >= currentMonth);
    }

    // CVV validation (3-4 digits)
    function isValidCVV(cvv) {
        return /^\d{3,4}$/.test(cvv);
    }


    // Show processing overlay
    function showProcessingOverlay() {
        // Check if overlay already exists
        if (document.getElementById('processing-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'processing-overlay';
        // Apply styles dynamically (consider moving to CSS if preferred)
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: '9999', opacity: '0', transition: 'opacity 0.3s ease'
        });

        const content = document.createElement('div');
         Object.assign(content.style, {
             backgroundColor: 'white', padding: '2rem 3rem', borderRadius: '1rem',
             textAlign: 'center', color: '#5e473e'
         });
        content.innerHTML = `
            <div class="loader" style="border: 4px solid #f3f3f3; border-top: 4px solid #5e473e; border-radius: 50%; width: 50px; height: 50px; animation: spin 1.5s linear infinite; margin: 0 auto 1rem;"></div>
            <p style="font-size: 1.8rem;">Processing your order...</p>
        `;

        // Add the spinning animation if not already defined globally
        if (!document.getElementById('spin-animation-style')) {
            const style = document.createElement('style');
            style.id = 'spin-animation-style';
            style.innerHTML = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
            document.head.appendChild(style);
        }

        overlay.appendChild(content);
        document.body.appendChild(overlay);
        // Fade in
        setTimeout(() => overlay.style.opacity = '1', 10);
    }

    // Hide processing overlay
    function hideProcessingOverlay() {
        const overlay = document.getElementById('processing-overlay');
        if (overlay) {
             overlay.style.opacity = '0';
             setTimeout(() => overlay.remove(), 300); // Remove after fade out
        }
    }

    // Show success message
    function showSuccessMessage() {
         if (document.getElementById('success-overlay')) return; // Prevent multiple overlays

        const overlay = document.createElement('div');
        overlay.id = 'success-overlay';
         Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: '9999', opacity: '0', transition: 'opacity 0.3s ease'
        });

        const content = document.createElement('div');
         Object.assign(content.style, {
             backgroundColor: 'white', padding: '3rem', borderRadius: '1rem',
             textAlign: 'center', color: '#5e473e'
         });
        content.innerHTML = `
            <i class="ri-checkbox-circle-fill" style="font-size: 5rem; color: #28a745; margin-bottom: 1rem;"></i>
            <h3 style="font-size: 2.5rem; margin-bottom: 1rem;">Order Successful!</h3>
            <p style="font-size: 1.8rem; color: #845f51; margin-bottom: 0.5rem;">Thank you for shopping with WoodStory.</p>
            <p style="font-size: 1.6rem; color: #845f51;">Redirecting to home page...</p>
        `;

        overlay.appendChild(content);
        document.body.appendChild(overlay);
         // Fade in
        setTimeout(() => overlay.style.opacity = '1', 10);
    }

    // --- Event Listeners ---

    // Payment Method Selection
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            paymentMethods.forEach(m => m.classList.remove('active'));
            this.classList.add('active');
            updatePaymentFormVisibility(); // Update visible form section
        });
    });

    // Apply Promo Code Button Click
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', () => {
            const code = promoCodeInput.value.trim().toUpperCase();
            promoMessageElement.textContent = ''; // Clear previous messages
            promoMessageElement.className = 'promo-message'; // Reset class

            if (!code) {
                promoMessageElement.textContent = 'Please enter a promo code.';
                promoMessageElement.classList.add('error');
                return;
            }

            // **IMPORTANT:** Replace client-side check with backend validation via fetch
            if (validPromoCodes[code]) {
                // Check if this code is already applied
                 if (appliedPromoCode === code) {
                    promoMessageElement.textContent = `Promo code '${code}' is already applied.`;
                    promoMessageElement.classList.add('info');
                    return;
                 }

                // Apply the new code
                appliedPromoCode = code;
                updateTotalsDisplay(); // Recalculate totals with the new code
                promoMessageElement.textContent = `Promo code '${code}' applied successfully!`;
                promoMessageElement.classList.add('success');
                promoCodeInput.disabled = true; // Optional: disable input
                applyPromoBtn.disabled = true;   // Optional: disable button
                applyPromoBtn.textContent = 'Applied'; // Change button text

            } else {
                // If an invalid code is entered, potentially remove existing discount?
                // currentDiscount = 0;
                // appliedPromoCode = null;
                // updateTotalsDisplay(); // Uncomment to remove discount on invalid attempt
                promoMessageElement.textContent = 'Invalid promo code.';
                promoMessageElement.classList.add('error');
            }
        });
    } else {
         console.error("Apply Promo Button not found");
    }

     // Optional: Allow removing promo code
     // Add a 'Remove' button next to the promo message or re-enable the 'Apply' button
     // If re-enabling 'Apply', clear the appliedPromoCode and currentDiscount on input change maybe?


    // Form Submission
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default submission

            if (!validateForm()) { // Validate form first
                return;
            }

            // Gather form data (more robustly)
            const formData = new FormData(checkoutForm);
            const billingDetails = {};
            // Filter out card details if not the selected payment method
             const selectedMethod = document.querySelector('.payment-method.active')?.dataset.method;
             const includeCardDetails = selectedMethod === 'creditCard';

            formData.forEach((value, key) => {
                 const isCardField = ['cardName', 'cardNumber', 'expDate', 'cvv'].includes(key);
                 if (!isCardField || includeCardDetails) {
                    billingDetails[key] = value;
                 }
            });


            // Get cart details (ensure cartManager is loaded)
            const cart = window.cartManager ? window.cartManager.cart : [];
            if (cart.length === 0) {
                alert('Your cart is empty. Cannot place order.');
                return;
            }

            // Construct order data, including promo info
            const orderData = {
                billingDetails: billingDetails,
                items: cart.map(item => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price })), // Send relevant item data
                subtotal: currentSubtotal,
                shipping: currentShipping,
                tax: currentTax,
                discount: currentDiscount,
                promoCode: appliedPromoCode, // Include applied promo code
                total: Math.max(0, currentSubtotal - currentDiscount + currentShipping + currentTax), // Recalculate just in case
                paymentMethod: selectedMethod
            };

            console.log('Order Data Prepared:', orderData); // For debugging

            // **IMPORTANT:** Send `orderData` to your backend (PHP/Node/etc.) via fetch
            // fetch('/api/place-order', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(orderData)})
            // .then(response => response.json()).then(data => { ... handle success/error ... });

            // --- Simulation ---
            showProcessingOverlay();
            setTimeout(() => {
                hideProcessingOverlay();
                showSuccessMessage();
                // Clear cart and redirect after success message delay
                setTimeout(() => {
                    if (window.cartManager) {
                        window.cartManager.clearCart(); // Clear cart from local storage
                    }
                    // Redirect to home or a dedicated order confirmation page
                    window.location.href = 'home.html';
                }, 3000); // Wait 3 seconds after showing success message
            }, 2000); // Simulate 2 seconds processing time
            // --- End Simulation ---
        });
    } else {
         console.error("Checkout Form not found");
    }


    // --- Initial Setup ---
    populateOrderSummary(); // Load cart items and calculate initial totals
    updatePaymentFormVisibility(); // Set initial visibility for payment forms

}); // End DOMContentLoaded
