import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-slate-300 text-xl">Choose the plan that fits your needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              name: 'Hourly Rental',
              price: '$5–8',
              period: 'per hour',
              icon: '⏱️',
              features: [
                'Pay per hour',
                'Helmet & lock included',
                'Basic insurance',
                '24/7 support',
                'Cancel anytime'
              ],
              highlighted: false
            },
            {
              name: 'Daily Rental',
              price: '$350–450',
              period: 'per day',
              icon: '☀️',
              features: [
                'Full-day unlimited access',
                'Helmet & lock included',
                'Premium insurance',
                'Priority support',
                'Free cancellation',
                'Map & navigation'
              ],
              highlighted: true
            },
            {
              name: 'Weekly Pass',
              price: '$2,100',
              period: '7 days',
              icon: '📅',
              features: [
                'Unlimited daily rentals',
                'Premium insurance',
                'VIP support',
                'Free helmet upgrade',
                'Flexible cancellation',
                'Discount on extras'
              ],
              highlighted: false
            }
          ].map((plan, i) => (
            <div
              key={i}
              className={`backdrop-blur-xl border rounded-2xl p-8 transition-all duration-300 ${
                plan.highlighted
                  ? 'bg-gradient-to-br from-blue-500/30 to-orange-500/30 border-orange-400/50 ring-2 ring-orange-400/30 scale-105'
                  : 'bg-white/10 border-white/20 hover:bg-white/15'
              }`}
            >
              <div className="text-4xl mb-4">{plan.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-slate-300 ml-2">/ {plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3 text-slate-300">
                    <span className="text-orange-400">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full h-11 font-semibold ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600'
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'Can I cancel my rental?', a: 'Yes! All plans offer flexible cancellation.' },
              { q: 'Is insurance included?', a: 'Yes, basic insurance is included in all plans.' },
              { q: 'What payment methods do you accept?', a: 'We accept credit cards and digital wallets.' },
              { q: 'Do you offer group discounts?', a: 'Contact our team for custom group pricing.' },
            ].map((item, i) => (
              <div key={i}>
                <p className="font-semibold text-blue-300">{item.q}</p>
                <p className="text-slate-300 mt-1">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
