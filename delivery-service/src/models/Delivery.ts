import { DataTypes, Model, Optional } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/database';

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

interface DeliveryAttributes {
  id: string;
  orderId: string;
  status: DeliveryStatus;
  deliveryAddress: string;
  customerName?: string;
  customerPhone?: string;
  trackingNumber: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  notes?: string;
  orderItems?: string; // JSON string of order items
  createdAt?: Date;
  updatedAt?: Date;
}

interface DeliveryCreationAttributes extends Optional<DeliveryAttributes, 'id' | 'trackingNumber' | 'createdAt' | 'updatedAt'> {}

class Delivery extends Model<DeliveryAttributes, DeliveryCreationAttributes> implements DeliveryAttributes {
  public id!: string;
  public orderId!: string;
  public status!: DeliveryStatus;
  public deliveryAddress!: string;
  public customerName?: string;
  public customerPhone?: string;
  public trackingNumber!: string;
  public estimatedDelivery?: Date;
  public actualDelivery?: Date;  public notes?: string;
  public orderItems?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  // Method to generate tracking number with standard format: DEL-YYYYMMDD-XXXX
  public static generateTrackingNumber(): string {
    const prefix = 'DEL';
    const date = new Date();
    const dateStr = date.getFullYear().toString() + 
                   (date.getMonth() + 1).toString().padStart(2, '0') + 
                   date.getDate().toString().padStart(2, '0');
    
    // Generate 4-digit random sequence
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    return `${prefix}-${dateStr}-${random}`;
  }

  // Method to generate tracking number for this instance
  public generateTrackingNumber(): string {
    this.trackingNumber = Delivery.generateTrackingNumber();
    return this.trackingNumber;
  }
  // Method to update status with automatic tracking number generation
  public async updateStatusWithTracking(status: DeliveryStatus, notes?: string): Promise<void> {
    this.status = status;
    if (notes) {
      this.notes = notes;
    }

    // Generate tracking number when status is confirmed or shipped (if not already generated)
    if ((status === DeliveryStatus.CONFIRMED || status === DeliveryStatus.SHIPPED) && !this.trackingNumber) {
      this.generateTrackingNumber();
    }

    // Set actual delivery date when delivered
    if (status === DeliveryStatus.DELIVERED && !this.actualDelivery) {
      this.actualDelivery = new Date();
    }

    await this.save();
  }

  // Check if delivery is completed
  public isCompleted(): boolean {
    return this.status === DeliveryStatus.DELIVERED || 
           this.status === DeliveryStatus.FAILED || 
           this.status === DeliveryStatus.RETURNED;
  }

  // Check if delivery is in progress
  public isInProgress(): boolean {
    return [
      DeliveryStatus.CONFIRMED,
      DeliveryStatus.PACKED,
      DeliveryStatus.SHIPPED,
      DeliveryStatus.IN_TRANSIT,
      DeliveryStatus.OUT_FOR_DELIVERY
    ].includes(this.status);
  }
  // Get parsed stored order items (minimal data from database)
  public getStoredOrderItems(): Array<{productId: string, quantity: number}> {
    if (!this.orderItems) return [];
    try {
      return JSON.parse(this.orderItems);
    } catch {
      return [];
    }
  }

  // Get parsed order items (for backward compatibility)
  public getParsedOrderItems(): any[] {
    return this.getStoredOrderItems();
  }

  // Set stored order items (minimal data)
  public setStoredOrderItems(items: Array<{productId: string, quantity: number}>): void {
    this.orderItems = JSON.stringify(items);
  }

  // Set order items (for backward compatibility)
  public setOrderItems(items: any[]): void {
    // Convert to stored format if items have extra fields
    const storedItems = items.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }));
    this.setStoredOrderItems(storedItems);
  }
}

Delivery.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'Order ID cannot be empty'
        }
      }
    },
    status: {
      type: DataTypes.ENUM(...Object.values(DeliveryStatus)),
      allowNull: false,
      defaultValue: DeliveryStatus.PENDING,
    },
    deliveryAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Delivery address cannot be empty'
        }
      }
    },
    customerName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    customerPhone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: {
          args: /^[\+]?[0-9\-\s\(\)]+$/,
          msg: 'Invalid phone number format'
        }
      }
    },    trackingNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'Tracking number cannot be empty'
        }
      }
    },
    estimatedDelivery: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    actualDelivery: {
      type: DataTypes.DATE,
      allowNull: true,
    },    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    orderItems: {
      type: DataTypes.JSON,
      allowNull: true,
    }},
  {
    sequelize,
    tableName: 'deliveries',
    timestamps: true,
    indexes: [
      {
        fields: ['orderId']
      },
      {
        fields: ['status']
      },
      {
        fields: ['trackingNumber']
      },
      {
        fields: ['createdAt']
      }
    ],
    hooks: {
      beforeValidate: async (delivery: Delivery) => {
        // Auto-generate tracking number if not provided
        if (!delivery.trackingNumber) {
          let attempts = 0;
          const maxAttempts = 10;
          
          while (attempts < maxAttempts) {
            const trackingNumber = Delivery.generateTrackingNumber();
            
            // Check if tracking number already exists
            const existingDelivery = await Delivery.findOne({
              where: { trackingNumber }
            });
            
            if (!existingDelivery) {
              delivery.trackingNumber = trackingNumber;
              break;
            }
            
            attempts++;
          }
          
          if (attempts >= maxAttempts) {
            throw new Error('Unable to generate unique tracking number after multiple attempts');
          }
        }
      }
    }
  }
);

export default Delivery;
