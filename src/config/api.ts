import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://notebookhub-backend.onrender.com';

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;

export const API_ENDPOINTS = {
  PDFS: '/api/pdfs',
  PDF: (id: string) => `/api/pdfs/${id}`,
  UPLOAD: '/api/pdfs/upload',
  LOGIN: '/api/login',
  REGISTER: '/api/auth/register',
};

export const getFullUrl = (url: string): string => {
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}; 