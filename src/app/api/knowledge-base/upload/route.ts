import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import mammoth from 'mammoth';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Create unique filename
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Process .docx files
    let textContent = '';
    if (file.name.endsWith('.docx')) {
      try {
        const result = await mammoth.extractRawText({ buffer });
        textContent = result.value;
        
        // Store the extracted text
        const textFilePath = path.join(process.cwd(), 'public', 'uploads', `${fileName}.txt`);
        await writeFile(textFilePath, textContent);
      } catch (error) {
        console.error('Error processing .docx file:', error);
        return NextResponse.json(
          { error: 'Failed to process .docx file' },
          { status: 500 }
        );
      }
    }

    // Here you would typically:
    // 1. Process the document for text extraction
    // 2. Store metadata in database
    // 3. Index content for search
    // 4. Generate embeddings for AI context

    return NextResponse.json({
      success: true,
      documentId: fileName,
      url: `/uploads/${fileName}`,
      textContent: textContent || null
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 