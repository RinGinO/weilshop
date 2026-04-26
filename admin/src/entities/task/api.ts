import { apiClient } from '@/shared/lib/api/client';
import type { CareTask, CreateCareTaskDto } from './types';

export const adminTasksApi = {
  /**
   * Получить список задач
   */
  async getList(): Promise<CareTask[]> {
    const response = await apiClient.get<CareTask[]>('/api/admin/tasks');
    return response.data;
  },

  /**
   * Получить задачу по ID
   */
  async getById(id: string): Promise<CareTask> {
    const response = await apiClient.get<CareTask>(`/api/admin/tasks/${id}`);
    return response.data;
  },

  /**
   * Создать задачу
   */
  async create(data: CreateCareTaskDto): Promise<CareTask> {
    const response = await apiClient.post<CareTask>('/api/admin/tasks', data);
    return response.data;
  },

  /**
   * Обновить задачу
   */
  async update(id: string, data: Partial<CreateCareTaskDto>): Promise<CareTask> {
    const response = await apiClient.patch<CareTask>(`/api/admin/tasks/${id}`, data);
    return response.data;
  },

  /**
   * Удалить задачу
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/tasks/${id}`);
  },

  /**
   * Активировать/деактивировать задачу
   */
  async toggleActive(id: string): Promise<CareTask> {
    const response = await apiClient.patch<CareTask>(`/api/admin/tasks/${id}/toggle-active`);
    return response.data;
  },
};
