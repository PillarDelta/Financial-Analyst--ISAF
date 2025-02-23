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

  // Process content without adding HTML tags
  const processedContent = cleanContent
    // Format numbers in blue
    .replace(/\b\d+([.,]\d+)?(?![A-Za-z])/g, match => 
      `${match}`
    )
    // Format months and years
    .replace(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b/g, match => {
      const [month, year] = match.split(' ');
      return `${month} ${year}`;
    })

  // Split into sections and format
  const sections = processedContent.split('\n\n').map(section => {
    // Keep text formatting simple
    if (section.startsWith('CONTEXT SUMMARY') || section.startsWith('DIFS ANALYSIS')) {
      return section;
    }

    if (/^\d+\.\s+[A-Z]/.test(section)) {
      return section;
    }

    return section;
  });

  // Return clean text without HTML
  return sections.join('\n\n');
} 