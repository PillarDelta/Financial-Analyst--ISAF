/**
 * Simple test script for ISAF-V2 changes
 */

// Import the processWithISAFV2 function dynamically to avoid module issues
const testISAF = async () => {
  try {
    // Import the module directly
    const isafModule = require('./ISAF-V2');
    
    console.log('ISAF-V2 module loaded successfully.');
    
    // Simple sample input for testing
    const sampleInput = `
ENVIRONMENTAL ANALYSIS (PESTEL)

Political Factors:
• Stable regulatory environment in major markets
• Increasing trade tensions between key economies

Economic Factors:
• Post-pandemic recovery with moderate growth (3-4%)
• Inflation concerns in key markets (5.2%)

COMPETITIVE ASSESSMENT (Porter's Five Forces)

Competitive Rivalry:
The industry features moderate competition with 4-5 major players.

Supplier Power:
Supplier concentration is relatively low, with multiple options available.

ORGANIZATIONAL CAPABILITY (SWOT)

Strengths:
• Strong brand recognition in key markets
• Robust technological capabilities

Weaknesses:
• Product portfolio lacks diversity in emerging segments
• Higher cost structure compared to regional competitors
`;

    console.log('Testing ISAF-V2 with sample input...');
    
    // Process the sample text with ISAF-V2
    const result = isafModule.processWithISAFV2(sampleInput);
    
    console.log('ISAF-V2 processing completed successfully.');
    console.log('\n--- Output Preview (first 500 chars) ---');
    console.log(result.substring(0, 500));
    console.log('--- End of Preview ---\n');
    
    // Check for key sections in the output
    const hasStrategicScore = result.includes('strategic fit score');
    const hasRecommendations = result.includes('Strategic Recommendations');
    const hasDataQuality = result.includes('Data Quality Assessment');
    
    console.log('Output check results:');
    console.log(`- Contains strategic fit score: ${hasStrategicScore ? 'Yes' : 'No'}`);
    console.log(`- Contains recommendations: ${hasRecommendations ? 'Yes' : 'No'}`);
    console.log(`- Contains data quality section: ${hasDataQuality ? 'Yes' : 'No'}`);
    
    console.log('\nTest completed successfully.');
    return { success: true, output: result };
    
  } catch (error) {
    console.error('Test failed with error:', error);
    return { success: false, error };
  }
};

// Run the test function if this script is executed directly
if (require.main === module) {
  testISAF();
}

export { testISAF }; 