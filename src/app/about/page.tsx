import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About PUNTA BIKERS</h1>
          <p className="text-xl text-slate-300">
            Bringing freedom and adventure to Puerto Escondido, one scooter at a time
          </p>
        </div>

        {/* Story */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-12 mb-12">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="space-y-4 text-slate-300 leading-relaxed">
            <p>
              PUNTA BIKERS was born from a simple idea: make it easy for visitors and locals to explore Puerto Escondido on scooters. Our founder, a long-time resident of this beautiful coastal town, saw the need for a reliable, transparent scooter rental service that locals could trust.
            </p>
            <p>
              What started as a small fleet of 5 scooters has grown to over 50 well-maintained vehicles, serving thousands of satisfied customers every year. We're committed to providing safe, affordable, and hassle-free rentals so you can focus on what matters — discovering the beauty around you.
            </p>
          </div>
        </div>

        {/* Mission & Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              title: 'Our Mission',
              icon: '🎯',
              description: 'To provide accessible, affordable, and safe scooter rentals that help people explore Puerto Escondido with confidence.',
            },
            {
              title: 'Our Values',
              icon: '💎',
              description: 'Safety first, transparency always, community-driven. We treat every customer like family and stand by our commitments.',
            },
            {
              title: 'Our Commitment',
              icon: '✨',
              description: 'Regular maintenance, world-class support, and a passion for sustainable tourism. Your satisfaction is our success.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-slate-300 text-sm">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Team Highlights */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-12 mb-12">
          <h2 className="text-3xl font-bold mb-8">Why Choose Us?</h2>
          <ul className="space-y-4 text-slate-300">
            {[
              'Well-maintained scooters with regular safety inspections',
              '24/7 customer support in Spanish and English',
              'Transparent pricing with no hidden fees',
              'Flexible deposit policies for all visitors',
              '100% city coverage — pickup and dropoff anywhere',
              'Integration with major hotel networks',
              'Comprehensive insurance options',
              'Quick booking process (minutes to hours)',
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-4">
                <span className="text-orange-400 text-2xl">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-orange-500/20 border border-white/20 rounded-3xl p-12 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Experience Puerto Escondido?</h3>
          <p className="text-slate-300 mb-8">
            Join thousands of happy customers who've discovered the magic of our coastal town on two wheels.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600">
              Book Your Scooter Today
            </Button>
          </Link>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-20">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-3 text-slate-300 text-sm">
              <p>📞 +52 954 582 XXXX</p>
              <p>📧 hello@puntabikers.com</p>
              <p>📍 Puerto Escondido, Oaxaca, Mexico</p>
            </div>
          </div>
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-4">Hours</h3>
            <div className="space-y-2 text-slate-300 text-sm">
              <p>Monday – Friday: 9am – 8pm</p>
              <p>Saturday – Sunday: 8am – 9pm</p>
              <p>24/7 Emergency Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
