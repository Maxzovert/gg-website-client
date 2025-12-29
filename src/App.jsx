import React from 'react'
import Home from './Pages/Home/Home'
import Navbar from './components/Navbar'
import Spray from './Pages/Spray/Spray'
import Rudraksh from './Pages/Rudraksh/Rudraksh'
import { Routes, Route, Navigate } from "react-router-dom";


const App = () => {
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sprays" element={<Spray />} />
        <Route path="/rudraksha" element={<Rudraksh />} />
      </Routes>
    </>
  )
}

export default App