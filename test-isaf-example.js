/**
 * ISAF Analysis Test - Complete Example
 * 
 * This test demonstrates how ISAF analysis works using a realistic company example.
 * It shows all the different scores, metrics, and confidence levels explained in the user guide.
 */

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Test Configuration
const API_URL = 'http://localhost:3000/api/chat';
const OUTPUT_DIR = path.join(process.cwd(), 'test-results');

// Sample Company Data for Testing
const SAMPLE_COMPANY = {
  name: "TechFlow Solutions",
  description: `
TechFlow Solutions is a mid-sized software company specializing in AI-powered workflow automation tools for enterprise clients.

COMPANY OVERVIEW:
- Founded: 2018
- Revenue: $45 million (2023)
- Growth Rate: 28% annually
- Employees: 180
- Profit Margin: 15%
- R&D Spending: $8 million (18% of revenue)
- Market Share: 12% in workflow automation sector

MARKET POSITION:
- Primary markets: North America, Europe
- Main competitors: Microsoft Power Automate, Zapier, UiPath
- Target customers: Mid-market enterprises (500-5000 employees)
- Key differentiator: AI-powered predictive workflow optimization

CURRENT CHALLENGES:
- Increasing competition from tech giants
- Rising customer acquisition costs
- Need to expand internationally
- Talent retention in competitive market
- Pressure to develop mobile-first solutions

STRENGTHS:
- Strong technical team with AI expertise
- High customer satisfaction (NPS: 67)
- Proprietary AI algorithms
- Strong recurring revenue model (85% subscription)
- Low customer churn (8% annually)

RECENT DEVELOPMENTS:
- Raised $15M Series B funding
- Launched new mobile app (50% adoption rate)
- Signed partnership with Salesforce
- Opened European office in London
- Patent pending on core AI technology

MARKET CONDITIONS:
- Workflow automation market growing 15% annually
- Increased demand post-COVID for remote work tools
- Regulatory focus on data privacy (GDPR, CCPA)
- Economic uncertainty affecting enterprise spending
- Shortage of AI/ML talent in the market
  `
};

// Function to run ISAF analysis
async function runISAFAnalysis(companyData) {
  console.log(`\n🚀 Starting ISAF Analysis for ${companyData.name}...\n`);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: companyData.description,
        analysisType: 'isaf'
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('❌ ISAF Analysis failed:', error.message);
    return null;
  }
}

// Function to analyze and explain the results
function analyzeResults(analysisResult) {
  console.log('\n📊 ANALYZING RESULTS...\n');
  
  // Extract key metrics from the result
  const metrics = {
    strategicFitScore: extractMetric(analysisResult, /strategic fit score.*?(\d+\.?\d*)%/i),
    confidence: extractConfidence(analysisResult),
    dataQuality: extractMetric(analysisResult, /(\d+)% of framework elements/i),
    pestelCompleteness: extractMetric(analysisResult, /PESTEL \((\d+)%\)/i),
    fiveForcesCompleteness: extractMetric(analysisResult, /Five Forces \((\d+)%\)/i),
    swotCompleteness: extractMetric(analysisResult, /SWOT \((\d+)%\)/i),
    extractedDataPoints: extractMetric(analysisResult, /(\d+) extracted data points/i),
    recommendationCount: (analysisResult.match(/\d+\./g) || []).length
  };

  console.log('🎯 KEY METRICS EXTRACTED:');
  console.log(`   Strategic Fit Score: ${metrics.strategicFitScore}%`);
  console.log(`   Confidence Level: ${metrics.confidence}`);
  console.log(`   Data Quality: ${metrics.dataQuality}%`);
  console.log(`   PESTEL Completeness: ${metrics.pestelCompleteness}%`);
  console.log(`   Five Forces Completeness: ${metrics.fiveForcesCompleteness}%`);
  console.log(`   SWOT Completeness: ${metrics.swotCompleteness}%`);
  console.log(`   Extracted Data Points: ${metrics.extractedDataPoints}`);
  console.log(`   Strategic Recommendations: ${metrics.recommendationCount}`);

  return metrics;
}

