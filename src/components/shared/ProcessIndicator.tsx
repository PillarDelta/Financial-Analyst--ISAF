'use client'

import { useEffect, useState } from 'react'

interface ProcessIndicatorProps {
  fileName: string
}

export function ProcessIndicator({ fileName }: ProcessIndicatorProps) {
  const [step, setStep] = useState(0)
  const steps = [
    `Processing document: ${fileName}...`,
    `Document processed successfully. Analyzing contents...`,
    'Generating insights...'
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(current => (current + 1) % steps.length)
    }, 2000)

    return () => clearInterval(timer)
  }, [steps.length])

  return (
    <div className="flex flex-col gap-2 p-4 rounded border border-[rgba(255,255,255,0.2)] bg-transparent">
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-[var(--blue-accent)] animate-[bounce_1s_infinite_0ms]"></div>
          <div className="w-2 h-2 rounded-full bg-[var(--blue-accent)] animate-[bounce_1s_infinite_200ms]"></div>
          <div className="w-2 h-2 rounded-full bg-[var(--blue-accent)] animate-[bounce_1s_infinite_400ms]"></div>
        </div>
        <span className="text-sm text-[var(--text-primary)] font-light transition-opacity duration-500">
          {steps[step]}
        </span>
      </div>
    </div>
  )
} 