import express from "express";
import Location from "../models/location";
const router = express.Router();

// TODO: allow getting locations withing a certain radius
router.get("/", async (req: any, res: any) => {
  const locations = await Location.find();
  res.json(locations);
});

router.get("/:id", getLocation, (req: any, res: any) => {
  res.json(res.location);
});

router.post("/", async (req: any, res: any) => {
  const location = new Location({
    id: req.body.id,
    lat: req.body.lat,
    lng: req.body.lng,
  });

  try {
    const newLocation = await location.save();
    res.status(201).json(newLocation);
  } catch (err) {
    res.status(400).json({error: err.message });
  }
});

router.put("/:id", getLocation, async (req: any, res: any) => {
  res.location.lat = req.body.lat;
  res.location.lng = req.body.lng;

  try {
    const updatedLocation = await res.location.save();
    res.json(updatedLocation);
  } catch (err) {
    res.status(400).json({error: err.message });
  }
});

router.patch("/:id", getLocation, async (req: any, res: any) => {
  if (req.body.lat != null) {
    res.location.lat = req.body.lat;
  }

  if (req.body.lng != null) {
    res.location.lng = req.body.lng;
  }

  try {
    const updatedLocation = await res.location.save();
    res.json(updatedLocation);
  } catch (err) {
    res.status(400).json({error: err.message });
  }
});

router.delete("/:id", getLocation, async (req: any, res: any) => {
  try {
    await res.location.remove();
    res.json({error: "Deleted Location" });
  } catch (err) {
    res.status(500).json({error: err.message });
  }
});

async function getLocation(req: any, res: any, next: any) {
  try {
    const location = await Location.findOne({ id: req.params.id });
    if (location == null) {
      return res.status(404).json({error: "Cant find location" });
    }

    res.location = location;
    next();
  } catch (err) {
    return res.status(500).json({error: err.message });
  }
}

export default router;
