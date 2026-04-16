const mongoose = require('mongoose');
const config = require('./config');
const logger = require('./logger')('database');

const connectDB = async () => {
  try {
    logger.info('Connecting to: ' + config.database.connection);
    await mongoose.connect(config.database.connection, {
      dbName: config.database.name,
    });
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error(error, 'Failed to connect to MongoDB');
    process.exit(1);
  }
};

module.exports = connectDB;