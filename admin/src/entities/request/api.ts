import { apiClient } from '@/shared/lib/api/client';
import type { RequestOrder, UpdateRequestStatusDto } from './types';

interface RequestsResponse {
  page: number;
  limit: number;
  total: number;
  items: RequestOrder[];
}

export const adminRequestsApi = {
  /**
   * Получить список заявок
   */
  async getList(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<RequestsResponse> {
    const response = await apiClient.get<RequestsResponse>('/api/admin/requests', { params });
    return response.data;
  },

  /**
   * Получить заявку по ID
   */
  async getById(id: string): Promise<RequestOrder> {
    const response = await apiClient.get<RequestOrder>(`/api/admin/requests/${id}`);
    return response.data;
  },

  /**
   * Обновить статус заявки
   */
  async updateStatus(id: string, data: UpdateRequestStatusDto): Promise<RequestOrder> {
    const response = await apiClient.patch<RequestOrder>(
      `/api/admin/requests/${id}/status`,
      data
    );
    return response.data;
  },

  /**
   * Удалить заявку
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/requests/${id}`);
  },
};
