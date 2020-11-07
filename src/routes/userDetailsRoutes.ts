import express from 'express';
import UserDetails from '../models/userDetails';
const router = express.Router();

router.get('/', getUserDetails, (req: any, res: any) => {
  res.status(200).json(res.userDetails);
});

router.get('/:id', async (req: any, res: any) => {
  try {
    const userDetails = await UserDetails.findOne({ _id: req.params.id });
    if (userDetails == null) {
      return res.status(404).json({ error: 'Cant find user card' });
    }

    res.status(200).json(userDetails);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req: any, res: any) => {
  const userDetails = new UserDetails({
    id: req.userId,
    about: req.body.about,
    availableEquipment: req.body.availableEquipment,
    climbingStyles: req.body.climbingStyles,
    languagesSpoken: req.body.languagesSpoken,
    birthday: req.body.birthday,
  });

  try {
    const newUserDetails = await userDetails.save();
    res.status(201).json(newUserDetails);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/', getUserDetails, async (req: any, res: any) => {
  res.userDetails.about = req.body.about;
  res.userDetails.availableEquipment = req.body.availableEquipment;
  res.userDetails.climbingStyles = req.body.climbingStyles;
  res.userDetails.languagesSpoken = req.body.languagesSpoken;
  res.userDetails.birthday = req.body.birthday;

  try {
    const updatedUserDetails = await res.userDetails.save();
    res.json(updatedUserDetails);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/', getUserDetails, async (req: any, res: any) => {
  if (req.body.about != null) {
    res.userDetails.about = req.body.about;
  }

  if (req.body.availableEquipment != null) {
    res.userDetails.availableEquipment = req.body.availableEquipment;
  }

  if (req.body.climbingStyles != null) {
    res.userDetails.climbingStyles = req.body.climbingStyles;
  }

  if (req.body.languagesSpoken != null) {
    res.userDetails.languagesSpoken = req.body.languagesSpoken;
  }

  try {
    const updatedUserDetails = await res.userDetails.save();
    res.json(updatedUserDetails);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/', getUserDetails, async (req: any, res: any) => {
  try {
    await res.userDetails.remove();
    res.json({ error: 'Deleted User Details' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function getUserDetails(req: any, res: any, next: any) {
  try {
    const userDetails = await UserDetails.findOne({ _id: req.userId });
    if (userDetails == null) {
      return res.status(404).json({ error: 'Cant find user details' });
    }

    res.userDetails = userDetails;
    next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export default router;
