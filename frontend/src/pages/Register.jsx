import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from '../contexts/AuthContext'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function Register() {
  const navigate = useNavigate();
  const { register, error, validationErrors, clearErrors } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    isRapper: false,
  })

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
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    })
  }

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

  return (
    <div className="flex min-h-[40rem] items-center justify-center">
      <Card className="w-[350px] bg- text-white">
        <CardHeader>
          <CardTitle className="text-2xl text- text-center">Register</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
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
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`border-secondary ${validationErrors.email ? 'border-red-500' : ''}`}
                required
              />
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

            <div className="space-y-2 flex justify-start items-center">
              <Input
                id="isRapper"
                name="isRapper"
                type="checkbox"
                checked={formData.isRapper}
                onChange={handleChange}
                className="border-secondary w-5"
              />
              <Label className="ml-2 mb-2" htmlFor="isRapper">Register as Rapper</Label>
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
        </CardContent>
      </Card>
    </div>
  )
}