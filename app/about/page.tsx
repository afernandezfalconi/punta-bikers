import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Hero */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold mb-4">About PUNTA BIKERS</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Discovering Puerto Escondido, one ride at a time
          </p>
        </div>

        {/* Story */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-12 mb-16">
          <h2 className="text-3xl font-bold mb-6 text-blue-300">Our Story</h2>
          <p className="text-slate-300 text-lg leading-relaxed mb-4">
            PUNTA BIKERS started with a simple idea: making it easier for travelers and locals to explore Puerto Escondido on electric scooters. What began as a passion project has grown into the most trusted scooter rental service on the coast.
          </p>
          <p className="text-slate-300 text-lg leading-relaxed">
            We believe that sustainable mobility shouldn't be complicated. That's why we've built the easiest, safest, and most reliable scooter rental platform in the region.
          </p>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-blue-300">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '🌱',
                title: 'Sustainability',
                description: 'Electric scooters mean zero emissions and a cleaner Puerto Escondido'
              },
              {
                icon: '🛡️',
                title: 'Safety First',
                description: 'Every scooter is maintained to the highest standards with full insurance'
              },
              {
                icon: '💝',
                title: 'Community',
                description: 'We support local businesses and give back to Puerto Escondido'
              }
            ].map((value, i) => (
              <div key={i} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-slate-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-12 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-blue-300">Meet the Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: 'Carlos García',
                role: 'Founder & CEO',
                bio: 'Puerto Escondido native with 10+ years in tourism and sustainable mobility'
              },
              {
                name: 'María López',
                role: 'Operations Manager',
                bio: 'Ensures every scooter is perfect and every customer is happy'
              }
            ].map((member, i) => (
              <div key={i} className="border border-white/20 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                <p className="text-orange-400 text-sm mb-3">{member.role}</p>
                <p className="text-slate-300">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16">
          {[
            { label: 'Scooters', value: '50+' },
            { label: 'Happy Customers', value: '2,000+' },
            { label: 'Rides Completed', value: '10,000+' },
            { label: 'Years Operating', value: '5' }
          ].map((stat, i) => (
            <div key={i} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg p-6 text-center">
              <p className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text">
                {stat.value}
              </p>
              <p className="text-slate-300 text-sm mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-slate-300 mb-6 text-lg">
            Experience Puerto Escondido on two wheels
          </p>
          <Link href="/auth/signup">
            <Button className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 h-12 px-8 text-base font-semibold">
              Get Started Today
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
