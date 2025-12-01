// auth.js - Handle login and registration

// Handle Registration
async function handleRegister(event) {
    event.preventDefault();
    
    console.log('Register button clicked!'); // Debug log
    
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    
    console.log('Form values:', { username, email, password }); // Debug log
    
    // Basic validation
    if (!username || !email || !password) {
        showAlert('All fields are required!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAlert('Password must be at least 6 characters!', 'error');
        return;
    }
    
    try {
        console.log('Calling backend API...'); // Debug log
        
        const result = await registerUser(username, email, password);
        
        console.log('Backend response:', result); // Debug log
        
        if (result.success) {
            showAlert('Registration successful! Redirecting to login...', 'success');
            
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            showAlert('Registration failed: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showAlert('Error: Cannot connect to server. Make sure backend is running on port 8080!', 'error');
    }
}

// Handle Login
async function handleLogin(event) {
    event.preventDefault();
    
    console.log('Login button clicked!'); // Debug log
    
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value;
    
    console.log('Login values:', { username, password }); // Debug log
    
    if (!username || !password) {
        showAlert('All fields are required!', 'error');
        return;
    }
    
    try {
        console.log('Calling backend API...'); // Debug log
        
        const result = await loginUser(username, password);
        
        console.log('Backend response:', result); // Debug log
        
        if (result.success) {
            // Store user info in localStorage
            localStorage.setItem('userId', result.data.userId);
            localStorage.setItem('username', result.data.username);
            localStorage.setItem('email', result.data.email);
            
            showAlert('Login successful! Redirecting...', 'success');
            
            // Redirect to main page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            showAlert('Login failed: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('Error: Cannot connect to server. Make sure backend is running on port 8080!', 'error');
    }
}

// Show alert message
function showAlert(message, type) {
    const alertBox = document.getElementById('alert-message');
    
    if (alertBox) {
        alertBox.textContent = message;
        alertBox.className = 'alert alert-' + type;
        alertBox.style.display = 'block';
        
        // Hide after 5 seconds
        setTimeout(() => {
            alertBox.style.display = 'none';
        }, 5000);
    } else {
        // Fallback to alert if element doesn't exist
        alert(message);
    }
}

// Logout function
function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}

// Check if user is logged in (for protected pages)
function checkAuth() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        window.location.href = 'login.html';
    } else {
        // Display username if element exists
        const usernameDisplay = document.getElementById('username-display');
        if (usernameDisplay) {
            usernameDisplay.textContent = 'Welcome, ' + localStorage.getItem('username') + '!';
        }
    }
}