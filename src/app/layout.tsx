import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),
  title: 'TripAI - AI-Powered Travel Planning',
  description: 'Plan your perfect trip with AI-generated itineraries and smart budget tracking.',
  keywords: ['travel planning', 'AI itinerary', 'trip budget', 'vacation planner'],
  authors: [{ name: 'TripAI Team' }],
  creator: 'TripAI',
  publisher: 'TripAI',
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
  openGraph: {
    title: 'TripAI - AI-Powered Travel Planning',
    description: 'Plan your perfect trip with AI-generated itineraries and smart budget tracking.',
    url: 'https://tripai.com',
    siteName: 'TripAI',
    images: [
      {
        url: 'https://api.a0.dev/assets/image?text=TripAI logo with airplane and AI elements&aspect=1:1&seed=travel-ai',
        width: 1200,
        height: 630,
        alt: 'TripAI Logo - AI-Powered Travel Planning',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TripAI - AI-Powered Travel Planning',
    description: 'Plan your perfect trip with AI-generated itineraries and smart budget tracking.',
    images: ['https://api.a0.dev/assets/image?text=TripAI logo with airplane and AI elements&aspect=1:1&seed=travel-ai'],
    creator: '@tripai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}