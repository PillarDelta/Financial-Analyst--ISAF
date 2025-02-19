'use client'

import { FileText, FileSpreadsheet, Image, File } from 'lucide-react'
import { SmoothProgress } from './SmoothProgress'
import { useState } from 'react'

interface DocumentPreviewProps {
  fileName: string
  fileType: string
  isProcessing?: boolean
  imageUrl?: string
  content?: string  // For Excel/PDF content
}

export function DocumentPreview({ fileName, fileType, isProcessing, imageUrl, content }: DocumentPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getIcon = () => {
    if (fileType.includes('pdf')) return <FileText className="w-8 h-8 text-[rgba(255,255,255,0.6)]" />
    if (fileType.includes('sheet') || fileType.includes('csv') || fileType.includes('excel')) {
      return <FileSpreadsheet className="w-8 h-8 text-[rgba(255,255,255,0.6)]" />
    }
    if (fileType.includes('image')) return <Image className="w-8 h-8 text-[rgba(255,255,255,0.6)]" />
    if (fileType.includes('docx')) {
      return <File className="w-8 h-8 text-[#2B579A]" />
    }
    return <FileText className="w-8 h-8 text-[rgba(255,255,255,0.6)]" />
  }

  const renderPreview = () => {
    if (fileType.includes('docx') && content) {
      return (
        <div className="mt-4 p-4 bg-[rgba(255,255,255,0.05)] rounded">
          <div className="text-sm text-text-secondary whitespace-pre-wrap">
            {content.substring(0, 200)}...
          </div>
        </div>
      )
    }

    if (isExpanded && (
      fileType.includes('sheet') || fileType.includes('csv') ||
      fileType.includes('pdf') ||
      (fileType.includes('image') && imageUrl)
    )) {
      return (
        <div className="mt-4">
          {/* Image Preview */}
          {imageUrl && (
            <img 
              src={imageUrl} 
              alt={fileName}
              className="max-w-[600px] w-full h-auto rounded"
            />
          )}

          {/* Excel/CSV Preview */}
          {(fileType.includes('sheet') || fileType.includes('csv')) && content && (
            <div className="max-h-[400px] overflow-auto rounded border border-[rgba(255,255,255,0.1)] p-4">
              <pre className="text-[var(--text-secondary)] text-base font-light whitespace-pre-wrap">
                {content}
              </pre>
            </div>
          )}

          {/* PDF Preview */}
          {fileType.includes('pdf') && content && (
            <div className="max-h-[400px] overflow-auto rounded border border-[rgba(255,255,255,0.1)] p-4">
              <pre className="text-[var(--text-secondary)] text-base font-light whitespace-pre-wrap">
                {content}
              </pre>
            </div>
          )}
        </div>
      );
    }
    return null;
  }

  return (
    <div className="border border-[rgba(255,255,255,0.1)] rounded p-4 bg-transparent">
      <div className="flex items-center gap-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="text-2xl">{getIcon()}</div>
        <div className="flex-1">
          <div className="text-[var(--text-secondary)] text-lg font-light mb-2">
            {fileName}
          </div>
          {isProcessing && <SmoothProgress />}
        </div>
      </div>

      {renderPreview()}
    </div>
  )
} 