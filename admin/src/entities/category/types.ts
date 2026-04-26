export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  parentId?: string | null;
  parent?: Category | null;
  children: Category[];
  order: number;
  isActive: boolean;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {
  id: string;
}
