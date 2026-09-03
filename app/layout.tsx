import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Oswald } from 'next/font/google'
import './globals.css'
import { BookingProvider } from '@/components/booking-provider'
import { CartProvider } from '@/components/cart-provider'
import { CatalogProvider } from '@/components/catalog-provider'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })
const oswald = Oswald({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-oswald',
})

export const metadata: Metadata = {
  title: 'FABRI BARBER | Barbería moderna',
  description:
    'FABRI BARBER — cortes, barba, cejas, color y cuidado masculino. Reservá tu turno online en minutos.',
  generator: 'v0.app',
  openGraph: {
    title: 'FABRI BARBER | Barbería moderna',
    description: 'Tu estilo. Tu corte. Tu barbería. Reservá tu turno online en minutos.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`dark bg-background ${geist.variable} ${geistMono.variable} ${oswald.variable}`}
    >
      <body className="antialiased grain font-sans">
        <CatalogProvider>
          <CartProvider>
            <BookingProvider>{children}</BookingProvider>
          </CartProvider>
        </CatalogProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
