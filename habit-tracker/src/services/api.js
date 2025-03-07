import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  register: async (email, password) => {
    const response = await api.post('/users/register', { email, password });
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
  }
};

// Habits services
export const habitsService = {
  getAll: async () => {
    const response = await api.get('/habits');
    return response.data;
  },
  create: async (habit) => {
    const response = await api.post('/habits', habit);
    return response.data;
  },
  update: async (id, habit) => {
    const response = await api.put(`/habits/${id}`, habit);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/habits/${id}`);
    return response.data;
  },
  toggleComplete: async (id) => {
    const response = await api.post(`/habits/${id}/toggle`);
    return response.data;
  }
};