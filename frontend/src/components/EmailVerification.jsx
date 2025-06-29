import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Mail, Clock, CheckCircle } from "lucide-react";
import axios from 'axios';

const EmailVerification = ({ email, onVerificationSuccess, onBack }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const API_URL = 'http://localhost:4000';

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/api/email-verification/verify-otp`, {
        email,
        otp: otpString
      });

      if (response.data.success) {
        setSuccess('Email verified successfully!');
        setTimeout(() => {
          onVerificationSuccess();
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setResendLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/api/email-verification/resend-otp`, {
        email
      });

      if (response.data.success) {
        setSuccess('New verification code sent!');
        setCountdown(60); // 60 seconds countdown
        setOtp(['', '', '', '', '', '']); // Clear OTP inputs
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex min-h-[40rem] items-center justify-center">
      <Card className="w-[400px] bg-primary/80 border border-secondary text-white">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <p className="text-gray-300 text-sm mt-2">
            We've sent a 6-digit code to <span className="font-semibold">{email}</span>
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 border-green-500 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-500">{success}</AlertDescription>
            </Alert>
          )}

          {/* OTP Input */}
          <div className="space-y-4">
            <Label className="text-center block">Enter the 6-digit code</Label>
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-semibold border-secondary bg-transparent"
                  autoFocus={index === 0}
                />
              ))}
            </div>
          </div>

          {/* Verify Button */}
          <Button 
            onClick={handleVerifyOTP}
            disabled={loading || otp.join('').length !== 6}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </Button>

          {/* Resend Section */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-400">
              Didn't receive the code?
            </p>
            <Button
              variant="ghost"
              onClick={handleResendOTP}
              disabled={resendLoading || countdown > 0}
              className="text-red-400 hover:text-red-300 disabled:opacity-50"
            >
              {resendLoading ? (
                'Sending...'
              ) : countdown > 0 ? (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Resend in {countdown}s
                </span>
              ) : (
                'Resend Code'
              )}
            </Button>
          </div>

          {/* Back Button */}
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-gray-400 hover:text-white"
            >
              ← Back to Registration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification; 