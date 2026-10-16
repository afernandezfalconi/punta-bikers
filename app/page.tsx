import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-950 overflow-hidden" style={{ scrollBehavior: 'smooth', fontFamily: 'Montserrat, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap');
        h1, h2, h3, h4, h5, h6 { font-family: 'Cormorant', serif; font-weight: 700; letter-spacing: -0.02em; }
        .premium-gold { color: #A16207; }
        .premium-accent { background-color: #A16207; }
        .premium-dark { background-color: #1C1917; color: white; }
        .premium-secondary { background-color: #44403C; color: white; }
      `}</style>

      {/* Navigation */}
      <nav className="relative z-10 bg-white border-b border-stone-200 sticky top-0 backdrop-blur-sm bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold premium-gold">PUNTA</h1>
          <div className="hidden md:flex gap-12 text-sm font-medium">
            <a href="#features" className="hover:premium-gold transition-colors duration-300 hover:text-amber-700">Features</a>
            <a href="#pricing" className="hover:premium-gold transition-colors duration-300 hover:text-amber-700">Pricing</a>
            <a href="#about" className="hover:premium-gold transition-colors duration-300 hover:text-amber-700">About</a>
          </div>
          <div className="flex gap-3 sm:gap-4">
            <Link href="/auth/login">
              <Button variant="outline" className="border-stone-300 hover:border-amber-700 hover:text-amber-700 text-xs sm:text-sm h-10 px-4">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="premium-accent text-white text-xs sm:text-sm h-10 px-6 font-semibold hover:bg-amber-800 transition-all duration-300 shadow-md">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32">
        <div className="text-center space-y-8 sm:space-y-12 mb-24 sm:mb-32">
          <div className="space-y-6 sm:space-y-8">
            <div className="inline-block px-4 py-2 border border-amber-700 text-amber-700 text-sm font-semibold tracking-widest">
              PREMIUM SCOOTERS
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold leading-tight max-w-4xl mx-auto" style={{ textWrap: 'balance' }}>
              Explore Puerto Escondido
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-stone-600 max-w-3xl mx-auto px-2 leading-relaxed font-light">
              Experience the art of premium scooter travel. Discover Puerto Escondido's hidden corners with our meticulously maintained collection. White-glove service, flexible rates, and concierge support 24/7.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
            <Link href="/auth/signup" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto h-14 px-10 bg-stone-950 hover:bg-black text-white font-semibold text-base transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer border border-stone-950">
                Reserve Now
              </button>
            </Link>
            <Link href="#pricing" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto h-14 px-10 premium-accent text-white font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-amber-800 border border-amber-700">
                View Plans
              </button>
            </Link>
          </div>
        </div>

        {/* Premium Features Section */}
        <div id="features" className="py-24 sm:py-32 border-y border-stone-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            {[
              {
                icon: '✦',
                title: 'Seamless Booking',
                description: 'Intuitive online platform. Reserve in seconds. Digital keys delivered instantly.',
              },
              {
                icon: '🛡️',
                title: 'Full Protection',
                description: 'Premium insurance included. 24/7 roadside assistance. Protection against all damage.',
              },
              {
                icon: '★',
                title: 'Concierge Service',
                description: 'Personal assistance. Local recommendations. VIP treatment included in every rental.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group space-y-6 border-l-4 border-amber-700 pl-6 sm:pl-8 hover:border-amber-600 transition-all duration-300 cursor-pointer"
                role="button"
                tabIndex={0}
              >
                <div className="text-4xl sm:text-5xl premium-gold group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl font-bold">{feature.title}</h3>
                  <p className="text-stone-600 text-base leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div id="pricing" className="py-24 sm:py-32">
          <div className="text-center mb-16 sm:mb-20 space-y-6">
            <h2 className="text-5xl sm:text-6xl font-bold" style={{ textWrap: 'balance' }}>Transparent Pricing</h2>
            <p className="text-stone-600 text-lg max-w-2xl mx-auto">Choose the rental plan that matches your travel style. No hidden fees.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            {[
              {
                name: 'Daily',
                price: '$350–450',
                period: 'per day',
                features: [
                  'Full-day rental access',
                  'Helmet & lock included',
                  'Basic insurance coverage',
                  'GPS tracking included',
                  '24/7 support',
                ],
                highlighted: false,
              },
              {
                name: 'Weekly',
                price: '$2,100',
                period: '7 days',
                features: [
                  'Unlimited daily rentals',
                  'Premium insurance included',
                  'Priority concierge support',
                  'Free helmet & gear upgrade',
                  'Flexible cancellation policy',
                ],
                highlighted: true,
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`border transition-all duration-300 ${
                  plan.highlighted
                    ? 'premium-dark border-amber-700 shadow-2xl relative group'
                    : 'bg-white border-stone-300 hover:border-amber-700'
                } p-8 sm:p-12`}
              >
                {plan.highlighted && (
                  <div className="absolute top-4 right-4 bg-amber-700 text-white px-4 py-1 text-xs font-bold tracking-widest">
                    POPULAR
                  </div>
                )}
                <div className="space-y-8">
                  <div>
                    <h3 className={`text-3xl font-bold mb-4 ${plan.highlighted ? 'premium-gold' : ''}`}>{plan.name}</h3>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className={`text-5xl sm:text-6xl font-bold ${plan.highlighted ? 'text-white' : ''}`}>{plan.price}</span>
                      <span className={`text-base ${plan.highlighted ? 'text-stone-400' : 'text-stone-600'}`}>/ {plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {plan.features.map((feature, j) => (
                      <li key={j} className={`flex items-start gap-4 text-base ${plan.highlighted ? 'text-stone-200' : 'text-stone-700'}`}>
                        <span className="premium-gold font-bold flex-shrink-0 text-xl">+</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full py-4 font-semibold text-base transition-all duration-300 ${
                      plan.highlighted
                        ? 'premium-accent text-white hover:bg-amber-800 shadow-lg'
                        : 'border border-stone-300 hover:border-amber-700 hover:text-amber-700'
                    }`}
                  >
                    Choose Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 py-24 sm:py-32 border-t border-stone-200">
          {[
            { label: 'Premium Scooters', value: '50+' },
            { label: 'Satisfied Travelers', value: '2000+' },
            { label: 'City Coverage', value: '100%' },
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center space-y-4 hover:border-amber-700 transition-all duration-300 pb-6 border-b border-stone-200 md:border-b-0"
            >
              <p className="text-6xl sm:text-7xl font-bold premium-gold">
                {stat.value}
              </p>
              <p className="text-stone-600 text-lg font-light tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="premium-dark border-2 border-amber-700 py-20 sm:py-24 px-8 sm:px-12 text-center space-y-8">
          <div className="space-y-6">
            <p className="text-amber-700 font-bold tracking-widest text-sm">LIMITED AVAILABILITY</p>
            <h3 className="text-5xl sm:text-6xl font-bold">Ready to Explore?</h3>
            <p className="text-lg text-stone-300 max-w-3xl mx-auto leading-relaxed">
              Join the community of discerning travelers discovering Puerto Escondido's hidden gems. From sunrise rides to sunset escapes—every moment is curated for luxury.
            </p>
          </div>
          <Link href="/auth/signup" className="inline-block">
            <Button size="lg" className="premium-accent text-white h-14 px-12 text-base font-semibold hover:bg-amber-800 shadow-2xl transition-all duration-300 hover:shadow-3xl">
              Reserve Your Scooter Today
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="premium-dark border-t-2 border-amber-700 mt-0 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-2xl font-bold premium-gold mb-4">PUNTA</h4>
              <p className="text-stone-400 text-sm">Premium scooter experiences in Puerto Escondido.</p>
            </div>
            <div className="space-y-3">
              <p className="text-white font-semibold text-sm">COMPANY</p>
              <ul className="space-y-2 text-sm text-stone-400">
                <li><a href="#" className="hover:premium-gold transition-colors">About Us</a></li>
                <li><a href="#" className="hover:premium-gold transition-colors">Safety</a></li>
                <li><a href="#" className="hover:premium-gold transition-colors">Support</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <p className="text-white font-semibold text-sm">LEGAL</p>
              <ul className="space-y-2 text-sm text-stone-400">
                <li><a href="#" className="hover:premium-gold transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:premium-gold transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:premium-gold transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-700 pt-8 text-center text-stone-500 text-xs">
            <p>&copy; 2026 PUNTA BIKERS. All rights reserved. Premium Scooter Rentals.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
