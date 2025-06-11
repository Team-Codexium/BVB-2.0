import React from 'react'
import {Button} from "@/components/ui/button"
const Hero = () => {
  return (
    <div  >
        <div id="hero" className=' text-white p-8 text-center'>
            <h1 className='text-7xl font-bold mb-4'>BarsVsBars</h1>
            <p className='text-lg mb-6'>The Ultimate Rap Battle Platform Where Legends Are Born</p>
            <p>Challenge rappers worldwide, upload your fire tracks, and let the community decide who's got the sickest bars!
            </p>
            <div>
                <Button className='bg-brand mt-6'>Start Battle</Button>
                <Button className='bg-brand  mt-6 ml-4'>Watch Battle</Button>
            </div>
            
        </div>
        </div>
  )
}

export default Hero