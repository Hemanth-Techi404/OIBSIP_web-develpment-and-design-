 // DOM Elements
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const successMessage = document.getElementById('successMessage');
        const showRegister = document.getElementById('showRegister');
        const showLogin = document.getElementById('showLogin');
        const logoutBtn = document.getElementById('logoutBtn');
        const togglePassword = document.getElementById('togglePassword');
        const toggleRegPassword = document.getElementById('toggleRegPassword');
        const passwordInput = document.getElementById('password');
        const regPasswordInput = document.getElementById('regPassword');
        const regConfirmPasswordInput = document.getElementById('regConfirmPassword');
        const loginBtn = document.getElementById('login');
        const registerBtn = document.getElementById('register');
        const successText = document.getElementById('successText');

        // Toggle between login and register forms
        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
        });

        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            registerForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        });

        // Toggle password visibility
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });

        toggleRegPassword.addEventListener('click', () => {
            const type = regPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            regPasswordInput.setAttribute('type', type);
            toggleRegPassword.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });

        // Simple user database
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Login form submission
        loginBtn.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;
            
            // Find user in database
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Successful login
                loginForm.classList.add('hidden');
                successMessage.classList.remove('hidden');
                successText.textContent = `Welcome back, ${user.name}!`;
                
                // Store session if remember me is checked
                if (remember) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                } else {
                    sessionStorage.setItem('currentUser', JSON.stringify(user));
                }
            } else {
                // Failed login
                loginForm.classList.add('shake');
                setTimeout(() => loginForm.classList.remove('shake'), 500);
                
                // Show error message
                const errorDiv = document.createElement('div');
                errorDiv.className = 'mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm';
                errorDiv.textContent = 'Invalid email or password. Please try again.';
                
                // Remove any existing error messages
                const existingError = document.querySelector('.bg-red-50');
                if (existingError) existingError.remove();
                
                loginBtn.appendChild(errorDiv);
            }
        });

        // Registration form submission
        registerBtn.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;
            const terms = document.getElementById('terms').checked;
            
            // Validate form
            let isValid = true;
            
            // Clear previous errors
            document.querySelectorAll('.text-red-500').forEach(el => el.remove());
            document.querySelectorAll('.border-red-500').forEach(el => el.classList.remove('border-red-500'));
            
            // Name validation
            if (name.length < 3) {
                showError('regName', 'Name must be at least 3 characters');
                isValid = false;
            }
            
            // Email validation
            if (!/^\S+@\S+\.\S+$/.test(email)) {
                showError('regEmail', 'Please enter a valid email');
                isValid = false;
            }
            
            // Password validation
            if (password.length < 8) {
                showError('regPassword', 'Password must be at least 8 characters');
                isValid = false;
            }
            
            // Confirm password
            if (password !== confirmPassword) {
                showError('regConfirmPassword', 'Passwords do not match');
                isValid = false;
            }
            
            // Terms checkbox
            if (!terms) {
                const termsLabel = document.querySelector('label[for="terms"]');
                const errorDiv = document.createElement('span');
                errorDiv.className = 'text-red-500 text-xs ml-2';
                errorDiv.textContent = 'You must accept the terms';
                termsLabel.appendChild(errorDiv);
                isValid = false;
            }
            
            // Check if email already exists
            if (users.some(u => u.email === email)) {
                showError('regEmail', 'Email already registered');
                isValid = false;
            }
            
            if (isValid) {
                // Add new user to database
                const newUser = { name, email, password };
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));
                
                // Show success message
                registerForm.classList.add('hidden');
                successMessage.classList.remove('hidden');
                successText.textContent = `Account created successfully, ${name}!`;
                
                // Auto-login the new user
                sessionStorage.setItem('currentUser', JSON.stringify(newUser));
            }
        });

        // Logout button
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('currentUser');
            localStorage.removeItem('currentUser');
            
            successMessage.classList.add('hidden');
            loginForm.classList.remove('hidden');
            
            // Clear form fields
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
            document.getElementById('remember').checked = false;
        });

        // Helper function to show validation errors
        function showError(fieldId, message) {
            const field = document.getElementById(fieldId);
            field.classList.add('border-red-500');
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'text-red-500 text-xs mt-1';
            errorDiv.textContent = message;
            
            field.parentNode.appendChild(errorDiv);
        }

        // Check if user is already logged in
        window.addEventListener('DOMContentLoaded', () => {
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || 
                               JSON.parse(localStorage.getItem('currentUser'));
            
            if (currentUser) {
                loginForm.classList.add('hidden');
                successMessage.classList.remove('hidden');
                successText.textContent = `Welcome back, ${currentUser.name}!`;
            }
        });