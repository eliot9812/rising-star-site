const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const app = express();


app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:8080',
    'https://therisingenglishschool.com',
    'https://www.therisingenglishschool.com',
    'http://therisingenglishschool.com' // In case SSL is not yet active
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

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
