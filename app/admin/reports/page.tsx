import { Button } from '@/components/ui/button'

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <a href="/admin" className="text-orange-400 hover:text-orange-300 text-sm mb-4 inline-block">
            ← Back to Admin
          </a>
          <h1 className="text-4xl font-bold mb-2">Reports & Analytics</h1>
          <p className="text-slate-300">Comprehensive business insights and performance metrics</p>
        </div>

        {/* Date Range & Export */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex gap-2">
            <input
              type="date"
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-orange-400 outline-none"
            />
            <input
              type="date"
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-orange-400 outline-none"
            />
          </div>
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" className="border-white/30 hover:bg-white/10">
              📊 Export CSV
            </Button>
            <Button variant="outline" className="border-white/30 hover:bg-white/10">
              📥 Export PDF
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Revenue', value: '$128,450', change: '+12.5% vs last month' },
            { label: 'Total Rentals', value: '2,341', change: '+8.2% vs last month' },
            { label: 'Avg Rental Duration', value: '4.2 hrs', change: '-5% shorter' },
            { label: 'Avg Rating', value: '4.8/5.0', change: '+0.3 points' },
          ].map((metric, i) => (
            <div key={i} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg p-6">
              <p className="text-slate-300 text-sm mb-2">{metric.label}</p>
              <p className="text-3xl font-bold">{metric.value}</p>
              <p className="text-xs text-slate-400 mt-2">{metric.change}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Revenue Trend</h2>
            <div className="h-64 bg-gradient-to-br from-blue-500/20 to-orange-500/20 rounded-lg flex items-center justify-center">
              📈 Chart placeholder
            </div>
          </div>

          {/* Rentals by Hour */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Rentals by Hour</h2>
            <div className="h-64 bg-gradient-to-br from-blue-500/20 to-orange-500/20 rounded-lg flex items-center justify-center">
              📊 Chart placeholder
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Scooters */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Most Popular Scooters</h2>
            <div className="space-y-4">
              {[
                { name: 'Xiaomi Pro Max', rentals: 342, rating: 4.9 },
                { name: 'Ninebot Plus', rentals: 298, rating: 4.7 },
                { name: 'Segway ES4', rentals: 267, rating: 4.6 },
              ].map((scooter, i) => (
                <div key={i} className="flex items-center justify-between pb-4 border-b border-white/10 last:border-0">
                  <div>
                    <p className="font-semibold">{scooter.name}</p>
                    <p className="text-sm text-slate-400">{scooter.rentals} rentals</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">⭐ {scooter.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Demographics */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">User Demographics</h2>
            <div className="space-y-4">
              {[
                { range: '18-25', percentage: 35, count: 547 },
                { range: '26-35', percentage: 28, count: 438 },
                { range: '36-45', percentage: 22, count: 344 },
                { range: '46+', percentage: 15, count: 234 },
              ].map((demo, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-semibold">{demo.range} years</p>
                    <p className="text-sm text-slate-400">{demo.count} users</p>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full"
                      style={{ width: `${demo.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Performance Table */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Hourly Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-4">Hour</th>
                  <th className="text-right py-3 px-4">Rentals</th>
                  <th className="text-right py-3 px-4">Revenue</th>
                  <th className="text-right py-3 px-4">Avg Duration</th>
                  <th className="text-right py-3 px-4">Avg Rating</th>
                </tr>
              </thead>
              <tbody>
                {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00'].map((hour, i) => (
                  <tr key={i} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-3 px-4">{hour}</td>
                    <td className="py-3 px-4 text-right">{28 + i * 5}</td>
                    <td className="py-3 px-4 text-right">${(140 + i * 25).toFixed(0)}</td>
                    <td className="py-3 px-4 text-right">4.{2 + i} hrs</td>
                    <td className="py-3 px-4 text-right">4.{7 + (i % 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Custom Report */}
        <div className="backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-orange-500/20 border border-white/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Generate Custom Report</h2>
          <p className="text-slate-300 mb-6">Create a detailed report with specific filters and metrics</p>
          <Button className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600">
            📝 Create Custom Report
          </Button>
        </div>
      </div>
    </div>
  )
}
