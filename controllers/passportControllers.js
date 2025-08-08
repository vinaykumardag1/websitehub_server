const passport = require("passport");

// Redirect to Google OAuth
const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

// Handle Google OAuth Callback
const googleAuthCallback = [
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.json({
      message: "Logged in successfully",
      user: req.user,
    });
  }
];


// -------- GOOGLE --------
exports.googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

exports.googleAuthCallback = [
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.json({
      message: "Google login successful",
      user: req.user,
    });
  }
];

// -------- FACEBOOK --------
const facebookAuth = passport.authenticate("facebook", { scope: ["email"] });

const facebookAuthCallback = [
  passport.authenticate("facebook", { failureRedirect: "/" }),
  (req, res) => {
    res.json({
      message: "Facebook login successful",
      user: req.user,
    });
  }
];

module.exports={
    googleAuth,
    googleAuthCallback,
    facebookAuth,
    facebookAuthCallback,
}