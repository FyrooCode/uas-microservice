# UAS IAE Microservices Project

Enterprise Application Integration project menggunakan microservices architecture dengan GraphQL, Node.js, MySQL, dan Docker.

## 🏗️ Architecture Overview

Sistem ini terdiri dari 2 microservices utama:

### 1. Product Service (Port 4001)
- **Fungsi**: Mengelola data produk komponen komputer (CPU, GPU, RAM, Storage)
- **Database**: MySQL (`mysql-product` pada port 3306)
- **GraphQL API**: `http://localhost:4001/graphql`
- **Store Analytics**: Menyediakan comprehensive store analytics dan insights untuk Store Team

### 2. Delivery Service (Port 4003)
- **Fungsi**: Mengelola tracking dan status pengiriman pesanan
- **Database**: MySQL (`mysql-delivery` pada port 3307)
- **GraphQL API**: `http://localhost:4003/graphql`
- **Integration**: Menerima data dari Order Service (external group)

## 🛠️ Tech Stack

### Backend Technologies
- **Runtime**: Node.js 18+ dengan TypeScript untuk type safety
- **Framework**: Express.js sebagai web server foundation
- **API Layer**: GraphQL dengan Apollo Server untuk unified API interface
- **Database**: MySQL dengan Sequelize ORM untuk data persistence
- **Containerization**: Docker & Docker Compose untuk deployment

### Development & DevOps
- **Language**: TypeScript dengan strict typing untuk code quality
- **Package Manager**: npm untuk dependency management
- **Container Orchestration**: Docker Compose untuk multi-service deployment
- **Database Migration**: Sequelize CLI untuk schema management
- **Environment Configuration**: dotenv untuk configuration management

### Database & Storage
- **Primary Database**: MySQL 8.0 untuk relational data storage
- **ORM**: Sequelize dengan TypeScript models dan UUID primary keys
- **Connection Pooling**: Built-in Sequelize connection pooling
- **Data Validation**: Sequelize validators dengan custom business rules
- **Database Isolation**: Separate MySQL instances per service

### API & Communication
- **API Protocol**: GraphQL untuk type-safe inter-service communication
- **Schema Definition**: GraphQL SDL (Schema Definition Language)
- **Query Optimization**: DataLoader pattern untuk N+1 query prevention
- **Error Handling**: Structured GraphQL error responses dengan custom error types
- **API Documentation**: GraphQL Playground untuk interactive API exploration

### Architecture Patterns
- **Microservices**: Independent services dengan dedicated databases
- **Domain-Driven Design**: Service boundaries berdasarkan business domains
- **CQRS Pattern**: Separate read/write operations untuk performance optimization
- **Repository Pattern**: Data access abstraction untuk maintainability
- **Service Layer**: Business logic encapsulation

### Docker Infrastructure
```yaml
Services:
  - product-service: Node.js GraphQL API (Port 4001)
  - delivery-service: Node.js GraphQL API (Port 4003)
  - mysql-product: MySQL 8.0 (Port 3306)
  - mysql-delivery: MySQL 8.0 (Port 3307)

Networks:
  - microservices-network: Internal Docker network untuk service communication

Volumes:
  - mysql-product-data: Persistent storage untuk product database
  - mysql-delivery-data: Persistent storage untuk delivery database
```

### Development Tools & Standards
- **Code Quality**: ESLint dengan TypeScript rules
- **Code Formatting**: Prettier untuk consistent code style
- **Type Checking**: TypeScript compiler dengan strict mode
- **Hot Reload**: nodemon untuk development productivity
- **Environment Management**: Multiple .env files untuk different environments
- **Build Process**: TypeScript compilation dengan npm scripts

### Security & Best Practices
- **Input Validation**: GraphQL input types dengan Sequelize validators
- **SQL Injection Prevention**: Sequelize parameterized queries
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Environment Variables**: Sensitive data stored in environment files
- **Container Security**: Non-root user dalam Docker containers
- **Database Security**: Separate credentials per service

## 🏪 Store Team Features

Product Service menyediakan complete product catalog functionality untuk Store Team dalam menampilkan produk ke customer:

