import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
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

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      // You can redirect to login here if needed
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Auth endpoints
  signin: async (credentials: { username: string; password: string }) => {
    try {
      const response = await apiClient.post('/auth/signin', credentials);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Signin failed');
      }
      throw new Error('Network error occurred');
    }
  },

  signup: async (credentials: { username: string; password: string }) => {
    try {
      const response = await apiClient.post('/auth/signup', credentials);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Signup failed');
      }
      throw new Error('Network error occurred');
    }
  },

  // Content endpoints
  getContent: async () => {
    try {
      const response = await apiClient.get('/content');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch content');
      }
      throw new Error('Network error occurred');
    }
  },

  addContent: async (content: { link?: string; title?: string; content?: string }) => {
    try {
      const response = await apiClient.post('/content', content, );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to add content');
      }
      throw new Error('Network error occurred');
    }
  },

  deleteContent: async (contentId: string) => {
    try {
      const response = await apiClient.delete(`/content/${contentId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to delete content');
      }
      throw new Error('Network error occurred');
    }
  },

  // Search endpoint
  search: async (query: string) => {
    try {
      const response = await apiClient.put('/search', { query });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Search failed');
      }
      throw new Error('Network error occurred');
    }
  },

  // Share endpoints
  shareBrain: async (share: boolean) => {
    try {
      const response = await apiClient.post('/share', { share });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to share brain');
      }
      throw new Error('Network error occurred');
    }
  },

  getSharedBrain: async (shareLink: string) => {
    try {
      const response = await apiClient.get(`/share/${shareLink}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to get shared brain');
      }
      throw new Error('Network error occurred');
    }
  },

  // Helper function to get auth headers (for backward compatibility)
  getAuthHeaders: () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  },

  // Export the axios instance for other API calls
  client: apiClient,
}; 