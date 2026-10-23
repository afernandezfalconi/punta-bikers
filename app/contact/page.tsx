'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

type FormField = 'name' | 'email' | 'subject' | 'message'
type FormErrors = Partial<Record<FormField, string>>

export default function ContactPage() {
  const [formData, setFormData] = useState<Record<FormField, string>>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<'success' | 'error' | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Invalid email format'
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required'
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    return newErrors
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = e.target.name as FormField
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
    // Clear error for this field on change
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors = validateForm()
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      setStatus('error')
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setIsLoading(false)
      setTimeout(() => setStatus(null), 3000)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-slate-300">
            We'd love to hear from you. Send us a message!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-blue-300">Contact Information</h2>
              <div className="space-y-4">
                {[
                  {
                    icon: '📍',
                    title: 'Location',
                    content: 'Puerto Escondido, Oaxaca, Mexico'
                  },
                  {
                    icon: '📞',
                    title: 'Phone',
                    content: '+52 954 582 1234'
                  },
                  {
                    icon: '✉️',
                    title: 'Email',
                    content: 'support@puntabikers.com'
                  },
                  {
                    icon: '⏰',
                    title: 'Hours',
                    content: '24/7 Support Available'
                  }
                ].map((info, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="text-2xl">{info.icon}</div>
                    <div>
                      <p className="font-bold text-sm text-slate-300">{info.title}</p>
                      <p className="text-orange-400">{info.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-300">Follow Us</h3>
              <div className="flex gap-4">
                {['Instagram', 'Facebook', 'Twitter'].map((social) => (
                  <button
                    key={social}
                    className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg px-4 py-2 hover:bg-white/15 transition-all"
                  >
                    {social}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-5xl mb-4">✓</div>
                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                <p className="text-slate-300 text-center">
                  Thanks for reaching out. We'll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Error Summary */}
                {Object.keys(errors).length > 0 && (
                  <div
                    role="alert"
                    aria-labelledby="error-title"
                    className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6"
                  >
                    <h2 id="error-title" className="font-bold text-red-300 mb-2">
                      Please fix the following errors:
                    </h2>
                    <ul className="list-disc list-inside text-red-300 text-sm space-y-1">
                      {Object.entries(errors).map(([field, error]) => (
                        error && (
                          <li key={field}>
                            <a href={`#${field}`} className="underline hover:no-underline">
                              {error}
                            </a>
                          </li>
                        )
                      ))}
                    </ul>
                  </div>
                )}

                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold mb-2">
                    Name <span aria-label="required">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all ${
                      errors.name ? 'border-red-500/50' : 'border-white/20'
                    }`}
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p id="name-error" className="text-red-400 text-sm mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-2">
                    Email <span aria-label="required">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all ${
                      errors.email ? 'border-red-500/50' : 'border-white/20'
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p id="email-error" className="text-red-400 text-sm mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Subject Field */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold mb-2">
                    Subject <span aria-label="required">*</span>
                  </label>
                  <input
                    id="subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? 'subject-error' : undefined}
                    className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all ${
                      errors.subject ? 'border-red-500/50' : 'border-white/20'
                    }`}
                    placeholder="How can we help?"
                  />
                  {errors.subject && (
                    <p id="subject-error" className="text-red-400 text-sm mt-1">
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold mb-2">
                    Message <span aria-label="required">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    rows={5}
                    className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all resize-none ${
                      errors.message ? 'border-red-500/50' : 'border-white/20'
                    }`}
                    placeholder="Your message..."
                  />
                  {errors.message && (
                    <p id="message-error" className="text-red-400 text-sm mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed h-11 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  aria-busy={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-16 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden aspect-video">
          <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-orange-500/20 flex items-center justify-center">
            <p className="text-slate-300">📍 Map coming soon</p>
          </div>
        </div>
      </div>
    </div>
  )
}
