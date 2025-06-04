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
  trackingNumber?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  notes?: string;
  orderItems?: string; // JSON string of order items
  createdAt?: Date;
  updatedAt?: Date;
}

interface DeliveryCreationAttributes extends Optional<DeliveryAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Delivery extends Model<DeliveryAttributes, DeliveryCreationAttributes> implements DeliveryAttributes {
  public id!: string;
  public orderId!: string;
  public status!: DeliveryStatus;
  public deliveryAddress!: string;
  public customerName?: string;
  public customerPhone?: string;
  public trackingNumber?: string;
  public estimatedDelivery?: Date;
  public actualDelivery?: Date;
  public notes?: string;
  public orderItems?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Method to generate tracking number
  public generateTrackingNumber(): string {
    const prefix = 'DEL';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.trackingNumber = `${prefix}${timestamp}${random}`;
    return this.trackingNumber;
  }

  // Method to update status with automatic tracking number generation
  public async updateStatusWithTracking(status: DeliveryStatus, notes?: string): Promise<void> {
    this.status = status;
    if (notes) {
      this.notes = notes;
    }

    // Generate tracking number when status is confirmed or shipped
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

  // Get parsed order items
  public getParsedOrderItems(): any[] {
    if (!this.orderItems) return [];
    try {
      return JSON.parse(this.orderItems);
    } catch {
      return [];
    }
  }

  // Set order items
  public setOrderItems(items: any[]): void {
    this.orderItems = JSON.stringify(items);
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
    },
    trackingNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
    },
    estimatedDelivery: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    actualDelivery: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    orderItems: {
      type: DataTypes.JSON,
      allowNull: true,
    }
  },
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
    ]
  }
);

export default Delivery;
