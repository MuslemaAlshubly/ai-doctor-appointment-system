// Authentication Management
const Auth = {
    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    // Get stored user data
    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Set authentication data
    setAuth: (token, user) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    },

    // Clear authentication data
    clearAuth: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Login handler
    login: async (email, password) => {
        try {
            const response = await API.login(email, password);
            
            if (response.error) {
                throw new Error(response.message || 'Login failed');
            }

            Auth.setAuth(response.token, response.user);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Register handler
    register: async (name, email, password, phone) => {
        try {
            const response = await API.register({
                name,
                email,
                password,
                phone
            });

            if (response.error) {
                throw new Error(response.message || 'Registration failed');
            }

            Auth.setAuth(response.token, response.user);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Logout handler
    logout: () => {
        Auth.clearAuth();
    }
};
