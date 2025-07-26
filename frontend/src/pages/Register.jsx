import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from '../contexts/AuthContext'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Mail, Mic, Music } from "lucide-react"
import EmailVerification from '../components/EmailVerification'
import axios from 'axios'
import PopupMessage from "@/components/PopupMessage"

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
  const [popup, setPopup] = useState({ show: false, message: "", type: "info" })

  const API_URL = 'http://localhost:4000';

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await register(formData)
      navigate('/')
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleChange = (e) => {
    clearErrors();
    setEmailError('');
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    })
  }

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

  const handleVerificationSuccess = () => {
    setStep('form');
    setEmailSuccess('Email verified successfully! You can now complete registration.');
  };

  const handleBackFromVerification = () => {
    setStep('form');
  };

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

  useEffect(() => {
    if (error) setPopup({ show: true, message: error, type: "failure" })
    if (emailError) setPopup({ show: true, message: emailError, type: "failure" })
    if (emailSuccess) setPopup({ show: true, message: emailSuccess, type: "success" })
  }, [error, emailError, emailSuccess])

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-pink-900 relative overflow-hidden">
      {/* Blurred neon shapes */}
      <div className="absolute top-[-80px] left-[-120px] w-[300px] h-[300px] bg-pink-600 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-[-60px] right-0 w-[200px] h-[200px] bg-yellow-400 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute top-[40%] left-[60%] w-[120px] h-[120px] bg-purple-600 rounded-full blur-2xl opacity-20"></div>

      {/* Floating mic icon above card */}
      {/* <div className="absolute top-[8%] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        <Mic className="w-14 h-14 text-yellow-400 drop-shadow-lg animate-bounce" />
        <span className="font-orbitron text-yellow-400 text-lg mt-2 tracking-widest">Drop Your Bars</span>
      </div> */}

      <div className="w-full max-w-md z-10">
        <Card className="bg-black/60 rounded-3xl shadow-2xl border-2 border-yellow-400 px-8 py-8 text-white">
          <CardHeader>
            <CardTitle className="text-3xl text-center font-orbitron glitch mb-2">Register</CardTitle>
            <div className="text-pink-400 font-orbitron text-sm uppercase tracking-widest text-center mb-2">
              Step into the Arena
            </div>
          </CardHeader>
          <CardContent>
            {/* Google Login Button */}
            <Button
              type="button"
              className="w-full mb-4 font-orbitron bg-yellow-400 text-black border-2 border-yellow-400 px-8 py-3 text-lg font-bold shadow-lg flex items-center justify-center gap-2 glitch hover:bg-yellow-500 hover:text-black transition-all duration-200"
              onClick={() => window.open('https://your-google-oauth-url', '_self')}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png" alt="Google" className="w-6 h-6" />
              Login with Google
            </Button>

            {/* {error && (
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
            )} */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="font-orbitron text-yellow-400">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className={`bg-gray-900 border-2 border-purple-700 focus:border-yellow-400 text-white font-orbitron ${validationErrors.username ? 'border-red-500' : ''}`}
                  required
                  autoComplete="username"
                />
                {renderFieldError('username')}
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName" className="font-orbitron text-yellow-400">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`bg-gray-900 border-2 border-purple-700 focus:border-yellow-400 text-white font-orbitron ${validationErrors.fullName ? 'border-red-500' : ''}`}
                  required
                  autoComplete="name"
                />
                {renderFieldError('fullName')}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-orbitron text-yellow-400">Email</Label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`bg-gray-900 border-2 border-purple-700 focus:border-yellow-400 text-white font-orbitron flex-1 ${validationErrors.email ? 'border-red-500' : ''}`}
                    required
                    autoComplete="email"
                  />
                  <Button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={emailLoading || !formData.email}
                    className="bg-yellow-400 text-black font-orbitron font-bold hover:bg-yellow-500 transition-all"
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
                <Label htmlFor="password" className="font-orbitron text-yellow-400">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`bg-gray-900 border-2 border-purple-700 focus:border-yellow-400 text-white font-orbitron ${validationErrors.password ? 'border-red-500' : ''}`}
                  required
                  autoComplete="new-password"
                />
                {renderFieldError('password')}
              </div>
              <Button
                type="submit"
                className="w-full font-orbitron bg-gray-900 text-yellow-400 border-2 border-yellow-400 px-8 py-3 text-lg font-bold shadow-lg hover:bg-yellow-400 hover:text-black transition-all duration-200 mt-4"
              >
                Register
              </Button>
            </form>
            <p className="mt-4 text-center text-gray-300">
              Already have an account? <Link className='text-yellow-400 hover:text-pink-400 font-orbitron' to="/login">Log in</Link>
            </p>
            <div className="text-center mt-2">
              <Link
                to="/email-verification"
                className='text-purple-400 hover:text-yellow-400 text-sm font-orbitron'
              >
                Verify email separately
              </Link>
            </div>
          </CardContent>
        </Card>
        {/* Fun tagline below card */}
        <div className="mt-4 flex flex-col items-center">
          <span className="font-orbitron text-pink-400 text-base tracking-widest text-center">
            Where every rhyme finds its crowd.
          </span>
        </div>
      </div>

      {/* Animated music notes at bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        <Music className="w-6 h-6 text-yellow-400 animate-spin-slow" />
        <Music className="w-6 h-6 text-pink-400 animate-spin-slow" />
        <Music className="w-6 h-6 text-purple-400 animate-spin-slow" />
      </div>

      {popup.show && (
        <PopupMessage
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup({ ...popup, show: false })}
        />
      )}

      <style>
        {`
          .glitch {
            animation: glitch 1.5s infinite linear alternate-reverse;
            position: relative;
            color: transparent;
            background: linear-gradient(90deg,#facc15,#f472b6,#a78bfa);
            background-clip: text;
            -webkit-background-clip: text;
            text-shadow: 0 0 8px #facc15, 0 0 2px #fff;
          }
          @keyframes glitch {
            0% { text-shadow: 2px 0 #facc15, -2px 0 #f472b6; }
            20% { text-shadow: -2px 2px #a78bfa, 2px -2px #fff; }
            40% { text-shadow: 2px 2px #facc15, -2px -2px #f472b6; }
            60% { text-shadow: -2px 0 #a78bfa, 2px 0 #fff; }
            80% { text-shadow: 2px -2px #facc15, -2px 2px #f472b6; }
            100% { text-shadow: 0 0 8px #facc15, 0 0 2px #fff; }
          }
          .font-orbitron {
            font-family: 'Orbitron', 'Roboto Mono', monospace;
            letter-spacing: 2px;
            text-transform: uppercase;
          }
          .animate-spin-slow {
            animation: spin 3s linear infinite;
          }
          @keyframes spin {
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  )
}