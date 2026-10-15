import { Button } from '@/components/ui/button'

export default function RentalDetailsPage({ params }: { params: { id: string } }) {
  const rental = {
    id: params.id,
    scooter: 'Xiaomi Pro Max',
    model: 'XM-4000',
    status: 'Active',
    startTime: '2026-10-13 10:00 AM',
    endTime: '2026-10-13 4:00 PM (estimated)',
    duration: '6 hours',
    location: 'Puerto Escondido Center',
    cost: '$400.00',
    battery: '92%',
    distance: '24.5 km'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <a href="/dashboard/rentals" className="text-orange-400 hover:text-orange-300 text-sm mb-4 inline-block">
            ← Back to Rentals
          </a>
          <h1 className="text-4xl font-bold mb-2">Rental Details</h1>
          <p className="text-slate-300">Rental ID: {rental.id}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Status Card */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{rental.scooter}</h2>
                  <p className="text-slate-300">{rental.model}</p>
                </div>
                <span className="bg-green-500/20 text-green-300 px-4 py-2 rounded-full font-semibold">
                  {rental.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Start Time</p>
                  <p className="font-semibold">{rental.startTime}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">End Time</p>
                  <p className="font-semibold">{rental.endTime}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Duration</p>
                  <p className="font-semibold">{rental.duration}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Distance</p>
                  <p className="font-semibold">{rental.distance}</p>
                </div>
              </div>
            </div>

            {/* Live Status */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6">Live Status</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="font-semibold">Battery Level</p>
                    <p className="text-orange-400 font-bold">{rental.battery}</p>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <div className="bg-gradient-to-r from-orange-400 to-orange-500 h-3 rounded-full" style={{ width: rental.battery }}></div>
                  </div>
                </div>

                <div>
                  <p className="font-semibold mb-2">Current Location</p>
                  <p className="text-slate-300">{rental.location}</p>
                  <div className="mt-4 w-full aspect-video bg-gradient-to-br from-blue-500/20 to-orange-500/20 border border-white/20 rounded-lg flex items-center justify-center">
                    📍 Map view
                  </div>
                </div>
              </div>
            </div>

            {/* Trip History */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6">Trip Timeline</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-2 h-12 bg-gradient-to-b from-orange-400 to-transparent rounded-full flex-shrink-0 mt-1"></div>
                  <div>
                    <p className="font-semibold">Rental Started</p>
                    <p className="text-sm text-slate-300">10:00 AM - At Puerto Escondido Center</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-12 bg-gradient-to-b from-slate-400 to-transparent rounded-full flex-shrink-0 mt-1"></div>
                  <div>
                    <p className="font-semibold">In Progress</p>
                    <p className="text-sm text-slate-300">Currently riding - 24.5 km traveled</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cost Summary */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">Cost Summary</h3>
              <div className="space-y-3 mb-6 pb-6 border-b border-white/20">
                <div className="flex justify-between">
                  <p className="text-slate-300">6 hours @ $50/hr</p>
                  <p className="font-semibold">$300.00</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-slate-300">Security Deposit</p>
                  <p className="font-semibold">$100.00</p>
                </div>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <p>Total</p>
                <p className="text-orange-400">{rental.cost}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                className="w-full bg-white/20 hover:bg-white/30 h-11 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                aria-label="Contact support team"
              >
                📞 Contact Support
              </button>
              <button
                className="w-full bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 h-11 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Proceed to payment"
              >
                💳 Make Payment
              </button>
              <button
                className="w-full border border-red-500/30 text-red-400 hover:bg-red-500/10 h-11 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                aria-label="End this rental"
              >
                ❌ End Rental
              </button>
            </div>

            {/* Insurance Info */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                🛡️ Insurance
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Premium coverage included with your rental. Covers accidents and damages.
              </p>
              <a href="#" className="text-orange-400 hover:text-orange-300 text-sm font-semibold">
                View Policy →
              </a>
            </div>

            {/* Rules */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-3">📋 Rental Rules</h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>✓ Helmet required</li>
                <li>✓ Keep speed under 35 km/h</li>
                <li>✓ No off-road riding</li>
                <li>✓ Return in good condition</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
