// routes/admin.js

const express = require('express');
const router = express.Router();
const Request = require('../models/Request'); // Import the Request model
const User = require('../models/User'); // Import User model if needed
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
    console.error('Error fetching users:', err);
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
    console.error('Error assigning collector:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate invoice for a user after 4 visits
router.post('/generate-invoice/:userId', authMiddleware, adminMiddleware, async (req, res) => {
  const { userId } = req.params;

  try {
    // Get the last 4 collection entries for the user
    const entries = await Request.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(4);

    if (entries.length < 4) {
      return res.status(400).json({ message: 'Less than 4 collection entries found' });
    }

    // Calculate totals
    const wasteTotals = {};

    entries.forEach((entry) => {
      entry.wasteItems.forEach((waste) => {
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
      const ratePerKg = rates[wasteType] || 0;
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
      periodStart: entries[entries.length - 1].createdAt,
      periodEnd: entries[0].createdAt,
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

// Get categorized garbage collection data for admin (total weight per garbage type)
router.get('/garbage-stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const garbageStats = await Request.aggregate([
      { $unwind: '$wasteItems' }, // Unwind wasteItems array
      {
        $group: {
          _id: '$wasteItems.wasteType', // Group by wasteType
          totalWeight: { $sum: '$wasteItems.weight' }, // Sum total weight for each type
        },
      },
      { $sort: { '_id': 1 } },
    ]);

    res.json(garbageStats);
  } catch (err) {
    console.error('Error fetching garbage stats:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get number of requests per month for the current year
router.get('/requests-per-month', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const requestsPerMonth = await Request.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          totalRequests: { $sum: 1 },
        },
      },
      {
        $sort: { '_id': 1 },
      },
    ]);

    // Initialize all months with zero
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      totalRequests: 0,
    }));

    // Populate the monthlyData with actual data
    requestsPerMonth.forEach((item) => {
      monthlyData[item._id - 1].totalRequests = item.totalRequests;
    });

    res.json(monthlyData);
  } catch (error) {
    console.error('Error fetching requests per month:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get the number of users assigned to each garbage collector
router.get('/collector-assignments', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const collectorAssignments = await User.aggregate([
      { $match: { role: 'user', assignedCollector: { $exists: true, $ne: null } } }, // Only users with assigned collectors
      {
        $group: {
          _id: '$assignedCollector',
          assignedUsers: { $sum: 1 }, // Count number of users assigned to each collector
        },
      },
      {
        $lookup: {
          from: 'users', // Assuming collectors are in the same 'users' collection
          localField: '_id',
          foreignField: '_id',
          as: 'collector',
        },
      },
      {
        $unwind: '$collector',
      },
      {
        $project: {
          collectorName: '$collector.name', // Project collector's name
          assignedUsers: 1,
        },
      },
    ]);

    res.json(collectorAssignments);
  } catch (err) {
    console.error('Error fetching collector assignments:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get the number of requests for each garbage category (filter out categories with weight 0)
router.get('/garbage-category-count', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const categoryCounts = await Request.aggregate([
      { $unwind: '$wasteItems' }, // Unwind wasteItems array
      {
        $group: {
          _id: '$wasteItems.wasteType', // Group by wasteType (food, cardboard, polythene)
          totalWeight: { $sum: '$wasteItems.weight' }, // Sum total weight for each category
        },
      },
      { $match: { totalWeight: { $gt: 0 } } }, // Filter out categories with total weight of 0
      { $sort: { totalWeight: -1 } }, // Sort by total weight in descending order
    ]);

    res.json(categoryCounts);
  } catch (error) {
    console.error('Error fetching garbage category counts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



// routes/admin.js

// Get the number of requests for each garbage category excluding those with zero weight
router.get('/garbage-category-count', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const categoryCounts = await Request.aggregate([
      { $unwind: '$wasteItems' }, // Unwind wasteItems array
      {
        $group: {
          _id: '$wasteItems.wasteType', // Group by wasteType (food, cardboard, polythene)
          totalWeight: { $sum: '$wasteItems.weight' }, // Sum the weight of each category
        },
      },
      { $match: { totalWeight: { $gt: 0 } } }, // Filter out categories with zero weight
      { $sort: { totalWeight: -1 } }, // Sort by total weight in descending order
    ]);

    res.json(categoryCounts);
  } catch (error) {
    console.error('Error fetching garbage category counts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;