/**
 * Format the output content based on the analysis type
 */
export function formatOutput(content: string, analysisType?: string): string {
  if (!content) return '';
  
  // If it's an ISAF analysis, check if it's a question response
  if (analysisType === 'isaf') {
    // Check if this is a response to a direct question
    if (content.includes('QUESTION ANALYSIS') || content.includes('DIRECT ANSWER:') || content.toLowerCase().includes('the question asks')) {
      console.log('Detected question-focused ISAF output, applying focused formatting');
      return formatQuestionFocusedISAF(content);
    }
    
    // Otherwise use standard ISAF formatting
    return formatISAF(content);
  }
  
  // For other analysis types, apply their specific formatting
  return content;
}

/**
 * Format ISAF-specific output with proper structure
 */
function formatISAF(content: string): string {
  // Format ISAF-specific output with proper structure
  const sections = [
    { title: 'EXECUTIVE SUMMARY', emoji: '📊' },
    { title: 'ENVIRONMENTAL ANALYSIS', emoji: '🌐' },
    { title: 'COMPETITIVE ASSESSMENT', emoji: '🏆' },
    { title: 'ORGANIZATIONAL CAPABILITY', emoji: '🏢' },
    { title: 'STRATEGIC RECOMMENDATIONS', emoji: '🎯' }
  ];
  
  let formatted = content;
  
  // Format section headers
  sections.forEach(section => {
    const pattern = new RegExp(`(${section.title}|${section.title.toUpperCase()})`, 'g');
    formatted = formatted.replace(pattern, `\n\n${section.emoji} **${section.title}**`);
  });
  
  // Format sub-headers
  const subheaderPattern = /([A-Z][A-Z\s]{2,}:)/g;
  formatted = formatted.replace(subheaderPattern, '\n\n**$1**');
  
  // Format bullet points
  const bulletPattern = /•\s/g;
  formatted = formatted.replace(bulletPattern, '• ');
  
  return formatted;
}

/**
 * Format question-focused ISAF output to emphasize direct answers
 */
function formatQuestionFocusedISAF(content: string): string {
  // Start with basic ISAF formatting
  let formatted = formatISAF(content);
  
  // Add special emphasis to direct answers and impacts
  const answerPatterns = [
    { pattern: /(DIRECT ANSWER:[\s\S]*?)(?=\n\n|\n\*\*|$)/i, prefix: '\n\n🔍 **ANSWER:**\n' },
    { pattern: /(IMPACT ANALYSIS:[\s\S]*?)(?=\n\n|\n\*\*|$)/i, prefix: '\n\n💼 **IMPACT ANALYSIS:**\n' },
    { pattern: /(KEY STRATEGIC IMPLICATIONS:[\s\S]*?)(?=\n\n|\n\*\*|$)/i, prefix: '\n\n🔑 **KEY STRATEGIC IMPLICATIONS:**\n' },
    { pattern: /(CONCLUSION:[\s\S]*?)(?=\n\n|\n\*\*|$)/i, prefix: '\n\n📝 **CONCLUSION:**\n' }
  ];
  
  for (const { pattern, prefix } of answerPatterns) {
    const match = formatted.match(pattern);
    if (match && match[1]) {
      const content = match[1].replace(/DIRECT ANSWER:|IMPACT ANALYSIS:|KEY STRATEGIC IMPLICATIONS:|CONCLUSION:/i, '').trim();
      formatted = formatted.replace(match[0], `${prefix}${content}`);
    }
  }
  
  // Look for question-focused content in the output
  if (formatted.match(/the question asks|regarding the question|to answer this question/i)) {
    const questionFocusedContent = extractQuestionFocusedContent(content);
    if (questionFocusedContent) {
      formatted = `\n\n📌 **STRATEGIC ANSWER:**\n${questionFocusedContent}\n\n${formatted}`;
    }
  }
  
  return formatted;
}

/**
 * Extract the most question-focused content from an ISAF analysis
 */
function extractQuestionFocusedContent(content: string): string | null {
  // Pattern matching for direct answers to questions
  const patterns = [
    /in\s+(?:response|answer)\s+to\s+the\s+question[^.]*,?\s+([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i,
    /the\s+(?:answer|response)\s+to\s+the\s+question\s+is[^.]*,?\s+([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i,
    /to\s+(?:answer|address)\s+the\s+question[^.]*,?\s+([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i,
    /(?:impact|effect|implication)(?:\s+of\s+|\s+)(?:the\s+)?\d+%\s+tariff[^.]*\s+would\s+be[^.]*,?\s+([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i,
    /a\s+\d+%\s+tariff\s+would[^.]*,?\s+([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i
  ];
  
  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return null;
} 