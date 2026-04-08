import { useNavigate } from 'react-router-dom';
import { payrollSummary, formatCurrency } from '@/data/hrData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ProcessGuide from '@/components/ProcessGuide';
import { useAuth } from '@/contexts/AuthContext';
import { Download, FileText, Plus } from 'lucide-react';

const statutoryWorkflowSteps = [
  { step: 1, title: 'Run Monthly Payroll', who: 'HR Manager', description: 'Payroll is processed and all statutory deductions (PAYE, SHIF, NSSF, Housing Levy) are computed.' },
  { step: 2, title: 'Generate Statutory Returns', who: 'System', description: 'HRMIS generates statutory return files in the required format for each authority (KRA, NSSF, SHIF).' },
  { step: 3, title: 'Review & Verify', who: 'HR Manager', description: 'Finance and HR review the statutory figures against payroll for accuracy before submission.' },
  { step: 4, title: 'Submit to Authorities', who: 'Finance', description: 'Returns are filed electronically: PAYE via KRA iTax, NSSF via NSSF portal, SHIF via SHIF portal.' },
  { step: 5, title: 'Make Payments', who: 'Finance', description: 'Payments are made via bank transfer to KRA, NSSF, and SHIF by the respective deadlines (9th of following month).' },
  { step: 6, title: 'Obtain & File Receipts', who: 'Finance', description: 'Payment receipts and filing confirmations are obtained and stored for audit purposes.' },
  { step: 7, title: 'Annual Returns (P10)', who: 'Finance', description: 'Annual P10 return filed with KRA by 9th of May for the preceding year.' },
];

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

  const { hasRole } = useAuth();
  const canManage = hasRole('admin', 'hr_manager');

  return (
    <div className="space-y-6">
      <ProcessGuide
        title="Statutory Reports"
        description="7-step compliance cycle from payroll computation to annual P10 filing"
        steps={statutoryWorkflowSteps}
        tips={[
          'PAYE, SHIF, NSSF, and Housing Levy are all due by the 9th of the following month.',
          'Annual P10 return must be filed by 9th May for the preceding tax year.',
          'Keep payment receipts for a minimum of 10 years for audit purposes.',
          'Use the KRA iTax portal for PAYE and P10 submissions.',
          'Late submissions attract penalties — set calendar reminders for all deadlines.',
        ]}
      />
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
