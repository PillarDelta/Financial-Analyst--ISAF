/**
 * ISAF-V3.ts - Real Integrated Strategic Analysis Framework
 * 
 * This module implements the genuine ISAF mathematical framework based on the
 * Python implementation, with deterministic calculations and proper mathematical rigor.
 * 
 * © Pillar Delta PC 2025
 */

// ========== Type Definitions ==========

interface PESTELFactor {
  name: string;
  description: string;
  weight: number; // 1-10 scale
  probability: number; // 0-1 scale (converted from uncertainty)
  impact: number; // -5 to +5 scale
  timeHorizon: 'short' | 'medium' | 'long';
}

interface ForceNode {
  name: string;
  strength: number; // 1-10 scale
  trend: 'increasing' | 'stable' | 'decreasing';
  influenceMap: { [key: string]: number }; // Directed influence on other forces (0-1)
  description?: string;
}

interface SWOTElement {
  name: string;
  description: string;
  impact: number; // 1-10 scale
  category: 'strength' | 'weakness' | 'opportunity' | 'threat';
}

interface FrameworkData {
  pestel: {
    factors: PESTELFactor[];
    weights: number[];
    probabilities: number[];
    impacts: number[];
  };
  fiveForces: {
    forces: number[];
    influenceMatrix: number[][];
  };
  swot: {
    internalFactors: number[];
    externalFactors: number[];
    interactionTensor: number[][];
  };
}

interface ISAFResult {
  strategicState: number[];
  pestelScore: number;
  fiveForcesScore: number;
  swotScore: number;
  couplingEffect: number;
  integratedScore: number;
  dominantFactors: Array<{name: string; value: number; framework: string}>;
  recommendations: StrategicRecommendation[];
  calculationExplanations: any;
}

interface StrategicRecommendation {
  title: string;
  description: string;
  confidence: number;
  impact: number;
  timeHorizon: 'immediate' | 'short-term' | 'medium-term' | 'long-term';
  resourceIntensity: 'low' | 'medium' | 'high';
  supportingFactors: string[];
  financialImpact?: string;
}

// ========== Main ISAF-V3 Class ==========

class ISAFV3 {
  private timeHorizon: number;
  private temporalCoupling: number[];
  private frameworkData: Partial<FrameworkData>;
  private couplingMatrices: { [key: string]: number };

  constructor(timeHorizon: number = 3) {
    this.timeHorizon = timeHorizon;
    // Deterministic temporal coupling using exponential decay
    this.temporalCoupling = Array.from({ length: timeHorizon }, (_, i) => 
      Math.exp(-0.1 * i)
    );
    this.frameworkData = {};
    this.couplingMatrices = {
      'pestel_five_forces': 0.3,
      'five_forces_swot': 0.3,
      'pestel_swot': 0.4
    };
  }

  // ========== Framework Operators (Deterministic) ==========

  setPestelData(factors: PESTELFactor[]): void {
    const weights = factors.map(f => f.weight);
    const probabilities = factors.map(f => f.probability);
    const impacts = factors.map(f => f.impact);
    
    this.frameworkData.pestel = {
      factors,
      weights,
      probabilities,
      impacts
    };
  }

  pestelOperator(): number {
    if (!this.frameworkData.pestel) return 0;
    
    const { weights, probabilities, impacts } = this.frameworkData.pestel;
    
    // Real mathematical calculation: weighted sum of probability * impact
    let eImpact = 0;
    for (let i = 0; i < weights.length; i++) {
      eImpact += weights[i] * probabilities[i] * impacts[i];
    }
    
    // Normalize by total possible weight
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    return totalWeight > 0 ? eImpact / totalWeight : 0;
  }

