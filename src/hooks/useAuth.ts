import { create } from 'zustand';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
}

// Manejo de token en localStorage - Podria mejorarse seteandolo en las cookies
export const useAuth = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  setToken: (token: string | null) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token, isAuthenticated: !!token });
  },
})); 