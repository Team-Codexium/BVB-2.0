import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from '../contexts/AuthContext'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const Login = () => {
  const navigate = useNavigate();
  const { login, error, validationErrors, clearErrors } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(formData.email, formData.password)
      navigate('/dashboard');
    } catch (err) {
      // Error is already handled by the context
      console.log(err);
    }
  }

  const handleChange = (e) => {
    clearErrors(); // Clear errors when user starts typing
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
          <CardTitle className="text-2xl text- text-center">Login</CardTitle>
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

            <Button 
              type="submit" 
              className="w-full bg-primary cursor-pointer hover:bg-primary/90"
            >
              Login
            </Button>
          </form>

          <p className="mt-4 text-center">
            New here? <Link className='text-red-600 hover:text-red-500' to="/register">Register</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login