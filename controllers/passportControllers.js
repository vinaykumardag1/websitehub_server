const passport = require("passport");

// -------- GOOGLE --------
const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

const googleAuthCallback = [
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

// -------- LOGIN STATUS --------
const loginStatus = (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      loggedIn: true,
      user: req.user
    });
  } else {
    res.json({
      loggedIn: false
    });
  }
};

// -------- LOGOUT --------
const oAuthlogout = (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.json({ message: "Logged out successfully" });
  });
};

module.exports = {
  googleAuth,
  googleAuthCallback,
  facebookAuth,
  facebookAuthCallback,
  loginStatus,
  oAuthlogout
};
