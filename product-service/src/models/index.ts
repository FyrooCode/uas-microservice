import sequelize from '../config/database';
import Product from './Product';

// Initialize all models
const models = {
  Product,
};

// Sync database
export const syncDatabase = async (force: boolean = false) => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    await sequelize.sync({ force });
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

// Close database connection
export const closeDatabase = async () => {
  try {
    await sequelize.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error closing database connection:', error);
    throw error;
  }
};

export { sequelize, Product };
export default models;
