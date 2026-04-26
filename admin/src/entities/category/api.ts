import { apiClient } from '@/shared/lib/api/client';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from './types';

export const adminCategoriesApi = {
  /**
   * Получить список категорий (дерево)
   */
  async getTree(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>('/api/admin/categories/tree');
    return response.data;
  },

  /**
   * Получить категорию по ID
   */
  async getById(id: string): Promise<Category> {
    const response = await apiClient.get<Category>(`/api/admin/categories/${id}`);
    return response.data;
  },

  /**
   * Создать категорию
   */
  async create(data: CreateCategoryDto): Promise<Category> {
    const response = await apiClient.post<Category>('/api/admin/categories', data);
    return response.data;
  },

  /**
   * Обновить категорию
   */
  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    const response = await apiClient.patch<Category>(`/api/admin/categories/${id}`, data);
    return response.data;
  },

  /**
   * Удалить категорию
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/categories/${id}`);
  },

  /**
   * Активировать/деактивировать категорию
   */
  async toggleActive(id: string): Promise<Category> {
    const response = await apiClient.patch<Category>(`/api/admin/categories/${id}/toggle-active`);
    return response.data;
  },
};
