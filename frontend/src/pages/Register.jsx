import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from '../contexts/AuthContext'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Mail, Send } from "lucide-react"
import EmailVerification from '../components/EmailVerification'
import axios from 'axios'

export default function Register() {
  const navigate = useNavigate();
  const { register, error, validationErrors, clearErrors } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: ''
  })

  const [step, setStep] = useState('form'); // 'form' or 'verification'
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');

  const API_URL = 'http://localhost:4000';

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await register(formData)
      navigate('/dashboard')
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleChange = (e) => {
    clearErrors(); // Clear errors when user starts typing
    setEmailError(''); // Clear email errors
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    })
  }

  // Send OTP for email verification
  const handleSendOTP = async () => {
    if (!formData.email) {
      setEmailError('Please enter your email address');
      return;
    }

    setEmailLoading(true);
    setEmailError('');
    setEmailSuccess('');

    try {
      const response = await axios.post(`${API_URL}/api/email-verification/send-otp`, {
        email: formData.email
      });

      if (response.data.success) {
        setEmailSuccess('Verification code sent! Check your email.');
        setStep('verification');
      }
    } catch (err) {
      setEmailError(err.response?.data?.message || 'Failed to send verification code');
    } finally {
      setEmailLoading(false);
    }
  };

  // Handle verification success
  const handleVerificationSuccess = () => {
    setStep('form');
    setEmailSuccess('Email verified successfully! You can now complete registration.');
  };

  // Handle back from verification
  const handleBackFromVerification = () => {
    setStep('form');
  };

  // Helper function to render field error
  const renderFieldError = (fieldName) => {
    if (validationErrors[fieldName]) {
      return (
        <p className="text-sm text-red-500 mt-1">
          {validationErrors[fieldName]}
        </p>
      );
    }
    return null;
  };

  // If we're in verification step, show EmailVerification component
  if (step === 'verification') {
    return (
      <EmailVerification
        email={formData.email}
        onVerificationSuccess={handleVerificationSuccess}
        onBack={handleBackFromVerification}
      />
    );
  }

  return (
    <div className="flex bg- min-h-[40rem] items-center justify-center">
      <Card className="w-[400px] bg-primary/80 border border-secondary text-white">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Register</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {emailError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{emailError}</AlertDescription>
            </Alert>
          )}

          {emailSuccess && (
            <Alert className="mb-4 border-green-500 bg-green-500/10">
              <AlertDescription className="text-green-500">{emailSuccess}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className={`border-secondary ${validationErrors.username ? 'border-red-500' : ''}`}
                required
              />
              {renderFieldError('username')}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                className={`border-secondary ${validationErrors.fullName ? 'border-red-500' : ''}`}
                required
              />
              {renderFieldError('fullName')}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`border-secondary flex-1 ${validationErrors.email ? 'border-red-500' : ''}`}
                  required
                />
                <Button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={emailLoading || !formData.email}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                  {emailLoading ? (
                    'Sending...'
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-1" />
                      Verify
                    </>
                  )}
                </Button>
              </div>
              {renderFieldError('email')}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`border-secondary ${validationErrors.password ? 'border-red-500' : ''}`}
                required
              />
              {renderFieldError('password')}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary cursor-pointer hover:bg-primary/90"
            >
              Register
            </Button>
          </form>

          <p className="mt-4 text-center">
            Already have an account? <Link className='text-red-600 hover:text-red-500' to="/login">Log in</Link>
          </p>
          
          <div className="text-center mt-2">
            <Link 
              to="/email-verification" 
              className='text-blue-400 hover:text-blue-300 text-sm'
            >
              Verify email separately
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}