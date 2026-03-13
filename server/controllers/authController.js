import User from '../models/User.js';
import admin from 'firebase-admin';

// @desc    Register a new user or login existing via Firebase
// @route   POST /api/auth/sync
// @access  Public
export const syncUser = async (req, res) => {
  const { firebaseToken, name, email, profilePicture, role } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const firebaseUid = decodedToken.uid;

    let user = await User.findOne({ firebaseUid });

    if (!user) {
      // Create new user
      user = await User.create({
        firebaseUid,
        name: name || decodedToken.name || email.split('@')[0],
        email: email || decodedToken.email,
        profilePicture: profilePicture || decodedToken.picture || '',
        role: role || 'user', // Default role
      });
      return res.status(201).json(user);
    }
    
    // User exists, return user data
    res.json(user);
    
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid Firebase token' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).populate('savedSpaces');

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.profilePicture = req.body.profilePicture || user.profilePicture;
    
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};
