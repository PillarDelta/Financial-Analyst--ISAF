/**
 * Test Script: ISAF-V3 Deterministic Behavior Validation
 * 
 * This script tests whether ISAF-V3 produces identical mathematical results
 * when given the same input multiple times.
 */

// Import fetch for Node.js compatibility
import fetch from 'node-fetch';
import fs from 'fs';

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

### Debt & Credit Profile
- **Net Debt**: €1,776 million (adjusted, excluding non-recourse)
- **Net Debt/EBITDA**: 1.7x (investment-grade level)
- **Credit Rating**: BB+ (Fitch) - one notch from investment grade
- **Recent Upgrade**: Both Fitch and S&P upgraded ratings in 2024

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

**Planned Expansion (€295.5M investment)**:
- Bauxite: 2,000,000 tonnes/year by 2026
- Alumina: 1,265,000 tonnes/year by 2028
- Gallium: 50 tonnes/year (first in Europe)

### Energy Storage Portfolio
- Chile: 1,610 MWh operational BESS (sold for $815M)
- UK: 732 MW/1.18 GWh BESS projects (30% market share)
- Australia: 4.8 GWh Denman BESS under development
- Total pipeline: ~3.5 GWh globally

### Project Pipeline
- **EPC Backlog**: €463.1 million contracted + €530 million in advanced negotiations
- **Infrastructure Backlog**: Approaching €1.4 billion
- **Recent UK Contracts**: £110 million for 313.4 MW projects

## 3. ESG Performance

### Environmental Metrics (2023)
- **Carbon Emissions**: 30% reduction target by 2030, Net Zero by 2050
- **Scope 1**: 3.15% reduction vs previous year
- **Scope 2**: 4.2% reduction vs previous year
- **Renewable Production**: 1.1+ TWh annually
- **Waste Recycling**: 30% of total waste

### Social Responsibility
- **Employees**: 7,620 direct, 39,162 total jobs supported
- **Training**: 61,408 hours delivered
- **Community Impact**: 162,000 citizens benefited from 26 programs
- **Economic Contribution**: €3.63 billion to Greek GDP (1.65%)

### Governance Structure
- **Board**: 13 Directors (8 independent, 89% non-executive independence)
- **Committees**: Audit, Remuneration & Nomination, Sustainability
- **Compliance**: Zero incidents of corruption or anti-competitive behavior

### ESG Ratings Excellence
- **MSCI ESG**: AA rating (Leaders group)
- **DJSI**: Included in Emerging Markets (3rd consecutive year)
- **EcoVadis**: Platinum Award
- **Sustainalytics**: Top 11% lowest ESG risk in Energy
- **CDP Climate**: B (Management Level)
- **ESG Book**: Top 1% globally under SASB standard

## 4. Market Position

### Market Share
**Greek Energy Market**:
- Electricity Production: 18.2% of total demand (9.4 TWh)
- Retail Market: 19.4% share (Q1 2025), targeting 30%
- Natural Gas Imports: 40% of Greece's total (40 TWh)

**European Aluminum**:
- Only fully integrated bauxite-alumina-aluminum producer in EU
- Largest bauxite producer in Europe
- First quartile global cash cost curve

**Renewable Energy**:
- UK Storage: Nearly 30% market share
- Southeast Europe: Leading developer position

### Geographic Revenue Split
- Greece: 50.9% of net sales
- European Union: 36.5%
- Rest of World: 12.6%
- Operations: 40+ countries across 5 continents

### Strategic Partnerships
**Key Industrial**:
- Rio Tinto: 11-year bauxite (14.9Mt) and 8-year alumina (3.9Mt) agreements
- PPC Group: €2 billion cooperation for 2 GW solar development
- Fairfax Financial: €110 million investment, 8.35% stake

**Customer Base**:
- 550,000+ electricity and gas customers in Greece
- Major PPAs: Centrica, Vodafone UK, iliad Italia
- Defense partnerships: KNDS France, Iveco Defence Vehicles

## 5. Competitive Landscape

### Key Competitors by Segment

**Aluminum/Metals**:
- Norsk Hydro: ~€5B revenue, NOK 7.37B EBITDA
- Alcoa: $11.9B revenue, struggling profitability
- Rio Tinto: Strategic partner, global leader
- EGA: 5.4% global aluminum market share

**Renewable Energy**:
- Iberdrola: €96B market cap, 44.7 GW operational
- Enel: 59 GW managed capacity globally
- Ørsted: Offshore wind leader

**Greek Energy**:
- PPC: €9.7B revenue, declining market share
- Elpedison: 6.28% retail share
- Heron Energy: 7.03% retail share

### Competitive Advantages
1. **Integrated Model**: Only EU company with full bauxite-to-aluminum integration
2. **Energy-Metals Synergies**: Aluminum plant as flexible energy demand
3. **Cost Position**: First quartile aluminum production costs
4. **ESG Leadership**: Top ratings across all major agencies
5. **Asset Rotation**: Self-funded renewable growth model

### Strategic Challenges
- Scale disadvantage vs global giants
- Geographic concentration in Southeast Europe
- Technology gaps in offshore wind
- Regulatory exposure to EU carbon policies

## Key Strategic Developments (2024-2025)

