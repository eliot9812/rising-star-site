const express = require('express');
const router = express.Router();
const Admission = require('../models/Admission');

// POST /api/admissions - Submit an admission form (public)
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, address, classApplying, message } = req.body;

    // Validation
    if (!name || !phone || !email || !address || !classApplying) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, email, address, and class are required'
      });
    }

    const admission = await Admission.create({
      name,
      phone,
      email,
      address,
      classApplying,
      message: message || '',
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Admission application submitted successfully',
      data: admission
    });
  } catch (error) {
    console.error('Error creating admission:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit admission application'
    });
  }
});

// GET /api/admissions - Get all admissions (admin)
router.get('/', async (req, res) => {
  try {
    const admissions = await Admission.findAll({
      order: [['createdAt', 'DESC']]
    });

    // Format for frontend compatibility
    const formattedAdmissions = admissions.map(adm => ({
      id: adm.id.toString(),
      name: adm.name,
      phone: adm.phone,
      email: adm.email,
      address: adm.address,
      classApplying: adm.classApplying,
      message: adm.message,
      date: adm.createdAt.toISOString().split('T')[0],
      status: adm.status
    }));

    res.json({
      success: true,
      data: formattedAdmissions
    });
  } catch (error) {
    console.error('Error fetching admissions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admissions'
    });
  }
});

// PUT /api/admissions/:id - Update admission status (admin)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'reviewed', 'approved', 'rejected'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const admission = await Admission.findByPk(id);
    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }

    await admission.update({ status });

    res.json({
      success: true,
      message: 'Admission status updated successfully',
      data: admission
    });
  } catch (error) {
    console.error('Error updating admission:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update admission'
    });
  }
});

// DELETE /api/admissions/:id - Delete an admission (admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const admission = await Admission.findByPk(id);
    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }

    await admission.destroy();

    res.json({
      success: true,
      message: 'Admission deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting admission:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete admission'
    });
  }
});

module.exports = router;
