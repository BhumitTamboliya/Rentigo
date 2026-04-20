const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleNumber: { type: String, required: true, unique: true, uppercase: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  type: { type: String, enum: ['2-Wheeler', '4-Wheeler'], required: true },
  modelYear: { type: Number, required: true },
  fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'], required: true },
  transmission: { type: String, enum: ['Manual', 'Automatic'], required: true },
  seatingCapacity: { type: Number, default: 2 },
  color: { type: String },
  description: { type: String },
  images: [{ type: String }],
  pricing: {
    daily: { type: Number, required: true },
    weekly: { type: Number, required: true },
    monthly: { type: Number, required: true }
  },
  location: {
    city: { type: String, required: true },
    address: { type: String }
  },
  availabilityStatus: {
    type: String,
    enum: ['available', 'booked', 'maintenance', 'pending_approval'],
    default: 'pending_approval'
  },
  isApproved: { type: Boolean, default: false },
  features: [{ type: String }],
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
