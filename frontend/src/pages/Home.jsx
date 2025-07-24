import React from 'react'
import { Features, Footer, Header, Hero } from '../components'
import { Routes, Route, Navigate } from 'react-router-dom'
import Register from './Register'
import Login from './Login'
import EmailVerificationPage from './EmailVerificationPage'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Flame, ArrowRight, Upload, Users, Vote } from "lucide-react"

const trendingBattles = [
  {
    id: "1",
    title: "Ultimate Showdown",
    rapper1: "MC Blaze",
    rapper2: "Rhythm King",
    votes1: 120,
    votes2: 98,
    status: "active"
  },
  {
    id: "2",
    title: "Night of Bars",
    rapper1: "Lyric Queen",
    rapper2: "Verse Lord",
    votes1: 87,
    votes2: 102,
    status: "active"
  }
]

const Home = () => {
  const {user} = useAuth();
  return (
    <div className='bg-gradient-to-br from-purple-900 via-black to-pink-900 min-h-screen overflow-hidden relative'>
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 0.25, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-[-80px] left-[-120px] w-[400px] h-[400px] bg-pink-600 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 0.18, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute bottom-[-60px] right-0 w-[280px] h-[280px] bg-yellow-400 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.8 }}
        className="absolute top-[40%] left-[40%] w-[180px] h-[180px] bg-purple-600 rounded-full blur-2xl"
      />
      <Header />
      <Routes>
        <Route path='/' element={
          <>
            <Hero />

            {/* Trending Battles */}
            <section className="max-w-5xl mx-auto mt-12 px-4">
              <h2 className="text-3xl font-bold text-yellow-400 mb-6 flex items-center gap-2 font-orbitron">
                <Flame className="w-6 h-6 text-pink-400" />
                Trending Battles
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {trendingBattles.map(battle => (
                  <div key={battle.id} className="bg-black/40 rounded-2xl p-6 shadow-lg border border-purple-900/40 flex flex-col gap-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-bold text-white">{battle.title}</span>
                      <span className="px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 text-xs font-bold uppercase">{battle.status}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-col items-center">
                        <span className="text-purple-300 font-semibold">{battle.rapper1}</span>
                        <span className="text-2xl font-bold text-purple-400">{battle.votes1}</span>
                      </div>
                      <span className="text-gray-400 font-bold text-xl">VS</span>
                      <div className="flex flex-col items-center">
                        <span className="text-pink-300 font-semibold">{battle.rapper2}</span>
                        <span className="text-2xl font-bold text-pink-400">{battle.votes2}</span>
                      </div>
                    </div>
                    <Button className="mt-4 w-full bg-yellow-400 text-black font-orbitron font-bold hover:bg-yellow-500 transition-all">
                      Vote Now <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-5xl mx-auto mt-16 px-4 text-center">
              <div className="bg-black/40 rounded-2xl py-10 px-6 shadow-lg border border-yellow-400/30">
                <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-4 font-orbitron">
                  Ready to Drop Your Bars?
                </h2>
                <p className="text-lg text-gray-200 mb-8">
                  Join the hottest rap battle platform. Upload your tracks, challenge the best, and let the crowd decide your fate!
                </p>
                <div className="flex flex-col md:flex-row gap-6 justify-center">
                  <Button className="font-orbitron bg-gray-900 text-yellow-400 border-2 border-yellow-400 px-8 py-3 text-lg font-bold shadow-lg hover:bg-yellow-400 hover:text-black transition-all duration-200">
                    Explore Battles
                  </Button>
                  <Button className="font-orbitron bg-gray-900 text-yellow-400 border-2 border-yellow-400 px-8 py-3 text-lg font-bold shadow-lg hover:bg-yellow-400 hover:text-black transition-all duration-200">
                    Join Now
                  </Button>
                </div>
              </div>
            </section>

            {/* How It Works Section */}
            <section className="max-w-5xl mx-auto mt-16 px-4 mb-10">
              <h2 className="text-3xl font-bold text-yellow-400 mb-8 font-orbitron text-center">How It Works</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-black/40 rounded-xl p-6 flex flex-col items-center border border-purple-900/30">
                  <Upload className="w-10 h-10 text-yellow-400 mb-2" />
                  <span className="text-lg font-bold text-white mb-1 font-orbitron">Upload</span>
                  <span className="text-gray-300 text-center">Drop your hottest tracks and enter the arena.</span>
                </div>
                <div className="bg-black/40 rounded-xl p-6 flex flex-col items-center border border-purple-900/30">
                  <Users className="w-10 h-10 text-pink-400 mb-2" />
                  <span className="text-lg font-bold text-white mb-1 font-orbitron">Battle</span>
                  <span className="text-gray-300 text-center">Challenge rivals and face off in epic rap battles.</span>
                </div>
                <div className="bg-black/40 rounded-xl p-6 flex flex-col items-center border border-purple-900/30">
                  <Vote className="w-10 h-10 text-purple-400 mb-2" />
                  <span className="text-lg font-bold text-white mb-1 font-orbitron">Vote</span>
                  <span className="text-gray-300 text-center">Let the crowd decide who reigns supreme.</span>
                </div>
                <div className="bg-black/40 rounded-xl p-6 flex flex-col items-center border border-purple-900/30">
                  <Flame className="w-10 h-10 text-yellow-400 mb-2" />
                  <span className="text-lg font-bold text-white mb-1 font-orbitron">Win</span>
                  <span className="text-gray-300 text-center">Claim your crown and rise on the leaderboard.</span>
                </div>
              </div>
            </section>
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