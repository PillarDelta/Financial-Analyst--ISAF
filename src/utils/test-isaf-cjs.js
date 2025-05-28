/**
 * Simple test script for ISAF-V2 changes (CommonJS version)
 */

// Import the module using require
const ISAF = require('./ISAF-V2');
const fs = require('fs');
const path = require('path');

console.log('Starting simple ISAF-V2 test...');

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

function runTest() {
  try {
    console.log('ISAF-V2 module loaded successfully.');
    console.log('Testing ISAF-V2 with sample input...');
    
    // Process the sample text with ISAF-V2
    const result = ISAF.processWithISAFV2(sampleInput);
    
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
    
    // Save the output to a file for review
    const testResultsDir = path.join(process.cwd(), 'test-results');
    if (!fs.existsSync(testResultsDir)) {
      fs.mkdirSync(testResultsDir);
    }
    
    fs.writeFileSync(
      path.join(testResultsDir, 'test-output.txt'),
      result
    );
    
    console.log('\nTest completed successfully. Full output saved to test-results/test-output.txt');
    return { success: true };
    
  } catch (error) {
    console.error('Test failed with error:', error);
    return { success: false, error };
  }
}

// Run the test
runTest(); 