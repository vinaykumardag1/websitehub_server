const jwt = require("jsonwebtoken");

const refreshTokenMiddleware = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        req.user = decoded; 
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired refresh token" });
    }
};

module.exports = refreshTokenMiddleware;
