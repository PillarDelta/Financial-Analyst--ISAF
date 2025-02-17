'use client';

import { useState } from 'react';
import { Upload, Folder, FileText, Search, X, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface KnowledgeBaseItem {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'txt' | 'csv';
  category: string;
  dateAdded: Date;
  size: number;
}

export default function KnowledgeBaseDashboard() {
  const pathname = usePathname();
  console.log('Current pathname:', pathname);
  const [documents, setDocuments] = useState<KnowledgeBaseItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleDashboardClick = (e: React.MouseEvent) => {
    console.log('Dashboard clicked');
  };

  return (
    <div className="w-[200px] h-full bg-sidebar-bg border-r border-border-color p-4">
      {/* Dashboard Link */}
      <div className="mb-6">
        <Link 
          href="/v2/dashboard"
          onClick={handleDashboardClick}
          className={`w-full flex items-center gap-2 px-2 py-2 rounded text-sm ${
            pathname?.includes('/dashboard')
              ? 'bg-blue-accent bg-opacity-10 text-blue-accent'
              : 'text-text-secondary hover:bg-input-bg'
          }`}
          prefetch={true}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search knowledge base..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-input-bg rounded-md px-8 py-2 text-sm text-text-primary border border-border-color focus:outline-none focus:border-blue-accent"
        />
        <Search className="absolute left-2 top-2.5 w-4 h-4 text-text-secondary" />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-2 top-2.5"
          >
            <X className="w-4 h-4 text-text-secondary hover:text-text-primary" />
          </button>
        )}
      </div>

      {/* Upload Section */}
      <div className="mb-6">
        <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-accent rounded-md text-white text-sm hover:bg-opacity-90 transition-colors">
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="text-text-secondary text-xs uppercase mb-2">Categories</h3>
        <div className="space-y-2">
          {['All Documents', 'Financial Reports', 'Market Analysis', 'Research'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category.toLowerCase())}
              className={`w-full text-left px-2 py-1.5 rounded text-sm ${
                selectedCategory === category.toLowerCase()
                  ? 'bg-blue-accent bg-opacity-10 text-blue-accent'
                  : 'text-text-secondary hover:bg-input-bg'
              }`}
            >
              <Folder className="w-4 h-4 inline-block mr-2" />
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Document List */}
      <div>
        <h3 className="text-text-secondary text-xs uppercase mb-2">Recent Documents</h3>
        <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
          {documents.length === 0 ? (
            <div className="text-text-secondary text-sm text-center py-4">
              No documents yet
            </div>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-2 p-2 rounded hover:bg-input-bg group cursor-pointer"
              >
                <FileText className="w-4 h-4 text-text-secondary" />
                <div className="flex-1 min-w-0">
                  <div className="text-text-primary text-sm truncate">{doc.name}</div>
                  <div className="text-text-secondary text-xs">
                    {new Date(doc.dateAdded).toLocaleDateString()}
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 text-text-secondary hover:text-text-primary">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 