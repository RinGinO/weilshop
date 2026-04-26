export interface Instruction {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  content: string;
  coverImageUrl?: string | null;
  difficulty: InstructionDifficulty;
  estimatedTime: number;
  materials: InstructionMaterial[];
  steps: InstructionStep[];
  isActive: boolean;
  isPublished: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type InstructionDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface InstructionMaterial {
  id: string;
  name: string;
  quantity?: string | null;
}

export interface InstructionStep {
  id: string;
  order: number;
  title: string;
  description: string;
  imageUrl?: string | null;
}

export interface CreateInstructionDto {
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  coverImageUrl?: string;
  difficulty: InstructionDifficulty;
  estimatedTime: number;
  materials?: CreateInstructionMaterialDto[];
  steps?: CreateInstructionStepDto[];
  isPublished?: boolean;
}

export interface CreateInstructionMaterialDto {
  name: string;
  quantity?: string;
}

export interface CreateInstructionStepDto {
  order: number;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface UpdateInstructionDto extends Partial<CreateInstructionDto> {
  id: string;
}
