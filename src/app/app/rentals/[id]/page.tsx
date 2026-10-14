'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Rental {
  id: string
  scooter_id: string
  rental_start_date: string
  rental_end_date: string
  rental_status: string
  subtotal: string
  deposit_amount: string
  price_per_day: string
  total_days: number
}

const statusSteps = {
  PENDING_DOC: { label: 'Upload Documents', step: 1, color: 'bg-yellow-100 text-yellow-800' },
  PENDING_PAYMENT: { label: 'Complete Payment', step: 2, color: 'bg-orange-100 text-orange-800' },
  ACTIVE: { label: 'Rental Active', step: 3, color: 'bg-green-100 text-green-800' },
  COMPLETED: { label: 'Completed', step: 4, color: 'bg-blue-100 text-blue-800' },
  CANCELLED: { label: 'Cancelled', step: 0, color: 'bg-red-100 text-red-800' },
}

export default function RentalDetailPage() {
  const params = useParams()
  const router = useRouter()
  const rentalId = params?.id as string

  const [rental, setRental] = useState<Rental | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRental = async () => {
      try {
        const response = await fetch(`/api/rentals`)
        const result = await response.json()
        if (result.success && result.data) {
          const found = result.data.find((r: Rental) => r.id === rentalId)
          if (found) {
            setRental(found)
          }
        }
      } catch (err) {
        console.error('Failed to fetch rental:', err)
      } finally {
        setLoading(false)
      }
    }

    if (rentalId) {
      fetchRental()
    }
  }, [rentalId])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading rental details...</div>
  }

  if (!rental) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600 mb-4">Rental not found</p>
            <Link href="/app/rentals">
              <Button>Back to Rentals</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalAmount = parseFloat(rental.subtotal) + parseFloat(rental.deposit_amount)
  const statusInfo = statusSteps[rental.rental_status as keyof typeof statusSteps]

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Rental #{rental.id.slice(0, 8)}</h1>
          <p className="text-gray-600">
            {new Date(rental.rental_start_date).toLocaleDateString()} -{' '}
            {new Date(rental.rental_end_date).toLocaleDateString()}
          </p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusInfo?.color}`}>
          {statusInfo?.label}
        </span>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {Object.entries(statusSteps)
              .filter(([_, info]) => info.step > 0)
              .map(([status, info]) => (
                <div
                  key={status}
                  className={`flex flex-col items-center ${
                    info.step <= (statusInfo?.step || 0) ? 'opacity-100' : 'opacity-50'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${
                      info.step <= (statusInfo?.step || 0)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {info.step}
                  </div>
                  <p className="text-xs text-center font-semibold">{info.label}</p>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Rental Details */}
      <Card>
        <CardHeader>
          <CardTitle>Rental Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Daily Rate</p>
            <p className="text-2xl font-bold">${rental.price_per_day}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Days</p>
            <p className="text-2xl font-bold">{rental.total_days}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Subtotal</p>
            <p className="text-2xl font-bold">${rental.subtotal}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Security Deposit</p>
            <p className="text-2xl font-bold">${rental.deposit_amount}</p>
          </div>
          <div className="col-span-2 border-t pt-4">
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-3xl font-bold">${totalAmount.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        {rental.rental_status === 'PENDING_DOC' && (
          <Link href={`/app/rentals/${rental.id}/documents`} className="flex-1">
            <Button className="w-full">Upload Documents</Button>
          </Link>
        )}

        {rental.rental_status === 'PENDING_PAYMENT' && (
          <Link href={`/app/rentals/${rental.id}/payment`} className="flex-1">
            <Button className="w-full">Complete Payment</Button>
          </Link>
        )}

        <Link href="/app/rentals">
          <Button variant="outline">Back to Rentals</Button>
        </Link>
      </div>
    </div>
  )
}
