import { Router } from "express";
import { 
  sendOTP, 
  verifyOTP, 
  resendOTP, 
  checkEmailVerification 
} from "../controllers/emailVerification.controller.js";

const router = Router();

// Send OTP to email
router.post("/send-otp", sendOTP);

// Verify OTP
router.post("/verify-otp", verifyOTP);

// Resend OTP
router.post("/resend-otp", resendOTP);

// Check email verification status
router.get("/check/:email", checkEmailVerification);

export default router; 