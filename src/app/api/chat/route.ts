import { OpenAI } from 'openai'
import { type ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import { NextResponse } from 'next/server'
import { loadPrompt, loadAnalysisTypePrompt } from '@/utils/promptLoader'
import { formatOutput } from '@/utils/formatOutput'
import { processWithISAF, parseGPTAnalysis, performISAFCalculations } from '@/utils/ISAF'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  try {
    const { content, analysisType, documents } = await req.json()
    console.log('API received:', { content, analysisType, documents })

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

    const response = await openai.chat.completions.create({
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
        cleanContent = processWithISAF(cleanContent);
      } catch (error) {
        console.error('ISAF processing error:', error);
        // Fall back to formatted GPT output if ISAF processing fails
        cleanContent = formatOutput(cleanContent, analysisType);
      }
    } else {
      cleanContent = formatOutput(cleanContent, analysisType);
    }
    
    return NextResponse.json({ content: cleanContent })
  } catch (error) {
    console.error('OpenAI API error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
} 