import { OpenAI } from 'openai'
import { type ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import { NextResponse } from 'next/server'
import { loadPrompt, loadAnalysisTypePrompt } from '@/utils/promptLoader'
import { formatOutput } from '@/utils/formatOutput'
import { processWithISAFV2 } from '@/utils/ISAF-V2'

// Enable mock mode for development when API key is invalid or hitting rate limits
const USE_MOCK_RESPONSES = process.env.NODE_ENV === 'development';

// Mock response function for development
function getMockResponse(analysisType: string, query: string): string {
  // Basic mock response based on the analysis type
  switch (analysisType) {
    case 'isaf':
      return `
Strategic Analysis Report

Executive Summary:
- The analysis identified key strategic factors across environmental, competitive, and organizational dimensions.
- Mathematical modeling reveals 7 critical factors that significantly impact strategic outcomes.
- The integrated model projects a strategic fit score of 68.3%.

Key Findings:
- The most significant strategic factors are: Technological Innovation (impact score: 9.2), Market Dynamics (impact score: 8.1), Digital Transformation (impact score: 7.9).
- The strategic equilibrium analysis indicates a moderate competitive advantage position.
- Risk analysis reveals moderate volatility with 62% probability of positive outcomes in simulated scenarios.
- Financial modeling projects 14.3% growth potential with appropriate strategic implementation.

Strategic Recommendations:
1. Invest in digital transformation initiatives (87% confidence)
   • Implement advanced analytics for customer insights and operational efficiency
   • Time horizon: medium-term, Resource intensity: high
   • Impact potential: 8.5/10

2. Develop sustainability-focused product lines (82% confidence)
   • Target growing eco-conscious market segments with differentiated offerings
   • Time horizon: short-term, Resource intensity: medium
   • Impact potential: 7.8/10

3. Optimize supply chain for resilience (79% confidence)
   • Diversify supplier networks and implement predictive risk management
   • Time horizon: immediate, Resource intensity: medium
   • Impact potential: 8.2/10

4. Enhance cybersecurity infrastructure (75% confidence)
   • Protect digital assets and customer data with advanced security protocols
   • Time horizon: immediate, Resource intensity: medium
   • Impact potential: 7.6/10

5. Explore strategic partnerships in complementary markets (73% confidence)
   • Leverage combined capabilities for market expansion and innovation
   • Time horizon: medium-term, Resource intensity: medium
   • Impact potential: 7.9/10

Methodology:
- Factor Extraction: Tensor-based analysis of 18 PESTEL factors, 5 competitive forces, and 12 SWOT elements
- Model Integration: Cross-framework coupling matrices with eigendecomposition for factor importance calculation
- Recommendation Generation: Monte Carlo simulations with 1,000 iterations to assess strategic robustness and opportunity sizing
      `;
    case 'risk-analysis':
      return `
RISK ANALYSIS REPORT

EXECUTIVE SUMMARY
The risk analysis reveals a moderate overall risk profile (score: 6.3/10) with significant exposure in operational and market-related areas.

KEY RISK FACTORS
• Market volatility: High exposure (8.2/10)
• Operational disruptions: Moderate exposure (6.4/10)
• Regulatory compliance: Low to moderate exposure (4.7/10)
• Credit risk: Low exposure (3.2/10)

RISK MITIGATION RECOMMENDATIONS
1. Implement hedging strategies for key market exposures
2. Develop operational continuity plans for critical processes
3. Enhance compliance monitoring systems

The organization should prioritize addressing market volatility risk through appropriate financial instruments and diversification strategies.
      `;
    default:
      return `
ANALYSIS RESULTS

Based on the provided information, here is a summary of key insights:

• The data suggests moderate performance with opportunities for improvement
• Several strengths were identified in the core business areas
• Potential risks include market changes and competitive pressures

RECOMMENDATIONS
1. Focus on core competencies and differentiation
2. Explore new market opportunities through targeted research
3. Enhance operational efficiency to improve margins

These insights are based on the available information and standard analytical frameworks.
      `;
  }
}

// Initialize OpenAI client with error handling
const initializeOpenAI = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not defined in environment variables');
  }
  
  if (apiKey.includes('your_valid_api_key_here') || apiKey.startsWith('sk-proj-')) {
    console.warn('Using placeholder or project API key. This may not work correctly.');
    // We'll try to use it, but might fall back to mock responses
  }
  
  return new OpenAI({ apiKey });
};

// Try to initialize OpenAI client
let openaiClient: OpenAI;
try {
  openaiClient = initializeOpenAI();
} catch (error) {
  console.error('Failed to initialize OpenAI client:', error);
}

