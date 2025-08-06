import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configuration axios
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('mediflow_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les réponses
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token expiré ou invalide
            localStorage.removeItem('mediflow_token');
            localStorage.removeItem('mediflow_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Services d'authentification
export const authService = {
    async login(email, password) {
        try {
            const response = await api.post('/auth/login', { email, password });
            
            if (response.data.success) {
                const { token, user } = response.data.data;
                localStorage.setItem('mediflow_token', token);
                localStorage.setItem('mediflow_user', JSON.stringify(user));
                return { success: true, data: { token, user } };
            }
            
            return { success: false, message: response.data.message };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur de connexion'
            };
        }
    },

    async register(userData) {
        try {
            const response = await api.post('/auth/register', userData);
            
            if (response.data.success) {
                const { token, user } = response.data.data;
                localStorage.setItem('mediflow_token', token);
                localStorage.setItem('mediflow_user', JSON.stringify(user));
                return { success: true, data: { token, user } };
            }
            
            return { success: false, message: response.data.message };
        } catch (error) {
            console.error('Register error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur d\'inscription'
            };
        }
    },

    async getProfile() {
        try {
            const response = await api.get('/auth/profile');
            return response.data;
        } catch (error) {
            console.error('Get profile error:', error);
            throw error;
        }
    },

    async logout() {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('mediflow_token');
            localStorage.removeItem('mediflow_user');
        }
    },

    getCurrentUser() {
        const userStr = localStorage.getItem('mediflow_user');
        return userStr ? JSON.parse(userStr) : null;
    },

    getToken() {
        return localStorage.getItem('mediflow_token');
    },

    isAuthenticated() {
        return !!this.getToken();
    }
};

// Services pour les prescriptions
export const prescriptionService = {
    async getAll() {
        try {
            const response = await api.get('/prescriptions');
            return response.data;
        } catch (error) {
            console.error('Get prescriptions error:', error);
            throw error;
        }
    },

    async getById(id) {
        try {
            const response = await api.get(`/prescriptions/${id}`);
            return response.data;
        } catch (error) {
            console.error('Get prescription error:', error);
            throw error;
        }
    },

    async create(prescriptionData) {
        try {
            const response = await api.post('/prescriptions', prescriptionData);
            return response.data;
        } catch (error) {
            console.error('Create prescription error:', error);
            throw error;
        }
    },

    async update(id, prescriptionData) {
        try {
            const response = await api.put(`/prescriptions/${id}`, prescriptionData);
            return response.data;
        } catch (error) {
            console.error('Update prescription error:', error);
            throw error;
        }
    },

    async delete(id) {
        try {
            const response = await api.delete(`/prescriptions/${id}`);
            return response.data;
        } catch (error) {
            console.error('Delete prescription error:', error);
            throw error;
        }
    }
};

// Service de santé de l'API
export const healthService = {
    async check() {
        try {
            const response = await api.get('/health');
            return response.data;
        } catch (error) {
            console.error('Health check error:', error);
            throw error;
        }
    }
};

export default api;
