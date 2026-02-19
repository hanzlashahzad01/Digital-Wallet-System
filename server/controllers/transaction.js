import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import { sendTransactionSMS } from "../utils/smsService.js";

/* GET TRANSACTIONS */
export const getTransactions = async (req, res) => {
    try {
        const { id } = req.params;
        // Find transactions where user is sender or receiver
        const transactions = await Transaction.find({
            $or: [
                { senderId: id },
                { receiverId: id }
            ]
        }).sort({ createdAt: -1 });

        res.status(200).json(transactions);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* SEND MONEY */
export const sendMoney = async (req, res) => {
    try {
        const { senderId, receiverRunningId, amount, description } = req.body;
        const transferAmount = Number(amount);

        // Find sender
        const sender = await User.findById(senderId);
        if (!sender) {
            return res.status(404).json({ message: "Sender not found" });
        }

        if (sender.isFrozen) {
            return res.status(403).json({ message: "Your wallet is frozen. Contact admin." });
        }

        // Reset daily usage if it's a new day
        const now = new Date();
        const lastReset = new Date(sender.lastResetDate);
        if (now.toDateString() !== lastReset.toDateString()) {
            sender.dailyUsage = 0;
            sender.lastResetDate = now;
        }

        // Check daily limit
        if (sender.dailyUsage + transferAmount > sender.dailyLimit) {
            return res.status(400).json({ message: "Daily transfer limit exceeded" });
        }

        // Find receiver
        const receiver = await User.findOne({
            $or: [
                { email: receiverRunningId },
                { walletId: receiverRunningId }
            ]
        });

        if (!receiver) {
            return res.status(404).json({ message: "Receiver not found" });
        }

        if (sender.balance < transferAmount) {
            return res.status(400).json({ message: "Insufficient funds" });
        }

        // Fraud Detection logic
        let riskScore = 0;
        let isFlagged = false;

        // 1. High value transaction (> 10,000)
        if (transferAmount > 10000) {
            riskScore += 50;
        }

        // 2. Frequency check (too many transfers in short time)
        const recentTransactionsCount = await Transaction.countDocuments({
            senderId,
            createdAt: { $gt: new Date(Date.now() - 10 * 60 * 1000) } // last 10 minutes
        });

        if (recentTransactionsCount > 5) {
            riskScore += 60;
        }

        if (riskScore >= 100) {
            isFlagged = true;
            console.log(`[ALERT] High risk transaction detected for user ${senderId}. Risk Score: ${riskScore}`);
        }

        // Update balances and usage
        sender.balance -= transferAmount;
        sender.dailyUsage += transferAmount;
        receiver.balance += transferAmount;

        await sender.save();
        await receiver.save();

        const newTransaction = new Transaction({
            senderId,
            receiverId: receiver._id,
            amount: transferAmount,
            status: "Completed",
            description,
            riskScore,
            isFlagged
        });

        await newTransaction.save();

        // SMS Notifications
        if (sender.phoneNumber) {
            await sendTransactionSMS(sender.phoneNumber, 'sent', transferAmount);
        }
        if (receiver.phoneNumber) {
            await sendTransactionSMS(receiver.phoneNumber, 'received', transferAmount);
        }

        // Notification simulation
        console.log(`[NOTIFICATION] ${transferAmount} ${sender.currency} sent to ${receiver.email}. Note: ${description}`);

        res.status(201).json(newTransaction);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
