import React from 'react'
import {Button} from "@/components/ui/button"
import { Target, Music, Vote ,Mic} from 'lucide-react';
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
        {/* features section */}
         <div id='how-it-works' className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-red-600">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className='bg-black p-10'>
              <div className="w-16 h-16 ">
                <Target className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-red-600">Challenge</h3>
              <p className="text-gray-300">
                Challenge any rapper on the platform. Send your battle request and wait for them to accept your challenge.
              </p>
            </div>

            <div className='bg-black p-10'>
              <div className="w-16 h-16 text-red-600">
                <Music className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-red-600">Battle</h3>
              <p className="text-gray-300">
                Once accepted, both rappers upload their audio tracks. Show your skills and drop your hottest bars!
              </p>
            </div>

            <div className='bg-black p-10'>
              <div className="w-16 h-16 text-red-600">
                <Vote className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-red-600">Vote</h3>
              <p className="text-gray-300">
                The community votes for the best track. Most votes wins the battle and climbs the leaderboard!
              </p>
            </div>
          </div>
        </div>
        {/* end of features section */}
        {/* Live battles section*/}
        <div>

        </div>
        {/* end of live battles section */}
        {/* Top Rappers*/}
        <div>

        </div>
        {/* end of top rappers section */}

        {/* stats */}
        <div>

        </div>
        {/* end of stats section */}

        {/* Footer */}
        <div>
             <footer className="bg-black py-12 px-6">
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
      </footer>
        </div>
        {/* end of footer section */}
        </div>
  )
}

export default Hero