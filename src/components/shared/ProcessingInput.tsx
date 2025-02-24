<input
  type="text"
  value={text}
  onChange={(e) => setText(e.target.value)}
  placeholder={placeholder}
  disabled={isProcessing}
  className="w-full p-2 bg-[var(--input-bg)] rounded border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--blue-accent)]"
/> 