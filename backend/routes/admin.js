const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
const { protect, authorize } = require('../middleware/auth');

// All admin routes protected
router.use(protect, authorize('admin'));

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user role
router.patch('/users/:id/role', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get pending vehicle approvals
router.get('/pending-vehicles', async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ isApproved: false })
      .populate('owner', 'name email phone');
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve/reject vehicle
router.patch('/vehicles/:id/approve', async (req, res) => {
  try {
    const { isApproved } = req.body;
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      {
        isApproved,
        availabilityStatus: isApproved ? 'available' : 'maintenance'
      },
      { new: true }
    );
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Analytics
router.get('/analytics', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalOwners = await User.countDocuments({ role: 'owner' });
    const totalVehicles = await Vehicle.countDocuments({ isApproved: true });
    const totalBookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({ status: 'active' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });

    const revenueData = await Booking.aggregate([
      { $match: { status: { $in: ['active', 'completed', 'approved'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);

    const vehiclesByType = await Vehicle.aggregate([
      { $match: { isApproved: true } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    res.json({
      totalUsers,
      totalOwners,
      totalVehicles,
      totalBookings,
      activeBookings,
      pendingBookings,
      completedBookings,
      totalRevenue: revenueData[0]?.totalRevenue || 0,
      vehiclesByType
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
