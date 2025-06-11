import React from 'react'
import { Features, Footer, Header, Hero } from '../components'

const Home = () => {
  return (
    <div className='bg-custom-gradient min-h-screen'>
        <Header />
        <Hero />
        <Features />
        <Footer />
    </div>
  )
}

export default Home