'use client'

import { useSidebar } from './SidebarContext'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'
import { Sun, Moon } from 'lucide-react'

export default function Sidebar() {
  const { isOpen, toggleSidebar } = useSidebar()
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      <button 
        onClick={toggleSidebar}
        className="fixed top-4 left-4 bg-none border-none text-[var(--text-secondary)] text-lg cursor-pointer p-1 z-20"
      >
        ☰
      </button>

      <aside 
        className={`fixed top-0 left-0 w-[200px] bg-[var(--sidebar-bg)] p-4 flex flex-col border-r-2 border-[var(--blue-accent)] transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-[200px]'
        } h-full z-10`}
      >
        <div className="pt-[30%]">
          <div className="text-[var(--blue-accent)] text-base font-semibold tracking-wider mb-0.5 pl-8">
            ANALYST
          </div>
          <div className="text-[var(--text-secondary)] text-xs mb-8 pl-8">
            Financial Analyst
          </div>

          <div className="text-[var(--text-secondary)] text-xs font-medium mb-2 pl-8">
            Chat History
          </div>
          <div className="text-[var(--text-secondary)] text-xs opacity-70 mb-4 pl-8">
            No chats yet
          </div>

          <div className="text-[var(--text-secondary)] text-xs font-medium mb-2 pl-8">
            Your Documents
          </div>
          <div className="text-[var(--text-secondary)] text-xs opacity-70 pl-8">
            No documents yet
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2">
          <button className="w-full py-2 rounded bg-[rgba(255,255,255,0.08)] text-[var(--text-primary)] border border-[var(--border-color)] text-xs font-medium tracking-wider">
            NEW CHAT
          </button>
          <button className="w-full py-2 rounded bg-[rgba(255,255,255,0.08)] text-[var(--text-secondary)] text-xs font-medium tracking-wider">
            CLEAR CHAT
          </button>
          <button className="w-full py-2 rounded bg-[rgba(255,255,255,0.08)] text-[var(--text-secondary)] text-xs font-medium tracking-wider">
            CLEAR DOCUMENTS
          </button>
          <Link 
            href="/dashboard"
            className="w-full py-2 rounded bg-transparent text-[var(--blue-accent)] border border-[var(--blue-accent)] text-xs font-medium tracking-wider text-center hover:bg-[var(--blue-accent)] hover:text-white transition-colors"
          >
            DASHBOARD
          </Link>
          <button
            onClick={toggleTheme}
            className="w-full py-2 rounded bg-[rgba(255,255,255,0.08)] text-[var(--text-secondary)] text-xs font-medium tracking-wider flex items-center justify-center gap-2"
          >
            {theme === 'dark' ? 
              <Sun className="w-4 h-4 text-[var(--text-primary)]" /> : 
              <Moon className="w-4 h-4 text-[var(--text-primary)]" />
            }
            {theme === 'dark' ? 'LIGHT MODE' : 'DARK MODE'}
          </button>
        </div>
      </aside>
    </>
  )
} 