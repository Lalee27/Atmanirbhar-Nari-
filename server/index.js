const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3001',
  credentials: true
}));
app.use(compression());
app.use(express.json());
// Custom safe NoSQL injection sanitizer that avoids the Express 5 req.query getter issue
app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body, { replaceWith: '_' });
  if (req.params) mongoSanitize.sanitize(req.params, { replaceWith: '_' });
  next();
});
// Global Rate Limiting (apply to all /api routes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes.'
});
app.use('/api', limiter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Cache Middleware for Public Data
const cacheControl = (req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
  }
  next();
};

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/businesses', require('./routes/business'));
app.use('/api/inquiries', require('./routes/inquiries'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/mentor', require('./routes/mentor'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/gemini', require('./routes/gemini'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/learning', cacheControl, require('./routes/learning'));
app.use('/api/categories', cacheControl, require('./routes/categories'));

app.get('/api/health', cacheControl, (req, res) => {
  res.json({ status: 'Aatmanirbhar Nari API is healthy' });
});

const http = require('http');
const { initSocket } = require('./socket');

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/aatmanirbhar_nari';

app.use('/api/notifications', require('./routes/notifications'));

// Global Error Handler - Prevents the server from crashing and returns JSON instead of HTML
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    message: 'Internal Server Error. Please try again later.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const server = http.createServer(app);
initSocket(server);

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
// Trigger node --watch restart 3
