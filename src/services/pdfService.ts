import axios from 'axios';
import { PDF } from '../types/pdf';
import { API_ENDPOINTS } from '../config/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const pdfService = {
  // Public functions (no authentication required)
  async getPDFs(): Promise<PDF[]> {
    try {
      const response = await axios.get(API_ENDPOINTS.PDFS);
      return response.data;
    } catch (error) {
      console.error('Error fetching PDFs:', error);
      throw error;
    }
  },

  async getAllPDFs(): Promise<PDF[]> {
    try {
      const response = await axios.get(`${API_ENDPOINTS.PDFS}/admin`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all PDFs:', error);
      throw error;
    }
  },

  async uploadPDF(file: File, title: string, author: string): Promise<PDF> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('author', author);

      const response = await axios.post(API_ENDPOINTS.UPLOAD, formData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      throw error;
    }
  },

  async updatePDF(id: string, data: { title: string; author: string }): Promise<PDF> {
    try {
      const response = await axios.put(API_ENDPOINTS.PDF(id), data, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error updating PDF:', error);
      throw error;
    }
  },

  async approvePDF(id: string): Promise<PDF> {
    try {
      const response = await axios.patch(`${API_ENDPOINTS.PDF(id)}/approve`, {}, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error approving PDF:', error);
      throw error;
    }
  },

  async deletePDF(id: string): Promise<void> {
    try {
      await axios.delete(API_ENDPOINTS.PDF(id), {
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error('Error deleting PDF:', error);
      throw error;
    }
  },

  async trackView(id: string): Promise<number> {
    try {
      const response = await axios.post(`${API_ENDPOINTS.PDF(id)}/view`);
      return response.data.views;
    } catch (error) {
      console.error('Error tracking view:', error);
      throw error;
    }
  },

  async trackDownload(id: string): Promise<number> {
    try {
      const response = await axios.post(`${API_ENDPOINTS.PDF(id)}/download`);
      return response.data.downloads;
    } catch (error) {
      console.error('Error tracking download:', error);
      throw error;
    }
  }
}; 