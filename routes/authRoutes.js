const express = require("express");
const router = express.Router();

const { Register, Login } = require("../controllers/authControllers");
const {getUserProfile}=require("../controllers/userController")
const authMiddleware=require("../middleware/authMiddleware")


// ✅ Routes
router.post("/register", Register);
router.post("/login", Login);
// 
router.get("/profile",authMiddleware,getUserProfile)
module.exports = router;

