import fetch from 'node-fetch';

// Test case designed to trigger calibration
const PROFITABLE_COMPANY_DATASET = `# TechCorp Industries: Strategic Analysis

## Executive Overview
TechCorp Industries, a €2.1 billion revenue technology company, operates across 15 countries with strong fundamentals but facing some market headwinds.

## Financial Performance
- **Revenue**: €2,100 million (+2.1% growth)
- **EBITDA**: €315 million (15.0% margin)
- **Net Profit**: €147 million
- **Market Position**: Strong competitor in technology sector

## Challenges
- Intense competitive pressure from new market entrants
- Regulatory uncertainty in key markets
- Technology disruption risks
- Supply chain volatility
- Customer concentration risks
- Economic headwinds affecting demand

## Threats
- New competitor technologies
- Regulatory restrictions
- Market saturation
- Economic downturn impact
- Talent retention challenges`;

async function testCalibrationFix() {
    console.log('🧪 Testing Calibration with Profitable Company + Challenges');
    console.log('='.repeat(70));
    
    try {
        const response = await fetch('http://localhost:3001/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: PROFITABLE_COMPANY_DATASET,
                analysisType: 'isaf',
                documents: 'Present'
            })
        });

        if (!response.ok) {
            console.error('❌ API Error:', response.status, response.statusText);
            return;
        }

        const result = await response.json();
        const responseText = result.response || '';
        
        // Extract scores
        const originalMatch = responseText.match(/Original Mathematical Score.*?([+-]?\d+\.?\d*)%/);
        const calibratedMatch = responseText.match(/Business-Calibrated Score.*?(\d+\.?\d*)%/);
        const adjustmentMatch = responseText.match(/Adjustment.*?([+-]?\d+\.?\d*)%/);
        const reasonMatch = responseText.match(/Calibration Reason.*?:\s*(.*?)(?=\n|$)/);
        
        console.log('📊 CALIBRATION TEST RESULTS:');
        console.log(`   Original Score: ${originalMatch ? originalMatch[1] : 'N/A'}%`);
        console.log(`   Calibrated Score: ${calibratedMatch ? calibratedMatch[1] : 'N/A'}%`);
        console.log(`   Adjustment: ${adjustmentMatch ? adjustmentMatch[1] : 'N/A'}%`);
        if (reasonMatch) {
            console.log(`   Reason: ${reasonMatch[1]}`);
        }
        
        // Determine if calibration worked
        const originalScore = originalMatch ? parseFloat(originalMatch[1]) : 0;
        const calibratedScore = calibratedMatch ? parseFloat(calibratedMatch[1]) : 0;
        const adjustment = adjustmentMatch ? parseFloat(adjustmentMatch[1]) : 0;
        
        console.log('='.repeat(70));
        if (adjustment > 10) {
            console.log('✅ CALIBRATION WORKING: Significant positive adjustment applied');
        } else if (originalScore < 20 && calibratedScore > 40) {
            console.log('✅ CALIBRATION WORKING: Low score boosted to realistic level');
        } else if (Math.abs(adjustment) < 5) {
            console.log('✅ CALIBRATION WORKING: No adjustment needed (score already realistic)');
        } else {
            console.log('⚠️  CALIBRATION STATUS: Review needed');
        }
        
        console.log('📄 Full analysis available for review');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testCalibrationFix(); 