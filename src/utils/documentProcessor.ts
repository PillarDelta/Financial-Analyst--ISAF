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
      case 'docx':
        return processDocx(file)
      case 'txt':
        return processText(file)
      case 'csv':
        return processCsv(file)
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
  const extension = file.name.split('.').pop()?.toLowerCase()
  
  switch (extension) {
    case 'docx':
      return 'docx'
    case 'pdf':
      return 'pdf'
    case 'txt':
      return 'txt'
    case 'csv':
      return 'csv'
    case 'xlsx':
      return 'xlsx'
    case 'jpg':
    case 'jpeg':
    case 'png':
      return 'image'
    default:
      throw new Error(`Unsupported file extension: ${extension}`)
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

async function processCsv(file: File) {
  const text = await file.text()
  return {
    content: text,
    type: 'csv' as SupportedFileType
  }
}

async function processPdf(file: File) {
  // For now, just return placeholder
  return {
    content: 'PDF processing to be implemented',
    type: 'pdf' as SupportedFileType
  }
}

async function processImage(file: File) {
  // For now, just return placeholder
  return {
    content: 'Image processing to be implemented',
    type: 'image' as SupportedFileType
  }
}

async function processSpreadsheet(buffer: ArrayBuffer, fileType: string): Promise<string> {
  if (fileType === 'text/csv') {
    const text = new TextDecoder().decode(buffer)
    return text
  } else {
    const workbook = XLSX.read(buffer)
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
    return XLSX.utils.sheet_to_csv(firstSheet)
  }
} 