import type { Metadata } from 'next'
import { Providers } from '@/components/providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Spin Game',
  description: 'A fun spin game frontend',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-kanit">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}