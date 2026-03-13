import User from '../models/User.js';
import OperatorApplication from '../models/OperatorApplication.js';
import Space from '../models/Space.js';
import Booking from '../models/Booking.js';

// @desc    Make a user admin (protected by secret key)
// @route   POST /api/admin/make-admin
export const makeAdmin = async (req, res) => {
  const { email, secretKey } = req.body;

  if (secretKey !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ message: 'Invalid secret key' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = 'admin';
    await user.save();
    res.json({ message: `${email} is now admin`, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all pending operator applications
// @route   GET /api/admin/applications
export const getApplications = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const applications = await OperatorApplication.find(filter)
      .populate('userId', 'name email profilePicture role')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Approve operator application
// @route   PUT /api/admin/applications/:id/approve
export const approveApplication = async (req, res) => {
  try {
    const application = await OperatorApplication.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    application.status = 'approved';
    await application.save();

    // Update user role to operator
    await User.findByIdAndUpdate(application.userId, { role: 'operator' });

    res.json({ message: 'Application approved. User is now an operator.', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Reject operator application
// @route   PUT /api/admin/applications/:id/reject
export const rejectApplication = async (req, res) => {
  try {
    const application = await OperatorApplication.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    application.status = 'rejected';
    await application.save();

    res.json({ message: 'Application rejected.', application });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all spaces (admin view with status filter)
// @route   GET /api/admin/spaces
export const getAdminSpaces = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const spaces = await Space.find(filter)
      .populate('operatorId', 'name email')
      .sort({ createdAt: -1 });
    res.json(spaces);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Approve a space
// @route   PUT /api/admin/spaces/:id/approve
export const approveSpace = async (req, res) => {
  try {
    const space = await Space.findByIdAndUpdate(
      req.params.id,
      { status: 'active' },
      { new: true }
    );
    if (!space) return res.status(404).json({ message: 'Space not found' });
    res.json({ message: 'Space approved and is now live.', space });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Reject a space
// @route   PUT /api/admin/spaces/:id/reject
export const rejectSpace = async (req, res) => {
  try {
    const space = await Space.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!space) return res.status(404).json({ message: 'Space not found' });
    res.json({ message: 'Space rejected.', space });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/admin/bookings
export const getAdminBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('space', 'name address')
      .populate('operatorId', 'name email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
export const getAdminStats = async (req, res) => {
  try {
    const [userCount, spaceCount, bookingCount, pendingApps, pendingSpaces, bookings] = await Promise.all([
      User.countDocuments(),
      Space.countDocuments({ status: 'active' }),
      Booking.countDocuments(),
      OperatorApplication.countDocuments({ status: 'pending' }),
      Space.countDocuments({ status: 'pending_approval' }),
      Booking.find({ 'paymentInfo.paymentStatus': 'paid' }),
    ]);

    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    res.json({
      userCount,
      spaceCount,
      bookingCount,
      pendingApps,
      pendingSpaces,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
