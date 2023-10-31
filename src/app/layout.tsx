import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { NextAuthProvider } from '@/components/Providers'
import { Toaster } from "@/components/ui/toaster"

const inter = Rubik({ subsets: ['latin'], weight: "400" })

export const metadata: Metadata = {
  title: 'Blogify - Blogging beyond boundaries!',
  description: 'Welcome to Blogify, your go-to destination for insightful, engaging, and informative blog content. Explore a world of diverse topics, expertly crafted articles, and a community of passionate writers. Discover the power of words as we bring you closer to the stories that matter most.'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <Navbar />
          {children}
        </NextAuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
