import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaRegHeart, FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import { CgShoppingBag } from "react-icons/cg";
import logo from '../assets/gglogo.svg';
import { LuCircleUserRound } from "react-icons/lu";
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const ACCESSORY_TYPE_LINKS = [
    { label: 'Mala', to: `/accessories?subcategory=${encodeURIComponent('Mala')}` },
    { label: 'Bracelet', to: `/accessories?subcategory=${encodeURIComponent('Bracelet')}` },
    { label: 'Necklace', to: `/accessories?subcategory=${encodeURIComponent('Necklace')}` },
    { label: 'Earring', to: `/accessories?subcategory=${encodeURIComponent('Earring')}` },
    { label: 'Ring', to: `/accessories?subcategory=${encodeURIComponent('Ring')}` },
    { label: 'Other', to: `/accessories?subcategory=${encodeURIComponent('Other')}` },
]
const TULSI_MALA_LINKS = [
    { label: 'Mala', to: `/tulsimala?subcategory=${encodeURIComponent('Mala')}` },
    { label: 'Necklace', to: `/tulsimala?subcategory=${encodeURIComponent('Necklace')}` },
    { label: 'Bracelet', to: `/tulsimala?subcategory=${encodeURIComponent('Bracelet')}` },
]

const MUKHI_NAV_LINKS = Array.from({ length: 14 }, (_, i) => {
    const label = `${i + 1} Mukhi`
    return {
        label,
        to: `/rudraksha?subcategory=${encodeURIComponent(label)}`,
    }
})

/** Desktop mega-menu: high contrast panel + clear sections */
const megaPanel =
    'overflow-hidden rounded-2xl border border-gray-200/95 bg-white shadow-[0_22px_56px_-14px_rgba(15,23,42,0.28)] ring-1 ring-gray-950/[0.06]'
const megaHero =
    'mx-3 my-3 block rounded-xl bg-primary/12 px-4 py-3 text-center text-sm font-bold text-primary shadow-sm ring-1 ring-primary/15 transition-colors hover:bg-primary/18'
const megaSectionTitle =
    'mb-2.5 px-1 text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500'
const megaListLink =
    'block rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:bg-primary/10 hover:text-primary'
