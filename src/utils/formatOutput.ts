export function formatOutput(content: string, analysisType?: string): string {
  if (content.includes("does not comply") || 
      content.includes("Failed to process") ||
      content.includes("ERROR IN ISAF PROCESSING")) {
    return content;
  }

  // Special formatting for ISAF analysis
  if (analysisType === 'isaf') {
    return formatISAFOutput(content);
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

// Special formatting for ISAF output to enhance readability of mathematical components
function formatISAFOutput(content: string): string {
  // Clean basic formatting - more aggressive cleaning of markdown
  let cleanContent = content
    .replace(/#{1,3}\s*/g, '') // Remove all # headers completely
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Replace **text** with just text
    .replace(/\*\*([^*]+)/g, '$1') // Handle unclosed asterisks
    .replace(/([^*]+)\*\*/g, '$1') // Handle unopened asterisks
    .replace(/\*([^*]+)\*/g, '$1') // Replace *text* with just text
    .replace(/\*/g, '') // Remove any remaining asterisks
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^-\s*/gm, '• ')
    .trim();
  
  // Make sure the content has all the necessary sections
  const hasExecutiveSummary = /EXECUTIVE SUMMARY/i.test(cleanContent);
  if (!hasExecutiveSummary) {
    cleanContent = "EXECUTIVE SUMMARY\n\nStrategic analysis results processed with ISAF mathematical framework.\n\n" + cleanContent;
  }
  
  // Preserve code blocks for mathematical representations
  // but make them more readable
  cleanContent = cleanContent.replace(/```[\s\S]*?```/g, (match) => {
    return match
      .replace(/```/g, '')
      .replace(/^/gm, '  ')
      .trim();
  });

  // Format recommendation structured sections - convert colon format
  cleanContent = cleanContent.replace(/([A-Za-z\s&]+):\s+([A-Za-z])/g, (_, title, firstChar) => {
    return `${title} - ${firstChar}`;
  });

  // Format numbered lists consistently, preserving numbers but standardizing format
  cleanContent = cleanContent.replace(/^(\d+)\.\s*(.+)$/gm, (_, num, text) => {
    return `${num}. ${text.trim()}`;
  });

  // Format numeric values consistently
  cleanContent = cleanContent.replace(/(\d+)\/(\d+)/g, (_, num, denom) => {
    const value = parseInt(num) / parseInt(denom);
    return `${num}/${denom} (${(value * 10).toFixed(1)})`;
  });

  // Create visually distinct section headers with horizontal lines
  const formatSectionHeader = (title: string): string => {
    return `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${title}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  };

  // Enhance section headers for ISAF
  cleanContent = cleanContent
    .replace(/^STRATEGIC RECOMMENDATIONS/gim, formatSectionHeader('STRATEGIC RECOMMENDATIONS'))
    .replace(/^EXECUTIVE SUMMARY/gm, 'EXECUTIVE SUMMARY')
    .replace(/^ENVIRONMENTAL ANALYSIS(?:\s*\(PESTEL\))?/gm, 'ENVIRONMENTAL ANALYSIS')
    .replace(/^COMPETITIVE ASSESSMENT(?:\s*\(Porter's Five Forces\))?/gm, 'COMPETITIVE ASSESSMENT')
    .replace(/^ORGANIZATIONAL CAPABILITY(?:\s*\(SWOT\))?/gm, 'ORGANIZATIONAL CAPABILITY')
    .replace(/^INTEGRATED STRATEGIC MODEL/gm, formatSectionHeader('INTEGRATED STRATEGIC MODEL'));

  // Improve bullet points formatting
  cleanContent = cleanContent.replace(/^• /gm, '• ');

  return cleanContent;
} 