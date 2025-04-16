import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'
import { SidebarProvider } from '@/components/layout/SidebarContext'
import { ThemeProvider } from '@/contexts/ThemeContext'

export const metadata: Metadata = {
  title: 'Financial Analyst Chat Interface',
  description: 'AI-powered financial analysis and document management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[var(--background-dark)] text-[var(--text-primary)] h-screen flex overflow-hidden">
        <ThemeProvider>
          <SidebarProvider>
            <Sidebar />
            {children}
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
} 