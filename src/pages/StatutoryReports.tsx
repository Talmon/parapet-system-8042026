import { useNavigate } from 'react-router-dom';
import { payrollSummary, formatCurrency } from '@/data/hrData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
const trendData = months.map((m, i) => {
  const factor = 0.92 + i * 0.016;
  return {
    month: m,
    PAYE: Math.round(payrollSummary.paye * factor),
    SHIF: Math.round(payrollSummary.shif * factor),
    NSSF: Math.round(payrollSummary.nssf * factor),
    Housing: Math.round(payrollSummary.housing * factor),
  };
});

export default function StatutoryReports() {
  const navigate = useNavigate();

  const cards = [
    { label: 'KRA PAYE (P10)', value: payrollSummary.paye, sub: 'Pay As You Earn tax remittance', due: 'Due: 9th May 2026' },
    { label: 'SHIF Contribution', value: payrollSummary.shif, sub: '2.75% employee + 2.75% employer', due: 'Due: 9th May 2026' },
    { label: 'NSSF Contribution', value: payrollSummary.nssf, sub: 'Tier I + Tier II (6% each side)', due: 'Due: 9th May 2026' },
    { label: 'Housing Levy', value: payrollSummary.housing, sub: '1.5% employee + 1.5% employer', due: 'Due: 9th May 2026' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <div key={i} className="stat-card" onClick={() => navigate('/payroll')}>
            <div className="flex-1">
              <p className="stat-label">{c.label}</p>
              <p className="stat-value">{formatCurrency(Math.round(c.value))}</p>
              <p className="stat-sub">{c.sub}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-muted-foreground">{c.due}</span>
                <span className="badge-pending">Pending</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-lg border p-5">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="stat-label">Total Statutory Obligations — April 2026</p>
            <p className="text-3xl font-bold mt-1">{formatCurrency(Math.round(payrollSummary.totalStatutory))}</p>
          </div>
          <span className="badge-rejected font-bold">Due 9th May</span>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-5">
        <h3 className="font-semibold mb-4">6-Month Statutory Obligations Trend</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={v => `${(v / 1000000).toFixed(0)}M`} />
            <Tooltip formatter={(v: number) => formatCurrency(v)} />
            <Legend />
            <Bar dataKey="PAYE" fill="#1e3a5f" />
            <Bar dataKey="SHIF" fill="#dc2626" />
            <Bar dataKey="NSSF" fill="#22c55e" />
            <Bar dataKey="Housing" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
