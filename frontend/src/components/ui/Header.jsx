import React from 'react'
import Logo from './Logo'
import { Button } from "@/components/ui/button"
const Header = () => {
  return (
    <div className='flex items-center gap-2 bg-brown-800 text-white p-4 justify-between'>
        <Logo/>
        <div className='flex gap-2'>
            <Button className='bg-brand'>Login</Button>
            <Button className='bg-brand'>Signup</Button>
        </div>
    </div>
  )
}

export default Header