import React from 'react'
import { Target, Music, Vote } from 'lucide-react'

const Features = () => {
  return (
    <div id='how-it-works' className="container mx-auto mb-2">
          <h2 className="text-4xl font-bold text-center mb-12 text-red-600">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className='bg-primary p-5 rounded-2xl'>
              <div className="w-16 h-16 ">
                <Target className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-red-600">Challenge</h3>
              <p className="text-gray-300">
                Challenge any rapper on the platform. Send your battle request and wait for them to accept your challenge.
              </p>
            </div>

            <div className='bg-primary p-10'>
              <div className="w-16 h-16 text-red-600">
                <Music className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-red-600">Battle</h3>
              <p className="text-gray-300">
                Once accepted, both rappers upload their audio tracks. Show your skills and drop your hottest bars!
              </p>
            </div>

            <div className='bg-primary p-10'>
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
  )
}

export default Features