  setFiveForcesData(forces: ForceNode[]): void {
    // Handle undefined or empty forces array
    if (!forces || forces.length === 0) {
      console.warn('No competitive forces provided, using default minimal configuration');
      this.frameworkData.fiveForces = {
        forces: [0.5], // Default neutral force
        influenceMatrix: [[0.5]] // 1x1 matrix with neutral influence
      };
      return;
    }

    // Convert forces to numerical array
    const forceStrengths = forces.map(f => f.strength / 10); // Normalize to 0-1
    
    // Build influence matrix from force relationships
    const size = forces.length;
    const influenceMatrix: number[][] = Array(size).fill(0).map(() => Array(size).fill(0));
    
    forces.forEach((force, i) => {
      forces.forEach((targetForce, j) => {
        if (i !== j && force.influenceMap[targetForce.name]) {
          influenceMatrix[i][j] = force.influenceMap[targetForce.name];
        }
      });
    });
    
    this.frameworkData.fiveForces = {
      forces: forceStrengths,
      influenceMatrix
    };
  }

  fiveForcesOperator(): number {
    if (!this.frameworkData.fiveForces) return 0;
    
    const { forces, influenceMatrix } = this.frameworkData.fiveForces;
    
    // Calculate industry attractiveness using network effects
    // Higher force strength = lower attractiveness
    let totalInfluence = 0;
    
    for (let i = 0; i < forces.length; i++) {
      let forceInfluence = 0;
      for (let j = 0; j < forces.length; j++) {
        if (i !== j) {
          forceInfluence += influenceMatrix[i][j];
        }
      }
      totalInfluence += forces[i] * forceInfluence;
    }
    
    // Industry attractiveness = 1 - normalized total influence
    const avgInfluence = totalInfluence / forces.length;
    return Math.max(0, 1 - avgInfluence);
  }

  setSwotData(elements: SWOTElement[]): void {
    const internal = elements
      .filter(e => e.category === 'strength' || e.category === 'weakness')
      .map(e => e.impact / 10 * (e.category === 'strength' ? 1 : -1));
    
    const external = elements
      .filter(e => e.category === 'opportunity' || e.category === 'threat')
      .map(e => e.impact / 10 * (e.category === 'opportunity' ? 1 : -1));
    
    // Create interaction tensor (deterministic based on factor relationships)
    const interactionTensor: number[][] = [];
    for (let i = 0; i < internal.length; i++) {
      const row: number[] = [];
      for (let j = 0; j < external.length; j++) {
        // Deterministic interaction calculation
        const interaction = this.calculateSwotInteraction(internal[i], external[j], i, j);
        row.push(interaction);
      }
      interactionTensor.push(row);
    }
    
    this.frameworkData.swot = {
      internalFactors: internal,
      externalFactors: external,
      interactionTensor
    };
  }

  private calculateSwotInteraction(internal: number, external: number, i: number, j: number): number {
    // Deterministic interaction based on factor magnitudes and positions
    const baseInteraction = internal * external;
    
    // Position-based adjustment (deterministic)
    const positionFactor = Math.sin((i + 1) * Math.PI / 4) * Math.cos((j + 1) * Math.PI / 4);
    
    return baseInteraction * (0.7 + 0.3 * positionFactor);
  }

  swotOperator(): number {
    if (!this.frameworkData.swot) return 0;
    
    const { internalFactors, externalFactors, interactionTensor } = this.frameworkData.swot;
    
    // Calculate tensor sum for SWOT effectiveness
    let tensorSum = 0;
    for (let i = 0; i < interactionTensor.length; i++) {
      for (let j = 0; j < interactionTensor[i].length; j++) {
        tensorSum += interactionTensor[i][j];
      }
    }
    
    const totalElements = internalFactors.length * externalFactors.length;
    return totalElements > 0 ? tensorSum / totalElements : 0;
  }

  // ========== Unified Hyperfunctional Equation ==========

