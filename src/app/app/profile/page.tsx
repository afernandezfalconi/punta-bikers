'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { getCurrentUser, signOut } from '@/lib/auth'

interface User {
  id: string
  email: string
  user_metadata?: {
    first_name?: string
    last_name?: string
    phone?: string
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [signOutLoading, setSignOutLoading] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (currentUser) {
          setUser(currentUser as User)
        } else {
          router.push('/auth/login')
        }
      } catch (err) {
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const handleSignOut = async () => {
    setSignOutLoading(true)
    try {
      await signOut()
      router.push('/auth/login')
    } catch (err) {
      console.error('Sign out failed:', err)
    } finally {
      setSignOutLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={user.email}
                disabled
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">First Name</label>
                <Input
                  value={user.user_metadata?.first_name || ''}
                  disabled
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Last Name</label>
                <Input
                  value={user.user_metadata?.last_name || ''}
                  disabled
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input
                value={user.user_metadata?.phone || ''}
                disabled
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push('/app/dashboard')}
            >
              Back to Dashboard
            </Button>
            <Button
              variant="destructive"
              onClick={handleSignOut}
              disabled={signOutLoading}
            >
              {signOutLoading ? 'Signing out...' : 'Sign Out'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
