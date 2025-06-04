import { DataTypes, Model, Optional } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/database';
import { InsufficientStockError, InvalidQuantityError } from '../errors/CustomErrors';

interface ProductAttributes {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: string;
  public name!: string;
  public description!: string;
  public price!: number;
  public stock!: number;
  public categoryId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Method to check if product is available
  public isAvailable(): boolean {
    return this.stock > 0;
  }
  // Method to reduce stock
  public async reduceStock(quantity: number): Promise<void> {
    // Validate quantity
    if (quantity <= 0) {
      throw new InvalidQuantityError(quantity);
    }

    // Check if sufficient stock is available
    if (this.stock < quantity) {
      throw new InsufficientStockError(quantity, this.stock, this.name);
    }

    // Reduce stock and save
    this.stock -= quantity;
    await this.save();
  }

  // Method to increase stock
  public async increaseStock(quantity: number): Promise<void> {
    this.stock += quantity;
    await this.save();
  }
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Product name cannot be empty'
        },
        len: {
          args: [2, 255],
          msg: 'Product name must be between 2 and 255 characters'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Product description cannot be empty'
        }
      }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'Price must be a positive number'
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Stock must be a non-negative number'
        }
      }
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Category ID cannot be empty'
        }
      }
    }
  },
  {
    sequelize,
    tableName: 'products',
    timestamps: true,
    indexes: [
      {
        fields: ['categoryId']
      },
      {
        fields: ['name']
      },
      {
        fields: ['price']
      }
    ]
  }
);

export default Product;
