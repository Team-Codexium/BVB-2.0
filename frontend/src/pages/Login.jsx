import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // const response = await fetch('http://localhost:4000/api/v1/rappers/register', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(formData)
      // })
      // const data = await response.json()
      // console.log(data)
      console.log(formData)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="flex min-h-[40rem] items-center justify-center">
      <Card className="w-[350px] bg- text-white">
        <CardHeader>
          <CardTitle className="text-2xl text- text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="border-secondary"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="border-secondary"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-primary cursor-pointer  hover:bg-primary/90">
              Register
            </Button>
          </form>

          <p>New here?<Link className='text-red-600' to="/register"> Register</Link></p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login