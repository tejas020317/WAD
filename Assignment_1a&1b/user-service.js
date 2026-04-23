// User Service to handle Registration and Login using LocalStorage
class UserService {
    constructor() {
        this.usersKey = 'bvh_users';
        this.currentUserKey = 'bvh_current_user';
        this.initializeUsers();
    }

    initializeUsers() {
        if (!localStorage.getItem(this.usersKey)) {
            localStorage.setItem(this.usersKey, JSON.stringify([]));
        }
    }

    getUsers() {
        return JSON.parse(localStorage.getItem(this.usersKey)) || [];
    }

    register(user) {
        const users = this.getUsers();
        // Check if username already exists
        const exists = users.find(u => u.username === user.username);
        if (exists) {
            return { success: false, message: 'Username already exists' };
        }

        // Add new user
        users.push(user);
        localStorage.setItem(this.usersKey, JSON.stringify(users));
        return { success: true, message: 'Registration successful' };
    }

    login(username, password) {
        const users = this.getUsers();
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            // Save current user session
            localStorage.setItem(this.currentUserKey, JSON.stringify(user));
            this.updateUINavbar();
            return { success: true, message: 'Login successful' };
        }

        return { success: false, message: 'Invalid username or password' };
    }

    logout() {
        localStorage.removeItem(this.currentUserKey);
        this.updateUINavbar();
        window.location.href = 'index.html';
    }

    getCurrentUser() {
        const userStr = localStorage.getItem(this.currentUserKey);
        return userStr ? JSON.parse(userStr) : null;
    }

    isLoggedIn() {
        return this.getCurrentUser() !== null;
    }

    updateUINavbar() {
        // Find navbar elements to toggle visibility based on login status
        const loginLinks = document.querySelectorAll('.auth-logged-out');
        const profileLinks = document.querySelectorAll('.auth-logged-in');

        if (this.isLoggedIn()) {
            loginLinks.forEach(el => el.style.display = 'none');
            profileLinks.forEach(el => el.style.display = 'block');

            // Update username display if element exists
            const usernameDisplay = document.getElementById('navbarUsername');
            if (usernameDisplay) {
                usernameDisplay.textContent = this.getCurrentUser().username;
            }
        } else {
            loginLinks.forEach(el => el.style.display = 'block');
            profileLinks.forEach(el => el.style.display = 'none');
        }
    }
}

// Initialize global user service
const userService = new UserService();

// Run UI update on page load
document.addEventListener('DOMContentLoaded', () => {
    userService.updateUINavbar();
});
