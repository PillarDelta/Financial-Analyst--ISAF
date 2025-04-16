'use client';

import { useEffect } from 'react';

export default function DashboardPage() {
  useEffect(() => {
    console.log('Dashboard page mounted'); // Debug log
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl text-text-primary mb-6">Knowledge Base Dashboard</h1>
      {/* Add a test element to verify the page loads */}
      <div className="text-text-primary">Dashboard is working!</div>
    </div>
  );
} 