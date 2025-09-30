import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { QueryProvider } from '@/contexts/QueryProvider'
import { ToastProvider } from '@/contexts/ToastContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sharek - Developer Collaboration Platform',
  description: 'Connect, collaborate, and contribute to amazing projects with developers worldwide.',
  keywords: 'developer, collaboration, projects, open source, programming, coding',
  authors: [{ name: 'Sharek Team' }],
  openGraph: {
    title: 'Sharek - Developer Collaboration Platform',
    description: 'Connect, collaborate, and contribute to amazing projects with developers worldwide.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sharek - Developer Collaboration Platform',
    description: 'Connect, collaborate, and contribute to amazing projects with developers worldwide.',
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
        <QueryProvider>
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}