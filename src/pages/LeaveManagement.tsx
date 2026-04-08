import { useState } from 'react';
import {
  initialLeaveRequests, leaveBalances, leaveTypes, annualLeaveSchedules,
  type LeaveRequest, type LeaveApprovalStage
} from '@/data/leaveData';
import { CheckCircle, XCircle, Plus, X, Calendar, Clock, Users, AlertTriangle, RotateCcw, FileText, ArrowRight, Pencil, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import ProcessGuide from '@/components/ProcessGuide';
import { useAuth } from '@/contexts/AuthContext';

const leaveWorkflowSteps = [
  { step: 1, title: 'Prepare Annual Leave Schedule', who: 'Employee', description: 'At the start of the financial year, employees plan and submit their annual leave schedule for the year.', tip: 'Submit schedules early so team planning can happen without conflicts.' },
  { step: 2, title: 'Submit Leave Request', who: 'Employee', description: 'Employee submits a specific leave request with dates, reason, reliever, and handover notes.' },
  { step: 3, title: 'Supervisor Review & Approval', who: 'Supervisor', description: 'Immediate supervisor reviews the request, checks team coverage, and approves or rejects.', tip: 'Supervisor must ensure a reliever is confirmed before approving.' },
  { step: 4, title: 'HRBP Review', who: 'HRBP', description: 'HR Business Partner reviews leave allowance entitlement, policy compliance, and confirms the request.' },
  { step: 5, title: 'HR Head Final Approval', who: 'HR Head', description: 'Group Head of HR gives the final green light, especially for long or unusual leave durations.' },
  { step: 6, title: 'Process Leave Allowance', who: 'HR Manager', description: 'HR processes any applicable leave allowance payment and updates payroll records.' },
  { step: 7, title: 'Employee Handover & Goes on Leave', who: 'Employee', description: 'Employee completes handover with reliever and officially starts leave.' },
  { step: 8, title: 'Recall (If Needed)', who: 'Supervisor', description: 'If operational demands require it, supervisor can recall the employee from leave with a documented reason.', branch: { condition: 'Recall needed', yes: 'Employee returns, remaining days preserved', no: 'Leave continues to planned end date' } },
  { step: 9, title: 'Update Records & Analytics', who: 'System', description: 'Leave balances are updated, records finalized, and reports generated for HR analytics.' },
];

const stageLabels: Record<LeaveApprovalStage, string> = {
  submitted: 'Submitted', supervisor_approved: 'Supervisor Approved', hrbp_reviewed: 'HRBP Reviewed',
  hr_head_approved: 'HR Head Approved', approved: 'Approved', rejected: 'Rejected', cancelled: 'Cancelled',
};
const stageOrder: LeaveApprovalStage[] = ['submitted', 'supervisor_approved', 'hrbp_reviewed', 'hr_head_approved', 'approved'];
const stageIdx = (s: LeaveApprovalStage) => stageOrder.indexOf(s);

export default function LeaveManagement() {
  const { hasRole, user } = useAuth();
  const canManage = hasRole('admin', 'hr_manager', 'supervisor');
  const canApprove = hasRole('admin', 'hr_manager', 'supervisor');
  const isEmployee = hasRole('employee');
  const [tab, setTab] = useState<'requests' | 'balances' | 'schedule' | 'types'>('requests');
  const [requests, setRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [showNew, setShowNew] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [showRecall, setShowRecall] = useState<LeaveRequest | null>(null);
  const [recallReason, setRecallReason] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [filterStage, setFilterStage] = useState('All');

  const pending = requests.filter(r => !['approved', 'rejected', 'cancelled'].includes(r.stage));
  const approved = requests.filter(r => r.stage === 'approved');
  const onLeaveToday = approved.filter(r => r.startDate <= '2026-04-08' && r.endDate >= '2026-04-08');
  const recalled = requests.filter(r => r.recalled);

  const advanceRequest = (id: string) => {
    setRequests(prev => prev.map(r => {
      if (r.id !== id) return r;
      const idx = stageIdx(r.stage);
      if (idx < 0 || idx >= stageOrder.length - 1) return r;
      const nextStage = stageOrder[idx + 1];
      const updates: Partial<LeaveRequest> = { stage: nextStage };
      if (nextStage === 'supervisor_approved') { updates.supervisorApproved = true; updates.supervisorDate = '2026-04-08'; }
      if (nextStage === 'hrbp_reviewed') { updates.hrbpReviewed = true; updates.hrbpDate = '2026-04-08'; }
      if (nextStage === 'hr_head_approved') { updates.hrHeadApproved = true; updates.hrHeadDate = '2026-04-08'; }
      if (nextStage === 'approved') { updates.leaveAllowanceProcessed = true; }
      return { ...r, ...updates };
    }));
    toast.success('Leave request advanced');
    setSelectedRequest(null);
  };

  const rejectRequest = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, stage: 'rejected' as const } : r));
    toast.error('Leave request rejected');
    setSelectedRequest(null);
  };

  const recallEmployee = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, recalled: true, recallDate: '2026-04-08', recallReason } : r));
    setShowRecall(null); setRecallReason('');
    toast.success('Employee recalled from leave');
  };

  const handleNewRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const startDate = fd.get('startDate') as string;
    const endDate = fd.get('endDate') as string;
    const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000) + 1;
    const newReq: LeaveRequest = {
      id: `LV-${String(requests.length + 1).padStart(3, '0')}`,
      employeeId: 'PAR-0001', employeeName: fd.get('employee') as string, department: fd.get('department') as string,
      leaveType: fd.get('leaveType') as string, startDate, endDate, days,
      reason: fd.get('reason') as string, stage: 'submitted',
      supervisorName: fd.get('supervisor') as string, supervisorApproved: null, supervisorDate: null,
      hrbpName: 'Jane Wanjiku', hrbpReviewed: null, hrbpDate: null,
      hrHeadApproved: null, hrHeadDate: null,
      relieverName: fd.get('reliever') as string || null, relieverAccepted: null,
      handoverNotes: fd.get('handover') as string, leaveAllowanceProcessed: false,
      recalled: false, recallDate: null, recallReason: '',
      createdDate: new Date().toISOString().split('T')[0],
    };
    setRequests(prev => [newReq, ...prev]); setShowNew(false);
    toast.success('Leave request submitted');
  };

  const filtered = requests.filter(r => {
    const md = filterDept === 'All' || r.department === filterDept;
    const ms = filterStage === 'All' || r.stage === filterStage;
    return md && ms;
  });

  const tabs = [
    { key: 'requests' as const, label: 'Leave Requests', icon: FileText },
    { key: 'balances' as const, label: 'Leave Balances', icon: Calendar },
    { key: 'schedule' as const, label: 'Annual Schedule', icon: Calendar },
    { key: 'types' as const, label: 'Leave Types', icon: Clock },
  ];

  return (
    <div className="space-y-6">
      {/* Process Guide */}
      <ProcessGuide
        title="Leave Management"
        description="Full 9-step workflow from leave planning to return and record update"
        steps={leaveWorkflowSteps}
        tips={[
          'Annual leave schedules should be submitted in the first week of the financial year.',
          'Leave requests must be submitted at least 7 days in advance for planned leave.',
          'Supervisor must confirm reliever before approving any leave.',
          'Sick leave beyond 3 days requires a medical certificate.',
          'Recalled employees have their remaining leave days preserved for future use.',
        ]}
      />
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card"><div><p className="stat-label">Pending Approvals</p><p className="stat-value">{pending.length}</p></div><Clock size={22} className="text-amber-500" /></div>
        <div className="stat-card"><div><p className="stat-label">Approved</p><p className="stat-value">{approved.length}</p></div><CheckCircle size={22} className="text-green-600" /></div>
        <div className="stat-card"><div><p className="stat-label">On Leave Today</p><p className="stat-value">{onLeaveToday.length}</p></div><Users size={22} className="text-blue-600" /></div>
        <div className="stat-card"><div><p className="stat-label">Recalled</p><p className="stat-value">{recalled.length}</p></div><RotateCcw size={22} className="text-red-500" /></div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1 border-b overflow-x-auto">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`px-3 py-2 text-sm font-medium border-b-2 whitespace-nowrap inline-flex items-center gap-1.5 ${tab === t.key ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground'}`}>
              <t.icon size={14} />{t.label}
            </button>
          ))}
        </div>
        <button onClick={() => setShowNew(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium"><Plus size={16} /> New Request</button>
      </div>

      {/* LEAVE REQUESTS */}
      {tab === 'requests' && (
        <>
          <div className="flex gap-3">
            <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="px-3 py-2 rounded-md border bg-card text-sm">
              <option value="All">All Departments</option>
              {['Engineering', 'Sales', 'Finance', 'Operations', 'Human Resources', 'IT', 'Marketing', 'Customer Support'].map(d => <option key={d}>{d}</option>)}
            </select>
            <select value={filterStage} onChange={e => setFilterStage(e.target.value)} className="px-3 py-2 rounded-md border bg-card text-sm">
              <option value="All">All Stages</option>
              {Object.entries(stageLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="bg-card rounded-lg border overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Employee</th><th>Leave Type</th><th>Period</th><th>Days</th><th>Approval Flow</th><th>Reliever</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className={r.recalled ? 'bg-red-50/50' : ''}>
                    <td><div><p className="font-medium">{r.employeeName}</p><p className="text-xs text-muted-foreground">{r.department} · {r.id}</p></div></td>
                    <td><span className="badge-info">{r.leaveType}</span></td>
                    <td className="text-sm">{r.startDate} → {r.endDate}</td>
                    <td className="text-center font-bold">{r.days}</td>
                    <td>
                      <div className="flex gap-0.5">
                        {stageOrder.map((s, i) => (
                          <div key={s} className={`h-1.5 w-5 rounded-full ${r.stage === 'rejected' ? (i === 0 ? 'bg-red-400' : 'bg-muted') : i <= stageIdx(r.stage) ? 'bg-green-500' : 'bg-muted'}`} title={stageLabels[s]} />
                        ))}
                      </div>
                      <span className="text-[10px] text-muted-foreground">{stageLabels[r.stage]}</span>
                    </td>
                    <td className="text-sm">{r.relieverName || '—'}{r.relieverAccepted === true && <CheckCircle size={12} className="inline ml-1 text-green-500" />}</td>
                    <td>
                      {r.recalled ? <span className="badge-rejected inline-flex items-center gap-1"><RotateCcw size={10} /> Recalled</span> : <span className={r.stage === 'approved' ? 'badge-active' : r.stage === 'rejected' ? 'badge-rejected' : 'badge-pending'}>{stageLabels[r.stage]}</span>}
                    </td>
                    <td>
                      <div className="flex gap-1 flex-wrap">
                        <button onClick={() => setSelectedRequest(r)} className="text-xs px-2 py-1 rounded border hover:bg-muted inline-flex items-center gap-1"><Eye size={11} /> View</button>
                        {canManage && r.stage === 'submitted' && (
                          <button onClick={() => setSelectedRequest(r)} className="text-xs px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 inline-flex items-center gap-1"><Pencil size={11} /> Edit</button>
                        )}
                        {canApprove && !['approved', 'rejected', 'cancelled'].includes(r.stage) && (
                          <button onClick={() => advanceRequest(r.id)} className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 inline-flex items-center gap-1"><ArrowRight size={11} /> Advance</button>
                        )}
                        {canApprove && !['approved', 'rejected', 'cancelled'].includes(r.stage) && (
                          <button onClick={() => rejectRequest(r.id)} className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 inline-flex items-center gap-1"><XCircle size={11} /> Reject</button>
                        )}
                        {canManage && r.stage === 'approved' && !r.recalled && (
                          <button onClick={() => setShowRecall(r)} className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-700 hover:bg-amber-200 inline-flex items-center gap-1"><RotateCcw size={11} /> Recall</button>
                        )}
                        {hasRole('admin', 'hr_manager') && ['rejected', 'cancelled'].includes(r.stage) && (
                          <button onClick={() => { setRequests(prev => prev.filter(x => x.id !== r.id)); toast.success('Request deleted'); }} className="text-xs px-2 py-1 rounded bg-red-50 text-red-500 hover:bg-red-100 inline-flex items-center gap-1"><Trash2 size={11} /> Delete</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* LEAVE BALANCES */}
      {tab === 'balances' && (
        <div className="bg-card rounded-lg border overflow-x-auto">
          <div className="p-4 border-b"><h3 className="font-semibold">Employee Leave Balances — FY 2026</h3></div>
          <table className="data-table">
            <thead><tr><th>Employee</th><th>Department</th><th>Leave Type</th><th>Entitled</th><th>Taken</th><th>Pending</th><th>Available</th><th>Usage</th></tr></thead>
            <tbody>
              {leaveBalances.flatMap(lb =>
                Object.entries(lb.balances).map(([type, bal]) => (
                  <tr key={`${lb.employeeId}-${type}`}>
                    <td className="font-medium">{lb.employeeName}</td>
                    <td>{lb.department}</td>
                    <td><span className="badge-info">{type}</span></td>
                    <td>{bal.entitled}</td>
                    <td className="font-medium">{bal.taken}</td>
                    <td className="text-amber-600">{bal.pending}</td>
                    <td className="font-bold text-green-600">{bal.available}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${((bal.taken + bal.pending) / bal.entitled) > 0.8 ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${Math.min(100, ((bal.taken + bal.pending) / bal.entitled) * 100)}%` }} />
                        </div>
                        <span className="text-xs">{Math.round(((bal.taken + bal.pending) / bal.entitled) * 100)}%</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ANNUAL SCHEDULE */}
      {tab === 'schedule' && (
        <div className="bg-card rounded-lg border overflow-x-auto">
          <div className="p-4 border-b"><h3 className="font-semibold">Annual Leave Schedule — FY 2026</h3></div>
          <table className="data-table">
            <thead><tr><th>Employee</th><th>Department</th><th>Q1 (Jan-Mar)</th><th>Q2 (Apr-Jun)</th><th>Q3 (Jul-Sep)</th><th>Q4 (Oct-Dec)</th><th>Total Planned</th><th>Status</th></tr></thead>
            <tbody>
              {annualLeaveSchedules.map(s => (
                <tr key={s.id}>
                  <td className="font-medium">{s.employeeName}</td>
                  <td>{s.department}</td>
                  {[s.q1, s.q2, s.q3, s.q4].map((q, i) => (
                    <td key={i}>{q ? <div className="text-xs"><p className="font-medium">{q.days}d</p><p className="text-muted-foreground">{q.start} → {q.end}</p></div> : <span className="text-muted-foreground">—</span>}</td>
                  ))}
                  <td className="font-bold">{s.totalPlanned}d</td>
                  <td><span className={s.status === 'approved' ? 'badge-active' : s.status === 'submitted' ? 'badge-pending' : 'badge-info'}>{s.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* LEAVE TYPES */}
      {tab === 'types' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {leaveTypes.map(lt => (
            <div key={lt.id} className="bg-card rounded-lg border p-5">
              <h4 className="font-semibold mb-2">{lt.name}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Entitlement</span><span className="font-medium">{lt.annualEntitlement} {lt.unit}/year</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Carry Over</span><span className="font-medium">{lt.carryOver ? `Yes (max ${lt.maxCarryOver} days)` : 'No'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Approval Required</span><span className="font-medium">{lt.requiresApproval ? 'Yes' : 'No'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Documentation</span><span className="font-medium">{lt.documentRequired ? 'Required' : 'Not Required'}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* REQUEST DETAIL MODAL */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
          <div className="bg-card rounded-lg border p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">{selectedRequest.employeeName} — {selectedRequest.leaveType}</h3>
              <button onClick={() => setSelectedRequest(null)}><X size={20} /></button>
            </div>
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-muted-foreground">Period:</span> <strong>{selectedRequest.startDate} → {selectedRequest.endDate}</strong></div>
                <div><span className="text-muted-foreground">Days:</span> <strong>{selectedRequest.days}</strong></div>
                <div><span className="text-muted-foreground">Reason:</span> <strong>{selectedRequest.reason}</strong></div>
                <div><span className="text-muted-foreground">Reliever:</span> <strong>{selectedRequest.relieverName || 'Not assigned'}</strong></div>
              </div>
              {/* Approval flow */}
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Approval Workflow</p>
                <div className="space-y-2">
                  {[
                    { label: 'Supervisor', name: selectedRequest.supervisorName, done: selectedRequest.supervisorApproved, date: selectedRequest.supervisorDate },
                    { label: 'HRBP', name: selectedRequest.hrbpName, done: selectedRequest.hrbpReviewed, date: selectedRequest.hrbpDate },
                    { label: 'HR Head', name: 'Group Head HR', done: selectedRequest.hrHeadApproved, date: selectedRequest.hrHeadDate },
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step.done === true ? 'bg-green-500 text-white' : step.done === false ? 'bg-red-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                        {step.done === true ? '✓' : step.done === false ? '✗' : (i + 1)}
                      </div>
                      <div className="flex-1">
                        <span className="font-medium">{step.label}</span> — {step.name}
                        {step.date && <span className="text-xs text-muted-foreground ml-2">{step.date}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {selectedRequest.handoverNotes && (
                <div className="bg-muted/30 rounded-md p-3">
                  <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Handover Notes</p>
                  <p className="text-sm">{selectedRequest.handoverNotes}</p>
                </div>
              )}
              {selectedRequest.recalled && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-xs font-semibold text-red-700 mb-1">⚠ Employee Recalled</p>
                  <p className="text-sm">Date: {selectedRequest.recallDate}</p>
                  <p className="text-sm">Reason: {selectedRequest.recallReason}</p>
                </div>
              )}
              {/* Actions */}
              {!['approved', 'rejected', 'cancelled'].includes(selectedRequest.stage) && (
                <div className="flex gap-2 pt-2 border-t">
                  <button onClick={() => advanceRequest(selectedRequest.id)} className="flex-1 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium inline-flex items-center justify-center gap-1"><ArrowRight size={14} /> Advance</button>
                  <button onClick={() => rejectRequest(selectedRequest.id)} className="flex-1 py-2 rounded-md bg-destructive text-destructive-foreground text-sm font-medium">Reject</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RECALL MODAL */}
      {showRecall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="bg-card rounded-lg border p-6 w-full max-w-sm">
            <h3 className="font-semibold mb-2">Recall Employee</h3>
            <p className="text-sm text-muted-foreground mb-3">Recall <strong>{showRecall.employeeName}</strong> from {showRecall.leaveType}?</p>
            <textarea value={recallReason} onChange={e => setRecallReason(e.target.value)} placeholder="Reason for recall..." className="w-full px-3 py-2 rounded-md border text-sm mb-3" rows={3} />
            <div className="flex gap-2">
              <button onClick={() => setShowRecall(null)} className="flex-1 px-4 py-2 rounded-md border text-sm">Cancel</button>
              <button onClick={() => recallEmployee(showRecall.id)} className="flex-1 px-4 py-2 rounded-md bg-destructive text-destructive-foreground text-sm font-medium" disabled={!recallReason}>Recall</button>
            </div>
          </div>
        </div>
      )}

      {/* NEW REQUEST MODAL */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
          <div className="bg-card rounded-lg border p-6 w-full max-w-md max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4"><h3 className="font-semibold">New Leave Request</h3><button onClick={() => setShowNew(false)}><X size={20} /></button></div>
            <form onSubmit={handleNewRequest} className="space-y-3">
              <div><label className="text-sm font-medium">Employee Name</label><input name="employee" required className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              <div><label className="text-sm font-medium">Department</label><input name="department" required className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              <div><label className="text-sm font-medium">Leave Type</label>
                <select name="leaveType" className="w-full mt-1 px-3 py-2 rounded-md border text-sm">
                  {leaveTypes.map(t => <option key={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div><label className="text-sm font-medium">Reason</label><textarea name="reason" required className="w-full mt-1 px-3 py-2 rounded-md border text-sm" rows={2} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium">Start Date</label><input type="date" name="startDate" required className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
                <div><label className="text-sm font-medium">End Date</label><input type="date" name="endDate" required className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              </div>
              <div><label className="text-sm font-medium">Supervisor</label><input name="supervisor" required className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              <div><label className="text-sm font-medium">Reliever (optional)</label><input name="reliever" className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              <div><label className="text-sm font-medium">Handover Notes</label><textarea name="handover" className="w-full mt-1 px-3 py-2 rounded-md border text-sm" rows={2} /></div>
              <button type="submit" className="w-full py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium">Submit Request</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
