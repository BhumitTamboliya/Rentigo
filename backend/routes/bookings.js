const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const { protect, authorize } = require('../middleware/auth');

// @POST /api/bookings - Customer: Create booking
router.post('/', protect, authorize('customer'), async (req, res) => {
  try {
    const { vehicleId, startDate, endDate, rentalType, pickupLocation, dropLocation, notes } = req.body;
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    if (vehicle.availabilityStatus !== 'available') {
      return res.status(400).json({ message: 'Vehicle is not available' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (totalDays < 1) return res.status(400).json({ message: 'Invalid date range' });

    let totalAmount;
    if (rentalType === 'monthly') totalAmount = vehicle.pricing.monthly * Math.ceil(totalDays / 30);
    else if (rentalType === 'weekly') totalAmount = vehicle.pricing.weekly * Math.ceil(totalDays / 7);
    else totalAmount = vehicle.pricing.daily * totalDays;

    const booking = await Booking.create({
      customer: req.user._id,
      vehicle: vehicleId,
      owner: vehicle.owner,
      startDate,
      endDate,
      rentalType,
      totalDays,
      totalAmount,
      pickupLocation,
      dropLocation,
      notes
    });

    await Vehicle.findByIdAndUpdate(vehicleId, { availabilityStatus: 'booked' });
    await booking.populate(['customer', 'vehicle', 'owner']);
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/bookings/my-bookings - Customer
router.get('/my-bookings', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate('vehicle', 'brand model type images pricing vehicleNumber')
      .populate('owner', 'name email phone')
      .sort('-createdAt');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/bookings/owner-bookings - Owner
router.get('/owner-bookings', protect, authorize('owner', 'admin'), async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user._id })
      .populate('vehicle', 'brand model type images vehicleNumber')
      .populate('customer', 'name email phone')
      .sort('-createdAt');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @PATCH /api/bookings/:id/status - Owner: Approve/Reject
router.patch('/:id/status', protect, authorize('owner', 'admin'), async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = status;
    if (rejectionReason) booking.rejectionReason = rejectionReason;
    await booking.save();

    // If rejected, make vehicle available again
    if (status === 'rejected' || status === 'cancelled') {
      await Vehicle.findByIdAndUpdate(booking.vehicle, { availabilityStatus: 'available' });
    }
    if (status === 'approved') {
      await Vehicle.findByIdAndUpdate(booking.vehicle, { availabilityStatus: 'booked' });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @PATCH /api/bookings/:id/cancel - Customer: Cancel
router.patch('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    booking.status = 'cancelled';
    await booking.save();
    await Vehicle.findByIdAndUpdate(booking.vehicle, { availabilityStatus: 'available' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/bookings/all - Admin
router.get('/all', protect, authorize('admin'), async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('vehicle', 'brand model type vehicleNumber')
      .populate('customer', 'name email')
      .populate('owner', 'name email')
      .sort('-createdAt');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
