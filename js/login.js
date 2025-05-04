// Enhanced login.js - Modern UI interaction handling
document.addEventListener('DOMContentLoaded', () => {
    // Get form elements
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const resetForm = document.getElementById('resetForm');
    
    // Get navigation links
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    const showResetLink = document.getElementById('showReset');
    const backToLoginLink = document.getElementById('backToLogin');
    
    // Password toggle handler function - now using icon toggling
    function passwordToggleHandler(event) {
        // Find the closest toggle element (may be the icon or its parent)
        const toggleElement = event.target.closest('.toggle-password');
        if (!toggleElement) return;
        
        // Find the password input in the parent container
        const container = toggleElement.closest('.password-toggle');
        if (!container) return;

        const passwordInput = container.querySelector('input[type="password"], input[type="text"]');
        const icon = toggleElement.querySelector('i') || toggleElement;
        
        if (passwordInput) {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                // Switch to "hide" icon
                if (icon.classList.contains('ri-eye-line')) {
                    icon.classList.remove('ri-eye-line');
                    icon.classList.add('ri-eye-off-line');
                }
            } else {
                passwordInput.type = 'password';
                // Switch to "show" icon
                if (icon.classList.contains('ri-eye-off-line')) {
                    icon.classList.remove('ri-eye-off-line');
                    icon.classList.add('ri-eye-line');
                }
            }
        }
    }
    
    // Setup password visibility toggles
    function setupPasswordToggle() {
        const passwordToggles = document.querySelectorAll('.toggle-password');
        
        passwordToggles.forEach(toggle => {
            // Remove any existing listeners to prevent multiple bindings
            toggle.removeEventListener('click', passwordToggleHandler);
            toggle.addEventListener('click', passwordToggleHandler);
        });
    }
    
    // Form Switching with smooth animation
    function switchForm(showForm, hideForm1, hideForm2) {
        if (showForm) {
            showForm.classList.remove('hidden-form');
            showForm.classList.add('active-form');
            
            // Re-setup password toggles
            setupPasswordToggle();
        }
        
        if (hideForm1) {
            hideForm1.classList.remove('active-form');
            hideForm1.classList.add('hidden-form');
        }
        
        if (hideForm2) {
            hideForm2.classList.remove('active-form');
            hideForm2.classList.add('hidden-form');
        }
    }

    // Event Listeners for Form Switching
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            switchForm(registerForm, loginForm, resetForm);
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            switchForm(loginForm, registerForm, resetForm);
        });
    }

    if (showResetLink) {
        showResetLink.addEventListener('click', (e) => {
            e.preventDefault();
            switchForm(resetForm, loginForm, registerForm);
        });
    }

    if (backToLoginLink) {
        backToLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            switchForm(loginForm, resetForm, registerForm);
        });
    }
    
    // Password strength meter
    function setupPasswordStrength() {
        const passwordInput = document.querySelector('#register-password');
        const strengthSegments = document.querySelectorAll('.strength-segment');
        const strengthText = document.querySelector('.strength-text');
        
        if (passwordInput && strengthSegments.length > 0) {
            passwordInput.addEventListener('input', function() {
                const password = this.value;
                let strength = 0;
                
                // Calculate password strength
                if (password.length > 6) strength += 1;
                if (password.length > 10) strength += 1;
                if (/[A-Z]/.test(password)) strength += 1;
                if (/[0-9]/.test(password)) strength += 1;
                if (/[^A-Za-z0-9]/.test(password)) strength += 1;
                
                // Update UI based on strength
                strengthSegments.forEach((segment, index) => {
                    segment.className = 'strength-segment';
                    
                    if (password.length === 0) {
                        // Reset all segments when empty
                        return;
                    }
                    
                    if (index < strength) {
                        // Color segments based on strength level
                        if (strength <= 2) {
                            segment.classList.add('weak');
                        } else if (strength <= 3) {
                            segment.classList.add('medium');
                        } else {
                            segment.classList.add('strong');
                        }
                    }
                });
                
                // Update text
                if (strengthText) {
                    if (password.length === 0) {
                        strengthText.textContent = 'Password strength';
                    } else if (strength <= 2) {
                        strengthText.textContent = 'Weak password';
                    } else if (strength <= 3) {
                        strengthText.textContent = 'Medium password';
                    } else {
                        strengthText.textContent = 'Strong password';
                    }
                }
            });
        }
    }

    // Form Submission Handlers
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const messageElement = loginForm.querySelector('.message');
            const emailInput = loginForm.querySelector('input[name="email"]');
            const passwordInput = loginForm.querySelector('input[name="password"]');
            const submitButton = loginForm.querySelector('button[type="submit"]');

            // Disable button and show loading state
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Signing in...';
            }

            // Basic validation
            if (!emailInput.value || !passwordInput.value) {
                showMessage(messageElement, 'Please fill in all fields', 'error');
                resetButton(submitButton, 'Sign In');
                return;
            }

            try {
                const response = await loginUser(emailInput.value, passwordInput.value);
                
                if (response.success) {
                    showMessage(messageElement, 'Login successful! Redirecting...', 'success');
                    // Redirect or update UI after successful login
                    setTimeout(() => {
                        window.location.href = 'home.html';
                    }, 1500);
                } else {
                    showMessage(messageElement, response.message, 'error');
                    resetButton(submitButton, 'Sign In');
                }
            } catch (error) {
                showMessage(messageElement, 'An error occurred. Please try again.', 'error');
                console.error('Login error:', error);
                resetButton(submitButton, 'Sign In');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const messageElement = registerForm.querySelector('.message');
            const nameInput = registerForm.querySelector('input[name="name"]');
            const emailInput = registerForm.querySelector('input[name="email"]');
            const passwordInput = registerForm.querySelector('input[name="password"]');
            const confirmPasswordInput = registerForm.querySelector('input[name="confirmPassword"]');
            const termsCheckbox = registerForm.querySelector('input[name="terms"]');
            const submitButton = registerForm.querySelector('button[type="submit"]');

            // Disable button and show loading state
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Creating account...';
            }

            // Validation
            if (!nameInput.value || !emailInput.value || !passwordInput.value || !confirmPasswordInput.value) {
                showMessage(messageElement, 'Please fill in all fields', 'error');
                resetButton(submitButton, 'Create Account');
                return;
            }

            if (passwordInput.value !== confirmPasswordInput.value) {
                showMessage(messageElement, 'Passwords do not match', 'error');
                resetButton(submitButton, 'Create Account');
                return;
            }

            if (termsCheckbox && !termsCheckbox.checked) {
                showMessage(messageElement, 'Please agree to terms and conditions', 'error');
                resetButton(submitButton, 'Create Account');
                return;
            }

            try {
                const response = await registerUser(
                    nameInput.value, 
                    emailInput.value, 
                    passwordInput.value
                );
                
                if (response.success) {
                    showMessage(messageElement, 'Registration successful! Redirecting to login...', 'success');
                    // Automatically switch to login form
                    setTimeout(() => {
                        switchForm(loginForm, registerForm, resetForm);
                        registerForm.reset();
                        resetButton(submitButton, 'Create Account');
                    }, 2000);
                } else {
                    showMessage(messageElement, response.message, 'error');
                    resetButton(submitButton, 'Create Account');
                }
            } catch (error) {
                showMessage(messageElement, 'An error occurred. Please try again.', 'error');
                console.error('Registration error:', error);
                resetButton(submitButton, 'Create Account');
            }
        });
    }

    if (resetForm) {
        resetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const messageElement = resetForm.querySelector('.message');
            const emailInput = resetForm.querySelector('input[name="resetEmail"]');
            const submitButton = resetForm.querySelector('button[type="submit"]');

            // Disable button and show loading state
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Sending...';
            }

            // Basic validation
            if (!emailInput.value) {
                showMessage(messageElement, 'Please enter your email', 'error');
                resetButton(submitButton, 'Send Reset Link');
                return;
            }

            // Placeholder for password reset logic - would connect to backend in production
            setTimeout(() => {
                showMessage(messageElement, 'Password reset instructions sent to your email', 'success');
                
                // In a real app, this would call a backend password reset endpoint
                setTimeout(() => {
                    switchForm(loginForm, resetForm, registerForm);
                    resetForm.reset();
                    resetButton(submitButton, 'Send Reset Link');
                }, 2000);
            }, 1500);
        });
    }

    // Helper function to reset button state
    function resetButton(button, text) {
        if (button) {
            button.disabled = false;
            button.innerHTML = text;
        }
    }

    // Helper function to show messages
    function showMessage(element, message, type) {
        if (!element) return;
        element.textContent = message;
        element.className = `message ${type}`;
        element.style.display = 'block';
        
        // Scroll to message if it's not visible
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Initialize functions
    setupPasswordToggle();
    setupPasswordStrength();
});

// Authentication API calls
async function loginUser(email, password) {
    try {
        const response = await fetch('php/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        return await response.json();
    } catch (error) {
        console.error('Login fetch error:', error);
        throw error;
    }
}

async function registerUser(name, email, password) {
    try {
        const response = await fetch('php/register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });
        return await response.json();
    } catch (error) {
        console.error('Registration fetch error:', error);
        throw error;
    }
}