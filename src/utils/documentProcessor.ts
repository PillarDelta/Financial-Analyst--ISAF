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
  imageUrl?: string;
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
    console.log('Processing PDF:', file.name, 'Size:', file.size)
    const arrayBuffer = await file.arrayBuffer()
    console.log('ArrayBuffer created, size:', arrayBuffer.byteLength)
    
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    const numPages = pdf.numPages
    console.log('PDF loaded successfully. Number of pages:', numPages)
    
    let fullText = ''

    // Extract text from all pages
    for (let i = 1; i <= numPages; i++) {
      try {
        console.log(`Processing page ${i}/${numPages}`)
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        
        // More robust text extraction
        const pageText = content.items
          .filter((item: any) => item.str && item.str.trim().length > 0)
          .map((item: any) => item.str)
          .join(' ')
        
        if (pageText.trim().length > 0) {
          fullText += pageText + '\n'
          console.log(`Page ${i} extracted ${pageText.length} characters`)
        } else {
          console.log(`Page ${i} appears to be empty or image-only`)
        }
      } catch (pageError) {
        console.error(`Error processing page ${i}:`, pageError)
        // Continue with other pages
        continue
      }
    }

    console.log('Total extracted text length:', fullText.length)
    console.log('First 200 characters:', fullText.substring(0, 200))

    // If no text was extracted, convert first page to image for OCR
    if (fullText.trim().length === 0) {
      console.warn('No text extracted from PDF - attempting image conversion for OCR')
      
      try {
        // Convert first page to image
        const page = await pdf.getPage(1)
        const viewport = page.getViewport({ scale: 2.0 }) // Higher resolution for better OCR
        
        // Create canvas
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')!
        canvas.height = viewport.height
        canvas.width = viewport.width

        // Render page to canvas
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise

        // Convert canvas to base64 image
        const imageUrl = canvas.toDataURL('image/png')
        
        console.log('Successfully converted PDF to image for OCR analysis')
        
        return {
          content: '', // Empty content since we'll use image
          imageUrl: imageUrl,
          type: 'pdf' as SupportedFileType
        }
      } catch (conversionError) {
        console.error('Failed to convert PDF to image:', conversionError)
        throw new Error('PDF appears to contain no extractable text and could not be converted to image. This may be a scanned document or corrupted PDF. Please try uploading the document as an image (PNG/JPG) instead.')
      }
    }

    return {
      content: fullText,
      type: 'pdf' as SupportedFileType
    }
  } catch (error) {
    console.error('PDF processing error:', error)
    
    // Provide more helpful error messages
    if (error instanceof Error) {
      if (error.message.includes('Invalid PDF')) {
        throw new Error('Invalid PDF file. Please ensure the file is not corrupted.')
      } else if (error.message.includes('extractable text') || error.message.includes('converted to image')) {
        throw error // Re-throw our custom message
      } else {
        throw new Error(`PDF processing failed: ${error.message}`)
      }
    } else {
      throw new Error('PDF processing failed due to an unknown error')
    }
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
      imageUrl: base64Image,  // This should be a valid base64 string
      type: 'image' as SupportedFileType
    }
  } catch (error) {
    console.error('Image processing error:', error)
    throw error
  }
} 