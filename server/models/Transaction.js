import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
    {
        senderId: {
            type: String,
            required: true,
        },
        receiverId: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: "USD"
        },
        status: {
            type: String,
            enum: ['Pending', 'Completed', 'Failed'],
            default: 'Pending'
        },
        description: {
            type: String,
            default: ""
        },
        riskScore: {
            type: Number,
            default: 0
        },
        isFlagged: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
