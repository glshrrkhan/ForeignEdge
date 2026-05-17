import axios from 'axios';

// Works locally (localhost:5000) and on Railway (set VITE_API_URL env var)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({ baseURL: BASE_URL });

API.interceptors.request.use(config => {
  const token = localStorage.getItem('fe_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  me: () => API.get('/auth/me'),
  update: (data) => API.put('/auth/update', data),
};

export const uniAPI = {
  getAll: (params) => API.get('/universities/', { params }),
  getOne: (id) => API.get(`/universities/${id}`),
  getCountries: () => API.get('/universities/countries'),
  getStats: () => API.get('/universities/stats'),
  create: (data) => API.post('/universities/', data),
  update: (id, data) => API.put(`/universities/${id}`, data),
  delete: (id) => API.delete(`/universities/${id}`),
};

export const scholarshipAPI = {
  getAll: (params) => API.get('/scholarships/', { params }),
  getOne: (id) => API.get(`/scholarships/${id}`),
  create: (data) => API.post('/scholarships/', data),
  update: (id, data) => API.put(`/scholarships/${id}`, data),
  delete: (id) => API.delete(`/scholarships/${id}`),
};

export const accommodationAPI = {
  getAll: (params) => API.get('/accommodation/', { params }),
  getOne: (id) => API.get(`/accommodation/${id}`),
  getCountries: () => API.get('/accommodation/countries'),
  getCities: (country) => API.get('/accommodation/cities', { params: { country } }),
  create: (data) => API.post('/accommodation/', data),
  delete: (id) => API.delete(`/accommodation/${id}`),
};

export const restaurantAPI = {
  getAll: (params) => API.get('/restaurants/', { params }),
  getOne: (id) => API.get(`/restaurants/${id}`),
  getCountries: () => API.get('/restaurants/countries'),
  create: (data) => API.post('/restaurants/', data),
  delete: (id) => API.delete(`/restaurants/${id}`),
};

export const airlineAPI = {
  getAll: (params) => API.get('/airlines/', { params }),
  searchFlights: (params) => API.get('/airlines/search', { params }),
};

export const transportAPI = {
  getAll: (params) => API.get('/transport/', { params }),
  getCategories: () => API.get('/transport/categories'),
  create: (data) => API.post('/transport/', data),
  delete: (id) => API.delete(`/transport/${id}`),
};

export const profileAPI = {
  get: () => API.get('/profile/'),
  getProfile: () => API.get('/profile/'),
  save: (data) => API.put('/profile/', data),
  saveProfile: (data) => API.put('/profile/', data),
  evaluate: (data) => API.post('/profile/evaluate', data),
  getSaved: () => API.get('/profile/saved'),
  toggleSave: (data) => API.post('/profile/saved', data),
  getApplications: () => API.get('/profile/applications'),
  addApplication: (data) => API.post('/profile/applications', data),
  deleteApplication: (id) => API.delete(`/profile/applications/${id}`),
};

export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getUsers: () => API.get('/admin/users'),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  getTable: (table, params) => API.get(`/admin/database/${table}`, { params }),
};

export const calcAPI = {
  costOfLiving: (data) => API.post('/calculators/cost-of-living', data),
  gpaConverter: (data) => API.post('/calculators/gpa-converter', data),
  scholarshipEligibility: (data) => API.post('/calculators/scholarship-eligibility', data),
  visaRequirements: (data) => API.post('/calculators/visa-requirements', data),
};

export default API;
