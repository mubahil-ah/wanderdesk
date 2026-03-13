import 'dotenv/config';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

import mongoose from 'mongoose';
import Space from '../models/Space.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';

const UNSPLASH = 'https://images.unsplash.com';

const SAMPLE_SPACES = [
  {
    name: 'The Hive Mumbai',
    description: 'A vibrant coworking space in the heart of Lower Parel, Mumbai. Perfect for startups, freelancers, and remote teams. Features modern design, high-speed internet, and a thriving community of professionals.',
    spaceType: 'Coworking',
    address: { street: '301, Kamala Mills Compound, Lower Parel', city: 'Mumbai', state: 'Maharashtra', zipCode: '400013', country: 'India' },
    location: { type: 'Point', coordinates: [72.8258, 18.9940] },
    images: [
      `${UNSPLASH}/photo-1497366216548-37526070297c?w=800`,
      `${UNSPLASH}/photo-1497366811353-6870744d04b2?w=800`,
      `${UNSPLASH}/photo-1504384308090-c894fdcc538d?w=800`,
    ],
    amenities: ['WiFi', 'AC', 'Parking', 'Cafeteria', 'Printer', 'Meeting Room', 'Phone Booth', 'Reception'],
    pricing: { hourly: 250, daily: 999, monthly: 15000 },
    capacity: { total: 120, meetingRooms: 4, privateCabins: 10 },
    operatingHours: { open: '08:00', close: '22:00', daysOpen: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] },
    bookingType: 'Instant',
    averageRating: 4.5,
    numReviews: 32,
  },
  {
    name: 'WorkVista Bangalore',
    description: 'Premium coworking in Koramangala with stunning city views, ergonomic furniture, and a rooftop cafeteria. Ideal for tech startups and digital nomads visiting the Silicon Valley of India.',
    spaceType: 'Coworking',
    address: { street: '42, 1st Main, Koramangala 5th Block', city: 'Bangalore', state: 'Karnataka', zipCode: '560095', country: 'India' },
    location: { type: 'Point', coordinates: [77.6166, 12.9352] },
    images: [
      `${UNSPLASH}/photo-1519389950473-47ba0277781c?w=800`,
      `${UNSPLASH}/photo-1556761175-5973dc0f32e7?w=800`,
      `${UNSPLASH}/photo-1542744173-8e7e53415bb0?w=800`,
    ],
    amenities: ['WiFi', 'AC', 'Standing Desk', 'Cafeteria', '24/7 Access', 'Locker', 'Podcast Room', 'Whiteboard'],
    pricing: { hourly: 200, daily: 800, monthly: 12000 },
    capacity: { total: 80, meetingRooms: 3, privateCabins: 8 },
    operatingHours: { open: '06:00', close: '23:00', daysOpen: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    bookingType: 'Instant',
    averageRating: 4.7,
    numReviews: 45,
  },
  {
    name: 'CoDesk Delhi',
    description: 'Modern coworking space near Connaught Place with excellent metro connectivity. Features sound-proof meeting rooms, a podcast studio, and a community events area.',
    spaceType: 'Coworking',
    address: { street: '15, Barakhamba Road, Near CP', city: 'Delhi', state: 'Delhi', zipCode: '110001', country: 'India' },
    location: { type: 'Point', coordinates: [77.2310, 28.6328] },
    images: [
      `${UNSPLASH}/photo-1531973576160-7125cd663d86?w=800`,
      `${UNSPLASH}/photo-1600508774634-4e11d34730e2?w=800`,
      `${UNSPLASH}/photo-1568992688065-536aad8a12f6?w=800`,
    ],
    amenities: ['WiFi', 'AC', 'Parking', 'Projector', 'Printer', 'Meeting Room', 'Reception', 'Locker'],
    pricing: { hourly: 300, daily: 1200, monthly: 18000 },
    capacity: { total: 100, meetingRooms: 5, privateCabins: 12 },
    operatingHours: { open: '09:00', close: '21:00', daysOpen: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
    bookingType: 'Request',
    averageRating: 4.3,
    numReviews: 18,
  },
  {
    name: 'TechHub Hyderabad',
    description: 'A tech-focused coworking space in HITEC City with ultrafast fiber internet, dual monitor setups, and dedicated gaming zone for breaks. Built for developers and designers.',
    spaceType: 'Private Office',
    address: { street: '7-1-58, HITEC City Main Road', city: 'Hyderabad', state: 'Telangana', zipCode: '500081', country: 'India' },
    location: { type: 'Point', coordinates: [78.3826, 17.4435] },
    images: [
      `${UNSPLASH}/photo-1562664348-2a17a7024a0b?w=800`,
      `${UNSPLASH}/photo-1527192491265-7e15c55b1ed2?w=800`,
      `${UNSPLASH}/photo-1572025442646-866d16c84a54?w=800`,
    ],
    amenities: ['WiFi', 'AC', 'Standing Desk', '24/7 Access', 'Phone Booth', 'Cafeteria', 'Printer', 'Whiteboard'],
    pricing: { hourly: 180, daily: 700, monthly: 10000 },
    capacity: { total: 60, meetingRooms: 2, privateCabins: 6 },
    operatingHours: { open: '00:00', close: '23:59', daysOpen: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    bookingType: 'Instant',
    averageRating: 4.8,
    numReviews: 67,
  },
  {
    name: 'GreenDesk Pune',
    description: 'Eco-friendly coworking in Baner with indoor plants, natural lighting, and sustainable furniture. Includes a meditation room, yoga area, and organic cafeteria.',
    spaceType: 'Coworking',
    address: { street: '204, Baner Road, Near Orchid School', city: 'Pune', state: 'Maharashtra', zipCode: '411045', country: 'India' },
    location: { type: 'Point', coordinates: [73.7868, 18.5590] },
    images: [
      `${UNSPLASH}/photo-1600494603989-9650cf6ddd3d?w=800`,
      `${UNSPLASH}/photo-1593642632559-0c6d3fc62b89?w=800`,
      `${UNSPLASH}/photo-1606857521015-7f9fcf423740?w=800`,
    ],
    amenities: ['WiFi', 'AC', 'Parking', 'Cafeteria', 'Standing Desk', 'Meeting Room', 'Locker', 'Reception'],
    pricing: { hourly: 150, daily: 600, monthly: 8000 },
    capacity: { total: 50, meetingRooms: 2, privateCabins: 4 },
    operatingHours: { open: '08:00', close: '20:00', daysOpen: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] },
    bookingType: 'Instant',
    averageRating: 4.6,
    numReviews: 24,
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find or create a dummy operator user
    let operator = await User.findOne({ role: 'operator' });
    if (!operator) {
      operator = await User.findOne(); // use any existing user
    }
    if (!operator) {
      console.error('No users found in database. Please sign in via Google first, then run this script.');
      process.exit(1);
    }

    console.log(`Using operator: ${operator.name} (${operator.email})`);

    // Clear existing sample data (optional)
    const existingCount = await Space.countDocuments();
    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing spaces. Adding new sample spaces...`);
    }

    // Insert spaces
    const createdSpaces = [];
    for (const spaceData of SAMPLE_SPACES) {
      const space = await Space.create({
        ...spaceData,
        operatorId: operator._id,
        status: 'active',
        isActive: true,
        deskTypes: [
          {
            type: 'Hot Desk',
            pricePerHour: spaceData.pricing.hourly,
            pricePerDay: spaceData.pricing.daily,
            pricePerMonth: spaceData.pricing.monthly,
            capacity: spaceData.capacity.total,
            availableQty: spaceData.capacity.total,
          },
        ],
      });
      console.log(`✅ Created: ${space.name} (${space.address.city})`);
      createdSpaces.push(space);
    }

    // Create 2 sample bookings
    const booker = await User.findOne({ role: 'user' }) || operator;
    
    if (createdSpaces.length >= 2) {
      const booking1 = await Booking.create({
        user: booker._id,
        space: createdSpaces[0]._id,
        operatorId: operator._id,
        deskType: 'Hot Desk',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        startTime: '10:00',
        endTime: '18:00',
        numberOfSeats: 2,
        totalAmount: createdSpaces[0].pricing.daily * 2,
        status: 'confirmed',
        paymentInfo: { paymentStatus: 'paid', paidAt: new Date() },
      });
      console.log(`✅ Created booking: ${booker.name} → ${createdSpaces[0].name}`);

      const booking2 = await Booking.create({
        user: booker._id,
        space: createdSpaces[1]._id,
        operatorId: operator._id,
        deskType: 'Hot Desk',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        startTime: '09:00',
        endTime: '17:00',
        numberOfSeats: 1,
        totalAmount: createdSpaces[1].pricing.daily,
        status: 'pending',
        paymentInfo: { paymentStatus: 'pending' },
      });
      console.log(`✅ Created booking: ${booker.name} → ${createdSpaces[1].name}`);
    }

    console.log('\n🎉 Seed data inserted successfully!');
    console.log(`   ${createdSpaces.length} spaces created`);
    console.log(`   2 bookings created`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error.message);
    process.exit(1);
  }
};

seedData();
