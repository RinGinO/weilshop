import { apiClient } from '@/shared/lib/api/client';
import type { Admin, LoginDto, AuthResponse } from './types';

export const adminAuthApi = {
  /**
   * Вход администратора
   */
  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/admin/auth/login', data);
    return response.data;
  },

  /**
   * Refresh токена
   */
  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    const response = await apiClient.post('/api/admin/auth/refresh', { refreshToken });
    return response.data;
  },

  /**
   * Выход
   */
  async logout(): Promise<void> {
    await apiClient.post('/api/admin/auth/logout');
  },

  /**
   * Получить текущий профиль
   */
  async getProfile(): Promise<Admin> {
    const response = await apiClient.get<Admin>('/api/admin/profile');
    return response.data;
  },
};
