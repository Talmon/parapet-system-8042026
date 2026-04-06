import { useState } from 'react';
import { expenseClaims, ExpenseClaim, formatCurrency } from '@/data/hrData';
import { Plus, X, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Expenses() {
  const [claims, setClaims] = useState<ExpenseClaim[]>(expenseClaims);
  const [showNew, setShowNew] = useState(false);

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

  return (
    <div className="space-y-6">
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
                <td>{c.status === 'pending' && (
                  <div className="flex gap-2">
                    <button onClick={() => handleApprove(c.id)} className="text-success"><CheckCircle size={18} /></button>
                    <button onClick={() => handleReject(c.id)} className="text-destructive"><XCircle size={18} /></button>
                  </div>
                )}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="bg-card rounded-lg border p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4"><h3 className="font-semibold">New Expense Claim</h3><button onClick={() => setShowNew(false)}><X size={20} /></button></div>
            <form onSubmit={handleNew} className="space-y-4">
              <div><label className="text-sm font-medium">Employee</label><input name="employee" required className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              <div><label className="text-sm font-medium">Department</label><input name="department" required className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium">Category</label>
                  <select name="category" className="w-full mt-1 px-3 py-2 rounded-md border text-sm">
                    <option>Travel</option><option>Entertainment</option><option>Training</option><option>Transport</option><option>Office Supplies</option><option>Software</option>
                  </select>
                </div>
                <div><label className="text-sm font-medium">Amount (Ksh)</label><input name="amount" type="number" required className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              </div>
              <div><label className="text-sm font-medium">Description</label><input name="description" className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              <div><label className="text-sm font-medium">Date</label><input type="date" name="date" required className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              <button type="submit" className="w-full py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium">Submit Claim</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
