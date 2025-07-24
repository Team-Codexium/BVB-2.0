import React, { useState } from 'react'
import { Link } from "react-router-dom"
import Logo from './Logo'
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

const navLinks = [
  { name: "Login", to: "/login" },
  { name: "Signup", to: "/register" }
]

const Header = () => {
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-gradient-to-r from-purple-900 via-black to-pink-900 px-6 py-4 shadow-lg border-b-4 border-yellow-400 w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <Logo />
          <span className="font-orbitron text-yellow-400 text-2xl font-bold tracking-wide">BarsVsBars</span>
        </Link>
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4">
          {navLinks.map(link => (
            <Link key={link.name} to={link.to}>
              <Button className="font-orbitron bg-gray-900 text-yellow-400 border-2 border-yellow-400 px-6 py-2 font-bold shadow hover:bg-yellow-400 hover:text-black transition-all duration-200 rounded-lg">
                {link.name}
              </Button>
            </Link>
          ))}
        </nav>
        {/* Burger Icon */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded-lg focus:outline-none transition hover:bg-yellow-400/10"
          onClick={() => setOpen(!open)}
          aria-label="Open menu"
        >
          {open ? <X className="w-8 h-8 text-yellow-400" /> : <Menu className="w-8 h-8 text-yellow-400" />}
        </button>
      </div>
      {/* Mobile Menu */}
      {open && (
        <div
          className="fixed top-20 left-1/2 -translate-x-1/2 w-[95vw] max-w-md bg-gradient-to-br from-purple-900 via-black to-pink-900 rounded-3xl shadow-2xl z-40 border-4 border-yellow-400 p-8 flex flex-col items-center gap-8"
          style={{ backdropFilter: 'blur(8px)' }}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-lg focus:outline-none"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-8 h-8 text-yellow-400" />
          </button>
          <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-3 mb-4">
            <Logo />
            <span className="font-orbitron text-yellow-400 text-2xl font-bold tracking-wide glitch">BarsVsBars</span>
          </Link>
          {navLinks.map(link => (
            <Link key={link.name} to={link.to} onClick={() => setOpen(false)}>
              <Button className="font-orbitron bg-gray-900 text-yellow-400 border-2 border-yellow-400 px-8 py-3 text-lg font-bold shadow-lg hover:bg-yellow-400 hover:text-black transition-all duration-200 rounded-xl glitch">
                {link.name}
              </Button>
            </Link>
          ))}
        </div>
      )}
      <style>
        {`
          .font-orbitron {
            font-family: 'Orbitron', 'Roboto Mono', monospace;
            letter-spacing: 2px;
            text-transform: uppercase;
          }
          .glitch {
            animation: glitch 1.5s infinite linear alternate-reverse;
            position: relative;
            color: transparent;
            background: linear-gradient(90deg,#facc15,#f472b6,#a78bfa);
            background-clip: text;
            -webkit-background-clip: text;
            text-shadow: 0 0 8px #facc15, 0 0 2px #fff;
          }
          @keyframes glitch {
            0% { text-shadow: 2px 0 #facc15, -2px 0 #f472b6; }
            20% { text-shadow: -2px 2px #a78bfa, 2px -2px #fff; }
            40% { text-shadow: 2px 2px #facc15, -2px -2px #f472b6; }
            60% { text-shadow: -2px 0 #a78bfa, 2px 0 #fff; }
            80% { text-shadow: 2px -2px #facc15, -2px 2px #f472b6; }
            100% { text-shadow: 0 0 8px #facc15, 0 0 2px #fff; }
          }
        `}
      </style>
    </header>
  )
}

export default Header