### 🛍️ Customer-Facing Store Display
- **Product Catalog**: Browse semua produk dengan filtering dan pagination
- **Category Browsing**: Filter produk berdasarkan kategori (CPU, GPU, RAM, Storage)
- **Product Search**: Search produk berdasarkan nama dan deskripsi
- **Product Details**: Detail lengkap produk dengan availability status
- **Stock Information**: Real-time stock availability untuk customer

### 🎯 Key Store Queries
- `products`: Get all products dengan filtering dan pagination
- `productsByCategory`: Browse produk berdasarkan kategori
- `searchProducts`: Search functionality untuk customer
- `product`: Detail produk individual
- Available categories untuk navigation menu

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Git

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd uas-iae
```

### 2. Environment Setup

Create `.env` files from templates and configure them:

```bash
# Copy environment template files
cp .env.example .env
cp product-service/.env.example product-service/.env
cp delivery-service/.env.example delivery-service/.env
```

**Root `.env.example` template:**
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_secure_password_here

# Service URLs (for inter-service communication)
PRODUCT_SERVICE_URL=http://product-service:4001/graphql
DELIVERY_SERVICE_URL=http://delivery-service:4003/graphql

# External Services (if needed)
CATEGORY_SERVICE_URL=http://external-category-service:4000/graphql
ORDER_SERVICE_URL=http://external-order-service:4002/graphql


# Environment
NODE_ENV=development
```

**Product Service `.env.example`:**
```env
# Server Configuration
PORT=4001
NODE_ENV=development

# Database Configuration
DB_HOST=mysql-product
DB_PORT=3306
DB_NAME=product_db
DB_USER=root
DB_PASSWORD=your_secure_password_here

# GraphQL Configuration
GRAPHQL_INTROSPECTION=true
GRAPHQL_PLAYGROUND=true

# External Services
CATEGORY_SERVICE_URL=http://external-category-service:4000/graphql


# Store Configuration
STORE_NAME=UAS Computer Store
STORE_CURRENCY=IDR
LOW_STOCK_THRESHOLD=5
```

**Delivery Service `.env.example`:**
```env
# Server Configuration
PORT=4003
NODE_ENV=development

# Database Configuration
DB_HOST=mysql-delivery
DB_PORT=3306
DB_NAME=delivery_db
DB_USER=root
DB_PASSWORD=your_secure_password_here

# GraphQL Configuration
GRAPHQL_INTROSPECTION=true
GRAPHQL_PLAYGROUND=true

# External Services
PRODUCT_SERVICE_URL=http://product-service:4001/graphql
ORDER_SERVICE_URL=http://external-order-service:4002/graphql



# Delivery Configuration
DEFAULT_DELIVERY_DAYS=3
MAX_DELIVERY_DAYS=7
TRACKING_PREFIX=DEL
```

**Important**: Edit the `.env` files and update:
- Change all `DB_PASSWORD` values to secure passwords
- Modify external service URLs if needed
- Adjust configuration values as required

### 3. Start All Services
```bash
# Build and start all containers
docker-compose up --build -d

# Check if all containers are running
docker-compose ps
```

### 4. Verify Setup
```bash
# Test GraphQL endpoints
curl http://localhost:4001/graphql
curl http://localhost:4003/graphql

# Or open in browser:
# - Product Service GraphQL Playground: http://localhost:4001/graphql
# - Delivery Service GraphQL Playground: http://localhost:4003/graphql
```

### 5. Access Admin Panel
Open `admin-panel-enhanced.html` in your browser to manage products and deliveries.

## 🛑 Troubleshooting

### Common Issues:
```bash
# If containers fail to start, check logs:
docker-compose logs product-service
docker-compose logs delivery-service

# Reset everything:
docker-compose down -v
docker-compose up --build -d
```

## 🚀 Original Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

### 1. Clone & Setup
```bash
git clone <repository-url>
cd uas-iae
```

### 2. Install Dependencies
```bash
# Product Service
cd product-service
npm install

# Delivery Service
cd ../delivery-service
npm install
```

