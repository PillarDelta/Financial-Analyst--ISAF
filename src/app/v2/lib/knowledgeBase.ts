interface UploadResponse {
  success: boolean;
  documentId?: string;
  error?: string;
}

export async function uploadDocument(file: File): Promise<UploadResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', 'uncategorized');

    const response = await fetch('/api/knowledge-base/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Upload failed');
    }

    return {
      success: true,
      documentId: data.documentId
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
} 