// Helper function to extract numeric metrics
function extractMetric(text, regex) {
  const match = text.match(regex);
  return match ? parseFloat(match[1]) : 'Not found';
}

// Helper function to extract confidence level
function extractConfidence(text) {
  if (text.includes('high-confidence')) return 'High (★★★)';
  if (text.includes('medium-confidence')) return 'Medium (★★☆)';
  if (text.includes('indicative')) return 'Indicative (★☆☆)';
  return 'Not specified';
}

// Function to explain what the metrics mean
function explainMetrics(metrics) {
  console.log('\n📋 METRIC EXPLANATIONS:\n');
  
  // Strategic Fit Score interpretation
  const fitScore = metrics.strategicFitScore;
  if (fitScore !== 'Not found') {
    let interpretation = '';
    if (fitScore >= 80) interpretation = 'EXCELLENT - Outstanding strategic alignment';
    else if (fitScore >= 60) interpretation = 'GOOD - Solid position with some improvements needed';
    else if (fitScore >= 40) interpretation = 'MODERATE - Strategic challenges require attention';
    else interpretation = 'POOR - Critical issues need immediate action';
    
    console.log(`Strategic Fit Score (${fitScore}%): ${interpretation}`);
  }

  // Data Quality interpretation
  const dataQuality = metrics.dataQuality;
  if (dataQuality !== 'Not found') {
    let quality = '';
    if (dataQuality >= 80) quality = 'High-quality analysis with comprehensive data';
    else if (dataQuality >= 60) quality = 'Good analysis quality with most data captured';
    else if (dataQuality >= 40) quality = 'Moderate quality, some data gaps present';
    else quality = 'Limited quality, significant data gaps';
    
    console.log(`Data Quality (${dataQuality}%): ${quality}`);
  }

  // Framework completeness interpretation
  console.log('\nFramework Completeness Analysis:');
  ['pestelCompleteness', 'fiveForcesCompleteness', 'swotCompleteness'].forEach(framework => {
    const value = metrics[framework];
    const name = framework.replace('Completeness', '').toUpperCase();
    
    if (value !== 'Not found') {
      let status = '';
      if (value >= 90) status = 'Comprehensive';
      else if (value >= 70) status = 'Good coverage';
      else if (value >= 50) status = 'Moderate coverage';
      else status = 'Limited coverage';
      
      console.log(`  ${name}: ${value}% - ${status}`);
    }
  });

  // Extracted data points interpretation
  const dataPoints = metrics.extractedDataPoints;
  if (dataPoints !== 'Not found') {
    let analysis = '';
    if (dataPoints >= 30) analysis = 'Rich analysis with high confidence';
    else if (dataPoints >= 15) analysis = 'Good analysis quality';
    else if (dataPoints >= 5) analysis = 'Basic analysis, consider more details';
    else analysis = 'Limited analysis, more information needed';
    
    console.log(`\nExtracted Data Points (${dataPoints}): ${analysis}`);
  }
}

// Function to provide actionable insights
function provideActionableInsights(analysisResult, metrics) {
  console.log('\n🎯 ACTIONABLE INSIGHTS:\n');
  
  // Extract recommendations and their confidence levels
  const recommendations = extractRecommendations(analysisResult);
  
  console.log('Priority Actions Based on Analysis:');
  
  if (recommendations.length > 0) {
    recommendations.forEach((rec, index) => {
      console.log(`\n${index + 1}. ${rec.title}`);
      console.log(`   Confidence: ${rec.confidence}`);
      console.log(`   Priority: ${rec.priority}`);
      console.log(`   Action: ${rec.action}`);
    });
  } else {
    console.log('   Review the detailed analysis for specific recommendations');
  }

  // General insights based on metrics
  console.log('\nGeneral Strategic Guidance:');
  
  if (metrics.strategicFitScore !== 'Not found' && metrics.strategicFitScore < 60) {
    console.log('   ⚠️  Strategic realignment needed - focus on addressing key misalignments');
  }
  
  if (metrics.dataQuality !== 'Not found' && metrics.dataQuality < 70) {
    console.log('   📊 Consider providing more detailed company information for higher confidence results');
  }
  
  if (metrics.confidence.includes('★★★')) {
    console.log('   ✅ High confidence results - recommendations can be implemented with confidence');
  } else if (metrics.confidence.includes('★★☆')) {
    console.log('   ⚡ Medium confidence - validate recommendations before major decisions');
  } else {
    console.log('   🔍 Low confidence - treat as directional insights, gather more data');
  }
}