export async function POST(req: Request) {
  try {
    // Parse the request
    const { content, analysisType, documents } = await req.json()
    console.log('API received:', { content, analysisType, documents })

    // Check if we should use mock responses due to configuration issues
    const mockResponseCondition = 
      USE_MOCK_RESPONSES && 
      (!process.env.OPENAI_API_KEY || 
       process.env.OPENAI_API_KEY.includes('your_valid_api_key_here') ||
       process.env.OPENAI_API_KEY.startsWith('sk-proj-'));
    
    if (mockResponseCondition) {
      console.log('Using mock response due to API key issues');
      const mockContent = getMockResponse(analysisType, content);
      return NextResponse.json({ 
        content: mockContent,
        isMock: true
      });
    }
    
    // Verify OpenAI client exists
    if (!openaiClient) {
      openaiClient = initializeOpenAI();
    }

    // Load base prompt
    let systemPrompt = await loadPrompt('financial-analyst')
    
    if (analysisType) {
      const analysisPrompt = await loadAnalysisTypePrompt(analysisType)
      systemPrompt += '\n\n' + analysisPrompt
    }

    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt }
    ]

    // Special handling for ISAF analysis
    if (analysisType === 'isaf') {
      // Use a higher temperature for more creative mathematical modeling
      const isafPrompt = content.includes('analyze') 
        ? content 
        : `Please perform an ISAF strategic analysis on the following business information: ${content}`;
      
      messages.push({
        role: 'user',
        content: isafPrompt
      });
    }
    // Handle both image and text analysis with gpt-4o
    else if (documents?.[0]?.imageUrl) {
      // Special handling for ISAF document analysis
      if (analysisType === 'isaf') {
        messages.push({
          role: 'user',
          content: [
            { 
              type: 'text', 
              text: 'Perform an ISAF strategic analysis on this document. Identify all business factors for PESTEL analysis, Porter\'s Five Forces, and SWOT analysis. Format your response with clear sections for Environmental Analysis, Competitive Assessment, and Organizational Capability.' 
            },
            { 
              type: 'image_url',
              image_url: {
                url: documents[0].imageUrl,
                detail: 'high'
              }
            }
          ]
        } as ChatCompletionMessageParam)
      } else {
        messages.push({
          role: 'user',
          content: [
            { 
              type: 'text', 
              text: 'Analyze this financial document using the DIFS framework. Extract and analyze any visible financial data, charts, or metrics.' 
            },
            { 
              type: 'image_url',
              image_url: {
                url: documents[0].imageUrl,
                detail: 'high'
              }
            }
          ]
        } as ChatCompletionMessageParam)
      }
    } else if (documents?.[0]?.content) {
      // Special handling for ISAF document content analysis
      if (analysisType === 'isaf') {
        messages.push({
          role: 'user',
          content: [
            { 
              type: 'text', 
              text: `Perform an ISAF strategic analysis on this document. Identify all business factors for PESTEL analysis, Porter's Five Forces, and SWOT analysis. Format your response with clear sections for Environmental Analysis, Competitive Assessment, and Organizational Capability. Document content: ${documents[0].content}` 
            }
          ]
        } as ChatCompletionMessageParam)
      } else {
        messages.push({
          role: 'user',
          content: [
            { 
              type: 'text', 
              text: `Please analyze this financial document using the DIFS framework. Here is the extracted content: ${documents[0].content}` 
            }
          ]
        } as ChatCompletionMessageParam)
      }
    } else {
      messages.push({
        role: 'user',
        content: content
      })
    }

    try {
      const response = await openaiClient.chat.completions.create({
        model: 'gpt-4o',  // Keep using gpt-4o for all data types
        messages,
        temperature: analysisType === 'isaf' ? 0.9 : 0.7, // Higher temperature for ISAF
        max_tokens: 2000
      })

      let cleanContent = response.choices[0].message.content ?? '';
      
      // For ISAF analysis, process the GPT output through our mathematical engine
      if (analysisType === 'isaf') {
        try {
          // GPT provides the initial analysis, ISAF engine performs the calculations
          console.log('Processing with ISAF engine...');
          cleanContent = processWithISAFV2(cleanContent);
        } catch (error) {
          console.error('ISAF processing error:', error);
          // Fall back to formatted GPT output if ISAF processing fails
          cleanContent = formatOutput(cleanContent, analysisType);
        }
      } else {
        cleanContent = formatOutput(cleanContent, analysisType);
      }
      
      return NextResponse.json({ content: cleanContent })
    } catch (openaiError: any) {
      // Handle OpenAI specific errors
      console.error('OpenAI API error:', openaiError);
      
      let errorMessage = 'OpenAI API error';
      let statusCode = 500;
      
      // Check for common OpenAI errors
      if (openaiError.status === 401) {
        errorMessage = 'API key is invalid or expired';
        statusCode = 401;
      } else if (openaiError.status === 429) {
        errorMessage = 'API rate limit exceeded';
        statusCode = 429;
        
        // For rate limiting in development, use mock response
        if (USE_MOCK_RESPONSES) {
          console.log('Rate limited: Using mock response');
          const mockContent = getMockResponse(analysisType, content);
          return NextResponse.json({ 
            content: mockContent,
            isMock: true
          });
        }
      } else if (openaiError.status === 400) {
        errorMessage = openaiError.message || 'Bad request to OpenAI API';
        statusCode = 400;
      }
      
      // Include error details for easier debugging
      return NextResponse.json(
        { 
          error: errorMessage,
          details: openaiError.message || 'Unknown error',
          type: openaiError.type || 'openai_error'
        },
        { status: statusCode }
      );
    }
  } catch (error: any) {
    console.error('Request processing error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process request', 
        message: error.message || 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
} 