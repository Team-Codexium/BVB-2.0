import React from 'react'
import Header from '../components/ui/header'
import Hero from '../components/ui/Hero'
import Footer from '../components/ui/Footer'
import Features from '../components/ui/Features'

const Home = () => {
  return (
    <div className='bg-custom-gradient min-h-screen'>
        <Header/>
        <Hero/>
        <Features/>
        <Footer/>
    </div>
  )
}

export default Home