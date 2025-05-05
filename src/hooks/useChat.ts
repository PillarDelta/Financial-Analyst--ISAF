'use client'

// This file is now just a wrapper around the ChatContext for backward compatibility
// All the actual logic has been moved to src/contexts/ChatContext.tsx

import { useChat as useChatContext } from '@/contexts/ChatContext'
export type { AnalysisType, Message } from '@/contexts/ChatContext'

export function useChat() {
  return useChatContext()
} 