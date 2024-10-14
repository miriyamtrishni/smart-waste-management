// routes/request.js

const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const authMiddleware = require('../middleware/auth');

// Pricing formula
const priceMap = {
  food: 50,
  cardboard: 100,
  polythene: 150,
};

const calculatePrice = (wasteType, packageSize) => {
  const multiplier = { small: 2, medium: 4, large: 8 };
  return priceMap[wasteType] * multiplier[packageSize];
};

// Create a new waste collection request with multiple waste items
router.post('/create', authMiddleware, async (req, res) => {
  const { wasteItems } = req.body;
  const user = req.user.userId;

  try {
    // Calculate the total price for each waste item and for the whole request
    let totalPrice = 0;
    const processedWasteItems = wasteItems.map((item) => {
      const itemPrice = calculatePrice(item.wasteType, item.packageSize) * item.quantity;
      totalPrice += itemPrice;
      return {
        wasteType: item.wasteType,
        packageSize: item.packageSize,
        quantity: item.quantity,
        totalPrice: itemPrice,
      };
    });

    // Create and save the new request
    const request = new Request({ user, wasteItems: processedWasteItems, totalPrice });
    await request.save();
    res.status(201).json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch all requests (for admin)
router.get('/admin/requests', authMiddleware, async (req, res) => {
  try {
    const requests = await Request.find()
      .populate('user', 'name')
      .populate('assignedCollector', 'name');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin - Assign a garbage collector
router.put('/admin/assign/:requestId', authMiddleware, async (req, res) => {
  const { requestId } = req.params;
  const { collectorId } = req.body;

  try {
    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.assignedCollector = collectorId;
    request.status = 'assigned';
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Garbage Collector - View assigned requests
router.get('/collector/assigned-requests', authMiddleware, async (req, res) => {
  try {
    const collectorId = req.user.userId;
    const requests = await Request.find({ assignedCollector: collectorId })
      .populate('user', 'name address');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Garbage Collector - Update request status to completed
router.put('/collector/complete/:requestId', authMiddleware, async (req, res) => {
  const { requestId } = req.params;

  try {
    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'completed';
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete request (for completed requests)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    console.log(`Attempting to delete request with ID: ${req.params.id}`);

    const request = await Request.findById(req.params.id);
    if (!request) {
      console.log('Request not found');
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'completed') {
      console.log('Cannot delete request unless it is completed');
      return res.status(400).json({ message: 'Cannot delete request unless it is completed' });
    }

    // Use findByIdAndDelete instead of request.remove()
    await Request.findByIdAndDelete(req.params.id);

    console.log('Request deleted successfully');
    res.json({ message: 'Request deleted' });
  } catch (err) {
    console.error('Error deleting request:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Fetch a specific request by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate('user', 'name email phoneNumber');
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
