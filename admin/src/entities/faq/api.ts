import { apiClient } from '@/shared/lib/api/client';
import type { FaqItem, CreateFaqItemDto, UpdateFaqItemDto } from './types';

export const adminFaqApi = {
  /**
   * Получить список FAQ
   */
  async getList(params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
  }): Promise<{ page: number; limit: number; total: number; items: FaqItem[] }> {
    const response = await apiClient.get('/api/admin/faq', { params });
    return response.data;
  },

  /**
   * Получить FAQ по ID
   */
  async getById(id: string): Promise<FaqItem> {
    const response = await apiClient.get<FaqItem>(`/api/admin/faq/${id}`);
    return response.data;
  },

  /**
   * Создать FAQ
   */
  async create(data: CreateFaqItemDto): Promise<FaqItem> {
    const response = await apiClient.post<FaqItem>('/api/admin/faq', data);
    return response.data;
  },

  /**
   * Обновить FAQ
   */
  async update(id: string, data: UpdateFaqItemDto): Promise<FaqItem> {
    const response = await apiClient.patch<FaqItem>(`/api/admin/faq/${id}`, data);
    return response.data;
  },

  /**
   * Удалить FAQ
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/faq/${id}`);
  },

  /**
   * Активировать/деактивировать FAQ
   */
  async toggleActive(id: string): Promise<FaqItem> {
    const response = await apiClient.patch<FaqItem>(`/api/admin/faq/${id}/toggle-active`);
    return response.data;
  },
};
