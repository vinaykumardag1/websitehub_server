const express = require("express");
const router = express.Router();

const { Register, Login ,
    OTPgenerator,verifyOTP,
    resetPassword,
    logout} = require("../controllers/authControllers");
const {getUserProfile, getuserUpdate}=require("../controllers/userController")
const authMiddleware=require("../middleware/authMiddleware")


// ✅ Routes
router.post("/register", Register);
router.post("/login", Login);
router.post("/send-otp",OTPgenerator)
router.post("/verfiy-otp",verifyOTP)
router.post("/reset-password",resetPassword)
router.post("/logout",logout)

router.get("/profile",authMiddleware,getUserProfile)
router.put("/profile-update",authMiddleware,getuserUpdate)
module.exports = router

