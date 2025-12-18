import React from 'react'
import Home from './Pages/Home/Home'
import Navbar from './components/Navbar'
import { Routes, Route, Navigate } from "react-router-dom";


const App = () => {
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  )
}

export default App