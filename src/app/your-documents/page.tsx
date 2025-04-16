'use client'

import { Upload, Search, Folder, Share2, Download, Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function YourDocuments() {
  const [view, setView] = useState<'grid' | 'list'>('grid')

  return (
    <div className="flex-1 p-10">
      <div className="max-w-[800px] mx-auto">
        <h1 className="text-[15px] mb-6 text-[var(--text-primary)] font-normal">
          Your Documents
        </h1>
        
        <div className="bg-[var(--input-bg)] rounded-md p-4">
          <div className="border-2 border-dashed border-[var(--border-color)] rounded p-8 text-center mb-4">
            <p className="text-[var(--text-secondary)] text-xs">
              Drag and drop files here or click to browse
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-[var(--text-secondary)] text-xs">
              No documents yet
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 