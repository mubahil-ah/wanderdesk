import 'dotenv/config';  // This loads .env BEFORE anything else
import dns from 'dns';
// Fix Windows DNS: local resolver can't do SRV lookups for mongodb+srv
// Use Google Public DNS which supports SRV queries
dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import initializeFirebase from './config/firebaseConfig.js';

// Routes (imported)
import authRoutes from './routes/authRoutes.js';
import spaceRoutes from './routes/spaceRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import operatorRoutes from './routes/operatorRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/spaces', spaceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/operator', operatorRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('WanderDesk API is running...');
});

const PORT = process.env.PORT || 5000;

// Start the server, THEN connect to DB
const startServer = async () => {
  // Initialize Firebase Admin
  initializeFirebase();

  // Start Express
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });

  // Connect to database (non-blocking)
  await connectDB();
};

startServer();
