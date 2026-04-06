import { useState } from 'react';
import { leaveRequests, LeaveRequest } from '@/data/hrData';
import { CheckCircle, XCircle, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

const leaveTypes = ['Annual Leave', 'Sick Leave', 'Maternity Leave', 'Paternity Leave', 'Compassionate', 'Study Leave'];

export default function LeaveManagement() {
  const [requests, setRequests] = useState<LeaveRequest[]>(leaveRequests);
  const [tab, setTab] = useState<'requests' | 'balances' | 'calendar'>('requests');
  const [showNew, setShowNew] = useState(false);
  const [filterDept, setFilterDept] = useState('All Departments');
  const [filterStatus, setFilterStatus] = useState('All Status');

  const pending = requests.filter(r => r.status === 'pending');
  const approved = requests.filter(r => r.status === 'approved');
  const onLeaveToday = requests.filter(r => r.status === 'approved' && r.startDate <= '2026-04-06' && r.endDate >= '2026-04-06');

  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' as const } : r));
    toast.success('Leave request approved');
  };

  const handleReject = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' as const } : r));
    toast.error('Leave request rejected');
  };

  const handleNewRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newReq: LeaveRequest = {
      id: `LV-${String(requests.length + 1).padStart(3, '0')}`,
      employeeId: 'PAR-0001',
      employeeName: formData.get('employee') as string,
      department: formData.get('department') as string,
      leaveType: formData.get('leaveType') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      days: Math.ceil((new Date(formData.get('endDate') as string).getTime() - new Date(formData.get('startDate') as string).getTime()) / 86400000) + 1,
      status: 'pending',
    };
    setRequests(prev => [newReq, ...prev]);
    setShowNew(false);
    toast.success('Leave request submitted');
  };

  const filtered = requests.filter(r => {
    const matchDept = filterDept === 'All Departments' || r.department === filterDept;
    const matchStatus = filterStatus === 'All Status' || r.status === filterStatus.toLowerCase();
    return matchDept && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card"><div><p className="stat-label">Pending Requests</p><p className="stat-value">{pending.length}</p></div></div>
        <div className="stat-card"><div><p className="stat-label">Approved This Month</p><p className="stat-value">{approved.length}</p></div></div>
        <div className="stat-card"><div><p className="stat-label">On Leave Today</p><p className="stat-value">{onLeaveToday.length}</p></div></div>
        <div className="stat-card"><div><p className="stat-label">Leave Types</p><p className="stat-value">{leaveTypes.length}</p></div></div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-1 border-b">
          {(['requests', 'balances', 'calendar'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 ${tab === t ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
              {t === 'requests' ? 'Leave Requests' : t === 'balances' ? 'Leave Balances' : 'Calendar'}
            </button>
          ))}
        </div>
        <button onClick={() => setShowNew(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-md border bg-card text-sm font-medium hover:bg-muted">
          <Plus size={16} /> New Request
        </button>
      </div>

      {tab === 'requests' && (
        <>
          <div className="flex gap-3">
            <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="px-3 py-2 rounded-md border bg-card text-sm">
              <option>All Departments</option>
              {['Engineering', 'Sales', 'Finance', 'Operations', 'Human Resources', 'IT', 'Marketing'].map(d => <option key={d}>{d}</option>)}
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 rounded-md border bg-card text-sm">
              <option>All Status</option>
              <option>Pending</option><option>Approved</option><option>Rejected</option>
            </select>
          </div>
          <div className="bg-card rounded-lg border overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Employee</th><th>Department</th><th>Leave Type</th><th>Period</th><th className="text-center">Days</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id}>
                    <td><div><p className="font-medium">{r.employeeName}</p><p className="text-xs text-muted-foreground">{r.employeeId}</p></div></td>
                    <td>{r.department}</td>
                    <td>{r.leaveType}</td>
                    <td className="text-sm">{r.startDate} → {r.endDate}</td>
                    <td className="text-center font-bold">{r.days}</td>
                    <td><span className={r.status === 'approved' ? 'badge-active' : r.status === 'rejected' ? 'badge-rejected' : 'badge-pending'}>{r.status}</span></td>
                    <td>
                      {r.status === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleApprove(r.id)} className="text-success hover:opacity-70"><CheckCircle size={18} /></button>
                          <button onClick={() => handleReject(r.id)} className="text-destructive hover:opacity-70"><XCircle size={18} /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'balances' && (
        <div className="bg-card rounded-lg border p-6">
          <p className="text-muted-foreground">Leave balance summary for all employees. Each employee is entitled to 21 days annual leave, 10 sick days, and statutory maternity/paternity leave.</p>
        </div>
      )}

      {tab === 'calendar' && (
        <div className="bg-card rounded-lg border p-6">
          <p className="text-muted-foreground">Calendar view of upcoming and current leave schedules.</p>
        </div>
      )}

      {/* New request modal */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="bg-card rounded-lg border p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">New Leave Request</h3>
              <button onClick={() => setShowNew(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleNewRequest} className="space-y-4">
              <div><label className="text-sm font-medium">Employee Name</label><input name="employee" required className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              <div><label className="text-sm font-medium">Department</label><input name="department" required className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              <div><label className="text-sm font-medium">Leave Type</label>
                <select name="leaveType" className="w-full mt-1 px-3 py-2 rounded-md border text-sm">
                  {leaveTypes.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium">Start Date</label><input type="date" name="startDate" required className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
                <div><label className="text-sm font-medium">End Date</label><input type="date" name="endDate" required className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              </div>
              <button type="submit" className="w-full py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium">Submit Request</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
