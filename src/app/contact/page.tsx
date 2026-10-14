'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement form submission
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Get in Touch</h1>
          <p className="text-xl text-slate-300">
            Have questions? We're here to help. Reach out anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: '📞',
              title: 'Phone',
              content: '+52 954 582 XXXX',
              description: 'Available 24/7',
            },
            {
              icon: '📧',
              title: 'Email',
              content: 'hello@puntabikers.com',
              description: 'Respond within 2 hours',
            },
            {
              icon: '📍',
              title: 'Location',
              content: 'Puerto Escondido, Oaxaca',
              description: 'Visit us anytime',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 text-center hover:bg-white/15 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="font-semibold text-lg mb-1">{item.content}</p>
              <p className="text-slate-300 text-sm">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-12">
          <h2 className="text-2xl font-bold mb-8">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium block mb-2">Name</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder-slate-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Subject</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a subject</option>
                <option value="booking">Booking Issues</option>
                <option value="support">Technical Support</option>
                <option value="damage">Damage Report</option>
                <option value="feedback">Feedback</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us how we can help..."
                required
                rows={6}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {submitted && (
              <div className="bg-green-500/20 border border-green-400/50 text-green-300 px-4 py-3 rounded-lg">
                ✓ Message sent! We'll get back to you soon.
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600"
            >
              Send Message
            </Button>
          </form>
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-12 text-center">Common Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'How quickly can I get a response?',
                a: 'We aim to respond to all emails within 2 hours during business hours. For urgent issues, call us anytime.',
              },
              {
                q: 'Do you offer technical support?',
                a: 'Yes! Our support team can help with app issues, bookings, payments, and scooter problems. Available 24/7.',
              },
              {
                q: 'What if I damage a scooter?',
                a: 'Report damage immediately through the app or by phone. We will assess and let you know about insurance coverage.',
              },
              {
                q: 'Can I modify or cancel a booking?',
                a: 'Yes! Changes are free up to 2 hours before rental. After that, cancellation fees may apply.',
              },
            ].map((item, i) => (
              <details
                key={i}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-6 cursor-pointer hover:bg-white/15 transition-all duration-300"
              >
                <summary className="font-semibold text-lg flex items-center justify-between">
                  {item.q}
                  <span>+</span>
                </summary>
                <p className="mt-4 text-slate-300 text-sm">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
