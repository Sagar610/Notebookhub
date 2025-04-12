const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const getFullUrl = (url: string): string => {
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}; 