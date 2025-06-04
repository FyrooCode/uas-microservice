const { v4: uuidv4 } = require('uuid');
const { Sequelize, DataTypes } = require('sequelize');

// Database configuration
const sequelize = new Sequelize(
  process.env.DB_NAME || 'product_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'password123',
  {
    host: process.env.DB_HOST || 'mysql-product',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    logging: false,
  }
);

// Product model
const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: () => uuidv4()
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  categoryId: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'products',
  timestamps: true
});

const seedProducts = [
  // Intel CPUs
  {
    name: "Intel Core i9-13900K",
    description: "24-core (8P+16E) high-performance desktop processor with 36MB cache and up to 5.8GHz boost",
    price: 589.99,
    stock: 1000,
    categoryId: "cpu-intel-001"
  },
  {
    name: "Intel Core i7-13700K",
    description: "16-core (8P+8E) enthusiast processor with 30MB cache and up to 5.4GHz boost",
    price: 409.99,
    stock: 1000,
    categoryId: "cpu-intel-001"
  },
  {
    name: "Intel Core i5-13600K",
    description: "14-core (6P+8E) mainstream gaming processor with 24MB cache and up to 5.1GHz boost",
    price: 319.99,
    stock: 1000,
    categoryId: "cpu-intel-001"
  },
  {
    name: "Intel Core i5-13400F",
    description: "10-core (6P+4E) budget-friendly processor without integrated graphics",
    price: 199.99,
    stock: 1000,
    categoryId: "cpu-intel-001"
  },
  {
    name: "Intel Core i3-13100F",
    description: "4-core entry-level processor for basic computing and light gaming",
    price: 109.99,
    stock: 1000,
    categoryId: "cpu-intel-001"
  },

  // AMD Ryzen CPUs
  {
    name: "AMD Ryzen 9 7950X",
    description: "16-core flagship processor with 32 threads, 80MB cache, and up to 5.7GHz boost",
    price: 699.99,
    stock: 1000,
    categoryId: "cpu-amd-001"
  },
  {
    name: "AMD Ryzen 9 7900X",
    description: "12-core high-performance processor with 24 threads and 76MB cache",
    price: 549.99,
    stock: 1000,
    categoryId: "cpu-amd-001"
  },
  {
    name: "AMD Ryzen 7 7800X3D",
    description: "8-core gaming processor with 3D V-Cache technology for ultimate gaming performance",
    price: 449.99,
    stock: 1000,
    categoryId: "cpu-amd-001"
  },
  {
    name: "AMD Ryzen 7 7700X",
    description: "8-core mainstream processor with 16 threads and excellent gaming performance",
    price: 399.99,
    stock: 1000,
    categoryId: "cpu-amd-001"
  },
  {
    name: "AMD Ryzen 5 7600X",
    description: "6-core gaming processor with 12 threads, perfect for 1440p gaming",
    price: 299.99,
    stock: 1000,
    categoryId: "cpu-amd-001"
  },

  // NVIDIA RTX GPUs
  {
    name: "NVIDIA GeForce RTX 4090",
    description: "Flagship graphics card with 24GB GDDR6X, perfect for 4K gaming and content creation",
    price: 1599.99,
    stock: 1000,
    categoryId: "gpu-nvidia-001"
  },
  {
    name: "NVIDIA GeForce RTX 4080",
    description: "High-end graphics card with 16GB GDDR6X for premium 4K gaming experience",
    price: 1199.99,
    stock: 1000,
    categoryId: "gpu-nvidia-001"
  },
  {
    name: "NVIDIA GeForce RTX 4070 Ti",
    description: "Enthusiast graphics card with 12GB GDDR6X for excellent 1440p and 4K gaming",
    price: 799.99,
    stock: 1000,
    categoryId: "gpu-nvidia-001"
  },
  {
    name: "NVIDIA GeForce RTX 4070",
    description: "Performance graphics card with 12GB GDDR6X, ideal for 1440p gaming",
    price: 599.99,
    stock: 1000,
    categoryId: "gpu-nvidia-001"
  },
  {
    name: "NVIDIA GeForce RTX 4060 Ti",
    description: "Mainstream graphics card with 8GB/16GB GDDR6 for solid 1080p and 1440p gaming",
    price: 399.99,
    stock: 1000,
    categoryId: "gpu-nvidia-001"
  },
  {
    name: "NVIDIA GeForce RTX 4060",
    description: "Entry-level RTX card with 8GB GDDR6 for budget-friendly 1080p gaming",
    price: 299.99,
    stock: 1000,
    categoryId: "gpu-nvidia-001"
  },

  // AMD GPUs
  {
    name: "AMD Radeon RX 7900 XTX",
    description: "Flagship RDNA 3 graphics card with 24GB GDDR6 for exceptional 4K gaming",
    price: 999.99,
    stock: 1000,
    categoryId: "gpu-amd-001"
  },
  {
    name: "AMD Radeon RX 7900 XT",
    description: "High-performance RDNA 3 card with 20GB GDDR6 for premium gaming experience",
    price: 849.99,
    stock: 1000,
    categoryId: "gpu-amd-001"
  },
  {
    name: "AMD Radeon RX 7800 XT",
    description: "Performance graphics card with 16GB GDDR6 for excellent 1440p gaming",
    price: 499.99,
    stock: 1000,
    categoryId: "gpu-amd-001"
  },
  {
    name: "AMD Radeon RX 7700 XT",
    description: "Mainstream graphics card with 12GB GDDR6 for solid 1440p performance",
    price: 449.99,
    stock: 1000,
    categoryId: "gpu-amd-001"
  },
  {
    name: "AMD Radeon RX 7600",
    description: "Budget-friendly graphics card with 8GB GDDR6 for 1080p gaming",
    price: 269.99,
    stock: 1000,
    categoryId: "gpu-amd-001"
  },

  // DDR5 RAM
  {
    name: "Corsair Vengeance LPX 32GB DDR5-5600",
    description: "High-performance DDR5 memory kit (2x16GB) with low-profile design",
    price: 199.99,
    stock: 1000,
    categoryId: "ram-ddr5-001"
  },
  {
    name: "G.Skill Trident Z5 32GB DDR5-6000",
    description: "Premium RGB DDR5 memory (2x16GB) with excellent overclocking potential",
    price: 249.99,
    stock: 1000,
    categoryId: "ram-ddr5-001"
  },
  {
    name: "Kingston Fury Beast 16GB DDR5-4800",
    description: "Reliable DDR5 memory kit (2x8GB) for mainstream builds",
    price: 89.99,
    stock: 1000,
    categoryId: "ram-ddr5-001"
  },
  {
    name: "TeamGroup T-Force Delta RGB 32GB DDR5-5200",
    description: "RGB DDR5 memory (2x16GB) with stunning lighting effects",
    price: 179.99,
    stock: 1000,
    categoryId: "ram-ddr5-001"
  },
  {
    name: "Crucial Pro 64GB DDR5-4800",
    description: "High-capacity DDR5 memory (2x32GB) for workstation and content creation",
    price: 399.99,
    stock: 1000,
    categoryId: "ram-ddr5-001"
  },

  // DDR4 RAM
  {
    name: "Corsair Vengeance LPX 32GB DDR4-3200",
    description: "Reliable DDR4 memory kit (2x16GB) with proven compatibility",
    price: 119.99,
    stock: 1000,
    categoryId: "ram-ddr4-001"
  },
  {
    name: "G.Skill Ripjaws V 16GB DDR4-3600",
    description: "Performance DDR4 memory (2x8GB) with excellent timings",
    price: 64.99,
    stock: 1000,
    categoryId: "ram-ddr4-001"
  },
  {
    name: "Kingston HyperX Fury 16GB DDR4-2666",
    description: "Budget DDR4 memory kit (2x8GB) for entry-level builds",
    price: 54.99,
    stock: 1000,
    categoryId: "ram-ddr4-001"
  },
  {
    name: "TeamGroup T-Force Vulcan Z 32GB DDR4-3000",
    description: "Value DDR4 memory (2x16GB) with heat spreader design",
    price: 94.99,
    stock: 1000,
    categoryId: "ram-ddr4-001"
  }
];

async function seedProductsData() {
  try {
    console.log('🌱 Starting product seeding...');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Sync model
    await Product.sync();
    console.log('✅ Product model synchronized');
    
    // Clear existing products
    await Product.destroy({ where: {} });
    console.log('🗑️ Cleared existing products');
    
    // Insert seed data
    const createdProducts = await Product.bulkCreate(seedProducts);
    console.log(`✅ Created ${createdProducts.length} products successfully!`);
    
    // Show summary
    console.log('\n📊 Product Summary:');
    console.log('- Intel CPUs: 5 products');
    console.log('- AMD Ryzen CPUs: 5 products');
    console.log('- NVIDIA RTX GPUs: 6 products');
    console.log('- AMD GPUs: 5 products');
    console.log('- DDR5 RAM: 5 products');
    console.log('- DDR4 RAM: 4 products');
    console.log('- Total: 30 products');
    console.log('- Stock per item: 1000 units');
    
    await sequelize.close();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
}

async function clearProducts() {
  try {
    await sequelize.authenticate();
    await Product.sync();
    await Product.destroy({ where: {} });
    console.log('✅ All products cleared');
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error clearing products:', error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedProductsData();
}

module.exports = { seedProductsData, clearProducts };
