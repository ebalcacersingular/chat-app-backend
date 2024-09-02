import express from 'express';
import { sendFriendRequest, respondToFriendRequest, listPendingFriendRequests, checkFriendshipStatus } from './friendRequest.controller';
import { verifyToken } from '../../middleware/auth';

const router = express.Router();

router.post('/', verifyToken, sendFriendRequest);
router.patch('/:id', verifyToken, respondToFriendRequest);
router.get('/pending', verifyToken, listPendingFriendRequests);
router.get('/friends', verifyToken, checkFriendshipStatus);

export default router;
