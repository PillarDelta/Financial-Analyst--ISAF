/**
 * ISAF-V3-Extractor.ts - Deterministic Factor Extraction
 * 
 * This module extracts factors from ChatGPT's formatted text and converts them
 * into mathematical parameters using deterministic rules.
 * 
 * DETERMINISTIC EXTRACTION - NO VARIATION
 */

interface PESTELFactor {
  name: string;
  description: string;
  weight: number;
  probability: number;
  impact: number;
  timeHorizon: 'short' | 'medium' | 'long';
}

interface ForceNode {
  name: string;
  strength: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  influenceMap: { [key: string]: number };
  description?: string;
}

interface SWOTElement {
  name: string;
  description: string;
  impact: number;
  confidence: number;
  timeframe: 'immediate' | 'short' | 'medium' | 'long';
  category: 'strength' | 'weakness' | 'opportunity' | 'threat';
}

interface ExtractionResult {
  pestelFactors: PESTELFactor[];
  competitiveForces: ForceNode[];
  swotElements: SWOTElement[];
  dataQuality: 'high' | 'medium' | 'low' | 'insufficient';
  evidenceCount: number;
}

/**
 * MAIN EXTRACTION FUNCTION - DETERMINISTIC PROCESSING
 * Extracts factors from ChatGPT's simple formatted output using fixed rules
 */
export function extractFactorsFromText(text: string): ExtractionResult {
  console.log('ISAF-V3 Factor Extraction started...');
  
  if (!text || text.trim().length < 50) {
    return {
      pestelFactors: [],
      competitiveForces: [],
      swotElements: [],
      dataQuality: 'insufficient',
      evidenceCount: 0
    };
  }

  // Extract using deterministic rules from formatted sections
  const pestelFactors = extractPESTELFactors(text);
  const competitiveForces = extractCompetitiveForces(text);
  const swotElements = extractSWOTElements(text);
  
  // Calculate data quality deterministically
  const evidenceCount = pestelFactors.length + competitiveForces.length + swotElements.length;
  const dataQuality = calculateDataQuality(evidenceCount, text.length);
  
  console.log(`Extracted: ${pestelFactors.length} PESTEL factors, ${competitiveForces.length} forces, ${swotElements.length} SWOT elements`);
  console.log(`Extraction quality: ${dataQuality}`);
  
  return {
    pestelFactors,
    competitiveForces,
    swotElements,
    dataQuality,
    evidenceCount
  };
}

/**
 * Extract PESTEL factors using deterministic rules
 */
function extractPESTELFactors(text: string): PESTELFactor[] {
  const factors: PESTELFactor[] = [];
  
  // Extract from specific sections using deterministic rules
  const sections = [
    { name: 'Political', section: 'REGULATORY AND LEGAL INFORMATION' },
    { name: 'Economic', section: 'FINANCIAL DATA' },
    { name: 'Social', section: 'SOCIAL AND COMMUNITY' },
    { name: 'Technological', section: 'TECHNOLOGY AND INNOVATION' },
    { name: 'Environmental', section: 'ENVIRONMENTAL AND SUSTAINABILITY' },
    { name: 'Legal', section: 'REGULATORY AND LEGAL INFORMATION' }
  ];
  
  sections.forEach(({ name, section }) => {
    const sectionContent = extractSectionContent(text, section);
    if (sectionContent && sectionContent.length > 20) {
      // Create exactly one factor per section if content exists
      factors.push({
        name: `${name} Factor`,
        description: sectionContent.substring(0, 200).trim(),
        weight: calculateDeterministicWeight(sectionContent),
        probability: calculateDeterministicProbability(sectionContent),
        impact: calculateDeterministicImpact(sectionContent),
        timeHorizon: calculateDeterministicTimeHorizon(sectionContent)
      });
    }
  });
  
  return factors;
}

/**
 * Extract competitive forces using deterministic rules
 */
function extractCompetitiveForces(text: string): ForceNode[] {
  const forces: ForceNode[] = [];
  
  // Define force mappings to sections
  const forceMappings = [
    { name: 'Supplier Power', sections: ['COMPETITIVE LANDSCAPE'] },
    { name: 'Buyer Power', sections: ['MARKET INFORMATION'] },
    { name: 'Competitive Rivalry', sections: ['COMPETITIVE LANDSCAPE'] },
    { name: 'Threat of Substitutes', sections: ['MARKET INFORMATION'] },
    { name: 'Threat of New Entrants', sections: ['COMPETITIVE LANDSCAPE'] }
  ];
  
  forceMappings.forEach(({ name, sections }) => {
    let combinedContent = '';
    sections.forEach(section => {
      const content = extractSectionContent(text, section);
      if (content) combinedContent += ' ' + content;
    });
    
    if (combinedContent.length > 20) {
      forces.push({
        name,
        strength: calculateDeterministicStrength(combinedContent),
        trend: calculateDeterministicTrend(combinedContent),
        influenceMap: {},
        description: combinedContent.substring(0, 200).trim()
      });
    }
  });
  
  return forces;
}

