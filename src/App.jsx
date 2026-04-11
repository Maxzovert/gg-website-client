import React, { lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
import CookieConsent from './components/CookieConsent'
import RouteSeo from './components/RouteSeo'
import Footer from './components/Footer'
import Loader from './components/Loader'
import { ToastProvider } from './components/Toaster'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { AuthProvider } from './context/AuthContext'
import { Routes, Route, Navigate } from "react-router-dom"

const Home = lazy(() => import('./Pages/Home/Home'))
const Spray = lazy(() => import('./Pages/Spray/Spray'))
const Rudraksh = lazy(() => import('./Pages/Rudraksh/Rudraksh'))
const Rashi = lazy(() => import('./Pages/Rashi/Rashi'))
const Accessories = lazy(() => import('./Pages/Accessories/Accessories'))
const TulsiMala = lazy(() => import('./Pages/TulsiMala/TulsiMala'))
const ProductPage = lazy(() => import('./Pages/ProductPage/ProductPage'))
const Cart = lazy(() => import('./Pages/Cart/Cart'))
const Wishlist = lazy(() => import('./Pages/Wishlist/Wishlist'))
const Auth = lazy(() => import('./Pages/Auth/Auth'))
const AuthCallback = lazy(() => import('./Pages/Auth/AuthCallback'))
const Profile = lazy(() => import('./Pages/Profile/Profile'))
const ViewDetails = lazy(() => import('./Pages/Profile/ViewDetails'))
const OrderSuccess = lazy(() => import('./Pages/Order/OrderSuccess'))
const OrderFailed = lazy(() => import('./Pages/Order/OrderFailed'))
const About = lazy(() => import('./Pages/About/About'))
const Blog = lazy(() => import('./Pages/Blog/Blog'))
const Contact = lazy(() => import('./Pages/Contact/Contact'))
const TermsOfService = lazy(() => import('./Pages/Policies/TermsOfService'))
const RefundCancellation = lazy(() => import('./Pages/Policies/RefundCancellation'))
const TermsAndConditions = lazy(() => import('./Pages/Policies/TermsAndConditions'))
const ShippingPolicy = lazy(() => import('./Pages/Policies/ShippingPolicy'))
const PrivacyPolicy = lazy(() => import('./Pages/Policies/PrivacyPolicy'))
const PurposeProducts = lazy(() => import('./Pages/PurposeProducts/PurposeProducts'))

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <Loader />
  </div>
)


const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="min-h-screen flex flex-col">
              <RouteSeo />
              <ScrollToTop />
              <CookieConsent />
              <Navbar />
              <main className="flex-1">
                <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/sprays" element={<Spray />} />
                  <Route path="/rudraksha" element={<Rudraksh />} />
                  <Route path="/tulsimala" element={<TulsiMala />} />
                  <Route path="/rashi" element={<Rashi />} />
                  <Route path="/accessories" element={<Accessories />} />
                  <Route path="/purpose-products" element={<PurposeProducts />} />
                  <Route path="/product/:slug" element={<ProductPage />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/orders/:id" element={<ViewDetails />} />
                  <Route path="/order-success" element={<OrderSuccess />} />
                  <Route path="/order-failed" element={<OrderFailed />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/refund-cancellation" element={<RefundCancellation />} />
                  <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                  <Route path="/shipping-policy" element={<ShippingPolicy />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/login" element={<Auth />} />
                  <Route path="/signup" element={<Auth />} />
                  <Route path="/auth" element={<Navigate to="/login" replace />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App