import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Sends/receives cookies for session
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Auth API service
 */
export const authAPI = {
    /**
     * Manual signup with email/password
     */
    signup: async ({ fullName, email, password }) => {
        const response = await api.post('/auth/signup', { fullName, email, password });
        return response.data;
    },

    /**
     * Manual login with email/password
     */
    login: async ({ email, password }) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    /**
     * Logout (destroys session)
     */
    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    /**
     * Get the currently logged-in user from session
     */
    getCurrentUser: async () => {
        const response = await api.get('/auth/current-user');
        return response.data;
    },

    /**
     * Google OAuth - redirects the browser to the backend Google auth URL
     */
    googleLogin: () => {
        window.location.href = `${API_BASE_URL}/auth/google`;
    },
};

export default api;
