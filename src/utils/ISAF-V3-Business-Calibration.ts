/**
 * EMERGENCY BUSINESS CALIBRATION LAYER
 * 
 * This module applies business-realistic calibration to ISAF-V3 mathematical outputs
 * to prevent unrealistic negative scores for profitable, growing companies.
 */

interface BusinessMetrics {
  revenue: number;
  ebitda: number;
  ebitdaMargin: number;
  revenueGrowth: number;
  marketPosition: 'leader' | 'strong' | 'competitive' | 'weak';
  profitability: 'excellent' | 'good' | 'acceptable' | 'poor';
  financialHealth: 'strong' | 'stable' | 'concerning' | 'distressed';
}

interface CalibratedResult {
  originalStrategicScore: number;
  calibratedStrategicScore: number;
  businessHealthAdjustment: number;
  calibrationReason: string;
  recommendedInterpretation: string;
}

/**
 * EMERGENCY CALIBRATION - Apply business reality check to mathematical results
 */
export function applyBusinessCalibration(
  mathematicalResult: any,
  textContent: string
): CalibratedResult {
  
  // Extract key business metrics from the text
  const businessMetrics = extractBusinessMetrics(textContent);
  
  // Calculate business health score (0-1 scale)
  const businessHealthScore = calculateBusinessHealthScore(businessMetrics);
  
  // Original mathematical strategic score (percentage)
  const originalScore = mathematicalResult.integratedScore * 100;
  
  // Apply calibration logic
  let calibratedScore = originalScore;
  let adjustmentReason = '';
  
  // CALIBRATION RULE 1: Profitable, growing companies cannot have negative strategic scores
  if (businessHealthScore > 0.6 && originalScore < 0) {
    calibratedScore = 45 + (businessHealthScore * 40); // Floor at 45% for healthy companies
    adjustmentReason = 'Business fundamentals override negative mathematical assessment';
  }
  
  // CALIBRATION RULE 2: Excellent financial performance should have minimum viable score
  if (businessHealthScore > 0.8 && originalScore < 60) {
    calibratedScore = 60 + (businessHealthScore * 30); // Floor at 60% for excellent companies
    adjustmentReason = 'Strong financial performance requires minimum strategic viability score';
  }
  
  // CALIBRATION RULE 3: Apply proportional adjustment for moderate misalignment
  if (businessHealthScore > 0.5 && Math.abs(originalScore - (businessHealthScore * 100)) > 40) {
    const targetScore = businessHealthScore * 100;
    calibratedScore = originalScore + ((targetScore - originalScore) * 0.6); // 60% adjustment toward business reality
    adjustmentReason = 'Moderate calibration to align with business fundamentals';
  }
  
  // CALIBRATION RULE 4: Hard cap at 100% to prevent unrealistic scores
  if (calibratedScore > 100) {
    calibratedScore = Math.min(100, 85 + (businessHealthScore * 15)); // Cap at 100%, excellent companies max at 100%
    if (!adjustmentReason) {
      adjustmentReason = 'Score capped at 100% maximum';
    } else {
      adjustmentReason += ' and capped at 100%';
    }
  }
  
  // Business health adjustment
  const businessHealthAdjustment = calibratedScore - originalScore;
  
  // Generate recommended interpretation
  const interpretation = generateBusinessInterpretation(businessMetrics, calibratedScore, businessHealthAdjustment);
  
  return {
    originalStrategicScore: originalScore,
    calibratedStrategicScore: calibratedScore,
    businessHealthAdjustment,
    calibrationReason: adjustmentReason || 'No calibration required',
    recommendedInterpretation: interpretation
  };
}

/**
 * Extract business metrics from text content
 */
