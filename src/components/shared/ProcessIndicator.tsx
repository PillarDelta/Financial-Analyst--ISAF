'use client'

import { useEffect, useState } from 'react'

interface ProcessIndicatorProps {
  isLoading: boolean;
  isProcessingFile: boolean;
  fileName?: string;
}

export function ProcessIndicator({ isLoading, isProcessingFile, fileName }: ProcessIndicatorProps) {
  if (!isLoading && !isProcessingFile) return null;

  const getMessage = () => {
    if (isProcessingFile && fileName) {
      return `Processing document: ${fileName}...`;
    }
    return 'Processing document: undefined...';
  }

  return (
    <div className="flex items-center gap-2 bg-[var(--input-bg)] px-4 py-2 rounded border border-[var(--box-stroke)]">
      <div className="flex gap-1">
        <div className="w-2 h-2 rounded-full bg-[var(--blue-accent)] animate-[bounce_1s_infinite_0ms]"></div>
        <div className="w-2 h-2 rounded-full bg-[var(--blue-accent)] animate-[bounce_1s_infinite_200ms]"></div>
        <div className="w-2 h-2 rounded-full bg-[var(--blue-accent)] animate-[bounce_1s_infinite_400ms]"></div>
      </div>
      <span className="text-sm text-[var(--text-secondary)] font-light transition-opacity duration-500">
        {getMessage()}
      </span>
    </div>
  )
} 