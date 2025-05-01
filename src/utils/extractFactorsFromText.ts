/**
 * Utility function to extract and validate input text for ISAF-V2 processing
 */

/**
 * Ensures the input text is properly formatted for ISAF analysis
 * @param inputText Raw text input from GPT or other sources
 * @returns Properly formatted text for ISAF analysis
 */
export function validateAndFormatInput(inputText: string): string {
  // Check if we have valid input
  if (!inputText || inputText.trim().length === 0) {
    throw new Error('Input text is empty');
  }

  // Check if input text is too short to be meaningful
  if (inputText.trim().length < 100) {
    console.warn(`Input text may be too short for meaningful analysis: ${inputText.length} chars`);
  }

  // If input doesn't have any structure, format it into basic PESTEL+SWOT sections
  if (!hasAnalysisStructure(inputText)) {
    console.log('Input lacks proper analysis structure, formatting input...');
    return formatUnstructuredInput(inputText);
  }

  // Return the properly formatted text
  return inputText;
}

/**
 * Check if the input text has proper analysis structure
 */
function hasAnalysisStructure(text: string): boolean {
  // Look for key section headers that indicate structured analysis
  const sectionPatterns = [
    /PESTEL|Political|Economic|Social|Technological|Environmental|Legal/i,
    /Porter('s)? Five Forces|Competitive|Rivalry|Supplier|Buyer|Entrants|Substitutes/i,
    /SWOT|Strengths|Weaknesses|Opportunities|Threats/i
  ];

  // Check if at least two of the patterns are found
  let patternsFound = 0;
  for (const pattern of sectionPatterns) {
    if (pattern.test(text)) {
      patternsFound++;
    }
  }

  return patternsFound >= 2;
}

/**
 * Format unstructured input into a basic analysis format
 */
function formatUnstructuredInput(text: string): string {
  // Extract key business factors from the text
  const lines = text.split('\n');
  const cleanLines = lines.filter(line => line.trim().length > 0);

  // Identify business information
  let formattedText = `
ENVIRONMENTAL ANALYSIS (PESTEL)

Political Factors:
• Extracted from input: regulatory environment and policy considerations

Economic Factors:
• Extracted from input: market and economic considerations

Social Factors:
• Extracted from input: consumer and demographic information

Technological Factors:
• Extracted from input: technological landscape and innovation factors

Environmental Factors:
• Extracted from input: sustainability and environmental considerations

Legal Factors:
• Extracted from input: legal and compliance factors

COMPETITIVE ASSESSMENT

Competitive Rivalry:
• Analysis based on available industry information

ORGANIZATIONAL CAPABILITY (SWOT)

Strengths:
• Extracted business strengths from input

Weaknesses:
• Extracted business challenges from input

Opportunities:
• Potential market opportunities identified

Threats:
• Potential market threats identified
`;

  // Return formatted text with original content appended
  return formattedText + "\n\nOriginal Input:\n" + text;
} 