import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://fa33-2c0f-f698-c237-9b5e-bd97-b055-f3dc-4700.ngrok-free.app/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
  logout: () => api.post('/logout'),
  getUser: () => api.get('/user'),
  refreshToken: (refreshToken) => api.post('/refresh', { refresh_token: refreshToken }),
  forgotPassword: (email) => api.post('/forgot-password', { email }),
  resetPassword: (data) => api.post('/reset-password', data),
  verifyEmail: (token) => api.get(`/verify-email/${token}`),
  resendVerificationEmail: () => api.post('/resend-verification-email'),
};

// Company API calls
export const companyAPI = {
  create: (data) => api.post('/company', data),
  get: (identifier) => api.get(`/company/${identifier}`),
  update: (data) => api.put('/company', data),
  getUsers: (companyId) => api.get(`/company/${companyId}/users`),
};

// Client API calls
export const clientAPI = {
  getAll: () => api.get('/clients'),
  get: (id) => api.get(`/clients/${id}`),
  create: (data) => api.post('/clients', data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),
};

// Currency API calls
export const currencyAPI = {
  getAll: () => api.get('/currencies'),
  get: (id) => api.get(`/currencies/${id}`),
  create: (data) => api.post('/currencies', data),
  update: (id, data) => api.put(`/currencies/${id}`, data),
  delete: (id) => api.delete(`/currencies/${id}`),
  setDefault: (id) => api.post(`/currencies/${id}/set-default`),
};

// Tax API calls
export const taxAPI = {
  getAll: () => api.get('/taxes'),
  get: (id) => api.get(`/taxes/${id}`),
  create: (data) => api.post('/taxes', data),
  update: (id, data) => api.put(`/taxes/${id}`, data),
  delete: (id) => api.delete(`/taxes/${id}`),
};

// Category API calls
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  get: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
  getProducts: (categoryId) => api.get(`/categories/${categoryId}/produits`),
};

// Product API calls
export const productAPI = {
  getAll: () => api.get('/produits'),
  get: (id) => api.get(`/produits/${id}`),
  create: (data) => api.post('/produits', data),
  update: (id, data) => api.put(`/produits/${id}`, data),
  delete: (id) => api.delete(`/produits/${id}`),
};

// Invoice API calls
export const invoiceAPI = {
  getAll: () => api.get('/invoices'),
  get: (id) => api.get(`/invoices/${id}`),
  create: (data) => api.post('/invoices', data),
  update: (id, data) => api.put(`/invoices/${id}`, data),
  delete: (id) => api.delete(`/invoices/${id}`),
  cancel: (id) => api.post(`/invoices/${id}/cancel`),
  generatePdf: (id) => api.post(`/invoices/${id}/pdf`),
  getItems: (invoiceId) => api.get(`/invoices/${invoiceId}/items`),
  generateInvoiceNumber: () => api.get('/invoices/generate-number'),
};

// Invoice Item API calls
export const invoiceItemAPI = {
  create: (data) => api.post('/invoice-items', data),
  get: (id) => api.get(`/invoice-items/${id}`),
  update: (id, data) => api.put(`/invoice-items/${id}`, data),
  delete: (id) => api.delete(`/invoice-items/${id}`),
};

// Invoice Settings API calls
export const invoiceSettingsAPI = {
  get: () => {
    console.log('GET /invoice-settings');
    return api.get('/invoice-settings');
  },
  update: (data) => {
    console.log('POST /invoice-settings with data:', data);
    return api.post('/invoice-settings', data);
  },
};

// Inventaire (Supplier) API calls
export const inventaireAPI = {
  getAll: () => api.get('/inventaires'),
  get: (id) => api.get(`/inventaires/${id}`),
  create: (data) => api.post('/inventaires', data),
  update: (id, data) => api.put(`/inventaires/${id}`, data),
  delete: (id) => api.delete(`/inventaires/${id}`),
};

// Bond Command API calls
export const bondCommandAPI = {
  getAll: () => api.get('/bond-commands'),
  get: (id) => api.get(`/bond-commands/${id}`),
  create: (data) => api.post('/bond-commands', data),
  update: (id, data) => api.put(`/bond-commands/${id}`, data),
  delete: (id) => api.delete(`/bond-commands/${id}`),
  cancel: (id) => api.post(`/bond-commands/${id}/cancel`),
  downloadPdf: (id) => api.get(`/bond-commands/${id}/download-pdf`, { responseType: 'blob' }),
  generateNumber: () => api.get('/bond-commands/generate-number'),
};

export default api; 