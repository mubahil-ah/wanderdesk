import express from 'express';
import { submitApplication, getMyApplication } from '../controllers/operatorController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/apply', protect, submitApplication);
router.get('/my-application', protect, getMyApplication);

export default router;
