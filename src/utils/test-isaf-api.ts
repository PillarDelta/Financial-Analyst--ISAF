/**
 * ISAF API Test Script
 * 
 * This script tests the ISAF functionality directly through the API endpoint
 * to verify the integration between GPT and ISAF is working correctly.
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

// Configuration
const API_URL = 'http://localhost:3000/api/chat';
const OUTPUT_DIR = path.join(process.cwd(), 'test-results');

// Test cases
const TEST_CASES = [
  {
    name: 'Basic ISAF Analysis',
    content: 'Analyze the competitive position of Apple Inc in the smartphone market',
    analysisType: 'isaf'
  },
  {
    name: 'Complex ISAF Analysis',
    content: `Conduct a strategic analysis for Tesla, Inc.
- Founded in 2003, Tesla is an American electric vehicle and clean energy company
- Current revenue: $24.32 billion (2023)
- Main products: Electric vehicles, battery energy storage, solar panels
- Main competitors: Traditional auto manufacturers (GM, Ford, Toyota), new EV startups
- Key markets: US, China, Europe
- Recently expanding into energy generation and storage solutions`,
    analysisType: 'isaf'
  }
];

// Function to test the API
async function testIsafApi() {
  console.log('Starting ISAF API test...');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Run each test case
  for (const testCase of TEST_CASES) {
    console.log(`\nTesting: ${testCase.name}`);
    
    try {
      // Call the API
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: testCase.content,
          analysisType: testCase.analysisType,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      
      const data = await response.json() as { content: string };
      const content = data.content;
      
      // Display info about the response
      console.log(`✅ Response received (${content.length} characters)`);
      
      // Check for ISAF indicators
      const hasStrategicFit = content.includes('strategic fit score');
      const hasRecommendations = content.includes('Strategic Recommendations');
      const hasDataQuality = content.includes('Data Quality Assessment');
      const hasMethodology = content.includes('Methodology');
      
      console.log('Analysis results check:');
      console.log(`- Strategic fit score: ${hasStrategicFit ? 'FOUND' : 'MISSING'}`);
      console.log(`- Recommendations: ${hasRecommendations ? 'FOUND' : 'MISSING'}`);
      console.log(`- Data quality info: ${hasDataQuality ? 'FOUND' : 'MISSING'}`);
      console.log(`- Methodology: ${hasMethodology ? 'FOUND' : 'MISSING'}`);
      
      // Check for confidence indicators
      const confidenceMatch = content.match(/(high|medium|low)-confidence/i);
      if (confidenceMatch) {
        console.log(`- Confidence level: ${confidenceMatch[0]}`);
      } else {
        console.log('- Confidence level: NOT FOUND');
      }
      
      // Extract framework completeness if available
      const completenessMatch = content.match(/Framework completeness: PESTEL \((\d+)%\), Five Forces \((\d+)%\), SWOT \((\d+)%\)/);
      if (completenessMatch) {
        console.log(`- Framework completeness: PESTEL (${completenessMatch[1]}%), Five Forces (${completenessMatch[2]}%), SWOT (${completenessMatch[3]}%)`);
      }
      
      // Save output
      const outputPath = path.join(OUTPUT_DIR, `isaf-api-test-${testCase.name.toLowerCase().replace(/\s+/g, '-')}.txt`);
      fs.writeFileSync(outputPath, content);
      console.log(`Output saved to: ${outputPath}`);
      
    } catch (error) {
      console.error(`❌ Error testing ${testCase.name}:`, error);
    }
  }
  
  console.log('\nISAF API testing complete');
}

// Run the test if executed directly
if (require.main === module) {
  testIsafApi().catch(console.error);
}

export { testIsafApi }; 