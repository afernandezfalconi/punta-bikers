'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Rental {
  id: string
  rental_start_date: string
  rental_end_date: string
  subtotal: string
  deposit_amount: string
  rental_status: string
}

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const rentalId = params?.id as string
  const status = searchParams?.get('status')

  const [rental, setRental] = useState<Rental | null>(null)
  const [loading, setLoading] = useState(true)
  const [processPayment, setProcessPayment] = useState(false)

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

  const handlePayment = async () => {
    setProcessPayment(true)
    try {
      // In a real app, this would call /api/rentals with rental details
      // to get the Mercado Pago preference URL
      // For now, we'll simulate the flow

      // redirect to Mercado Pago (simulated)
      // window.location.href = paymentUrl;

      console.log('Initiating payment for rental:', rentalId)
    } catch (err) {
      console.error('Payment error:', err)
    } finally {
      setProcessPayment(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading payment details...</div>
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

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      {/* Status Messages */}
      {status === 'success' && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          ✓ Payment completed successfully! Your rental is now active.
        </div>
      )}

      {status === 'failure' && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          ✗ Payment failed. Please try again or contact support.
        </div>
      )}

      {status === 'pending' && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          ⏳ Payment is pending. We'll notify you when it's completed.
        </div>
      )}

      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
          <CardDescription>Rental #{rentalId.slice(0, 8)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-b pb-4">
            <p className="text-sm text-gray-600">Rental Period</p>
            <p className="font-semibold">
              {new Date(rental.rental_start_date).toLocaleDateString()} -{' '}
              {new Date(rental.rental_end_date).toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Rental Cost</span>
              <span className="font-semibold">${rental.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Security Deposit</span>
              <span className="font-semibold">${rental.deposit_amount}</span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="font-bold">Total Amount</span>
              <span className="text-2xl font-bold">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Powered by Mercado Pago</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-700">
            You'll be redirected to Mercado Pago to complete your payment securely. We accept:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>Credit/Debit Cards (Visa, Mastercard, Amex)</li>
            <li>Bank Transfers</li>
            <li>OXXO Stores</li>
            <li>Mercado Pago Wallet</li>
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          className="flex-1 bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600"
          disabled={processPayment || rental.rental_status !== 'PENDING_PAYMENT'}
          onClick={handlePayment}
        >
          {processPayment ? 'Processing...' : 'Pay with Mercado Pago'}
        </Button>

        <Link href={`/app/rentals/${rentalId}`} className="flex-1">
          <Button variant="outline" className="w-full">
            Back to Rental
          </Button>
        </Link>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded text-sm">
        🔒 Your payment information is secure. Mercado Pago uses industry-standard encryption to protect your data.
      </div>
    </div>
  )
}
