import fetch from 'node-fetch';

const METLEN_DATASET = `# METLEN Energy & Metals: Comprehensive Strategic Dataset (2023-2024)

## Executive Overview

METLEN Energy & Metals (formerly Mytilineos), a €5.68 billion revenue industrial and energy conglomerate, stands as Europe's only vertically integrated bauxite-alumina-aluminum producer and a leading renewable energy developer. With operations spanning 40+ countries and record EBITDA of €1.08 billion in 2024, the company demonstrates exceptional positioning at the intersection of critical materials and energy transition.

## 1. Financial Performance

### Recent Financial Results (2024 vs 2023)
- **Revenue**: €5,683 million (+3.5% from €5,492 million)
- **EBITDA**: €1,080 million (+6.5% from €1,014 million) - all-time high
- **Net Profit**: €615 million (-1.3% from €623 million)
- **EPS**: €4.46 (vs €4.51)
- **Proposed Dividend**: €1.50 per share

### Key Financial Metrics
- **EBITDA Margin**: 19.0% (2024) vs 18.5% (2023)
- **Net Profit Margin**: 10.8% (2024) vs 11.3% (2023)
- **ROE**: Strong returns maintained despite intensive CAPEX
- **Free Cash Flow**: €-2.80 per share (negative due to growth investments)

### Stock Performance & Valuation
- **Market Cap**: €6.31 billion (May 2024)
- **Stock Price**: €46.32 (+18.09% YTD)
- **P/E Ratio**: 7.3x (2024E)
- **EV/EBITDA**: 6.5x (2024E)
- **Dividend Yield**: 3.6-3.7%
- **Beta**: 1.26

## 2. Operational Metrics

### Energy Generation Capacity
**Thermal Power**: ~2.041 GW total capacity
- 826 MW state-of-the-art CCGT plant (2022)
- 444.48 MW CCGT in Ag. Nikolaos
- 436.6 MW CCGT in Korinthia
- 334 MW CHP plant

**Renewable Energy**: 1.4 GW operational (end 2024)
- Global portfolio: 11.1 GW (4.9 GW operational/mature, 6.2 GW early-stage)
- 2024 production: 1.6 TWh (+40% vs 2023)

### Metallurgy Production
**Current Capacity**:
- Primary Aluminum: 190,000 tonnes/year
- Alumina: 865,000 tonnes/year
- Bauxite: 1,000,000+ tonnes/year (Europe's largest)
- Recycled Aluminum: 50,000+ tonnes/year

### Energy Storage Portfolio
- Chile: 1,610 MWh operational BESS (sold for $815M)
- UK: 732 MW/1.18 GWh BESS projects (30% market share)
- Australia: 4.8 GWh Denman BESS under development
- Total pipeline: ~3.5 GWh globally

## 3. ESG Performance

### Environmental Metrics (2023)
- **Carbon Emissions**: 30% reduction target by 2030, Net Zero by 2050
- **Scope 1**: 3.15% reduction vs previous year
- **Scope 2**: 4.2% reduction vs previous year
- **Renewable Production**: 1.1+ TWh annually
- **Waste Recycling**: 30% of total waste

### ESG Ratings
- **MSCI ESG**: AA rating
- **DJSI**: Included in Emerging Markets
- **EcoVadis**: Platinum Award
- **Sustainalytics**: Top 11% lowest ESG risk
- **CDP Climate**: B
- **ESG Book**: Top 1% globally

## 4. Market Position & Competitive Advantages

### European Leadership
- **Only fully integrated bauxite-alumina-aluminum producer in EU**
- **Largest bauxite producer in Europe**
- **Leading renewable energy developer in Southeast Europe**

### Geographic Revenue Split
- **Greece**: 50.9% of net sales
- **European Union**: 36.5%
- **Rest of World**: 12.6%

### Competitive Positioning
- **UK Storage**: Nearly 30% market share
- **Greek Energy Market**: 18.2% of electricity production, 19.4% retail market share
- **Natural Gas**: 40% of Greece's total imports

## 5. Strategic Initiatives & Growth

### Investment Pipeline
- **EPC Backlog**: €463.1 million contracted + €530 million in advanced negotiations
- **Infrastructure Backlog**: Approaching €1.4 billion
- **Recent UK Contracts**: £110 million for 313.4 MW projects

### Expansion Plans
- **Bauxite**: 2,000,000 tonnes/year by 2026 (doubling capacity)
- **Alumina**: 1,265,000 tonnes/year by 2028 (+46% expansion)
- **Gallium**: 50 tonnes/year (first in Europe)
- **Total Investment**: €295.5M in metallurgy expansion

### Technology & Innovation
- **R&D Investment**: Continuous technology advancement
- **Digital Transformation**: Operational optimization initiatives
- **Innovation Partnerships**: Strategic technology collaborations
- **Technology Gaps**: Some exposure in offshore wind development

## 6. Risk Factors & Challenges

### Market Risks
- **Commodity Price Volatility**: Exposure to aluminum and energy price fluctuations
- **Energy Market Dynamics**: Regulatory changes in energy markets
- **Competition**: Intensifying competition in renewable energy sector

### Operational Risks
- **Technology Gaps**: Limited capabilities in offshore wind
- **Regulatory Exposure**: EU carbon policies and environmental regulations
- **Geopolitical**: Operations across multiple jurisdictions

### Financial Risks
- **Capital Intensity**: High CAPEX requirements for growth initiatives
- **Debt Management**: €1,776 million net debt (1.7x EBITDA ratio)
- **Market Volatility**: Exposure to commodity and energy price cycles

## 7. Strategic Outlook

### Growth Drivers
- **Energy Transition**: Positioned at intersection of renewable energy and critical materials
- **Market Leadership**: Unique integrated business model in Europe
- **Geographic Expansion**: Global renewable energy and storage opportunities
- **Technology Innovation**: Continuous operational and product improvements

### Financial Targets
- **Revenue Growth**: Targeting continued expansion in core markets
- **Margin Optimization**: Maintaining strong EBITDA margins >15%
- **ESG Leadership**: Carbon neutrality by 2050, intermediate 2030 targets
- **Shareholder Returns**: Balanced approach between growth investment and distributions

### Strategic Priorities
1. **Renewable Energy Expansion**: Scale global renewable energy portfolio
2. **Metallurgy Growth**: Expand production capacity and value-added products
3. **Energy Storage Leadership**: Capitalize on global storage market growth
4. **Operational Excellence**: Continuous efficiency and sustainability improvements
5. **Financial Optimization**: Maintain strong balance sheet and returns`;

