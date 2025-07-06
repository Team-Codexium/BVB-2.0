import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Welcome from './Welcome'
import Artists from './Artists'
import CreateBattle from './ExploreBattles'
import BattleDetails from './BattleDetails'
import { AppSidebar } from '../components/AppSidebar'
import { SidebarProvider } from "../components/ui/sidebar"


const DashBoard = () => {
  return (
    <div>
      {/* <AppSidebar /> */}
     
        <Navbar />
   
        
      <Routes>
       
        <Route path="/"element={<Welcome />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/explore-battle" element={<CreateBattle />} />
        <Route path="/battle/:battleId" element={<BattleDetails />} />
      </Routes>
    </div>
  )
}

export default DashBoard