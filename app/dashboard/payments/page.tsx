import { Button } from '@/components/ui/button'

export default function PaymentsPage() {
  const payments = [
    {
      id: 'PAY-001',
      rental: 'Xiaomi Pro Max',
      amount: '$400.00',
      date: '2026-10-13',
      status: 'Completed',
      method: 'Mercado Pago'
    },
    {
      id: 'PAY-002',
      rental: 'Ninebot Plus',
      amount: '$350.00',
      date: '2026-10-12',
      status: 'Completed',
      method: 'Mercado Pago'
    },
    {
      id: 'PAY-003',
      rental: 'Segway ES4',
      amount: '$425.00',
      date: '2026-10-11',
      status: 'Pending',
      method: 'Mercado Pago'
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Payment History</h1>
          <p className="text-slate-300">View all your rental payments</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg p-6">
            <p className="text-slate-300 text-sm mb-2">Total Spent</p>
            <p className="text-3xl font-bold">$1,175</p>
          </div>
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg p-6">
            <p className="text-slate-300 text-sm mb-2">Completed Payments</p>
            <p className="text-3xl font-bold">2</p>
          </div>
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg p-6">
            <p className="text-slate-300 text-sm mb-2">Pending Payments</p>
            <p className="text-3xl font-bold">1</p>
          </div>
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg p-6">
            <p className="text-slate-300 text-sm mb-2">Next Due</p>
            <p className="text-3xl font-bold">-</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-8" role="group" aria-label="Filter payments by status">
          {['All', 'Completed', 'Pending'].map((filter) => (
            <button
              key={filter}
              className={`h-10 px-4 rounded-lg transition-all duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                filter === 'All'
                  ? 'bg-orange-500/30 border border-orange-400/50 hover:bg-orange-500/40'
                  : 'bg-white/10 border border-white/20 hover:bg-white/15'
              }`}
              aria-pressed={filter === 'All'}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Payments Table */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg overflow-hidden">
          <div className="overflow-x-auto" role="region" aria-label="Payments table with scrollable content">
            <table className="w-full" role="table">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Rental</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-slate-300">{payment.id}</td>
                    <td className="px-6 py-4 text-sm">{payment.rental}</td>
                    <td className="px-6 py-4 text-sm font-semibold">{payment.amount}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{payment.date}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        payment.status === 'Completed'
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-orange-400 hover:text-orange-300 font-semibold text-xs">
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoice Request */}
        <div className="mt-8 backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-orange-500/20 border border-white/20 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-2">Need an invoice?</h3>
          <p className="text-slate-300 mb-4">Download invoices for your records</p>
          <Button className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600">
            Download All Invoices
          </Button>
        </div>
      </div>
    </div>
  )
}
