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

    // --- Sample Promo Codes (Replace with backend validation eventually) ---
    // IMPORTANT: This client-side validation is insecure and only for testing.
    // Real validation MUST happen on the server (in PHP).
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
                // Only require card details if credit card is selected AND the form is visible
                if (selectedMethod === 'creditCard' && creditCardForm.style.display !== 'none') {
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
    // NOTE: This is client-side calculation, primarily for display. The server should recalculate.
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
        const baseShipping = currentSubtotal > 100 ? 0 : 10; // Example shipping rule: Free over $100, else $10
        let freeShippingApplied = false;

        // Apply promo code discount (client-side calculation for display)
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
        currentTax = taxableAmount * 0.07; // Example: 7% tax rate

        // Calculate final total
        const finalTotal = Math.max(0, currentSubtotal - currentDiscount + currentShipping + currentTax);

        // Update DOM elements
        subtotalElement.textContent = `$${currentSubtotal.toFixed(2)}`;
        shippingElement.textContent = currentShipping === 0 ? 'Free' : `$${currentShipping.toFixed(2)}`;
        taxElement.textContent = `$${currentTax.toFixed(2)}`;

        // Show/hide discount row based on whether a discount or free shipping is applied
        if (currentDiscount > 0 || freeShippingApplied) {
            discountElement.textContent = `-$${currentDiscount.toFixed(2)}`;
            discountRow.style.display = 'flex'; // Show discount row
        } else {
            discountRow.style.display = 'none'; // Hide discount row
        }

        totalElement.textContent = `$${finalTotal.toFixed(2)}`;
    }


    // Populate order summary from cart data stored by cart.js (assumes window.cartManager)
    function populateOrderSummary() {
        // Ensure cartManager and cart are available (loaded by cart.js)
        if (!window.cartManager || !window.cartManager.cart) {
            console.error("Cart manager or cart not found. Ensure cart.js is loaded before checkout.js and initializes window.cartManager.");
             orderItemsContainer.innerHTML = '<p style="text-align: center; color: #dc3545;">Could not load cart items.</p>';
            // Disable checkout if cart cannot be loaded
            document.getElementById('place-order-btn').disabled = true;
            document.getElementById('place-order-btn').style.opacity = '0.6';
            document.getElementById('place-order-btn').style.cursor = 'not-allowed';
            return;
        }

        const cart = window.cartManager.cart;
        orderItemsContainer.innerHTML = ''; // Clear previous items or loading message

        // Check if cart is empty
        if (cart.length === 0) {
            orderItemsContainer.innerHTML = '<p style="text-align: center; color: #845f51;">Your cart is empty.</p>';
            // Disable checkout button if cart is empty
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

            // Basic check for item properties - ensure these exist in your cart item objects
            const itemName = item.name || 'Unknown Item';
            const itemPrice = typeof item.price === 'number' ? item.price : 0;
            const itemQuantity = typeof item.quantity === 'number' ? item.quantity : 0;
            const itemImage = item.image || 'images/placeholder.png'; // Provide a fallback image
            // Get product ID - ensure it exists in your cart item object
            const itemId = item.id || null; // Use null if ID is missing

            orderItem.innerHTML = `
                <img src="${itemImage}" alt="${itemName}" class="order-item-image" onerror="this.src='images/placeholder.png'; this.alt='Image not found';">
                <div class="order-item-details">
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

    // Form validation function
    function validateForm() {
        let isValid = true;
        const requiredFields = checkoutForm.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            // Check if field is visible (relevant for payment sections)
            const isVisible = !!( field.offsetWidth || field.offsetHeight || field.getClientRects().length );

            if (isVisible && !field.value.trim()) {
                highlightField(field, true); // Add error highlight
                isValid = false;
            } else {
                highlightField(field, false); // Remove error highlight
            }
        });

        // Add specific validations (email format)
        const emailField = document.getElementById('email');
        if (emailField && emailField.value && !isValidEmail(emailField.value)) {
             highlightField(emailField, true);
             isValid = false;
        } else if (emailField && emailField.value) { // Only reset if it has a value and is valid
             highlightField(emailField, false);
        }

        // Basic card validation if credit card section is visible and selected
        const selectedMethod = document.querySelector('.payment-method.active')?.dataset.method;
        if (selectedMethod === 'creditCard' && creditCardForm && creditCardForm.style.display !== 'none') {
             const cardNumber = document.getElementById('cardNumber');
             const expDate = document.getElementById('expDate');
             const cvv = document.getElementById('cvv');

             // Validate only if the fields exist and have values (they are required by this point if visible)
             if (cardNumber && !isValidCardNumber(cardNumber.value)) { highlightField(cardNumber, true); isValid = false; } else if (cardNumber) { highlightField(cardNumber, false); }
             if (expDate && !isValidExpDate(expDate.value)) { highlightField(expDate, true); isValid = false; } else if (expDate) { highlightField(expDate, false); }
             if (cvv && !isValidCVV(cvv.value)) { highlightField(cvv, true); isValid = false; } else if (cvv) { highlightField(cvv, false); }
        }


        if (!isValid) {
            // Optionally scroll to the first invalid field
            const firstError = checkoutForm.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            alert('Please fill in all required fields correctly.');
        }
        return isValid;
    }

    // Helper function to add/remove error styling
    function highlightField(field, isError) {
        if (!field) return; // Guard clause
        if (isError) {
            field.classList.add('error'); // Assumes 'error' class exists in CSS for styling
             // Optionally add specific style like border color if class isn't enough
             field.style.borderColor = '#dc3545'; // Example: Bootstrap danger red
        } else {
            field.classList.remove('error');
             field.style.borderColor = ''; // Reset to default border (or use your default color like '#caab9f')
        }
    }

    // Basic email format validation
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

     // Basic credit card number validation (length check)
    function isValidCardNumber(cardNumber) {
        const card = cardNumber.replace(/[\s-]/g, ''); // Remove spaces and dashes
        // Basic length check (adjust ranges if needed for specific card types)
        return /^\d{13,19}$/.test(card);
        // Consider adding Luhn algorithm check for better validation
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


    // Show processing overlay (spinner and message)
    function showProcessingOverlay() {
        // Check if overlay already exists to prevent duplicates
        if (document.getElementById('processing-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'processing-overlay';
        // Basic styles for overlay - consider moving to CSS
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: '9999', opacity: '0', transition: 'opacity 0.3s ease'
        });

        const content = document.createElement('div');
         // Basic styles for content box
         Object.assign(content.style, {
             backgroundColor: 'white', padding: '2rem 3rem', borderRadius: '1rem',
             textAlign: 'center', color: '#5e473e' // Match your theme
         });
        // Spinner and text
        content.innerHTML = `
            <div class="loader" style="border: 4px solid #f3f3f3; border-top: 4px solid #5e473e; border-radius: 50%; width: 50px; height: 50px; animation: spin 1.5s linear infinite; margin: 0 auto 1rem;"></div>
            <p style="font-size: 1.8rem;">Processing your order...</p>
        `;

        // Add the keyframes for the spinner animation if not defined globally
        if (!document.getElementById('spin-animation-style')) {
            const style = document.createElement('style');
            style.id = 'spin-animation-style';
            style.innerHTML = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
            document.head.appendChild(style);
        }

        overlay.appendChild(content);
        document.body.appendChild(overlay);
        // Fade in smoothly
        setTimeout(() => overlay.style.opacity = '1', 10);
    }

    // Hide processing overlay
    function hideProcessingOverlay() {
        const overlay = document.getElementById('processing-overlay');
        if (overlay) {
             overlay.style.opacity = '0'; // Fade out
             // Remove from DOM after transition
             setTimeout(() => overlay.remove(), 300);
        }
    }

    // Show success message overlay
    function showSuccessMessage() {
         // Prevent multiple overlays
         if (document.getElementById('success-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'success-overlay';
         // Basic styles - consider moving to CSS
         Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: '9999', opacity: '0', transition: 'opacity 0.3s ease'
        });

        const content = document.createElement('div');
         // Basic styles for content box
         Object.assign(content.style, {
             backgroundColor: 'white', padding: '3rem', borderRadius: '1rem',
             textAlign: 'center', color: '#5e473e' // Match your theme
         });
        // Success icon and messages
        content.innerHTML = `
            <i class="ri-checkbox-circle-fill" style="font-size: 5rem; color: #28a745; margin-bottom: 1rem;"></i>
            <h3 style="font-size: 2.5rem; margin-bottom: 1rem;">Order Successful!</h3>
            <p style="font-size: 1.8rem; color: #845f51; margin-bottom: 0.5rem;">Thank you for shopping with WoodStory.</p>
            <p style="font-size: 1.6rem; color: #845f51;">Redirecting to home page...</p>
        `;

        overlay.appendChild(content);
        document.body.appendChild(overlay);
         // Fade in smoothly
        setTimeout(() => overlay.style.opacity = '1', 10);
    }

    // --- Event Listeners ---

    // Payment Method Selection Handler
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            // Remove 'active' class from all methods
            paymentMethods.forEach(m => m.classList.remove('active'));
            // Add 'active' class to the clicked method
            this.classList.add('active');
            // Update which payment form section is visible (e.g., credit card fields)
            updatePaymentFormVisibility();
        });
    });

    // Apply Promo Code Button Handler
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', () => {
            const code = promoCodeInput.value.trim().toUpperCase();
            promoMessageElement.textContent = ''; // Clear previous messages
            promoMessageElement.className = 'promo-message'; // Reset class styling

            if (!code) {
                promoMessageElement.textContent = 'Please enter a promo code.';
                promoMessageElement.classList.add('error');
                return;
            }

            // **IMPORTANT:** Replace this client-side check with backend validation via fetch eventually
            // For now, using the sample codes defined earlier
            if (validPromoCodes[code]) {
                // Check if this code is already applied
                 if (appliedPromoCode === code) {
                    promoMessageElement.textContent = `Promo code '${code}' is already applied.`;
                    promoMessageElement.classList.add('info'); // Use info style
                    return;
                 }

                // Apply the new code
                appliedPromoCode = code;
                updateTotalsDisplay(); // Recalculate totals with the new code
                promoMessageElement.textContent = `Promo code '${code}' applied successfully!`;
                promoMessageElement.classList.add('success'); // Use success style
                // Optional: Disable input and button after successful application
                promoCodeInput.disabled = true;
                applyPromoBtn.disabled = true;
                applyPromoBtn.textContent = 'Applied'; // Change button text

            } else {
                // Handle invalid code
                // Optional: Decide if an invalid attempt should remove a previously applied code
                // currentDiscount = 0;
                // appliedPromoCode = null;
                // updateTotalsDisplay(); // Uncomment to remove discount on invalid attempt
                promoMessageElement.textContent = 'Invalid promo code.';
                promoMessageElement.classList.add('error'); // Use error style
            }
        });
    } else {
         console.error("Apply Promo Button element not found");
    }


    // Checkout Form Submission Handler
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent the browser's default form submission

            // Step 1: Validate the form fields
            if (!validateForm()) {
                return; // Stop submission if validation fails
            }

            // Step 2: Gather Billing Details from the form
            const formData = new FormData(checkoutForm);
            const billingDetails = {};
            const selectedMethod = document.querySelector('.payment-method.active')?.dataset.method;

            formData.forEach((value, key) => {
                 // Exclude sensitive card details (they should be handled by payment gateway)
                 const isCardField = ['cardName', 'cardNumber', 'expDate', 'cvv'].includes(key);
                 if (!isCardField) {
                    // Map form field names to the keys expected by the PHP script/database
                    // Ensure the keys here match the $billingDetails array keys used in place_order.php
                    billingDetails[key] = value;
                 }
            });


            // Step 3: Get Cart Items (ensure cartManager is loaded and has items)
            const cart = window.cartManager ? window.cartManager.cart : [];
            if (cart.length === 0) {
                alert('Your cart is empty. Cannot place order.');
                return; // Stop if cart is empty
            }

            // Step 4: Construct the final order data object to send to the server
            const orderData = {
                billingDetails: billingDetails, // Contains firstName, lastName, email, phone, address, etc.
                // Map cart items to include necessary info (id, name, quantity, price)
                items: cart.map(item => ({
                    id: item.id || null, // Ensure your cart items have an 'id' property
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price // Price per unit
                })),
                // Include calculated summary figures
                subtotal: currentSubtotal,
                shipping: currentShipping,
                tax: currentTax,
                discount: currentDiscount,
                promoCode: appliedPromoCode, // Send the applied promo code (or null)
                total: parseFloat(totalElement.textContent.replace('$', '')), // Get final total from display
                paymentMethod: selectedMethod // Send the selected payment method ('creditCard', 'paypal')
            };

            // Log the data being sent (for debugging)
            console.log('Sending Order Data:', JSON.stringify(orderData));

            // Step 5: Send data to the backend PHP script using fetch API
            showProcessingOverlay(); // Show loading indicator

            fetch('php/place_order.php', { // ** Ensure this path is correct relative to checkout.html **
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // We are sending JSON data
                    'Accept': 'application/json' // We expect a JSON response
                },
                body: JSON.stringify(orderData) // Convert the JavaScript object to a JSON string
            })
            .then(response => {
                // Check if the HTTP response status is OK (e.g., 200)
                if (!response.ok) {
                    // If not OK, try to parse error message from server response body
                    return response.json()
                        // If parsing JSON fails (e.g., server sent HTML error page), create a basic error
                        .catch(() => { throw new Error(`Server error: ${response.status} ${response.statusText}`); })
                        // If JSON parsing succeeds but indicates an error, throw that message
                        .then(errorData => { throw new Error(errorData.message || `Server error: ${response.status}`); });
                }
                // If response is OK, parse the JSON body
                return response.json();
            })
            .then(data => {
                // Successfully received and parsed JSON response from server
                hideProcessingOverlay(); // Hide loading indicator
                console.log('Response from server:', data); // Log the server's response

                if (data.success) {
                    // Order was successfully placed according to the server
                    showSuccessMessage(); // Show the success overlay
                    // Clear the cart and redirect after a short delay
                    setTimeout(() => {
                        if (window.cartManager) {
                            window.cartManager.clearCart(); // Clear cart from local storage via cart.js
                        }
                        // Redirect to home page or a dedicated order confirmation page
                        window.location.href = 'home.html'; // ** Ensure this path is correct **
                    }, 3000); // Wait 3 seconds after showing success message
                } else {
                    // Order failed according to the server - Show error message from server response
                    alert('Order failed: ' + (data.message || 'An unknown error occurred. Please try again.'));
                }
            })
            .catch(error => {
                // Handle network errors or errors during fetch/parsing
                hideProcessingOverlay(); // Hide loading indicator on error too
                console.error('Error during fetch operation:', error);
                // Display a user-friendly error message
                alert('There was a problem submitting your order. Please check your internet connection and try again.\nDetails: ' + error.message);
            });

        });
    } else {
         console.error("Checkout Form element not found");
    }


    // --- Initial Setup ---
    // Run these functions when the page loads
    populateOrderSummary(); // Load cart items into the summary and calculate initial totals
    updatePaymentFormVisibility(); // Set the correct initial visibility for payment forms (e.g., show credit card by default)

}); // End DOMContentLoaded event listener