/**
 * Extract SWOT elements using deterministic rules
 */
function extractSWOTElements(text: string): SWOTElement[] {
  const elements: SWOTElement[] = [];
  
  // Map sections to SWOT categories
  const swotMappings = [
    { category: 'strength' as const, section: 'STRENGTHS AND ADVANTAGES' },
    { category: 'weakness' as const, section: 'CHALLENGES AND WEAKNESSES' },
    { category: 'opportunity' as const, section: 'OPPORTUNITIES' },
    { category: 'threat' as const, section: 'THREATS AND RISKS' }
  ];
  
  swotMappings.forEach(({ category, section }) => {
    const sectionContent = extractSectionContent(text, section);
    if (sectionContent && sectionContent.length > 20) {
      // Create exactly one element per section if content exists
      elements.push({
        name: `${category.charAt(0).toUpperCase() + category.slice(1)}`,
        description: sectionContent.substring(0, 200).trim(),
        impact: calculateDeterministicImpact(sectionContent),
        confidence: calculateDeterministicConfidence(sectionContent),
        timeframe: calculateDeterministicTimeframe(sectionContent),
        category
      });
    }
  });
  
  return elements;
}

/**
 * Extract section content deterministically
 */
function extractSectionContent(text: string, sectionHeader: string): string | null {
  const regex = new RegExp(`###\\s*${sectionHeader}([\\s\\S]*?)(?=###|$)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}

/**
 * DETERMINISTIC CALCULATION FUNCTIONS
 * These use fixed mathematical rules based on text characteristics
 */

function calculateDeterministicWeight(text: string): number {
  // Weight based on text length and keyword count
  const baseWeight = Math.min(10, Math.max(1, text.length / 50));
  const keywords = text.match(/\b\w+\b/g) || [];
  const keywordBonus = Math.min(3, keywords.length / 20);
  return Math.round(baseWeight + keywordBonus);
}

function calculateDeterministicProbability(text: string): number {
  // Probability based on character count (deterministic)
  const charCount = text.length;
  const baseProbability = 0.3 + (charCount % 100) / 100 * 0.7;
  return Math.round(baseProbability * 100) / 100;
}

function calculateDeterministicImpact(text: string): number {
  // Impact based on text length and word count
  const wordCount = (text.match(/\b\w+\b/g) || []).length;
  const impact = (wordCount % 11) - 5; // Gives -5 to +5 range
  return impact;
}

function calculateDeterministicStrength(text: string): number {
  // Strength based on character count
  const strength = 1 + (text.length % 10);
  return Math.min(10, strength);
}

function calculateDeterministicTrend(text: string): 'increasing' | 'stable' | 'decreasing' {
  // Trend based on text length modulo
  const mod = text.length % 3;
  if (mod === 0) return 'increasing';
  if (mod === 1) return 'stable';
  return 'decreasing';
}

function calculateDeterministicConfidence(text: string): number {
  // Confidence based on word count
  const wordCount = (text.match(/\b\w+\b/g) || []).length;
  const confidence = 0.2 + (wordCount % 80) / 100;
  return Math.round(confidence * 100) / 100;
}

function calculateDeterministicTimeHorizon(text: string): 'short' | 'medium' | 'long' {
  // Time horizon based on character count modulo
  const mod = text.length % 3;
  if (mod === 0) return 'short';
  if (mod === 1) return 'medium';
  return 'long';
}

function calculateDeterministicTimeframe(text: string): 'immediate' | 'short' | 'medium' | 'long' {
  // Timeframe based on character count modulo
  const mod = text.length % 4;
  if (mod === 0) return 'immediate';
  if (mod === 1) return 'short';
  if (mod === 2) return 'medium';
  return 'long';
}

function calculateDataQuality(evidenceCount: number, textLength: number): 'high' | 'medium' | 'low' | 'insufficient' {
  // Deterministic quality assessment
  if (evidenceCount === 0 || textLength < 100) return 'insufficient';
  if (evidenceCount >= 6 && textLength >= 1000) return 'high';
  if (evidenceCount >= 3 && textLength >= 500) return 'medium';
  return 'low';
} 