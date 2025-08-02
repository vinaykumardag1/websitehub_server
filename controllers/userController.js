const User =require("../models/User")
const Favorite=require("../models/userFav")
const getUserProfile = async (req, res) => {
    try {
        // req.user is available because of the auth middleware
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
module.exports={
    getUserProfile,
    getuserUpdate,
}