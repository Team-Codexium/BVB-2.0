import React from 'react'
import { Features, Footer, Header, Hero } from '../components'
import { Routes, Route } from 'react-router-dom'
import Register from './Register'
import Login from './Login'

const Home = () => {
  return (
    <div className='bg-custom-gradient min-h-screen'>
        <Header />
        <Routes>
          <Route path='/' element={
            <>
              <Hero />
              <Features />
            </>
          } />
          
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
        </Routes>
        <Footer />
    </div>
  )
}

export default Home