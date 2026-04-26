import { create } from 'zustand';
import { authApi } from './api';
import type { User, LoginDto, RegisterDto, ChangePasswordDto, UpdateProfileDto } from './types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfile: (data: UpdateProfileDto) => Promise<void>;
  changePassword: (data: ChangePasswordDto) => Promise<void>;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (data) => {
    const response = await authApi.login(data);
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    set({ user: response.user, isAuthenticated: true, isLoading: false });
  },

  register: async (data) => {
    const response = await authApi.register(data);
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    set({ user: response.user, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // Игнорируем ошибки logout
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }

    try {
      const user = await authApi.getProfile();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (e) {
      set({ isLoading: false, isAuthenticated: false, user: null });
    }
  },

  updateProfile: async (data) => {
    const user = await authApi.updateProfile(data);
    set({ user });
  },

  changePassword: async (data) => {
    await authApi.changePassword(data);
  },

  clearUser: () => {
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
}));
