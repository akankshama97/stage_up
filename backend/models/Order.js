const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  talentId: {
    type: String,
    required: true
  },
  talentName: {
    type: String,
    required: true
  },
  talentPhone: {
    type: String,
    default: ''
  },
  talentAvatar: {
    type: String,
    default: ''
  },
  projectTitle: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  paymentMethod: {
    type: String,
    default: 'UPI'
  },
  upiId: {
    type: String,
    default: ''
  },
  brief: {
    type: String,
    default: ''
  },
  driveLink: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['escrow_held', 'in_progress', 'delivered', 'completed', 'disputed'],
    default: 'escrow_held'
  },
  turnaroundTime: {
    type: String,
    default: '24 hrs'
  },
  recruiterPhone: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
