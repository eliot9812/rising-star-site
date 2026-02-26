const { Sequelize } = require('sequelize');
require('dotenv').config();

/* -------------------- Sequelize Instance -------------------- */
const sequelize = new Sequelize(
  process.env.DB_NAME,     // database name
  process.env.DB_USER,     // username
  process.env.DB_PASSWORD, // password
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false,        // set true to see SQL queries
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    timezone: '+05:45',    // Nepal Time
    dialectOptions: {
      charset: 'utf8mb4',
    },
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
  }
);

/* -------------------- Test Connection -------------------- */
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
  } catch (err) {
    console.error('❌ Unable to connect to database:', err.message);
    process.exit(1);
  }
};

/* -------------------- Export -------------------- */
module.exports = {
  sequelize,
  connectDB
};
