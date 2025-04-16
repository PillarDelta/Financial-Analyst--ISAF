'use client'

import { FileText, Share2, Download, Trash2 } from 'lucide-react'

interface DocumentCardProps {
  title: string
  date: string
  size: string
  type: string
}

export default function DocumentCard({ title, date, size, type }: DocumentCardProps) {
  return (
    <div className="bg-[#333333] rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-[#007BFF]" />
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-gray-400">{type} • {size}</p>
          </div>
        </div>
        <p className="text-sm text-gray-400">{date}</p>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button className="p-2 hover:bg-[#1E1E1E] rounded-lg transition-colors">
          <Share2 className="w-4 h-4" />
        </button>
        <button className="p-2 hover:bg-[#1E1E1E] rounded-lg transition-colors">
          <Download className="w-4 h-4" />
        </button>
        <button className="p-2 hover:bg-[#1E1E1E] rounded-lg transition-colors text-[#FFD700]">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
} 