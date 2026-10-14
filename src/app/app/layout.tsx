'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/auth'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/auth/login')
    } catch (err) {
      console.error('Sign out failed:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/app/dashboard" className="text-2xl font-bold text-blue-600">
            PUNTA BIKERS
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/app/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/app/profile">
              <Button variant="ghost">Profile</Button>
            </Link>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-8 px-4">
        {children}
      </main>
    </div>
  )
}