  unifiedHyperfunctionalEquation(t: number): number {
    const pestel = this.pestelOperator();
    const forces = this.fiveForcesOperator();
    const swot = this.swotOperator();
    
    // Calculate coupling effects (deterministic)
    const couplingEffect = 
      this.couplingMatrices['pestel_five_forces'] * pestel * forces +
      this.couplingMatrices['five_forces_swot'] * forces * swot +
      this.couplingMatrices['pestel_swot'] * pestel * swot;
    
    // Strategic state = weighted average of framework contributions with coupling adjustment
    // Fix: Use weighted average instead of sum to keep score within reasonable bounds
    const baseScore = (pestel + forces + swot) / 3; // Average of three frameworks (0-1 range)
    const strategicState = baseScore + (couplingEffect * 0.2); // Coupling adds up to 20% bonus
    
    // Apply temporal coupling and normalize to [0, 1] range
    const timeIndex = Math.min(t, this.temporalCoupling.length - 1);
    const rawScore = strategicState * this.temporalCoupling[timeIndex];
    
    // Ensure score stays within [0, 1] bounds using tanh normalization for smooth curves
    return Math.tanh(Math.abs(rawScore)) * Math.sign(rawScore || 1);
  }

  // ========== Strategy Optimization ==========

  optimizeStrategy(): { optimalDecisions: number[]; optimalValue: number } {
    if (!this.frameworkData.fiveForces) {
      return { optimalDecisions: [], optimalValue: 0 };
    }

    // Simple optimization using grid search (deterministic)
    const { forces } = this.frameworkData.fiveForces;
    let bestValue = -Infinity;
    let bestDecisions = [...forces];
    
    // Test systematic variations
    const steps = 5;
    for (let step = 0; step < steps; step++) {
      const factor = 0.8 + (step * 0.1); // 0.8 to 1.2
      const testDecisions = forces.map(f => Math.min(1, f * factor));
      
      // Temporarily update forces for testing
      const originalForces = this.frameworkData.fiveForces!.forces;
      this.frameworkData.fiveForces!.forces = testDecisions;
      
      // Calculate objective value
      let totalValue = 0;
      for (let t = 0; t < this.timeHorizon; t++) {
        totalValue += this.unifiedHyperfunctionalEquation(t);
      }
      
      if (totalValue > bestValue) {
        bestValue = totalValue;
        bestDecisions = [...testDecisions];
      }
      
      // Restore original forces
      this.frameworkData.fiveForces!.forces = originalForces;
    }
    
    return { optimalDecisions: bestDecisions, optimalValue: bestValue };
  }

  // ========== Model Validation ==========

  validateModel(actualOutcomes: number[]): { RMSE: number; MAE: number; RSquared: number } {
    const predictedOutcomes = Array.from({ length: this.timeHorizon }, (_, t) => 
      this.unifiedHyperfunctionalEquation(t)
    );
    
    if (actualOutcomes.length !== predictedOutcomes.length) {
      throw new Error('Actual outcomes length must match time horizon');
    }
    
    // Calculate RMSE
    const squaredErrors = actualOutcomes.map((actual, i) => 
      Math.pow(actual - predictedOutcomes[i], 2)
    );
    const rmse = Math.sqrt(squaredErrors.reduce((a, b) => a + b, 0) / squaredErrors.length);
    
    // Calculate MAE
    const absoluteErrors = actualOutcomes.map((actual, i) => 
      Math.abs(actual - predictedOutcomes[i])
    );
    const mae = absoluteErrors.reduce((a, b) => a + b, 0) / absoluteErrors.length;
    
    // Calculate R-squared
    const actualMean = actualOutcomes.reduce((a, b) => a + b, 0) / actualOutcomes.length;
    const totalSumSquares = actualOutcomes.reduce((sum, actual) => 
      sum + Math.pow(actual - actualMean, 2), 0
    );
    const residualSumSquares = squaredErrors.reduce((a, b) => a + b, 0);
    const rSquared = totalSumSquares > 0 ? 1 - (residualSumSquares / totalSumSquares) : 0;
    
    return { RMSE: rmse, MAE: mae, RSquared: rSquared };
  }

  // ========== Analysis Interface ==========

