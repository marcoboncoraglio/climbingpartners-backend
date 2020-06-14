import express from "express";
import passport from "passport";

import UserLogin from "../models/userLogin";
import FriendLists from "../models/friendLists";
import UserCard from "../models/userCard";
import UserDetails from "../models/userDetails";
import Location from "../models/location";

const router = express.Router();

router.post("/register", (req: any, res: any, next: any) => {
  UserLogin.register(
    new UserLogin({ username: req.body.username }),
    req.body.password,
    async (err, account) => {
      if (err) {
        return res.json({ error: err.message });
      }

      const friendLists = new FriendLists({
        _id: account._id,
      });

      const userCard = new UserCard({
        _id: account._id,
      });

      const userDetails = new UserDetails({
        _id: account._id,
      });

      const location = new Location({
        _id: account._id,
      });

      try {
        await location.save();
        await friendLists.save();
        await userCard.save();
        await userDetails.save();
      } catch (err) {
        res.status(400).json({ message: err.message });
      }

      passport.authenticate("local")(req, res, () => {
        req.session.save((err: any) => {
          if (err) {
            return next(err);
          }

          res.status(201).json({ id: account._id });
        });
      });
    }
  );
});

router.post("/login", (req: any, res: any, next: any) => {
  passport.authenticate("local", (hashErr, user, info) => {
    if (hashErr) {
      return res.status(401).json({ message: hashErr });
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    req.login(user, (err: any) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({ id: user.id });
    });
  })(req, res, next);
});

/*
router.get('/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/');
    });
*/

router.post("/logout", (req: any, res: any, next: any) => {
  req.session.destroy((err: any) => {
    if (err) {
      return next(err);
    }
  });

  req.logout();

  res.status(200).send("Logged out");
});

export default router;
