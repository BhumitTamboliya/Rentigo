const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Vehicle = require('../models/Vehicle');
const { protect, authorize } = require('../middleware/auth');

// Setup uploads folder
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB per file
});

// Multer error handler middleware
const uploadMiddleware = (req, res, next) => {
  upload.array('images', 6)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

// @GET /api/vehicles - Public
router.get('/', async (req, res) => {
  try {
    const { type, fuelType, city, minPrice, maxPrice, rentalType, search } = req.query;
    const filter = { isApproved: true, availabilityStatus: { $ne: 'maintenance' } };
    if (type) filter.type = type;
    if (fuelType) filter.fuelType = fuelType;
    if (city) filter['location.city'] = { $regex: city, $options: 'i' };
    if (search) {
      filter.$or = [
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } }
      ];
    }
    if (minPrice || maxPrice) {
      const priceField = `pricing.${rentalType || 'daily'}`;
      if (minPrice) filter[priceField] = { ...filter[priceField], $gte: Number(minPrice) };
      if (maxPrice) filter[priceField] = { ...filter[priceField], $lte: Number(maxPrice) };
    }
    const vehicles = await Vehicle.find(filter).populate('owner', 'name email phone');
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/vehicles/owner/my-fleet
router.get('/owner/my-fleet', protect, authorize('owner', 'admin'), async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user._id });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/vehicles/:id
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate('owner', 'name email phone');
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @POST /api/vehicles - Owner: Add vehicle
router.post('/', protect, authorize('owner', 'admin'), uploadMiddleware, async (req, res) => {
  try {
    const body = { ...req.body, owner: req.user._id };

    // Parse nested JSON strings from FormData
    if (typeof body.pricing === 'string') body.pricing = JSON.parse(body.pricing);
    if (typeof body.location === 'string') body.location = JSON.parse(body.location);
    if (body.seatingCapacity) body.seatingCapacity = Number(body.seatingCapacity);
    if (body.modelYear) body.modelYear = Number(body.modelYear);

    // Save image file paths
    if (req.files && req.files.length > 0) {
      body.images = req.files.map(f => `/uploads/${f.filename}`);
    } else {
      body.images = [];
    }

    const vehicle = await Vehicle.create(body);
    res.status(201).json(vehicle);
  } catch (err) {
    console.error('Add vehicle error:', err);
    res.status(500).json({ message: err.message });
  }
});

// @PUT /api/vehicles/:id
router.put('/:id', protect, authorize('owner', 'admin'), uploadMiddleware, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    if (vehicle.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const body = { ...req.body };
    if (typeof body.pricing === 'string') body.pricing = JSON.parse(body.pricing);
    if (typeof body.location === 'string') body.location = JSON.parse(body.location);
    if (req.files && req.files.length > 0) {
      body.images = req.files.map(f => `/uploads/${f.filename}`);
    }
    const updated = await Vehicle.findByIdAndUpdate(req.params.id, body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @DELETE /api/vehicles/:id
router.delete('/:id', protect, authorize('owner', 'admin'), async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    if (vehicle.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await vehicle.deleteOne();
    res.json({ message: 'Vehicle deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @PATCH /api/vehicles/:id/status
router.patch('/:id/status', protect, authorize('owner', 'admin'), async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { availabilityStatus: req.body.status },
      { new: true }
    );
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;