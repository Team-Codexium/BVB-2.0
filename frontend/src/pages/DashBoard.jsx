import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Welcome from './Welcome'
import Artists from './Artists'
import CreateBattle from './ExploreBattles'

const DashBoard = () => {
  return (
    <div>
        <Navbar />
      <Routes>
        <Route path="/"element={<Welcome />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/explore-battle" element={<CreateBattle />} />
      </Routes>
    </div>
  )
}

export default DashBoard