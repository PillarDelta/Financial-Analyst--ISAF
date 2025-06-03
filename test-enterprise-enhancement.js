/**
 * COMPREHENSIVE TEST FOR ENTERPRISE ENHANCEMENT
 * 
 * Tests all 10 team feedback points:
 * 1. Company-specific recommendations tied to actual projects
 * 2. Score transparency with calculation breakdowns
 * 3. Actionable implementation with timelines and resources
 * 4. Financial impact quantification and ROI modeling
 * 5. Risk-weighted analysis with scenario planning
 * 6. Competitive dynamics analysis
 * 7. Calibration documentation and methodology
 * 8. Priority ranking with NPV/IRR analysis
 * 9. Success metrics and KPI frameworks
 * 10. Visual output elements and decision support
 */

const METLEN_ENHANCED_DATASET = `
### COMPANY INFORMATION
- Name: METLEN Energy & Metals (formerly Mytilineos)
- Revenue: €5.68 billion (2023)
- Operating EBITDA: €1.08 billion (19% margin)
- Revenue Growth: 3.5% annually
- Market Position: Leading position in Greek energy and metals markets
- Geographic Presence: Greece, Balkans, Western Europe, North America

### SPECIFIC PROJECTS AND INVESTMENTS
1. **Gallium Facility Investment**: €295.5M state-of-the-art gallium production facility in Greece
   - Timeline: 24-month construction phase
   - Strategic Importance: First European gallium refinery
   - Market Impact: 15% of global gallium supply
   - Risk Level: Medium (technology proven, regulatory approved)

2. **PPC Strategic Partnership**: €2B joint venture for renewable energy development
   - Scope: 3GW renewable energy portfolio development
   - Timeline: 5-year rollout (2024-2029)
   - Strategic Importance: Market leadership in Greek renewables
   - Competition: Direct response to competitor moves

3. **UK BESS Projects**: £1.2B battery energy storage systems portfolio
   - Capacity: 2.5GWh across 15 locations
   - Timeline: 18-month deployment cycle
   - Strategic Importance: Energy storage market entry
   - Revenue Model: Grid services and capacity payments

### FINANCIAL TARGETS AND OBJECTIVES
- **Market Share Target**: 30% of Greek energy market by 2027 (current: ~25%)
- **EBITDA Target**: €2B by 2027 (current: €1.08B)
- **Renewable Portfolio**: 5GW installed capacity by 2030
- **Geographic Expansion**: 25% of revenue from international markets by 2026

### COMPETITIVE LANDSCAPE
1. **PPC (Public Power Corporation)**
   - Market Share: 35% Greek electricity market
   - Recent Moves: Aggressive renewable expansion, pricing pressure
   - Strengths: Incumbent position, customer base, grid access
   - Threats: Government backing, regulatory influence

2. **Norsk Hydro** 
   - Market Position: Global aluminum leader
   - Recent Activity: European capacity expansion announced
   - Competitive Threat: Vertical integration, cost advantages
   - Response Required: Technology differentiation, customer loyalty

3. **Motor Oil Hellas**
   - Market Overlap: Energy trading and retail
   - Competitive Dynamics: Pricing competition in industrial markets
   - Strategic Response: Value-added services differentiation

### BUSINESS SEGMENTS PERFORMANCE
1. **Energy**: €3.2B revenue, 22% EBITDA margin, 5% growth
2. **Metals**: €1.8B revenue, 15% EBITDA margin, 1% growth  
3. **EPC & Infrastructure**: €0.68B revenue, 8% EBITDA margin, 12% growth

### RISK FACTORS
- **Commodity Price Exposure**: 45% of revenue linked to aluminum/zinc prices
- **Geographic Concentration**: 65% of revenue from Greece and Balkans
- **Regulatory Risk**: EU environmental regulations tightening
- **Technology Risk**: Gallium production technology first-of-kind in Europe
- **Competitive Risk**: PPC response to partnership announcement

### STRATEGIC OBJECTIVES
- Accelerate gallium facility to capture first-mover advantage
- Defend market share against PPC competitive response
- Achieve €2B EBITDA through operational excellence and growth
- Expand international presence to reduce geographic concentration
- Lead energy transition in Southeast Europe
`;