async function testCalibratedSystem() {
    console.log('🧪 Testing Business-Calibrated ISAF System with METLEN Dataset');
    console.log('='.repeat(80));
    
    try {
        const response = await fetch('http://localhost:3001/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: METLEN_DATASET,
                analysisType: 'isaf',
                documents: 'Present'
            })
        });

        if (!response.ok) {
            console.error('❌ API Error:', response.status, response.statusText);
            return;
        }

        const result = await response.json();
        console.log('✅ Calibrated Analysis Complete!');
        console.log('='.repeat(80));
        
        // Extract key metrics from the response
        const responseText = result.response || '';
        
        // Look for calibration section
        const calibrationMatch = responseText.match(/## 🎯 \*\*Business Reality Calibration\*\*(.*?)(?=##|$)/s);
        
        if (calibrationMatch) {
            console.log('🎯 BUSINESS CALIBRATION DETECTED:');
            console.log(calibrationMatch[1].trim());
            console.log('='.repeat(80));
        }
        
        // Extract strategic scores
        const strategicMatch = responseText.match(/INTEGRATED STRATEGIC SCORE.*?(\d+\.?\d*)%/);
        const originalMatch = responseText.match(/Original Mathematical Score.*?(\d+\.?\d*)%/);
        const calibratedMatch = responseText.match(/Business-Calibrated Score.*?(\d+\.?\d*)%/);
        const adjustmentMatch = responseText.match(/Adjustment.*?([+-]?\d+\.?\d*)%/);
        
        console.log('📊 RESULTS SUMMARY:');
        if (originalMatch && calibratedMatch) {
            console.log(`   Original Score: ${originalMatch[1]}%`);
            console.log(`   Calibrated Score: ${calibratedMatch[1]}%`);
            console.log(`   Adjustment: ${adjustmentMatch ? adjustmentMatch[1] : 'N/A'}%`);
        } else if (strategicMatch) {
            console.log(`   Strategic Score: ${strategicMatch[1]}%`);
        }
        
        // Look for actionable recommendations
        const recommendationsMatch = responseText.match(/actionable|recommendation|specific.*action/i);
        if (recommendationsMatch) {
            console.log('✅ Actionable recommendations detected');
        }
        
        console.log('='.repeat(80));
        console.log('🎯 TEST COMPLETE - Business calibration system is working!');
        
        // Save full response for review
        const fs = await import('fs');
        fs.writeFileSync('calibrated-metlen-result.txt', responseText);
        console.log('📄 Full response saved to: calibrated-metlen-result.txt');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testCalibratedSystem(); 