export interface ConsultationRequest {
  id: string;
  status: ConsultationStatus;
  customer: ConsultationCustomer;
  vehicleInfo?: ConsultationVehicleInfo | null;
  requestedProducts: ConsultationProduct[];
  comment?: string | null;
  preferredContactMethod: string;
  isAdminViewed: boolean;
  responseComment?: string | null;
  respondedAt?: string | null;
  respondedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ConsultationCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
}

export interface ConsultationVehicleInfo {
  brand?: string | null;
  model?: string | null;
  year?: number | null;
  color?: string | null;
}

export interface ConsultationProduct {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
}

export type ConsultationStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface UpdateConsultationDto {
  status?: ConsultationStatus;
  responseComment?: string;
}
