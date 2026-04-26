import { apiClient } from '@/shared/lib/api/client';
import type { Instruction, CreateInstructionDto } from './types';
import type { UpdateInstructionDto } from './types';

interface InstructionsResponse {
  page: number;
  limit: number;
  total: number;
  items: Instruction[];
}

export const adminInstructionsApi = {
  /**
   * Получить список инструкций
   */
  async getList(params?: {
    page?: number;
    limit?: number;
    search?: string;
    difficulty?: string;
  }): Promise<InstructionsResponse> {
    const response = await apiClient.get<InstructionsResponse>('/api/admin/instructions', {
      params,
    });
    return response.data;
  },

  /**
   * Получить инструкцию по ID
   */
  async getById(id: string): Promise<Instruction> {
    const response = await apiClient.get<Instruction>(`/api/admin/instructions/${id}`);
    return response.data;
  },

  /**
   * Создать инструкцию
   */
  async create(data: CreateInstructionDto): Promise<Instruction> {
    const response = await apiClient.post<Instruction>('/api/admin/instructions', data);
    return response.data;
  },

  /**
   * Обновить инструкцию
   */
  async update(id: string, data: UpdateInstructionDto): Promise<Instruction> {
    const response = await apiClient.patch<Instruction>(
      `/api/admin/instructions/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Удалить инструкцию
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/instructions/${id}`);
  },

  /**
   * Опубликовать/снять с публикации
   */
  async togglePublished(id: string): Promise<Instruction> {
    const response = await apiClient.patch<Instruction>(
      `/api/admin/instructions/${id}/toggle-published`
    );
    return response.data;
  },
};

