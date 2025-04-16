'use client';

import { useState, useEffect, useRef } from 'react';
import { BarChart, FileText, Users, Activity, TrendingUp, Clock, Database, Upload, File, X } from 'lucide-react';
import { processDocument } from '@/utils/documentProcessor';

interface DashboardStats {
  documentsAnalyzed: number;
  activeChats: number;
  analysisRuns: number;
  averageProcessingTime: number;
}

interface KnowledgeDocument {
  id: string;
  name: string;
  type: string;
  uploadDate: Date;
  size: string;
  status: 'processing' | 'ready' | 'error';
  textContent?: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    documentsAnalyzed: 0,
    activeChats: 0,
    analysisRuns: 0,
    averageProcessingTime: 0
  });

  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    await uploadFiles(files);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await uploadFiles(files);
  };

  const uploadFiles = async (files: File[]) => {
    for (const file of files) {
      try {
        // Add to documents list with processing status
        const newDoc: KnowledgeDocument = {
          id: Date.now().toString(),
          name: file.name,
          type: file.type,
          uploadDate: new Date(),
          size: formatFileSize(file.size),
          status: 'processing'
        };
        
        setDocuments(prev => [...prev, newDoc]);

        // Process the document
        const processedDoc = await processDocument(file);

        // Create form data for upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('content', processedDoc.content);
        formData.append('type', processedDoc.type);

        // Upload to server
        const response = await fetch('/api/knowledge-base/upload', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();

        // Update document status
        setDocuments(prev => prev.map(doc => 
          doc.id === newDoc.id 
            ? { 
                ...doc, 
                status: 'ready',
                textContent: processedDoc.content 
              }
            : doc
        ));

      } catch (error) {
        console.error('Upload error:', error);
        // Update document status to error
        setDocuments(prev => prev.map(doc => 
          doc.name === file.name 
            ? { ...doc, status: 'error' }
            : doc
        ));
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex-1 ml-[200px] flex flex-col h-full bg-[var(--background-dark)]">
      <div className="w-full max-w-[1400px] mx-auto flex-1 flex flex-col relative p-8">
        {/* Header with summary */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-[var(--text-primary)] mb-2">Dashboard Overview</h1>
          <p className="text-[var(--text-secondary)]">Real-time analytics and performance metrics</p>
        </div>

        {/* Stats Grid with enhanced styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[var(--input-bg)] p-6 rounded-lg border border-[var(--box-stroke)] hover:border-[var(--blue-accent)] transition-colors duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-[rgba(0,87,255,0.1)] p-3 rounded-lg">
                <FileText className="w-6 h-6 text-[var(--blue-accent)]" />
              </div>
              <div>
                <p className="text-3xl font-light text-[var(--text-primary)]">{stats.documentsAnalyzed}</p>
                <h3 className="text-[var(--text-secondary)] text-sm">Documents Analyzed</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-[var(--blue-accent)] text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+12% from last month</span>
            </div>
          </div>

          <div className="bg-[var(--input-bg)] p-6 rounded-lg border border-[var(--box-stroke)] hover:border-[var(--blue-accent)] transition-colors duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-[rgba(0,87,255,0.1)] p-3 rounded-lg">
                <Users className="w-6 h-6 text-[var(--blue-accent)]" />
              </div>
              <div>
                <p className="text-3xl font-light text-[var(--text-primary)]">{stats.activeChats}</p>
                <h3 className="text-[var(--text-secondary)] text-sm">Active Chats</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-[var(--blue-accent)] text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+12% from last month</span>
            </div>
          </div>

          <div className="bg-[var(--input-bg)] p-6 rounded-lg border border-[var(--box-stroke)] hover:border-[var(--blue-accent)] transition-colors duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-[rgba(0,87,255,0.1)] p-3 rounded-lg">
                <BarChart className="w-6 h-6 text-[var(--blue-accent)]" />
              </div>
              <div>
                <p className="text-3xl font-light text-[var(--text-primary)]">{stats.analysisRuns}</p>
                <h3 className="text-[var(--text-secondary)] text-sm">Analysis</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-[var(--blue-accent)] text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+12% from last month</span>
            </div>
          </div>

          <div className="bg-[var(--input-bg)] p-6 rounded-lg border border-[var(--box-stroke)] hover:border-[var(--blue-accent)] transition-colors duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-[rgba(0,87,255,0.1)] p-3 rounded-lg">
                <Activity className="w-6 h-6 text-[var(--blue-accent)]" />
              </div>
              <div>
                <p className="text-3xl font-light text-[var(--text-primary)]">{stats.averageProcessingTime}s</p>
                <h3 className="text-[var(--text-secondary)] text-sm">Processing</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-[var(--blue-accent)] text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+12% from last month</span>
            </div>
          </div>
        </div>

        {/* Company Knowledge Base Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl text-[var(--text-primary)] font-light">Company Knowledge Data</h2>
              <p className="text-[var(--text-secondary)] text-sm mt-1">Upload and manage company documents for AI analysis</p>
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--blue-accent)] rounded-lg text-white text-sm hover:bg-opacity-90 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload Documents
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              multiple
              accept=".pdf,.doc,.docx,.txt,.csv"
            />
          </div>

          {/* Drag and Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            className={`
              border-2 border-dashed rounded-lg p-8 mb-6 text-center
              ${isDragging 
                ? 'border-[var(--blue-accent)] bg-[rgba(0,87,255,0.1)]' 
                : 'border-[var(--box-stroke)]'
              }
            `}
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-[var(--text-secondary)]" />
              <p className="text-[var(--text-primary)]">Drag and drop documents here</p>
              <p className="text-[var(--text-secondary)] text-sm">or click the upload button above</p>
            </div>
          </div>

          {/* Documents List */}
          <div className="bg-[var(--input-bg)] rounded-lg border border-[var(--box-stroke)]">
            <div className="grid grid-cols-[1fr,100px,150px,100px] p-4 border-b border-[var(--box-stroke)]">
              <span className="text-[var(--text-secondary)] text-sm">Name</span>
              <span className="text-[var(--text-secondary)] text-sm">Size</span>
              <span className="text-[var(--text-secondary)] text-sm">Upload Date</span>
              <span className="text-[var(--text-secondary)] text-sm">Status</span>
            </div>
            <div className="divide-y divide-[var(--box-stroke)]">
              {documents.length === 0 ? (
                <div className="p-4 text-center text-[var(--text-secondary)]">
                  No documents uploaded yet
                </div>
              ) : (
                documents.map((doc) => (
                  <div key={doc.id} className="grid grid-cols-[1fr,100px,150px,100px] p-4 items-center hover:bg-[rgba(255,255,255,0.02)]">
                    <div className="flex items-center gap-3">
                      <File className="w-4 h-4 text-[var(--blue-accent)]" />
                      <span className="text-[var(--text-primary)] text-sm">{doc.name}</span>
                    </div>
                    <span className="text-[var(--text-secondary)] text-sm">{doc.size}</span>
                    <span className="text-[var(--text-secondary)] text-sm">
                      {new Date(doc.uploadDate).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      {doc.status === 'processing' ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-[var(--blue-accent)] border-t-transparent rounded-full animate-spin" />
                          <span className="text-[var(--text-secondary)] text-sm">Processing</span>
                        </div>
                      ) : (
                        <span className={`text-sm ${
                          doc.status === 'ready' ? 'text-[var(--blue-accent)]' : 'text-red-500'
                        }`}>
                          {doc.status === 'ready' ? 'Ready' : 'Error'}
                        </span>
                      )}
                      <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Activity and Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-[var(--input-bg)] p-6 rounded-lg border border-[var(--box-stroke)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl text-[var(--text-primary)] font-light">Recent Activity</h2>
              <button className="text-[var(--blue-accent)] text-sm hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {/* Activity items */}
              <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-[rgba(255,255,255,0.02)]">
                <div className="bg-[rgba(0,87,255,0.1)] p-2 rounded-lg">
                  <Database className="w-4 h-4 text-[var(--blue-accent)]" />
                </div>
                <div>
                  <p className="text-[var(--text-primary)] text-sm">New document analyzed</p>
                  <p className="text-[var(--text-secondary)] text-xs">2 minutes ago</p>
                </div>
              </div>
              {/* More activity items... */}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-[var(--input-bg)] p-6 rounded-lg border border-[var(--box-stroke)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl text-[var(--text-primary)] font-light">Performance Metrics</h2>
              <button className="text-[var(--blue-accent)] text-sm hover:underline">Details</button>
            </div>
            {/* Add performance charts/graphs here */}
          </div>
        </div>
      </div>
    </div>
  );
} 