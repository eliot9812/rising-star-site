const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const JWT_SECRET = process.env.JWT_SECRET || 'trebs-admin-secret-key-change-in-production';

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const admin = await Admin.findByPk(decoded.id);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Admin not found.'
      });
    }

    req.admin = { id: admin.id, username: admin.username };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Invalid token.'
    });
  }
};

module.exports = authMiddleware;
