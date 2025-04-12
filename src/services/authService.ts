import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

export const authService = {
  async login(username: string, password: string): Promise<string> {
    try {
      const response = await axios.post(API_ENDPOINTS.LOGIN, { username, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      return token;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  logout(): void {
    localStorage.removeItem('token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}; 