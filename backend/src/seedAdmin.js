/**
 * Seed script to create default admin user.
 * Run once: node src/seedAdmin.js
 *
 * Default credentials:
 *   Username: admin
 *   Password: RisingStar@2024
 *
 * CHANGE THE PASSWORD after first login!
 */
require('dotenv').config();
const { sequelize } = require('./config/database');
const Admin = require('./models/Admin');

const seedAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    // Create the admins table if it doesn't exist
    await Admin.sync();

    // Check if admin already exists
    const existing = await Admin.findOne({ where: { username: 'admin' } });
    if (existing) {
      console.log('Admin user already exists. Skipping seed.');
      process.exit(0);
    }

    await Admin.create({
      username: 'admin',
      password: 'RisingStar@2024'
    });

    console.log('Default admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: RisingStar@2024');
    console.log('IMPORTANT: Change the password after first login!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
