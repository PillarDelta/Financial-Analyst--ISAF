'use client'

import { Search, Calendar } from 'lucide-react'

export default function ChatHistory() {
  return (
    <div className="flex-1 p-10">
      <div className="max-w-[800px] mx-auto">
        <h1 className="text-[15px] mb-6 text-[var(--text-primary)] font-normal">
          Chat History
        </h1>
        
        <div className="bg-[var(--input-bg)] rounded-md p-4 text-center">
          <div className="text-[var(--text-secondary)] text-xs">
            No chats yet
          </div>
        </div>
      </div>
    </div>
  )
} 