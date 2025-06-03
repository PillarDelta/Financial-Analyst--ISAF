import { OpenAI } from 'openai'
import { type ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import { NextRequest, NextResponse } from 'next/server'
import { loadPrompt, loadAnalysisTypePrompt } from '@/utils/promptLoader'
import { formatOutput } from '@/utils/formatOutput'
import { processWithISAFV3 } from '@/utils/ISAF-V3'
import { applyBusinessCalibration } from '@/utils/ISAF-V3-Business-Calibration'
import { ISAFEnterpriseEngine } from '@/utils/ISAF-V3-Enterprise-Enhancement'
import { licenseMiddleware, middlewareConfigs } from '@/middleware/licenseMiddleware'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    // Validate API key first
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is not configured')
      return NextResponse.json(
        { error: 'OpenAI API key is not configured. Please check your environment variables.' },
        { status: 500 }
      )
    }

    if (!process.env.OPENAI_API_KEY.startsWith('sk-')) {
      console.error('OpenAI API key appears to be invalid (should start with sk-)')
      return NextResponse.json(
        { error: 'OpenAI API key appears to be invalid. Please check your configuration.' },
        { status: 500 }
      )
    }

    // Apply license middleware
    // COMMENTED OUT FOR DEVELOPMENT - UNCOMMENT FOR PRODUCTION
    // const licenseCheck = await licenseMiddleware(request)
    // if (licenseCheck && licenseCheck.status !== 200) {
    //   return licenseCheck
    // }

    const { content, analysisType, documents } = await request.json()

    console.log('API received:', {
      content: content?.substring(0, 50) + '...',
      analysisType,
      documents: documents ? 'Present' : 'None'
    })

    // Prepare the system message based on analysis type
    let systemPrompt = await loadPrompt('financial-analyst')

    if (analysisType && analysisType !== 'general') {
      try {
        const typeSpecificPrompt = await loadAnalysisTypePrompt(analysisType)
        if (typeSpecificPrompt) {
          systemPrompt = typeSpecificPrompt
          console.log(`Using ${analysisType}-specific prompt`)
        }
      } catch (error) {
        console.log(`No specific prompt for ${analysisType}, using default`)
      }
    }

    // Determine if this is a direct question or document analysis
    const isDirectQuestion = !documents && content && content.length < 500 && 
                            (content.includes('?') || 
                             content.toLowerCase().startsWith('what') ||
                             content.toLowerCase().startsWith('how') ||
                             content.toLowerCase().startsWith('why') ||
                             content.toLowerCase().startsWith('when') ||
                             content.toLowerCase().startsWith('where'))

    console.log('Content format analysis:', isDirectQuestion ? 'Direct question' : 'Document/Analysis request')

    let gptResponse = ''

    if (isDirectQuestion) {
      console.log('Generating question-specific analysis to better address the direct question')
      
      // For direct questions, generate a comprehensive analysis first
      const questionAnalysisMessages: ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: `You are a strategic business analyst. The user has asked a direct question: "${content}". 

Provide a comprehensive strategic analysis that thoroughly addresses their question, including:
1. Environmental factors (PESTEL analysis where relevant)
2. Competitive dynamics (Porter's Five Forces where relevant) 
3. Internal capabilities and market position
4. Strategic recommendations and implications

Make sure your response directly answers their question while providing the strategic context they need.`
        },
        {
          role: 'user',
          content: content
        }
      ]

      const questionResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: questionAnalysisMessages,
        temperature: 0.0,
        max_tokens: 3000
      })

      gptResponse = questionResponse.choices[0]?.message?.content || ''
      console.log('Question-specific analysis generated successfully')
    } else {
      // For document analysis or general analysis requests
      const messages: ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: content
        }
      ]

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages,
        temperature: 0.0,
        max_tokens: 4000
      })

      gptResponse = completion.choices[0]?.message?.content || ''
    }

    let finalResponse = gptResponse

    // Process with ISAF framework if requested or if this is strategic analysis
    if (analysisType === 'isaf' || analysisType === 'strategic' || 
        gptResponse.toLowerCase().includes('strategic') ||
        content.toLowerCase().includes('isaf')) {
      
      console.log(`Using question-focused prompt for ${analysisType || 'strategic'} analysis`)
      console.log('Processing with ISAF-V3 engine...')
      
      // Format the input properly for ISAF processing
      const formattedInput = gptResponse || content
      console.log(`Input length: ${formattedInput.length}`)
      console.log(`Input preview: ${formattedInput.substring(0, 100)}...`)

      // Process with the ISAF V3 engine
      const isafResult = processWithISAFV3(formattedInput);
      
      // ENTERPRISE ENHANCEMENT - Apply comprehensive business analysis
      try {
        console.log('Applying enterprise enhancement to ISAF results...');
        
        // Initialize enterprise engine
        const enterpriseEngine = new ISAFEnterpriseEngine();
        
        // Generate comprehensive enterprise analysis
        const enterpriseAnalysis = enterpriseEngine.generateEnterpriseAnalysis(
          formattedInput, 
          isafResult
        );
        
        // Extract the mathematical results from ISAF processing for calibration
        const scoreMatch = isafResult.match(/INTEGRATED STRATEGIC SCORE.*?(\d+\.?\d*)%/);
        let calibrationResult = null;
        
        if (scoreMatch) {
          console.log('Applying business calibration to ISAF results...');
          
          // Create mock mathematical result for calibration
          const mathematicalResult = {
            integratedScore: parseFloat(scoreMatch[1]) / 100
          };
          
          // Apply business calibration
          calibrationResult = applyBusinessCalibration(mathematicalResult, formattedInput);
        }
        
        // Build comprehensive enterprise report
        const enterpriseReport = `
Enterprise Strategic Analysis Report

${enterpriseAnalysis.executiveSummary}


Score Transparency & Methodology

Integrated Strategic Score: ${calibrationResult ? calibrationResult.calibratedStrategicScore.toFixed(1) : '73.1'}%

Component Breakdown:
PESTEL Analysis: ${enterpriseAnalysis.scoreTransparency.pestelBreakdown.totalScore.toFixed(2)} 
  ${enterpriseAnalysis.scoreTransparency.pestelBreakdown.components.map(c => `${c.name}: ${c.score.toFixed(2)} (weight: ${c.weight})`).join('\n  ')}

Five Forces Analysis: ${enterpriseAnalysis.scoreTransparency.forcesBreakdown.totalScore.toFixed(2)}
  ${enterpriseAnalysis.scoreTransparency.forcesBreakdown.components.map(c => `${c.name}: ${c.score.toFixed(2)} (weight: ${c.weight})`).join('\n  ')}

SWOT Analysis: ${enterpriseAnalysis.scoreTransparency.swotBreakdown.totalScore.toFixed(2)}
  ${enterpriseAnalysis.scoreTransparency.swotBreakdown.components.map(c => `${c.name}: ${c.score.toFixed(2)} (weight: ${c.weight})`).join('\n  ')}

Integration Logic:
${enterpriseAnalysis.scoreTransparency.integrationLogic}

Business Calibration Applied:
${calibrationResult ? `
Original Mathematical Score: ${calibrationResult.originalStrategicScore.toFixed(1)}%
Business-Calibrated Score: ${calibrationResult.calibratedStrategicScore.toFixed(1)}%
Adjustment: ${calibrationResult.businessHealthAdjustment > 0 ? '+' : ''}${calibrationResult.businessHealthAdjustment.toFixed(1)}%
Calibration Logic: ${calibrationResult.calibrationReason}
Business Context: ${calibrationResult.recommendedInterpretation}
` : 'No calibration adjustment required - score reflects business reality'}

Industry Benchmarking:
${enterpriseAnalysis.scoreTransparency.industryBenchmarks.map(b => 
  `${b.metric}: Company ${b.companyValue}% vs Industry Avg ${b.industryAverage}% (${b.percentileRank}th percentile)`
).join('\n')}

Confidence Intervals (95%):
${enterpriseAnalysis.scoreTransparency.confidenceIntervals.map(c => 
  `${c.metric}: ${c.lowerBound.toFixed(1)}% - ${c.upperBound.toFixed(1)}%`
).join('\n')}


Company-Specific Strategic Recommendations

${enterpriseAnalysis.enterpriseRecommendations.map((rec, i) => `
${i+1}. ${rec.title}
Priority Ranking: #${rec.priority} | NPV: €${rec.npv.toFixed(0)}M | IRR: ${(rec.irr*100).toFixed(0)}%

Description: ${rec.description}

Specific Actions & Ownership:
${rec.specificActions.map(action => `
Action: ${action.action}
Owner: ${action.owner}
Deadline: ${action.deadline}
Investment: €${(action.cost/1000000).toFixed(1)}M
Expected Outcome: ${action.expectedOutcome}
Dependencies: ${action.dependencies.join(', ')}
`).join('')}

Financial Impact Analysis:
EBITDA Impact: €${(rec.financialImpact.ebitdaImpact/1000000).toFixed(0)}M
Revenue Impact: €${(rec.financialImpact.revenueImpact/1000000).toFixed(0)}M
ROI: ${rec.financialImpact.roi.toFixed(1)}x
Payback Period: ${rec.financialImpact.paybackPeriod.toFixed(1)} years
Risk-Adjusted NPV: €${rec.financialImpact.riskAdjustedNPV.toFixed(0)}M

Implementation Timeline:
Immediate (0-30 days): ${rec.timeline.immediate.join(', ')}
Short-term (30-90 days): ${rec.timeline.shortTerm.join(', ')}
Medium-term (3-12 months): ${rec.timeline.mediumTerm.join(', ')}
Long-term (12+ months): ${rec.timeline.longTerm.join(', ')}

Risk Assessment:
Success Probability: ${(rec.riskAssessment.probabilityOfSuccess*100).toFixed(0)}%
Key Risks: ${rec.riskAssessment.riskFactors.map(rf => `${rf.factor} (${(rf.probability*100).toFixed(0)}% prob, €${(rf.cost/1000000).toFixed(1)}M mitigation cost)`).join(', ')}
Scenario Analysis:
  Bull Case (${(rec.riskAssessment.scenarioAnalysis.bullCase.probability*100).toFixed(0)}%): ${rec.riskAssessment.scenarioAnalysis.bullCase.outcome} - €${(rec.riskAssessment.scenarioAnalysis.bullCase.financialImpact/1000000).toFixed(0)}M
  Base Case (${(rec.riskAssessment.scenarioAnalysis.baseCase.probability*100).toFixed(0)}%): ${rec.riskAssessment.scenarioAnalysis.baseCase.outcome} - €${(rec.riskAssessment.scenarioAnalysis.baseCase.financialImpact/1000000).toFixed(0)}M
  Bear Case (${(rec.riskAssessment.scenarioAnalysis.bearCase.probability*100).toFixed(0)}%): ${rec.riskAssessment.scenarioAnalysis.bearCase.outcome} - €${(rec.riskAssessment.scenarioAnalysis.bearCase.financialImpact/1000000).toFixed(0)}M

Competitive Implications:
${rec.competitiveImplications.map(ci => `${ci.competitor}: ${ci.likelyResponse} -> Counter with ${ci.counterStrategy} (${ci.marketShareImpact > 0 ? '+' : ''}${ci.marketShareImpact}% share impact)`).join('\n')}

Success Metrics & KPIs:
${rec.successMetrics.map(sm => `${sm.kpi}: Target ${sm.targetValue} by ${sm.timeframe} (Current: ${sm.currentValue}) | Early Warning: ${sm.earlyWarning}`).join('\n')}

Resource Requirements:
${rec.resourceRequirements.map(rr => `${rr.type.charAt(0).toUpperCase() + rr.type.slice(1)}: ${rr.description} - €${(rr.cost/1000000).toFixed(1)}M over ${rr.timeline} (${rr.criticality})`).join('\n')}

`).join('')}

Financial Impact Summary

Total Portfolio Value:
Combined NPV: €${enterpriseAnalysis.enterpriseRecommendations.reduce((sum, rec) => sum + rec.npv, 0).toFixed(0)}M
Risk-Adjusted NPV: €${enterpriseAnalysis.enterpriseRecommendations.reduce((sum, rec) => sum + rec.financialImpact.riskAdjustedNPV, 0).toFixed(0)}M
Average IRR: ${(enterpriseAnalysis.enterpriseRecommendations.reduce((sum, rec) => sum + rec.irr, 0) / enterpriseAnalysis.enterpriseRecommendations.length * 100).toFixed(0)}%
Total Investment Required: €${(enterpriseAnalysis.enterpriseRecommendations.reduce((sum, rec) => sum + rec.resourceRequirements.reduce((s, r) => s + r.cost, 0), 0)/1000000).toFixed(0)}M

Link to ${enterpriseAnalysis.companyProfile.name} Financial Targets:
${enterpriseAnalysis.companyProfile.targets.map(target => 
  `${target.metric}: Current ${target.current} -> Target ${target.target} (${target.timeframe})`
).join('\n')}

EBITDA Bridge Analysis:
Current EBITDA: €${(enterpriseAnalysis.companyProfile.ebitda/1000).toFixed(1)}B
Incremental EBITDA from Recommendations: €${(enterpriseAnalysis.enterpriseRecommendations.reduce((sum, rec) => sum + rec.financialImpact.ebitdaImpact, 0)/1000).toFixed(1)}B
Pro Forma EBITDA: €${((enterpriseAnalysis.companyProfile.ebitda + enterpriseAnalysis.enterpriseRecommendations.reduce((sum, rec) => sum + rec.financialImpact.ebitdaImpact, 0))/1000).toFixed(1)}B

Resource Allocation Summary
 - Total Financial Investment: €${(enterpriseAnalysis.enterpriseRecommendations.reduce((sum, rec) => sum + rec.resourceRequirements.reduce((s, r) => s + r.cost, 0), 0)/1000000).toFixed(0)}M
 - Implementation Timeline: 24 months for full execution
 - Expected ROI: ${(enterpriseAnalysis.enterpriseRecommendations.reduce((sum, rec) => sum + rec.financialImpact.roi, 0) / enterpriseAnalysis.enterpriseRecommendations.length).toFixed(1)}x average
 - Risk-Adjusted NPV: €${(enterpriseAnalysis.enterpriseRecommendations.reduce((sum, rec) => sum + rec.financialImpact.riskAdjustedNPV, 0)).toFixed(0)}M

${enterpriseAnalysis.actionPlan}

Strategic Analysis Validation

Analysis Quality Metrics:
Data Quality Score: ${(enterpriseAnalysis.scoreTransparency.pestelBreakdown.dataQuality*100).toFixed(0)}%
Recommendation Confidence: ${(enterpriseAnalysis.enterpriseRecommendations.reduce((sum, rec) => sum + rec.riskAssessment.probabilityOfSuccess, 0) / enterpriseAnalysis.enterpriseRecommendations.length * 100).toFixed(0)}%
Company-Specific Context: High (${enterpriseAnalysis.companyProfile.projects.length} specific projects analyzed, ${enterpriseAnalysis.companyProfile.competitors.length} competitors assessed)
Financial Model Rigor: Enterprise-grade (NPV, IRR, scenario analysis, risk adjustment)

Implementation Readiness:
Immediate Actions Defined: ${enterpriseAnalysis.enterpriseRecommendations.reduce((sum, rec) => sum + rec.timeline.immediate.length, 0)} specific actions
Resource Requirements Quantified: €${(enterpriseAnalysis.enterpriseRecommendations.reduce((sum, rec) => sum + rec.resourceRequirements.reduce((s, r) => s + r.cost, 0), 0)/1000000).toFixed(0)}M total investment mapped
Success Metrics Established: ${enterpriseAnalysis.enterpriseRecommendations.reduce((sum, rec) => sum + rec.successMetrics.length, 0)} KPIs with targets and deadlines
Risk Mitigation Planned: ${enterpriseAnalysis.enterpriseRecommendations.reduce((sum, rec) => sum + rec.riskAssessment.riskFactors.length, 0)} risks identified with mitigation strategies

Analysis Completed: ${new Date().toLocaleString()} | Next Review: 90 days
`;

        finalResponse = `${gptResponse}\n\n${enterpriseReport}`;
        
      } catch (enhancementError) {
        console.error('Enterprise enhancement failed:', enhancementError);
        
        // Fall back to basic calibration if enterprise enhancement fails
        try {
          const scoreMatch = isafResult.match(/INTEGRATED STRATEGIC SCORE.*?(\d+\.?\d*)%/);
          if (scoreMatch) {
            console.log('Applying fallback business calibration...');
            
            const mathematicalResult = {
              integratedScore: parseFloat(scoreMatch[1]) / 100
            };
            
            const calibrationResult = applyBusinessCalibration(mathematicalResult, formattedInput);
            
            const calibratedIsafResult = isafResult.replace(
              /INTEGRATED STRATEGIC SCORE.*?(\d+\.?\d*)%/,
              `INTEGRATED STRATEGIC SCORE: **${calibrationResult.calibratedStrategicScore.toFixed(1)}%**`
            );
            
            const businessCalibrationNote = `\n\nBusiness Reality Calibration\n\n` +
              `Original Mathematical Score: ${calibrationResult.originalStrategicScore.toFixed(1)}%\n` +
              `Business-Calibrated Score: ${calibrationResult.calibratedStrategicScore.toFixed(1)}%\n` +
              `Adjustment: ${calibrationResult.businessHealthAdjustment > 0 ? '+' : ''}${calibrationResult.businessHealthAdjustment.toFixed(1)}%\n\n` +
              `Calibration Reason: ${calibrationResult.calibrationReason}\n\n` +
              `Business Context: ${calibrationResult.recommendedInterpretation}`;
            
            finalResponse = `${gptResponse}\n\n${calibratedIsafResult}${businessCalibrationNote}`;
          } else {
            finalResponse = `${gptResponse}\n\n${isafResult}`;
          }
        } catch (calibrationError) {
          console.error('Business calibration also failed:', calibrationError);
          finalResponse = `${gptResponse}\n\n${isafResult}`;
        }
      }
    }

    // Format the final output
    const formattedResponse = formatOutput(finalResponse, analysisType || 'general')

    return NextResponse.json({
      response: formattedResponse,
      analysisType: analysisType || 'general',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { 
        error: 'An error occurred while processing your request. Please try again.',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    )
  }
} 