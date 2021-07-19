import UserLogin from '../models/userLogin';
import FriendLists from '../models/friendLists';
import UserCard from '../models/userCard';
import UserDetails from '../models/userDetails';
import Location from '../models/location';
import passport from 'passport';

const jwt = require('jsonwebtoken');

const GoogleStrategy = require('passport-google-oauth20').Strategy;

export default function localLoginConfig(passport: any) {
  loadLocalLoginConfig(passport);
  loadGoogleLoginConfig(passport);
}

function loadLocalLoginConfig(passport: any) {
  passport.use(UserLogin.createStrategy());
}

passport.serializeUser(function (user: any, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  UserLogin.findById(id, function (err: any, user: any) {
    done(err, user);
  });
});

function loadGoogleLoginConfig(passport: any) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_AUTH_ID,
        clientSecret: process.env.GOOGLE_AUTH_SECRET,
        callbackURL: '/api/auth/google/redirect',
      },
      function (accessToken: any, refreshToken: any, profile: any, cb: any) {
        UserLogin.findOne({
          googleId: profile.id,
        }).then((user) => {
          if (user) {
            cb(null, user);
          } else {
            new UserLogin({
              username: profile.displayName,
              googleId: profile.id,
            })
              .save()
              .then(async (newUser) => {
                const friendLists = new FriendLists({
                  id: newUser._id,
                });

                const userCard = new UserCard({
                  id: newUser._id,
                });

                const userDetails = new UserDetails({
                  id: newUser._id,
                });

                const location = new Location({
                  id: newUser._id,
                });

                try {
                  await location.save();
                  await friendLists.save();
                  await userCard.save();
                  await userDetails.save();
                } catch (err) {
                  console.log(err);
                }

                cb(null, newUser);
              });
          }
        });
      }
    )
  );
}
