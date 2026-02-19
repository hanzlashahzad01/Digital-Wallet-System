import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        lastName: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            max: 50,
        },
        password: {
            type: String,
            required: true,
            min: 5,
        },
        walletId: {
            type: String,
            unique: true,
        },
        balance: {
            type: Number,
            default: 1000.00 // Giving initial balance for testing
        },
        currency: {
            type: String,
            default: "USD"
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        isFrozen: {
            type: Boolean,
            default: false
        },
        dailyLimit: {
            type: Number,
            default: 5000.00
        },
        dailyUsage: {
            type: Number,
            default: 0
        },
        lastResetDate: {
            type: Date,
            default: Date.now
        },
        otpAttempts: {
            type: Number,
            default: 0
        },
        phoneNumber: {
            type: String,
            required: false, // Changed to false to avoid validation errors for existing users
            unique: true,
            sparse: true, // Allow multiple documents to have null/undefined phoneNumber
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
