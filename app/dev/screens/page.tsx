import Link from 'next/link'
import { Button } from '@/components/ui/button'

const screens = [
  {
    category: 'Public Pages',
    items: [
      { name: 'Home / Landing', path: '/', status: '✅ Done' },
      { name: 'Login', path: '/auth/login', status: '✅ Done' },
      { name: 'Signup', path: '/auth/signup', status: '✅ Done' },
      { name: 'Pricing', path: '/pricing', status: '🎨 Design' },
      { name: 'About', path: '/about', status: '🎨 Design' },
      { name: 'Contact', path: '/contact', status: '🎨 Design' },
      { name: 'Forgot Password', path: '/auth/forgot-password', status: '🎨 Design' },
    ]
  },
  {
    category: 'Dashboard - User',
    items: [
      { name: 'Dashboard Overview', path: '/dashboard', status: '✅ Done' },
      { name: 'Scooters List', path: '/dashboard/scooters', status: '✅ Done' },
      { name: 'Create Scooter', path: '/dashboard/scooters/new', status: '✅ Done' },
      { name: 'Rentals List', path: '/dashboard/rentals', status: '✅ Done' },
      { name: 'Create Rental', path: '/dashboard/rentals/new', status: '✅ Done' },
      { name: 'Rental Details', path: '/dashboard/rentals/1', status: '🎨 Design' },
      { name: 'Payments History', path: '/dashboard/payments', status: '🎨 Design' },
    ]
  },
  {
    category: 'Admin Panel',
    items: [
      { name: 'Admin Dashboard', path: '/admin', status: '🎨 Design' },
      { name: 'Reports & Analytics', path: '/admin/reports', status: '🎨 Design' },
    ]
  }
]

export default function ScreensHub() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
            PUNTA BIKERS UI Design Hub
          </h1>
          <p className="text-slate-300 text-lg">
            All screens in one place. Click to preview and design.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg p-4">
            <p className="text-3xl font-bold">10</p>
            <p className="text-slate-300 text-sm">Completed</p>
          </div>
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg p-4">
            <p className="text-3xl font-bold">7</p>
            <p className="text-slate-300 text-sm">To Design</p>
          </div>
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg p-4">
            <p className="text-3xl font-bold">17</p>
            <p className="text-slate-300 text-sm">Total Screens</p>
          </div>
        </div>

        {/* Screens by Category */}
        {screens.map((category) => (
          <div key={category.category} className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-blue-300">{category.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {category.items.map((screen) => (
                <Link key={screen.path} href={screen.path}>
                  <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg p-4 hover:bg-white/15 hover:border-white/30 transition-all cursor-pointer group">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold group-hover:text-blue-300 transition-colors">
                          {screen.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 font-mono">{screen.path}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ml-2 ${
                        screen.status.includes('Done')
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-orange-500/20 text-orange-300'
                      }`}>
                        {screen.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Design Notes */}
        <div className="backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-orange-500/20 border border-white/20 rounded-lg p-6 mt-12">
          <h3 className="text-xl font-bold mb-3">📋 Design Guidelines</h3>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li>✓ Use the existing design system (colors, spacing, typography)</li>
            <li>✓ Keep glassmorphism aesthetic (backdrop-blur + white/10 backgrounds)</li>
            <li>✓ Mobile-first responsive design (mobile, tablet, desktop)</li>
            <li>✓ Smooth animations and transitions (150-200ms)</li>
            <li>✓ Follow PUNTA BIKERS color scheme: Blue (#004E89) + Orange (#FF6B35)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
