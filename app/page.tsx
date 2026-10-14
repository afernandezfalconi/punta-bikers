import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 backdrop-blur-md bg-white/10 border-b border-white/20 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
            PUNTA
          </h1>
          <div className="hidden md:flex gap-8 text-sm">
            <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-blue-400 transition-colors">Pricing</a>
            <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Link href="/auth/login">
              <Button variant="outline" className="border-white/30 hover:bg-white/10 text-xs sm:text-sm h-9 sm:h-10 px-2 sm:px-4">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center space-y-6 sm:space-y-8 mb-16 sm:mb-20">
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold leading-tight">
              Explore Puerto Escondido
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto px-2">
              Rent premium scooters and discover the beauty of Puerto Escondido. Flexible daily rates, instant booking, and 24/7 support.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/signup" className="w-full sm:w-auto">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 w-full sm:w-auto h-12 sm:h-11 text-base">
                Start Renting
              </Button>
            </Link>
            <Link href="#pricing" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="border-white/30 hover:bg-white/10 w-full sm:w-auto h-12 sm:h-11 text-base">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>

        {/* Glass Cards Section */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-16 sm:mb-20">
          {[
            {
              icon: '⚡',
              title: 'Instant Booking',
              description: 'Book a scooter in minutes with our seamless online platform',
            },
            {
              icon: '🔒',
              title: 'Safe & Secure',
              description: 'Flexible deposits and comprehensive insurance coverage',
            },
            {
              icon: '🌍',
              title: '24/7 Support',
              description: 'Our team is always here to help you anytime',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-8 hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 touch-manipulation"
            >
              <div className="text-3xl sm:text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Pricing Section */}
        <div id="pricing" className="mb-16 sm:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Simple, Transparent Pricing</h3>
            <p className="text-slate-300 text-sm sm:text-base">Choose the plan that fits your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {[
              {
                name: 'Daily Rental',
                price: '$350–450',
                period: 'per day',
                features: [
                  'Full-day rental access',
                  'Helmet & lock included',
                  '$2,000 security deposit (MX only)',
                  'Basic insurance',
                  '24/7 support',
                ],
                highlighted: false,
              },
              {
                name: 'Weekly Pass',
                price: '$2,100',
                period: '7 days',
                features: [
                  'Unlimited daily rentals',
                  'Premium insurance',
                  'Priority support',
                  'Free helmet upgrade',
                  'Flexible cancellation',
                ],
                highlighted: true,
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`backdrop-blur-xl border rounded-2xl p-6 sm:p-8 transition-all duration-300 touch-manipulation ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-blue-500/20 to-orange-500/20 border-blue-400/50 ring-2 ring-orange-400/30'
                    : 'bg-white/10 border-white/20 hover:bg-white/15'
                }`}
              >
                <h4 className="text-xl sm:text-2xl font-bold mb-2">{plan.name}</h4>
                <div className="mb-6">
                  <span className="text-3xl sm:text-4xl font-bold">{plan.price}</span>
                  <span className="text-slate-300 text-sm ml-2">/ {plan.period}</span>
                </div>
                <ul className="space-y-2 sm:space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3 text-slate-300 text-sm sm:text-base">
                      <span className="text-orange-400 flex-shrink-0">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full h-12 sm:h-11 text-base ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600'
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  Choose Plan
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-16 sm:mb-20">
          {[
            { label: 'Scooters Available', value: '50+' },
            { label: 'Happy Customers', value: '2000+' },
            { label: 'City Coverage', value: '100%' },
          ].map((stat, i) => (
            <div
              key={i}
              className="backdrop-blur-xl bg-white/5 border border-white/20 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300 touch-manipulation"
            >
              <p className="text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text mb-2">
                {stat.value}
              </p>
              <p className="text-slate-300 text-sm sm:text-base">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-orange-500/20 border border-white/20 rounded-3xl p-8 sm:p-12 text-center">
          <h3 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Ready to explore?</h3>
          <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Join thousands of travelers discovering Puerto Escondido on two wheels
          </p>
          <Link href="/auth/signup" className="inline-block w-full sm:w-auto">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 w-full sm:w-auto h-12 sm:h-11 text-base">
              Start Your Journey Today
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 backdrop-blur-md bg-white/5 border-t border-white/20 mt-16 sm:mt-20 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-slate-400 text-xs sm:text-sm">
          <p>&copy; 2026 PUNTA BIKERS. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 sm:gap-6 justify-center mt-4 text-xs">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
