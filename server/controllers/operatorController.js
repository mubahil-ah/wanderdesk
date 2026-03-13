import OperatorApplication from '../models/OperatorApplication.js';

// @desc    Submit operator application
// @route   POST /api/operator/apply
// @access  Private (user role)
export const submitApplication = async (req, res) => {
  const { fullName, businessName, phone, city, description } = req.body;

  try {
    // Check if user already has a pending/approved application
    const existing = await OperatorApplication.findOne({
      userId: req.user._id,
      status: { $in: ['pending', 'approved'] },
    });

    if (existing) {
      return res.status(400).json({
        message: existing.status === 'approved'
          ? 'You are already an approved operator.'
          : 'You already have a pending application.',
      });
    }

    const application = await OperatorApplication.create({
      userId: req.user._id,
      fullName,
      businessName,
      phone,
      city,
      description,
    });

    res.status(201).json({
      message: 'Application submitted! Admin will review within 24 hours.',
      application,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current user's application status
// @route   GET /api/operator/my-application
// @access  Private
export const getMyApplication = async (req, res) => {
  try {
    const application = await OperatorApplication.findOne({ userId: req.user._id })
      .sort({ createdAt: -1 });

    if (!application) {
      return res.json({ hasApplication: false });
    }

    res.json({ hasApplication: true, application });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
