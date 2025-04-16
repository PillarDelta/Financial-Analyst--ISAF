export type Message = {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  documents?: {
    name: string
    type: string
    content: string
    imageUrl?: string
  }[]
} 