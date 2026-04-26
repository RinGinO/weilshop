import { apiClient } from '@/shared/lib/api/client';
import type { Admin, AdminRole, CreateAdminDto, UpdateAdminDto, CreateRoleDto, UpdateRoleDto } from './types';

export const adminUsersApi = {
  /**
   * Получить список администраторов
   */
  async getList(): Promise<Admin[]> {
    const response = await apiClient.get<Admin[]>('/api/admin/admins');
    return response.data;
  },

  /**
   * Получить администратора по ID
   */
  async getById(id: string): Promise<Admin> {
    const response = await apiClient.get<Admin>(`/api/admin/admins/${id}`);
    return response.data;
  },

  /**
   * Создать администратора
   */
  async create(data: CreateAdminDto): Promise<Admin> {
    const response = await apiClient.post<Admin>('/api/admin/admins', data);
    return response.data;
  },

  /**
   * Обновить администратора
   */
  async update(id: string, data: UpdateAdminDto): Promise<Admin> {
    const response = await apiClient.patch<Admin>(`/api/admin/admins/${id}`, data);
    return response.data;
  },

  /**
   * Удалить администратора
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/admins/${id}`);
  },

  /**
   * Активировать/деактивировать администратора
   */
  async toggleActive(id: string): Promise<Admin> {
    const response = await apiClient.patch<Admin>(`/api/admin/admins/${id}/toggle-active`);
    return response.data;
  },

  /**
   * Получить список ролей
   */
  async getRoles(): Promise<AdminRole[]> {
    const response = await apiClient.get<AdminRole[]>('/api/admin/roles');
    return response.data;
  },

  /**
   * Создать роль
   */
  async createRole(data: CreateRoleDto): Promise<AdminRole> {
    const response = await apiClient.post<AdminRole>('/api/admin/roles', data);
    return response.data;
  },

  /**
   * Обновить роль
   */
  async updateRole(id: string, data: UpdateRoleDto): Promise<AdminRole> {
    const response = await apiClient.patch<AdminRole>(`/api/admin/roles/${id}`, data);
    return response.data;
  },

  /**
   * Удалить роль
   */
  async deleteRole(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/roles/${id}`);
  },
};
