import sequelize from '../config/database';
import Delivery from './Delivery';

// Initialize all models
const models = {
  Delivery,
};

// Sync database
export const syncDatabase = async (force: boolean = false) => {
  try {
    await sequelize.authenticate();
    console.log('Delivery Service database connection has been established successfully.');
    
    await sequelize.sync({ force });
    console.log('Delivery Service database synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the delivery database:', error);
    throw error;
  }
};

// Close database connection
export const closeDatabase = async () => {
  try {
    await sequelize.close();
    console.log('Delivery Service database connection closed.');
  } catch (error) {
    console.error('Error closing delivery database connection:', error);
    throw error;
  }
};

export { sequelize, Delivery };
export default models;
