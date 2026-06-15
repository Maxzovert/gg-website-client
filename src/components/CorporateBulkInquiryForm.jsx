import React, { useState } from 'react'
import { FaPaperPlane } from 'react-icons/fa'
import { apiFetch } from '../config/api'
import { useToast } from './Toaster'
import { trackLead } from '../utils/analytics.js'

const SUBJECT = 'Corporate / bulk order inquiry'

function buildBulkMessage(fields) {
  const lines = []
  if (fields.company) lines.push(`Organization: ${fields.company}`)
  if (fields.phone) lines.push(`Phone: ${fields.phone}`)
  if (fields.city) lines.push(`City / delivery: ${fields.city}`)
  if (fields.productInterest) lines.push(`Products / SKUs: ${fields.productInterest}`)
  if (fields.quantity) lines.push(`Approx. quantity: ${fields.quantity}`)
  if (fields.timeline) lines.push(`Needed by: ${fields.timeline}`)
  lines.push(`GST invoice needed: ${fields.gstNeeded ? 'Yes' : 'No'}`)
  lines.push('')
  lines.push('Details:')
  lines.push(fields.message?.trim() || '—')
  return lines.join('\n')
}

const inputClass =
  'w-full px-4 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-800/30 focus:border-amber-800/50 text-sm sm:text-base'
const labelClass = 'about-body block text-sm font-medium text-stone-700 mb-1.5'

/**
 * @param {{ source?: string }} props
 */
export default function CorporateBulkInquiryForm({ source = 'corporate_page' }) {
  const toast = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    city: '',
    productInterest: '',
    quantity: '',
    timeline: '',
    gstNeeded: false,
    message: '',
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)

    const body = {
      name: form.name,
      email: form.email,
      subject: SUBJECT,
      message: buildBulkMessage(form),
    }

    try {
      const response = await apiFetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(body),
      })
      const payload = await response.json()

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Could not send your request')
      }

      trackLead({
        content_name: 'Corporate bulk inquiry',
        source,
      })

      setSubmitted(true)
      setForm({
        name: '',
        email: '',
        company: '',
        phone: '',
        city: '',
        productInterest: '',
        quantity: '',
        timeline: '',
        gstNeeded: false,
        message: '',
      })
      toast.success('Request sent. Our team will reply shortly.')
    } catch (err) {
      toast.error(err?.message || 'Could not send your request')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg bg-amber-50/80 border border-amber-200/60 p-6">
        <p className="about-body text-stone-700">
          Thank you. We have received your bulk order request and will contact you with pricing and timelines.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="about-body mt-4 text-primary font-medium hover:underline"
        >
          Send another request
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label htmlFor="bulk-name" className={labelClass}>
            Your name <span className="text-red-600">*</span>
          </label>
          <input
            id="bulk-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            autoComplete="name"
            className={inputClass}
            placeholder="Full name"
          />
        </div>
        <div>
          <label htmlFor="bulk-email" className={labelClass}>
            Work email <span className="text-red-600">*</span>
          </label>
          <input
            id="bulk-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
            className={inputClass}
            placeholder="you@company.com"
          />
        </div>
        <div>
          <label htmlFor="bulk-phone" className={labelClass}>
            Phone (WhatsApp preferred)
          </label>
          <input
            id="bulk-phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            autoComplete="tel"
            className={inputClass}
            placeholder="+91 ..."
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="bulk-company" className={labelClass}>
            Company / organization
          </label>
          <input
            id="bulk-company"
            name="company"
            value={form.company}
            onChange={handleChange}
            autoComplete="organization"
            className={inputClass}
            placeholder="Company, temple, NGO, studio..."
          />
        </div>
        <div>
          <label htmlFor="bulk-city" className={labelClass}>
            City / delivery region
          </label>
          <input
            id="bulk-city"
            name="city"
            value={form.city}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. Noida, Mumbai..."
          />
        </div>
        <div>
          <label htmlFor="bulk-qty" className={labelClass}>
            Approx. quantity
          </label>
          <input
            id="bulk-qty"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. 50 malas, 200 bracelets"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="bulk-products" className={labelClass}>
            Products interested in
          </label>
          <input
            id="bulk-products"
            name="productInterest"
            value={form.productInterest}
            onChange={handleChange}
            className={inputClass}
            placeholder="Rudraksha malas, Tulsi malas, sprays, combos..."
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="bulk-timeline" className={labelClass}>
            Timeline
          </label>
          <input
            id="bulk-timeline"
            name="timeline"
            value={form.timeline}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. needed before Diwali, recurring monthly..."
          />
        </div>
      </div>

      <div className="flex items-start gap-3">
        <input
          id="bulk-gst"
          name="gstNeeded"
          type="checkbox"
          checked={form.gstNeeded}
          onChange={handleChange}
          className="mt-1 h-4 w-4 rounded border-stone-300 text-primary focus:ring-amber-800/40"
        />
        <label htmlFor="bulk-gst" className="about-body text-sm text-stone-700">
          We need a GST invoice for this order
        </label>
      </div>
      <div>
        <label htmlFor="bulk-message" className={labelClass}>
          Additional details <span className="text-red-600">*</span>
        </label>
        <textarea
          id="bulk-message"
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          className={`${inputClass} resize-y min-h-[120px]`}
          placeholder="Packaging, custom notes, budget range, reference links..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg about-body font-medium hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60"
      >
        <FaPaperPlane className="text-sm" aria-hidden />
        {isSubmitting ? 'Sending...' : 'Request bulk quote'}
      </button>
    </form>
  )
}