### Major Investments
1. **€295.5M Gallium Facility**: First industrial production in Europe (50 tonnes/year by 2028)
2. **€2B PPC Partnership**: 2 GW solar development across 4 countries
3. **UK Infrastructure**: £2.5B Eastern Green Link subsea project

### Growth Trajectory
- Revenue growth maintained despite energy price deflation
- EBITDA reached record levels with improving margins
- Credit rating approaching investment grade
- Renewable capacity expanded by 0.6 GW in 2024
- International presence expanded from 30 to 40+ countries

### Future Targets
- 30% Greek retail electricity market share
- €2 billion medium-term EBITDA target
- 2 GW renewable capacity additions
- Investment grade credit rating achievement

## Investment Highlights

**Strengths**:
- Record financial performance with €1.08B EBITDA
- Unique integrated energy-metals business model
- ESG leadership with AA MSCI rating
- Strong market positions across all segments
- One notch from investment grade

**Growth Drivers**:
- European critical materials shortage (gallium)
- Greek energy market liberalization
- Global energy transition acceleration
- Asset rotation enabling self-funded growth

**Risk Factors**:
- Commodity price exposure (aluminum, energy)
- Geographic concentration risks
- Intensive CAPEX requirements
- Regulatory changes in EU markets

This comprehensive dataset provides all key metrics and strategic information needed for AI-powered strategic analysis of METLEN Energy & Metals' position, performance, and prospects in the evolving energy and materials landscape.`;

console.log('🧪 ISAF-V3 Deterministic Test: Running METLEN Analysis 10 Times');
console.log('================================================================================\n');

const results = [];

for (let i = 1; i <= 10; i++) {
    console.log(`📊 Run ${i}/10 - Sending request...`);
    
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

        const result = await response.json();
        
        // Extract scores using regex - Fix: use 'response' field instead of 'message'
        const strategicMatch = result.response?.match(/INTEGRATED STRATEGIC SCORE.*?([0-9.]+)%/);
        const pestelMatch = result.response?.match(/PESTEL Environmental Score: (-?[0-9.]+)/);
        const forcesMatch = result.response?.match(/Five Forces Competitive Score: ([0-9.]+)/);
        const swotMatch = result.response?.match(/SWOT Organizational Score: ([0-9.]+)/);
        const qualityMatch = result.response?.match(/Extraction.*?quality[:\s]*(\w+)/i);
        
        const runResult = {
            run: i,
            strategic: strategicMatch ? parseFloat(strategicMatch[1]) : 'Not found',
            pestel: pestelMatch ? parseFloat(pestelMatch[1]) : 'Not found',
            forces: forcesMatch ? parseFloat(forcesMatch[1]) : 'Not found',
            swot: swotMatch ? parseFloat(swotMatch[1]) : 'Not found',
            quality: qualityMatch ? qualityMatch[1] : 'Not found'
        };
        
        results.push(runResult);
        
        console.log(`✅ Run ${i} completed`);
        console.log(`   Strategic Score: ${runResult.strategic}`);
        console.log(`   PESTEL Score: ${runResult.pestel}`);
        console.log(`   Forces Score: ${runResult.forces}`);
        console.log(`   SWOT Score: ${runResult.swot}`);
        console.log(`   Extraction Quality: ${runResult.quality}\n`);
        
    } catch (error) {
        console.log(`❌ Run ${i} failed:`, error.message);
        results.push({ run: i, error: error.message });
    }
}

console.log('================================================================================');
console.log('📊 RESULTS ANALYSIS');
console.log('================================================================================');

const successfulRuns = results.filter(r => !r.error);
console.log(`✅ ${successfulRuns.length}/10 runs successful\n`);

if (successfulRuns.length > 0) {
    // Analyze each metric
    const metrics = ['strategic', 'pestel', 'forces', 'swot'];
    
    for (const metric of metrics) {
        const values = successfulRuns.map(r => r[metric]);
        const uniqueValues = [...new Set(values)];
        const isDeterministic = uniqueValues.length === 1;
        
        console.log(`🎯 ${metric.toUpperCase()} SCORES:`);
        console.log(`   All scores: ${values.join(', ')}`);
        console.log(`   Unique scores: ${uniqueValues.length}`);
        console.log(`   ${isDeterministic ? '✅' : '❌'} Deterministic: ${isDeterministic ? 'YES' : 'NO'}\n`);
    }
    
    // Overall determinism check
    const allDeterministic = metrics.every(metric => {
        const values = successfulRuns.map(r => r[metric]);
        const uniqueValues = [...new Set(values)];
        return uniqueValues.length === 1;
    });
    
    console.log('==================================================');
    console.log(`🏆 OVERALL RESULT: ${allDeterministic ? '✅ DETERMINISTIC' : '❌ NON-DETERMINISTIC'}`);
    console.log('==================================================');
    
    if (!allDeterministic) {
        console.log('⚠️  WARNING: Some variation detected in mathematical results');
        console.log('🔍 This may indicate non-deterministic behavior needs investigation');
    }
}

// Save detailed results
await fs.promises.writeFile('metlen-deterministic-test-results.json', JSON.stringify(results, null, 2));
console.log('\n💾 Detailed results saved to: metlen-deterministic-test-results.json'); 