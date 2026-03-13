import Booking from '../models/Booking.js';
import Space from '../models/Space.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  const { spaceId, deskType, date, startTime, endTime, numberOfSeats, totalAmount } = req.body;

  try {
    const space = await Space.findById(spaceId);
    
    if (!space) {
      return res.status(404).json({ message: 'Space not found' });
    }

    const booking = await Booking.create({
      user: req.user._id,
      space: spaceId,
      operatorId: space.operatorId,
      deskType,
      date,
      startTime,
      endTime,
      numberOfSeats,
      totalAmount,
      status: space.bookingType === 'Instant' ? 'confirmed' : 'pending',
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: 'Error creating booking' });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/mybookings
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('space', 'name address images');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Initiate Razorpay checkout
// @route   POST /api/bookings/:id/pay
// @access  Private
export const initiatePayment = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: booking.totalAmount * 100, // in paisa
      currency: 'INR',
      receipt: `receipt_${booking._id}`,
    };

    const order = await instance.orders.create(options);

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Payment gateway error', error: error.message });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/bookings/:id/verify
// @access  Private
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      const booking = await Booking.findById(req.params.id);
      booking.paymentInfo = {
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paymentStatus: 'paid',
        paidAt: Date.now(),
      };
      
      if (booking.status === 'pending' || booking.status === 'confirmed') {
        // Leave confirm logic separate or mark confirmed
        booking.status = 'confirmed';
      }

      await booking.save();
      res.json({ message: 'Payment verified successfully', booking });
    } else {
      res.status(400).json({ message: 'Invalid signature sent!' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Verification error' });
  }
};
