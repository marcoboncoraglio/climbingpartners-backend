import express from 'express';
import FriendLists from '../models/friendLists';
const router = express.Router();

router.get('/', getFriends, getFriendRequests, (req: any, res: any) => {
  res.json({ friendList: res.friendList, friendRequests: res.friendRequests });
});

router.get('/friends', getFriends, (req: any, res: any) => {
  res.json(res.friendList);
});

router.get('/requests', getFriendRequests, (req: any, res: any) => {
  res.json(res.friendRequests);
});

// add validation
router.post('/sendFriendRequest', async (req: any, res: any) => {
  if (req.body.addedFriendId == null) {
    res.sendStatus(400);
  }

  try {
    await FriendLists.updateOne(
      { id: req.body.addedFriendId },
      { $addToSet: { friendRequests: req.userId } }
    );
  } catch (err) {
    return res.status(400).send({ message: err });
  }

  return res.sendStatus(200);
});

// add validation
router.post('/acceptFriendRequest', async (req: any, res: any) => {
  if (req.body.acceptedFriendId == null) {
    res.sendStatus(400);
  }
  console.log(req.body.acceptedFriendId)

  try {
    // remove friend request
    await FriendLists.updateOne(
      { id: req.userId },
      { $pull: { friendRequests: req.body.acceptedFriendId } }
    );
    // add you in me
    await FriendLists.updateOne(
      { id: req.userId },
      { $addToSet: { friendList: req.body.acceptedFriendId } }
    );
    // add me in you
    await FriendLists.updateOne(
      { id: req.body.acceptedFriendId },
      { $addToSet: { friendList: req.userId } }
    );

    res.sendStatus(200);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

// add validation?
router.post('/declineFriendRequest', async (req: any, res: any) => {
  if (req.body.declinedFriendId == null) {
    res.sendStatus(400);
  }

  try {
    await FriendLists.updateOne(
      { id: req.userId },
      { $pull: { friendRequests: req.body.addedFriendId } }
    );
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

// add validation?
router.delete('/removeFriendship', getFriends, async (req: any, res: any) => {
  if (req.body.removedFriendId == null) {
    res.sendStatus(400);
  }

  try {
    await FriendLists.updateOne(
      { id: req.userId },
      { $pull: { friendList: req.body.removedFriendId } }
    );
    await FriendLists.updateOne(
      { id: req.body.removedFriendId },
      { $pull: { friendList: req.userId } }
    );
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

async function getFriends(req: any, res: any, next: any) {
  try {
    const query = await FriendLists.findOne(
      { id: req.userId },
      { friendList: 1, _id: 0 }
    );
    if (query == null) {
      return res
        .status(404)
        .json({ error: `Cant find friend list for ${req.userId}` });
    }

    res.friendList = query.friendList;
    next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function getFriendRequests(req: any, res: any, next: any) {
  try {
    const query = await FriendLists.findOne(
      { id: req.userId },
      { friendRequests: 1, _id: 0 }
    );
    if (query == null) {
      return res
        .status(404)
        .json({ error: `Cant find friend requests for ${req.userId}` });
    }

    res.friendRequests = query.friendRequests;
    next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export default router;
