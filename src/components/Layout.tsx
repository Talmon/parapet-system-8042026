import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, DollarSign, Calendar, Clock, Target,
  Briefcase, Receipt, FileText, Megaphone, Upload, Settings, BarChart3, Menu, Bell, X, Truck, FolderOpen, LogOut, ChevronDown
} from 'lucide-react';
import { useState } from 'react';
import logo from '@/assets/parapet-logo.png';
import AskParapet from '@/components/AskParapet';
import { useAuth, ROLE_LABELS, ROLE_COLORS, NAV_PERMISSIONS } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const allMainMenu = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/employees', label: 'Employee Directory', icon: Users },
  { to: '/payroll', label: 'Payroll Processing', icon: DollarSign },
  { to: '/leave', label: 'Leave Management', icon: Calendar },
  { to: '/attendance', label: 'Attendance', icon: Clock },
  { to: '/performance', label: 'Performance', icon: Target },
  { to: '/kpis', label: 'KPI Management', icon: BarChart3 },
  { to: '/recruitment', label: 'Recruitment', icon: Briefcase },
  { to: '/expenses', label: 'Expenses', icon: Receipt },
  { to: '/statutory', label: 'Statutory Reports', icon: FileText },
  { to: '/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/fleet', label: 'Fleet Management', icon: Truck },
  { to: '/documents', label: 'Document Hub', icon: FolderOpen },
  { to: '/upload', label: 'Bulk Upload', icon: Upload },
];

const systemMenu = [
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, canAccess } = useAuth();

  const mainMenu = allMainMenu.filter(item => {
    const allowed = NAV_PERMISSIONS[item.to];
    if (!allowed || !user) return false;
    return allowed.includes(user.role);
  });

  const filteredSystemMenu = systemMenu.filter(item => {
    const allowed = NAV_PERMISSIONS[item.to];
    if (!allowed || !user) return false;
    return allowed.includes(user.role);
  });

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const roleColor = user ? ROLE_COLORS[user.role] : 'bg-primary';

  const SidebarContent = () => (
    <>
      <div className="p-4 flex items-center gap-3">
        <img src={logo} alt="Parapet" className="h-10 w-auto brightness-0 invert" />
      </div>
      <div className="px-4 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'hsl(var(--sidebar-muted))' }}>Main Menu</span>
      </div>
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
        {mainMenu.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
        {filteredSystemMenu.length > 0 && (
          <>
            <div className="pt-4 pb-2 px-2">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'hsl(var(--sidebar-muted))' }}>System</span>
            </div>
            {filteredSystemMenu.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}
          </>
        )}
      </nav>
      {/* User profile in sidebar */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-white/10 cursor-pointer" onClick={handleLogout}>
          <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${roleColor}`}>
            {user?.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: 'hsl(var(--sidebar-fg))' }}>{user?.name}</p>
            <p className="text-xs opacity-60 truncate" style={{ color: 'hsl(var(--sidebar-muted))' }}>{user ? ROLE_LABELS[user.role] : ''}</p>
          </div>
          <LogOut size={14} style={{ color: 'hsl(var(--sidebar-muted))' }} />
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-60 flex-col flex-shrink-0" style={{ background: 'hsl(var(--sidebar-bg))' }}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-60 h-full flex flex-col" style={{ background: 'hsl(var(--sidebar-bg))' }}>
            <button onClick={() => setSidebarOpen(false)} className="absolute top-3 right-3 p-1" style={{ color: 'hsl(var(--sidebar-fg))' }}>
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center justify-between px-6 border-b bg-card flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            <div>
              <h1 className="page-title text-lg">{getPageTitle(location.pathname)}</h1>
              <p className="page-subtitle text-xs">{getPageSubtitle(location.pathname)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-muted">
              <Bell size={20} className="text-muted-foreground" />
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold">3</span>
            </button>
            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(v => !v)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-muted transition-colors"
              >
                <div className={`h-9 w-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${roleColor}`}>
                  {user?.avatar}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium leading-tight">{user?.name}</p>
                  <p className="text-xs text-muted-foreground leading-tight">{user ? ROLE_LABELS[user.role] : ''}</p>
                </div>
                <ChevronDown size={14} className="hidden sm:block text-muted-foreground" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-56 rounded-xl border bg-card shadow-lg z-50 overflow-hidden">
                  <div className="p-3 border-b">
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    <p className="text-xs text-muted-foreground">{user?.department} · {user?.employeeId}</p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={() => { setUserMenuOpen(false); handleLogout(); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        {/* Click outside to close user menu */}
        {userMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />}

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
        <AskParapet />
      </div>
    </div>
  );
}

function getPageTitle(path: string): string {
  const map: Record<string, string> = {
    '/': 'Dashboard',
    '/employees': 'Employee Directory',
    '/payroll': 'Payroll Processing',
    '/leave': 'Leave Management',
    '/attendance': 'Attendance & Time Tracking',
    '/performance': 'Performance Management',
    '/kpis': 'KPI Management',
    '/recruitment': 'Recruitment',
    '/expenses': 'Expense Management',
    '/statutory': 'Statutory Reports',
    '/announcements': 'Announcements',
    '/fleet': 'Fleet Management',
    '/documents': 'Document Hub',
    '/upload': 'Bulk Upload',
    '/settings': 'Settings',
  };
  if (path.startsWith('/employees/')) return 'Employee Profile';
  return map[path] || 'Parapet HRMS';
}

function getPageSubtitle(path: string): string {
  const map: Record<string, string> = {
    '/': 'April 2026 · Payroll Period Overview',
    '/employees': '5,000 employees across all departments',
    '/payroll': 'April 2026 Payroll Run',
    '/leave': 'Track and manage employee leave requests',
    '/attendance': 'Daily attendance records and overtime',
    '/performance': 'Q1 2026 Review Cycle',
    '/kpis': 'Create, track, and monitor key performance indicators',
    '/recruitment': 'Job postings, applicant tracking & hiring pipeline',
    '/expenses': 'Employee expense claims and reimbursements',
    '/statutory': 'Kenya Revenue Authority · SHIF · NSSF · Housing Levy',
    '/announcements': 'Company-wide announcements and updates',
    '/fleet': 'Company vehicles, assignments & maintenance tracking',
    '/documents': 'Central repository for company documents & policies',
    '/upload': 'Import employee data in bulk',
    '/settings': 'System configuration and preferences',
  };
  return map[path] || '';
}
