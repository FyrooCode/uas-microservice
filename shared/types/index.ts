// Shared types across microservices

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  category?: Category;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
}

export interface UpdateProductInput {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: string;
}

export interface Delivery {
  id: string;
  orderId: string;
  status: DeliveryStatus;
  deliveryAddress: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum DeliveryStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PACKED = 'packed',
  SHIPPED = 'shipped',
  IN_TRANSIT = 'in_transit',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  RETURNED = 'returned'
}

export interface CreateDeliveryInput {
  orderId: string;
  deliveryAddress: string;
  customerName?: string;
  customerPhone?: string;
  orderItems?: OrderItem[];
}

export interface UpdateDeliveryStatusInput {
  id: string;
  status: DeliveryStatus;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

// GraphQL Context types
export interface GraphQLContext {
  dataSources?: any;
  user?: any;
}

// Error types
export interface ServiceError {
  code: string;
  message: string;
  details?: any;
}

// API Response types
export interface PaginationInput {
  page?: number;
  limit?: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationInfo;
}
