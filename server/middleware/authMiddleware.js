import admin from 'firebase-admin';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decode token using Firebase admin
      const decodedToken = await admin.auth().verifyIdToken(token);

      // Fetch user from DB based on Firebase UID
      req.user = await User.findOne({ firebaseUid: decodedToken.uid }).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found in database' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const operator = (req, res, next) => {
  if (req.user && (req.user.role === 'operator' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an operator' });
  }
};

export const adminCheck = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};
