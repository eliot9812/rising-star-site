const express = require('express');
const router = express.Router();

/* Import routes */
const authRoutes = require('./auth.routes');
const noticeRoutes = require('./notice.routes');
const galleryRoutes = require('./gallery.routes');
const contactRoutes = require('./contact.routes');
const admissionRoutes = require('./admission.routes');

/* Use routes */
router.use('/auth', authRoutes);
router.use('/notices', noticeRoutes);
router.use('/gallery', galleryRoutes);
router.use('/contact', contactRoutes);
router.use('/admissions', admissionRoutes);

module.exports = router;
