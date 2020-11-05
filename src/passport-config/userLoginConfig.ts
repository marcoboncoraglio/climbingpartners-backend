import UserLogin from '../models/userLogin';
// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

export default function localLoginConfig(passport: any) {
  loadLocalLoginConfig(passport);
  // loadGoogleLoginConfig(passport);
}

function loadLocalLoginConfig(passport: any) {
    passport.use(UserLogin.createStrategy());
}

/*
function loadGoogleLoginConfig(passport:any ){
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_AUTH_ID,
        clientSecret: process.env.GOOGLE_AUTH_SECRET,
        callbackURL: "http://www.example.com/auth/google/callback"
      },
      function(accessToken: any, refreshToken: any, profile: any, done: any) {
        UserLogin.findOrCreate({ googleId: profile.id },
          function (err: any, user: IUserLoginInterface) {
          return done(err, user);
        });
   }
 ));
}
*/
