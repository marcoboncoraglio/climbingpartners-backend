import express from "express";
import UserCard from "../models/userCard";
const router = express.Router();

router.get("/", async (req: any, res: any) => {
  const userCards = await UserCard.find();
  res.status(200).json(userCards);
});

router.get("/:id", getUserCard, (req: any, res: any) => {
  res.status(200).json(res.userCard);
});

router.post("/", async (req, res) => {
  const userCard = new UserCard({
    id: req.body.id,
    name: req.body.name,
    imgUrl: req.body.imgUrl,
  });

  try {
    const newUserCard = await userCard.save();
    res.status(201).json(newUserCard);
  } catch (err) {
    res.status(400).json({error: err.message });
  }
});

router.put("/:id", getUserCard, async (req: any, res: any) => {
  res.userCard.name = req.body.name;
  res.userCard.imgUrl = req.body.imgUrl;

  try {
    const updatedUserCard = await res.userCard.save();
    res.json(updatedUserCard);
  } catch (err) {
    res.status(400).json({error: err.message });
  }
});

router.patch("/:id", getUserCard, async (req: any, res: any) => {
  if (req.body.name != null) {
    res.userCard.name = req.body.name;
  }

  if (req.body.imgUrl != null) {
    res.userCard.imgUrl = req.body.imgUrl;
  }

  try {
    const updatedUserCard = await res.userCard.save();
    res.json(updatedUserCard);
  } catch (err) {
    res.status(400).json({error: err.message });
  }
});

router.delete("/:id", getUserCard, async (req: any, res: any) => {
  try {
    await res.userCard.remove();
    res.json({error: "Deleted User Card" });
  } catch (err) {
    res.status(500).json({error: err.message });
  }
});

async function getUserCard(req: any, res: any, next: any) {
  try {
    const userCard = await UserCard.findOne({ id: req.params.id });
    if (userCard == null) {
      return res.status(404).json({error: "Cant find user card" });
    }

    res.userCard = userCard;
    next();
  } catch (err) {
    return res.status(500).json({error: err.message });
  }
}

export default router;
