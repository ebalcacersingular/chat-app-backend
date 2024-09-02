import express from 'express';
import { getUserDetails, updateUserProfile } from './user.controller';
import { verifyToken } from '../../middleware/auth';

const router = express.Router();

router.get('/me', verifyToken, getUserDetails); // Get current user's details
router.patch('/me', verifyToken, updateUserProfile); // Update current user's profile

export default router;
