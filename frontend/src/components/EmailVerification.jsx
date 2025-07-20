import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Mail, Clock, Mic, Music } from "lucide-react"
import PopupMessage from "@/components/PopupMessage"
import axios from 'axios'

const EmailVerification = ({ email, onVerificationSuccess, onBack }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [popup, setPopup] = useState({ show: false, message: "", type: "info" })

  const API_URL = 'http://localhost:4000'

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  useEffect(() => {
    if (error) setPopup({ show: true, message: error, type: "failure" })
    if (success) setPopup({ show: true, message: success, type: "success" })
  }, [error, success])

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handleVerifyOTP = async () => {
    const otpString = otp.join('')
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit code')
      return
    }
    setLoading(true)
    setError('')
    try {
      const response = await axios.post(`${API_URL}/api/email-verification/verify-otp`, {
        email,
        otp: otpString
      })
      if (response.data.success) {
        setSuccess('Email verified successfully!')
        setTimeout(() => {
          onVerificationSuccess()
        }, 1500)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setResendLoading(true)
    setError('')
    try {
      const response = await axios.post(`${API_URL}/api/email-verification/resend-otp`, {
        email
      })
      if (response.data.success) {
        setSuccess('New verification code sent!')
        setCountdown(60)
        setOtp(['', '', '', '', '', ''])
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-pink-900 relative overflow-hidden">
      {/* Blurred neon shapes */}
      <div className="absolute top-[-80px] left-[-120px] w-[300px] h-[300px] bg-pink-600 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-[-60px] right-0 w-[200px] h-[200px] bg-yellow-400 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute top-[40%] left-[60%] w-[120px] h-[120px] bg-purple-600 rounded-full blur-2xl opacity-20"></div>

      {/* Floating mic icon above card */}
      <div className="absolute top-[8%] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        <Mic className="w-14 h-14 text-yellow-400 drop-shadow-lg animate-bounce" />
        <span className="font-orbitron text-yellow-400 text-lg mt-2 tracking-widest">Verify Your Bars</span>
      </div>

      {/* PopupMessage for error/success */}
      {popup.show && (
        <PopupMessage
          message={popup.message}
          type={popup.type}
          onClose={() => {
            setPopup({ ...popup, show: false })
            setError('')
            setSuccess('')
          }}
        />
      )}

      <div className="w-full max-w-md z-10">
        <Card className="bg-black/60 rounded-3xl shadow-2xl border-2 border-yellow-400 px-8 py-10 text-white">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
              <Mail className="w-8 h-8 text-pink-600" />
            </div>
            <CardTitle className="text-3xl font-orbitron glitch mb-2">Email Verification</CardTitle>
            <div className="text-pink-400 font-orbitron text-sm uppercase tracking-widest text-center mb-2">
              Enter the 6-digit code sent to <span className="font-semibold text-yellow-300">{email}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* OTP Input */}
            <div className="space-y-4">
              <Label className="text-center block font-orbitron text-yellow-400">Enter the 6-digit code</Label>
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-orbitron font-bold border-2 border-purple-700 focus:border-yellow-400 bg-gray-900 text-yellow-400 rounded-xl transition-all"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>

            {/* Verify Button */}
            <Button
              onClick={handleVerifyOTP}
              disabled={loading || otp.join('').length !== 6}
              className="w-full font-orbitron bg-yellow-400 text-black border-2 border-yellow-400 px-8 py-3 text-lg font-bold shadow-lg hover:bg-yellow-500 hover:text-black transition-all duration-200"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </Button>

            {/* Resend Section */}
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-400 font-orbitron">
                Didn't receive the code?
              </p>
              <Button
                variant="ghost"
                onClick={handleResendOTP}
                disabled={resendLoading || countdown > 0}
                className="font-orbitron text-yellow-400 hover:text-pink-400 disabled:opacity-50"
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
                className="font-orbitron text-gray-400 hover:text-yellow-400"
              >
                ← Back to Registration
              </Button>
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

export default EmailVerification