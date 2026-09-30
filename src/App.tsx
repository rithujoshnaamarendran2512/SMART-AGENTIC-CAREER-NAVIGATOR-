import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { AuthPage } from '@/pages/auth';
import { HomePage } from '@/pages/home';
import { AppShell, type PageKey } from '@/components/appshell';
import { DashboardPage } from '@/pages/dashboard';
import { ProfilePage } from '@/pages/profile';
import { CareersPage } from '@/pages/careers';
import { SkillsPage } from '@/pages/skills';
import { LearningPage } from '@/pages/learning';
import { RoadmapPage } from '@/pages/roadmap';
import { TrendsPage } from '@/pages/trends';
import { ProgressPage } from '@/pages/progress';

function AppContent() {
  const { user, loading } = useAuth();
  const [route, setRoute] = useState(window.location.hash);
  const [page, setPage] = useState<PageKey>('dashboard');

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Clear hash once logged in so we land in the app
  useEffect(() => {
    if (user && (window.location.hash === '#/auth' || window.location.hash === '')) {
      window.location.hash = '/dashboard';
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  // Not authenticated — show landing or auth
  if (!user) {
    if (route === '#/auth') return <AuthPage />;
    return <HomePage />;
  }

  // Authenticated — show app shell with selected page
  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <DashboardPage onNavigate={setPage} />;
      case 'profile':
        return <ProfilePage />;
      case 'careers':
        return <CareersPage />;
      case 'skills':
        return <SkillsPage />;
      case 'learning':
        return <LearningPage />;
      case 'roadmap':
        return <RoadmapPage />;
      case 'trends':
        return <TrendsPage />;
      case 'progress':
        return <ProgressPage />;
      default:
        return <DashboardPage onNavigate={setPage} />;
    }
  };

  return (
    <AppShell currentPage={page} onNavigate={setPage}>
      {renderPage()}
    </AppShell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}