const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');

// POST /api/contact - Submit a contact message (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      });
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      phone: phone || '',
      message,
      isRead: false
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: contactMessage
    });
  } catch (error) {
    console.error('Error creating contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
});

// GET /api/contact - Get all contact messages (admin)
router.get('/', async (req, res) => {
  try {
    const messages = await ContactMessage.findAll({
      order: [['createdAt', 'DESC']]
    });

    // Format for frontend compatibility
    const formattedMessages = messages.map(msg => ({
      id: msg.id.toString(),
      name: msg.name,
      email: msg.email,
      phone: msg.phone,
      message: msg.message,
      date: msg.createdAt.toISOString().split('T')[0],
      isRead: msg.isRead
    }));

    res.json({
      success: true,
      data: formattedMessages
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
});

// PUT /api/contact/:id - Update message (mark as read/unread)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;

    const message = await ContactMessage.findByPk(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    await message.update({ isRead });

    res.json({
      success: true,
      message: 'Message updated successfully',
      data: message
    });
  } catch (error) {
    console.error('Error updating contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update message'
    });
  }
});

// DELETE /api/contact/:id - Delete a message (admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const message = await ContactMessage.findByPk(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    await message.destroy();

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message'
    });
  }
});

module.exports = router;
