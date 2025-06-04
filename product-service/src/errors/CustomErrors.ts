
export class ProductNotFoundError extends Error {
  constructor(id: string) {
    super(`Product with ID '${id}' not found`);
    this.name = 'ProductNotFoundError';
  }
}

export class InsufficientStockError extends Error {
  constructor(requested: number, available: number, productName?: string) {
    const productInfo = productName ? ` for product '${productName}'` : '';
    super(`Insufficient stock${productInfo}. Requested: ${requested}, Available: ${available}`);
    this.name = 'InsufficientStockError';
  }
}

export class InvalidQuantityError extends Error {
  constructor(quantity: number) {
    super(`Invalid quantity: ${quantity}. Quantity must be a positive number`);
    this.name = 'InvalidQuantityError';
  }
}
