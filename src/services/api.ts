import axios from '@/lib/axios';
import { toast } from "sonner";

const API_BASE_URL = 'https://cryptoexchange11.com/api/user';

interface LoginCredentials {
  email: string;  // This can be username or email
  password: string;
}

interface SignupData {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  mobile: string;
  country_code?: string;
  firstname?: string;
  lastname?: string;
  inviteCode?: string;
}

export const apiService = {
  async login(credentials: LoginCredentials) {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, credentials);
      
      if (response.data.access_token) {
        // Store the token
        localStorage.setItem('token', response.data.access_token);
        return { 
          user: response.data.user,
          token: response.data.access_token 
        };
      }
      
      throw new Error('Invalid response from server');
    } catch (error: any) {
      const message = error.response?.data?.msg || 'Failed to login';
      throw new Error(message);
    }
  },

  async register(data: SignupData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/signup`, data);
      
      if (response.data.cls === 'success') {
        return { message: response.data.msg };
      }
      
      throw new Error(response.data.msg || 'Registration failed');
    } catch (error: any) {
      const message = error.response?.data?.message || error.response?.data?.msg || 'Registration failed';
      throw new Error(message);
    }
  },

  async logout() {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      await axios.post(`${API_BASE_URL}/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      localStorage.removeItem('token');
    } catch (error: any) {
      console.error('Logout error:', error);
      throw error;
    }
  }
};

// Add axios interceptor to handle authentication
axios.interceptors.request.use(
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

// Add axios interceptor to handle errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      toast.error("Session expired. Please login again.");
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);
