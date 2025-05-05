'use client'

import { Upload } from 'lucide-react'
import { useChat, type AnalysisType } from '@/contexts/ChatContext'
import { useRef, useEffect } from 'react'
import { DocumentPreview } from '@/components/shared/DocumentPreview'
import { ProcessIndicator } from '@/components/shared/ProcessIndicator'

// Import message type from the context
import { type Message } from '@/contexts/ChatContext'

// Update Message type in useChat.ts instead of extending it here
interface DocumentInfo {
  name: string
  type: string
  imageUrl?: string
  content?: string
}

// Update the Message type in useChat.ts
type ExtendedMessage = {
  id: string
  content: string
  type: 'user' | 'assistant'
  timestamp: Date
  documents?: DocumentInfo[]
}

export default function Home() {
  const {
    messages,
    currentInput,
    setCurrentInput,
    analysisType,
    setAnalysisType,
    isLoading,
    isProcessingFile,
    sendMessage,
    handleUpload,
    chatStarted
  } = useChat()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const lastMessageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollContainerRef.current && lastMessageRef.current) {
        const scrollContainer = scrollContainerRef.current
        const lastMessage = lastMessageRef.current
  
        // Get positions
        const messageRect = lastMessage.getBoundingClientRect()
        const containerRect = scrollContainer.getBoundingClientRect()
        
        // Reduced mask height by 20%
        const maskHeight = 320 // Reduced from 400px
        const safetyMargin = 100
        const targetScroll = scrollContainer.scrollTop + 
          messageRect.bottom - 
          (containerRect.bottom - maskHeight - safetyMargin)
  
        scrollContainer.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        })
      }
    }, 100)
  
    return () => clearTimeout(timer)
  }, [messages.length, isProcessingFile]) // Watch for both new messages and processing state

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(currentInput)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }

  const analysisTypes: { id: AnalysisType; label: string }[] = [
    { id: 'risk-analysis', label: 'Risk Analysis' },
    { id: 'z-score', label: 'Z-Score' },
    { id: 'company-health', label: 'Company Health' },
    { id: 'isaf', label: 'ISAF Strategic Analysis' },
  ]

  const renderMessage = (message: ExtendedMessage) => {
    if (message.type === 'assistant') {
      return (
        <div className="space-y-12">
          {message.content.split('\n\n').map((paragraph: string, i: number) => {
            // Main headers (CONTEXT SUMMARY, DIFS ANALYSIS)
            if (paragraph.match(/^[A-Z][A-Z\s]+$/)) {
              return (
                <div key={i} className="space-y-6">
                  <h2 className="text-[var(--blue-accent)] text-xl font-light">
                    {paragraph}
                  </h2>
                </div>
              )
            }

            // Regular paragraphs
            return (
              <p key={i} className="text-[var(--text-primary)] text-base font-light leading-8">
                {paragraph}
              </p>
            )
          })}
        </div>
      )
    }

    // Document Preview text
    if (message.content === 'DOCUMENT_PREVIEW' && message.documents?.[0]) {
      return (
        <DocumentPreview 
          fileName={message.documents[0].name}
          fileType={message.documents[0].type}
          isProcessing={isProcessingFile && message.id === messages[messages.length - 1]?.id}
          imageUrl={message.documents[0].imageUrl}
          content={message.documents[0].content}
        />
      )
    }

    // User messages
    return (
      <div className="text-[var(--text-primary)] text-base font-light">
        {message.content}
      </div>
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {  // Enter without Shift
      e.preventDefault()  // Prevent new line
      if (currentInput.trim() && !isProcessingFile) {
        handleSubmit(e)
      }
    }
  }

  return (
    <div className="flex-1 ml-[200px] flex flex-col h-full">
      <div className={`w-full max-w-[1400px] mx-auto flex-1 flex flex-col relative`}>
        {/* Scrollable content with aggressive fade */}
        <div className="flex-1 relative">
          <div 
            ref={scrollContainerRef}
            className="absolute inset-0 overflow-y-auto scrollbar-none"
          >
            <div className="flex flex-col py-4 space-y-8 pb-[600px]">
              {messages.map((message, index) => (
                <div 
                  key={message.id}
                  ref={index === messages.length - 1 ? lastMessageRef : null}
                  className={`
                    ${message.type === 'user' ? 'flex justify-end' : 'flex justify-start'}
                    animate-fadeIn opacity-0
                    [animation:fadeInUp_0.5s_ease-out_forwards]
                    [animation-delay:${index * 0.1}s]
                  `}
                >
                  <div className={`
                    ${message.type === 'user'
                      ? 'w-[600px] border border-[rgba(255,255,255,0.1)] rounded p-4'
                      : 'w-[800px]'
                    }
                  `}>
                    <div className="text-[var(--text-secondary)] text-base leading-7">
                      {renderMessage(message as ExtendedMessage)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Solid mask with matching background color */}
          <div 
            className="absolute bottom-0 left-0 right-0 bg-[var(--background-dark)] h-[320px]" 
            style={{ pointerEvents: 'none' }}
          />
        </div>

        {/* Input section */}
        <div className={`transition-all duration-700 ease-in-out ${
          !chatStarted
            ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
            : 'fixed bottom-[10%] left-1/2 -translate-x-1/2'
        }`}>
          <form onSubmit={handleSubmit} className="w-[1000px]">
            <textarea 
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={isProcessingFile ? "Processing document..." : "Ask something..."}
              disabled={isProcessingFile}
              className="w-full min-h-[100px] bg-[var(--input-bg)] border border-[var(--border-color)] rounded px-4 py-2 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] text-base font-light resize-none outline-none mb-4"
            />
            
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {analysisTypes.map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setAnalysisType(type.id)}
                    disabled={isProcessingFile}
                    className={`px-4 py-2 rounded text-sm font-light ${
                      analysisType === type.id
                        ? 'bg-transparent border border-[var(--blue-accent)] text-[var(--blue-accent)]'
                        : 'bg-transparent border border-[rgba(255,255,255,0.1)] text-[var(--text-secondary)]'
                    } disabled:opacity-50`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx"
                  disabled={isProcessingFile}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessingFile}
                  className="p-2 rounded border border-[rgba(255,255,255,0.1)] text-[var(--text-secondary)] hover:border-[rgba(255,255,255,0.2)]"
                >
                  <Upload className="w-5 h-5 text-[var(--text-primary)]" />
                </button>
                <button
                  type="submit"
                  disabled={isProcessingFile || !currentInput.trim()}
                  className="border border-[var(--blue-accent)] bg-transparent text-[var(--blue-accent)] px-6 py-2 rounded text-sm font-light tracking-wider disabled:opacity-50 transition-opacity hover:bg-[var(--blue-accent)] hover:text-white"
                >
                  {isProcessingFile ? 'PROCESSING...' : 'SEND IT'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Processing Indicator */}
        {(isLoading || isProcessingFile) && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
            <ProcessIndicator 
              isLoading={isLoading} 
              isProcessingFile={isProcessingFile} 
              fileName={(messages[messages.length - 1] as ExtendedMessage)?.documents?.[0]?.name}
            />
          </div>
        )}
      </div>
    </div>
  )
} 