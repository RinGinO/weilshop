import { apiClient } from '@/shared/lib/api/client';
import type { CareTask, CareTaskListResponse } from './types';

export const tasksApi = {
  /**
   * Получить список задач ухода
   */
  async getList(): Promise<CareTaskListResponse> {
    const response = await apiClient.get<CareTaskListResponse>('/api/tasks');
    return response.data;
  },

  /**
   * Получить задачу по slug
   */
  async getBySlug(slug: string): Promise<CareTask> {
    const response = await apiClient.get<CareTask>(`/api/tasks/${slug}`);
    return response.data;
  },

  /**
   * Получить рекомендованные товары для задачи
   */
  async getProducts(slug: string): Promise<any[]> {
    const response = await apiClient.get<any[]>(`/api/tasks/${slug}/products`);
    return response.data;
  },
};
