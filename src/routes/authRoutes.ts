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
    async (err, account) => {
      if (err) {
        return res.json({ error: err.message });
      }

      const friendLists = new FriendLists({
        id: account._id,
      });

      const userCard = new UserCard({
        id: account._id,
      });

      const userDetails = new UserDetails({
        id: account._id,
      });

      const location = new Location({
        id: account._id,
      });

      try {
        await location.save();
        await friendLists.save();
        await userCard.save();
        await userDetails.save();
      } catch (err) {
        res.status(400).json({ error: err.message });
      }

      const token = jwt.sign({ id: account._id }, process.env.TOKEN_SECRET, {
        expiresIn: '1800s',
      });

      res.status(201).json({ token: token });
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
        expiresIn: '1800s',
      });

      res.json({ token: token });
    });
  })(req, res);
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

export default router;
