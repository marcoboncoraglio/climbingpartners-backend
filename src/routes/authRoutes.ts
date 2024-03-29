import express from 'express';
import passport from 'passport';

import UserLogin from '../models/userLogin';
import FriendLists from '../models/friendLists';
import UserCard from '../models/userCard';
import UserDetails from '../models/userDetails';
import Location from '../models/location';
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/register', (req: any, res: any, next: any) => {
  UserLogin.register(
    new UserLogin({ username: req.body.username }),
    req.body.password,
    async (err, user) => {
      if (err) {
        return res.json({ error: err.message });
      }

      const friendLists = new FriendLists({
        id: user._id,
      });

      const userCard = new UserCard({
        id: user._id,
        name: user.username,
      });

      const userDetails = new UserDetails({
        id: user._id,
      });

      const location = new Location({
        id: user._id,
      });

      try {
        await location.save();
        await friendLists.save();
        await userCard.save();
        await userDetails.save();

        const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
          expiresIn: process.env.TOKEN_EXPIRATION_TIME,
        });

        res.status(201).json({ token: token, id: user._id });
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    }
  );
});

router.post('/login', (req: any, res: any) => {
  passport.authenticate('local', { session: false }, (hashErr, user, info) => {
    if (hashErr) {
      return res.status(401).json({ error: hashErr });
    }
    if (!user) {
      return res.status(401).json({ error: info.message });
    }

    req.login(user, { session: false }, (err: any) => {
      if (err) {
        console.log(err);
      }

      const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRATION_TIME,
      });

      res.json({ token: token, id: user._id });
    });
  })(req, res);
});

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile'],
  })
);

router.get(
  '/google/redirect',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/login',
  }),
  async (req, res) => {
    const token = jwt.sign({ id: req.user }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION_TIME,
    });

    res.redirect(
      `http://localhost:3000/login/google/redirect?id=${req.user?._id}&token=${token}`
    );
  }
);

export default router;
