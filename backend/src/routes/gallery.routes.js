const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { GalleryEvent, GalleryPhoto } = require('../models');
const { galleryUpload } = require('../utils/upload');

// GET all gallery events with photos
router.get('/', async (req, res) => {
  try {
    const events = await GalleryEvent.findAll({
      include: [{
        model: GalleryPhoto,
        as: 'photos'
      }],
      order: [['date', 'DESC'], ['createdAt', 'DESC']]
    });

    const formattedEvents = events.map(event => ({
      id: event.id.toString(),
      eventName: event.eventName,
      description: event.description,
      coverPhoto: event.coverPhoto,
      date: event.date,
      photos: event.photos?.map(photo => ({
        id: photo.id.toString(),
        src: photo.src,
        alt: photo.alt
      })) || []
    }));

    res.json({ success: true, data: formattedEvents });
  } catch (error) {
    console.error('Error fetching gallery events:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch gallery events', error: error.message });
  }
});

// GET single gallery event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await GalleryEvent.findByPk(req.params.id, {
      include: [{
        model: GalleryPhoto,
        as: 'photos'
      }]
    });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Gallery event not found' });
    }

    const formattedEvent = {
      id: event.id.toString(),
      eventName: event.eventName,
      description: event.description,
      coverPhoto: event.coverPhoto,
      date: event.date,
      photos: event.photos?.map(photo => ({
        id: photo.id.toString(),
        src: photo.src,
        alt: photo.alt
      })) || []
    };

    res.json({ success: true, data: formattedEvent });
  } catch (error) {
    console.error('Error fetching gallery event:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch gallery event', error: error.message });
  }
});

// POST create new gallery event with photos
router.post('/', galleryUpload.fields([
  { name: 'coverPhoto', maxCount: 1 },
  { name: 'photos', maxCount: 50 }
]), async (req, res) => {
  try {
    const { eventName, description, date } = req.body;

    if (!eventName) {
      return res.status(400).json({ success: false, message: 'Event name is required' });
    }

    // Get cover photo URL
    let coverPhotoUrl = null;
    if (req.files && req.files.coverPhoto && req.files.coverPhoto[0]) {
      coverPhotoUrl = `/uploads/gallery/${req.files.coverPhoto[0].filename}`;
    }

    const event = await GalleryEvent.create({
      eventName,
      description: description || '',
      coverPhoto: coverPhotoUrl,
      date: date || new Date().toISOString().split('T')[0]
    });

    // Create photos from uploaded files
    if (req.files && req.files.photos && req.files.photos.length > 0) {
      const photoRecords = req.files.photos.map((file, index) => ({
        eventId: event.id,
        src: `/uploads/gallery/${file.filename}`,
        alt: `${eventName} - Photo ${index + 1}`
      }));
      await GalleryPhoto.bulkCreate(photoRecords);
    }

    // If no cover photo was uploaded, use the first photo as cover
    if (!coverPhotoUrl && req.files && req.files.photos && req.files.photos[0]) {
      coverPhotoUrl = `/uploads/gallery/${req.files.photos[0].filename}`;
      await event.update({ coverPhoto: coverPhotoUrl });
    }

    // Fetch the created event with photos
    const createdEvent = await GalleryEvent.findByPk(event.id, {
      include: [{ model: GalleryPhoto, as: 'photos' }]
    });

    const formattedEvent = {
      id: createdEvent.id.toString(),
      eventName: createdEvent.eventName,
      description: createdEvent.description,
      coverPhoto: createdEvent.coverPhoto,
      date: createdEvent.date,
      photos: createdEvent.photos?.map(photo => ({
        id: photo.id.toString(),
        src: photo.src,
        alt: photo.alt
      })) || []
    };

    res.status(201).json({ success: true, data: formattedEvent });
  } catch (error) {
    console.error('Error creating gallery event:', error);
    res.status(500).json({ success: false, message: 'Failed to create gallery event', error: error.message });
  }
});

