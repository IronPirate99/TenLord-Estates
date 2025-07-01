const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  surname: {
    type: String,
    required: true,
    trim: true
  },
  idNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  accountsBalance: {
    type: Number,
    default: 0,
    required: true
  },
  leaseInDate: {
    type: Date,
    required: true
  },
  leaseOutDate: {
    type: Date,
    required: false  // Optional if tenant is still active
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email']
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: 'South Africa' }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Tenant = mongoose.model('Tenant', tenantSchema);
module.exports = Tenant;