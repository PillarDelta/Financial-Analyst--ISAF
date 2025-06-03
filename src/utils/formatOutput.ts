/**
 * Format the output content to be professional and clean
 * Removes all markdown symbols, emojis, and unprofessional formatting
 */
export function formatOutput(content: string, analysisType?: string): string {
  if (!content) return '';
  
  // Apply professional formatting to all content
  return formatProfessional(content);
}

/**
 * Format content to be professional and clean
 */
function formatProfessional(content: string): string {
  let formatted = content;
  
  // Remove all emojis
  formatted = formatted.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
  
  // Remove markdown symbols
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '$1'); // Remove bold markdown
  formatted = formatted.replace(/\*([^*]+)\*/g, '$1'); // Remove italic markdown
  formatted = formatted.replace(/#{1,6}\s+/g, ''); // Remove header markdown
  formatted = formatted.replace(/---+/g, ''); // Remove horizontal rules
  formatted = formatted.replace(/```[^`]*```/g, ''); // Remove code blocks
  formatted = formatted.replace(/`([^`]+)`/g, '$1'); // Remove inline code
  
  // Clean up section headers and make them professional
  formatted = formatted.replace(/EXECUTIVE SUMMARY/gi, 'EXECUTIVE SUMMARY');
  formatted = formatted.replace(/STRATEGIC RECOMMENDATIONS/gi, 'STRATEGIC RECOMMENDATIONS');
  formatted = formatted.replace(/COMPANY PROFILE/gi, 'COMPANY PROFILE');
  formatted = formatted.replace(/FINANCIAL ANALYSIS/gi, 'FINANCIAL ANALYSIS');
  formatted = formatted.replace(/COMPETITIVE ASSESSMENT/gi, 'COMPETITIVE ASSESSMENT');
  formatted = formatted.replace(/IMPLEMENTATION PLAN/gi, 'IMPLEMENTATION PLAN');
  
  // Replace bullet points with professional formatting
  formatted = formatted.replace(/^[\s]*[•·▪▫-]\s+/gm, '  - ');
  
  // Clean up excessive whitespace
  formatted = formatted.replace(/\n{3,}/g, '\n\n'); // Max 2 consecutive newlines
  formatted = formatted.replace(/[ \t]{2,}/g, ' '); // Multiple spaces to single space
  formatted = formatted.replace(/^\s+|\s+$/g, ''); // Trim leading/trailing whitespace
  
  // Remove any remaining special characters that look unprofessional
  formatted = formatted.replace(/[→←↑↓↔⇒⇐⇑⇓⇔]/g, '->'); // Replace arrows
  formatted = formatted.replace(/[✓✗✘❌✅]/g, ''); // Remove checkmarks
  formatted = formatted.replace(/[🔍🎯📊🏢⚖️🤖🧮]/g, ''); // Remove any remaining business emojis
  
  return formatted;
}

/**
 * Legacy function for ISAF formatting - now applies professional formatting
 */
function formatISAF(content: string): string {
  return formatProfessional(content);
}

/**
 * Legacy function for question-focused formatting - now applies professional formatting
 */
function formatQuestionFocusedISAF(content: string): string {
  return formatProfessional(content);
}

/**
 * Extract the most question-focused content without unprofessional formatting
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
      return formatProfessional(match[1].trim());
    }
  }
  
  return null;
} 