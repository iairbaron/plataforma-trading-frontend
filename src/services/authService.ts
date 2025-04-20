import axios from 'axios';
import { API_ROUTES } from '../config/api';

interface LoginData {
  email: string;
  password: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthResponse {
  status: 'success' | 'error';
  message: string;
  data?: {
    token: string;
    user: User;
  };
  errors?: Array<{
    field?: string;
    message: string;
  }>;
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await axios.post(API_ROUTES.auth.login, data);
    return response.data;
  },

  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await axios.post(API_ROUTES.auth.signup, data);
    return response.data;
  },

  async validateToken(token: string): Promise<boolean> {
    try {
      await axios.get(`${API_ROUTES.auth.login}/validate`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return true;
    } catch {
      return false;
    }
  }
}; 