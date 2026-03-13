import express from 'express';
import { protect, adminCheck } from '../middleware/authMiddleware.js';
import {
  makeAdmin,
  getApplications,
  approveApplication,
  rejectApplication,
  getAdminSpaces,
  approveSpace,
  rejectSpace,
  getAdminBookings,
  getAdminStats,
} from '../controllers/adminController.js';

const router = express.Router();

// Public (protected by secret key in body)
router.post('/make-admin', makeAdmin);

// All below require admin role
router.get('/stats', protect, adminCheck, getAdminStats);
router.get('/applications', protect, adminCheck, getApplications);
router.put('/applications/:id/approve', protect, adminCheck, approveApplication);
router.put('/applications/:id/reject', protect, adminCheck, rejectApplication);
router.get('/spaces', protect, adminCheck, getAdminSpaces);
router.put('/spaces/:id/approve', protect, adminCheck, approveSpace);
router.put('/spaces/:id/reject', protect, adminCheck, rejectSpace);
router.get('/bookings', protect, adminCheck, getAdminBookings);

export default router;
