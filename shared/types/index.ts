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

// Store Team Types - Comprehensive analytics and insights
export interface StoreStats {
  totalProducts: number;
  totalValue: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  averagePrice: number;
  categoriesUsed: string[];
}

export interface CategoryStats {
  categoryId: string;
  productCount: number;
  totalValue: number;
  averagePrice: number;
  totalStock: number;
}

export interface StoreOverview {
  stats: StoreStats;
  categoryBreakdown: CategoryStats[];
  recentProducts: Product[];
  lowStockAlerts: Product[];
}

export interface ProductAnalytics {
  productId: string;
  name: string;
  categoryId: string;
  stockLevel: 'high' | 'medium' | 'low' | 'out_of_stock';
  priceCategory: 'budget' | 'mid_range' | 'premium';
  availability: boolean;
  value: number;
}

export interface InventorySummary {
  totalProducts: number;
  totalStockValue: number;
  totalItems: number;
  averageStockPerProduct: number;
}
