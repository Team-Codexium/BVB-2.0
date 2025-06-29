import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import EmailVerification from '../components/EmailVerification';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Mail, ArrowLeft } from "lucide-react";
import { useAuth } from '../contexts/AuthContext';

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { sendOTP } = useAuth();
  
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [step, setStep] = useState(email ? 'verification' : 'email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle email submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await sendOTP(email);
      if (result.success) {
        setSuccess('Verification code sent! Check your email.');
        setStep('verification');
      }
    } catch (err) {
      setError(err.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  // Handle verification success
  const handleVerificationSuccess = () => {
    setSuccess('Email verified successfully! You can now register.');
    setTimeout(() => {
      navigate('/register', { state: { verifiedEmail: email } });
    }, 2000);
  };

  // Handle back from verification
  const handleBackFromVerification = () => {
    setStep('email');
    setEmail('');
  };

  // If we have an email and are in verification step, show EmailVerification component
  if (step === 'verification' && email) {
    return (
      <EmailVerification
        email={email}
        onVerificationSuccess={handleVerificationSuccess}
        onBack={handleBackFromVerification}
      />
    );
  }

  return (
    <div className="flex min-h-[40rem] items-center justify-center">
      <Card className="w-[400px] bg-primary/80 border border-secondary text-white">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl">Email Verification</CardTitle>
          <p className="text-gray-300 text-sm mt-2">
            Enter your email address to receive a verification code
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
              <AlertDescription className="text-green-500">{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-secondary bg-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            <Button 
              type="submit"
              disabled={loading || !email}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Verification Code'}
            </Button>
          </form>

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/register')}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Registration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerificationPage; 