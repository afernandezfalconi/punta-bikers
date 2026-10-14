import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">Pricing Plans</h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-12">
          Choose from our flexible pricing options. No hidden fees, no surprises.
        </p>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            {
              name: 'Hourly',
              price: '$50',
              period: 'per hour',
              description: 'Perfect for quick trips',
              features: [
                'Hourly rental access',
                'Helmet & lock included',
                'Mobile support',
                'Fuel not included',
              ],
              cta: 'Get Started',
              highlighted: false,
            },
            {
              name: 'Daily',
              price: '$350–450',
              period: 'per day',
              description: 'Most popular choice',
              features: [
                'Full-day rental access',
                'Helmet & lock included',
                '$2,000 security deposit (MX only)',
                'Basic insurance',
                '24/7 phone support',
                'Free fuel',
              ],
              cta: 'Book Now',
              highlighted: true,
            },
            {
              name: 'Weekly',
              price: '$2,100',
              period: '7 days',
              description: 'Best value',
              features: [
                'Unlimited daily rentals',
                'Premium insurance',
                'Priority phone support',
                'Free helmet upgrade',
                'Flexible cancellation',
                'Free parking at hotels',
              ],
              cta: 'Get Weekly Pass',
              highlighted: false,
            },
          ].map((plan, i) => (
            <div
              key={i}
              className={`backdrop-blur-xl border rounded-3xl p-8 transition-all duration-300 ${
                plan.highlighted
                  ? 'bg-gradient-to-br from-blue-500/20 to-orange-500/20 border-blue-400/50 ring-2 ring-orange-400/30 md:scale-105'
                  : 'bg-white/10 border-white/20 hover:bg-white/15'
              }`}
            >
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-slate-300 text-sm mb-6">{plan.description}</p>
              <div className="mb-8">
                <span className="text-5xl font-bold">{plan.price}</span>
                <span className="text-slate-300 ml-2">/ {plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3 text-slate-300 text-sm">
                    <span className="text-orange-400">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup">
                <Button
                  className={`w-full ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600'
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-left max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. We also offer installment plans for longer rentals.',
              },
              {
                q: 'Is there a deposit required?',
                a: 'Yes, Mexican customers require a $2,000 security deposit. Foreign customers are not required to pay a deposit but must provide valid ID and travel documents.',
              },
              {
                q: 'What is included in the rental?',
                a: 'All rentals include a helmet, lock, basic insurance, and 24/7 customer support. Fuel is included in all daily and weekly plans.',
              },
              {
                q: 'Can I cancel my booking?',
                a: 'Daily rentals can be cancelled free of charge up to 2 hours before the rental start time. Weekly plans have flexible cancellation within 7 days of purchase.',
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
