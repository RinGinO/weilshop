export interface Article {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  content: string;
  coverImageUrl?: string | null;
  authorId?: string | null;
  authorName?: string | null;
  categoryId: string;
  category: ArticleCategory;
  tags: string[];
  viewCount: number;
  isActive: boolean;
  isPublished: boolean;
  publishedAt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleCategory {
  id: string;
  slug: string;
  name: string;
}

export interface CreateArticleDto {
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  coverImageUrl?: string;
  categoryId: string;
  tags?: string[];
  isPublished?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface UpdateArticleDto extends Partial<CreateArticleDto> {
  id: string;
}
