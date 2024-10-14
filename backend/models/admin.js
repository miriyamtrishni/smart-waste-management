// routes/admin.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const GarbageCollectionEntry = require('../models/GarbageCollectionEntry');
const Invoice = require('../models/Invoice');
const authMiddleware = require('../middleware/auth');

// Middleware to check for admin role
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

// Get all users
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).populate('assignedCollector', 'name');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Assign garbage collector to user
router.put('/assign-collector', authMiddleware, adminMiddleware, async (req, res) => {
  const { userId, collectorId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user || user.role !== 'user') {
      return res.status(404).json({ message: 'User not found' });
    }

    const collector = await User.findById(collectorId);
    if (!collector || collector.role !== 'garbageCollector') {
      return res.status(404).json({ message: 'Garbage collector not found' });
    }

    user.assignedCollector = collectorId;
    await user.save();

    res.json({ message: 'Garbage collector assigned to user' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate invoice for a user after 4 visits
router.post('/generate-invoice/:userId', authMiddleware, adminMiddleware, async (req, res) => {
  const { userId } = req.params;

  try {
    // Get the last 4 collection entries for the user
    const entries = await GarbageCollectionEntry.find({ user: userId })
      .sort({ date: -1 })
      .limit(4);

    if (entries.length < 4) {
      return res.status(400).json({ message: 'Less than 4 collection entries found' });
    }

    // Calculate totals
    const wasteTotals = {};

    entries.forEach((entry) => {
      entry.wasteData.forEach((waste) => {
        if (!wasteTotals[waste.wasteType]) {
          wasteTotals[waste.wasteType] = 0;
        }
        wasteTotals[waste.wasteType] += waste.weight;
      });
    });

    // Rates per kg
    const rates = {
      food: 10,
      cardboard: 20,
      polythene: 50,
    };

    // Build waste details and calculate total amount
    let totalAmount = 0;
    const wasteDetails = Object.keys(wasteTotals).map((wasteType) => {
      const totalWeight = wasteTotals[wasteType];
      const ratePerKg = rates[wasteType];
      const amount = totalWeight * ratePerKg;
      totalAmount += amount;

      return {
        wasteType,
        totalWeight,
        ratePerKg,
        amount,
      };
    });

    // Create invoice
    const invoice = new Invoice({
      user: userId,
      periodStart: entries[entries.length - 1].date,
      periodEnd: entries[0].date,
      totalAmount,
      wasteDetails,
    });

    await invoice.save();

    res.json({ message: 'Invoice generated', invoice });
  } catch (err) {
    console.error('Error generating invoice:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
