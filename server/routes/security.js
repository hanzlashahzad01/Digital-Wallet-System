import express from "express";
import OTP from "../models/OTP.js";
import User from "../models/User.js";
import { verifyToken } from "../middleware/auth.js";
import { sendSMSOTP } from "../utils/smsService.js";

const router = express.Router();

/* REQUEST OTP */
router.post("/request-otp", verifyToken, async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user || !user.phoneNumber) {
            return res.status(404).json({ message: "User or phone number not found" });
        }

        const otpValue = Math.floor(100000 + Math.random() * 900000).toString();

        const newOTP = new OTP({
            email,
            phoneNumber: user.phoneNumber,
            otp: otpValue
        });

        await newOTP.save();

        // Send OTP via SMS
        try {
            const result = await sendSMSOTP(user.phoneNumber, otpValue);
            res.status(200).json({
                message: result.simulated ? "Verification code logged to console (Simulation)" : "Verification code sent to your phone via SMS",
                smsSent: !result.simulated,
                otp: result.simulated ? otpValue : undefined // Show OTP in response only if simulated
            });
        } catch (smsError) {
            // Fallback: Still log to console for development
            console.log(`[FALLBACK] OTP for ${user.phoneNumber}: ${otpValue}`);
            res.status(200).json({
                message: "Verification generated (SMS service unavailable)",
                smsSent: false,
                otp: process.env.NODE_ENV === 'development' ? otpValue : undefined
            });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* VERIFY OTP */
router.post("/verify-otp", verifyToken, async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Find user 
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.isFrozen) {
            return res.status(403).json({ message: "Account is frozen. Contact admin." });
        }

        const foundOTP = await OTP.findOne({ phoneNumber: user.phoneNumber, otp }).sort({ createdAt: -1 });

        if (!foundOTP) {
            user.otpAttempts += 1;

            if (user.otpAttempts >= 3) {
                user.isFrozen = true;
                await user.save();
                return res.status(403).json({
                    message: "Account frozen due to multiple failed OTP attempts",
                    isFrozen: true
                });
            }

            await user.save();
            return res.status(400).json({
                message: `Invalid OTP. ${3 - user.otpAttempts} attempts remaining`,
                attemptsRemaining: 3 - user.otpAttempts
            });
        }

        // On success, reset attempts
        user.otpAttempts = 0;
        await user.save();

        // Delete the OTP after verification
        await OTP.deleteOne({ _id: foundOTP._id });

        res.status(200).json({ message: "OTP verified" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
