const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const app = express();


const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
  : [
    'http://localhost:5173',
    'http://localhost:8080',
    'https://therisingenglishschool.com',
    'https://www.therisingenglishschool.com',
    'http://therisingenglishschool.com'
  ];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check if origin is allowed
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('therisingenglishschool.com')) {
      return callback(null, true);
    } else {
      // For development/debugging, you might want to log this
      // console.log('Blocked by CORS:', origin);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Also serve uploads under /api/uploads so it works through cPanel's reverse proxy
app.use('/api/uploads', express.static(path.join(__dirname, '..', 'uploads')));

const routes = require('./routes');
app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'School Website Backend Running 🚀'
  });
});

/* -------------------- Error Handler -------------------- */
const errorHandler = require('./middleware/error.middleware');
app.use(errorHandler);

module.exports = app;
