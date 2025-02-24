export function formatOutput(content: string): string {
  if (content.includes("does not comply") || 
      content.includes("Failed to process")) {
    return content;
  }

  // Clean and standardize content
  const cleanContent = content
    .replace(/#{1,3}\s/g, '')
    .replace(/\*\*/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^-\s*/gm, '• ')
    .replace(/^(\d+)\.\s+/gm, '$1. ')
    .trim()

  // Split into sections and format
  const sections = cleanContent.split('\n\n')

  // Return clean text without HTML
  return sections.join('\n\n')
} 