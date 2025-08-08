const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../config/mailer");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

// Temporary OTP store (in-memory)
const otpStore = new Map();

// 🔐 Generate JWT Tokens
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      mobile: user.mobile,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      mobile: user.mobile,
    },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN }
  );
};

// ✅ Register Controller
const Register = async (req, res) => {
  const { firstname, lastname, email, mobile, password, terms_conditions } = req.query;

  try {
    if (!firstname || !lastname || !email || !mobile || !password || terms_conditions === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists with this email." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstname,
      lastname,
      email,
      mobile,
      password: hashedPassword,
      terms_conditions,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
        mobile: newUser.mobile,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// ✅ Login Controller


const Login = async (req, res) => {
  const { email, password } = req.query; // Use body, not query

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Email not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    const authToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);



    // ✅ Set refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",

      authToken,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};


// ✅ OTP Generator
const OTPgenerator = async (req, res) => {
  const { email } = req.query;

  if (!email) return res.status(400).json({ error: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000;

  otpStore.set(email, { otp, expiresAt, verified: false });

  try {
    await sendMail({
      to: email,
      subject: "🔐 Your OTP Code",
      text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>🔐 One-Time Password (OTP)</h2>
          <p>Your OTP code is:</p>
          <h3 style="color: #2e6da4;">${otp}</h3>
          <p>This code is valid for 5 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    console.log(`✅ OTP sent to ${email}: ${otp}`);
    return res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("❌ OTP email error:", error.message);
    return res.status(500).json({ error: "Failed to send OTP email" });
  }
};

// ✅ Verify OTP
const verifyOTP = (req, res) => {
  const { email, otp } = req.query;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  const stored = otpStore.get(email);
  if (!stored) return res.status(400).json({ error: "No OTP found for this email" });

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ error: "OTP has expired" });
  }

  if (stored.otp !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  stored.verified = true;
  otpStore.set(email, stored);

  return res.status(200).json({ message: "OTP verified successfully" });
};

// ✅ Reset Password
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.query;

  try {
    const stored = otpStore.get(email);

    if (!stored || !stored.verified) {
      return res.status(403).json({ error: "OTP verification required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    otpStore.delete(email);

    // Optionally issue token after reset
    const authToken = generateAccessToken(user);

    return res.status(200).json({
      message: "Password reset successful",
      authToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Password reset failed", error: error.message });
  }
};

// ✅ Logout
const logout = async (req, res) => {
  try {
    // Clear cookie if using JWT tokens
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("❌ Logout error:", err);
    return res.status(500).json({ message: "Logout failed" });
  }
};

module.exports = {
  Register,
  Login,
  OTPgenerator,
  verifyOTP,
  resetPassword,
  logout,
};
