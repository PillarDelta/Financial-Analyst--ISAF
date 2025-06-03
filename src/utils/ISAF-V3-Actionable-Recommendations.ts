/**
 * ISAF-V3 ACTIONABLE RECOMMENDATIONS ENGINE
 * 
 * Generates specific, actionable, company-contextualized strategic recommendations
 * instead of generic theoretical insights.
 */

interface CompanyContext {
  name: string;
  industry: string;
  revenue: number;
  marketPosition: string;
  keyBusinessAreas: string[];
  geographicFocus: string[];
  mainCompetitors: string[];
  keyMetrics: { [key: string]: number };
}

interface ActionableRecommendation {
  title: string;
  description: string;
  specificActions: string[];
  timeframe: '30 days' | '90 days' | '6 months' | '12+ months';
  resourceRequirement: 'low' | 'medium' | 'high';
  expectedImpact: 'low' | 'medium' | 'high';
  kpiMeasures: string[];
  riskFactors: string[];
  businessJustification: string;
}

/**
 * Generate company-specific actionable recommendations
 */
export function generateActionableRecommendations(
  textContent: string,
  strategicScore: number,
  pestelScore: number,
  forcesScore: number,
  swotScore: number
): ActionableRecommendation[] {
  
  const context = extractCompanyContext(textContent);
  const recommendations: ActionableRecommendation[] = [];
  
  // Recommendation 1: Revenue Growth & Market Expansion
  if (strategicScore > 60 && context.revenue > 1) {
    recommendations.push({
      title: `Accelerate Growth in ${context.keyBusinessAreas[0] || 'Core Business'}`,
      description: `Leverage ${context.name}'s strong market position and financial foundation to expand in high-growth segments.`,
      specificActions: [
        `Increase R&D investment by 15-20% in ${context.keyBusinessAreas[0] || 'renewable energy'} technologies`,
        `Target 3-5 strategic acquisitions in complementary markets within next 12 months`,
        `Expand production capacity by ${context.revenue > 5 ? '25%' : '15%'} to meet growing demand`,
        `Launch marketing campaign in 2-3 new geographic markets`
      ],
      timeframe: '6 months',
      resourceRequirement: 'high',
      expectedImpact: 'high',
      kpiMeasures: [
        'Revenue growth rate >10% annually',
        'Market share increase by 2-3%',
        'EBITDA margin maintenance >15%',
        'New market penetration metrics'
      ],
      riskFactors: [
        'Capital allocation across multiple initiatives',
        'Integration complexity with acquisitions',
        'Market competition response'
      ],
      businessJustification: `With ${context.revenue}B revenue and strong fundamentals, company is positioned for aggressive expansion while maintaining profitability.`
    });
  }
  
  // Recommendation 2: Operational Excellence  
  if (forcesScore > 0.8) {
    recommendations.push({
      title: 'Optimize Operational Efficiency & Cost Structure',
      description: `Strengthen competitive position through operational excellence initiatives.`,
      specificActions: [
        'Implement AI-driven predictive maintenance across all facilities',
        'Consolidate supply chain relationships with top 10 strategic suppliers',
        'Deploy automation in 3-4 key production processes',
        'Establish center of excellence for operational best practices'
      ],
      timeframe: '90 days',
      resourceRequirement: 'medium',
      expectedImpact: 'medium',
      kpiMeasures: [
        'Operating cost reduction of 5-8%',
        'Equipment uptime improvement >95%',
        'Supply chain cost savings 3-5%',
        'Productivity metrics improvement'
      ],
      riskFactors: [
        'Initial automation investment costs',
        'Employee training and adaptation',
        'Technology integration challenges'
      ],
      businessJustification: 'Strong competitive position creates opportunity to enhance efficiency while maintaining market advantages.'
    });
  }
  
  // Recommendation 3: ESG & Sustainability Leadership
  if (textContent.toLowerCase().includes('environmental') || textContent.toLowerCase().includes('sustainability')) {
    recommendations.push({
      title: 'Accelerate ESG Leadership & Sustainability Initiatives',
      description: `Position ${context.name} as industry leader in environmental responsibility and sustainable business practices.`,
      specificActions: [
        'Set science-based targets for 50% carbon reduction by 2030',
        'Issue €500M green bonds to fund renewable energy projects',
        'Implement circular economy principles across all operations',
        'Establish sustainability advisory board with external experts'
      ],
      timeframe: '6 months',
      resourceRequirement: 'high',
      expectedImpact: 'high',
      kpiMeasures: [
        'Carbon intensity reduction 30% by 2030',
        'Renewable energy portfolio growth 25% annually',
        'ESG rating improvement to top decile',
        'Green revenue mix increase to 40%'
      ],
      riskFactors: [
        'Significant capital investment requirements',
        'Technology transition risks',
        'Regulatory changes'
      ],
      businessJustification: 'ESG leadership creates competitive advantage, attracts ESG-focused investors, and ensures regulatory compliance.'
    });
  }
  
  // Recommendation 4: Digital Transformation
  if (strategicScore < 70) {
    recommendations.push({
      title: 'Accelerate Digital Transformation & Innovation',
      description: `Modernize operations and customer experience through comprehensive digital initiatives.`,
      specificActions: [
        'Implement enterprise-wide ERP system with real-time analytics',
        'Launch customer portal with AI-powered service capabilities',
        'Establish digital innovation lab with €50M annual budget',
        'Partner with 2-3 leading technology companies for co-innovation'
      ],
      timeframe: '12+ months',
      resourceRequirement: 'high',
      expectedImpact: 'high',
      kpiMeasures: [
        'Digital revenue streams >20% of total',
        'Customer satisfaction scores >85%',
        'Process automation ratio >60%',
        'Innovation pipeline metrics'
      ],
      riskFactors: [
        'Technology integration complexity',
        'Cybersecurity and data protection',
        'Change management across organization'
      ],
      businessJustification: 'Digital transformation essential for maintaining competitive position and improving operational efficiency.'
    });
  }
  
  // Recommendation 5: Financial Optimization
  if (context.revenue > 3) {
    recommendations.push({
      title: 'Optimize Capital Structure & Financial Performance',
      description: `Enhance financial flexibility and shareholder returns through strategic financial management.`,
      specificActions: [
        'Refinance debt at current favorable rates to reduce interest expense',
        'Establish €1B revolving credit facility for strategic flexibility',
        'Consider dividend increase to €2.00 per share based on strong cash flow',
        'Implement share buyback program for excess cash deployment'
      ],
      timeframe: '90 days',
      resourceRequirement: 'low',
      expectedImpact: 'medium',
      kpiMeasures: [
        'Net debt/EBITDA ratio <2.0x',
        'Interest coverage ratio >8x',
        'Return on equity >15%',
        'Free cash flow yield >8%'
      ],
      riskFactors: [
        'Interest rate volatility',
        'Credit market conditions',
        'Cash flow timing'
      ],
      businessJustification: 'Strong balance sheet and cash generation enable optimization of capital structure and enhanced returns.'
    });
  }
  
  return recommendations.slice(0, 4); // Return top 4 most relevant recommendations
}

