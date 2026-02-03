import type { Metadata } from 'next'
import { Kanit } from 'next/font/google'
import { Providers } from '@/components/providers'
import './globals.css'

const kanit = Kanit({
  subsets: ['thai', 'latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
})

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
      <body className={kanit.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}