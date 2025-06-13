import React from 'react'
import { Link } from "react-router-dom"
import Logo from './Logo'
import { Button } from "@/components/ui/button"
const Header = () => {
  return (
    <div className='flex items-center gap-2 bg-brown-800 text-white p-4 justify-between'>
        <Logo/>
        <div className='flex gap-2'>
            <Link to="/login" ><Button className='bg-brand'>Login</Button></Link> 
            <Link to="/register"> <Button className='bg-brand'>Signup</Button></Link>
        </div>
    </div>
  )
}

export default Header