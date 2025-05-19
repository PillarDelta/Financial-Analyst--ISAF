/**
 * Test script for the improved ISAF formatting
 */

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Test query
const TEST_QUERY = 'Provide a strategic analysis of Apple Inc. for 2024';

// Function to test the new formatting
async function testNewFormatting() {
  console.log('Testing new ISAF formatting...\n');
  
  try {
    // Call the API
    console.log(`Sending request: "${TEST_QUERY}"`);
    const response = await fetch('http://localhost:3002/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: TEST_QUERY,
        analysisType: 'isaf'
      })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    const result = await response.json();
    const content = result.content;
    
    // Save the output
    const outputDir = path.join(process.cwd(), 'test-results');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputFile = path.join(outputDir, 'new-format-test.txt');
    fs.writeFileSync(outputFile, content);
    
    console.log(`\nOutput saved to: ${outputFile}`);
    console.log('\nPreview of the formatted output:');
    
    // Show a preview of the output
    const lines = content.split('\n');
    const preview = lines.slice(0, 30).join('\n');
    console.log(preview + '\n...');
    
  } catch (error) {
    console.error('Error testing new format:', error);
  }
}

// Run the test function
testNewFormatting().catch(console.error); 