import express from "express";
import {
  login,
  register,
  logout,
  getUser,
  verifyOTP,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Registration with OTP
router.post("/register", register);

// Verify OTP
router.post("/verify-otp", verifyOTP);

// Login
router.post("/login", login);

// Logout
router.get("/logout", isAuthenticated, logout);

// Get user details
router.get("/getuser", isAuthenticated, getUser);

export default router;
