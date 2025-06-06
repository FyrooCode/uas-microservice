# UAS IAE Microservices Project

Enterprise Application Integration project menggunakan microservices architecture dengan GraphQL, Node.js, MySQL, dan Docker.

## 🏗️ Architecture Overview

Sistem ini terdiri dari 2 microservices utama:

### 1. Product Service (Port 4001)
- **Fungsi**: Mengelola data produk komponen komputer (CPU, GPU, RAM, Storage)
- **Database**: MySQL (`mysql-product` pada port 3306)
- **GraphQL API**: `http://localhost:4001/graphql`
- **Dependencies**: Mengkonsumsi Category Service (external group)

### 2. Delivery Service (Port 4003)
- **Fungsi**: Mengelola tracking dan status pengiriman pesanan
- **Database**: MySQL (`mysql-delivery` pada port 3307)
- **GraphQL API**: `http://localhost:4003/graphql`
- **Integration**: Menerima data dari Order Service (external group)

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
```bash
# Copy environment template files
cp .env.example .env
cp product-service/.env.example product-service/.env
cp delivery-service/.env.example delivery-service/.env

# Edit the .env files and update the following:
# - Change all DB_PASSWORD values
# - Update external service URLs if needed
# - Modify JWT_SECRET for security
```

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

### Product Service → Category Service
```typescript
// Product Service mengkonsumsi Category Service
const categoryClient = new CategoryServiceClient();
const category = await categoryClient.getCategoryById(categoryId);
```

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

### Untuk Category Service Team

**Expected Category Service Endpoint**: `http://localhost:4002/graphql`

**Category Query yang dibutuhkan**:
```graphql
query GetCategory($id: ID!) {
  category(id: $id) {
    id
    name
    description
    createdAt
    updatedAt
  }
}

query GetCategories {
  categories {
    id
    name
    description
    createdAt
    updatedAt
  }
}
```

## 🛠️ Development Commands

```bash
# Build services
npm run build

# Run in development mode
npm run dev

# Run tests
npm test

# Database migration
npm run migration

# Database seeding
npm run seed
```

## 📱 Frontend Integration

Frontend/admin pages berjalan lokal dan mengkonsumsi GraphQL APIs yang di-expose oleh Docker containers melalui port mapping.

### Example Frontend API Calls
```javascript
// Fetch products from Product Service
const response = await fetch('http://localhost:4001/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: `
      query GetProducts {
        products {
          products {
            id
            name
            price
            stock
            isAvailable
          }
        }
      }
    `
  })
});

// Update delivery status from Admin Panel
const updateDelivery = await fetch('http://localhost:4003/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: `
      mutation UpdateStatus($input: UpdateDeliveryStatusInput!) {
        updateDeliveryStatus(input: $input) {
          id
          status
          trackingNumber
        }
      }
    `,
    variables: {
      input: {
        id: "delivery-id",
        status: "SHIPPED",
        trackingNumber: "DEL123456789"
      }
    }
  })
});
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   docker-compose down
   docker-compose up -d mysql-product mysql-delivery
   # Wait for healthy status
   docker-compose up -d
   ```

2. **Port Already in Use**
   ```bash
   # Check what's using the port
   netstat -ano | findstr :4001
   
   # Kill the process or change port in .env
   ```

3. **GraphQL Schema Errors**
   ```bash
   # Restart specific service
   docker-compose restart product-service
   ```

4. **Category Service Connection Error**
   - Pastikan Category Service berjalan di port 4002
   - Check `CATEGORY_SERVICE_URL` di Product Service environment

### Health Checks
```bash
# Check all services
curl http://localhost:4001/health
curl http://localhost:4003/health

# Check GraphQL endpoints
curl -X POST http://localhost:4001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __schema { types { name } } }"}'
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
│   │   │   └── categoryService.ts
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
