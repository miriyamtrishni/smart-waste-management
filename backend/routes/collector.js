// routes/collector.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const GarbageCollectionEntry = require('../models/GarbageCollectionEntry');
const authMiddleware = require('../middleware/auth');

// Middleware to check for garbage collector role
const collectorMiddleware = (req, res, next) => {
  if (req.user.role !== 'garbageCollector') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

// Get assigned users
router.get('/assigned-users', authMiddleware, collectorMiddleware, async (req, res) => {
  try {
    const users = await User.find({ assignedCollector: req.user.userId });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Record garbage collection for a user
router.post('/collect-garbage/:userId', authMiddleware, collectorMiddleware, async (req, res) => {
  const { userId } = req.params;
  const { wasteData } = req.body; // Array of { wasteType, weight }

  try {
    // Validate user
    const user = await User.findById(userId);
    if (!user || user.assignedCollector.toString() !== req.user.userId) {
      return res.status(404).json({ message: 'User not found or not assigned to you' });
    }

    // Create garbage collection entry
    const entry = new GarbageCollectionEntry({
      user: userId,
      collector: req.user.userId,
      wasteData,
    });

    await entry.save();

    res.json({ message: 'Garbage collection recorded', entry });
  } catch (err) {
    console.error('Error recording garbage collection:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
