'use client';

import { useState } from 'react';
import ProcessingIndicator from './ProcessingIndicator';

interface ProcessingInputProps {
  onProcess: (text: string) => Promise<void>;
  placeholder?: string;
}

export default function ProcessingInput({ onProcess, placeholder = 'Enter text...' }: ProcessingInputProps) {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      await onProcess(text);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          disabled={isProcessing}
          className="w-full p-2 bg-input-bg rounded border border-border-color focus:outline-none focus:border-blue-accent"
        />
        <ProcessingIndicator isProcessing={isProcessing} />
      </form>
    </div>
  );
} 