// PUT update gallery event
router.put('/:id', galleryUpload.fields([
  { name: 'coverPhoto', maxCount: 1 },
  { name: 'photos', maxCount: 50 }
]), async (req, res) => {
  try {
    const event = await GalleryEvent.findByPk(req.params.id, {
      include: [{ model: GalleryPhoto, as: 'photos' }]
    });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Gallery event not found' });
    }

    const { eventName, description, date, keepPhotoIds } = req.body;

    // Handle cover photo update
    let coverPhotoUrl = event.coverPhoto;
    if (req.files && req.files.coverPhoto && req.files.coverPhoto[0]) {
      // Delete old cover photo if it exists and is from uploads
      if (event.coverPhoto && event.coverPhoto.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', '..', event.coverPhoto);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      coverPhotoUrl = `/uploads/gallery/${req.files.coverPhoto[0].filename}`;
    }

    await event.update({
      eventName: eventName !== undefined ? eventName : event.eventName,
      description: description !== undefined ? description : event.description,
      coverPhoto: coverPhotoUrl,
      date: date !== undefined ? date : event.date
    });

    // Handle photos
    let idsToKeep = [];
    if (keepPhotoIds) {
      try {
        idsToKeep = JSON.parse(keepPhotoIds);
      } catch (e) {
        idsToKeep = keepPhotoIds.split(',').filter(id => id);
      }
    }

    // Delete photos that are not in keepPhotoIds
    const existingPhotos = event.photos || [];
    for (const photo of existingPhotos) {
      if (!idsToKeep.includes(photo.id.toString())) {
        // Delete the file from disk
        if (photo.src && photo.src.startsWith('/uploads/')) {
          const filePath = path.join(__dirname, '..', '..', photo.src);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
        await photo.destroy();
      }
    }

    // Add new photos from uploaded files
    if (req.files && req.files.photos && req.files.photos.length > 0) {
      const photoRecords = req.files.photos.map((file, index) => ({
        eventId: event.id,
        src: `/uploads/gallery/${file.filename}`,
        alt: `${event.eventName} - Photo ${index + 1}`
      }));
      await GalleryPhoto.bulkCreate(photoRecords);
    }

    // Fetch the updated event with photos
    const updatedEvent = await GalleryEvent.findByPk(event.id, {
      include: [{ model: GalleryPhoto, as: 'photos' }]
    });

    const formattedEvent = {
      id: updatedEvent.id.toString(),
      eventName: updatedEvent.eventName,
      description: updatedEvent.description,
      coverPhoto: updatedEvent.coverPhoto,
      date: updatedEvent.date,
      photos: updatedEvent.photos?.map(photo => ({
        id: photo.id.toString(),
        src: photo.src,
        alt: photo.alt
      })) || []
    };

    res.json({ success: true, data: formattedEvent });
  } catch (error) {
    console.error('Error updating gallery event:', error);
    res.status(500).json({ success: false, message: 'Failed to update gallery event', error: error.message });
  }
});

// DELETE gallery event
router.delete('/:id', async (req, res) => {
  try {
    const event = await GalleryEvent.findByPk(req.params.id, {
      include: [{ model: GalleryPhoto, as: 'photos' }]
    });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Gallery event not found' });
    }

    // Delete cover photo file
    if (event.coverPhoto && event.coverPhoto.startsWith('/uploads/')) {
      const coverPath = path.join(__dirname, '..', '..', event.coverPhoto);
      if (fs.existsSync(coverPath)) {
        fs.unlinkSync(coverPath);
      }
    }

    // Delete photo files
    if (event.photos) {
      for (const photo of event.photos) {
        if (photo.src && photo.src.startsWith('/uploads/')) {
          const filePath = path.join(__dirname, '..', '..', photo.src);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      }
    }

    // Photos will be automatically deleted due to CASCADE
    await event.destroy();

    res.json({ success: true, message: 'Gallery event deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery event:', error);
    res.status(500).json({ success: false, message: 'Failed to delete gallery event', error: error.message });
  }
});

// POST add photos to existing event
router.post('/:id/photos', galleryUpload.array('photos', 50), async (req, res) => {
  try {
    const event = await GalleryEvent.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Gallery event not found' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No photos uploaded' });
    }

    const photoRecords = req.files.map((file, index) => ({
      eventId: event.id,
      src: `/uploads/gallery/${file.filename}`,
      alt: req.body.alts ? (Array.isArray(req.body.alts) ? req.body.alts[index] : req.body.alts) : `${event.eventName} - Photo`
    }));

    const createdPhotos = await GalleryPhoto.bulkCreate(photoRecords);

    const formattedPhotos = createdPhotos.map(photo => ({
      id: photo.id.toString(),
      src: photo.src,
      alt: photo.alt
    }));

    res.status(201).json({ success: true, data: formattedPhotos });
  } catch (error) {
    console.error('Error adding photos:', error);
    res.status(500).json({ success: false, message: 'Failed to add photos', error: error.message });
  }
});

// DELETE specific photo from event
router.delete('/:eventId/photos/:photoId', async (req, res) => {
  try {
    const photo = await GalleryPhoto.findOne({
      where: {
        id: req.params.photoId,
        eventId: req.params.eventId
      }
    });

    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }

    // Delete the file from disk
    if (photo.src && photo.src.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', '..', photo.src);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await photo.destroy();

    res.json({ success: true, message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({ success: false, message: 'Failed to delete photo', error: error.message });
  }
});

module.exports = router;
