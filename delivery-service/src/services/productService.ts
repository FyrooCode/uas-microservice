import { GraphQLClient } from 'graphql-request';

interface ProductStockReduction {
  productId: string;
  quantity: number;
}

interface StockReductionResult {
  success: boolean;
  productId: string;
  remainingStock?: number;
  error?: string;
}

interface ProductInfo {
  id: string;
  name: string;
  stock: number;
  price: number;
}

interface GetProductResponse {
  product: ProductInfo;
}

interface ReduceProductStockResponse {
  reduceProductStock: ProductInfo;
}

interface UpdateProductStockResponse {
  updateProductStock: ProductInfo;
}

class ProductService {
  private client: GraphQLClient;

  constructor() {
    // Use Docker internal networking for service-to-service communication
    const productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://product-service:4001/graphql';
    this.client = new GraphQLClient(productServiceUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Get product information by ID
   */
  async getProduct(productId: string): Promise<ProductInfo | null> {
    try {
      const query = `
        query GetProduct($id: ID!) {
          product(id: $id) {
            id
            name
            stock
            price
          }
        }
      `;      const result = await this.client.request<GetProductResponse>(query, { id: productId });
      return result.product;
    } catch (error: any) {
      console.error(`Failed to get product ${productId}:`, error);
      return null;
    }
  }

  /**
   * Reduce stock for a single product
   */
  async reduceProductStock(productId: string, quantity: number): Promise<StockReductionResult> {
    try {
      console.log(`🔄 Reducing stock for product ${productId} by ${quantity}`);
      
      const mutation = `
        mutation ReduceStock($id: ID!, $quantity: Int!) {
          reduceProductStock(id: $id, quantity: $quantity) {
            id
            name
            stock
          }
        }
      `;      const result = await this.client.request<ReduceProductStockResponse>(mutation, { id: productId, quantity });
      
      console.log(`✅ Stock reduced successfully for ${result.reduceProductStock.name}. Remaining: ${result.reduceProductStock.stock}`);
      
      return {
        success: true,
        productId,
        remainingStock: result.reduceProductStock.stock
      };
    } catch (error: any) {
      console.error(`❌ Failed to reduce stock for product ${productId}:`, error);
      
      // Parse GraphQL errors for better error messages
      let errorMessage = 'Failed to reduce stock';
      if (error.response?.errors) {
        errorMessage = error.response.errors[0]?.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        productId,
        error: errorMessage
      };
    }
  }

  /**
   * Validate and reduce stock for multiple products
   * This ensures atomicity - either all succeed or all fail
   */
  async validateAndReduceMultipleProducts(items: ProductStockReduction[]): Promise<{
    success: boolean;
    results: StockReductionResult[];
    failedItems: string[];
    successfulReductions: { productId: string; quantity: number }[];
  }> {
    console.log(`🔍 Validating and reducing stock for ${items.length} products...`);
    
    const results: StockReductionResult[] = [];
    const failedItems: string[] = [];
    const successfulReductions: { productId: string; quantity: number }[] = [];

    // Step 1: Try to reduce stock for each item
    for (const item of items) {
      const result = await this.reduceProductStock(item.productId, item.quantity);
      results.push(result);
      
      if (!result.success) {
        failedItems.push(item.productId);
      } else {
        successfulReductions.push({ productId: item.productId, quantity: item.quantity });
      }
    }

    // Step 2: If any failed, we need to rollback successful reductions
    if (failedItems.length > 0) {
      console.log(`❌ ${failedItems.length} items failed. Rolling back successful reductions...`);
      
      // Rollback by adding back the stock we successfully reduced
      for (const rollback of successfulReductions) {
        try {
          const restoreQuery = `
            mutation UpdateStock($id: ID!, $quantity: Int!) {
              updateProductStock(id: $id, quantity: $quantity) {
                id
                name
                stock
              }
            }
          `;
          
          // Get current stock and add back what we reduced
          const product = await this.getProduct(rollback.productId);
          if (product) {
            const newStock = product.stock + rollback.quantity;            await this.client.request<UpdateProductStockResponse>(restoreQuery, { 
              id: rollback.productId, 
              quantity: newStock 
            });
            console.log(`🔄 Rolled back ${rollback.quantity} units for product ${rollback.productId}`);
          }
        } catch (rollbackError) {
          console.error(`❌ Failed to rollback product ${rollback.productId}:`, rollbackError);
        }
      }
    }

    const isSuccess = failedItems.length === 0;
    console.log(isSuccess ? '✅ All stock reductions successful' : `❌ ${failedItems.length} stock reductions failed`);

    return {
      success: isSuccess,
      results,
      failedItems,
      successfulReductions: isSuccess ? successfulReductions : []
    };
  }

  /**
   * Validate that products exist and have sufficient stock
   */
  async validateProductsStock(items: ProductStockReduction[]): Promise<{
    valid: boolean;
    invalidItems: { productId: string; reason: string; availableStock?: number }[];
  }> {
    console.log(`🔍 Validating stock for ${items.length} products...`);
    
    const invalidItems: { productId: string; reason: string; availableStock?: number }[] = [];

    for (const item of items) {
      const product = await this.getProduct(item.productId);
      
      if (!product) {
        invalidItems.push({
          productId: item.productId,
          reason: 'Product not found'
        });
      } else if (product.stock < item.quantity) {
        invalidItems.push({
          productId: item.productId,
          reason: 'Insufficient stock',
          availableStock: product.stock
        });
      }
    }

    return {
      valid: invalidItems.length === 0,
      invalidItems
    };
  }
}

export default new ProductService();
