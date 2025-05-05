'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { processDocument } from '@/utils/documentProcessor'

export type AnalysisType = 'risk-analysis' | 'z-score' | 'company-health' | 'isaf'
export type Message = {
  id: string
  content: string
  type: 'user' | 'assistant'
  timestamp: Date
  documents?: {
    name?: string
    type?: string
    imageUrl?: string
    content?: string
  }[]
}

type DocumentType = {
  content?: string
  imageUrl?: string
  name?: string
  type?: string
}

type ChatContextType = {
  messages: Message[]
  currentInput: string
  setCurrentInput: (input: string) => void
  analysisType: AnalysisType
  setAnalysisType: (type: AnalysisType) => void
  isLoading: boolean
  isProcessingFile: boolean
  sendMessage: (content: string) => Promise<void>
  handleUpload: (file: File) => Promise<void>
  hasDocuments: boolean
  clearChat: () => void
  newChat: () => void
  clearDocuments: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [analysisType, setAnalysisType] = useState<AnalysisType>('risk-analysis')
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessingFile, setIsProcessingFile] = useState(false)
  const [currentInput, setCurrentInput] = useState('')
  const [documents, setDocuments] = useState<DocumentType[]>([])

  const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const sendMessage = async (content: string) => {
    if (!content.trim() || isProcessingFile) return

    // Set processing state for message
    setIsLoading(true)

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      type: 'user',
      timestamp: new Date(),
      documents: documents && documents.length > 0 ? [...documents] : undefined
    }
    setMessages(prev => [...prev, userMessage])
    setCurrentInput('')
    setDocuments([])

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setIsLoading(prev => Math.min((prev ? 100 : 0) + 10, 90) > 0)
      }, 500)

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          analysisType,
          documents: userMessage.documents
        })
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        let errorData: any;
        try {
          errorData = await response.json();
        } catch {
          errorData = await response.text();
        }

        console.error('API error:', response.status, errorData);
        
        let errorMessage = 'Failed to get response';
        
        // Provide more user-friendly error messages based on status code
        if (response.status === 401) {
          errorMessage = 'OpenAI API key is invalid or expired. Please check your configuration.';
        } else if (response.status === 429) {
          errorMessage = 'API rate limit exceeded. Please try again later.';
        } else if (errorData && errorData.error) {
          errorMessage = errorData.error;
          if (errorData.details) {
            errorMessage += `: ${errorData.details}`;
          }
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.content,
        type: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Failed to send message:', error)
      
      let errorMessage = 'Sorry, I encountered an error processing your request.';
      
      if (error instanceof Error) {
        // For API key issues, provide a more helpful message
        if (error.message.includes('API key')) {
          errorMessage = `${error.message} Please contact the administrator to fix this issue.`;
        } else {
          errorMessage = `${errorMessage} ${error.message}`;
        }
      }
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: errorMessage,
        type: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const analyzeDocument = async (content: string, imageUrl?: string) => {
    try {
      console.log('Analyzing document:', { content, imageUrl, analysisType })
      
      // Prepare prompt based on analysisType
      let promptText = '';
      
      if (analysisType === 'isaf') {
        promptText = imageUrl 
          ? 'Please perform an ISAF strategic analysis on this image. Identify all visible business factors and metrics for strategic analysis.'
          : `Please perform an ISAF strategic analysis on this document. Extract all business factors for strategic analysis: ${content}`
      } else {
        promptText = imageUrl 
          ? 'Please analyze this image and describe what you see.'
          : `Please analyze this document and provide key insights: ${content}`
      }
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: promptText,
          analysisType,
          documents: [{
            content,
            imageUrl
          }]
        })
      })

      if (!response.ok) {
        let errorData: any;
        try {
          errorData = await response.json();
        } catch {
          errorData = await response.text();
        }

        console.error('API error:', response.status, errorData);
        
        let errorMessage = 'Failed to analyze document';
        
        // Provide more user-friendly error messages based on status code
        if (response.status === 401) {
          errorMessage = 'OpenAI API key is invalid or expired. Please check your configuration.';
        } else if (response.status === 429) {
          errorMessage = 'API rate limit exceeded. Please try again later.';
        } else if (errorData && errorData.error) {
          errorMessage = errorData.error;
          if (errorData.details) {
            errorMessage += `: ${errorData.details}`;
          }
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json()
      
      const analysisMessage: Message = {
        id: generateUniqueId(),
        content: data.content,
        type: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, analysisMessage])
    } catch (error) {
      console.error('Failed to analyze:', error)
      
      let errorMessage = 'Sorry, I encountered an error analyzing the content.';
      
      if (error instanceof Error) {
        // For API key issues, provide a more helpful message
        if (error.message.includes('API key')) {
          errorMessage = `${error.message} Please contact the administrator to fix this issue.`;
        } else {
          errorMessage = `${errorMessage} ${error.message}`;
        }
      }
      
      const errorResponse: Message = {
        id: generateUniqueId(),
        content: errorMessage,
        type: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorResponse])
    }
  }

  const handleUpload = async (file: File) => {
    try {
      setIsProcessingFile(true)
      const processedContent = await processDocument(file)
      
      // Create upload message with image if present
      const uploadMessage: Message = {
        id: generateUniqueId(),
        content: 'DOCUMENT_PREVIEW',
        type: 'user',
        timestamp: new Date(),
        documents: [{
          name: file.name,
          type: file.type,
          content: processedContent.content,
          imageUrl: (processedContent as any).imageUrl
        }]
      }
      
      setMessages(prev => [...prev, uploadMessage])
      
      // Send for analysis immediately
      await analyzeDocument(
        processedContent.content,
        (processedContent as any).imageUrl
      )

    } catch (error) {
      console.error('Upload failed:', error)
      const errorMessage: Message = {
        id: generateUniqueId(),
        content: `Failed to process ${file.name}. Please try again.`,
        type: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsProcessingFile(false)
    }
  }

  // Clear chat function to remove all messages
  const clearChat = () => {
    console.log('Clearing chat...');
    setMessages([{
      id: generateUniqueId(),
      content: 'Chat cleared. You can start a new conversation.',
      type: 'assistant',
      timestamp: new Date()
    }])
    setCurrentInput('')
    setDocuments([])
  }

  // New chat function to reset state
  const newChat = () => {
    console.log('Starting new chat...');
    setMessages([{
      id: generateUniqueId(),
      content: 'New chat started. How can I help you today?',
      type: 'assistant',
      timestamp: new Date()
    }])
    setCurrentInput('')
    setDocuments([])
    setAnalysisType('risk-analysis') // Reset to default analysis type
    setIsLoading(false)
    setIsProcessingFile(false)
  }

  // Clear documents function
  const clearDocuments = () => {
    console.log('Clearing documents...');
    setDocuments([])
    
    // If there are document messages, filter them out
    setMessages(prevMessages => {
      const filteredMessages = prevMessages.filter(message => {
        // Check if it's a document preview message
        if (message.content === 'DOCUMENT_PREVIEW') {
          return false;
        }
        
        // Check if it has documents
        if (message.documents && message.documents.length > 0) {
          return false;
        }
        
        return true;
      });
      
      // Add a confirmation message
      return [
        ...filteredMessages,
        {
          id: generateUniqueId(),
          content: 'Documents cleared.',
          type: 'assistant',
          timestamp: new Date()
        }
      ]
    })
  }

  return (
    <ChatContext.Provider value={{
      messages,
      currentInput,
      setCurrentInput,
      analysisType,
      setAnalysisType,
      isLoading,
      isProcessingFile,
      sendMessage,
      handleUpload,
      hasDocuments: documents.length > 0,
      clearChat,
      newChat,
      clearDocuments
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
} 