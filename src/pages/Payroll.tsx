import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { activeEmployees, permanentStaff, consultants, payrollSummary, formatCurrency } from '@/data/hrData';
import { CheckCircle, AlertCircle } from 'lucide-react';

const steps = ['Review Employees', 'Calculate Payroll', 'Approve', 'Process Payment'];

export default function Payroll() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const activeCount = activeEmployees.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Stepper */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${i <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {i + 1}
              </div>
              <span className={`text-sm hidden sm:inline ${i <= currentStep ? 'font-medium' : 'text-muted-foreground'}`}>{step}</span>
              {i < steps.length - 1 && <div className={`h-0.5 w-8 lg:w-16 ${i < currentStep ? 'bg-primary' : 'bg-muted'}`} />}
            </div>
          ))}
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} />
        </div>
      </div>

      {/* Step content */}
      <div className="bg-card rounded-lg border p-6">
        {currentStep === 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><CheckCircle size={20} /> Employee Review</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="stat-card" onClick={() => navigate('/employees')}>
                <div><p className="stat-value">{activeCount}</p><p className="text-xs text-muted-foreground">Active Employees</p></div>
              </div>
              <div className="stat-card"><div><p className="stat-value">{permanentStaff.filter(e => e.status === 'Active').length}</p><p className="text-xs text-muted-foreground">Permanent Staff</p></div></div>
              <div className="stat-card" onClick={() => navigate('/employees?type=consultant')}><div><p className="stat-value">{consultants.length}</p><p className="text-xs text-muted-foreground">Consultants</p></div></div>
              <div className="stat-card"><div><p className="stat-value">0</p><p className="text-xs text-muted-foreground">Exceptions</p></div></div>
            </div>
            <div className="p-4 rounded-md bg-success/10 flex items-center gap-2 text-sm">
              <CheckCircle size={16} className="text-success" /> All employee records verified and up to date.
            </div>
          </div>
        )}
        {currentStep === 1 && (
          <div>
            <h3 className="font-semibold text-lg mb-4">Payroll Calculation</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b"><span>Total Gross Payroll</span><span className="font-bold">{formatCurrency(payrollSummary.totalGross)}</span></div>
              <div className="flex justify-between py-2 border-b text-muted-foreground"><span>Total PAYE</span><span>- {formatCurrency(Math.round(payrollSummary.paye))}</span></div>
              <div className="flex justify-between py-2 border-b text-muted-foreground"><span>Total SHIF</span><span>- {formatCurrency(Math.round(payrollSummary.shif))}</span></div>
              <div className="flex justify-between py-2 border-b text-muted-foreground"><span>Total NSSF</span><span>- {formatCurrency(Math.round(payrollSummary.nssf))}</span></div>
              <div className="flex justify-between py-2 border-b text-muted-foreground"><span>Total Housing Levy</span><span>- {formatCurrency(Math.round(payrollSummary.housing))}</span></div>
              <div className="flex justify-between py-2 font-bold text-lg"><span>Total Net Payroll</span><span className="text-success">{formatCurrency(Math.round(payrollSummary.totalNet))}</span></div>
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div className="text-center py-8">
            <AlertCircle size={48} className="mx-auto text-warning mb-4" />
            <h3 className="font-semibold text-lg mb-2">Payroll Approval Required</h3>
            <p className="text-muted-foreground mb-4">Total net payment: {formatCurrency(Math.round(payrollSummary.totalNet))}</p>
            <p className="text-sm text-muted-foreground">By proceeding, you authorize the disbursement of April 2026 payroll.</p>
          </div>
        )}
        {currentStep === 3 && (
          <div className="text-center py-8">
            <CheckCircle size={48} className="mx-auto text-success mb-4" />
            <h3 className="font-semibold text-lg mb-2">Payment Processed Successfully</h3>
            <p className="text-muted-foreground">April 2026 payroll has been submitted for processing.</p>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button disabled={currentStep === 0} onClick={() => setCurrentStep(s => s - 1)} className="px-4 py-2 rounded-md border text-sm disabled:opacity-50 hover:bg-muted">Previous</button>
        <button
          disabled={currentStep === steps.length - 1}
          onClick={() => setCurrentStep(s => s + 1)}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          {currentStep === 2 ? 'Approve & Process' : 'Next Step'}
        </button>
      </div>
    </div>
  );
}
