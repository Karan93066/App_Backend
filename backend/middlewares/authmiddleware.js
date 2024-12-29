const jwt = require("jsonwebtoken");

const verifyUserToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access Denied" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified.isAdmin) req.user = verified;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

const verifyAdminToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access Denied" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified.isAdmin)
            return res.status(403).json({ message: "Admins Only" });

        req.admin = verified;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

module.exports = { verifyUserToken, verifyAdminToken };
