import { useNavigate } from 'react-router-dom';
import { Users, DollarSign, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { employees, activeEmployees, onLeaveEmployees, consultants, payrollSummary, departmentHeadcount, formatCurrency } from '@/data/hrData';

const PIE_COLORS = ['#1e3a5f', '#dc2626', '#22c55e', '#f59e0b'];

const statutoryData = [
  { name: 'PAYE', value: payrollSummary.paye, pct: Math.round(payrollSummary.paye / payrollSummary.totalStatutory * 100) },
  { name: 'SHIF', value: payrollSummary.shif, pct: Math.round(payrollSummary.shif / payrollSummary.totalStatutory * 100) },
  { name: 'NSSF', value: payrollSummary.nssf, pct: Math.round(payrollSummary.nssf / payrollSummary.totalStatutory * 100) },
  { name: 'Housing', value: payrollSummary.housing, pct: Math.round(payrollSummary.housing / payrollSummary.totalStatutory * 100) },
];

const alerts = [
  { type: 'URGENT' as const, message: 'April 2026 payroll has not been processed yet', link: '/payroll' },
  { type: 'INFO' as const, message: 'KRA P10 filing deadline: 9th May 2026', link: '/statutory' },
  { type: 'INFO' as const, message: `${Math.round(employees.length * 0.0024)} employees have pending contract renewals`, link: '/employees' },
  { type: 'INFO' as const, message: 'SHIF remittance due by 9th May 2026', link: '/statutory' },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card" onClick={() => navigate('/employees')}>
          <div>
            <p className="stat-label">Total Employees</p>
            <p className="stat-value">{employees.length.toLocaleString()}</p>
            <p className="stat-sub">{activeEmployees.length.toLocaleString()} active · {onLeaveEmployees.length} on leave</p>
          </div>
          <Users size={22} className="text-muted-foreground" />
        </div>
        <div className="stat-card" onClick={() => navigate('/payroll')}>
          <div>
            <p className="stat-label">Monthly Gross Payroll</p>
            <p className="stat-value">{formatCurrency(payrollSummary.totalGross)}</p>
            <p className="stat-sub">Net: {formatCurrency(payrollSummary.totalNet)}</p>
          </div>
          <DollarSign size={22} className="text-muted-foreground" />
        </div>
        <div className="stat-card" onClick={() => navigate('/statutory')}>
          <div>
            <p className="stat-label">Statutory Obligations</p>
            <p className="stat-value">{formatCurrency(payrollSummary.totalStatutory)}</p>
            <p className="stat-sub">PAYE + SHIF + NSSF + Housing</p>
          </div>
          <TrendingUp size={22} className="text-muted-foreground" />
        </div>
        <div className="stat-card" onClick={() => navigate('/employees?type=consultant')}>
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
          Statutory Reports
        </button>
        <button onClick={() => navigate('/kpis')} className="inline-flex items-center gap-2 px-4 py-2 rounded-md border bg-card text-sm font-medium hover:bg-muted">
          <TrendingUp size={16} /> KPI Dashboard
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-card rounded-lg border p-5">
          <h3 className="font-semibold text-foreground mb-4">Headcount by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentHeadcount} onClick={(data) => {
              if (data?.activePayload?.[0]) {
                navigate(`/employees?department=${data.activePayload[0].payload.fullName}`);
              }
            }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(217, 55%, 18%)" radius={[4, 4, 0, 0]} cursor="pointer" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 bg-card rounded-lg border p-5">
          <h3 className="font-semibold text-foreground mb-4">Statutory Obligations Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statutoryData}
                cx="50%"
                cy="50%"
                outerRadius={100}
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

      {/* Alerts */}
      <div className="bg-card rounded-lg border p-5">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <AlertTriangle size={18} className="text-warning" /> Alerts & Notifications
        </h3>
        <div className="space-y-2">
          {alerts.map((alert, i) => (
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
