import { apiClient } from '@/shared/lib/api/client';
import type { ConsultationRequest, UpdateConsultationDto } from './types';

interface ConsultationsResponse {
  page: number;
  limit: number;
  total: number;
  items: ConsultationRequest[];
}

export const adminConsultationsApi = {
  /**
   * Получить список консультаций
   */
  async getList(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<ConsultationsResponse> {
    const response = await apiClient.get<ConsultationsResponse>('/api/admin/consultations', {
      params,
    });
    return response.data;
  },

  /**
   * Получить консультацию по ID
   */
  async getById(id: string): Promise<ConsultationRequest> {
    const response = await apiClient.get<ConsultationRequest>(
      `/api/admin/consultations/${id}`
    );
    return response.data;
  },

  /**
   * Обновить консультацию
   */
  async update(id: string, data: UpdateConsultationDto): Promise<ConsultationRequest> {
    const response = await apiClient.patch<ConsultationRequest>(
      `/api/admin/consultations/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Удалить консультацию
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/consultations/${id}`);
  },
};
