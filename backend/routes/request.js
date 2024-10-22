// routes/request.js

const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const Joi = require('joi'); 
const authMiddleware = require('../middleware/auth');

// Pricing formula based on weight (per kg)
const priceMap = {
  food: 50,       // LKR per kg
  cardboard: 100, // LKR per kg
  polythene: 150, // LKR per kg
};

// Calculate price based on wasteType and weight
const calculatePrice = (wasteType, weight) => {
  return priceMap[wasteType] * weight;
};

// Create a new waste collection request
router.post('/create', authMiddleware, async (req, res) => {
  const { wasteItems, totalPrice, paymentIntentId } = req.body;
  const userId = req.user.userId; // Adjust based on your auth middleware

  try {
    const newRequest = new Request({
      user: userId,
      wasteItems,
      totalPrice,
      status: 'pending', // Initial status
      paymentStatus: 'paid',
      paymentIntentId,
    });

    await newRequest.save();

    res.status(201).json({ message: 'Waste collection request created successfully', request: newRequest });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ message: 'Failed to create request' });
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

// Fetch all requests for the logged-in user
router.get('/user/my-requests', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRequests = await Request.find({ user: userId })
      .populate('assignedCollector', 'name')
      .sort({ createdAt: -1 }); // Optional: Sort by newest first

    if (!userRequests.length) {
      return res.status(404).json({ message: 'No requests found for this user' });
    }

    res.json(userRequests);
  } catch (error) {
    console.error('Error fetching user requests:', error);
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
});


module.exports = router;
