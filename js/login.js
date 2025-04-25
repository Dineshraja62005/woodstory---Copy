document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const resetForm = document.getElementById('resetForm');
    
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    const showResetLink = document.getElementById('showReset');
    const backToLoginLink = document.getElementById('backToLogin');
    
    // Password Visibility Toggle
    function setupPasswordToggle() {
        const passwordToggles = document.querySelectorAll('.toggle-password');
        
        passwordToggles.forEach(toggle => {
            // Remove any existing listeners to prevent multiple bindings
            toggle.removeEventListener('click', passwordToggleHandler);
            toggle.addEventListener('click', passwordToggleHandler);
        });
    }

    function passwordToggleHandler(event) {
        // Find the password input in the parent container
        const container = event.target.closest('.password-container');
        if (!container) return;

        const passwordInput = container.querySelector('input[type="password"], input[type="text"]');
        
        if (passwordInput) {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                event.target.textContent = 'Hide';
            } else {
                passwordInput.type = 'password';
                event.target.textContent = 'Show';
            }
        }
    }
    
    // Form Switching
    function switchForm(showForm, hideForm1, hideForm2) {
        if (showForm) {
            showForm.style.display = 'block';
            // Re-setup password toggles
            setupPasswordToggle();
        }
        if (hideForm1) hideForm1.style.display = 'none';
        if (hideForm2) hideForm2.style.display = 'none';
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

    // Initial setup of password toggles
    setupPasswordToggle();

    // Form Submission Handlers
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const messageElement = loginForm.querySelector('.message');
            const emailInput = loginForm.querySelector('input[name="email"]');
            const passwordInput = loginForm.querySelector('input[name="password"]');

            // Basic validation
            if (!emailInput.value || !passwordInput.value) {
                showMessage(messageElement, 'Please fill in all fields', 'error');
                return;
            }

            try {
                const response = await loginUser(emailInput.value, passwordInput.value);
                
                if (response.success) {
                    showMessage(messageElement, 'Login successful', 'success');
                    // Redirect or update UI after successful login
                    setTimeout(() => {
                        window.location.href = 'home.html';
                    }, 1500);
                } else {
                    showMessage(messageElement, response.message, 'error');
                }
            } catch (error) {
                showMessage(messageElement, 'An error occurred. Please try again.', 'error');
                console.error('Login error:', error);
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

            // Validation
            if (!nameInput.value || !emailInput.value || !passwordInput.value || !confirmPasswordInput.value) {
                showMessage(messageElement, 'Please fill in all fields', 'error');
                return;
            }

            if (passwordInput.value !== confirmPasswordInput.value) {
                showMessage(messageElement, 'Passwords do not match', 'error');
                return;
            }

            if (!termsCheckbox.checked) {
                showMessage(messageElement, 'Please agree to terms and conditions', 'error');
                return;
            }

            try {
                const response = await registerUser(
                    nameInput.value, 
                    emailInput.value, 
                    passwordInput.value
                );
                
                if (response.success) {
                    showMessage(messageElement, 'Registration successful', 'success');
                    // Automatically switch to login form
                    setTimeout(() => {
                        switchForm(loginForm, registerForm, resetForm);
                        registerForm.reset();
                    }, 2000);
                } else {
                    showMessage(messageElement, response.message, 'error');
                }
            } catch (error) {
                showMessage(messageElement, 'An error occurred. Please try again.', 'error');
                console.error('Registration error:', error);
            }
        });
    }

    if (resetForm) {
        resetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const messageElement = resetForm.querySelector('.message');
            const emailInput = resetForm.querySelector('input[name="resetEmail"]');

            // Basic validation
            if (!emailInput.value) {
                showMessage(messageElement, 'Please enter your email', 'error');
                return;
            }

            // Placeholder for password reset logic
            showMessage(messageElement, 'Password reset instructions sent', 'success');
            
            // In a real app, this would call a backend password reset endpoint
            setTimeout(() => {
                switchForm(loginForm, resetForm, registerForm);
                resetForm.reset();
            }, 2000);
        });
    }

    // Helper function to show messages
    function showMessage(element, message, type) {
        if (!element) return;
        element.textContent = message;
        element.className = `message ${type}`;
    }
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

// Additional safeguard to ensure password toggles work after dynamic content changes
window.addEventListener('load', () => {
    const passwordToggles = document.querySelectorAll('.toggle-password');
    passwordToggles.forEach(toggle => {
        toggle.removeEventListener('click', passwordToggleHandler);
        toggle.addEventListener('click', passwordToggleHandler);
    });
});