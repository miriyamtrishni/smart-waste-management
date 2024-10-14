// models/GarbageCollectionEntry.js

const mongoose = require('mongoose');

const GarbageCollectionEntrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    collector: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    wasteData: [
      {
        wasteType: { type: String, enum: ['food', 'cardboard', 'polythene'], required: true },
        weight: { type: Number, required: true }, // Weight in kg
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('GarbageCollectionEntry', GarbageCollectionEntrySchema);
