import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type UserRole = 'admin' | 'hr_manager' | 'supervisor' | 'employee';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  jobTitle: string;
  employeeId: string;
  avatar: string;
}

const DEMO_USERS: AuthUser[] = [
  {
    id: '1',
    name: 'David Kamau',
    email: 'admin@parapet.co.ke',
    role: 'admin',
    department: 'Executive',
    jobTitle: 'System Administrator',
    employeeId: 'PAR-0001',
    avatar: 'DK',
  },
  {
    id: '2',
    name: 'Jane Wanjiku',
    email: 'hr@parapet.co.ke',
    role: 'hr_manager',
    department: 'Human Resources',
    jobTitle: 'HR Manager',
    employeeId: 'PAR-0042',
    avatar: 'JW',
  },
  {
    id: '3',
    name: 'Peter Ochieng',
    email: 'supervisor@parapet.co.ke',
    role: 'supervisor',
    department: 'Operations',
    jobTitle: 'Operations Supervisor',
    employeeId: 'PAR-0118',
    avatar: 'PO',
  },
  {
    id: '4',
    name: 'Grace Muthoni',
    email: 'employee@parapet.co.ke',
    role: 'employee',
    department: 'Facility Services',
    jobTitle: 'Facility Officer',
    employeeId: 'PAR-0334',
    avatar: 'GM',
  },
];

export const DEMO_CREDENTIALS: Record<UserRole, { email: string; password: string; user: AuthUser }> = {
  admin: { email: 'admin@parapet.co.ke', password: 'admin123', user: DEMO_USERS[0] },
  hr_manager: { email: 'hr@parapet.co.ke', password: 'hr123', user: DEMO_USERS[1] },
  supervisor: { email: 'supervisor@parapet.co.ke', password: 'super123', user: DEMO_USERS[2] },
  employee: { email: 'employee@parapet.co.ke', password: 'emp123', user: DEMO_USERS[3] },
};

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'System Admin',
  hr_manager: 'HR Manager',
  supervisor: 'Supervisor',
  employee: 'Employee',
};

export const ROLE_COLORS: Record<UserRole, string> = {
  admin: 'bg-red-600',
  hr_manager: 'bg-blue-600',
  supervisor: 'bg-amber-600',
  employee: 'bg-green-600',
};

// Role-based nav items
export const NAV_PERMISSIONS: Record<string, UserRole[]> = {
  '/': ['admin', 'hr_manager', 'supervisor', 'employee'],
  '/employees': ['admin', 'hr_manager', 'supervisor'],
  '/payroll': ['admin', 'hr_manager'],
  '/leave': ['admin', 'hr_manager', 'supervisor', 'employee'],
  '/attendance': ['admin', 'hr_manager', 'supervisor', 'employee'],
  '/performance': ['admin', 'hr_manager', 'supervisor', 'employee'],
  '/kpis': ['admin', 'hr_manager', 'supervisor'],
  '/recruitment': ['admin', 'hr_manager'],
  '/expenses': ['admin', 'hr_manager', 'supervisor', 'employee'],
  '/statutory': ['admin', 'hr_manager'],
  '/announcements': ['admin', 'hr_manager', 'supervisor', 'employee'],
  '/fleet': ['admin', 'hr_manager', 'supervisor'],
  '/documents': ['admin', 'hr_manager', 'supervisor', 'employee'],
  '/upload': ['admin', 'hr_manager'],
  '/settings': ['admin'],
};

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  canAccess: (path: string) => boolean;
  hasRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('parapet_user');
    if (stored) {
      try { return JSON.parse(stored); } catch { return null; }
    }
    return null;
  });

  const login = useCallback((email: string, password: string): boolean => {
    for (const cred of Object.values(DEMO_CREDENTIALS)) {
      if (cred.email === email && cred.password === password) {
        setUser(cred.user);
        localStorage.setItem('parapet_user', JSON.stringify(cred.user));
        return true;
      }
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('parapet_user');
  }, []);

  const canAccess = useCallback((path: string): boolean => {
    if (!user) return false;
    const allowed = NAV_PERMISSIONS[path];
    if (!allowed) return user.role === 'admin';
    return allowed.includes(user.role);
  }, [user]);

  const hasRole = useCallback((...roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, canAccess, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
