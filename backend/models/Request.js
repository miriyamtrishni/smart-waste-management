// models/Request.js

const mongoose = require('mongoose');

const WasteItemSchema = new mongoose.Schema({
  wasteType: { type: String, enum: ['food', 'cardboard', 'polythene'], required: true },
  weight: { type: Number, required: true }, // Weight in kilograms
  totalPrice: { type: Number, required: true }, // Price of this waste item
});

const RequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User making the request
  wasteItems: [WasteItemSchema], // Multiple waste items
  totalPrice: { type: Number, required: true }, // Total price of all waste items
  status: { type: String, enum: ['pending', 'assigned', 'completed'], default: 'pending' },
  assignedCollector: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' }, // New field
  paymentIntentId: { type: String, default: null }, // To associate PaymentIntent
}, { timestamps: true });

module.exports = mongoose.model('Request', RequestSchema);
