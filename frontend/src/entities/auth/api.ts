import { apiClient } from '@/shared/lib/api/client';
import type {
  User,
  RegisterDto,
  LoginDto,
  AuthResponse,
  RefreshDto,
  UpdateProfileDto,
  ChangePasswordDto,
} from './types';

export const authApi = {
  /**
   * Регистрация нового пользователя
   */
  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  },

  /**
   * Вход пользователя
   */
  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  },

  /**
   * Refresh токена
   */
  async refresh(data: RefreshDto): Promise<{ accessToken: string }> {
    const response = await apiClient.post<{ accessToken: string }>('/api/auth/refresh', data);
    return response.data;
  },

  /**
   * Выход (очистка refresh токена)
   */
  async logout(): Promise<void> {
    await apiClient.post('/api/auth/logout');
  },

  /**
   * Получить текущий профиль
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/api/account/profile');
    return response.data;
  },

  /**
   * Обновить профиль
   */
  async updateProfile(data: UpdateProfileDto): Promise<User> {
    const response = await apiClient.patch<User>('/api/account/profile', data);
    return response.data;
  },

  /**
   * Сменить пароль
   */
  async changePassword(data: ChangePasswordDto): Promise<void> {
    await apiClient.post('/api/account/change-password', data);
  },

  /**
   * Запрос на восстановление пароля
   */
  async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/api/auth/forgot-password', { email });
  },
};
