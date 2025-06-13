import React from "react"
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";


const App = () => {
  return (
    <div classname="bg-custom-gradient">
      <Routes>
        <Route path="/*" element={<Home />} />
        {/* <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} /> */}
     
      
    </Routes>
    </div>
  )
}

export default App;