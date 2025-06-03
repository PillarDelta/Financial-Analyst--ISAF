import fs from 'fs'
import path from 'path'

export async function loadPrompt(promptName: string): Promise<string> {
  try {
    const promptPath = path.join(process.cwd(), 'src', 'prompts', `${promptName}.txt`)
    return fs.readFileSync(promptPath, 'utf-8')
  } catch (error) {
    console.warn(`Could not load prompt: ${promptName}. Using default system prompt.`)
    return `You are a professional financial analyst and strategic business consultant. Provide comprehensive, data-driven analysis with actionable insights.`
  }
}

export async function loadAnalysisTypePrompt(type: string): Promise<string> {
  try {
    const promptPath = path.join(process.cwd(), 'src', 'prompts', 'analysis-types', `${type}.txt`)
    return fs.readFileSync(promptPath, 'utf-8')
  } catch (error) {
    console.warn(`Could not load analysis prompt for type: ${type}. Using default.`)
    throw error // Let the calling code handle this
  }
} 