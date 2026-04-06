import { useParams, useNavigate } from 'react-router-dom';
import { employees, calculateDeductions, formatCurrency } from '@/data/hrData';
import { ArrowLeft, Mail, Calendar, Building2, Briefcase } from 'lucide-react';

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const emp = employees.find(e => e.id === id);

  if (!emp) return <div className="text-center py-20 text-muted-foreground">Employee not found</div>;

  const deductions = calculateDeductions(emp.grossPay);
  const netPay = emp.grossPay - deductions.totalDeductions;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button onClick={() => navigate('/employees')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={16} /> Back to Directory
      </button>

      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold">
            {emp.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h2 className="text-xl font-bold">{emp.name}</h2>
            <p className="text-muted-foreground">{emp.jobTitle}</p>
            <span className={emp.status === 'Active' ? 'badge-active' : 'badge-pending'}>{emp.status}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 text-sm"><Mail size={14} className="text-muted-foreground" />{emp.email}</div>
          <div className="flex items-center gap-2 text-sm"><Building2 size={14} className="text-muted-foreground" />{emp.department}</div>
          <div className="flex items-center gap-2 text-sm"><Briefcase size={14} className="text-muted-foreground" />{emp.type}</div>
          <div className="flex items-center gap-2 text-sm"><Calendar size={14} className="text-muted-foreground" />Joined {emp.joinDate}</div>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h3 className="font-semibold mb-4">Compensation Breakdown</h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b"><span>Gross Pay</span><span className="font-bold">{formatCurrency(emp.grossPay)}</span></div>
          <div className="flex justify-between py-2 border-b text-muted-foreground"><span>PAYE</span><span>- {formatCurrency(Math.round(deductions.paye))}</span></div>
          <div className="flex justify-between py-2 border-b text-muted-foreground"><span>SHIF (2.75%)</span><span>- {formatCurrency(Math.round(deductions.shif))}</span></div>
          <div className="flex justify-between py-2 border-b text-muted-foreground"><span>NSSF</span><span>- {formatCurrency(Math.round(deductions.nssf))}</span></div>
          <div className="flex justify-between py-2 border-b text-muted-foreground"><span>Housing Levy (1.5%)</span><span>- {formatCurrency(Math.round(deductions.housing))}</span></div>
          <div className="flex justify-between py-2 font-bold text-lg"><span>Net Pay</span><span className="text-success">{formatCurrency(Math.round(netPay))}</span></div>
        </div>
      </div>
    </div>
  );
}
