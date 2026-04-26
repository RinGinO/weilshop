export interface Brand {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  isActive: boolean;
  productCount: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBrandDto {
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateBrandDto extends Partial<CreateBrandDto> {
  id: string;
}
