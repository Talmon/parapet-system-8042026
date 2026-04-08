import { useState } from 'react';
import { expenseClaims, ExpenseClaim, formatCurrency } from '@/data/hrData';
import { Plus, X, CheckCircle, XCircle, Pencil, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import ProcessGuide from '@/components/ProcessGuide';
import { useAuth } from '@/contexts/AuthContext';

const expenseWorkflowSteps = [
  { step: 1, title: 'Employee Incurs Business Expense', who: 'Employee', description: 'Employee incurs a work-related expense (travel, meals, supplies) and retains receipts.' },
  { step: 2, title: 'Submit Expense Claim', who: 'Employee', description: 'Employee submits a claim with category, amount, date, and attaches receipt/invoice.' },
  { step: 3, title: 'Supervisor Review', who: 'Supervisor', description: 'Direct supervisor reviews the claim for legitimacy and approves or rejects with reason.' },
  { step: 4, title: 'Finance Verification', who: 'Finance', description: 'Finance team verifies amounts, checks budget availability, and validates receipts.' },
  { step: 5, title: 'HR Manager Approval', who: 'HR Manager', description: 'HR gives final approval, especially for amounts above the standard threshold.' },
  { step: 6, title: 'Reimbursement via Payroll', who: 'Finance', description: 'Approved amounts are reimbursed via the next payroll run or direct bank transfer.' },
  { step: 7, title: 'Update Records', who: 'System', description: 'Expense records are updated, budget tracking adjusted, and reports made available.' },
];

export default function Expenses() {
  const { hasRole } = useAuth();
  const canApprove = hasRole('admin', 'hr_manager', 'supervisor');
  const [claims, setClaims] = useState<ExpenseClaim[]>(expenseClaims);
  const [showNew, setShowNew] = useState(false);
  const [editClaim, setEditClaim] = useState<ExpenseClaim | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [viewClaim, setViewClaim] = useState<ExpenseClaim | null>(null);

  const pending = claims.filter(c => c.status === 'pending');
  const pendingAmt = pending.reduce((s, c) => s + c.amount, 0);
  const approvedMtd = claims.filter(c => c.status === 'approved').reduce((s, c) => s + c.amount, 0);
  const totalMtd = claims.reduce((s, c) => s + c.amount, 0);

  const handleApprove = (id: string) => {
    setClaims(prev => prev.map(c => c.id === id ? { ...c, status: 'approved' as const } : c));
    toast.success('Expense approved');
  };
  const handleReject = (id: string) => {
    setClaims(prev => prev.map(c => c.id === id ? { ...c, status: 'rejected' as const } : c));
    toast.error('Expense rejected');
  };

  const handleNew = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newClaim: ExpenseClaim = {
      id: `EXP-${String(claims.length + 1).padStart(3, '0')}`,
      employeeName: fd.get('employee') as string,
      department: fd.get('department') as string,
      category: fd.get('category') as string,
      description: fd.get('description') as string,
      amount: parseFloat(fd.get('amount') as string),
      date: fd.get('date') as string,
      hasReceipt: true,
      status: 'pending',
    };
    setClaims(prev => [newClaim, ...prev]);
    setShowNew(false);
    toast.success('Expense claim submitted');
  };

  const handleDelete = (id: string) => {
    setClaims(prev => prev.filter(c => c.id !== id));
    setDeleteConfirm(null);
    toast.success('Expense claim deleted');
  };

  return (
    <div className="space-y-6">
      <ProcessGuide
        title="Expense Management"
        description="7-step process from expense incurrence to payroll reimbursement"
        steps={expenseWorkflowSteps}
        tips={[
          'All receipts must be attached at the time of submission.',
          'Claims above KES 50,000 require additional HOD approval.',
          'Submit claims within 30 days of incurring the expense.',
          'Per diem rates are published in the HR policy document.',
          'Rejected claims can be resubmitted with additional documentation.',
        ]}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card"><div><p className="stat-label">Pending Claims</p><p className="stat-value">{pending.length}</p></div></div>
        <div className="stat-card"><div><p className="stat-label">Pending Amount</p><p className="stat-value">{formatCurrency(pendingAmt)}</p></div></div>
        <div className="stat-card"><div><p className="stat-label">Approved (MTD)</p><p className="stat-value">{formatCurrency(approvedMtd)}</p></div></div>
        <div className="stat-card"><div><p className="stat-label">This Month Total</p><p className="stat-value">{formatCurrency(totalMtd)}</p></div></div>
      </div>

      <div className="flex justify-end">
        <button onClick={() => setShowNew(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-md border bg-card text-sm font-medium hover:bg-muted">
          <Plus size={16} /> New Claim
        </button>
      </div>

      <div className="bg-card rounded-lg border overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>Employee</th><th>Category</th><th>Description</th><th>Amount</th><th>Date</th><th>Receipt</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {claims.map(c => (
              <tr key={c.id}>
                <td><div><p className="font-medium">{c.employeeName}</p><p className="text-xs text-muted-foreground">{c.department}</p></div></td>
                <td><span className="badge-info">{c.category}</span></td>
                <td>{c.description}</td>
                <td className="font-bold">{formatCurrency(c.amount)}</td>
                <td>{c.date}</td>
                <td>{c.hasReceipt ? <CheckCircle size={16} className="text-success" /> : <XCircle size={16} className="text-muted-foreground" />}</td>
                <td><span className={c.status === 'approved' ? 'badge-active' : c.status === 'rejected' ? 'badge-rejected' : c.status === 'reimbursed' ? 'badge-info' : 'badge-pending'}>{c.status}</span></td>
                <td>
                  <div className="flex gap-1 flex-wrap">
                    <button onClick={() => setViewClaim(c)} className="text-xs px-2 py-1 rounded border hover:bg-muted inline-flex items-center gap-1"><Eye size={11}/> View</button>
                    {c.status === 'pending' && hasRole('employee') && <button onClick={() => setEditClaim(c)} className="text-xs px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 inline-flex items-center gap-1"><Pencil size={11}/> Edit</button>}
                    {c.status === 'pending' && canApprove && <button onClick={() => handleApprove(c.id)} className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 inline-flex items-center gap-1"><CheckCircle size={11}/> Approve</button>}
                    {c.status === 'pending' && canApprove && <button onClick={() => handleReject(c.id)} className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 inline-flex items-center gap-1"><XCircle size={11}/> Reject</button>}
                    {hasRole('admin', 'hr_manager') && <button onClick={() => setDeleteConfirm(c.id)} className="text-xs px-2 py-1 rounded bg-red-50 text-red-500 hover:bg-red-100 inline-flex items-center gap-1"><Trash2 size={11}/> Delete</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(showNew || editClaim) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="bg-card rounded-lg border p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{editClaim ? 'Edit Expense Claim' : 'New Expense Claim'}</h3>
              <button onClick={() => { setShowNew(false); setEditClaim(null); }}><X size={20} /></button>
            </div>
            <form onSubmit={editClaim ? (e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); setClaims(prev => prev.map(c => c.id === editClaim.id ? { ...c, employeeName: fd.get('employee') as string, category: fd.get('category') as string, amount: parseFloat(fd.get('amount') as string), description: fd.get('description') as string, date: fd.get('date') as string } : c)); setEditClaim(null); toast.success('Expense updated'); } : handleNew} className="space-y-4">
              <div><label className="text-sm font-medium">Employee</label><input name="employee" defaultValue={editClaim?.employeeName} required className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              <div><label className="text-sm font-medium">Department</label><input name="department" defaultValue={editClaim?.department} required className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium">Category</label>
                  <select name="category" defaultValue={editClaim?.category} className="w-full mt-1 px-3 py-2 rounded-md border text-sm">
                    <option>Travel</option><option>Entertainment</option><option>Training</option><option>Transport</option><option>Office Supplies</option><option>Software</option>
                  </select>
                </div>
                <div><label className="text-sm font-medium">Amount (Ksh)</label><input name="amount" type="number" defaultValue={editClaim?.amount} required className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              </div>
              <div><label className="text-sm font-medium">Description</label><input name="description" defaultValue={editClaim?.description} className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              <div><label className="text-sm font-medium">Date</label><input type="date" name="date" defaultValue={editClaim?.date} required className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              <button type="submit" className="w-full py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium">{editClaim ? 'Save Changes' : 'Submit Claim'}</button>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="bg-card rounded-lg border p-6 w-full max-w-sm text-center">
            <Trash2 size={32} className="text-destructive mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Delete Expense Claim?</h3>
            <p className="text-sm text-muted-foreground mb-4">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2 rounded-md border text-sm">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2 rounded-md bg-destructive text-destructive-foreground text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}

      {viewClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="bg-card rounded-lg border p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4"><h3 className="font-semibold">Expense Details</h3><button onClick={() => setViewClaim(null)}><X size={20}/></button></div>
            <div className="space-y-2 text-sm">
              {[['ID', viewClaim.id], ['Employee', viewClaim.employeeName], ['Department', viewClaim.department], ['Category', viewClaim.category], ['Amount', formatCurrency(viewClaim.amount)], ['Date', viewClaim.date], ['Description', viewClaim.description], ['Status', viewClaim.status], ['Receipt', viewClaim.hasReceipt ? 'Yes' : 'No']].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1 border-b last:border-0">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
