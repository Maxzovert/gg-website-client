import React from 'react'
import WebsiteCarousel from '../../components/WebsiteCarousel'
import RashiSection from '../Home/RashiSection'
import FAQAccordion from '../Home/FAQAccordion'
import SpraySection from '../Home/SpraySection'
import RudrakshaSection from './RudrakshaSection'
import RudrakhshaProd from './RudrakhshaProd'

const Home = () => {
  return (
    <>
      <WebsiteCarousel />
      <RudrakshaSection />
      <RudrakhshaProd />
      <SpraySection />
      <RashiSection />
      <FAQAccordion />
    </>
  )
}

export default Home