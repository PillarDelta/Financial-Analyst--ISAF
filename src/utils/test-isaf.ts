/**
 * Test script for ISAF-V2 processing with GPT output
 * 
 * This script simulates the integration between GPT and ISAF
 * by testing both components with sample inputs to ensure
 * they work together correctly.
 */

// Use a relative path with .js extension for CommonJS compatibility
import { processWithISAFV2 } from './ISAF-V2.js';
import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';

// Sample inputs for testing
const sampleInputs = [
  {
    name: "Company A - Technology",
    prompt: "Analyze the competitive position of a mid-sized software company specializing in AI solutions for healthcare",
    expectedSections: ["PESTEL", "Five Forces", "SWOT"]
  },
  {
    name: "Financial Statement",
    prompt: "Analyze this financial data for strategic insights: Revenue: $25M, Growth: 15%, Profit margin: 12%, R&D spend: 18% of revenue",
    expectedSections: ["Financial", "Growth"]
  }
];

// Function to test the ISAF-V2 module with direct input
function testDirectISAF() {
  console.log("\n📊 Testing ISAF-V2 with direct sample input...");
  
  // Use sample analysis from the module for direct testing
  const result = processWithISAFV2(sampleAnalysis);
  
  console.log(`✅ Direct ISAF test completed`);
  console.log(`📋 Output length: ${result.length} characters`);
  
  // Check for key sections
  const hasStrategicScore = result.includes("strategic fit score");
  const hasRecommendations = result.includes("Strategic Recommendations");
  const hasMethodology = result.includes("Methodology");
  
  console.log(`📌 Contains strategic score: ${hasStrategicScore ? 'Yes' : 'No'}`);
  console.log(`📌 Contains recommendations: ${hasRecommendations ? 'Yes' : 'No'}`);
  console.log(`📌 Contains methodology: ${hasMethodology ? 'Yes' : 'No'}`);
  
  // Save output to file for review
  fs.writeFileSync(
    path.join(process.cwd(), 'test-results', 'direct-isaf-output.txt'),
    result
  );
}

// Function to test end-to-end GPT-to-ISAF flow
async function testGPTtoISAF(openai: OpenAI) {
  console.log("\n🔄 Testing GPT to ISAF flow...");
  
  for (const testCase of sampleInputs) {
    console.log(`\n⏳ Processing test case: ${testCase.name}...`);
    
    try {
      // 1. Simulate GPT API call with proper system prompt
      const systemPrompt = `You are a strategic business analyst. Analyze the following business scenario and structure your response with these sections:
      
ENVIRONMENTAL ANALYSIS (PESTEL)
- Include Political, Economic, Social, Technological, Environmental, and Legal factors
- Use bullet points for each factor

COMPETITIVE ASSESSMENT (Porter's Five Forces)
- Competitive Rivalry
- Supplier Power
- Buyer Power
- Threat of New Entrants
- Threat of Substitutes

ORGANIZATIONAL CAPABILITY (SWOT)
- Strengths
- Weaknesses
- Opportunities 
- Threats

Use factual, specific observations rather than generic statements.`;
      
      const gptResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: testCase.prompt }
        ],
        temperature: 0.7
      });
      
      const gptOutput = gptResponse.choices[0].message.content || "";
      console.log(`✅ GPT output received: ${gptOutput.length} characters`);
      
      // 2. Pass GPT output to ISAF
      const isafResult = processWithISAFV2(gptOutput);
      console.log(`✅ ISAF processing complete: ${isafResult.length} characters`);
      
      // 3. Check for expected sections
      let sectionsFound = 0;
      for (const section of testCase.expectedSections) {
        if (isafResult.includes(section)) {
          sectionsFound++;
        }
      }
      
      console.log(`📌 Found ${sectionsFound}/${testCase.expectedSections.length} expected sections`);
      
      // Save both outputs to files for review
      const testCaseFileName = testCase.name.toLowerCase().replace(/\s+/g, '-');
      
      fs.writeFileSync(
        path.join(process.cwd(), 'test-results', `${testCaseFileName}-gpt-output.txt`),
        gptOutput
      );
      
      fs.writeFileSync(
        path.join(process.cwd(), 'test-results', `${testCaseFileName}-isaf-output.txt`),
        isafResult
      );
      
    } catch (error) {
      console.error(`❌ Error processing test case ${testCase.name}:`, error);
    }
  }
}