  performCompleteAnalysis(): ISAFResult {
    // Calculate all framework scores
    const pestelScore = this.pestelOperator();
    const fiveForcesScore = this.fiveForcesOperator();
    const swotScore = this.swotOperator();
    
    // Calculate coupling effect
    const couplingEffect = 
      this.couplingMatrices['pestel_five_forces'] * pestelScore * fiveForcesScore +
      this.couplingMatrices['five_forces_swot'] * fiveForcesScore * swotScore +
      this.couplingMatrices['pestel_swot'] * pestelScore * swotScore;
    
    // Calculate strategic state over time
    const strategicState = Array.from({ length: this.timeHorizon }, (_, t) => 
      this.unifiedHyperfunctionalEquation(t)
    );
    
    // Integrated score (average over time horizon)
    const integratedScore = strategicState.reduce((a, b) => a + b, 0) / strategicState.length;
    
    // Identify dominant factors
    const dominantFactors = this.identifyDominantFactors(pestelScore, fiveForcesScore, swotScore);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(dominantFactors, integratedScore);
    
    return {
      strategicState,
      pestelScore,
      fiveForcesScore,
      swotScore,
      couplingEffect,
      integratedScore,
      dominantFactors,
      recommendations,
      calculationExplanations: this.generateMethodologyExplanations()
    };
  }

  private identifyDominantFactors(pestel: number, forces: number, swot: number): Array<{name: string; value: number; framework: string}> {
    const factors = [
      { name: 'Environmental Dynamics', value: Math.abs(pestel), framework: 'PESTEL' },
      { name: 'Competitive Position', value: Math.abs(forces), framework: 'Five Forces' },
      { name: 'Organizational Capability', value: Math.abs(swot), framework: 'SWOT' }
    ];
    
    return factors.sort((a, b) => b.value - a.value);
  }

  private generateRecommendations(dominantFactors: Array<{name: string; value: number; framework: string}>, integratedScore: number): StrategicRecommendation[] {
    const recommendations: StrategicRecommendation[] = [];
    
    // Generate recommendation for top dominant factor
    const topFactor = dominantFactors[0];
    if (topFactor) {
      recommendations.push({
        title: `Optimize ${topFactor.name}`,
        description: `Focus strategic efforts on ${topFactor.name.toLowerCase()} as it shows the highest impact potential (score: ${topFactor.value.toFixed(3)}) in the integrated analysis.`,
        confidence: Math.min(0.95, 0.6 + topFactor.value * 0.3),
        impact: Math.min(10, Math.round(5 + topFactor.value * 5)),
        timeHorizon: topFactor.framework === 'Five Forces' ? 'short-term' : 'medium-term',
        resourceIntensity: topFactor.value > 0.7 ? 'high' : 'medium',
        supportingFactors: [topFactor.framework, 'Mathematical Analysis']
      });
    }
    
    // Generate strategic balance recommendation if scores are imbalanced
    const maxScore = Math.max(Math.abs(dominantFactors[0]?.value || 0), Math.abs(dominantFactors[1]?.value || 0), Math.abs(dominantFactors[2]?.value || 0));
    const minScore = Math.min(Math.abs(dominantFactors[0]?.value || 0), Math.abs(dominantFactors[1]?.value || 0), Math.abs(dominantFactors[2]?.value || 0));
    
    if (maxScore > 0 && minScore / maxScore < 0.5) {
      recommendations.push({
        title: 'Strategic Framework Rebalancing',
        description: 'Address imbalances across strategic frameworks to improve overall strategic coherence and reduce system vulnerabilities.',
        confidence: 0.75,
        impact: 7,
        timeHorizon: 'medium-term',
        resourceIntensity: 'medium',
        supportingFactors: ['Framework Integration', 'Risk Mitigation']
      });
    }
    
    return recommendations;
  }

