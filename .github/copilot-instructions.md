# Copilot Instructions for UAS IAE Microservices Project

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a microservices architecture project for Enterprise Application Integration (IAE) using:
- **Node.js** with **TypeScript**
- **GraphQL** with **Apollo Server**
- **Express.js** framework
- **MySQL** databases with **Sequelize ORM**
- **Docker** containerization

## Services Architecture
1. **Product Service**: Manages computer component products (CPU, GPU, RAM, Storage)
2. **Delivery Service**: Handles order delivery tracking and status management

## Development Guidelines
- Use GraphQL for ALL inter-service communication (no REST APIs)
- Each service has its own isolated MySQL database
- Services run in Docker containers with proper networking
- Frontend/admin pages run locally and consume Dockerized GraphQL APIs
- Follow microservices best practices with proper error handling
- Use Sequelize models with UUID primary keys
- Implement proper TypeScript typing throughout

## Inter-Service Communication
- Product Service consumes Category Service GraphQL API (external group)
- Delivery Service provides GraphQL API consumed by Order Service (external group)
- All communication happens via Docker internal networking

## Code Style
- Use TypeScript with strict typing
- Follow async/await patterns
- Implement proper error handling and validation
- Use environment variables for configuration
- Structure code with clear separation of concerns
