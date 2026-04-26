import { apiClient } from '@/shared/lib/api/client';
import type { Brand, CreateBrandDto, UpdateBrandDto } from './types';

export const adminBrandsApi = {
  /**
   * Получить список брендов
   */
  async getList(): Promise<Brand[]> {
    const response = await apiClient.get<Brand[]>('/api/admin/brands');
    return response.data;
  },

  /**
   * Получить бренд по ID
   */
  async getById(id: string): Promise<Brand> {
    const response = await apiClient.get<Brand>(`/api/admin/brands/${id}`);
    return response.data;
  },

  /**
   * Создать бренд
   */
  async create(data: CreateBrandDto): Promise<Brand> {
    const response = await apiClient.post<Brand>('/api/admin/brands', data);
    return response.data;
  },

  /**
   * Обновить бренд
   */
  async update(id: string, data: UpdateBrandDto): Promise<Brand> {
    const response = await apiClient.patch<Brand>(`/api/admin/brands/${id}`, data);
    return response.data;
  },

  /**
   * Удалить бренд
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/brands/${id}`);
  },

  /**
   * Активировать/деактивировать бренд
   */
  async toggleActive(id: string): Promise<Brand> {
    const response = await apiClient.patch<Brand>(`/api/admin/brands/${id}/toggle-active`);
    return response.data;
  },
};
