const mongoose = require('mongoose');

const WasteItemSchema = new mongoose.Schema({
  wasteType: { type: String, enum: ['food', 'cardboard', 'polythene'], required: true },
  packageSize: { type: String, enum: ['small', 'medium', 'large'], required: true },
  quantity: { type: Number, default: 1 }, // Number of packages
  totalPrice: { type: Number, required: true }, // Price of this waste item
});

const RequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User making the request
  wasteItems: [WasteItemSchema], // Multiple waste items
  totalPrice: { type: Number, required: true }, // Total price of all waste items
  status: { type: String, enum: ['pending', 'assigned', 'completed'], default: 'pending' },
  assignedCollector: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Request', RequestSchema);
