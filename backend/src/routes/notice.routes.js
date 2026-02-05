const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { Notice, NoticeAttachment } = require('../models');
const { upload, getFileType } = require('../utils/upload');

// GET all notices
router.get('/', async (req, res) => {
  try {
    const notices = await Notice.findAll({
      include: [{
        model: NoticeAttachment,
        as: 'attachments'
      }],
      order: [['date', 'DESC'], ['createdAt', 'DESC']]
    });

    // Format response to match frontend expectations
    const formattedNotices = notices.map(notice => ({
      id: notice.id.toString(),
      title: notice.title,
      description: notice.description,
      fullContent: notice.fullContent,
      date: notice.date,
      isNew: notice.isNew,
      attachments: notice.attachments?.map(att => ({
        id: att.id.toString(),
        url: att.url,
        type: att.type,
        name: att.name
      })),
      // Legacy single attachment support (first attachment if exists)
      attachment: notice.attachments?.[0]?.url,
      attachmentType: notice.attachments?.[0]?.type,
      attachmentName: notice.attachments?.[0]?.name
    }));

    res.json({ success: true, data: formattedNotices });
  } catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notices', error: error.message });
  }
});

// GET single notice by ID
router.get('/:id', async (req, res) => {
  try {
    const notice = await Notice.findByPk(req.params.id, {
      include: [{
        model: NoticeAttachment,
        as: 'attachments'
      }]
    });

    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    const formattedNotice = {
      id: notice.id.toString(),
      title: notice.title,
      description: notice.description,
      fullContent: notice.fullContent,
      date: notice.date,
      isNew: notice.isNew,
      attachments: notice.attachments?.map(att => ({
        id: att.id.toString(),
        url: att.url,
        type: att.type,
        name: att.name
      })),
      attachment: notice.attachments?.[0]?.url,
      attachmentType: notice.attachments?.[0]?.type,
      attachmentName: notice.attachments?.[0]?.name
    };

    res.json({ success: true, data: formattedNotice });
  } catch (error) {
    console.error('Error fetching notice:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notice', error: error.message });
  }
});

// POST create new notice with file uploads
router.post('/', upload.array('files', 10), async (req, res) => {
  try {
    const { title, description, fullContent, date, isNew } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const notice = await Notice.create({
      title,
      description: description || title,
      fullContent: fullContent || description || title,
      date: date || new Date().toISOString().split('T')[0],
      isNew: isNew === 'true' || isNew === true
    });

    // Create attachments from uploaded files
    if (req.files && req.files.length > 0) {
      const attachmentRecords = req.files.map(file => ({
        noticeId: notice.id,
        url: `/uploads/notices/${file.filename}`,
        type: getFileType(file.mimetype),
        name: file.originalname
      }));
      await NoticeAttachment.bulkCreate(attachmentRecords);
    }

    // Fetch the created notice with attachments
    const createdNotice = await Notice.findByPk(notice.id, {
      include: [{ model: NoticeAttachment, as: 'attachments' }]
    });

    const formattedNotice = {
      id: createdNotice.id.toString(),
      title: createdNotice.title,
      description: createdNotice.description,
      fullContent: createdNotice.fullContent,
      date: createdNotice.date,
      isNew: createdNotice.isNew,
      attachments: createdNotice.attachments?.map(att => ({
        id: att.id.toString(),
        url: att.url,
        type: att.type,
        name: att.name
      }))
    };

    res.status(201).json({ success: true, data: formattedNotice });
  } catch (error) {
    console.error('Error creating notice:', error);
    res.status(500).json({ success: false, message: 'Failed to create notice', error: error.message });
  }
});

// PUT update notice with file uploads
router.put('/:id', upload.array('files', 10), async (req, res) => {
  try {
    const notice = await Notice.findByPk(req.params.id, {
      include: [{ model: NoticeAttachment, as: 'attachments' }]
    });

    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    const { title, description, fullContent, date, isNew, keepAttachmentIds } = req.body;

    await notice.update({
      title: title !== undefined ? title : notice.title,
      description: description !== undefined ? description : notice.description,
      fullContent: fullContent !== undefined ? fullContent : notice.fullContent,
      date: date !== undefined ? date : notice.date,
      isNew: isNew !== undefined ? (isNew === 'true' || isNew === true) : notice.isNew
    });

    // Handle attachments
    // Parse keepAttachmentIds - these are existing attachments to keep
    let idsToKeep = [];
    if (keepAttachmentIds) {
      try {
        idsToKeep = JSON.parse(keepAttachmentIds);
      } catch (e) {
        idsToKeep = keepAttachmentIds.split(',').filter(id => id);
      }
    }

    // Delete attachments that are not in keepAttachmentIds
    const existingAttachments = notice.attachments || [];
    for (const att of existingAttachments) {
      if (!idsToKeep.includes(att.id.toString())) {
        // Delete the file from disk
        const filePath = path.join(__dirname, '..', '..', att.url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        await att.destroy();
      }
    }

    // Add new attachments from uploaded files
    if (req.files && req.files.length > 0) {
      const attachmentRecords = req.files.map(file => ({
        noticeId: notice.id,
        url: `/uploads/notices/${file.filename}`,
        type: getFileType(file.mimetype),
        name: file.originalname
      }));
      await NoticeAttachment.bulkCreate(attachmentRecords);
    }

    // Fetch the updated notice with attachments
    const updatedNotice = await Notice.findByPk(notice.id, {
      include: [{ model: NoticeAttachment, as: 'attachments' }]
    });

    const formattedNotice = {
      id: updatedNotice.id.toString(),
      title: updatedNotice.title,
      description: updatedNotice.description,
      fullContent: updatedNotice.fullContent,
      date: updatedNotice.date,
      isNew: updatedNotice.isNew,
      attachments: updatedNotice.attachments?.map(att => ({
        id: att.id.toString(),
        url: att.url,
        type: att.type,
        name: att.name
      }))
    };

    res.json({ success: true, data: formattedNotice });
  } catch (error) {
    console.error('Error updating notice:', error);
    res.status(500).json({ success: false, message: 'Failed to update notice', error: error.message });
  }
});

// DELETE notice
router.delete('/:id', async (req, res) => {
  try {
    const notice = await Notice.findByPk(req.params.id, {
      include: [{ model: NoticeAttachment, as: 'attachments' }]
    });

    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    // Delete attachment files from disk
    if (notice.attachments) {
      for (const att of notice.attachments) {
        const filePath = path.join(__dirname, '..', '..', att.url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    // Attachments will be automatically deleted due to CASCADE
    await notice.destroy();

    res.json({ success: true, message: 'Notice deleted successfully' });
  } catch (error) {
    console.error('Error deleting notice:', error);
    res.status(500).json({ success: false, message: 'Failed to delete notice', error: error.message });
  }
});

// POST upload files endpoint (for separate file upload)
router.post('/upload', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const uploadedFiles = req.files.map(file => ({
      url: `/uploads/notices/${file.filename}`,
      type: getFileType(file.mimetype),
      name: file.originalname
    }));

    res.json({ success: true, data: uploadedFiles });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ success: false, message: 'Failed to upload files', error: error.message });
  }
});

module.exports = router;
