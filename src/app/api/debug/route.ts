import { NextResponse } from 'next/server'
import { logger } from '@/utils/logger'

export async function POST(request: Request) {
  logger.log('Debug API', 'Received debug request')
  
  try {
    const data = await request.json()
    logger.log('Debug API', 'Request data', data)
    
    return NextResponse.json({ 
      message: 'Debug log recorded',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    logger.error('Debug API', 'Error processing request', error)
    return NextResponse.json({ error: 'Debug failed' }, { status: 500 })
  }
} 