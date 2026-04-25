import { apiClient } from '@/shared/lib/api/client';
import type { Product, ProductListResponse, ProductsFilter } from './types';

export const productsApi = {
  /**
   * Получить список товаров с фильтрацией
   */
  async getList(filters?: ProductsFilter): Promise<ProductListResponse> {
    const params = new URLSearchParams();

    if (filters?.category) params.append('category', filters.category);
    if (filters?.brand) params.append('brand', filters.brand);
    if (filters?.task) params.append('task', filters.task);
    if (filters?.minPrice) params.append('minPrice', String(filters.minPrice));
    if (filters?.maxPrice) params.append('maxPrice', String(filters.maxPrice));
    if (filters?.inStock !== undefined) params.append('inStock', String(filters.inStock));
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));

    const response = await apiClient.get<ProductListResponse>(`/api/catalog/products?${params}`);
    return response.data;
  },

  /**
   * Получить товар по slug
   */
  async getBySlug(slug: string): Promise<Product> {
    const response = await apiClient.get<Product>(`/api/catalog/products/${slug}`);
    return response.data;
  },

  /**
   * Получить сопутствующие товары
   */
  async getRelated(slug: string, limit: number = 4): Promise<Product[]> {
    const response = await apiClient.get<Product[]>(
      `/api/catalog/products/${slug}/related`,
      { params: { limit } }
    );
    return response.data;
  },
};
