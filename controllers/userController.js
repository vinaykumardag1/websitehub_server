const User =require("../models/User")

const getUserProfile = async (req, res) => {
    try {
        // req.user is available because of the auth middleware
        const user = req.user;

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
module.exports={
    getUserProfile
}