/**
 * Test script for context preservation in ISAF-V2 processing
 */

// CommonJS version to avoid module system issues
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Test cases with company-specific queries
const TEST_CASES = [
  {
    name: 'Apple Analysis',
    query: 'Analyze the strategic position of Apple Inc. in the global smartphone market',
    analysisType: 'isaf'
  },
  {
    name: 'Tesla Analysis',
    query: 'Provide a strategic analysis of Tesla and its electric vehicle business',
    analysisType: 'isaf'
  }
];

// Function to test context preservation
async function testContextPreservation() {
  console.log('Testing ISAF context preservation improvements...\n');
  
  // Create output directory
  const outputDir = path.join(process.cwd(), 'test-results');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Process each test case
  for (const testCase of TEST_CASES) {
    console.log(`Testing: ${testCase.name}`);
    
    try {
      // Call the API
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: testCase.query,
          analysisType: testCase.analysisType
        })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      
      const result = await response.json();
      const content = result.content;
      
      // Save the output
      const outputFile = path.join(outputDir, `context-test-${testCase.name.toLowerCase().replace(/\s+/g, '-')}.txt`);
      fs.writeFileSync(outputFile, content);
      
      console.log(`Results saved to: ${outputFile}`);
      
      // Check for context section
      const hasContextSection = content.includes('Context Analysis:');
      console.log(`Contains Context Analysis section: ${hasContextSection ? 'YES' : 'NO'}`);
      
      // Extract and display the context section
      if (hasContextSection) {
        const contextMatch = content.match(/Context Analysis:\s*([\s\S]*?)(?=\n\s*Key Findings|\n\s*Strategic Recommendations|$)/);
        if (contextMatch && contextMatch[1]) {
          console.log('\nContext Preview:');
          console.log(contextMatch[1].trim().substring(0, 200) + '...');
        }
      }
      
      console.log('\n-----------------------------------\n');
      
    } catch (error) {
      console.error(`Error processing ${testCase.name}:`, error);
    }
  }
  
  console.log('Context preservation testing completed.');
}

// Run the test if executed directly
if (require.main === module) {
  testContextPreservation().catch(console.error);
}

module.exports = { testContextPreservation }; 