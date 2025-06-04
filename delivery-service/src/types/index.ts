// Types for order items in different contexts

export interface StoredOrderItem {
  productId: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface EnrichedOrderItem extends OrderItem {
  category?: string;
  isAvailable: boolean;
}

export interface ProductInfo {
  id: string;
  name: string;
  stock: number;
  price: number;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
  };
  isAvailable?: boolean;
}

export interface ProductStockReduction {
  productId: string;
  quantity: number;
}

export interface StockReductionResult {
  success: boolean;
  productId: string;
  remainingStock?: number;
  error?: string;
}
