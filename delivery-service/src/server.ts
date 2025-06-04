import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';
import { syncDatabase } from './models';
import resolvers from './resolvers';

// Load environment variables
dotenv.config();

// Read GraphQL schema
const typeDefs = readFileSync(join(__dirname, 'graphql', 'schema.graphql'), 'utf8');

async function startServer() {
  // Create Express app
  const app = express();
  const httpServer = http.createServer(app);

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    introspection: process.env.GRAPHQL_INTROSPECTION === 'true',
    includeStacktraceInErrorResponses: process.env.NODE_ENV === 'development',
  });

  // Start Apollo Server
  await server.start();

  // Apply middleware
  app.use('/graphql', cors<cors.CorsRequest>(), express.json(), expressMiddleware(server));

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'OK',
      service: 'Delivery Service',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0'
    });
  });

  // Root endpoint
  app.get('/', (req, res) => {
    res.json({
      message: 'Delivery Service GraphQL API',
      graphql: '/graphql',
      health: '/health'
    });
  });

  const PORT = process.env.PORT || 4003;  try {
    // Initialize database
    console.log('🔄 Initializing delivery database...');
    await syncDatabase(process.env.NODE_ENV === 'development');
    console.log('✅ Delivery database initialized successfully');

    // Start HTTP server
    await new Promise<void>((resolve) => {
      httpServer.listen({ port: PORT }, resolve);
    });

    console.log(`🚀 Delivery Service ready at:`);
    console.log(`   GraphQL: http://localhost:${PORT}/graphql`);
    console.log(`   Health:  http://localhost:${PORT}/health`);
    
  } catch (error) {
    console.error('❌ Failed to start Delivery Service:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down Delivery Service...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🔄 Shutting down Delivery Service...');
  process.exit(0);
});

// Start the server
startServer().catch((error) => {
  console.error('❌ Failed to start Delivery Service:', error);
  process.exit(1);
});
