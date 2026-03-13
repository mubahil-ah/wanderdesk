import express from 'express';
import { createBooking, getMyBookings, initiatePayment, verifyPayment } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createBooking);

router.get('/mybookings', protect, getMyBookings);

router.post('/:id/pay', protect, initiatePayment);
router.post('/:id/verify', protect, verifyPayment);

export default router;