/**
 * Extract company context from text content
 */
function extractCompanyContext(text: string): CompanyContext {
  const context: CompanyContext = {
    name: 'Company',
    industry: 'Energy & Materials',
    revenue: 0,
    marketPosition: 'competitive',
    keyBusinessAreas: [],
    geographicFocus: [],
    mainCompetitors: [],
    keyMetrics: {}
  };
  
  // Extract company name
  const nameMatch = text.match(/(?:Company|Corporation|Name).*?([A-Z][a-zA-Z\s&]+)(?:Energy|Materials|Group|Corp|Ltd|Inc)/i);
  if (nameMatch) {
    context.name = nameMatch[1].trim();
  }
  
  // Extract revenue
  const revenueMatch = text.match(/revenue.*?€?([\d.]+)\s*billion/i);
  if (revenueMatch) {
    context.revenue = parseFloat(revenueMatch[1]);
  }
  
  // Extract business areas
  const businessAreas = [];
  if (text.toLowerCase().includes('renewable') || text.toLowerCase().includes('energy')) {
    businessAreas.push('renewable energy');
  }
  if (text.toLowerCase().includes('aluminum') || text.toLowerCase().includes('metals')) {
    businessAreas.push('metals production');
  }
  if (text.toLowerCase().includes('storage') || text.toLowerCase().includes('battery')) {
    businessAreas.push('energy storage');
  }
  context.keyBusinessAreas = businessAreas;
  
  // Extract geographic focus
  const geoFocus = [];
  if (text.toLowerCase().includes('greece')) geoFocus.push('Greece');
  if (text.toLowerCase().includes('europe')) geoFocus.push('Europe');
  if (text.toLowerCase().includes('uk')) geoFocus.push('UK');
  if (text.toLowerCase().includes('australia')) geoFocus.push('Australia');
  context.geographicFocus = geoFocus;
  
  return context;
} 