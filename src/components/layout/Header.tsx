'use client'

import { useSidebar } from './SidebarContext'

export default function Header() {
  const { toggleSidebar } = useSidebar()

  return (
    <button 
      onClick={toggleSidebar}
      className="absolute top-4 left-[216px] bg-none border-none text-[var(--text-secondary)] text-lg cursor-pointer p-1 hidden md:block"
    >
      ☰
    </button>
  )
} 