import express from "express";
import { getAllTransactions, getFlaggedTransactions, freezeWallet, unfreezeWallet } from "../controllers/admin.js";
import { verifyToken } from "../middleware/auth.js";
import { isAdmin } from "../middleware/admin.js";

const router = express.Router();

router.get("/transactions", verifyToken, isAdmin, getAllTransactions);
router.get("/transactions/flagged", verifyToken, isAdmin, getFlaggedTransactions);
router.patch("/freeze/:id", verifyToken, isAdmin, freezeWallet);
router.patch("/unfreeze/:id", verifyToken, isAdmin, unfreezeWallet);

export default router;
