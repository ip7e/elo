import type { Metadata } from "next"
import PlausibleProvider from "next-plausible"
import "./globals.css"

import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"
import { cn } from "@/utils/tailwind/cn"
import { ThemeProvider } from "next-themes"
import { TooltipProvider } from "@/components/ui/tooltip"

export const metadata: Metadata = {
  title: "Shmelo - Stay Competitive",
  description:
    "Leaderboard for games like board games, chess, tennis, padel, or any game worth a competition. Track wins, follow rankings, and stay competitive.",
  icons: [
    {
      rel: "icon",
      type: "image/svg",
      url: "/favicon.svg",
    },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shmelo.io",
    siteName: "Shmelo",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Shmelo - Stay Competitive",
      },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlausibleProvider domain="shmelo.io">
      <html lang="en" className="h-full" suppressHydrationWarning>
        <body
          className={cn(
            `h-full w-full bg-background font-sans`,
            GeistMono.variable,
            GeistSans.variable,
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>{children}</TooltipProvider>
          </ThemeProvider>
        </body>
      </html>
    </PlausibleProvider>
  )
}
