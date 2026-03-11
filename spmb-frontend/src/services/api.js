import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('spmb_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally – redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('spmb_token');
      localStorage.removeItem('spmb_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  getMe:    ()     => api.get('/auth/me'),
};

// ─── Students ─────────────────────────────────────────────────────────────────
export const studentAPI = {
  getAll:       ()         => api.get('/students'),
  getById:      (id)       => api.get(`/students/${id}`),
  create:       (data)     => api.post('/students', data),
  updateStatus: (id, data) => api.put(`/students/${id}/status`, data),
  delete:       (id)       => api.delete(`/students/${id}`),
  getStats:     ()         => api.get('/students/stats'),
};

// ─── Upload ───────────────────────────────────────────────────────────────────
export const uploadAPI = {
  uploadDocs: (formData) =>
    api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getDocs: (studentId) => api.get(`/upload/${studentId}`),
};

export default api;