// Helper function to extract recommendations from analysis
function extractRecommendations(text) {
  const recommendations = [];
  const lines = text.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.match(/^\d+\./)) {
      const titleMatch = line.match(/^\d+\.\s*(.+?)\s*\[/);
      const confidenceMatch = line.match(/\[([★☆]+)\s*(\d+)%\]/);
      
      if (titleMatch && confidenceMatch) {
        const title = titleMatch[1];
        const stars = confidenceMatch[1];
        const percentage = confidenceMatch[2];
        
        let priority = 'Low';
        let action = 'Monitor and consider';
        
        if (percentage >= 70) {
          priority = 'High';
          action = 'Implement with confidence';
        } else if (percentage >= 50) {
          priority = 'Medium';
          action = 'Validate and implement';
        }
        
        recommendations.push({
          title,
          confidence: `${stars} ${percentage}%`,
          priority,
          action
        });
      }
    }
  }
  
  return recommendations;
}

// Function to save results
function saveResults(companyName, analysisResult, metrics) {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `isaf-test-${companyName.replace(/\s+/g, '-').toLowerCase()}-${timestamp}.txt`;
  const filePath = path.join(OUTPUT_DIR, fileName);

  const output = `
ISAF ANALYSIS TEST RESULTS
==========================
Company: ${companyName}
Test Date: ${new Date().toLocaleString()}

EXTRACTED METRICS:
${JSON.stringify(metrics, null, 2)}

FULL ANALYSIS:
${analysisResult}

TEST INTERPRETATION:
This test demonstrates how ISAF analysis works with real company data.
The metrics extracted show the various scores and confidence levels
that users will see in their analysis results.
`;

  fs.writeFileSync(filePath, output);
  console.log(`\n💾 Results saved to: ${fileName}`);
  return filePath;
}

// Main test function
async function runCompleteTest() {
  console.log('🧪 ISAF ANALYSIS SYSTEM TEST');
  console.log('=============================');
  console.log('This test demonstrates how ISAF analysis works using a sample company.');
  console.log('It shows all the metrics and scores explained in the user guide.\n');

  // Step 1: Run the analysis
  const analysisResult = await runISAFAnalysis(SAMPLE_COMPANY);
  
  if (!analysisResult) {
    console.log('❌ Test failed - Could not get analysis results');
    console.log('Make sure the server is running on http://localhost:3000');
    return;
  }

  console.log('✅ ISAF Analysis completed successfully!\n');

  // Step 2: Extract and analyze metrics
  const metrics = analyzeResults(analysisResult);

  // Step 3: Explain what the metrics mean
  explainMetrics(metrics);

  // Step 4: Provide actionable insights
  provideActionableInsights(analysisResult, metrics);

  // Step 5: Save results
  const savedFile = saveResults(SAMPLE_COMPANY.name, analysisResult, metrics);

  // Summary
  console.log('\n🎉 TEST COMPLETED SUCCESSFULLY!');
  console.log('\nThis test shows how users can interpret their ISAF analysis results:');
  console.log('1. Strategic Fit Score indicates overall strategic health');
  console.log('2. Confidence levels show how reliable the analysis is');
  console.log('3. Framework completeness shows data quality');
  console.log('4. Recommendations include confidence ratings and priorities');
  console.log('\nRefer to ISAF_RESULTS_EXPLANATION.md for detailed interpretation guide.');
}

// Export for use as module or run directly
if (require.main === module) {
  runCompleteTest().catch(console.error);
}

module.exports = {
  runCompleteTest,
  runISAFAnalysis,
  analyzeResults,
  explainMetrics,
  SAMPLE_COMPANY
}; 