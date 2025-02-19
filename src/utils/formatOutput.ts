export function formatOutput(content: string, type: 'document' | 'analysis' = 'analysis'): string {
  // If it's a policy violation, error message, or document content, return it directly
  if (content.includes("does not comply") || 
      content.includes("Failed to process") ||
      content.includes("functional-data-model") ||  // Skip for document content
      content.includes("Please provide") ||
      content.includes("The document provided")) {
    return content;
  }

  // Clean and standardize the content
  let cleanContent = content
    .replace(/#{1,3}\s/g, '')          // Remove markdown headers
    .replace(/\*\*/g, '')              // Remove bold markers
    .replace(/```[\s\S]*?```/g, '')    // Remove code blocks
    .replace(/\n{3,}/g, '\n\n')        // Normalize line breaks
    .replace(/^-\s*/gm, '• ')          // Convert dashes to bullets
    .replace(/^(\d+)\.\s+/gm, '$1. ')  // Standardize numbered lists
    .replace(/([A-Z][A-Z\s]+):/g, '$1') // Remove colons from headers
    .replace(/^([A-Z][A-Z\s]+)$/gm, '\n$1\n') // Add spacing around main headers
    .replace(/^\s{2,}/gm, '   ')       // Convert varying indentation to 3 spaces
    .trim()

  return cleanContent
} 