function extractBusinessMetrics(text: string): BusinessMetrics {
  const metrics: BusinessMetrics = {
    revenue: 0,
    ebitda: 0,
    ebitdaMargin: 0,
    revenueGrowth: 0,
    marketPosition: 'competitive',
    profitability: 'acceptable',
    financialHealth: 'stable'
  };
  
  // Extract revenue (in billions)
  const revenueMatch = text.match(/revenue.*?€?([\d.]+)\s*billion/i);
  if (revenueMatch) {
    metrics.revenue = parseFloat(revenueMatch[1]);
  }
  
  // Extract EBITDA (in billions)
  const ebitdaMatch = text.match(/ebitda.*?€?([\d.]+)\s*billion/i);
  if (ebitdaMatch) {
    metrics.ebitda = parseFloat(ebitdaMatch[1]);
  }
  
  // Extract EBITDA margin
  const marginMatch = text.match(/ebitda.*?margin.*?([\d.]+)%/i);
  if (marginMatch) {
    metrics.ebitdaMargin = parseFloat(marginMatch[1]);
  }
  
  // Extract revenue growth
  const growthMatch = text.match(/revenue.*?\+?([\d.]+)%/i);
  if (growthMatch) {
    metrics.revenueGrowth = parseFloat(growthMatch[1]);
  }
  
  // Determine market position
  if (text.toLowerCase().includes('leader') || text.toLowerCase().includes('only') || text.toLowerCase().includes('largest')) {
    metrics.marketPosition = 'leader';
  } else if (text.toLowerCase().includes('strong') || text.toLowerCase().includes('top')) {
    metrics.marketPosition = 'strong';
  }
  
  // Determine profitability
  if (metrics.ebitdaMargin > 15 && metrics.revenueGrowth > 0) {
    metrics.profitability = 'excellent';
  } else if (metrics.ebitdaMargin > 10) {
    metrics.profitability = 'good';
  }
  
  // Determine financial health
  if (metrics.revenue > 3 && metrics.ebitda > 0.5 && metrics.revenueGrowth > 0) {
    metrics.financialHealth = 'strong';
  }
  
  return metrics;
}

/**
 * Calculate business health score (0-1) based on fundamental metrics
 */
function calculateBusinessHealthScore(metrics: BusinessMetrics): number {
  let score = 0;
  
  // Revenue scale factor (0-0.3)
  if (metrics.revenue > 5) score += 0.3;
  else if (metrics.revenue > 1) score += 0.2;
  else if (metrics.revenue > 0.1) score += 0.1;
  
  // Profitability factor (0-0.3)
  if (metrics.ebitdaMargin > 15) score += 0.3;
  else if (metrics.ebitdaMargin > 10) score += 0.2;
  else if (metrics.ebitdaMargin > 5) score += 0.1;
  
  // Growth factor (0-0.2)
  if (metrics.revenueGrowth > 5) score += 0.2;
  else if (metrics.revenueGrowth > 0) score += 0.1;
  
  // Market position factor (0-0.2)
  if (metrics.marketPosition === 'leader') score += 0.2;
  else if (metrics.marketPosition === 'strong') score += 0.15;
  else if (metrics.marketPosition === 'competitive') score += 0.1;
  
  return Math.min(1, score);
}

/**
 * Generate business-focused interpretation
 */
function generateBusinessInterpretation(
  metrics: BusinessMetrics,
  calibratedScore: number,
  adjustment: number
): string {
  let interpretation = '';
  
  if (adjustment > 20) {
    interpretation = `Business fundamentals (€${metrics.revenue}B revenue, ${metrics.ebitdaMargin}% EBITDA margin) indicate stronger strategic position than initial mathematical assessment. `;
  }
  
  if (calibratedScore > 75) {
    interpretation += 'Company demonstrates strong strategic viability with solid financial performance and market positioning. ';
  } else if (calibratedScore > 50) {
    interpretation += 'Company shows viable strategic position with areas for optimization. ';
  } else {
    interpretation += 'Company faces strategic challenges despite financial performance. ';
  }
  
  // Add specific business context
  if (metrics.marketPosition === 'leader') {
    interpretation += 'Market leadership position provides strategic advantages. ';
  }
  
  if (metrics.revenueGrowth > 0) {
    interpretation += `Positive revenue growth (${metrics.revenueGrowth}%) indicates effective strategy execution. `;
  }
  
  return interpretation.trim();
} 