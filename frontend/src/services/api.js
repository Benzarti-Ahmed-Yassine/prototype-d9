const API_BASE_URL = (typeof window !== 'undefined' && window.location.origin.includes('localhost:3000')) 
    ? 'http://localhost:5000/api' 
    : (import.meta?.env?.VITE_API_URL || 'http://localhost:5000/api');

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    getAuthHeader() {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeader(),
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Une erreur est survenue');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth endpoints
    async login(credentials) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async getProfile() {
        return this.request('/auth/profile');
    }

    async logout() {
        return this.request('/auth/logout', {
            method: 'POST',
        });
    }

    // Prescription endpoints
    async getPrescriptions(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/prescriptions${queryString ? `?${queryString}` : ''}`);
    }

    async getPrescription(id) {
        return this.request(`/prescriptions/${id}`);
    }

    async createPrescription(prescriptionData) {
        return this.request('/prescriptions', {
            method: 'POST',
            body: JSON.stringify(prescriptionData),
        });
    }

    async updatePrescription(id, prescriptionData) {
        return this.request(`/prescriptions/${id}`, {
            method: 'PUT',
            body: JSON.stringify(prescriptionData),
        });
    }

    async deletePrescription(id) {
        return this.request(`/prescriptions/${id}`, {
            method: 'DELETE',
        });
    }

    // Health check
    async healthCheck() {
        return this.request('/health');
    }
}

export default new ApiService();
