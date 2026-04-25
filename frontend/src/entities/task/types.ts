export interface CareTask {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  problemDescription: string;
  icon?: string | null;
  steps: CareTaskStep[];
  tips: string[];
  faq: CareTaskFaq[];
  productsCount: number;
  avgTime?: string | null;
  frequency?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CareTaskStep {
  id: string;
  number: number;
  title: string;
  description: string;
  duration?: string | null;
}

export interface CareTaskFaq {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface CareTaskListResponse {
  page: number;
  limit: number;
  total: number;
  items: CareTask[];
}
