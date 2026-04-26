export interface CareTask {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  icon?: string | null;
  imageUrl?: string | null;
  steps: CareTaskStep[];
  tips: string[];
  faq: CareTaskFaq[];
  productsCount: number;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CareTaskStep {
  id: string;
  order: number;
  title: string;
  description: string;
  imageUrl?: string | null;
}

export interface CareTaskFaq {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface CreateCareTaskDto {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  icon?: string;
  imageUrl?: string;
  steps?: CreateCareTaskStepDto[];
  tips?: string[];
  faq?: CreateCareTaskFaqDto[];
  order?: number;
  isActive?: boolean;
}

export interface CreateCareTaskStepDto {
  order: number;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface CreateCareTaskFaqDto {
  question: string;
  answer: string;
  order: number;
}
