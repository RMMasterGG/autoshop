export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface PublicOrderRequest {
  username: string;
  email: string;
  phone: string;
  car: string;
  serviceId: string;
  message: string;
}

export interface OrderResponse {
  id: string;
  userId: string;
  customerName: string;
  car: string;
  service: string;
  price: number;
  status: OrderStatus;
  createdAt: string;
}
