export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  volume?: string | null;
  sku: string;
  isActive: boolean;
  isHit: boolean;
  isNew: boolean;
  rating: number;
  reviewCount: number;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  brandId: string;
  brand: {
    id: string;
    name: string;
    slug: string;
  };
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
  isMain: boolean;
  order: number;
}

export interface CreateProductDto {
  name: string;
  slug: string;
  description: string;
  price: number;
  volume?: string;
  sku: string;
  categoryId: string;
  brandId: string;
  isHit?: boolean;
  isNew?: boolean;
  images?: CreateProductImageDto[];
}

export interface CreateProductImageDto {
  url: string;
  alt?: string;
  isMain?: boolean;
  order?: number;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  id: string;
}
