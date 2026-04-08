import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, DEMO_CREDENTIALS, ROLE_LABELS, ROLE_COLORS, UserRole } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import logo from '@/assets/parapet-logo.png';
import { Eye, EyeOff, LogIn, Shield, Users, UserCog, User, ChevronRight, Zap } from 'lucide-react';

const ROLE_TABS: { role: UserRole; label: string; icon: React.FC<{ size?: number; className?: string }> ; description: string; color: string; bgColor: string }[] = [
  {
    role: 'admin',
    label: 'Admin',
    icon: Shield,
    description: 'Full system access — manage all modules, users, and settings',
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200',
  },
  {
    role: 'hr_manager',
    label: 'HR Manager',
    icon: UserCog,
    description: 'HR operations — payroll, recruitment, statutory, all employee data',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200',
  },
  {
    role: 'supervisor',
    label: 'Supervisor',
    icon: Users,
    description: 'Team management — leave approvals, attendance, team performance',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 border-amber-200',
  },
  {
    role: 'employee',
    label: 'Employee',
    icon: User,
    description: 'Self-service — my leave, attendance, performance, expenses',
    color: 'text-green-600',
    bgColor: 'bg-green-50 border-green-200',
  },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState<UserRole>('admin');
  const [email, setEmail] = useState(DEMO_CREDENTIALS.admin.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.admin.password);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleTab = (role: UserRole) => {
    setActiveRole(role);
    setEmail(DEMO_CREDENTIALS[role].email);
    setPassword(DEMO_CREDENTIALS[role].password);
    setError('');
  };

  const handleQuickLogin = (role: UserRole) => {
    const cred = DEMO_CREDENTIALS[role];
    const ok = login(cred.email, cred.password);
    if (ok) {
      toast.success(`Welcome, ${cred.user.name}!`);
      navigate('/');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const ok = login(email, password);
    setLoading(false);
    if (ok) {
      toast.success('Login successful');
      navigate('/');
    } else {
      setError('Invalid email or password. Use the credentials shown below.');
    }
  };

  const activeTab = ROLE_TABS.find(t => t.role === activeRole)!;
  const cred = DEMO_CREDENTIALS[activeRole];

  return (
    <div className="min-h-screen flex" style={{ background: 'hsl(var(--sidebar-bg))' }}>
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-10" style={{ background: 'hsl(var(--primary))' }} />
        <div className="absolute -bottom-32 -right-16 w-80 h-80 rounded-full opacity-10" style={{ background: 'hsl(var(--primary))' }} />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full opacity-5" style={{ background: 'white' }} />

        <div className="relative z-10">
          <img src={logo} alt="Parapet" className="h-14 brightness-0 invert" />
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight">
              Empowering Your<br />Workforce
            </h1>
            <p className="mt-4 text-lg opacity-80" style={{ color: 'hsl(var(--sidebar-fg))' }}>
              Parapet HRMS — the complete human resource management solution for Kenya & Uganda.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: '5,000+', sub: 'Employees Managed' },
              { label: '14', sub: 'HR Modules' },
              { label: '2', sub: 'Countries' },
              { label: '100%', sub: 'Statutory Compliant' },
            ].map(stat => (
              <div key={stat.label} className="rounded-xl p-4 border border-white/10 bg-white/5 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{stat.label}</p>
                <p className="text-xs opacity-70 mt-1" style={{ color: 'hsl(var(--sidebar-fg))' }}>{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs opacity-50" style={{ color: 'hsl(var(--sidebar-fg))' }}>
          Parapet Group · info@theparapetgroup.com · +254 722 848 277
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center">
            <img src={logo} alt="Parapet" className="h-10" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Sign in to HRMS</h2>
            <p className="text-sm text-muted-foreground mt-1">Select your role and use the credentials below</p>
          </div>

          {/* Role tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ROLE_TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.role}
                  onClick={() => handleRoleTab(tab.role)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-center transition-all ${
                    activeRole === tab.role
                      ? `${tab.bgColor} border-current ${tab.color} shadow-sm`
                      : 'border-border bg-card hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-xs font-semibold">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Role info box */}
          <div className={`rounded-xl border-2 p-4 ${activeTab.bgColor}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${activeTab.color}`}>{ROLE_LABELS[activeRole]}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{activeTab.description}</p>
              </div>
              <button
                onClick={() => handleQuickLogin(activeRole)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white shrink-0 transition-opacity hover:opacity-90 ${ROLE_COLORS[activeRole]}`}
              >
                <Zap size={12} />
                Quick Login
              </button>
            </div>
            <div className="mt-3 pt-3 border-t border-current/20 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Email: </span>
                <code className="font-mono font-medium text-foreground">{cred.email}</code>
              </div>
              <div>
                <span className="text-muted-foreground">Password: </span>
                <code className="font-mono font-medium text-foreground">{cred.password}</code>
              </div>
            </div>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full h-10 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="you@parapet.co.ke"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full h-10 px-3 pr-10 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 border border-destructive/30 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-opacity"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={16} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* All quick logins */}
          <div className="border-t pt-4">
            <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">Quick access — all roles</p>
            <div className="space-y-2">
              {ROLE_TABS.map(tab => {
                const Icon = tab.icon;
                const c = DEMO_CREDENTIALS[tab.role];
                return (
                  <button
                    key={tab.role}
                    onClick={() => handleQuickLogin(tab.role)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border bg-card hover:bg-muted transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white shrink-0 ${ROLE_COLORS[tab.role]}`}>
                        <Icon size={14} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium">{c.user.name}</p>
                        <p className="text-xs text-muted-foreground">{ROLE_LABELS[tab.role]} · {c.email}</p>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Parapet HRMS v2.0 · Demo Environment
          </p>
        </div>
      </div>
    </div>
  );
}