const megaGridLink =
    'flex min-h-[2.75rem] items-center justify-center rounded-xl border border-gray-100 bg-gray-50/95 px-2 text-sm font-semibold text-gray-800 shadow-sm transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary hover:shadow-md'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mobileAccessoriesOpen, setMobileAccessoriesOpen] = useState(false);
    const [mobileTulsiOpen, setMobileTulsiOpen] = useState(false);
    const [mobileRudrakshaOpen, setMobileRudrakshaOpen] = useState(false);
    const [desktopAccessoriesOpen, setDesktopAccessoriesOpen] = useState(false);
    const [desktopTulsiOpen, setDesktopTulsiOpen] = useState(false);
    const [desktopRudrakshaOpen, setDesktopRudrakshaOpen] = useState(false);
    const accessoriesDesktopRef = useRef(null);
    const rudrakshaDesktopRef = useRef(null);
    const tulsiDesktopRef = useRef(null);
    const { getTotalItems } = useCart();
    const { getTotalItems: getWishlistCount } = useWishlist();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const cartCount = getTotalItems();
    const wishlistCount = getWishlistCount();
    const location = useLocation();

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
            name: 'Tulsi Mala',
            href: '/tulsimala',
        },
        {
            name: 'Accessories',
            href: '/accessories',
        },
        {
            name: 'Combos',
            href: '/combos',
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
        setMobileAccessoriesOpen(false);
        setMobileTulsiOpen(false);
        setMobileRudrakshaOpen(false);
    };

    useEffect(() => {
        if (!desktopAccessoriesOpen && !desktopRudrakshaOpen && !desktopTulsiOpen) return;
        const onDown = (e) => {
            if (
                desktopAccessoriesOpen &&
                accessoriesDesktopRef.current &&
                !accessoriesDesktopRef.current.contains(e.target)
            ) {
                setDesktopAccessoriesOpen(false);
            }
            if (
                desktopRudrakshaOpen &&
                rudrakshaDesktopRef.current &&
                !rudrakshaDesktopRef.current.contains(e.target)
            ) {
                setDesktopRudrakshaOpen(false);
            }
            if (
                desktopTulsiOpen &&
                tulsiDesktopRef.current &&
                !tulsiDesktopRef.current.contains(e.target)
            ) {
                setDesktopTulsiOpen(false);
            }
        };
        document.addEventListener('mousedown', onDown);
        return () => document.removeEventListener('mousedown', onDown);
    }, [desktopAccessoriesOpen, desktopRudrakshaOpen, desktopTulsiOpen]);

    useEffect(() => {
        setDesktopAccessoriesOpen(false);
        setDesktopTulsiOpen(false);
        setDesktopRudrakshaOpen(false);
    }, [location.pathname, location.search]);

    const handleUserClick = () => {
        if (isAuthenticated) {
            navigate('/profile');
        } else {
            navigate('/auth', { state: { from: location } });
        }
    };

    const isActive = (href) => {
        if (href === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(href);
    };

    const spraySparkles = [
        { id: 'sp-1', top: '-7px', right: '-8px', delay: '0s', duration: '1.2s', scale: 0.75 },
        { id: 'sp-2', top: '-10px', right: '22px', delay: '0.35s', duration: '1.45s', scale: 0.55 },
        { id: 'sp-3', top: '19px', right: '-7px', delay: '0.75s', duration: '1.35s', scale: 0.62 },
    ];
    
  return (
    <>
        <style>{`
          @keyframes spraySparkleTwinkle {
            0% { opacity: 0; transform: scale(0) rotate(70deg); }
            35% { opacity: 1; transform: scale(var(--sparkle-scale, .7)) rotate(120deg); }
            100% { opacity: 0; transform: scale(0) rotate(155deg); }
          }
          .spray-sparkle {
            animation-name: spraySparkleTwinkle;
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
          }
        `}</style>
        <header className='bg-[#FFFAEB] shadow-md border-b border-[#E9DFC4]'>
            {/* Top Banner */}
            <div className='hidden md:flex items-center justify-evenly h-10 bg-primary text-white text-sm'>
                <p>Free Shipping</p>
                <p>Free Returns</p>
                <p>Secure Payment</p>
                <p>24/7 Support</p>
                <p>Shop Now</p>
            </div>
            
            {/* Mobile Top Banner - Simplified */}
            <div className='md:hidden flex items-center justify-center h-10 bg-primary text-white text-sm px-4'>
                <p className='text-center'>Free Shipping on All Orders</p>
            </div>

            {/* Main Navigation */}
            <nav className='flex justify-between items-center h-20 md:h-28 lg:h-32 w-full px-4 md:px-8 lg:px-10'>
                {/* Logo */}
                <Link to="/" className='shrink-0'>
                    <img src={logo} alt="logo" className='w-16 h-16 md:w-24 md:h-24 lg:w-42 lg:h-42' />
                </Link>

                {/* Desktop Navigation Links */}
                <div className='hidden lg:flex items-center gap-8 xl:gap-12 w-full justify-center'>
                    {navItems.map((item) => {
                        const active = isActive(item.href);
                        const isSprayTab = item.href === '/sprays';
                        const isRudraksha = item.href === '/rudraksha';
                        const isTulsi = item.href === '/tulsimala';
                        const isAccessories = item.href === '/accessories';

                        if (isRudraksha) {
                            const rudrakshaActive = location.pathname.startsWith('/rudraksha');
                            return (
                                <div
                                    key={item.name}
                                    ref={rudrakshaDesktopRef}
                                    className="relative list-none"
                                    onMouseEnter={() => setDesktopRudrakshaOpen(true)}
                                    onMouseLeave={() => setDesktopRudrakshaOpen(false)}
                                >
                                    <Link
                                        to={item.href}
                                        className={`flex cursor-pointer items-center gap-1 font-semibold transition-all text-base xl:text-lg ${
                                            rudrakshaActive
                                                ? 'text-primary font-bold border-b-2 border-primary pb-1'
                                                : 'text-gray-700 hover:text-primary'
                                        }`}
                                        aria-expanded={desktopRudrakshaOpen}
                                        aria-haspopup="true"
                                    >
                                        {item.name}
                                        <FaChevronDown className={`text-xs transition-transform ${desktopRudrakshaOpen ? 'rotate-180' : ''}`} aria-hidden />
                                    </Link>
                                    {desktopRudrakshaOpen && (
                                        <div
                                            className="absolute left-1/2 top-full z-60 w-[min(100vw-2rem,24rem)] -translate-x-1/2 pt-2 xl:left-0 xl:translate-x-0 xl:w-80"
                                            role="presentation"
                                        >
                                            <div className={megaPanel} role="menu">
                                                <Link
                                                    to="/rudraksha"
                                                    className={megaHero}
                                                    onClick={() => setDesktopRudrakshaOpen(false)}
                                                >
                                                    View all Rudraksha
                                                </Link>
                                                <div className="border-t border-gray-100 bg-[#FFFAF5] px-3 pb-4 pt-3">
                                                    <p className={megaSectionTitle}>By Mukhi (1–14)</p>
                                                    <div className="max-h-[min(18rem,50vh)] overflow-y-auto overscroll-contain pr-0.5">
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {MUKHI_NAV_LINKS.map((l) => (
                                                                <Link
                                                                    key={l.label}
                                                                    to={l.to}
                                                                    className={megaGridLink}
                                                                    onClick={() => setDesktopRudrakshaOpen(false)}
                                                                    role="menuitem"
                                                                >
                                                                    {l.label}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        if (isAccessories) {
                            const accActive = location.pathname.startsWith('/accessories');
                            return (
                                <div
                                    key={item.name}
                                    ref={accessoriesDesktopRef}
                                    className="relative list-none"
                                    onMouseEnter={() => setDesktopAccessoriesOpen(true)}
                                    onMouseLeave={() => setDesktopAccessoriesOpen(false)}
                                >
                                    <Link
                                        to={item.href}
                                        className={`flex cursor-pointer items-center gap-1 font-semibold transition-all text-base xl:text-lg ${
                                            accActive
                                                ? 'text-primary font-bold border-b-2 border-primary pb-1'
                                                : 'text-gray-700 hover:text-primary'
                                        }`}
                                        aria-expanded={desktopAccessoriesOpen}
                                        aria-haspopup="true"
                                    >
                                        {item.name}
                                        <FaChevronDown className={`text-xs transition-transform ${desktopAccessoriesOpen ? 'rotate-180' : ''}`} aria-hidden />
                                    </Link>
                                    {desktopAccessoriesOpen && (
                                        <div
                                            className="absolute left-1/2 top-full z-60 w-[min(100vw-2rem,20rem)] -translate-x-1/2 pt-2 xl:left-0 xl:translate-x-0 xl:w-64"
                                            role="presentation"
                                        >
                                            <div className={megaPanel} role="menu">
                                                <Link
                                                    to="/accessories"
                                                    className={megaHero}
                                                    onClick={() => setDesktopAccessoriesOpen(false)}
                                                >
                                                    View all accessories
                                                </Link>
                                                <div className="space-y-1 border-t border-gray-100 bg-[#FFFAF5] px-2 py-3">
                                                    <p className={`${megaSectionTitle} px-2`}>By type</p>
                                                    {ACCESSORY_TYPE_LINKS.map((l) => (
                                                        <Link
                                                            key={l.label}
                                                            to={l.to}
                                                            className={megaListLink}
                                                            onClick={() => setDesktopAccessoriesOpen(false)}
                                                            role="menuitem"
                                                        >
                                                            {l.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        }
                        if (isTulsi) {
                            const tulsiActive = location.pathname.startsWith('/tulsimala');
                            return (
                                <div
                                    key={item.name}
                                    ref={tulsiDesktopRef}
                                    className="relative list-none"
                                    onMouseEnter={() => setDesktopTulsiOpen(true)}
                                    onMouseLeave={() => setDesktopTulsiOpen(false)}
                                >
                                    <Link
                                        to={item.href}
                                        className={`flex cursor-pointer items-center gap-1 font-semibold transition-all text-base xl:text-lg ${
                                            tulsiActive
                                                ? 'text-primary font-bold border-b-2 border-primary pb-1'
                                                : 'text-gray-700 hover:text-primary'
                                        }`}
                                        aria-expanded={desktopTulsiOpen}
                                        aria-haspopup="true"
                                    >
                                        {item.name}
                                        <FaChevronDown className={`text-xs transition-transform ${desktopTulsiOpen ? 'rotate-180' : ''}`} aria-hidden />
                                    </Link>
                                    {desktopTulsiOpen && (
                                        <div
                                            className="absolute left-1/2 top-full z-60 w-[min(100vw-2rem,20rem)] -translate-x-1/2 pt-2 xl:left-0 xl:translate-x-0 xl:w-64"
                                            role="presentation"
                                        >
                                            <div className={megaPanel} role="menu">
                                                <Link
                                                    to="/tulsimala"
                                                    className={megaHero}
                                                    onClick={() => setDesktopTulsiOpen(false)}
                                                >
                                                    View all Tulsi Mala
                                                </Link>
                                                <div className="space-y-1 border-t border-gray-100 bg-[#FFFAF5] px-2 py-3">
                                                    <p className={`${megaSectionTitle} px-2`}>By type</p>
                                                    {TULSI_MALA_LINKS.map((l) => (
                                                        <Link
                                                            key={l.label}
                                                            to={l.to}
                                                            className={megaListLink}
                                                            onClick={() => setDesktopTulsiOpen(false)}
                                                            role="menuitem"
                                                        >
                                                            {l.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <Link 
                                key={item.name} 
                                to={item.href}
                                className={`list-none cursor-pointer font-semibold transition-all text-base xl:text-lg ${
                                    isSprayTab
                                        ? `relative px-3 py-1.5 rounded-full ${
                                            active
                                                ? 'text-primary font-bold'
                                                : 'text-primary hover:text-primary/80'
                                        }`
                                        : active
                                            ? 'text-primary font-bold border-b-2 border-primary pb-1' 
                                            : 'text-gray-700 hover:text-primary'
                                }`}
                            >
                                {isSprayTab && (
                                    <>
                                        {spraySparkles.map((s) => (
                                            <span
                                                key={s.id}
                                                className="pointer-events-none absolute z-20 spray-sparkle text-primary"
                                                style={{
                                                    top: s.top,
                                                    right: s.right,
                                                    animationDelay: s.delay,
                                                    animationDuration: s.duration,
                                                    '--sparkle-scale': s.scale,
                                                }}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 21 21" fill="none" aria-hidden>
                                                    <path
                                                        d="M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                            </span>
                                        ))}
                                    </>
                                )}
                                <span className='relative z-10'>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Right Side Icons */}
                <div className='flex items-center gap-5 md:gap-7 lg:gap-9'>
                    {/* Desktop Icons */}
                    <div className='hidden md:flex items-center gap-5 lg:gap-7'>
                        <Link to="/wishlist" className="relative">
                            <FaRegHeart className='text-primary text-2xl lg:text-3xl cursor-pointer hover:scale-110 transition-transform' />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {wishlistCount > 99 ? '99+' : wishlistCount}
                                </span>
                            )}
                        </Link>
                        <Link to="/cart" className="relative">
                            <CgShoppingBag className='text-primary text-2xl lg:text-3xl cursor-pointer hover:scale-110 transition-transform' />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </Link>
                        <LuCircleUserRound 
                            onClick={handleUserClick}
                            className='text-primary text-2xl lg:text-3xl cursor-pointer hover:scale-110 transition-transform'
                            title={isAuthenticated ? 'View Profile' : 'Sign In'}
                        />
                    </div>

                    {/* Mobile Icons - Only Cart and User */}
                    <div className='md:hidden flex items-center gap-5'>
                        <Link to="/cart" className="relative">
                            <CgShoppingBag className='text-primary text-2xl cursor-pointer' />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </Link>
                        <LuCircleUserRound 
                            onClick={handleUserClick}
                            className='text-primary text-2xl cursor-pointer'
                            title={isAuthenticated ? 'View Profile' : 'Sign In'}
                        />
                    </div>

                    {/* Mobile Hamburger Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className='lg:hidden text-primary text-3xl cursor-pointer focus:outline-none'
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
                        {navItems.map((item) => {
                            const active = isActive(item.href);
                            const isSprayTab = item.href === '/sprays';
                            const isRudraksha = item.href === '/rudraksha';
                            const isTulsi = item.href === '/tulsimala';
                            const isAccessories = item.href === '/accessories';

                            if (isRudraksha) {
                                const rudrakshaActive = location.pathname.startsWith('/rudraksha');
                                return (
                                    <div key={item.name} className="border-b border-gray-100 last:border-0">
                                        <button
                                            type="button"
                                            onClick={() => setMobileRudrakshaOpen((o) => !o)}
                                            className={`flex w-full items-center justify-between px-6 py-3.5 text-left text-lg font-semibold transition-colors ${
                                                rudrakshaActive || mobileRudrakshaOpen
                                                    ? 'text-primary font-bold bg-primary/10 border-l-4 border-primary'
                                                    : 'text-gray-700 hover:bg-primary/5'
                                            }`}
                                            aria-expanded={mobileRudrakshaOpen}
                                        >
                                            {item.name}
                                            <FaChevronDown className={`shrink-0 text-sm transition-transform ${mobileRudrakshaOpen ? 'rotate-180' : ''}`} aria-hidden />
                                        </button>
                                        {mobileRudrakshaOpen && (
                                            <div className="mx-4 mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-md ring-1 ring-gray-950/5">
                                                <Link
                                                    to="/rudraksha"
                                                    onClick={closeMenu}
                                                    className="mb-4 block rounded-xl bg-primary/12 py-3.5 text-center text-base font-bold text-primary ring-1 ring-primary/15"
                                                >
                                                    View all Rudraksha
                                                </Link>
                                                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">
                                                    By Mukhi (1–14)
                                                </p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {MUKHI_NAV_LINKS.map((l) => (
                                                        <Link
                                                            key={l.label}
                                                            to={l.to}
                                                            onClick={closeMenu}
                                                            className="flex min-h-12 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 py-2 text-sm font-semibold text-gray-800 active:bg-primary/15 active:text-primary"
                                                        >
                                                            {l.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            if (isAccessories) {
                                const accActive = location.pathname.startsWith('/accessories');
                                return (
                                    <div key={item.name} className="border-b border-gray-100 last:border-0">
                                        <button
                                            type="button"
                                            onClick={() => setMobileAccessoriesOpen((o) => !o)}
                                            className={`flex w-full items-center justify-between px-6 py-3.5 text-left text-lg font-semibold transition-colors ${
                                                accActive || mobileAccessoriesOpen
                                                    ? 'text-primary font-bold bg-primary/10 border-l-4 border-primary'
                                                    : 'text-gray-700 hover:bg-primary/5'
                                            }`}
                                            aria-expanded={mobileAccessoriesOpen}
                                        >
                                            {item.name}
                                            <FaChevronDown className={`shrink-0 text-sm transition-transform ${mobileAccessoriesOpen ? 'rotate-180' : ''}`} aria-hidden />
                                        </button>
                                        {mobileAccessoriesOpen && (
                                            <div className="mx-4 mb-4 rounded-2xl border border-gray-200 bg-white p-3 shadow-md ring-1 ring-gray-950/5">
                                                <Link
                                                    to="/accessories"
                                                    onClick={closeMenu}
                                                    className="mb-3 block rounded-xl bg-primary/12 py-3.5 text-center text-base font-bold text-primary ring-1 ring-primary/15"
                                                >
                                                    View all accessories
                                                </Link>
                                                <p className="mb-1 px-1 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">
                                                    By type
                                                </p>
                                                <div className="flex flex-col gap-1">
                                                    {ACCESSORY_TYPE_LINKS.map((l) => (
                                                        <Link
                                                            key={l.label}
                                                            to={l.to}
                                                            onClick={closeMenu}
                                                            className="rounded-xl px-4 py-3 text-base font-semibold text-gray-800 active:bg-primary/10 active:text-primary"
                                                        >
                                                            {l.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                            if (isTulsi) {
                                const tulsiActive = location.pathname.startsWith('/tulsimala');
                                return (
                                    <div key={item.name} className="border-b border-gray-100 last:border-0">
                                        <button
                                            type="button"
                                            onClick={() => setMobileTulsiOpen((o) => !o)}
                                            className={`flex w-full items-center justify-between px-6 py-3.5 text-left text-lg font-semibold transition-colors ${
                                                tulsiActive || mobileTulsiOpen
                                                    ? 'text-primary font-bold bg-primary/10 border-l-4 border-primary'
                                                    : 'text-gray-700 hover:bg-primary/5'
                                            }`}
                                            aria-expanded={mobileTulsiOpen}
                                        >
                                            {item.name}
                                            <FaChevronDown className={`shrink-0 text-sm transition-transform ${mobileTulsiOpen ? 'rotate-180' : ''}`} aria-hidden />
                                        </button>
                                        {mobileTulsiOpen && (
                                            <div className="mx-4 mb-4 rounded-2xl border border-gray-200 bg-white p-3 shadow-md ring-1 ring-gray-950/5">
                                                <Link
                                                    to="/tulsimala"
                                                    onClick={closeMenu}
                                                    className="mb-3 block rounded-xl bg-primary/12 py-3.5 text-center text-base font-bold text-primary ring-1 ring-primary/15"
                                                >
                                                    View all Tulsi Mala
                                                </Link>
                                                <p className="mb-1 px-1 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">
                                                    By type
                                                </p>
                                                <div className="flex flex-col gap-1">
                                                    {TULSI_MALA_LINKS.map((l) => (
                                                        <Link
                                                            key={l.label}
                                                            to={l.to}
                                                            onClick={closeMenu}
                                                            className="rounded-xl px-4 py-3 text-base font-semibold text-gray-800 active:bg-primary/10 active:text-primary"
                                                        >
                                                            {l.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            return (
                                <Link 
                                    key={item.name} 
                                    to={item.href}
                                    onClick={closeMenu}
                                    className={`px-6 py-3.5 font-semibold transition-colors text-lg ${
                                        isSprayTab
                                            ? active
                                                ? 'text-primary font-bold'
                                                : 'text-primary font-semibold hover:bg-primary/5'
                                            : active 
                                                ? 'text-primary font-bold bg-primary/10 border-l-4 border-primary' 
                                                : 'text-gray-700 hover:text-primary hover:bg-primary/5'
                                    }`}
                                >
                                    <span className='inline-flex items-center gap-2'>
                                        {item.name}
                                        {isSprayTab && (
                                            <span className='spray-sparkle inline-flex text-primary' style={{ animationDuration: '1.2s' }}>
                                                <svg width="11" height="11" viewBox="0 0 21 21" fill="none" aria-hidden>
                                                    <path
                                                        d="M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                            </span>
                                        )}
                                    </span>
                                </Link>
                            );
                        })}
                        {/* Mobile Menu Heart Icon */}
                        <Link
                            to="/wishlist"
                            onClick={closeMenu}
                            className='flex items-center gap-3 px-6 py-3.5 text-gray-700 font-semibold hover:text-primary hover:bg-primary/5 transition-colors text-lg relative'
                        >
                            <FaRegHeart className='text-primary' />
                            <span>Wishlist</span>
                            {wishlistCount > 0 && (
                                <span className="ml-auto bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {wishlistCount > 99 ? '99+' : wishlistCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            )}
        </header>
    </>
  )
}

export default Navbar
