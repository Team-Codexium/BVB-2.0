import React from 'react'
import {Mic} from 'lucide-react'
const Footer = () => {
  return (
    <div className='mt-4'>
          <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Mic className="w-6 h-6 text-red-500" />
                <span className="text-xl font-bold text-red-400">BarsvsBars</span>
              </div>
              <p className="text-gray-400">
                The ultimate platform for rap battles and hip-hop culture.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-red-400 mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-red-400 transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Rules</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Prizes</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-red-400 mb-4">Community</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-red-400 transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Instagram</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-red-400 mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-red-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-red-800/30 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BarsvsBars. All rights reserved.</p>
          </div>
        </div>
    </div>
  )
}

export default Footer