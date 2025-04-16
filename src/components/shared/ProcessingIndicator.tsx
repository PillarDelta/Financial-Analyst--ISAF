'use client'

interface ProcessingIndicatorProps {
  state: ProcessingState;
}

export function ProcessingIndicator({ state }: ProcessingIndicatorProps) {
  if (!state.isProcessing) return null;

  const getMessage = () => {
    switch (state.type) {
      case 'message':
        return 'Processing your request...';
      case 'document':
        return `Processing document: ${state.fileName}...`;
      case 'image':
        return `Analyzing image: ${state.fileName}...`;
      default:
        return 'Processing...';
    }
  }

  return (
    <div className="flex items-center gap-3 bg-[rgba(255,255,255,0.05)] px-4 py-2 rounded">
      <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
      <div className="flex flex-col">
        <span className="text-[var(--text-secondary)] text-sm">
          {getMessage()}
        </span>
        {state.progress !== undefined && (
          <div className="w-[200px] h-1 bg-[rgba(255,255,255,0.1)] rounded-full mt-2">
            <div 
              className="h-full bg-blue-400 rounded-full transition-all duration-300"
              style={{ width: `${state.progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
} 