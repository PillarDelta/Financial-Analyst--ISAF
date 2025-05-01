import { NextResponse } from 'next/server'
import { testISAFV2 } from '@/utils/test-isaf'

export async function GET(req: Request) {
  try {
    console.log('Running ISAF-V2 test...')
    
    // Run the test
    const result = testISAFV2()
    
    // Return the result
    return NextResponse.json({ 
      success: true, 
      message: 'ISAF-V2 test completed successfully', 
      result 
    })
  } catch (error) {
    console.error('Test ISAF API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Test failed', 
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
} 