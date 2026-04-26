export interface RequestOrder {
  id: string;
  orderNumber: string;
  status: RequestStatus;
  customer: RequestCustomer;
  items: RequestOrderItem[];
  totalAmount: number;
  comment?: string | null;
  contactEmail: string;
  contactPhone: string;
  deliveryMethod: string;
  deliveryAddress?: string | null;
  statusHistory: RequestStatusHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface RequestCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
}

export interface RequestOrderItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  quantity: number;
  price: number;
  volume?: string | null;
  subtotal: number;
}

export type RequestStatus =
  | 'NEW'
  | 'IN_REVIEW'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'CANCELLED';

export interface RequestStatusHistory {
  id: string;
  status: RequestStatus;
  comment?: string | null;
  changedBy?: string | null;
  changedAt: string;
}

export interface UpdateRequestStatusDto {
  status: RequestStatus;
  comment?: string;
}
