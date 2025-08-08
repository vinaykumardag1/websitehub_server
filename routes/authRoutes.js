const express = require("express");
const router = express.Router();

const { Register, Login ,
    OTPgenerator,verifyOTP,
    resetPassword,
    logout} = require("../controllers/authControllers");
const {getUserProfile, getuserUpdate}=require("../controllers/userController")
const authMiddleware=require("../middleware/authMiddleware")

const {  googleAuth,googleAuthCallback,facebookAuth,facebookAuthCallback}=require("../controllers/passportControllers")
// ✅ Routes
router.post("/register", Register);
router.post("/login", Login);
router.post("/send-otp",OTPgenerator)
router.post("/verfiy-otp",verifyOTP)
router.post("/reset-password",resetPassword)
router.post("/logout",logout)

router.get("/profile",authMiddleware,getUserProfile)
router.put("/profile-update",authMiddleware,getuserUpdate)
// 
// Start Google OAuth
router.get("/auth/google", googleAuth);

// Google OAuth Callback
router.get("/auth/google/callback", googleAuthCallback);
router.get("/auth/google", googleAuth);
router.get("/auth/google/callback", googleAuthCallback);

// -------- FACEBOOK --------
router.get("/auth/facebook", facebookAuth);
router.get("/auth/facebook/callback", facebookAuthCallback);

module.exports = router

