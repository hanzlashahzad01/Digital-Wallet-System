import User from "../models/User.js";

export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: "Admin access denied" });
        }
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
