import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-slate-300">Manage PUNTA BIKERS operations and view analytics</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg p-6">
            <p className="text-slate-300 text-sm mb-2">Active Rentals</p>
            <p className="text-4xl font-bold">12</p>
            <p className="text-xs text-slate-400 mt-2">↑ 3 today</p>
          </div>
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg p-6">
            <p className="text-slate-300 text-sm mb-2">Revenue (Today)</p>
            <p className="text-4xl font-bold">$4,200</p>
            <p className="text-xs text-slate-400 mt-2">↑ 8% vs yesterday</p>
          </div>
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg p-6">
            <p className="text-slate-300 text-sm mb-2">Available Scooters</p>
            <p className="text-4xl font-bold">38</p>
            <p className="text-xs text-slate-400 mt-2">12 charging</p>
          </div>
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg p-6">
            <p className="text-slate-300 text-sm mb-2">Active Users</p>
            <p className="text-4xl font-bold">156</p>
            <p className="text-xs text-slate-400 mt-2">↑ 12 new</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Menu */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: '🛴', title: 'Scooters', desc: 'Manage fleet inventory', link: '/admin/scooters' },
                  { icon: '👥', title: 'Users', desc: 'View and manage users', link: '/admin/users' },
                  { icon: '📊', title: 'Reports', desc: 'View detailed analytics', link: '/admin/reports' },
                  { icon: '⚙️', title: 'Settings', desc: 'System configuration', link: '/admin/settings' },
                  { icon: '💰', title: 'Payments', desc: 'Financial records', link: '/admin/payments' },
                  { icon: '🆘', title: 'Support', desc: 'Handle tickets', link: '/admin/support' },
                ].map((item, i) => (
                  <Link key={i} href={item.link}>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all cursor-pointer">
                      <div className="text-3xl mb-2">{item.icon}</div>
                      <h3 className="font-bold mb-1">{item.title}</h3>
                      <p className="text-xs text-slate-400">{item.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {[
                  { time: '5 min ago', action: 'New rental started', detail: 'Xiaomi Pro Max #S001' },
                  { time: '12 min ago', action: 'Payment received', detail: '$400.00 from user #U234' },
                  { time: '28 min ago', action: 'Scooter maintenance', detail: 'Ninebot ES4 #S005' },
                  { time: '1 hour ago', action: 'User registration', detail: 'New account created' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 pb-4 border-b border-white/10 last:border-0">
                    <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="font-semibold">{item.action}</p>
                      <p className="text-sm text-slate-400">{item.detail}</p>
                    </div>
                    <p className="text-xs text-slate-400">{item.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* System Status */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm">API Status</p>
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm">Database</p>
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm">Stripe Connection</p>
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm">Email Service</p>
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button className="w-full bg-white/20 hover:bg-white/30 h-10 text-sm justify-start">
                  📢 Send Announcement
                </Button>
                <Button className="w-full bg-white/20 hover:bg-white/30 h-10 text-sm justify-start">
                  📋 Generate Report
                </Button>
                <Button className="w-full bg-white/20 hover:bg-white/30 h-10 text-sm justify-start">
                  🔔 View Alerts
                </Button>
              </div>
            </div>

            {/* Help */}
            <div className="backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-orange-500/20 border border-white/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-2">Need Help?</h3>
              <p className="text-sm text-slate-300 mb-4">
                Check the admin documentation or contact the development team.
              </p>
              <Button className="w-full bg-blue-500 hover:bg-blue-600 h-10 text-sm">
                📚 Documentation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
