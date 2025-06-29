import React from 'react'
import { Features, Footer, Header, Hero } from '../components'
import { Routes, Route, Navigate } from 'react-router-dom'
import Register from './Register'
import Login from './Login'
import EmailVerificationPage from './EmailVerificationPage'
import { useAuth } from '../contexts/AuthContext'

const Home = () => {
  const {user} = useAuth();
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
          
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
          <Route path="/email-verification" element={<EmailVerificationPage />} />
        </Routes>
        <Footer />
    </div>
  )
}

export default Home