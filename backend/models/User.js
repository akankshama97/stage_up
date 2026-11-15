const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, default: '' },
  description: { type: String, default: '' }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  role: {
    type: String,
    enum: ['talent', 'recruiter'],
    default: 'talent'
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  skills: {
    type: [String],
    default: []
  },
  videoUrl: {
    type: String,
    default: ''
  },
  posterUrl: {
    type: String,
    default: ''
  },
  price: {
    type: String,
    required: true,
    default: 'Rs 500'
  },
  priceUnit: {
    type: String,
    default: 'per project'
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  turnaroundTime: {
    type: String,
    default: '24 hrs'
  },
  shortlistedCount: {
    type: Number,
    default: 12
  },
  projects: {
    type: [projectSchema],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
