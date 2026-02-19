import express from "express";
import { body } from "express-validator";
import { login, register, updateUser, updatePassword, getAllUsers } from "../controllers/auth.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post(
    "/login",
    [
        body("email").isEmail().withMessage("Invalid email format"),
        body("password").notEmpty().withMessage("Password is required")
    ],
    login
);

router.post(
    "/register",
    [
        body("firstName").isLength({ min: 2 }).withMessage("First name too short"),
        body("lastName").isLength({ min: 2 }).withMessage("Last name too short"),
        body("email").isEmail().withMessage("Invalid email format"),
        body("password").isLength({ min: 5 }).withMessage("Password must be at least 5 chars"),
        body("phoneNumber").notEmpty().withMessage("Phone number is required")
    ],
    register
);

router.patch("/update/:id", verifyToken, updateUser);
router.patch("/password/:id", verifyToken, updatePassword);
router.get("/users", verifyToken, getAllUsers);

export default router;
