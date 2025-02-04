import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
};

export const widgetApi = {
  create: (widgetData: Partial<Widget>) => 
    api.post('/widgets', widgetData),
  getAll: () => api.get('/widgets'),
  getById: (id: string) => api.get(`/widgets/${id}`),
  update: (id: string, widgetData: Partial<Widget>) => 
    api.put(`/widgets/${id}`, widgetData),
  delete: (id: string) => api.delete(`/widgets/${id}`),
  generateEmbed: (id: string) => api.get(`/widgets/${id}/embed`),
};

export const reviewApi = {
  getFacebookReviews: () => api.get('/reviews/facebook'),
  getGoogleReviews: () => api.get('/reviews/google'),
  getAllReviews: () => api.get('/reviews/all'),
};

export default api;