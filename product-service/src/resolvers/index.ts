import { Op } from 'sequelize';
import Product from '../models/Product';
import StoreService from '../services/storeService';
import { ProductNotFoundError, InsufficientStockError, InvalidQuantityError } from '../errors/CustomErrors';

const storeService = new StoreService();

// Helper function to calculate pagination
const calculatePagination = (page: number, limit: number, totalItems: number) => {
  const totalPages = Math.ceil(totalItems / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    currentPage: page,
    totalPages,
    totalItems,
    hasNextPage,
    hasPreviousPage
  };
};

export const resolvers = {
  Query: {
    product: async (_: any, { id }: { id: string }) => {
      try {
        const product = await Product.findByPk(id);
        return product;
      } catch (error) {
        console.error('Error fetching product:', error);
        throw new Error('Failed to fetch product');
      }
    },

    products: async (_: any, { filter, pagination }: any) => {
      try {
        const page = pagination?.page || 1;
        const limit = pagination?.limit || 10;
        const offset = (page - 1) * limit;

        // Build where clause based on filter
        const whereClause: any = {};

        if (filter?.categoryId) {
          whereClause.categoryId = filter.categoryId;
        }

        if (filter?.minPrice !== undefined || filter?.maxPrice !== undefined) {
          whereClause.price = {};
          if (filter.minPrice !== undefined) {
            whereClause.price[Op.gte] = filter.minPrice;
          }
          if (filter.maxPrice !== undefined) {
            whereClause.price[Op.lte] = filter.maxPrice;
          }
        }

        if (filter?.inStock === true) {
          whereClause.stock = { [Op.gt]: 0 };
        }

        if (filter?.search) {
          whereClause[Op.or] = [
            { name: { [Op.like]: `%${filter.search}%` } },
            { description: { [Op.like]: `%${filter.search}%` } }
          ];
        }

        const { count, rows } = await Product.findAndCountAll({
          where: whereClause,
          limit,
          offset,
          order: [['createdAt', 'DESC']]
        });

        const paginationInfo = calculatePagination(page, limit, count);

        return {
          products: rows,
          pagination: paginationInfo
        };
      } catch (error) {
        console.error('Error fetching products:', error);
        throw new Error('Failed to fetch products');
      }
    },

    productsByCategory: async (_: any, { categoryId, pagination }: any) => {
      try {
        const page = pagination?.page || 1;
        const limit = pagination?.limit || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Product.findAndCountAll({
          where: { categoryId },
          limit,
          offset,
          order: [['createdAt', 'DESC']]
        });

        const paginationInfo = calculatePagination(page, limit, count);

        return {
          products: rows,
          pagination: paginationInfo
        };
      } catch (error) {
        console.error('Error fetching products by category:', error);
        throw new Error('Failed to fetch products by category');
      }
    },    searchProducts: async (_: any, { query, pagination }: any) => {
      try {
        const page = pagination?.page || 1;
        const limit = pagination?.limit || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Product.findAndCountAll({
          where: {
            [Op.or]: [
              { name: { [Op.like]: `%${query}%` } },
              { description: { [Op.like]: `%${query}%` } }
            ]
          },
          limit,
          offset,
          order: [['createdAt', 'DESC']]
        });

        const paginationInfo = calculatePagination(page, limit, count);

        return {
          products: rows,
          pagination: paginationInfo
        };
      } catch (error) {
        console.error('Error searching products:', error);
        throw new Error('Failed to search products');
      }
    },

    // Store Team Queries - Comprehensive store data and analytics
    storeOverview: async () => {
      try {
        return await storeService.getStoreOverview();
      } catch (error) {
        console.error('Error getting store overview:', error);
        throw new Error('Failed to get store overview');
      }
    },

    storeStats: async () => {
      try {
        return await storeService.getStoreStats();
      } catch (error) {
        console.error('Error getting store stats:', error);
        throw new Error('Failed to get store statistics');
      }
    },

    categoryBreakdown: async () => {
      try {
        return await storeService.getCategoryBreakdown();
      } catch (error) {
        console.error('Error getting category breakdown:', error);
        throw new Error('Failed to get category breakdown');
      }
    },

    productAnalytics: async () => {
      try {
        return await storeService.getProductAnalytics();
      } catch (error) {
        console.error('Error getting product analytics:', error);
        throw new Error('Failed to get product analytics');
      }
    },

    inventorySummary: async () => {
      try {
        return await storeService.getInventorySummary();
      } catch (error) {
        console.error('Error getting inventory summary:', error);
        throw new Error('Failed to get inventory summary');
      }
    },

    lowStockAlerts: async (_: any, { threshold }: { threshold?: number }) => {
      try {
        return await storeService.getLowStockAlerts(threshold);
      } catch (error) {
        console.error('Error getting low stock alerts:', error);
        throw new Error('Failed to get low stock alerts');
      }
    },

    outOfStockProducts: async () => {
      try {
        return await storeService.getOutOfStockProducts();
      } catch (error) {
        console.error('Error getting out of stock products:', error);
        throw new Error('Failed to get out of stock products');
      }
    },

    recentProducts: async (_: any, { limit }: { limit?: number }) => {
      try {
        return await storeService.getRecentProducts(limit);
      } catch (error) {
        console.error('Error getting recent products:', error);
        throw new Error('Failed to get recent products');
      }
    },

    storeSearchProducts: async (_: any, { query }: { query: string }) => {
      try {
        return await storeService.searchProducts(query);
      } catch (error) {
        console.error('Error searching products in store:', error);
        throw new Error('Failed to search products');
      }
    },

    storeProductsByCategory: async (_: any, { categoryId }: { categoryId: string }) => {
      try {
        return await storeService.getProductsByCategory(categoryId);
      } catch (error) {
        console.error('Error getting products by category in store:', error);
        throw new Error('Failed to get products by category');
      }
    }
  },

  Mutation: {    createProduct: async (_: any, { input }: any) => {
      try {
        // With store team integration, category validation is handled by store team
        // Basic validation can be added here if needed
        const product = await Product.create(input);
        return product;
      } catch (error) {
        console.error('Error creating product:', error);
        throw new Error('Failed to create product');
      }
    },    updateProduct: async (_: any, { input }: any) => {
      try {
        const { id, ...updateData } = input;

        // With store team integration, category validation is handled by store team
        // Basic validation can be added here if needed

        const [updatedRowsCount] = await Product.update(updateData, {
          where: { id }
        });

        if (updatedRowsCount === 0) {
          throw new Error('Product not found');
        }

        const updatedProduct = await Product.findByPk(id);
        return updatedProduct;
      } catch (error) {
        console.error('Error updating product:', error);
        throw new Error('Failed to update product');
      }
    },

    deleteProduct: async (_: any, { id }: { id: string }) => {
      try {
        const deletedRowsCount = await Product.destroy({
          where: { id }
        });

        return deletedRowsCount > 0;
      } catch (error) {
        console.error('Error deleting product:', error);
        throw new Error('Failed to delete product');
      }
    },

    updateProductStock: async (_: any, { id, quantity }: { id: string; quantity: number }) => {
      try {
        const product = await Product.findByPk(id);
        if (!product) {
          throw new Error('Product not found');
        }

        await product.increaseStock(quantity);
        return product;
      } catch (error) {
        console.error('Error updating product stock:', error);
        throw new Error('Failed to update product stock');
      }
    },    reduceProductStock: async (_: any, { id, quantity }: { id: string; quantity: number }) => {
      try {
        // Find the product
        const product = await Product.findByPk(id);
        if (!product) {
          throw new ProductNotFoundError(id);
        }

        // Reduce stock (this will throw custom errors if there are issues)
        await product.reduceStock(quantity);
        
        // Reload the product to get updated data
        await product.reload();
        return product;
      } catch (error) {
        // If it's one of our custom errors, let it bubble up with its descriptive message
        if (error instanceof ProductNotFoundError || 
            error instanceof InsufficientStockError || 
            error instanceof InvalidQuantityError) {
          throw error;
        }
        
        // For any other unexpected errors, log and throw a generic message
        console.error('Error reducing product stock:', error);
        throw new Error('Failed to reduce product stock');
      }
    }
  },
  Product: {
    // Resolver to provide category information based on categoryId
    // Since we're replacing external category service with store team
    // We'll return basic category info with the categoryId
    category: async (parent: any) => {
      try {
        // For store team integration, we'll provide a basic category structure
        // The store team can expand this with their own category management
        return {
          id: parent.categoryId,
          name: `Category ${parent.categoryId}`,
          description: `Category for ${parent.categoryId}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      } catch (error) {
        console.error('Error providing category info for product:', error);
        return {
          id: parent.categoryId,
          name: 'Unknown Category',
          description: 'Category information not available',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
    },

    isAvailable: (parent: any) => {
      return parent.stock > 0;
    },

    createdAt: (parent: any) => {
      return parent.createdAt.toISOString();
    },

    updatedAt: (parent: any) => {
      return parent.updatedAt.toISOString();
    }
  }
};

export default resolvers;