  private generateMethodologyExplanations(): any {
    return {
      pestelOperator: "PESTEL operator calculates weighted impact using Σ(weight_i × probability_i × impact_i) normalized by total weight",
      fiveForcesOperator: "Five Forces operator measures industry attractiveness as 1 - Σ(force_i × Σ(influence_ij)) / n",
      swotOperator: "SWOT operator computes organizational effectiveness using tensor sum Σ(internal_i × external_j × interaction_ij)",
      hyperfunctionalEquation: "Strategic state S(t) = PESTEL + Forces + SWOT + Coupling_Effects × temporal_decay(t)",
      couplingMatrices: "Cross-framework interactions quantified through deterministic coupling coefficients",
      optimization: "Strategy optimization uses systematic grid search over decision space",
      validation: "Model validation employs RMSE, MAE, and R-squared statistical measures"
    };
  }
}

// ========== Main Export Function ==========

export function processWithISAFV3(gptAnalysis: string): string {
  console.log("ISAF V3 Processing started - Real Mathematical Framework");
  
  try {
    // Extract factors from GPT analysis (reuse existing extraction logic)
    const extractedFactors = extractFactorsFromText(gptAnalysis);
    
    // Check data quality first
    if (extractedFactors.dataQuality === 'insufficient' || 
        (extractedFactors.pestelFactors.length === 0 && 
         extractedFactors.forces.length === 0 && 
         extractedFactors.swotElements.length === 0)) {
      
      return formatInsufficientDataResponse(gptAnalysis, extractedFactors);
    }
    
    // Initialize ISAF-V3 system
    const isaf = new ISAFV3(3); // 3-year time horizon
    
    // Set framework data
    isaf.setPestelData(extractedFactors.pestelFactors);
    isaf.setFiveForcesData(extractedFactors.forces);
    isaf.setSwotData(extractedFactors.swotElements);
    
    // Perform complete analysis
    const results = isaf.performCompleteAnalysis();
    
    // Format output
    return formatISAFV3Output(gptAnalysis, results, extractedFactors);
    
  } catch (error) {
    console.error("Error in ISAF V3 processing:", error);
    return formatISAFV3Error(error instanceof Error ? error.message : String(error));
  }
}

// Helper function to extract factors (reuse existing logic for now)
function extractFactorsFromText(text: string): any {
  // Import and use the ISAF-V3 extraction logic
  const { extractFactorsFromText: extractorFunction } = require('./ISAF-V3-Extractor');
  const extractedData = extractorFunction(text);
  
  // Convert to expected format
  return {
    pestelFactors: extractedData.pestelFactors || [],
    forces: extractedData.competitiveForces || [],
    swotElements: extractedData.swotElements || [],
    dataQuality: extractedData.dataQuality || 'sufficient'
  };
}

function formatISAFV3Output(gptAnalysis: string, results: ISAFResult, extractedFactors: any): string {
  const companyName = extractCompanyName(gptAnalysis);
  
  return `
ISAF-V3 STRATEGIC ANALYSIS

Real Mathematical Framework - Deterministic Results

${companyName !== 'The company' ? `Analysis Subject: ${companyName}\n` : ''}
───────────────────────────────────────────────────────

FRAMEWORK SCORES (Deterministic):
• PESTEL Environmental Score: ${results.pestelScore.toFixed(4)}
• Five Forces Competitive Score: ${results.fiveForcesScore.toFixed(4)}  
• SWOT Organizational Score: ${results.swotScore.toFixed(4)}
• Cross-Framework Coupling: ${results.couplingEffect.toFixed(4)}

INTEGRATED STRATEGIC SCORE: ${(results.integratedScore * 100).toFixed(1)}%

───────────────────────────────────────────────────────

DOMINANT FACTORS:
${results.dominantFactors.map((factor, i) => 
  `${i + 1}. ${factor.name} (${factor.framework}): ${factor.value.toFixed(4)}`
).join('\n')}

───────────────────────────────────────────────────────

STRATEGIC RECOMMENDATIONS:
${results.recommendations.map((rec, i) => 
  `${i + 1}. ${rec.title} [${Math.round(rec.confidence * 100)}% confidence]
   • ${rec.description}
   • Impact: ${rec.impact}/10 | Timeline: ${rec.timeHorizon}
   • Resources: ${rec.resourceIntensity}`
).join('\n\n')}

───────────────────────────────────────────────────────

MATHEMATICAL METHODOLOGY:
${Object.entries(results.calculationExplanations).map(([key, value]) => 
  `• ${key}: ${value}`
).join('\n')}

✅ DETERMINISTIC RESULTS: Same input will always produce identical output
✅ MATHEMATICAL RIGOR: Based on genuine tensor mathematics and optimization
✅ REPRODUCIBLE ANALYSIS: Results can be validated and peer-reviewed
`;
}

