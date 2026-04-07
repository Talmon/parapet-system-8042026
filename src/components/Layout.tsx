import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, DollarSign, Calendar, Clock, Target,
  Briefcase, Receipt, FileText, Megaphone, Upload, Settings, BarChart3, Menu, Bell, X, Truck, FolderOpen
} from 'lucide-react';
import { useState } from 'react';
import logo from '@/assets/parapet-logo.png';

const mainMenu = [
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
  const location = useLocation();

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
        <div className="pt-4 pb-2 px-2">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'hsl(var(--sidebar-muted))' }}>System</span>
        </div>
        {systemMenu.map(item => (
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
      </nav>
      <div className="p-4 text-xs" style={{ color: 'hsl(var(--sidebar-muted))' }}>
        Parapet HRMS v2.0 © 2026
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
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">HR</div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">HR Admin</p>
                <p className="text-xs text-muted-foreground">admin@parapet.co.ke</p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
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
    '/upload': 'Bulk Upload',
    '/settings': 'Settings',
  };
  return map[path] || 'Parapet HRMS';
}

function getPageSubtitle(path: string): string {
  const map: Record<string, string> = {
    '/': 'April 2026 · Payroll Period Overview',
    '/employees': `5,000 employees`,
    '/payroll': 'April 2026 Payroll Run',
    '/leave': 'Track and manage employee leave requests',
    '/attendance': 'Daily attendance records and overtime',
    '/performance': 'Q1 2026 Review Cycle',
    '/kpis': 'Create, track, and monitor key performance indicators',
    '/recruitment': 'Job postings, applicant tracking & hiring pipeline',
    '/expenses': 'Employee expense claims and reimbursements',
    '/statutory': 'Kenya Revenue Authority · SHIF · NSSF · Housing Levy',
    '/announcements': 'Company-wide announcements and updates',
    '/upload': 'Import employee data in bulk',
    '/settings': 'System configuration',
  };
  return map[path] || '';
}
