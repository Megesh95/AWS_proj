const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USER:", process.env.DB_USER);
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Configure CORS to allow the frontend to access the backend.
const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};

app.use(cors(corsOptions));

// Parse JSON request bodies.
app.use(express.json());

// Basic health check endpoint to verify server status.
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Mount routers with /api prefix.
app.use('/api/auth', authRoutes); // /api/auth/signup, /api/auth/login, /api/auth/users/:id
app.use('/api/products', productRoutes); // /api/products, /api/products/:id
app.use('/api/orders', orderRoutes); // /api/orders, /api/orders/:id

// Global 404 handler for unknown API routes.
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// Global error handler (fallback).
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
});

