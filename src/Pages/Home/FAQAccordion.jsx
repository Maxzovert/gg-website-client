import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  FaChevronDown,
  FaChevronUp,
  FaWater,
  FaPalette,
  FaLayerGroup,
  FaOm,
  FaHeart,
  FaStar,
  FaGift,
  FaHeadset,
  FaCheckCircle,
  FaMoneyBillWave,
} from 'react-icons/fa'
import { FAQ_ITEMS } from '../../seo/faqData.js'
import { buildFaqPageJsonLd } from '../../seo/jsonLd.js'

const ICON_BY_ID = {
  11: FaCheckCircle,
  12: FaMoneyBillWave,
  13: FaLayerGroup,
  16: FaWater,
  17: FaPalette,
  21: FaOm,
  22: FaHeart,
  23: FaStar,
  24: FaGift,
  25: FaHeadset,
}

const faqData = FAQ_ITEMS.map((item) => ({
  ...item,
  Icon: ICON_BY_ID[item.id] || FaCheckCircle,
}))

const FAQAccordion = () => {
  const [openId, setOpenId] = useState(null)
  const faqSchema = buildFaqPageJsonLd(FAQ_ITEMS)

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <section id="faqs" className="bg-[#FFFAEB]">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <h2 className="font-heading font-bold text-primary text-2xl md:text-3xl text-center mb-8 md:mb-10">
          FAQs
        </h2>
        <div className="space-y-3">
          {faqData.map((item) => {
            const isOpen = openId === item.id
            const IconComponent = item.Icon
            return (
              <div
                key={item.id}
                className={`rounded-xl overflow-hidden border bg-white shadow-sm transition-colors ${
                  isOpen ? 'border-primary' : 'border-gray-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  className={`w-full flex items-center gap-4 text-left px-4 py-4 md:px-5 md:py-4 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 ${
                    isOpen ? 'bg-primary/5' : 'hover:bg-primary/5'
                  }`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                  id={`faq-question-${item.id}`}
                >
                  <span className="shrink-0 w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <IconComponent className="text-lg md:text-xl" aria-hidden />
                  </span>
                  <span
                    className={`flex-1 font-medium text-sm md:text-base min-w-0 transition-colors ${
                      isOpen ? 'text-primary' : 'text-gray-800'
                    }`}
                  >
                    {item.question}
                  </span>
                  <span className="shrink-0 text-primary">
                    {isOpen ? (
                      <FaChevronUp className="text-sm" aria-hidden />
                    ) : (
                      <FaChevronDown className="text-sm" aria-hidden />
                    )}
                  </span>
                </button>
                <div
                  id={`faq-answer-${item.id}`}
                  role="region"
                  aria-labelledby={`faq-question-${item.id}`}
                  className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 pb-4 md:px-5 md:pb-4 pt-0 pl-14 md:pl-18 border-t border-gray-100">
                      <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FAQAccordion
