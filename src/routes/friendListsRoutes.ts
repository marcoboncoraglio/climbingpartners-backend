import express from "express";
import FriendLists from "../models/friendLists";
const router = express.Router();

router.get("/", getFriendLists, (req: any, res: any) => {
  res.json(res.friendLists);
});

router.get("/friends", getFriendLists, (req: any, res: any) => {
  res.json(res.friendLists.friendList);
});

router.get("/requests", getFriendLists, (req: any, res: any) => {
  res.json(res.friendLists.friendRequests);
});

router.post("/", async (req: any, res: any) => {
  const friendLists = new FriendLists({
    id: req.userId,
    friendList: req.body.friendList,
    friendRequests: req.body.friendRequests,
  });

  try {
    const newFriendLists = await friendLists.save();
    res.status(201).json(newFriendLists);
  } catch (err) {
    res.status(400).json({error: err.message });
  }
});

router.put("/", getFriendLists, async (req: any, res: any) => {
  res.friendLists.friendList = req.body.friendList;
  res.friendLists.friendRequests = req.body.friendRequests;

  try {
    const updatedFriendLists = await res.friendLists.save();
    res.json(updatedFriendLists);
  } catch (err) {
    res.status(400).json({error: err.message });
  }
});

router.patch("/", getFriendLists, async (req: any, res: any) => {
  if (req.body.friendList != null) {
    res.friendLists.friendList = req.body.friendList;
  }

  if (req.body.friendRequests != null) {
    res.friendLists.friendRequests = req.body.friendRequests;
  }

  try {
    const updatedFriendList = await res.friendLists.save();
    res.json(updatedFriendList);
  } catch (err) {
    res.status(400).json({error: err.message });
  }
});

router.delete("/", getFriendLists, async (req: any, res: any) => {
  try {
    await res.friendLists.remove();
    res.json({error: "Deleted friendList" });
  } catch (err) {
    res.status(500).json({error: err.message });
  }
});

async function getFriendLists(req: any, res: any, next: any) {
  try {
    const friendLists = await FriendLists.findOne({ id: req.userId });
    if (friendLists == null) {
      return res.status(404).json({error: "Cant find friend lists" });
    }

    res.friendLists = friendLists;
    next();
  } catch (err) {
    return res.status(500).json({error: err.message });
  }
}

export default router;
