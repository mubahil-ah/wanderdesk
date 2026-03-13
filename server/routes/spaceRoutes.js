import express from 'express';
import { getSpaces, getSpaceById, createSpace, updateSpace, getMySpaces } from '../controllers/spaceController.js';
import { protect, operator } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js'; 

const router = express.Router();

router.route('/')
  .get(getSpaces)
  .post(protect, operator, upload.array('images', 10), createSpace);

router.get('/my-spaces', protect, operator, getMySpaces);

router.route('/:id')
  .get(getSpaceById)
  .put(protect, operator, updateSpace);

export default router;
