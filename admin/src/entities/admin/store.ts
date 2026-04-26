import { create } from 'zustand';
import { adminAuthApi } from './api';
import type { Admin, LoginDto } from './types';

interface AuthState {
  admin: Admin | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  login: (data: LoginDto) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearAdmin: () => void;
}

export const useAdminAuthStore = create<AuthState>((set, get) => ({
  admin: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (data) => {
    const response = await adminAuthApi.login(data);
    localStorage.setItem('adminAccessToken', response.accessToken);
    localStorage.setItem('adminRefreshToken', response.refreshToken);
    set({ admin: response.admin, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    try {
      await adminAuthApi.logout();
    } catch (e) {
      // Игнорируем ошибки logout
    }
    localStorage.removeItem('adminAccessToken');
    localStorage.removeItem('adminRefreshToken');
    set({ admin: null, isAuthenticated: false, isLoading: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('adminAccessToken');
    if (!token) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }

    try {
      const admin = await adminAuthApi.getProfile();
      set({ admin, isAuthenticated: true, isLoading: false });
    } catch (e) {
      set({ isLoading: false, isAuthenticated: false, admin: null });
    }
  },

  clearAdmin: () => {
    set({ admin: null, isAuthenticated: false, isLoading: false });
  },
}));
