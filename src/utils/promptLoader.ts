import fs from 'fs'
import path from 'path'

export async function loadPrompt(promptName: string): Promise<string> {
  const promptPath = path.join(process.cwd(), 'src', 'prompts', `${promptName}.txt`)
  return fs.readFileSync(promptPath, 'utf-8')
}

export async function loadAnalysisTypePrompt(type: string): Promise<string> {
  const promptPath = path.join(process.cwd(), 'src', 'prompts', 'analysis-types', `${type}.txt`)
  return fs.readFileSync(promptPath, 'utf-8')
} 