// Main test function
async function runTests() {
  console.log("🧪 Starting ISAF-GPT integration tests...");
  
  // Create test results directory if it doesn't exist
  const testResultsDir = path.join(process.cwd(), 'test-results');
  if (!fs.existsSync(testResultsDir)) {
    fs.mkdirSync(testResultsDir);
  }
  
  // Test ISAF directly
  testDirectISAF();
  
  // Test GPT to ISAF flow if API key is available
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    const openai = new OpenAI({ apiKey });
    await testGPTtoISAF(openai);
  } else {
    console.log("⚠️ OpenAI API key not found. Skipping GPT to ISAF tests.");
  }
  
  console.log("\n✅ All tests completed!");
}

// Run the tests
if (require.main === module) {
  runTests().catch(console.error);
}

// Sample analysis for direct testing
const sampleAnalysis = `
ENVIRONMENTAL ANALYSIS (PESTEL)

Political Factors:
• Stable regulatory environment in major markets
• Increasing trade tensions between key economies
• Growing political support for sustainability initiatives

Economic Factors:
• Post-pandemic recovery with moderate growth (3-4%)
• Inflation concerns in key markets (5.2%)
• Rising interest rates affecting capital investments

Social Factors:
• Changing consumer preferences toward digital experiences
• Growing focus on work-life balance affecting workforce dynamics
• Increased health consciousness driving product choices

Technological Factors:
• Rapid AI and machine learning adoption across industries
• Digital transformation accelerating in all sectors
• Growing cybersecurity concerns with increasing threats

Environmental Factors:
• Carbon reduction initiatives gaining momentum
• Circular economy practices becoming mainstream
• Resource scarcity driving innovation in materials

Legal Factors:
• Data privacy regulations expanding globally
• Antitrust scrutiny increasing for large tech companies
• Stricter environmental compliance requirements

COMPETITIVE ASSESSMENT (Porter's Five Forces)

Competitive Rivalry:
The industry features moderate competition with 4-5 major players controlling 65% of market share. Price competition is moderate, with differentiation being the primary competitive strategy.

Supplier Power:
Supplier concentration is relatively low, with multiple options available for key inputs. Switching costs are moderate, giving suppliers limited leverage over pricing and terms.

Buyer Power:
Customers have moderate bargaining power due to availability of alternatives. Brand loyalty remains a significant factor reducing buyer power in premium segments.

Threat of New Entrants:
Entry barriers are moderately high due to capital requirements and established brand relationships. Technology expertise represents a significant barrier to entry.

Threat of Substitutes:
Few direct substitutes exist, though adjacent technologies could potentially address similar needs in the future.

ORGANIZATIONAL CAPABILITY (SWOT)

Strengths:
• Strong brand recognition in key markets
• Robust technological capabilities and IP portfolio
• Efficient global supply chain with redundancy
• Strong financial position with $1.2B in cash reserves

Weaknesses:
• Product portfolio lacks diversity in emerging segments
• Higher cost structure compared to regional competitors
• Slow decision-making processes hampering agility
• Cultural resistance to change affecting innovation speed

Opportunities:
• Emerging markets expansion, particularly in Southeast Asia
• Strategic partnerships with complementary technology providers
• New product development in sustainable materials
• Digital transformation of customer experience

Threats:
• Increasing competition from new market entrants
• Volatile raw material prices affecting margins
• Regulatory changes in key markets
• Disruptive technologies potentially obsoleting current offerings
`;

export { runTests, testDirectISAF, testGPTtoISAF, sampleAnalysis }; 