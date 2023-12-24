import type { Metadata } from "next"
import { Inter, Roboto_Mono } from "next/font/google"
import "../globals.css"
import Navigation from "./navigation"

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
})
const inter = Inter({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Elo",
  description: "Board Game elo system",
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { circle: string }
}) {
  return (
    <html lang="en">
      <body className={`${robotoMono.variable} ${inter.variable} font-sans bg-bg dark:bg-black`}>
        <div className="container max-w-lg py-10 mx-auto">
          <Navigation slug={params.circle} />
          {children}
        </div>
      </body>
    </html>
  )
}
