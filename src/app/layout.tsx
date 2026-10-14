import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PUNTA BIKERS - Scooter Rentals in Puerto Escondido',
  description: 'Rent premium scooters in Puerto Escondido, Oaxaca. Flexible daily rates, instant booking, and 24/7 support.',
  keywords: 'scooter rental, Puerto Escondido, Oaxaca, transportation, travel',
  openGraph: {
    title: 'PUNTA BIKERS',
    description: 'Explore Puerto Escondido on two wheels',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
