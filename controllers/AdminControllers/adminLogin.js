const Admin = require("../../models/admin.login");
const User=require("../../models/User")
// Admin Login
const adminLogin = async (req, res) => {
  const { username, password } = req.query;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // ✅ Login success, return admin info (no token/session)
    res.status(200).json({
      message: "Login successful",
      admin: {
        id: admin._id,
        username: admin.username,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Optional: Register Admin (only if needed once)
const registerAdmin = async (req, res) => {
  const { username, password } = req.query;
  try {
    const exists = await Admin.findOne({ username });
    if (exists) return res.status(400).json({ message: "Admin already exists" });

    const admin = new Admin({ username, password });
    await admin.save();

    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getUsers=async (req,res)=>{
  try{
    const users=await User.find()
    if(!users){
      return res.status(403).json({message:"users not found"})
    }
    await res.status(200).json(users)
  }catch(error){
    res.status(500).json({message:error})
  }
}
module.exports={
    adminLogin,
    registerAdmin,
    getUsers,
}