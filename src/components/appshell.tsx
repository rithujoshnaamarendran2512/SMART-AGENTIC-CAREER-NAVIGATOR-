import { type ReactNode, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  Compass,
  LayoutDashboard,
  UserCircle,
  Briefcase,
  BarChart3,
  GraduationCap,
  Map,
  TrendingUp,
  LineChart,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export type PageKey =
  | 'dashboard'
  | 'profile'
  | 'careers'
  | 'skills'
  | 'learning'
  | 'roadmap'
  | 'trends'
  | 'progress';

interface AppShellProps {
  currentPage: PageKey;
  onNavigate: (page: PageKey) => void;
  children: ReactNode;
}

const navItems: { key: PageKey; label: string; icon: typeof Compass }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'profile', label: 'My Profile', icon: UserCircle },
  { key: 'careers', label: 'Career Recommendations', icon: Briefcase },
  { key: 'skills', label: 'Skill Gap Analysis', icon: BarChart3 },
  { key: 'learning', label: 'Learning Resources', icon: GraduationCap },
  { key: 'roadmap', label: 'Career Roadmap', icon: Map },
  { key: 'trends', label: 'Industry Trends', icon: TrendingUp },
  { key: 'progress', label: 'Progress Tracking', icon: LineChart },
];

export function AppShell({ currentPage, onNavigate, children }: AppShellProps) {
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (page: PageKey) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200 fixed inset-y-0 left-0 z-30">
        <SidebarContent currentPage={currentPage} onNavigate={handleNav} user={user} onSignOut={signOut} />
      </aside>

      {/* Sidebar - mobile drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 z-50 bg-white border-r border-slate-200 md:hidden">
            <SidebarContent currentPage={currentPage} onNavigate={handleNav} user={user} onSignOut={signOut} />
          </aside>
        </>
      )}

      {/* Main */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-4 h-14 bg-white border-b border-slate-200 sticky top-0 z-20">
          <button onClick={() => setMobileOpen(true)} className="p-2 -ml-2 text-slate-600">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-teal-600" />
            <span className="font-semibold text-slate-800 text-sm">Career Navigator</span>
          </div>
          <div className="w-9" />
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({
  currentPage,
  onNavigate,
  user,
  onSignOut,
}: {
  currentPage: PageKey;
  onNavigate: (p: PageKey) => void;
  user: { email?: string } | null;
  onSignOut: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-slate-200">
        <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center flex-shrink-0">
          <Compass className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="font-bold text-slate-800 text-sm leading-tight">Career Navigator</div>
          <div className="text-xs text-slate-400 leading-tight">Multi-Agent System</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              currentPage === item.key
                ? 'bg-teal-50 text-teal-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-slate-200 p-3">
        <div className="flex items-center gap-2 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-semibold flex-shrink-0">
            {(user?.email ?? 'U')[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-slate-700 truncate">{user?.email}</div>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-50 hover:text-rose-600 transition-all"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}