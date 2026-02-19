import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            firstName,
            lastName,
            email,
            password,
            phoneNumber
        } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            phoneNumber,
            walletId: Math.random().toString(36).substr(2, 9).toUpperCase(), // Simple wallet ID generation
            balance: 1000.00,
            isAdmin: req.body.isAdmin || false
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* LOGGING IN */
export const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ msg: "User does not exist. " });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* UPDATE USER */
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { firstName, lastName, email },
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        // Convert to plain object to delete password if using Mongoose model
        const userObj = updatedUser.toObject();
        delete userObj.password;

        res.status(200).json(userObj);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* UPDATE PASSWORD */
export const updatePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        await User.findByIdAndUpdate(id, { password: passwordHash });

        res.status(200).json({ message: "Security key rotated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* GET ALL USERS (for Quick Send) */
export const getAllUsers = async (req, res) => {
    try {
        const { userId } = req.query; // Get current user ID from query params

        // Fetch all users except the current user, excluding password
        const users = await User.find(
            { _id: { $ne: userId } },
            { password: 0 }
        ).limit(10); // Limit to 10 users for Quick Send

        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


