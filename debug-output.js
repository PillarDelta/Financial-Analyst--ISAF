/**
 * DEBUG SCRIPT - Capture and examine actual analysis output
 */

const METLEN_ENHANCED_DATASET = `
### COMPANY INFORMATION
- Name: METLEN Energy & Metals (formerly Mytilineos)
- Revenue: €5.68 billion (2023)
- Operating EBITDA: €1.08 billion (19% margin)
- Revenue Growth: 3.5% annually

### SPECIFIC PROJECTS AND INVESTMENTS
1. **Gallium Facility Investment**: €295.5M state-of-the-art gallium production facility in Greece
2. **PPC Strategic Partnership**: €2B joint venture for renewable energy development
3. **UK BESS Projects**: £1.2B battery energy storage systems portfolio

### COMPETITIVE LANDSCAPE
1. **PPC (Public Power Corporation)**: Market Share: 35% Greek electricity market
2. **Norsk Hydro**: Market Position: Global aluminum leader
`;

async function debugAnalysisOutput() {
  console.log('🔍 DEBUG: Capturing actual analysis output...\n');

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

    console.log('📄 FULL ANALYSIS OUTPUT:');
    console.log('=' * 80);
    console.log(analysis);
    console.log('=' * 80);

    console.log('\n🔍 SEARCHING FOR MISSING ELEMENTS:');
    
    // Check for company-specific content
    console.log('\n1. COMPANY-SPECIFIC CONTENT:');
    console.log(`Contains €295.5M: ${analysis.includes('€295.5M')}`);
    console.log(`Contains gallium facility: ${analysis.includes('gallium facility')}`);
    console.log(`Contains PPC partnership: ${analysis.includes('PPC partnership')}`);
    console.log(`Contains UK BESS: ${analysis.includes('UK BESS')}`);
    console.log(`Contains €2B: ${analysis.includes('€2B')}`);
    
    // Check for competitive content
    console.log('\n2. COMPETITIVE CONTENT:');
    console.log(`Contains PPC: ${analysis.includes('PPC')}`);
    console.log(`Contains competitive response: ${analysis.includes('competitive response')}`);
    console.log(`Contains Competitive Implications: ${analysis.includes('Competitive Implications')}`);
    console.log(`Contains market share: ${analysis.includes('market share')}`);
    console.log(`Contains Norsk Hydro: ${analysis.includes('Norsk Hydro')}`);
    
    // Check for KPI content
    console.log('\n3. SUCCESS METRICS CONTENT:');
    console.log(`Contains Success Metrics & KPIs: ${analysis.includes('Success Metrics & KPIs')}`);
    console.log(`Contains Target: ${analysis.includes('Target')}`);
    console.log(`Contains Early Warning: ${analysis.includes('Early Warning')}`);
    console.log(`Contains timeframe: ${analysis.includes('timeframe')}`);
    console.log(`Contains KPI: ${analysis.includes('KPI')}`);

    console.log('\n🔍 CONTENT ANALYSIS:');
    console.log(`Total length: ${analysis.length} characters`);
    console.log(`Contains Enterprise Strategic Analysis: ${analysis.includes('Enterprise Strategic Analysis')}`);
    console.log(`Contains Score Transparency: ${analysis.includes('Score Transparency')}`);
    console.log(`Contains Financial Impact Analysis: ${analysis.includes('Financial Impact Analysis')}`);

    // Look for sections
    const sections = [
      'Executive Summary',
      'Score Transparency',
      'Company-Specific Strategic Recommendations',
      'Financial Impact Summary',
      'Strategic Action Plan',
      'Strategic Analysis Validation'
    ];

    console.log('\n📋 SECTION ANALYSIS:');
    sections.forEach(section => {
      console.log(`${section}: ${analysis.includes(section) ? '✅' : '❌'}`);
    });

  } catch (error) {
    console.error('❌ DEBUG FAILED:', error);
  }
}

// Run debug
debugAnalysisOutput(); 