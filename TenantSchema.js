const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
   AgentName: {
    type: String,
    required: true,
    trim: true
  },
  
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

const mongoose = require('mongoose');

const landlordSchema = new mongoose.Schema({
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
    required: false  // Optional if landlord is still active
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
  propertiesOwned: [{
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: 'South Africa' }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  // Additional fields specific to Landlord
  companyName: {
    type: String,
    trim: true
  },
  taxIdentificationNumber: {
    type: String,
    trim: true
  }
}, { timestamps: true });



const AgentSchema = new mongoose.Schema({
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
    required: false  // Optional if landlord is still active
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
  propertiesManaged: [{
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: 'South Africa' }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  // Additional fields specific to Landlord
  companyName: {
    type: String,
    trim: true
  },
  taxIdentificationNumber: {
    type: String,
    trim: true
  }
}, { timestamps: true });



const Landlord = mongoose.model('Landlord', landlordSchema);
module.exports = Landlord;
const Tenant = mongoose.model('Tenant', tenantSchema);
module.exports = Tenant;