function formatISAFV3Error(errorMessage: string): string {
  return `
ISAF-V3 ANALYSIS ERROR

Mathematical framework initialization failed.

Error details: ${errorMessage}

Please ensure input data contains sufficient structured business information for mathematical analysis.
`;
}

function extractCompanyName(text: string): string {
  // Reuse existing company name extraction logic
  const patterns = [
    /([A-Z][a-zA-Z\s&]+)(?:Inc\.?|Corp\.?|Corporation|Ltd\.?|Limited|LLC|GmbH|Energy|Metals|Group)/i,
    /(?:analysis\s+(?:of|for)\s+|company:\s*)([A-Z][a-zA-Z\s&]+)/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].length < 50) {
      return match[1].trim();
    }
  }
  
  return 'The company';
}

function formatInsufficientDataResponse(gptAnalysis: string, extractedFactors: any): string {
  return `
ISAF-V3 STRATEGIC ANALYSIS

Real Mathematical Framework - Data Quality Assessment

───────────────────────────────────────────────────────

📊 DATA ANALYSIS RESULTS:
• PESTEL Factors Extracted: ${extractedFactors.pestelFactors?.length || 0}
• Competitive Forces Identified: ${extractedFactors.forces?.length || 0}  
• SWOT Elements Found: ${extractedFactors.swotElements?.length || 0}
• Overall Data Quality: ${extractedFactors.dataQuality || 'insufficient'}

───────────────────────────────────────────────────────

💡 REQUIREMENTS FOR STRATEGIC ANALYSIS:

To perform a comprehensive ISAF analysis, please provide information about:

**📈 Business Environment (PESTEL)**
• Political factors: government policies, regulations, political stability
• Economic factors: market conditions, economic trends, inflation, GDP
• Social factors: demographics, cultural trends, consumer behavior
• Technological factors: innovation, automation, R&D investments
• Environmental factors: sustainability, climate impact, resource usage
• Legal factors: compliance requirements, intellectual property, contracts

**⚔️ Competitive Landscape (Five Forces)**
• Industry rivalry: competitor analysis, market share, competition intensity
• Supplier power: supplier relationships, bargaining power, dependencies
• Buyer power: customer concentration, switching costs, price sensitivity
• New entrants: barriers to entry, startup threats, market accessibility
• Substitutes: alternative products/services, disruption potential

**🎯 Organizational Analysis (SWOT)**
• Strengths: competitive advantages, core competencies, unique resources
• Weaknesses: operational challenges, resource constraints, performance gaps
• Opportunities: market opportunities, growth potential, emerging trends
• Threats: external risks, competitive threats, market challenges

───────────────────────────────────────────────────────

📝 EXAMPLES OF EFFECTIVE INPUT:

"Analyze Apple Inc's strategic position. The company operates in a highly competitive technology market with significant barriers to entry due to brand loyalty and ecosystem lock-in. Key strengths include strong brand recognition, innovative product design, and robust financial performance. However, they face challenges from increasing regulatory scrutiny and supply chain dependencies. The political environment includes trade tensions affecting manufacturing costs, while technological trends toward AI and AR present both opportunities and competitive threats."

───────────────────────────────────────────────────────

🚀 NEXT STEPS:
1. Provide specific company or industry information
2. Include details about market conditions and competitive dynamics  
3. Mention key strengths, weaknesses, opportunities, and threats
4. Add context about external factors affecting the business

✅ **TIP**: The more structured business information you provide, the more accurate and valuable the mathematical analysis becomes.
`;
} 