'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Scooter {
  id: string
  model_name: string
  license_plate: string
  status: string
  current_km: number
  last_maintenance_date: string | null
}

export default function ScootersPage() {
  const [scooters, setScooters] = useState<Scooter[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchScooters = async () => {
      try {
        const response = await fetch('/api/scooters')
        const result = await response.json()
        if (result.success) {
          setScooters(result.data || [])
        }
      } catch (err) {
        console.error('Failed to fetch scooters:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchScooters()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading scooters...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Available Scooters</h1>
        <p className="text-gray-600 mt-1">Choose a scooter and start your adventure</p>
      </div>

      {scooters.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">No scooters available at the moment</p>
            <Link href="/app/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scooters.map(scooter => (
            <Card key={scooter.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{scooter.model_name}</CardTitle>
                <CardDescription>Plate: {scooter.license_plate}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">Status:</span>{' '}
                    <span className="text-green-600">{scooter.status}</span>
                  </p>
                  <p>
                    <span className="font-semibold">Mileage:</span> {scooter.current_km.toLocaleString()} km
                  </p>
                  <p>
                    <span className="font-semibold">Last Maintenance:</span>{' '}
                    {scooter.last_maintenance_date
                      ? new Date(scooter.last_maintenance_date).toLocaleDateString()
                      : 'Unknown'}
                  </p>
                </div>

                <Link href={`/app/rentals/new?scooter_id=${scooter.id}`}>
                  <Button className="w-full">Book This Scooter</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
