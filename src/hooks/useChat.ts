'use client'

import { useState } from 'react'
import { processDocument } from '@/utils/documentProcessor'

export type AnalysisType = 'risk-analysis' | 'z-score' | 'company-health' | 'isaf'
export type Message = {
  id: string
  content: string
  type: 'user' | 'assistant'
  timestamp: Date
  documents?: {
    name: string
    type: string
    imageUrl?: string
    content?: string
  }[]
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [analysisType, setAnalysisType] = useState<AnalysisType>('risk-analysis')
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessingFile, setIsProcessingFile] = useState(false)
  const [currentInput, setCurrentInput] = useState('')
  const [documents, setDocuments] = useState<Message['documents']>([])

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

      if (!response.ok) throw new Error('Failed to get response')
      
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
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error processing your request.',
        type: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
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

      if (!response.ok) throw new Error('Failed to get analysis')
      
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
      const errorMessage: Message = {
        id: generateUniqueId(),
        content: 'Sorry, I encountered an error analyzing the content.',
        type: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
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
          imageUrl: processedContent.imageUrl
        }]
      }
      
      setMessages(prev => [...prev, uploadMessage])
      
      // Send for analysis immediately
      await analyzeDocument(
        processedContent.content,
        processedContent.imageUrl
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

  // Test message flow
  const testMessages = async () => {
    // User input (should be RIGHT)
    const userMessage: Message = {
      id: '1',
      content: 'Test message from user',
      type: 'user',
      timestamp: new Date()
    }
    setMessages([userMessage])

    // Assistant response (should be LEFT)
    const assistantMessage: Message = {
      id: '2',
      content: 'Test response from assistant',
      type: 'assistant',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, assistantMessage])

    // Document upload (should be RIGHT)
    const documentPreview: Message = {
      id: '3',
      content: 'DOCUMENT_PREVIEW',
      type: 'user',
      timestamp: new Date(),
      documents: [{
        name: 'test.pdf',
        type: 'application/pdf',
        content: ''
      }]
    }
    setMessages(prev => [...prev, documentPreview])

    // Processing message (should be LEFT)
    const processingMessage: Message = {
      id: '4',
      content: 'Processing document: test.pdf...',
      type: 'assistant',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, processingMessage])

    // Analysis result (should be LEFT)
    const analysisMessage: Message = {
      id: '5',
      content: 'Analysis result from the document',
      type: 'assistant',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, analysisMessage])
  }

  return {
    messages,
    currentInput,
    setCurrentInput,
    analysisType,
    setAnalysisType,
    isLoading,
    isProcessingFile,
    sendMessage,
    handleUpload,
    hasDocuments: documents.length > 0
  }
} 