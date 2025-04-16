'use client'

export function LoadingIndicator() {
  return (
    <div className="flex items-center gap-2 p-4 rounded border border-[rgba(255,255,255,0.2)] bg-transparent mr-auto max-w-[80%]">
      <div className="flex gap-1">
        <div className="w-2 h-2 rounded-full bg-[var(--blue-accent)] animate-[bounce_1s_infinite_0ms]"></div>
        <div className="w-2 h-2 rounded-full bg-[var(--blue-accent)] animate-[bounce_1s_infinite_200ms]"></div>
        <div className="w-2 h-2 rounded-full bg-[var(--blue-accent)] animate-[bounce_1s_infinite_400ms]"></div>
      </div>
    </div>
  )
} 