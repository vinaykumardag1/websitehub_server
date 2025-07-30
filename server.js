const express = require("express");
const app = express();
const PORT = 5000;
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();

// ✅ MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB is connected"))
.catch((err) => console.error(`❌ MongoDB connection error: ${err.message}`));

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// ✅ Routes
app.use("/api/customer", authRoutes);


// ✅ Root
app.get("/", (req, res) => {
  res.send("Express works");
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
