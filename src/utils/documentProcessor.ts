import * as XLSX from 'xlsx'
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'
import mammoth from 'mammoth'

// Initialize PDF.js only on client side
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker
}

export type SupportedFileType = 'pdf' | 'docx' | 'txt' | 'csv' | 'xlsx' | 'image'

export async function processDocument(file: File): Promise<{
  content: string;
  type: SupportedFileType;
}> {
  try {
    const fileType = getFileType(file)
    
    switch (fileType) {
      case 'xlsx':
      case 'csv':
        return processExcel(file)
      case 'docx':
        return processDocx(file)
      case 'txt':
        return processText(file)
      case 'pdf':
        return processPdf(file)
      case 'image':
        return processImage(file)
      default:
        throw new Error(`Unsupported file type: ${file.type}`)
    }
  } catch (error) {
    console.error('Document processing error:', error)
    throw error
  }
}

function getFileType(file: File): SupportedFileType {
  const mimeType = file.type
  const extension = file.name.split('.').pop()?.toLowerCase()

  if (mimeType.includes('spreadsheet') || 
      mimeType.includes('excel') || 
      extension === 'xlsx' || 
      extension === 'xls') {
    return 'xlsx'
  }

  if (mimeType.includes('csv') || extension === 'csv') {
    return 'csv'
  }

  switch (extension) {
    case 'docx':
      return 'docx'
    case 'pdf':
      return 'pdf'
    case 'txt':
      return 'txt'
    case 'jpg':
    case 'jpeg':
    case 'png':
      return 'image'
    default:
      throw new Error(`Unsupported file type: ${file.type}`)
  }
}

async function processExcel(file: File) {
  const arrayBuffer = await file.arrayBuffer()
  const workbook = XLSX.read(arrayBuffer)
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
  const csvContent = XLSX.utils.sheet_to_csv(firstSheet)
  
  return {
    content: csvContent,
    type: 'xlsx' as SupportedFileType
  }
}

async function processDocx(file: File) {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return {
    content: result.value,
    type: 'docx' as SupportedFileType
  }
}

async function processText(file: File) {
  const text = await file.text()
  return {
    content: text,
    type: 'txt' as SupportedFileType
  }
}

async function processPdf(file: File) {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    const numPages = pdf.numPages
    let fullText = ''

    // Extract text from all pages
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      const text = content.items.map((item: any) => item.str).join(' ')
      fullText += text + '\n'
    }

    return {
      content: fullText,
      type: 'pdf' as SupportedFileType
    }
  } catch (error) {
    console.error('PDF processing error:', error)
    throw error
  }
}

async function processImage(file: File) {
  try {
    // Convert image to base64
    const base64Image = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result)
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
    
    return {
      content: '',  // Empty content since we'll use the URL
      imageUrl: base64Image,  // Use base64 data URL instead of blob URL
      type: 'image' as SupportedFileType
    }
  } catch (error) {
    console.error('Image processing error:', error)
    throw error
  }
} 