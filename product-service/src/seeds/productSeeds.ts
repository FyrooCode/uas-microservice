import { v4 as uuidv4 } from 'uuid';
import Product from '../models/Product';
import sequelize from '../config/database';

interface SeedProduct {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
}

// Category IDs (you can adjust these based on your category service)
const CATEGORIES = {
  CPU: '550e8400-e29b-41d4-a716-446655440001',
  GPU: '550e8400-e29b-41d4-a716-446655440002', 
  RAM: '550e8400-e29b-41d4-a716-446655440003',
};

const productSeedData: SeedProduct[] = [
  // Intel CPUs
  {
    name: 'Intel Core i9-13900K',
    description: 'High-end gaming and workstation processor with 24 cores (8P+16E) and up to 5.8GHz boost clock',
    price: 589.99,
    stock: 1000,
    categoryId: CATEGORIES.CPU
  },
  {
    name: 'Intel Core i7-13700K', 
    description: 'Performance gaming processor with 16 cores (8P+8E) and up to 5.4GHz boost clock',
    price: 419.99,
    stock: 1000,
    categoryId: CATEGORIES.CPU
  },
  {
    name: 'Intel Core i5-13600K',
    description: 'Mainstream gaming processor with 14 cores (6P+8E) and up to 5.1GHz boost clock',
    price: 319.99,
    stock: 1000,
    categoryId: CATEGORIES.CPU
  },
  {
    name: 'Intel Core i3-13100',
    description: 'Budget-friendly processor with 4 cores and up to 4.5GHz boost clock',
    price: 134.99,
    stock: 1000,
    categoryId: CATEGORIES.CPU
  },

  // AMD Ryzen CPUs
  {
    name: 'AMD Ryzen 9 7950X',
    description: 'Flagship 16-core processor with up to 5.7GHz boost clock for ultimate performance',
    price: 549.99,
    stock: 1000,
    categoryId: CATEGORIES.CPU
  },
  {
    name: 'AMD Ryzen 7 7700X',
    description: 'High-performance 8-core processor with up to 5.4GHz boost clock',
    price: 349.99,
    stock: 1000,
    categoryId: CATEGORIES.CPU
  },
  {
    name: 'AMD Ryzen 5 7600X',
    description: 'Gaming-focused 6-core processor with up to 5.3GHz boost clock',
    price: 249.99,
    stock: 1000,
    categoryId: CATEGORIES.CPU
  },
  {
    name: 'AMD Ryzen 5 5600X',
    description: 'Popular 6-core gaming processor with excellent price-to-performance ratio',
    price: 199.99,
    stock: 1000,
    categoryId: CATEGORIES.CPU
  },

  // NVIDIA RTX GPUs
  {
    name: 'NVIDIA GeForce RTX 4090',
    description: 'Flagship graphics card with 24GB GDDR6X memory for 4K gaming and content creation',
    price: 1599.99,
    stock: 1000,
    categoryId: CATEGORIES.GPU
  },
  {
    name: 'NVIDIA GeForce RTX 4080',
    description: 'High-end graphics card with 16GB GDDR6X memory for premium 4K gaming',
    price: 1199.99,
    stock: 1000,
    categoryId: CATEGORIES.GPU
  },
  {
    name: 'NVIDIA GeForce RTX 4070 Ti',
    description: 'Performance graphics card with 12GB GDDR6X memory for 1440p and 4K gaming',
    price: 799.99,
    stock: 1000,
    categoryId: CATEGORIES.GPU
  },
  {
    name: 'NVIDIA GeForce RTX 4060 Ti',
    description: 'Mainstream graphics card with 16GB GDDR6 memory for 1440p gaming',
    price: 499.99,
    stock: 1000,
    categoryId: CATEGORIES.GPU
  },
  {
    name: 'NVIDIA GeForce RTX 4060',
    description: 'Entry-level RTX card with 8GB GDDR6 memory for 1080p gaming',
    price: 299.99,
    stock: 1000,
    categoryId: CATEGORIES.GPU
  },

  // AMD GPUs
  {
    name: 'AMD Radeon RX 7900 XTX',
    description: 'High-end graphics card with 24GB GDDR6 memory for 4K gaming',
    price: 999.99,
    stock: 1000,
    categoryId: CATEGORIES.GPU
  },
  {
    name: 'AMD Radeon RX 7800 XT',
    description: 'Performance graphics card with 16GB GDDR6 memory for 1440p gaming',
    price: 499.99,
    stock: 1000,
    categoryId: CATEGORIES.GPU
  },
  {
    name: 'AMD Radeon RX 7600',
    description: 'Mainstream graphics card with 8GB GDDR6 memory for 1080p gaming',
    price: 269.99,
    stock: 1000,
    categoryId: CATEGORIES.GPU
  },
  {
    name: 'AMD Radeon RX 6600 XT',
    description: 'Budget-friendly graphics card with 8GB GDDR6 memory for 1080p gaming',
    price: 219.99,
    stock: 1000,
    categoryId: CATEGORIES.GPU
  },

  // DDR5 RAM
  {
    name: 'Corsair Vengeance LPX 32GB DDR5-5600',
    description: 'High-performance DDR5 memory kit (2x16GB) with 5600MHz speed',
    price: 159.99,
    stock: 1000,
    categoryId: CATEGORIES.RAM
  },
  {
    name: 'G.Skill Trident Z5 RGB 32GB DDR5-6000',
    description: 'Premium RGB DDR5 memory kit (2x16GB) with 6000MHz speed and RGB lighting',
    price: 189.99,
    stock: 1000,
    categoryId: CATEGORIES.RAM
  },
  {
    name: 'Kingston Fury Beast 16GB DDR5-5200',
    description: 'Reliable DDR5 memory kit (2x8GB) with 5200MHz speed for gaming',
    price: 89.99,
    stock: 1000,
    categoryId: CATEGORIES.RAM
  },
  {
    name: 'Crucial DDR5-4800 32GB',
    description: 'Standard DDR5 memory kit (2x16GB) with 4800MHz speed for productivity',
    price: 139.99,
    stock: 1000,
    categoryId: CATEGORIES.RAM
  },

  // DDR4 RAM (for older systems)
  {
    name: 'Corsair Vengeance LPX 32GB DDR4-3200',
    description: 'Popular DDR4 memory kit (2x16GB) with 3200MHz speed and low profile design',
    price: 89.99,
    stock: 1000,
    categoryId: CATEGORIES.RAM
  },
  {
    name: 'G.Skill Ripjaws V 16GB DDR4-3600',
    description: 'High-performance DDR4 memory kit (2x8GB) with 3600MHz speed',
    price: 54.99,
    stock: 1000,
    categoryId: CATEGORIES.RAM
  },
  {
    name: 'Kingston HyperX Fury 16GB DDR4-2666',
    description: 'Budget-friendly DDR4 memory kit (2x8GB) with 2666MHz speed',
    price: 49.99,
    stock: 1000,
    categoryId: CATEGORIES.RAM
  },
  {
    name: 'Teamgroup T-Force Vulcan Z 32GB DDR4-3200',
    description: 'Value DDR4 memory kit (2x16GB) with 3200MHz speed and heat spreader',
    price: 79.99,
    stock: 1000,
    categoryId: CATEGORIES.RAM
  }
];

export async function seedProducts() {
  try {
    console.log('🌱 Starting product seeding...');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    // Sync models
    await sequelize.sync();
    console.log('✅ Models synchronized');
    
    // Clear existing products (optional)
    const existingCount = await Product.count();
    console.log(`📊 Current products in database: ${existingCount}`);
      // Insert seed products
    for (const productData of productSeedData) {
      try {
        const product = await Product.create({
          id: uuidv4(),
          ...productData
        });
        console.log(`✅ Created: ${product.name}`);
      } catch (error) {
        console.error(`❌ Failed to create ${productData.name}:`, error);
      }
    }
    
    const finalCount = await Product.count();
    console.log(`🎉 Seeding completed! Total products: ${finalCount}`);
    console.log(`📈 Added ${finalCount - existingCount} new products`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

export async function clearProducts() {
  try {
    console.log('🗑️  Clearing all products...');
    const deletedCount = await Product.destroy({ where: {} });
    console.log(`✅ Deleted ${deletedCount} products`);
  } catch (error) {
    console.error('❌ Failed to clear products:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedProducts()
    .then(() => {
      console.log('✅ Seeding process completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding process failed:', error);
      process.exit(1);
    });
}
