import { Op } from 'sequelize';
import Delivery, { DeliveryStatus } from '../models/Delivery';
import productService from '../services/productService';

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
    delivery: async (_: any, { id }: { id: string }) => {
      try {
        const delivery = await Delivery.findByPk(id);
        return delivery;
      } catch (error) {
        console.error('Error fetching delivery:', error);
        throw new Error('Failed to fetch delivery');
      }
    },

    deliveryByOrderId: async (_: any, { orderId }: { orderId: string }) => {
      try {
        const delivery = await Delivery.findOne({
          where: { orderId }
        });
        return delivery;
      } catch (error) {
        console.error('Error fetching delivery by order ID:', error);
        throw new Error('Failed to fetch delivery by order ID');
      }
    },

    deliveryByTrackingNumber: async (_: any, { trackingNumber }: { trackingNumber: string }) => {
      try {
        const delivery = await Delivery.findOne({
          where: { trackingNumber }
        });
        return delivery;
      } catch (error) {
        console.error('Error fetching delivery by tracking number:', error);
        throw new Error('Failed to fetch delivery by tracking number');
      }
    },

    deliveries: async (_: any, { filter, pagination }: any) => {
      try {
        const page = pagination?.page || 1;
        const limit = pagination?.limit || 10;
        const offset = (page - 1) * limit;

        // Build where clause based on filter
        const whereClause: any = {};

        if (filter?.status) {
          whereClause.status = filter.status;
        }

        if (filter?.customerName) {
          whereClause.customerName = {
            [Op.like]: `%${filter.customerName}%`
          };
        }

        if (filter?.dateFrom || filter?.dateTo) {
          whereClause.createdAt = {};
          if (filter.dateFrom) {
            whereClause.createdAt[Op.gte] = new Date(filter.dateFrom);
          }
          if (filter.dateTo) {
            whereClause.createdAt[Op.lte] = new Date(filter.dateTo);
          }
        }

        const { count, rows } = await Delivery.findAndCountAll({
          where: whereClause,
          limit,
          offset,
          order: [['createdAt', 'DESC']]
        });

        const paginationInfo = calculatePagination(page, limit, count);

        return {
          deliveries: rows,
          pagination: paginationInfo
        };
      } catch (error) {
        console.error('Error fetching deliveries:', error);
        throw new Error('Failed to fetch deliveries');
      }
    },

    deliveryStats: async () => {
      try {
        const totalDeliveries = await Delivery.count();
        const pendingDeliveries = await Delivery.count({
          where: { status: DeliveryStatus.PENDING }
        });
        const inProgressDeliveries = await Delivery.count({
          where: {
            status: {
              [Op.in]: [
                DeliveryStatus.CONFIRMED,
                DeliveryStatus.PACKED,
                DeliveryStatus.SHIPPED,
                DeliveryStatus.IN_TRANSIT,
                DeliveryStatus.OUT_FOR_DELIVERY
              ]
            }
          }
        });
        const completedDeliveries = await Delivery.count({
          where: { status: DeliveryStatus.DELIVERED }
        });
        const failedDeliveries = await Delivery.count({
          where: {
            status: {
              [Op.in]: [DeliveryStatus.FAILED, DeliveryStatus.RETURNED]
            }
          }
        });

        return {
          totalDeliveries,
          pendingDeliveries,
          inProgressDeliveries,
          completedDeliveries,
          failedDeliveries
        };
      } catch (error) {
        console.error('Error fetching delivery stats:', error);
        throw new Error('Failed to fetch delivery stats');
      }
    },

    deliveryStatuses: () => {
      return Object.values(DeliveryStatus);
    }
  },
  Mutation: {
    createDelivery: async (_: any, { input }: any) => {
      try {
        console.log(`🚀 Creating delivery for order ${input.orderId}...`);

        // Check if delivery already exists for this order
        const existingDelivery = await Delivery.findOne({
          where: { orderId: input.orderId }
        });

        if (existingDelivery) {
          return {
            delivery: null,
            stockErrors: [],
            success: false,
            message: 'Delivery already exists for this order'
          };
        }

        // Validate and reduce stock for all products in the order
        const stockReductionItems = input.orderItems.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity
        }));

        console.log(`📦 Processing ${stockReductionItems.length} items for stock reduction...`);

        const stockResult = await productService.validateAndReduceMultipleProducts(stockReductionItems);

        if (!stockResult.success) {
          console.log(`❌ Stock validation failed for ${stockResult.failedItems.length} items`);
          
          // Build detailed stock errors for failed items
          const stockErrors = [];
          for (const result of stockResult.results) {
            if (!result.success) {
              const orderItem = input.orderItems.find((item: any) => item.productId === result.productId);
              stockErrors.push({
                productId: result.productId,
                productName: orderItem?.productName || 'Unknown Product',
                requestedQuantity: orderItem?.quantity || 0,
                availableStock: result.remainingStock,
                message: result.error || 'Stock validation failed'
              });
            }
          }

          return {
            delivery: null,
            stockErrors,
            success: false,
            message: `Unable to process order. ${stockResult.failedItems.length} items have insufficient stock or are unavailable.`
          };
        }

        console.log(`✅ Stock reduction successful for all items`);

        // All stock reductions successful, create the delivery
        const deliveryData = {
          ...input,
          orderItems: input.orderItems ? JSON.stringify(input.orderItems) : null,
          estimatedDelivery: input.estimatedDelivery ? new Date(input.estimatedDelivery) : null,
          status: DeliveryStatus.PENDING
        };

        const delivery = await Delivery.create(deliveryData);
        
        console.log(`🎉 Delivery created successfully with ID: ${delivery.id}`);

        return {
          delivery,
          stockErrors: [],
          success: true,
          message: 'Delivery created successfully and stock has been reserved'
        };

      } catch (error) {
        console.error('❌ Error creating delivery:', error);
        return {
          delivery: null,
          stockErrors: [],
          success: false,
          message: 'Failed to create delivery due to an internal error'
        };
      }
    },

    updateDeliveryStatus: async (_: any, { input }: any) => {
      try {
        const { id, ...updateData } = input;

        const delivery = await Delivery.findByPk(id);
        if (!delivery) {
          throw new Error('Delivery not found');
        }

        // Update delivery with new data
        if (updateData.estimatedDelivery) {
          updateData.estimatedDelivery = new Date(updateData.estimatedDelivery);
        }
        if (updateData.actualDelivery) {
          updateData.actualDelivery = new Date(updateData.actualDelivery);
        }

        await delivery.update(updateData);

        // Use the model method to handle status update logic
        if (updateData.status) {
          await delivery.updateStatusWithTracking(updateData.status, updateData.notes);
        }

        return delivery;
      } catch (error) {
        console.error('Error updating delivery status:', error);
        throw new Error('Failed to update delivery status');
      }
    },

    cancelDelivery: async (_: any, { id, reason }: { id: string; reason?: string }) => {
      try {
        const delivery = await Delivery.findByPk(id);
        if (!delivery) {
          throw new Error('Delivery not found');
        }

        await delivery.updateStatusWithTracking(
          DeliveryStatus.FAILED,
          reason ? `Cancelled: ${reason}` : 'Delivery cancelled'
        );

        return delivery;
      } catch (error) {
        console.error('Error cancelling delivery:', error);
        throw new Error('Failed to cancel delivery');
      }
    },

    generateTrackingNumber: async (_: any, { id }: { id: string }) => {
      try {
        const delivery = await Delivery.findByPk(id);
        if (!delivery) {
          throw new Error('Delivery not found');
        }

        delivery.generateTrackingNumber();
        await delivery.save();

        return delivery;
      } catch (error) {
        console.error('Error generating tracking number:', error);
        throw new Error('Failed to generate tracking number');
      }
    },

    markAsDelivered: async (_: any, { id, notes }: { id: string; notes?: string }) => {
      try {
        const delivery = await Delivery.findByPk(id);
        if (!delivery) {
          throw new Error('Delivery not found');
        }

        await delivery.updateStatusWithTracking(DeliveryStatus.DELIVERED, notes);

        return delivery;
      } catch (error) {
        console.error('Error marking delivery as delivered:', error);
        throw new Error('Failed to mark delivery as delivered');
      }
    }  },

  DeliveryCreationResult: {
    delivery: (parent: any) => parent.delivery,
    stockErrors: (parent: any) => parent.stockErrors || [],
    success: (parent: any) => parent.success,
    message: (parent: any) => parent.message
  },

  StockError: {
    productId: (parent: any) => parent.productId,
    productName: (parent: any) => parent.productName,
    requestedQuantity: (parent: any) => parent.requestedQuantity,
    availableStock: (parent: any) => parent.availableStock,
    message: (parent: any) => parent.message
  },

  Delivery: {
    orderItems: (parent: any) => {
      return parent.getParsedOrderItems();
    },

    isCompleted: (parent: any) => {
      return parent.isCompleted();
    },

    isInProgress: (parent: any) => {
      return parent.isInProgress();
    },

    estimatedDelivery: (parent: any) => {
      return parent.estimatedDelivery ? parent.estimatedDelivery.toISOString() : null;
    },

    actualDelivery: (parent: any) => {
      return parent.actualDelivery ? parent.actualDelivery.toISOString() : null;
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
