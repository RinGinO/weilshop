export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  categoryId: string;
  category: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFaqItemDto {
  question: string;
  answer: string;
  categoryId: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateFaqItemDto extends Partial<CreateFaqItemDto> {
  id: string;
}
