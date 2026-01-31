import type { Metadata } from 'next'
import { Prompt } from 'next/font/google'
import { Providers } from '@/components/providers'
import './globals.css'

const prompt = Prompt({ 
  weight: ['300', '400', '500', '700'],
  subsets: ['latin', 'thai'],
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
      <body className={prompt.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}