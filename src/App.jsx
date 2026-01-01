import React from 'react'
import Home from './Pages/Home/Home'
import Navbar from './components/Navbar'
import Spray from './Pages/Spray/Spray'
import Rudraksh from './Pages/Rudraksh/Rudraksh'
import Rashi from './Pages/Rashi/Rashi'
import ProductPage from './Pages/ProductPage/ProductPage'
import Cart from './Pages/Cart/Cart'
import { ToastProvider } from './components/Toaster'
import { CartProvider } from './context/CartContext'
import { Routes, Route, Navigate } from "react-router-dom";


const App = () => {
  return (
    <ToastProvider>
      <CartProvider>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sprays" element={<Spray />} />
          <Route path="/rudraksha" element={<Rudraksh />} />
          <Route path="/rashi" element={<Rashi />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </CartProvider>
    </ToastProvider>
  )
}

export default App