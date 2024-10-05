// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);

// Protected Admin Route Example
const authMiddleware = require('./middleware/auth');
const roleMiddleware = require('./middleware/role');

app.get('/api/admin/dashboard', authMiddleware, roleMiddleware(['admin']), (req, res) => {
  res.json({ message: 'Welcome to the admin dashboard' });
});

// Protected User Route Example
app.get('/api/user/dashboard', authMiddleware, roleMiddleware(['user', 'admin']), (req, res) => {
  res.json({ message: 'Welcome to the user dashboard' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, {  
}).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error(err);
});
