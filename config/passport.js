const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy=require("passport-facebook").Strategy;
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/customer/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // You can save the user to MongoDB here
      console.log("Google Profile:", profile);
      return done(null, profile);
    }
  )
);
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/api/customer/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email"], // ensures email and profile pic come through
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("Facebook Profile:", profile);
      return done(null, profile);
    }
  )
);
module.exports = passport;
