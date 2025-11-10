import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { SessionProvider } from '@/lib/session-context'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fusion Hub',
  description: 'Created with Fusion Hub',
  generator: 'Fusion Hub',
  icons: {
    icon: '/logosDatocmsIcon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${GeistSans.variable} ${GeistMono.variable}`}>
        <SessionProvider>
          {children}
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  )
}
