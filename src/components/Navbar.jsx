import React from 'react'
import { FaRegHeart } from "react-icons/fa";
import { CgShoppingBag } from "react-icons/cg";
import logo from '../assets/gglogo.png';
import { LuCircleUserRound } from "react-icons/lu";


const Navbar = () => {

    const  navItems = [
        {
            name: 'Home',
            href: '/',
        },
        {
            name: 'Products',
            href: '/products',
        },
        {
            name: 'Aura Spray',
            href: '/aura-spray',
        },
        {
            name: 'Rashi',
            href: '/rashi',
        },
    ]
    
  return (
    <>
        <header className='bg-[white] shadow-md h-32'>
            <div className='flex items-center justify-evenly h-8 bg-primary'>
                <p>Free Shipping</p>
                <p>Free Returns</p>
                <p>Secure Payment</p>
                <p>24/7 Support</p>
                <p>Shop Now</p>
            </div>
            <nav className='flex justify-between items-center h-24 w-full'>
                <img src={logo} alt="logo" className='w-18 h-18 ml-2' />
                <div className='flex items-center gap-10 w-full justify-center'>
                {navItems.map((item) => (
                    <li className='text-gray-700 list-none cursor-pointer mx-12 font-medium hover:text-primary' key={item.name}>{item.name}</li>
                ))}
                </div>
                <div className='flex items-center justify-between gap-10 m-12'>
                <FaRegHeart className='text-primary text-2xl cursor-pointer' />
                <CgShoppingBag className='text-primary text-2xl cursor-pointer' />
                <LuCircleUserRound className='text-primary text-2xl cursor-pointer' />
                </div>
            </nav>
        </header>
    </>
  )
}

export default Navbar