import type { Metadata } from 'next'
import { Inter, Roboto_Mono } from 'next/font/google'
import './globals.css'

const robotoMono = Roboto_Mono({ subsets: ['latin'], variable: '--font-roboto-mono' })
const inter = Inter({ weight: 'variable', subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Elo',
  description: 'Board Game elo system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${robotoMono.variable} ${inter.variable} font-sans`}>
        <div className='container max-w-xl mx-auto'>
          {children}
        </div>
      </body>
    </html>
  )
}
