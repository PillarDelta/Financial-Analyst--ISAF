'use client';

interface ProcessingIndicatorProps {
  isProcessing: boolean;
  progress?: number; // Optional numerical progress (0-100)
}

export default function ProcessingIndicator({ isProcessing, progress }: ProcessingIndicatorProps) {
  if (!isProcessing) return null;

  return (
    <div className="flex items-center gap-2 mt-2 text-text-secondary">
      <div className="w-4 h-4 border-2 border-blue-accent border-t-transparent rounded-full animate-spin" />
      <span className="text-sm">
        {progress !== undefined ? `Processing... ${Math.round(progress)}%` : 'Processing...'}
      </span>
    </div>
  );
} 