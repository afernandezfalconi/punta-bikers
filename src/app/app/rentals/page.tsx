'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Rental {
  id: string
  scooter_id: string
  rental_start_date: string
  rental_end_date: string
  rental_status: string
  subtotal: string
  deposit_amount: string
  price_per_day: string
}

const statusBadgeColor: Record<string, string> = {
  PENDING_DOC: 'bg-yellow-100 text-yellow-800',
  PENDING_PAYMENT: 'bg-orange-100 text-orange-800',
  ACTIVE: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

export default function RentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await fetch('/api/rentals')
        const result = await response.json()
        if (result.success) {
          setRentals(result.data || [])
        }
      } catch (err) {
        console.error('Failed to fetch rentals:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRentals()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading rentals...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">My Rentals</h1>
          <p className="text-gray-600 mt-1">Manage your scooter rentals</p>
        </div>
        <Link href="/app/scooters">
          <Button>Book a Scooter</Button>
        </Link>
      </div>

      {rentals.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">You haven't booked any scooters yet</p>
            <Link href="/app/scooters">
              <Button>Browse Available Scooters</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {rentals.map(rental => (
            <Card key={rental.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Rental #{rental.id.slice(0, 8)}</CardTitle>
                    <CardDescription>
                      {new Date(rental.rental_start_date).toLocaleDateString()} -{' '}
                      {new Date(rental.rental_end_date).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      statusBadgeColor[rental.rental_status] || 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {rental.rental_status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Daily Rate</p>
                    <p className="text-lg font-semibold">${rental.price_per_day}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Subtotal</p>
                    <p className="text-lg font-semibold">${rental.subtotal}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Deposit</p>
                    <p className="text-lg font-semibold">${rental.deposit_amount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-lg font-semibold">
                      ${parseFloat(rental.subtotal) + parseFloat(rental.deposit_amount)}
                    </p>
                  </div>
                </div>

                {rental.rental_status === 'PENDING_PAYMENT' && (
                  <Link href={`/app/rentals/${rental.id}/payment`}>
                    <Button className="w-full">Complete Payment</Button>
                  </Link>
                )}

                {rental.rental_status === 'PENDING_DOC' && (
                  <Link href={`/app/rentals/${rental.id}/documents`}>
                    <Button className="w-full">Upload Documents</Button>
                  </Link>
                )}

                {rental.rental_status === 'ACTIVE' && (
                  <p className="text-center text-green-600 text-sm">Rental in progress</p>
                )}

                {rental.rental_status === 'COMPLETED' && (
                  <p className="text-center text-blue-600 text-sm">Rental completed</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