### 3. Environment Configuration
Copy `.env` files dan sesuaikan konfigurasi jika diperlukan:
- `product-service/.env`
- `delivery-service/.env`

### 4. Start with Docker Compose
```bash
# Start semua services
docker-compose up -d

# Check logs
docker-compose logs -f
```

### 5. Development Mode (Local)
```bash
# Terminal 1 - Product Service
cd product-service
npm run dev

# Terminal 2 - Delivery Service
cd delivery-service
npm run dev
```

## 📊 Database Schema

### Product Service Database
```sql
-- Products table
CREATE TABLE products (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  categoryId VARCHAR(36) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Delivery Service Database
```sql
-- Deliveries table
CREATE TABLE deliveries (
  id VARCHAR(36) PRIMARY KEY,
  orderId VARCHAR(36) UNIQUE NOT NULL,
  status ENUM('pending','confirmed','packed','shipped','in_transit','out_for_delivery','delivered','failed','returned') NOT NULL DEFAULT 'pending',
  deliveryAddress TEXT NOT NULL,
  customerName VARCHAR(255),
  customerPhone VARCHAR(20),
  trackingNumber VARCHAR(50) UNIQUE,
  estimatedDelivery DATETIME,
  actualDelivery DATETIME,
  notes TEXT,
  orderItems JSON,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🔗 API Integration

### Product Service GraphQL API

#### Key Queries
```graphql
# Get all products with filters
query GetProducts($filter: ProductFilterInput, $pagination: PaginationInput) {
  products(filter: $filter, pagination: $pagination) {
    products {
      id
      name
      description
      price
      stock
      category {
        id
        name
      }
      isAvailable
    }
    pagination {
      currentPage
      totalPages
      totalItems
    }
  }
}

# Get single product
query GetProduct($id: ID!) {
  product(id: $id) {
    id
    name
    description
    price
    stock
    categoryId
    category {
      id
      name
      description
    }
    isAvailable
  }
}
```

#### Key Mutations
```graphql
# Create product
mutation CreateProduct($input: CreateProductInput!) {
  createProduct(input: $input) {
    id
    name
    description
    price
    stock
    categoryId
  }
}

# Update stock
mutation UpdateStock($id: ID!, $quantity: Int!) {
  updateProductStock(id: $id, quantity: $quantity) {
    id
    stock
  }
}
```

### Delivery Service GraphQL API

#### For Order Service Integration
```graphql
# Create delivery (dipanggil oleh Order Service)
mutation CreateDelivery($input: CreateDeliveryInput!) {
  createDelivery(input: $input) {
    id
    orderId
    status
    trackingNumber
    deliveryAddress
    estimatedDelivery
  }
}

# Get delivery status (untuk Order Service)
query GetDeliveryStatus($orderId: ID!) {
  deliveryByOrderId(orderId: $orderId) {
    id
    orderId
    status
    trackingNumber
    estimatedDelivery
    actualDelivery
    isCompleted
    isInProgress
  }
}
```

#### For Admin/Frontend
```graphql
# Get deliveries with filtering
query GetDeliveries($filter: DeliveryFilterInput, $pagination: PaginationInput) {
  deliveries(filter: $filter, pagination: $pagination) {
    deliveries {
      id
      orderId
      status
      customerName
      deliveryAddress
      trackingNumber
      estimatedDelivery
      createdAt
    }
    pagination {
      currentPage
      totalPages
      totalItems
    }
  }
}

# Update delivery status
mutation UpdateDeliveryStatus($input: UpdateDeliveryStatusInput!) {
  updateDeliveryStatus(input: $input) {
    id
    status
    trackingNumber
    notes
  }
}
```

## 🌐 Inter-Service Communication

### Order Service → Delivery Service
```graphql
# Order Service memanggil Delivery Service
mutation {
  createDelivery(input: {
    orderId: "order-uuid"
    deliveryAddress: "Jl. Contoh No. 123"
    customerName: "John Doe"
    customerPhone: "+62812345678"
    orderItems: [
      {
        productId: "prod-1"
        productName: "Intel Core i7"
        quantity: 1
        price: 5000000
      }
    ]
  }) {
    id
    trackingNumber
    status
  }
}
```

## 🐳 Docker Configuration

### Network Setup
Semua services menggunakan Docker network `microservices-network` untuk komunikasi internal.

### Service URLs (dalam Docker)
- Product Service: `http://product-service:4001/graphql`
- Delivery Service: `http://delivery-service:4003/graphql`
- MySQL Product: `mysql-product:3306`
- MySQL Delivery: `mysql-delivery:3306`

### External Access (dari host)
- Product Service: `http://localhost:4001/graphql`
- Delivery Service: `http://localhost:4003/graphql`
- MySQL Product: `localhost:3306`
- MySQL Delivery: `localhost:3307`

## 📋 API Documentation untuk External Groups

### Untuk Order Service Team

**Delivery Service Endpoint**: `http://localhost:4003/graphql`

**Create Delivery Mutation**:
```graphql
mutation CreateDelivery($input: CreateDeliveryInput!) {
  createDelivery(input: $input) {
    id
    orderId
    status
    trackingNumber
    deliveryAddress
    estimatedDelivery
    createdAt
  }
}
```

**Input Type**:
```typescript
interface CreateDeliveryInput {
  orderId: string;          // UUID dari order
  deliveryAddress: string;  // Alamat lengkap pengiriman
  customerName?: string;    // Nama customer
  customerPhone?: string;   // Nomor telepon customer
  orderItems?: OrderItem[]; // Array item yang dipesan
  estimatedDelivery?: string; // ISO date string (optional)
}

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}
```

**Get Delivery Status Query**:
```graphql
query GetDeliveryStatus($orderId: ID!) {
  deliveryByOrderId(orderId: $orderId) {
    id
    orderId
    status
    trackingNumber
    estimatedDelivery
    actualDelivery
    isCompleted
    isInProgress
    createdAt
    updatedAt
  }
}
```

### Untuk Store Team

**Product Service Endpoint**: `http://localhost:4001/graphql`

**Customer Store Display Queries**:
```graphql
# Get all products for store catalog
query GetProducts($filter: ProductFilterInput, $pagination: PaginationInput) {
  products(filter: $filter, pagination: $pagination) {
    products {
      id
      name
      description
      price
      stock
      category {
        id
        name
      }
      isAvailable
    }
    pagination {
      currentPage
      totalPages
      totalItems
    }
  }
}

# Get products by category for navigation
query GetProductsByCategory($categoryId: ID!, $pagination: PaginationInput) {
  productsByCategory(categoryId: $categoryId, pagination: $pagination) {
    products {
      id
      name
      description
      price
      stock
      isAvailable
    }
    pagination {
      currentPage
      totalPages
      totalItems
    }
  }
}

# Search products for customer search functionality
query SearchProducts($query: String!, $pagination: PaginationInput) {
  searchProducts(query: $query, pagination: $pagination) {
    products {
      id
      name
      description
      price
      stock
      isAvailable
    }
    pagination {
      currentPage
      totalPages
      totalItems
    }
  }
}

# Get single product for product detail page
query GetProduct($id: ID!) {
  product(id: $id) {
    id
    name
    description
    price
    stock
    categoryId
    category {
      id
      name
      description
    }
    isAvailable
    createdAt
    updatedAt
  }
}
```

## 📝 Project Structure

```
uas-iae/
├── product-service/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── models/
│   │   │   ├── Product.ts
│   │   │   └── index.ts
│   │   ├── graphql/
│   │   │   └── schema.graphql
│   │   ├── resolvers/
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── categoryService.ts
│   │   │   └── storeService.ts
│   │   └── server.ts
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
├── delivery-service/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── models/
│   │   │   ├── Delivery.ts
│   │   │   └── index.ts
│   │   ├── graphql/
│   │   │   └── schema.graphql
│   │   ├── resolvers/
│   │   │   └── index.ts
│   │   └── server.ts
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
├── shared/
│   └── types/
│       └── index.ts
├── docker-compose.yml
├── package.json
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.