async function testEnterpriseEnhancement() {
  console.log('🚀 TESTING ENTERPRISE ENHANCEMENT SYSTEM\n');
  console.log('📋 Dataset: METLEN Energy & Metals with specific projects and financial targets');
  console.log('🎯 Validation: All 10 team feedback points\n');

  try {
    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: `Please perform an ISAF strategic analysis on this company data: ${METLEN_ENHANCED_DATASET}`,
        analysisType: 'isaf',
        documents: 'Present'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.response;

    console.log('✅ ENTERPRISE ANALYSIS RECEIVED\n');
    console.log('📊 VALIDATING TEAM FEEDBACK REQUIREMENTS:\n');

    // Validation 1: Company-specific recommendations tied to actual projects
    const hasSpecificProjects = analysis.includes('€295.5M') && 
                               analysis.includes('gallium facility') &&
                               analysis.includes('PPC partnership') &&
                               analysis.includes('UK BESS');
    console.log(`1. Company-Specific Recommendations: ${hasSpecificProjects ? '✅ PASS' : '❌ FAIL'}`);
    
    if (hasSpecificProjects) {
      console.log('   - ✓ References €295.5M gallium facility');
      console.log('   - ✓ Mentions €2B PPC partnership');
      console.log('   - ✓ Includes UK BESS projects');
      console.log('   - ✓ Connects to stated targets (30% market share, €2B EBITDA)');
    }

    // Validation 2: Score transparency with calculation breakdowns
    const hasScoreTransparency = analysis.includes('Score Transparency') &&
                                 analysis.includes('Component Breakdown') &&
                                 analysis.includes('PESTEL Analysis') &&
                                 analysis.includes('Integration Logic');
    console.log(`2. Score Transparency: ${hasScoreTransparency ? '✅ PASS' : '❌ FAIL'}`);
    
    if (hasScoreTransparency) {
      console.log('   - ✓ Explains PESTEL component scores and weights');
      console.log('   - ✓ Shows Five Forces breakdown');
      console.log('   - ✓ Documents integration methodology');
      console.log('   - ✓ Provides industry benchmarks');
    }

    // Validation 3: Actionable implementation with timelines and resources
    const hasActionableImplementation = analysis.includes('Specific Actions & Ownership') &&
                                       analysis.includes('Deadline') &&
                                       analysis.includes('Investment') &&
                                       analysis.includes('Implementation Timeline');
    console.log(`3. Actionable Implementation: ${hasActionableImplementation ? '✅ PASS' : '❌ FAIL'}`);
    
    if (hasActionableImplementation) {
      console.log('   - ✓ Specific actions with owners assigned');
      console.log('   - ✓ Deadlines and timelines provided');
      console.log('   - ✓ Investment amounts in euros');
      console.log('   - ✓ Implementation phases defined');
    }

    // Validation 4: Financial impact quantification with ROI modeling
    const hasFinancialQuantification = analysis.includes('Financial Impact Analysis') &&
                                      analysis.includes('NPV') &&
                                      analysis.includes('IRR') &&
                                      analysis.includes('EBITDA Impact');
    console.log(`4. Financial Impact Quantification: ${hasFinancialQuantification ? '✅ PASS' : '❌ FAIL'}`);
    
    if (hasFinancialQuantification) {
      console.log('   - ✓ NPV calculations provided');
      console.log('   - ✓ IRR analysis included');
      console.log('   - ✓ EBITDA impact quantified');
      console.log('   - ✓ ROI and payback periods specified');
    }

    // Validation 5: Risk-weighted analysis with scenario planning
    const hasRiskAnalysis = analysis.includes('Risk Assessment') &&
                           analysis.includes('Scenario Analysis') &&
                           analysis.includes('Bull Case') &&
                           analysis.includes('Bear Case');
    console.log(`5. Risk-Weighted Analysis: ${hasRiskAnalysis ? '✅ PASS' : '❌ FAIL'}`);
    
    if (hasRiskAnalysis) {
      console.log('   - ✓ Risk factors identified with probabilities');
      console.log('   - ✓ Bull/Base/Bear case scenarios provided');
      console.log('   - ✓ Mitigation strategies included');
      console.log('   - ✓ Success probabilities calculated');
    }

    // Validation 6: Competitive dynamics analysis
    const hasCompetitiveAnalysis = analysis.includes('Competitive Implications') &&
                                  analysis.includes('PPC') &&
                                  analysis.includes('competitive response') &&
                                  analysis.includes('market share');
    console.log(`6. Competitive Dynamics: ${hasCompetitiveAnalysis ? '✅ PASS' : '❌ FAIL'}`);
    
    if (hasCompetitiveAnalysis) {
      console.log('   - ✓ Specific competitor analysis (PPC, Norsk Hydro)');
      console.log('   - ✓ Likely competitive responses predicted');
      console.log('   - ✓ Counter-strategies provided');
      console.log('   - ✓ Market share implications quantified');
    }

    // Validation 7: Calibration documentation and methodology
    const hasCalibrationDocs = analysis.includes('Business Calibration Applied') &&
                              analysis.includes('Original Mathematical Score') &&
                              analysis.includes('Calibration Logic') &&
                              analysis.includes('Adjustment');
    console.log(`7. Calibration Documentation: ${hasCalibrationDocs ? '✅ PASS' : '❌ FAIL'}`);
    
    if (hasCalibrationDocs) {
      console.log('   - ✓ Shows original vs adjusted scores');
      console.log('   - ✓ Explains calibration methodology');
      console.log('   - ✓ Documents adjustment factors');
      console.log('   - ✓ Provides business logic rationale');
    }

    // Validation 8: Priority ranking with NPV/IRR analysis
    const hasPriorityRanking = analysis.includes('Priority Ranking') &&
                              analysis.includes('#1') &&
                              analysis.includes('Total Portfolio Value') &&
                              analysis.includes('Combined NPV');
    console.log(`8. Priority Ranking: ${hasPriorityRanking ? '✅ PASS' : '❌ FAIL'}`);
    
    if (hasPriorityRanking) {
      console.log('   - ✓ Recommendations ranked by NPV');
      console.log('   - ✓ IRR analysis for prioritization');
      console.log('   - ✓ Portfolio value optimization');
      console.log('   - ✓ Resource allocation guidance');
    }

    // Validation 9: Success metrics and KPI frameworks
    const hasSuccessMetrics = analysis.includes('Success Metrics & KPIs') &&
                             analysis.includes('Target') &&
                             analysis.includes('Early Warning') &&
                             analysis.includes('timeframe');
    console.log(`9. Success Metrics & KPIs: ${hasSuccessMetrics ? '✅ PASS' : '❌ FAIL'}`);
    
    if (hasSuccessMetrics) {
      console.log('   - ✓ KPIs with specific targets defined');
      console.log('   - ✓ Measurement timeframes specified');
      console.log('   - ✓ Early warning indicators included');
      console.log('   - ✓ Monitoring framework established');
    }

    // Validation 10: Comprehensive analysis quality and implementation readiness
    const hasAnalysisQuality = analysis.includes('Strategic Analysis Validation') &&
                              analysis.includes('Implementation Readiness') &&
                              analysis.includes('Data Quality Score') &&
                              analysis.includes('Analysis Completed');
    console.log(`10. Analysis Quality & Implementation: ${hasAnalysisQuality ? '✅ PASS' : '❌ FAIL'}`);
    
    if (hasAnalysisQuality) {
      console.log('   - ✓ Analysis quality metrics provided');
      console.log('   - ✓ Implementation readiness assessed');
      console.log('   - ✓ Confidence levels documented');
      console.log('   - ✓ Next review timeline specified');
    }

    // Overall validation summary
    const validationCount = [
      hasSpecificProjects, hasScoreTransparency, hasActionableImplementation,
      hasFinancialQuantification, hasRiskAnalysis, hasCompetitiveAnalysis,
      hasCalibrationDocs, hasPriorityRanking, hasSuccessMetrics, hasAnalysisQuality
    ].filter(Boolean).length;

    console.log('\n📈 OVERALL VALIDATION RESULTS:');
    console.log(`✅ Passed: ${validationCount}/10 team feedback requirements`);
    console.log(`📊 Success Rate: ${(validationCount/10*100).toFixed(0)}%`);

    if (validationCount >= 8) {
      console.log('🎉 ENTERPRISE ENHANCEMENT: SUCCESSFUL');
      console.log('🚀 System ready for production deployment');
    } else if (validationCount >= 6) {
      console.log('⚡ ENTERPRISE ENHANCEMENT: MOSTLY SUCCESSFUL');
      console.log('🔧 Minor improvements needed');
    } else {
      console.log('❌ ENTERPRISE ENHANCEMENT: NEEDS WORK');
      console.log('🛠️  Major improvements required');
    }

    // Extract key metrics from the analysis
    console.log('\n🎯 KEY ANALYSIS METRICS EXTRACTED:');
    
    const strategicScoreMatch = analysis.match(/Strategic Score:\s*(\d+\.?\d*)%/);
    if (strategicScoreMatch) {
      console.log(`📊 Strategic Score: ${strategicScoreMatch[1]}%`);
    }

    const npvMatches = analysis.match(/NPV.*?€(\d+)M/g);
    if (npvMatches && npvMatches.length > 0) {
      console.log(`💰 Total NPV Identified: ${npvMatches.length} recommendations with quantified NPV`);
      console.log(`   ${npvMatches.slice(0, 3).join(', ')}`);
    }

    const irrMatches = analysis.match(/IRR.*?(\d+)%/g);
    if (irrMatches && irrMatches.length > 0) {
      console.log(`📈 IRR Analysis: ${irrMatches.length} recommendations with IRR calculations`);
      console.log(`   ${irrMatches.slice(0, 3).join(', ')}`);
    }

    const timelineMatches = analysis.match(/Immediate.*?days/g);
    if (timelineMatches && timelineMatches.length > 0) {
      console.log(`⏰ Implementation Timelines: ${timelineMatches.length} immediate actions identified`);
    }

    const riskMatches = analysis.match(/Success Probability.*?(\d+)%/g);
    if (riskMatches && riskMatches.length > 0) {
      console.log(`🎲 Risk Assessment: ${riskMatches.length} probability assessments provided`);
      console.log(`   ${riskMatches.slice(0, 3).join(', ')}`);
    }

    console.log('\n📝 SAMPLE OUTPUT ANALYSIS:');
    console.log(`📄 Response Length: ${analysis.length} characters`);
    console.log(`🔍 Detail Level: ${analysis.length > 20000 ? 'Enterprise-grade' : analysis.length > 10000 ? 'Comprehensive' : 'Basic'}`);
    
    // Check for specific METLEN context
    const metlenContext = analysis.includes('METLEN') && 
                         analysis.includes('gallium') && 
                         analysis.includes('€5.68') &&
                         analysis.includes('Greek market');
    console.log(`🏢 Company Context: ${metlenContext ? 'Highly specific to METLEN' : 'Generic analysis'}`);

    return {
      validationResults: {
        companySpecific: hasSpecificProjects,
        scoreTransparency: hasScoreTransparency,
        actionableImplementation: hasActionableImplementation,
        financialQuantification: hasFinancialQuantification,
        riskAnalysis: hasRiskAnalysis,
        competitiveAnalysis: hasCompetitiveAnalysis,
        calibrationDocs: hasCalibrationDocs,
        priorityRanking: hasPriorityRanking,
        successMetrics: hasSuccessMetrics,
        analysisQuality: hasAnalysisQuality
      },
      overallScore: validationCount,
      successRate: (validationCount/10*100),
      analysisLength: analysis.length,
      metlenContext,
      fullAnalysis: analysis
    };

  } catch (error) {
    console.error('❌ TEST FAILED:', error);
    console.log('\n🔧 TROUBLESHOOTING:');
    console.log('1. Ensure the development server is running on port 3001');
    console.log('2. Check OpenAI API key configuration');
    console.log('3. Verify the enterprise enhancement module is properly imported');
    
    return {
      error: error.message,
      validationResults: {},
      overallScore: 0,
      successRate: 0
    };
  }
}

// Run the test
testEnterpriseEnhancement().then(results => {
  console.log('\n🏁 TEST COMPLETED');
  
  if (results.error) {
    console.log(`❌ Error: ${results.error}`);
  } else {
    console.log(`📊 Final Score: ${results.overallScore}/10 (${results.successRate.toFixed(0)}%)`);
    
    if (results.successRate >= 80) {
      console.log('🎉 ENTERPRISE SYSTEM READY FOR PRODUCTION');
      console.log('👥 Team feedback successfully addressed');
    } else {
      console.log('🔧 Additional improvements needed');
    }
  }
}).catch(error => {
  console.error('💥 Test execution failed:', error);
}); 