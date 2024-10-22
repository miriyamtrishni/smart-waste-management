const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const authRoutes = require('./routes/auth');
const requestRoutes = require('./routes/request');
const adminRoutes = require('./routes/admin');
const collectorRoutes = require('./routes/collector');
const userRoutes = require('./routes/user');
const stripeRoutes = require('./routes/stripe');

const app = express();

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  if (req.originalUrl === '/api/stripe/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // Update to your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/request', requestRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/collector', collectorRoutes);
app.use('/api/user', userRoutes);
app.use('/api/stripe', stripeRoutes);

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error(err);
  });
