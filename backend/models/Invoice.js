// models/Invoice.js

const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    totalAmount: { type: Number, required: true },
    wasteDetails: [
      {
        wasteType: { type: String, enum: ['food', 'cardboard', 'polythene'], required: true },
        totalWeight: { type: Number, required: true },
        ratePerKg: { type: Number, required: true },
        amount: { type: Number, required: true },
      },
    ],
    isPaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Invoice', InvoiceSchema);
