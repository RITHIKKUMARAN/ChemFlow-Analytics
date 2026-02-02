/**
 * API Client for Chemical Equipment Visualizer
 * Handles all HTTP requests to Django backend
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear tokens and redirect to login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Authentication API
export const authAPI = {
    register: async (username, email, password) => {
        const response = await api.post('/auth/register', {
            username,
            email,
            password,
        });
        if (response.data.tokens) {
            localStorage.setItem('accessToken', response.data.tokens.access);
            localStorage.setItem('refreshToken', response.data.tokens.refresh);
        }
        return response.data;
    },

    login: async (username, password) => {
        const response = await api.post('/auth/login', {
            username,
            password,
        });
        if (response.data.tokens) {
            localStorage.setItem('accessToken', response.data.tokens.access);
            localStorage.setItem('refreshToken', response.data.tokens.refresh);
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('accessToken');
    },

    getProfile: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    updateProfile: async (username, currentPassword, newPassword) => {
        const response = await api.put('/auth/profile', {
            username,
            current_password: currentPassword,
            new_password: newPassword,
        });
        return response.data;
    },
};

// Dataset API
export const datasetAPI = {
    uploadCSV: async (file, onProgress) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/upload-csv', formData, {
            headers: {
                // Let browser set Content-Type with boundary
                'Content-Type': undefined,
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress) {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    onProgress(percentCompleted);
                }
            },
        });
        return response.data;
    },

    getSummary: async (datasetId = null) => {
        const url = datasetId ? `/summary?dataset_id=${datasetId}` : '/summary';
        const response = await api.get(url);
        return response.data;
    },

    getHistory: async () => {
        const response = await api.get('/history');
        return response.data;
    },

    getDatasetDetail: async (datasetId) => {
        const response = await api.get(`/dataset/${datasetId}`);
        return response.data;
    },

    downloadPDF: async (datasetId = null) => {
        const url = datasetId ? `/report/pdf?dataset_id=${datasetId}` : '/report/pdf';
        const response = await api.get(url, {
            responseType: 'blob',
        });

        // Create download link
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `equipment_report_${datasetId || 'latest'}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
    },

    deleteDataset: async (datasetId) => {
        const response = await api.delete(`/dataset/${datasetId}/delete`);
        return response.data;
    },
};

export default api;
