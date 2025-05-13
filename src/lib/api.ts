import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add authentication token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (fullName: string, email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { fullName, email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  updateProfile: async (data: any) => {
    try {
      const response = await api.put('/auth/profile', data);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export const pets = {
  getAll: async () => {
    try {
      const response = await api.get('/pets');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const response = await api.get(`/pets/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (petData: any) => {
    try {
      const response = await api.post('/pets', petData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (id: string, petData: any) => {
    try {
      const response = await api.put(`/pets/${id}`, petData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const response = await api.delete(`/pets/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export const adoptions = {
  create: async (adoptionData: any) => {
    try {
      const response = await api.post('/adoptions', adoptionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getByUser: async (userId: string) => {
    try {
      const response = await api.get(`/adoptions/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export const contact = {
  send: async (contactData: any) => {
    try {
      const response = await api.post('/contact', contactData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default api;