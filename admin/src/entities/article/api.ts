import { apiClient } from '@/shared/lib/api/client';
import type { Article, CreateArticleDto, UpdateArticleDto } from './types';

interface ArticlesResponse {
  page: number;
  limit: number;
  total: number;
  items: Article[];
}

export const adminArticlesApi = {
  /**
   * Получить список статей
   */
  async getList(params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    isPublished?: boolean;
  }): Promise<ArticlesResponse> {
    const response = await apiClient.get<ArticlesResponse>('/api/admin/articles', { params });
    return response.data;
  },

  /**
   * Получить статью по ID
   */
  async getById(id: string): Promise<Article> {
    const response = await apiClient.get<Article>(`/api/admin/articles/${id}`);
    return response.data;
  },

  /**
   * Создать статью
   */
  async create(data: CreateArticleDto): Promise<Article> {
    const response = await apiClient.post<Article>('/api/admin/articles', data);
    return response.data;
  },

  /**
   * Обновить статью
   */
  async update(id: string, data: UpdateArticleDto): Promise<Article> {
    const response = await apiClient.patch<Article>(`/api/admin/articles/${id}`, data);
    return response.data;
  },

  /**
   * Удалить статью
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/articles/${id}`);
  },

  /**
   * Опубликовать/снять с публикации
   */
  async togglePublished(id: string): Promise<Article> {
    const response = await apiClient.patch<Article>(
      `/api/admin/articles/${id}/toggle-published`
    );
    return response.data;
  },
};
