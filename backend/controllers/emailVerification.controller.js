import { EmailVerification } from '../models/emailVerification.model.js';
import { sendEmail } from '../utils/sendEmail.js';

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP to email
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Set expiration time (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Check if email verification already exists
    let emailVerification = await EmailVerification.findOne({ email });

    if (emailVerification) {
      // Update existing record
      emailVerification.otp = otp;
      emailVerification.expiresAt = expiresAt;
      emailVerification.verified = false;
      await emailVerification.save();
    } else {
      // Create new record
      emailVerification = await EmailVerification.create({
        email,
        otp,
        expiresAt
      });
    }

    // Send email with OTP
    const subject = 'Email Verification - BarsVsBars';
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626; text-align: center;">🎤 BarsVsBars Email Verification</h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 15px 0; font-size: 16px;">Hello!</p>
          <p style="margin: 0 0 15px 0; font-size: 16px;">Your verification code is:</p>
          <div style="background-color: #dc2626; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p style="margin: 0 0 15px 0; font-size: 14px; color: #666;">This code will expire in 10 minutes.</p>
          <p style="margin: 0; font-size: 14px; color: #666;">If you didn't request this code, please ignore this email.</p>
        </div>
        <p style="text-align: center; color: #666; font-size: 12px;">
          🎤 Stay lyrical,<br>BarsVsBars Team
        </p>
      </div>
    `;

    const emailResult = await sendEmail(email, subject, htmlContent);

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Verification code sent successfully',
      email: email
    });

  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while sending OTP'
    });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Find email verification record
    const emailVerification = await EmailVerification.findOne({ email });

    if (!emailVerification) {
      return res.status(404).json({
        success: false,
        message: 'No verification record found for this email'
      });
    }

    // Check if OTP is expired
    if (new Date() > emailVerification.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Check if OTP matches
    if (emailVerification.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Mark as verified
    emailVerification.verified = true;
    await emailVerification.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while verifying OTP'
    });
  }
};

// Resend OTP
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if email verification exists
    const emailVerification = await EmailVerification.findOne({ email });

    if (!emailVerification) {
      return res.status(404).json({
        success: false,
        message: 'No verification record found for this email'
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Update record
    emailVerification.otp = otp;
    emailVerification.expiresAt = expiresAt;
    emailVerification.verified = false;
    await emailVerification.save();

    // Send new email
    const subject = 'New Verification Code - BarsVsBars';
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626; text-align: center;">🎤 BarsVsBars New Verification Code</h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 15px 0; font-size: 16px;">Hello!</p>
          <p style="margin: 0 0 15px 0; font-size: 16px;">Your new verification code is:</p>
          <div style="background-color: #dc2626; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p style="margin: 0 0 15px 0; font-size: 14px; color: #666;">This code will expire in 10 minutes.</p>
          <p style="margin: 0; font-size: 14px; color: #666;">If you didn't request this code, please ignore this email.</p>
        </div>
        <p style="text-align: center; color: #666; font-size: 12px;">
          🎤 Stay lyrical,<br>BarsVsBars Team
        </p>
      </div>
    `;

    const emailResult = await sendEmail(email, subject, htmlContent);

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send new verification email'
      });
    }

    res.status(200).json({
      success: true,
      message: 'New verification code sent successfully'
    });

  } catch (error) {
    console.error('Error resending OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while resending OTP'
    });
  }
};

// Check if email is verified
export const checkEmailVerification = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const emailVerification = await EmailVerification.findOne({ email });

    if (!emailVerification) {
      return res.status(404).json({
        success: false,
        message: 'No verification record found for this email'
      });
    }

    res.status(200).json({
      success: true,
      verified: emailVerification.verified,
      expiresAt: emailVerification.expiresAt
    });

  } catch (error) {
    console.error('Error checking email verification:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while checking email verification'
    });
  }
}; 