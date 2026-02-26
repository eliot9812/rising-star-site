const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Resolve uploads base directory.
// On cPanel, set UPLOADS_PATH in .env to the absolute path of your backend folder,
// e.g. UPLOADS_PATH=/home/avyantat/therising-backend
// If not set, falls back to the backend root relative to this file.
const uploadsBase = process.env.UPLOADS_PATH
  ? path.resolve(process.env.UPLOADS_PATH)
  : path.join(__dirname, '..', '..');

const noticesUploadsDir = path.join(uploadsBase, 'uploads', 'notices');
const galleryUploadsDir = path.join(uploadsBase, 'uploads', 'gallery');

console.log('Upload directories:');
console.log('  Notices:', noticesUploadsDir);
console.log('  Gallery:', galleryUploadsDir);

if (!fs.existsSync(noticesUploadsDir)) {
  fs.mkdirSync(noticesUploadsDir, { recursive: true });
}
if (!fs.existsSync(galleryUploadsDir)) {
  fs.mkdirSync(galleryUploadsDir, { recursive: true });
}

// Configure storage for notices
const noticesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(noticesUploadsDir, { recursive: true });
    cb(null, noticesUploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueId}${ext}`);
  }
});

// Configure storage for gallery
const galleryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(galleryUploadsDir, { recursive: true });
    cb(null, galleryUploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueId}${ext}`);
  }
});

// File filter for notices (images and PDFs)
const noticesFileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images (JPEG, PNG, GIF, WebP) and PDFs are allowed.'), false);
  }
};

// File filter for gallery (images only)
const galleryFileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images (JPEG, PNG, GIF, WebP) are allowed.'), false);
  }
};

// Create multer upload instances
const upload = multer({
  storage: noticesStorage,
  fileFilter: noticesFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

const galleryUpload = multer({
  storage: galleryStorage,
  fileFilter: galleryFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Helper to get file type
const getFileType = (mimetype) => {
  if (mimetype === 'application/pdf') {
    return 'pdf';
  }
  return 'image';
};

module.exports = {
  upload,
  galleryUpload,
  getFileType,
  noticesUploadsDir,
  galleryUploadsDir
};
