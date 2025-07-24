import React from 'react'
import { Mic } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-purple-900 via-black to-pink-900 py-10 rounded-t-3xl shadow-2xl border-t-4 border-yellow-400">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Logo & About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Mic className="w-7 h-7 text-yellow-400" />
              <span className="text-2xl font-orbitron font-bold text-yellow-400 tracking-wide">BarsVsBars</span>
            </div>
            <p className="text-gray-300 text-base">
              The ultimate platform for rap battles and hip-hop culture. Step into the arena, drop your bars, and let the crowd decide your fate.
            </p>
          </div>
          {/* Platform */}
          <div>
            <h3 className="text-lg font-bold text-pink-400 mb-4 font-orbitron">Platform</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-yellow-400 transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Rules</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Prizes</a></li>
            </ul>
          </div>
          {/* Community */}
          <div>
            <h3 className="text-lg font-bold text-purple-400 mb-4 font-orbitron">Community</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Discord</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Instagram</a></li>
            </ul>
          </div>
          {/* Support */}
          <div>
            <h3 className="text-lg font-bold text-yellow-400 mb-4 font-orbitron">Support</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-pink-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-yellow-400/30 mt-10 pt-6 text-center">
          <p className="text-gray-400 font-orbitron tracking-wider text-base">&copy; 2024 BarsVsBars. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer