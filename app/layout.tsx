import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Archivo } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })
const archivo = Archivo({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  variable: '--font-archivo',
})

export const metadata: Metadata = {
  title: 'Sports Recovery | Recuperación Deportiva y Kinesiología',
  description:
    'Sports Recovery — recuperación deportiva, kinesiología, movilidad y bienestar físico para acompañarte antes, durante y después del entrenamiento.',
  generator: 'v0.app',
  openGraph: {
    title: 'Sports Recovery | Recuperación Deportiva y Kinesiología',
    description:
      'Recuperación deportiva, kinesiología, movilidad y rendimiento. Recuperá mejor. Movete mejor. Rendí mejor.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#050505',
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
      className={`dark bg-background ${geist.variable} ${geistMono.variable} ${archivo.variable}`}
    >
      <body className="antialiased grain font-sans">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
