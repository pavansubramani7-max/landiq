import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const API = axios.create({
  baseURL: BASE,
  timeout: 30000,
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('landiq_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401 — only for protected routes
API.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || '';
    const pub = ['/api/analyze', '/api/upload-doc', '/api/report',
                 '/api/health', '/api/auth/login', '/api/auth/register'];
    if (err.response?.status === 401 && !pub.some(r => url.includes(r))) {
      localStorage.removeItem('landiq_token');
      localStorage.removeItem('landiq_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const login = (email, password) =>
  API.post('/api/auth/login', { email, password }).then(r => r.data);

export const register = (email, password, full_name) =>
  API.post('/api/auth/register', { email, password, full_name }).then(r => r.data);

export const getMe = () => API.get('/api/auth/me').then(r => r.data);

// ── Quick Analysis (no auth) ──────────────────────────────────────────────────
export const analyzeProperty = (data) =>
  API.post('/api/analyze', data).then(r => r.data);

export const uploadDocument = (file) => {
  const form = new FormData();
  form.append('file', file);
  return API.post('/api/upload-doc', form).then(r => r.data);
};

export const getReportUrl = (id) => `${BASE}/api/report/${id}`;

// ── Parcels ───────────────────────────────────────────────────────────────────
export const listParcels    = ()         => API.get('/api/parcels/').then(r => r.data);
export const createParcel   = (data)     => API.post('/api/parcels/', data).then(r => r.data);
export const getParcel      = (id)       => API.get(`/api/parcels/${id}`).then(r => r.data);
export const updateParcel   = (id, data) => API.put(`/api/parcels/${id}`, data).then(r => r.data);
export const deleteParcel   = (id)       => API.delete(`/api/parcels/${id}`).then(r => r.data);

// ── Analysis (JWT) ────────────────────────────────────────────────────────────
export const analyzeParcel    = (pid, extra = {}) =>
  API.post(`/api/analysis/parcel/${pid}`, extra).then(r => r.data);

export const parcelHistory    = (pid) =>
  API.get(`/api/analysis/parcel/${pid}/history`).then(r => r.data);

export const getAnalysisReport = (pid) => `${BASE}/api/analysis/report/${pid}`;

// ── Documents ─────────────────────────────────────────────────────────────────
export const uploadParcelDoc = (pid, file, docType = 'other') => {
  const form = new FormData();
  form.append('file', file);
  form.append('doc_type', docType);
  return API.post(`/api/documents/upload/${pid}`, form).then(r => r.data);
};

export const listParcelDocs = (pid) =>
  API.get(`/api/documents/parcel/${pid}`).then(r => r.data);

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminStats      = ()         => API.get('/api/admin/stats').then(r => r.data);
export const adminUsers      = ()         => API.get('/api/admin/users').then(r => r.data);
export const adminUpdateUser = (id, data) => API.patch(`/api/admin/users/${id}`, data).then(r => r.data);
export const adminAnalyses   = ()         => API.get('/api/admin/analyses').then(r => r.data);
export const healthCheck     = ()         => API.get('/api/health').then(r => r.data);
