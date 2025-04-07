document.addEventListener('DOMContentLoaded', () => {
    // Toggle between login and signup forms
    document.getElementById('show-signup').addEventListener('click', () => {
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('signup-form').classList.remove('hidden');
    });
    
    document.getElementById('show-login').addEventListener('click', () => {
        document.getElementById('signup-form').classList.add('hidden');
        document.getElementById('login-form').classList.remove('hidden');
    });
    
    // Fake login with validation
    document.getElementById('login-btn').addEventListener('click', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        if (password.length < 8) {
            alert('Password must be at least 8 characters long.');
            return;
        }

        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('userEmail', email);
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
    });
    
    // Fake signup with validation
    document.getElementById('signup-btn').addEventListener('click', (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        if (password.length < 8) {
            alert('Password must be at least 8 characters long.');
            return;
        }

        if (!name) {
            alert('Please enter your name.');
            return;
        }

        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', name);
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
    });
    
    // Logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        document.getElementById('app').classList.add('hidden');
        document.getElementById('auth-screen').classList.remove('hidden');
        document.getElementById('login-form').classList.remove('hidden');
        document.getElementById('signup-form').classList.add('hidden');
    });
    
    // Check if user is already logged in
    if (localStorage.getItem('loggedIn') === 'true') {
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
    }
});