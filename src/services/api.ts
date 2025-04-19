
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
  password_confirmation?: string;
  mobile?: string;
  country_code?: string;
  firstname?: string;
  lastname?: string;
  inviteCode?: string;
  name?: string;
  withdraw_pin?: string;
  ref_id?: any;
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
      // Transform data format to match backend requirements
      const signupData: any = {
        username: data.username,
        email: data.email,
        password: data.password,
        password_confirmation: data.password, // Use password as confirmation if not provided
        mobile: data.mobile || data.username, // Use username as mobile if not provided
        firstname: data.name || data.firstname || ' ',
        lastname: data.lastname || ' ',
      };

      // Add optional fields if they exist
      if (data.country_code) signupData.country_code = data.country_code;
      if (data.ref_id) signupData.inviteCode = data.ref_id;
      
      const response = await axios.post(`${API_BASE_URL}/signup`, signupData);
      
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
