'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Rental {
  id: string
  scooter_id: string
  customer_id: string
  rental_start_date: string
  rental_end_date: string
  rental_status: string
  subtotal: string
  created_at: string
}

const statusBadgeColor: Record<string, string> = {
  PENDING_DOC: 'bg-yellow-100 text-yellow-800',
  PENDING_PAYMENT: 'bg-orange-100 text-orange-800',
  ACTIVE: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

export default function AdminRentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        // In a real app, this would fetch from /api/admin/rentals
        setRentals([])
      } catch (err) {
        console.error('Failed to fetch rentals:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRentals()
  }, [filter])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading rentals...</div>
  }

  const filteredRentals = filter === 'ALL' ? rentals : rentals.filter((r) => r.rental_status === filter)

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Rental Management</h1>
        <p className="text-gray-600">View and manage all rental bookings</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['ALL', 'PENDING_DOC', 'PENDING_PAYMENT', 'ACTIVE', 'COMPLETED', 'CANCELLED'].map(
          (status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              onClick={() => setFilter(status)}
            >
              {status.replace(/_/g, ' ')}
            </Button>
          )
        )}
      </div>

      {/* Rentals Table */}
      {rentals.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">No rentals found</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2 px-4">Rental ID</th>
                    <th className="text-left py-2 px-4">Customer</th>
                    <th className="text-left py-2 px-4">Dates</th>
                    <th className="text-left py-2 px-4">Amount</th>
                    <th className="text-left py-2 px-4">Status</th>
                    <th className="text-left py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRentals.map((rental) => (
                    <tr key={rental.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold">{rental.id.slice(0, 8)}</td>
                      <td className="py-3 px-4">{rental.customer_id.slice(0, 8)}</td>
                      <td className="py-3 px-4 text-xs">
                        {new Date(rental.rental_start_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-semibold">${rental.subtotal}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            statusBadgeColor[rental.rental_status]
                          }`}
                        >
                          {rental.rental_status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Link href={`/app/rentals/${rental.id}`}>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
