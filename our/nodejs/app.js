// app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists on startup (required for Multer on Render)
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();

const testDB = require('./routes/test-db');
const itemRoutes = require('./routes/item');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const sellerRoutes = require('./routes/seller');

// ✅ Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:4000',
  // Vercel deployment URL — update this after deploying the frontend
  process.env.FRONTEND_URL || 'https://homehaven-frontend.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use('/api/v1', testDB); 
app.use('/api/v1', itemRoutes);
app.use('/api/v1', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1', sellerRoutes);

// Serve uploads folder for profile images and other uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ✅ Sample Route (Temporary Test)
app.get('/api/v1/hello', (req, res) => {
  res.json({ message: 'Hello from your Node.js backend!' });
});

// ✅ Export the app
module.exports = app;