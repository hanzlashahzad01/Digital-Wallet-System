import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

/* GET ALL TRANSACTIONS (ADMIN ONLY) */
export const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ createdAt: -1 });
        res.status(200).json(transactions);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* GET FLAGGED TRANSACTIONS */
export const getFlaggedTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ isFlagged: true }).sort({ createdAt: -1 });
        res.status(200).json(transactions);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* FREEZE WALLET */
export const freezeWallet = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.isFrozen = true;
        await user.save();
        res.status(200).json({ message: "Account frozen successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* UNFREEZE WALLET */
export const unfreezeWallet = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.isFrozen = false;
        await user.save();
        res.status(200).json({ message: "Account unfrozen successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
