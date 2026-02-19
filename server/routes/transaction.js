import express from "express";
import { getTransactions, sendMoney } from "../controllers/transaction.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getTransactions);

/* WRITE */
router.post("/send", verifyToken, sendMoney);

export default router;
