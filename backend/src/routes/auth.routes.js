const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const authMiddleware = require('../middleware/auth.middleware');

const JWT_SECRET = process.env.JWT_SECRET || 'trebs-admin-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    const admin = await Admin.findOne({ where: { username } });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        username: admin.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// GET /api/auth/verify - verify token is still valid
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const admin = await Admin.findByPk(decoded.id);
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Admin not found' });
    }

    res.json({
      success: true,
      admin: {
        id: admin.id,
        username: admin.username
      }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// DEBUG ROUTE - Check if admin exists and test password
router.get('/debug-check', async (req, res) => {
  try {
    const admin = await Admin.findOne({ where: { username: 'admin' } });
    if (!admin) {
      return res.json({
        success: false,
        message: 'Admin user "admin" NOT FOUND in database.'
      });
    }

    const passwordCandidate = 'RisingStar@2024';
    const isMatch = await admin.comparePassword(passwordCandidate);

    res.json({
      success: true,
      message: 'Admin user found.',
      debugInfo: {
        id: admin.id,
        username: admin.username,
        storedPasswordHash: admin.password.substring(0, 15) + '...', // Masked for security
        passwordLength: admin.password.length,
        isPasswordMatch: isMatch,
        note: isMatch ? 'Login should work!' : 'Password mismatch. Check hash or plain text.'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database error',
      error: error.message
    });
  }
});

// DEBUG ROUTE - Create admin user if missing
router.get('/create-admin', async (req, res) => {
  try {
    const existing = await Admin.findOne({ where: { username: 'admin' } });
    if (existing) {
      return res.json({ success: false, message: 'Admin user already exists' });
    }

    const newAdmin = await Admin.create({
      username: 'admin',
      password: 'RisingStar@2024' // Will be hashed by hooks (or stored plain if hooks disabled/bypassed)
    });

    res.json({
      success: true,
      message: 'Admin user created successfully',
      username: 'admin',
      password: 'RisingStar@2024'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create admin',
      error: error.message
    });
  }
});

// PUT /api/auth/change-password (admin only)
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    const admin = await Admin.findByPk(req.admin.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Failed to change password' });
  }
});

module.exports = router;
