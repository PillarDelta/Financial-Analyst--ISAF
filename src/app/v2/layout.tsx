import KnowledgeBaseDashboard from './components/KnowledgeBaseDashboard';
import './styles/globals.css';

export default function V2Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background-dark text-text-primary">
      <KnowledgeBaseDashboard />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
} 