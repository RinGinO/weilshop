export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  volume?: string | null;
  sku: string;
  brand: {
    id: string;
    slug: string;
    name: string;
  };
  category: {
    id: string;
    slug: string;
    name: string;
  };
  isActive: boolean;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockQuantity: number;
  features: string[];
  usage: string;
  precautions: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  page: number;
  limit: number;
  total: number;
  items: Product[];
}

export interface ProductsFilter {
  category?: string;
  brand?: string;
  task?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  sortBy?: 'name' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}
