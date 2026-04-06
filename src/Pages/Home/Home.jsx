import React from 'react'
import WebsiteCarousel from '../../components/WebsiteCarousel'
import RashiSection from '../Home/RashiSection'
import FAQAccordion from '../Home/FAQAccordion'
import SpraySection from '../Home/SpraySection'
import AuthenticCertifiedSection from './AuthenticCertifiedSection'
import RudrakshaSection from './RudrakshaSection'
import RudrakhshaProd from './RudrakhshaProd'
import OriginImg from '../../assets/HomePage/origin.webp'
import LimitedTimeCashbackOffer from './LimitedTimeCashbackOffer'
import FeaturedProductsSection from './FeaturedProductsSection'

const Home = () => {
  return (
    <>
      <WebsiteCarousel />
      <RudrakshaSection />
      <LimitedTimeCashbackOffer />
      <FeaturedProductsSection />
      <SpraySection />
      <RudrakhshaProd />
      <RashiSection />
      <AuthenticCertifiedSection />
      <section className="w-full border-t border-stone-200/60 bg-stone-50/40">
        <img
          src={OriginImg}
          alt="Why Gawri Ganga — our story and values"
          className="block h-auto w-full max-w-none object-contain object-center"
          loading="lazy"
        />
      </section>
      <FAQAccordion />
    </>
  )
}

export default Home