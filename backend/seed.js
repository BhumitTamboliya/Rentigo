const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/rentigo');

const User = require('./models/User');
const Vehicle = require('./models/Vehicle');

const seed = async () => {
  try {
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    console.log('🗑️  Cleared old data');

    // Let the User model's pre-save hook handle hashing
    const admin = await User.create({ name: 'Super Admin', email: 'admin@rentigo.com', password: 'admin123', role: 'admin', phone: '9999999999' });
    const owner = await User.create({ name: 'Raj Motors', email: 'owner@rentigo.com', password: 'owner123', role: 'owner', phone: '9876543210' });
    const customer = await User.create({ name: 'Priya Sharma', email: 'customer@rentigo.com', password: 'cust123', role: 'customer', phone: '9123456789' });

    console.log('✅ Users created');

    // Create vehicles
    const vehicles = await Vehicle.insertMany([
      {
        owner: owner._id,
        vehicleNumber: 'MH12AB1234',
        brand: 'Honda', model: 'Activa 6G', type: '2-Wheeler',
        modelYear: 2023, fuelType: 'Petrol', transmission: 'Manual',
        seatingCapacity: 2, color: 'Pearl White',
        description: 'Well-maintained Honda Activa 6G. Perfect for city rides.',
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'],
        pricing: { daily: 350, weekly: 2000, monthly: 7000 },
        location: { city: 'Mumbai', address: 'Andheri West' },
        availabilityStatus: 'available', isApproved: true,
      },
      {
        owner: owner._id,
        vehicleNumber: 'MH14CD5678',
        brand: 'Royal Enfield', model: 'Classic 350', type: '2-Wheeler',
        modelYear: 2022, fuelType: 'Petrol', transmission: 'Manual',
        seatingCapacity: 2, color: 'Gunmetal Grey',
        description: 'Iconic Royal Enfield Classic 350. Great for long rides and weekend trips.',
        images: ['https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600'],
        pricing: { daily: 800, weekly: 5000, monthly: 16000 },
        location: { city: 'Pune', address: 'Koregaon Park' },
        availabilityStatus: 'available', isApproved: true,
      },
      {
        owner: owner._id,
        vehicleNumber: 'KA01EF9012',
        brand: 'Maruti Suzuki', model: 'Swift Dzire', type: '4-Wheeler',
        modelYear: 2023, fuelType: 'Petrol', transmission: 'Automatic',
        seatingCapacity: 5, color: 'Arctic White',
        description: 'Comfortable Swift Dzire with automatic transmission. AC, music system included.',
        images: ['https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600'],
        pricing: { daily: 1500, weekly: 9000, monthly: 30000 },
        location: { city: 'Bangalore', address: 'Indiranagar' },
        availabilityStatus: 'available', isApproved: true,
      },
      {
        owner: owner._id,
        vehicleNumber: 'DL03GH3456',
        brand: 'Toyota', model: 'Innova Crysta', type: '4-Wheeler',
        modelYear: 2022, fuelType: 'Diesel', transmission: 'Manual',
        seatingCapacity: 7, color: 'Silver',
        description: 'Spacious 7-seater Innova Crysta. Ideal for family trips and group travel.',
        images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600'],
        pricing: { daily: 2500, weekly: 15000, monthly: 50000 },
        location: { city: 'Delhi', address: 'Connaught Place' },
        availabilityStatus: 'available', isApproved: true,
      },
      {
        owner: owner._id,
        vehicleNumber: 'TN09IJ7890',
        brand: 'Ola', model: 'S1 Pro', type: '2-Wheeler',
        modelYear: 2023, fuelType: 'Electric', transmission: 'Automatic',
        seatingCapacity: 2, color: 'Midnight Black',
        description: 'Ola S1 Pro electric scooter. Zero emissions, silent ride, 140km range.',
        images: ['https://images.unsplash.com/photo-1614161462416-dea5d79dc94e?w=600'],
        pricing: { daily: 500, weekly: 3000, monthly: 10000 },
        location: { city: 'Chennai', address: 'Anna Nagar' },
        availabilityStatus: 'available', isApproved: true,
      },
      {
        owner: owner._id,
        vehicleNumber: 'GJ05KL2345',
        brand: 'Hyundai', model: 'Creta', type: '4-Wheeler',
        modelYear: 2023, fuelType: 'Petrol', transmission: 'Automatic',
        seatingCapacity: 5, color: 'Typhoon Silver',
        description: 'Premium Hyundai Creta SUV with sunroof, ventilated seats, and ADAS features.',
        images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600'],
        pricing: { daily: 2000, weekly: 12000, monthly: 40000 },
        location: { city: 'Ahmedabad', address: 'SG Highway' },
        availabilityStatus: 'available', isApproved: true,
      },
    ]);

    console.log(`✅ ${vehicles.length} vehicles created`);
    console.log('\n🎉 Seed complete! Use these accounts:');
    console.log('Admin  : admin@rentigo.com / admin123');
    console.log('Owner  : owner@rentigo.com / owner123');
    console.log('Customer: customer@rentigo.com / cust123');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seed();