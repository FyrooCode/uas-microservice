import { Op } from 'sequelize';
import Product from '../models/Product';

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
  recentProducts: any[];
  lowStockAlerts: any[];
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

class StoreService {
  /**
   * Get comprehensive store statistics
   */
  async getStoreStats(): Promise<StoreStats> {
    try {
      const totalProducts = await Product.count();
      
      const products = await Product.findAll({
        attributes: ['price', 'stock', 'categoryId']
      });

      let totalValue = 0;
      let lowStockProducts = 0;
      let outOfStockProducts = 0;
      const categoriesSet = new Set<string>();

      products.forEach(product => {
        totalValue += product.price * product.stock;
        categoriesSet.add(product.categoryId);
        
        if (product.stock === 0) {
          outOfStockProducts++;
        } else if (product.stock <= 10) {
          lowStockProducts++;
        }
      });

      const averagePrice = products.length > 0 
        ? products.reduce((sum, p) => sum + p.price, 0) / products.length 
        : 0;

      return {
        totalProducts,
        totalValue,
        lowStockProducts,
        outOfStockProducts,
        averagePrice,
        categoriesUsed: Array.from(categoriesSet)
      };
    } catch (error) {
      console.error('Error getting store stats:', error);
      throw new Error('Failed to get store statistics');
    }
  }

  /**
   * Get category breakdown statistics
   */
  async getCategoryBreakdown(): Promise<CategoryStats[]> {
    try {
      const products = await Product.findAll({
        attributes: ['categoryId', 'price', 'stock']
      });

      const categoryMap = new Map<string, {
        count: number;
        totalValue: number;
        totalPrice: number;
        totalStock: number;
      }>();

      products.forEach(product => {
        const categoryId = product.categoryId;
        const existing = categoryMap.get(categoryId) || {
          count: 0,
          totalValue: 0,
          totalPrice: 0,
          totalStock: 0
        };

        existing.count++;
        existing.totalValue += product.price * product.stock;
        existing.totalPrice += product.price;
        existing.totalStock += product.stock;
        
        categoryMap.set(categoryId, existing);
      });

      return Array.from(categoryMap.entries()).map(([categoryId, stats]) => ({
        categoryId,
        productCount: stats.count,
        totalValue: stats.totalValue,
        averagePrice: stats.totalPrice / stats.count,
        totalStock: stats.totalStock
      }));
    } catch (error) {
      console.error('Error getting category breakdown:', error);
      throw new Error('Failed to get category breakdown');
    }
  }

  /**
   * Get comprehensive store overview
   */
  async getStoreOverview(): Promise<StoreOverview> {
    try {
      const [stats, categoryBreakdown, recentProducts, lowStockAlerts] = await Promise.all([
        this.getStoreStats(),
        this.getCategoryBreakdown(),
        this.getRecentProducts(5),
        this.getLowStockAlerts()
      ]);

      return {
        stats,
        categoryBreakdown,
        recentProducts,
        lowStockAlerts
      };
    } catch (error) {
      console.error('Error getting store overview:', error);
      throw new Error('Failed to get store overview');
    }
  }

  /**
   * Get recent products
   */
  async getRecentProducts(limit: number = 10): Promise<any[]> {
    try {
      return await Product.findAll({
        limit,
        order: [['createdAt', 'DESC']]
      });
    } catch (error) {
      console.error('Error getting recent products:', error);
      throw new Error('Failed to get recent products');
    }
  }

  /**
   * Get low stock alerts
   */
  async getLowStockAlerts(threshold: number = 10): Promise<any[]> {
    try {
      return await Product.findAll({
        where: {
          stock: {
            [Op.lte]: threshold,
            [Op.gt]: 0
          }
        },
        order: [['stock', 'ASC']]
      });
    } catch (error) {
      console.error('Error getting low stock alerts:', error);
      throw new Error('Failed to get low stock alerts');
    }
  }

  /**
   * Get out of stock products
   */
  async getOutOfStockProducts(): Promise<any[]> {
    try {
      return await Product.findAll({
        where: {
          stock: 0
        },
        order: [['updatedAt', 'DESC']]
      });
    } catch (error) {
      console.error('Error getting out of stock products:', error);
      throw new Error('Failed to get out of stock products');
    }
  }

  /**
   * Get product analytics
   */
  async getProductAnalytics(): Promise<ProductAnalytics[]> {
    try {
      const products = await Product.findAll();

      return products.map(product => {
        let stockLevel: 'high' | 'medium' | 'low' | 'out_of_stock';
        if (product.stock === 0) {
          stockLevel = 'out_of_stock';
        } else if (product.stock <= 5) {
          stockLevel = 'low';
        } else if (product.stock <= 20) {
          stockLevel = 'medium';
        } else {
          stockLevel = 'high';
        }

        let priceCategory: 'budget' | 'mid_range' | 'premium';
        if (product.price <= 100) {
          priceCategory = 'budget';
        } else if (product.price <= 500) {
          priceCategory = 'mid_range';
        } else {
          priceCategory = 'premium';
        }

        return {
          productId: product.id,
          name: product.name,
          categoryId: product.categoryId,
          stockLevel,
          priceCategory,
          availability: product.stock > 0,
          value: product.price * product.stock
        };
      });
    } catch (error) {
      console.error('Error getting product analytics:', error);
      throw new Error('Failed to get product analytics');
    }
  }

  /**
   * Get products by category with enhanced information
   */
  async getProductsByCategory(categoryId: string): Promise<any[]> {
    try {
      return await Product.findAll({
        where: { categoryId },
        order: [['name', 'ASC']]
      });
    } catch (error) {
      console.error('Error getting products by category:', error);
      throw new Error('Failed to get products by category');
    }
  }

  /**
   * Search products with comprehensive results
   */
  async searchProducts(searchTerm: string): Promise<any[]> {
    try {
      return await Product.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${searchTerm}%` } },
            { description: { [Op.like]: `%${searchTerm}%` } }
          ]
        },
        order: [['name', 'ASC']]
      });
    } catch (error) {
      console.error('Error searching products:', error);
      throw new Error('Failed to search products');
    }
  }

  /**
   * Get inventory summary
   */
  async getInventorySummary(): Promise<{
    totalProducts: number;
    totalStockValue: number;
    totalItems: number;
    averageStockPerProduct: number;
  }> {
    try {
      const products = await Product.findAll({
        attributes: ['price', 'stock']
      });

      const totalProducts = products.length;
      const totalStockValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
      const totalItems = products.reduce((sum, p) => sum + p.stock, 0);
      const averageStockPerProduct = totalProducts > 0 ? totalItems / totalProducts : 0;

      return {
        totalProducts,
        totalStockValue,
        totalItems,
        averageStockPerProduct
      };
    } catch (error) {
      console.error('Error getting inventory summary:', error);
      throw new Error('Failed to get inventory summary');
    }
  }
}

export default StoreService;
