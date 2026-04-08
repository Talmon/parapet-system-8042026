import { useNavigate } from 'react-router-dom';
import { Users, DollarSign, TrendingUp, AlertTriangle, ArrowRight, Calendar, Clock, Target, Receipt, Bell, CheckCircle, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { employees, activeEmployees, onLeaveEmployees, consultants, payrollSummary, departmentHeadcount, formatCurrency } from '@/data/hrData';
import { useAuth } from '@/contexts/AuthContext';
import ProcessGuide from '@/components/ProcessGuide';

const PIE_COLORS = ['#1e3a5f', '#dc2626', '#22c55e', '#f59e0b'];

const statutoryData = [
  { name: 'PAYE', value: payrollSummary.paye, pct: Math.round(payrollSummary.paye / payrollSummary.totalStatutory * 100) },
  { name: 'SHIF', value: payrollSummary.shif, pct: Math.round(payrollSummary.shif / payrollSummary.totalStatutory * 100) },
  { name: 'NSSF', value: payrollSummary.nssf, pct: Math.round(payrollSummary.nssf / payrollSummary.totalStatutory * 100) },
  { name: 'Housing', value: payrollSummary.housing, pct: Math.round(payrollSummary.housing / payrollSummary.totalStatutory * 100) },
];

const monthlyTrend = [
  { month: 'Oct', gross: 185000000 },
  { month: 'Nov', gross: 187000000 },
  { month: 'Dec', gross: 192000000 },
  { month: 'Jan', gross: 189000000 },
  { month: 'Feb', gross: 191000000 },
  { month: 'Mar', gross: 193000000 },
  { month: 'Apr', gross: payrollSummary.totalGross },
];

const adminAlerts = [
  { type: 'URGENT' as const, message: 'April 2026 payroll has not been processed yet', link: '/payroll' },
  { type: 'INFO' as const, message: 'KRA P10 filing deadline: 9th May 2026', link: '/statutory' },
  { type: 'INFO' as const, message: `${Math.round(employees.length * 0.0024)} employees have pending contract renewals`, link: '/employees' },
  { type: 'INFO' as const, message: 'SHIF remittance due by 9th May 2026', link: '/statutory' },
];

const supervisorAlerts = [
  { type: 'URGENT' as const, message: '3 leave requests pending your approval', link: '/leave' },
  { type: 'INFO' as const, message: '12 team members marked present today', link: '/attendance' },
  { type: 'INFO' as const, message: 'Q1 2026 performance reviews due this week', link: '/performance' },
];

const employeeAlerts = [
  { type: 'INFO' as const, message: 'Your leave balance: 15 days remaining', link: '/leave' },
  { type: 'INFO' as const, message: 'April payslip available', link: '/payroll' },
  { type: 'INFO' as const, message: 'Q1 self-assessment form due by 15 Apr', link: '/performance' },
];

// Simulated "my" data for employee view
const myLeaveBalance = [
  { type: 'Annual Leave', total: 21, used: 6, remaining: 15 },
  { type: 'Sick Leave', total: 10, used: 2, remaining: 8 },
  { type: 'Compassionate', total: 3, used: 0, remaining: 3 },
];

const myRecentActivity = [
  { date: '2026-04-07', action: 'Attendance marked — Present', icon: Clock, color: 'text-green-600' },
  { date: '2026-04-04', action: 'Expense claim EXP-034 submitted', icon: Receipt, color: 'text-blue-600' },
  { date: '2026-04-01', action: 'March payslip generated', icon: DollarSign, color: 'text-primary' },
  { date: '2026-03-28', action: 'Leave request LV-021 approved', icon: CheckCircle, color: 'text-green-600' },
];

const teamAttendance = [
  { name: 'Mon', present: 11, absent: 1, leave: 1 },
  { name: 'Tue', present: 12, absent: 0, leave: 1 },
  { name: 'Wed', present: 10, absent: 2, leave: 1 },
  { name: 'Thu', present: 12, absent: 1, leave: 0 },
  { name: 'Fri', present: 11, absent: 0, leave: 2 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();

  if (!user) return null;

  // Employee self-service dashboard
  if (user.role === 'employee') {
    return (
      <div className="space-y-6">
        {/* Welcome banner */}
        <div className="rounded-xl bg-gradient-to-r from-primary to-primary/80 text-white p-6">
          <h2 className="text-xl font-bold">Good morning, {user.name.split(' ')[0]} 👋</h2>
          <p className="text-sm opacity-80 mt-1">{user.jobTitle} · {user.department} · {user.employeeId}</p>
          <p className="text-xs opacity-60 mt-1">Tuesday, 8 April 2026</p>
        </div>

        {/* My quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card cursor-pointer" onClick={() => navigate('/leave')}>
            <div>
              <p className="stat-label">Leave Balance</p>
              <p className="stat-value">15</p>
              <p className="stat-sub">Annual days remaining</p>
            </div>
            <Calendar size={22} className="text-muted-foreground" />
          </div>
          <div className="stat-card cursor-pointer" onClick={() => navigate('/attendance')}>
            <div>
              <p className="stat-label">This Month</p>
              <p className="stat-value">18/18</p>
              <p className="stat-sub">Days present</p>
            </div>
            <Clock size={22} className="text-muted-foreground" />
          </div>
          <div className="stat-card cursor-pointer" onClick={() => navigate('/performance')}>
            <div>
              <p className="stat-label">Performance Score</p>
              <p className="stat-value">82%</p>
              <p className="stat-sub">Q1 2026</p>
            </div>
            <Target size={22} className="text-muted-foreground" />
          </div>
          <div className="stat-card cursor-pointer" onClick={() => navigate('/expenses')}>
            <div>
              <p className="stat-label">Pending Claims</p>
              <p className="stat-value">2</p>
              <p className="stat-sub">Awaiting approval</p>
            </div>
            <Receipt size={22} className="text-muted-foreground" />
          </div>
        </div>

        {/* My leave balances */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl border p-5">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar size={16} className="text-primary" /> My Leave Balances
            </h3>
            <div className="space-y-3">
              {myLeaveBalance.map(l => (
                <div key={l.type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{l.type}</span>
                    <span className="text-muted-foreground">{l.remaining}/{l.total} remaining</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(l.remaining / l.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/leave')}
              className="mt-4 w-full text-sm text-primary font-medium flex items-center justify-center gap-1 hover:underline"
            >
              Request Leave <ArrowRight size={14} />
            </button>
          </div>

          {/* My recent activity */}
          <div className="bg-card rounded-xl border p-5">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Bell size={16} className="text-primary" /> Recent Activity
            </h3>
            <div className="space-y-3">
              {myRecentActivity.map((a, i) => {
                const Icon = a.icon;
                return (
                  <div key={i} className="flex items-start gap-3 py-2 border-b last:border-0">
                    <div className={`h-7 w-7 rounded-full bg-muted flex items-center justify-center shrink-0 ${a.color}`}>
                      <Icon size={13} />
                    </div>
                    <div>
                      <p className="text-sm">{a.action}</p>
                      <p className="text-xs text-muted-foreground">{a.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-card rounded-xl border p-5">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-warning" /> My Alerts
          </h3>
          <div className="space-y-2">
            {employeeAlerts.map((alert, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 px-4 rounded-md hover:bg-muted cursor-pointer"
                onClick={() => navigate(alert.link)}
              >
                <div className="flex items-center gap-3">
                  <span className={alert.type === 'URGENT' ? 'badge-rejected font-bold' : 'badge-info font-medium'}>
                    {alert.type}
                  </span>
                  <span className="text-sm">{alert.message}</span>
                </div>
                <ArrowRight size={16} className="text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Supervisor dashboard
  if (user.role === 'supervisor') {
    return (
      <div className="space-y-6">
        <div className="rounded-xl bg-gradient-to-r from-amber-700 to-amber-600 text-white p-6">
          <h2 className="text-xl font-bold">Good morning, {user.name.split(' ')[0]} 👋</h2>
          <p className="text-sm opacity-80 mt-1">{user.jobTitle} · {user.department}</p>
          <p className="text-xs opacity-60 mt-1">Tuesday, 8 April 2026</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card cursor-pointer" onClick={() => navigate('/employees')}>
            <div>
              <p className="stat-label">Team Size</p>
              <p className="stat-value">13</p>
              <p className="stat-sub">Direct reports</p>
            </div>
            <Users size={22} className="text-muted-foreground" />
          </div>
          <div className="stat-card cursor-pointer" onClick={() => navigate('/attendance')}>
            <div>
              <p className="stat-label">Present Today</p>
              <p className="stat-value">11</p>
              <p className="stat-sub">2 absent, 0 on leave</p>
            </div>
            <Clock size={22} className="text-muted-foreground" />
          </div>
          <div className="stat-card cursor-pointer" onClick={() => navigate('/leave')}>
            <div>
              <p className="stat-label">Pending Approvals</p>
              <p className="stat-value">3</p>
              <p className="stat-sub">Leave requests</p>
            </div>
            <Calendar size={22} className="text-muted-foreground" />
          </div>
          <div className="stat-card cursor-pointer" onClick={() => navigate('/performance')}>
            <div>
              <p className="stat-label">Reviews Pending</p>
              <p className="stat-value">7</p>
              <p className="stat-sub">Q1 evaluations</p>
            </div>
            <Target size={22} className="text-muted-foreground" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl border p-5">
            <h3 className="font-semibold text-foreground mb-4">Team Attendance (This Week)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={teamAttendance}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="present" fill="#22c55e" radius={[4, 4, 0, 0]} name="Present" />
                <Bar dataKey="absent" fill="#dc2626" radius={[4, 4, 0, 0]} name="Absent" />
                <Bar dataKey="leave" fill="#f59e0b" radius={[4, 4, 0, 0]} name="On Leave" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-xl border p-5">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle size={18} className="text-warning" /> Pending Actions
            </h3>
            <div className="space-y-2">
              {supervisorAlerts.map((alert, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 px-4 rounded-md hover:bg-muted cursor-pointer"
                  onClick={() => navigate(alert.link)}
                >
                  <div className="flex items-center gap-3">
                    <span className={alert.type === 'URGENT' ? 'badge-rejected font-bold' : 'badge-info font-medium'}>
                      {alert.type}
                    </span>
                    <span className="text-sm">{alert.message}</span>
                  </div>
                  <ArrowRight size={16} className="text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin / HR Manager dashboard (full view)
  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card cursor-pointer" onClick={() => navigate('/employees')}>
          <div>
            <p className="stat-label">Total Employees</p>
            <p className="stat-value">{employees.length.toLocaleString()}</p>
            <p className="stat-sub">{activeEmployees.length.toLocaleString()} active · {onLeaveEmployees.length} on leave</p>
          </div>
          <Users size={22} className="text-muted-foreground" />
        </div>
        <div className="stat-card cursor-pointer" onClick={() => navigate('/payroll')}>
          <div>
            <p className="stat-label">Monthly Gross Payroll</p>
            <p className="stat-value">{formatCurrency(payrollSummary.totalGross)}</p>
            <p className="stat-sub">Net: {formatCurrency(payrollSummary.totalNet)}</p>
          </div>
          <DollarSign size={22} className="text-muted-foreground" />
        </div>
        <div className="stat-card cursor-pointer" onClick={() => navigate('/statutory')}>
          <div>
            <p className="stat-label">Statutory Obligations</p>
            <p className="stat-value">{formatCurrency(payrollSummary.totalStatutory)}</p>
            <p className="stat-sub">PAYE + SHIF + NSSF + Housing</p>
          </div>
          <TrendingUp size={22} className="text-muted-foreground" />
        </div>
        <div className="stat-card cursor-pointer" onClick={() => navigate('/employees?type=consultant')}>
          <div>
            <p className="stat-label">Consultants</p>
            <p className="stat-value">{consultants.length}</p>
            <p className="stat-sub">5% WHT applicable</p>
          </div>
          <AlertTriangle size={22} className="text-muted-foreground" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <button onClick={() => navigate('/payroll')} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90">
          <DollarSign size={16} /> Run Payroll
        </button>
        <button onClick={() => navigate('/employees')} className="inline-flex items-center gap-2 px-4 py-2 rounded-md border bg-card text-sm font-medium hover:bg-muted">
          <Users size={16} /> View Directory
        </button>
        <button onClick={() => navigate('/statutory')} className="inline-flex items-center gap-2 px-4 py-2 rounded-md border bg-card text-sm font-medium hover:bg-muted">
          <FileText size={16} /> Statutory Reports
        </button>
        <button onClick={() => navigate('/kpis')} className="inline-flex items-center gap-2 px-4 py-2 rounded-md border bg-card text-sm font-medium hover:bg-muted">
          <TrendingUp size={16} /> KPI Dashboard
        </button>
        <button onClick={() => navigate('/recruitment')} className="inline-flex items-center gap-2 px-4 py-2 rounded-md border bg-card text-sm font-medium hover:bg-muted">
          Add Employee
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-card rounded-lg border p-5">
          <h3 className="font-semibold text-foreground mb-4">Headcount by Department</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={departmentHeadcount} onClick={(data) => {
              if (data?.activePayload?.[0]) {
                navigate(`/employees?department=${data.activePayload[0].payload.fullName}`);
              }
            }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(217, 55%, 18%)" radius={[4, 4, 0, 0]} cursor="pointer" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 bg-card rounded-lg border p-5">
          <h3 className="font-semibold text-foreground mb-4">Statutory Breakdown</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statutoryData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                label={({ name, pct }) => `${name} ${pct}%`}
                cursor="pointer"
                onClick={() => navigate('/statutory')}
              >
                {statutoryData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payroll trend */}
      <div className="bg-card rounded-lg border p-5">
        <h3 className="font-semibold text-foreground mb-4">Payroll Trend (Last 7 Months)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `${(v / 1000000).toFixed(0)}M`} />
            <Tooltip formatter={(v: number) => formatCurrency(v)} />
            <Line type="monotone" dataKey="gross" stroke="hsl(217, 55%, 18%)" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Alerts */}
      <div className="bg-card rounded-lg border p-5">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <AlertTriangle size={18} className="text-warning" /> Alerts & Notifications
        </h3>
        <div className="space-y-2">
          {adminAlerts.map((alert, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 px-4 rounded-md hover:bg-muted cursor-pointer"
              onClick={() => navigate(alert.link)}
            >
              <div className="flex items-center gap-3">
                <span className={alert.type === 'URGENT' ? 'badge-rejected font-bold' : 'badge-info font-medium'}>
                  {alert.type}
                </span>
                <span className="text-sm">{alert.message}</span>
              </div>
              <ArrowRight size={16} className="text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
