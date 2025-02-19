import { OpenAI } from 'openai'
import { type ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import { NextResponse } from 'next/server'
import { loadPrompt, loadAnalysisTypePrompt } from '@/utils/promptLoader'
import { formatOutput } from '@/utils/formatOutput'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  try {
    const { content, analysisType, documents } = await req.json()
    console.log('API received:', { content, analysisType })

    // Load base prompt
    let systemPrompt = await loadPrompt('financial-analyst')
    
    if (analysisType) {
      const analysisPrompt = await loadAnalysisTypePrompt(analysisType)
      systemPrompt += '\n\n' + analysisPrompt
    }

    // Remove the formatting instructions that add headers
    systemPrompt = systemPrompt.replace(/Format your response using this professional structure[\s\S]*?two line breaks between main sections`/, '')

    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt }
    ]

    // Handle both image and text analysis with gpt-4o
    if (documents?.[0]?.imageUrl) {
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
    } else {
      messages.push({
        role: 'user',
        content: content
      })
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.7,
      max_tokens: 2000
    })

    const cleanContent = formatOutput(response.choices[0].message.content ?? '', 'analysis')
    return NextResponse.json({ content: cleanContent })
  } catch (error) {
    console.error('OpenAI API error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
} 