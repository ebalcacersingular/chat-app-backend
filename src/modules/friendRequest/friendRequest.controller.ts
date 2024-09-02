import { Request, Response } from 'express';
import { FriendRequestService } from './friendRequest.service';

const friendRequestService = new FriendRequestService();

export const sendFriendRequest = async (req: Request, res: Response) => {
  const { username } = req.body;
  const senderUid = (req as any).user.uid;

  console.log(username);
  

  try {
    await friendRequestService.sendFriendRequest(senderUid, username);
    res.status(201).json({ message: 'Friend request sent.' });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

export const respondToFriendRequest = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body; // 'accepted' or 'rejected'
  const receiverUid = (req as any).user.uid;

  try {
    await friendRequestService.respondToFriendRequest(Number(id), status, receiverUid);
    res.status(200).json({ message: `Friend request ${status}.` });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

export const listPendingFriendRequests = async (req: Request, res: Response) => {
  const receiverUid = (req as any).user.uid;

  try {
    const requests = await friendRequestService.listPendingFriendRequests(receiverUid);
    res.status(200).json(requests);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

export const checkFriendshipStatus = async (req: Request, res: Response) => {
  const authUserUid = (req as any).user.uid;
  const { userUid } = req.params;

  try {
    const friendship = await friendRequestService.checkFriendshipStatus(authUserUid, userUid);

    if (friendship) {
      return res.status(200).json({ areFriends: true });
    } else {
      return res.status(200).json({ areFriends: false });
    }
  } catch (error) {
    console.error('Error checking friendship status:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};