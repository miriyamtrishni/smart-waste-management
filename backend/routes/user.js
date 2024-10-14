const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const authMiddleware = require('../middleware/auth');

// Get invoices for the logged-in user
router.get('/invoices', authMiddleware, async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user.userId });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
