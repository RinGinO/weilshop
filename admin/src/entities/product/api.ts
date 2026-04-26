import { apiClient } from '@/shared/lib/api/client';
import type { Product, CreateProductDto, UpdateProductDto } from './types';

interface ProductsResponse {
  page: number;
  limit: number;
  total: number;
  items: Product[];
}

export const adminProductsApi = {
  /**
   * Получить список товаров
   */
  async getList(params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    brandId?: string;
    isActive?: boolean;
  }): Promise<ProductsResponse> {
    const response = await apiClient.get<ProductsResponse>('/api/admin/products', { params });
    return response.data;
  },

  /**
   * Получить товар по ID
   */
  async getById(id: string): Promise<Product> {
    const response = await apiClient.get<Product>(`/api/admin/products/${id}`);
    return response.data;
  },

  /**
   * Создать товар
   */
  async create(data: CreateProductDto): Promise<Product> {
    const response = await apiClient.post<Product>('/api/admin/products', data);
    return response.data;
  },

  /**
   * Обновить товар
   */
  async update(id: string, data: UpdateProductDto): Promise<Product> {
    const response = await apiClient.patch<Product>(`/api/admin/products/${id}`, data);
    return response.data;
  },

  /**
   * Удалить товар (мягкое)
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/products/${id}`);
  },

  /**
   * Активировать/деактивировать товар
   */
  async toggleActive(id: string): Promise<Product> {
    const response = await apiClient.patch<Product>(`/api/admin/products/${id}/toggle-active`);
    return response.data;
  },
};
