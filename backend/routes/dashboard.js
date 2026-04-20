const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
const { protect, authorize } = require('../middleware/auth');

// Owner dashboard stats
router.get('/owner', protect, authorize('owner'), async (req, res) => {
  try {
    const myVehicles = await Vehicle.countDocuments({ owner: req.user._id });
    const availableVehicles = await Vehicle.countDocuments({ owner: req.user._id, availabilityStatus: 'available' });
    const bookedVehicles = await Vehicle.countDocuments({ owner: req.user._id, availabilityStatus: 'booked' });
    const pendingBookings = await Booking.countDocuments({ owner: req.user._id, status: 'pending' });
    const activeBookings = await Booking.countDocuments({ owner: req.user._id, status: 'active' });

    const revenueData = await Booking.aggregate([
      { $match: { owner: req.user._id, status: { $in: ['active', 'completed', 'approved'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const recentBookings = await Booking.find({ owner: req.user._id })
      .populate('customer', 'name email phone')
      .populate('vehicle', 'brand model vehicleNumber')
      .sort('-createdAt')
      .limit(5);

    res.json({
      stats: {
        myVehicles, availableVehicles, bookedVehicles,
        pendingBookings, activeBookings,
        totalRevenue: revenueData[0]?.total || 0
      },
      recentBookings
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
