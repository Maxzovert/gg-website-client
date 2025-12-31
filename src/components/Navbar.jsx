import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaRegHeart, FaBars, FaTimes } from "react-icons/fa";
import { CgShoppingBag } from "react-icons/cg";
import logo from '../assets/gglogo.png';
import { LuCircleUserRound } from "react-icons/lu";


const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        {
            name: 'Home',
            href: '/',
        },
        {
            name: 'Sprays',
            href: '/sprays',
        },
        {
            name: 'Rudraksha',
            href: '/rudraksha',
        },
        {
            name: 'Rashi',
            href: '/rashi',
        },
    ]

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };
    
  return (
    <>
        <header className='bg-[white] shadow-md'>
            {/* Top Banner */}
            <div className='hidden md:flex items-center justify-evenly h-8 bg-primary text-white text-xs'>
                <p>Free Shipping</p>
                <p>Free Returns</p>
                <p>Secure Payment</p>
                <p>24/7 Support</p>
                <p>Shop Now</p>
            </div>
            
            {/* Mobile Top Banner - Simplified */}
            <div className='md:hidden flex items-center justify-center h-8 bg-primary text-white text-xs px-4'>
                <p className='text-center'>Free Shipping on All Orders</p>
            </div>

            {/* Main Navigation */}
            <nav className='flex justify-between items-center h-16 md:h-24 w-full px-4 md:px-6 lg:px-8'>
                {/* Logo */}
                <Link to="/" className='shrink-0'>
                    <img src={logo} alt="logo" className='w-12 h-12 md:w-16 md:h-16 lg:w-18 lg:h-18' />
                </Link>

                {/* Desktop Navigation Links */}
                <div className='hidden lg:flex items-center gap-6 xl:gap-10 w-full justify-center'>
                    {navItems.map((item) => (
                        <Link 
                            key={item.name} 
                            to={item.href}
                            className='text-gray-700 list-none cursor-pointer font-medium hover:text-primary transition-colors text-sm xl:text-base'
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* Right Side Icons */}
                <div className='flex items-center gap-4 md:gap-6 lg:gap-8'>
                    {/* Desktop Icons */}
                    <div className='hidden md:flex items-center gap-4 lg:gap-6'>
                        <FaRegHeart className='text-primary text-xl lg:text-2xl cursor-pointer hover:scale-110 transition-transform' />
                        <CgShoppingBag className='text-primary text-xl lg:text-2xl cursor-pointer hover:scale-110 transition-transform' />
                        <LuCircleUserRound className='text-primary text-xl lg:text-2xl cursor-pointer hover:scale-110 transition-transform' />
                    </div>

                    {/* Mobile Icons - Only Cart and User */}
                    <div className='md:hidden flex items-center gap-4'>
                        <CgShoppingBag className='text-primary text-xl cursor-pointer' />
                        <LuCircleUserRound className='text-primary text-xl cursor-pointer' />
                    </div>

                    {/* Mobile Hamburger Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className='lg:hidden text-primary text-2xl cursor-pointer focus:outline-none'
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className='lg:hidden bg-white border-t border-gray-200 shadow-lg'>
                    <div className='flex flex-col py-4'>
                        {navItems.map((item) => (
                            <Link 
                                key={item.name} 
                                to={item.href}
                                onClick={closeMenu}
                                className='text-gray-700 px-6 py-3 font-medium hover:text-primary hover:bg-primary/5 transition-colors text-base'
                            >
                                {item.name}
                            </Link>
                        ))}
                        {/* Mobile Menu Heart Icon */}
                        <Link
                            to="#"
                            onClick={closeMenu}
                            className='flex items-center gap-3 px-6 py-3 text-gray-700 font-medium hover:text-primary hover:bg-primary/5 transition-colors text-base'
                        >
                            <FaRegHeart className='text-primary' />
                            <span>Wishlist</span>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    </>
  )
}

export default Navbar
