require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const adminRoutes=require("./routes/adminRoutes")
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error(`❌ MongoDB connection error: ${err.message}`));

// ✅ Apply Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Rate Limiter Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                 
  standardHeaders: true,    
  legacyHeaders: false,     
  message: "Too many requests from this IP, please try again later.",
});

app.use(limiter); 

// ✅ Routes
app.use("/api/customer", authRoutes);
app.use("/api/admin",adminRoutes)
// ✅ Root Route
app.get("/", (req, res) => {
  res.send("✅ Express works");
});
// app.use((err, req, res, next) => {
//   if (err instanceof Error && err.message === "Only images are allowed") {
//     return res.status(400).json({ message: err.message });
//   }
//   next(err);
// });

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
