import React from 'react'
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

const glitchText = {
  position: "relative",
  color: "transparent",
  background: "linear-gradient(90deg,#facc15,#f472b6,#a78bfa)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  fontFamily: "'Orbitron', 'Roboto Mono', monospace",
  fontWeight: "900",
  fontSize: "clamp(2.2rem, 7vw, 4.5rem)", // Responsive font size
  letterSpacing: "2px",
  textTransform: "uppercase",
  textShadow: "0 0 8px #facc15, 0 0 2px #fff",
  animation: "glitch 1.5s infinite linear alternate-reverse"
}

const Hero = () => {
  return (
    <div className="relative min-h-[70vh] flex flex-col md:flex-row items-center justify-center overflow-hidden px-4 py-8 md:py-0">
      {/* Left: Bigger Image */}
      <motion.div
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="w-full md:w-1/2 flex items-center justify-center z-10 mb-8 md:mb-0"
      >
        <img
          src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80"
          alt="Rap Battle"
          className="rounded-3xl shadow-2xl w-full max-w-[340px] md:max-w-[420px] h-auto md:h-[540px] object-cover border-4 border-yellow-400 bg-black/30"
        />
      </motion.div>

      {/* Right: Text & Buttons */}
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="w-full md:w-1/2 flex flex-col items-center md:items-start justify-center py-4 md:py-8 z-10"
      >
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-yellow-400 font-bold text-base md:text-xl mb-2 font-orbitron tracking-widest uppercase text-center md:text-left"
        >
          Unleash Your Bars. Claim Your Crown.
        </motion.p>
        <h1 style={glitchText} className="mb-4 select-none text-center md:text-left leading-tight">
          BarsVsBars
        </h1>
        <p className="text-base md:text-xl text-gray-200 mb-6 max-w-xl text-center md:text-left font-medium">
          Step into the arena where only the bold survive. Upload your hottest tracks, challenge rivals, and let the crowd decide who reigns supreme.<br />
          <span className="text-yellow-300 font-semibold">Every vote counts. Every bar matters.</span>
          <br />Are you ready to battle for the top spot?
        </p>
        <div className="flex flex-col md:flex-row gap-4 mt-2 w-full md:w-auto justify-center md:justify-start">
          <Button
            className="font-orbitron bg-gray-900 text-yellow-400 border-2 border-yellow-400 px-8 py-3 text-base md:text-lg font-bold shadow-lg hover:bg-yellow-400 hover:text-black transition-all duration-200 w-full md:w-auto"
            style={{ fontFamily: "'Orbitron', 'Roboto Mono', monospace" }}
          >
            Explore Battles
          </Button>
          <Button
            className="font-orbitron bg-gray-900 text-yellow-400 border-2 border-yellow-400 px-8 py-3 text-base md:text-lg font-bold shadow-lg hover:bg-yellow-400 hover:text-black transition-all duration-200 w-full md:w-auto"
            style={{ fontFamily: "'Orbitron', 'Roboto Mono', monospace" }}
          >
            Join Now
          </Button>
        </div>
      </motion.div>

      {/* Glitch keyframes */}
      <style>
        {`
          @keyframes glitch {
            0% { text-shadow: 2px 0 #facc15, -2px 0 #f472b6; }
            20% { text-shadow: -2px 2px #a78bfa, 2px -2px #fff; }
            40% { text-shadow: 2px 2px #facc15, -2px -2px #f472b6; }
            60% { text-shadow: -2px 0 #a78bfa, 2px 0 #fff; }
            80% { text-shadow: 2px -2px #facc15, -2px 2px #f472b6; }
            100% { text-shadow: 0 0 8px #facc15, 0 0 2px #fff; }
          }
          .font-orbitron {
            font-family: 'Orbitron', 'Roboto Mono', monospace;
            letter-spacing: 2px;
            text-transform: uppercase;
          }
        `}
      </style>
    </div>
  )
}

export default Hero