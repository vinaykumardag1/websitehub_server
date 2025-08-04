const User =require("../models/User")
const Favorite=require("../models/userFav");
const visitedUrls = require("../models/Uservisitedurls");

const getUserProfile = async (req, res) => {
    try {
        
        const user = req.user;

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
const getuserUpdate=async (req,res)=>{
    const {email,mobile,firstname,lastname}=req.query;
    console.log(email,mobile,firstname,lastname)
    try{
        const user=await User.findOneAndUpdate(
            {email:email},
            {mobile,firstname,lastname},
            {new:true}

       )
       if(!user){
        res.json({message:"user not found"})
       }else{
        res.json({message:"user updated succesfully"})
       }
    }catch(error){
        res.json(error)
    }
}
const userFavorites=async (req,res)=>{
    const { itemId } = req.body;
  const userId = req.user.userId; 

  try {
    const exists = await Favorite.findOne({ userId, itemId });
    if (exists) {
      return res.status(400).json({ message: "Already favorited" });
    }

    const favorite = new Favorite({ userId, itemId });
    await favorite.save();

    res.status(201).json({ message: "Added to favorites" });
  } catch (err) {
    res.status(500).json({ message: "Error adding favorite" });
  }
}
const addVisitedUrls = async (req, res) => {
  const { id: userId, url } = req.body;

  if (!userId || !url) {
    return res.status(400).json({ message: 'Missing user ID or URL' });
  }

  try {
    const existing = await visitedUrls.findOne({ userId, url });

    if (existing) {
  
      existing.count += 1;
      existing.date = new Date();
      await existing.save();
      return res.status(200).json({ message: 'Visit count updated', data: existing });
    } else {
      // First time visit
      const newVisit = new VisitedUrl({ userId, url });
      await newVisit.save();
      return res.status(201).json({ message: 'Visit recorded', data: newVisit });
    }
  } catch (err) {
    console.error('Error saving visit:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// Remove all visited URLs for a specific user
const removeVisitedUrls = async (req, res) => {
  const { id: userId } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    await visitedUrls.deleteMany({ userId });
    return res.status(200).json({ message: 'Visited URLs removed successfully' });
  } catch (err) {
    console.error('Error removing visited URLs:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports={
    getUserProfile,
    getuserUpdate,
    addVisitedUrls,
    removeVisitedUrls,
    userFavorites,
}