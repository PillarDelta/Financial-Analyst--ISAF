'use client'

import { useEffect, useState } from 'react'

export function SmoothProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev // Stop at 90% to wait for actual completion
        return prev + (90 - prev) * 0.1 // Smooth acceleration that slows down
      })
    }, 100)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="w-full bg-[rgba(12, 233, 23, 0.1)] h-1 rounded overflow-hidden">
      <div 
        className="h-full bg-[var(--blue-accent)] transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
} 