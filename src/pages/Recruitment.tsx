import { useState } from 'react';
import {
  initialRequisitions, initialCandidates, initialInterviews, candidateStages,
  type Requisition, type Candidate, type InterviewPanel, type CandidateStage
} from '@/data/recruitmentData';
import { Plus, X, Users, Briefcase, Clock, CheckCircle, ChevronRight, Star, FileText, Phone, Mail, Building2, Pencil, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import ProcessGuide from '@/components/ProcessGuide';
import { useAuth } from '@/contexts/AuthContext';

const recruitmentWorkflowSteps = [
  { step: 1, title: 'Update Manpower Plan', who: 'HOD', description: 'Department head identifies a vacancy or new position requirement and updates the manpower plan.' },
  { step: 2, title: 'Raise Requisition', who: 'HOD', description: 'An official job requisition is raised in the system with position details, grade, and budget justification.' },
  { step: 3, title: 'Review Job Profile', who: 'HR Manager', description: 'HR reviews and updates the job description, required qualifications, and competencies for the position.' },
  { step: 4, title: 'Determine Fill Method', who: 'HR Manager', description: 'HR decides whether to source internally, externally, or both (referrals, job boards, agencies, HRMIS).', branch: { condition: 'Internal candidate available', yes: 'Post internally first', no: 'External sourcing via job boards & agencies' } },
  { step: 5, title: 'Source & Screen Candidates', who: 'HR Manager', description: 'Applications are collected, initial screening done against minimum requirements, and a shortlist prepared.' },
  { step: 6, title: 'Select Panel & Schedule Interviews', who: 'HR Manager', description: 'An interview panel is constituted (HOD + HR + Technical Lead) and interviews are scheduled.' },
  { step: 7, title: 'Conduct Interviews & Evaluate', who: 'HOD', description: 'Panel conducts structured interviews and scores candidates against a standardized evaluation form.' },
  { step: 8, title: 'Select Best Candidate', who: 'HOD', description: 'Panel deliberates and selects the best candidate. All candidates are informed of outcomes.' },
  { step: 9, title: 'Background Check', who: 'HR Manager', description: 'Reference checks, academic verification, and criminal background checks are completed.' },
  { step: 10, title: 'Negotiate Terms', who: 'HR Manager', description: 'HR negotiates salary and employment terms with the selected candidate.', branch: { condition: 'Candidate accepts terms', yes: 'Issue Appointment Letter/Contract', no: 'Propose revised terms or move to next best candidate' } },
  { step: 11, title: 'Onboarding & HRMIS Update', who: 'HR Manager', description: 'Appointment letter is signed, employee record is created in HRMIS, and onboarding is initiated.' },
];

const reqStatusColors: Record<string, string> = {
  draft: 'badge-pending', pending_approval: 'badge-pending', approved: 'badge-info', sourcing: 'badge-info',
  interviewing: 'badge-info', offer_stage: 'badge-active', filled: 'badge-active', cancelled: 'badge-rejected',
};

const kanbanColumns: { key: CandidateStage; label: string; color: string }[] = [
  { key: 'applied', label: 'Applied', color: 'border-l-slate-400' },
  { key: 'screening', label: 'Screening', color: 'border-l-blue-400' },
  { key: 'shortlisted', label: 'Shortlisted', color: 'border-l-cyan-400' },
  { key: 'interview_scheduled', label: 'Interview', color: 'border-l-indigo-400' },
  { key: 'interviewed', label: 'Interviewed', color: 'border-l-purple-400' },
  { key: 'evaluated', label: 'Evaluated', color: 'border-l-violet-400' },
  { key: 'selected', label: 'Selected', color: 'border-l-amber-400' },
  { key: 'background_check', label: 'BG Check', color: 'border-l-orange-400' },
  { key: 'offer_sent', label: 'Offer', color: 'border-l-emerald-400' },
  { key: 'hired', label: 'Hired', color: 'border-l-green-500' },
];

export default function Recruitment() {
  const { hasRole } = useAuth();
  const canManage = hasRole('admin', 'hr_manager');
  const [tab, setTab] = useState<'requisitions' | 'pipeline' | 'candidates' | 'interviews'>('requisitions');
  const [requisitions, setRequisitions] = useState<Requisition[]>(initialRequisitions);
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [interviews] = useState<InterviewPanel[]>(initialInterviews);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showNewReq, setShowNewReq] = useState(false);
  const [filterReqId, setFilterReqId] = useState<string>('all');

  const activeReqs = requisitions.filter(r => !['filled', 'cancelled', 'draft'].includes(r.status));
  const totalApplicants = candidates.length;
  const inPipeline = candidates.filter(c => !['rejected', 'hired'].includes(c.stage)).length;
  const hired = candidates.filter(c => c.stage === 'hired').length;

  const advanceCandidate = (candidateId: string, newStage: CandidateStage) => {
    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, stage: newStage } : c));
    toast.success(`Candidate moved to ${candidateStages.find(s => s.key === newStage)?.label}`);
    setSelectedCandidate(null);
  };

  const approveRequisition = (reqId: string) => {
    setRequisitions(prev => prev.map(r => r.id === reqId ? { ...r, status: 'approved' as const, approvedBy: 'HR Director', approvedDate: '2026-04-08' } : r));
    toast.success('Requisition approved');
  };

  const handleNewReq = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newReq: Requisition = {
      id: `REQ-${String(requisitions.length + 1).padStart(3, '0')}`,
      position: fd.get('position') as string,
      department: fd.get('department') as string,
      location: fd.get('location') as string,
      type: fd.get('type') as Requisition['type'],
      justification: fd.get('justification') as string,
      requestedBy: 'Current User',
      approvedBy: null,
      budgetedSalary: { min: parseInt(fd.get('salaryMin') as string) || 0, max: parseInt(fd.get('salaryMax') as string) || 0 },
      priority: fd.get('priority') as Requisition['priority'],
      status: 'pending_approval',
      createdDate: new Date().toISOString().split('T')[0],
      approvedDate: null,
      fillingMethod: fd.get('method') as Requisition['fillingMethod'],
    };
    setRequisitions(prev => [newReq, ...prev]);
    setShowNewReq(false);
    toast.success('Requisition submitted for approval');
  };

  const filteredCandidates = filterReqId === 'all' ? candidates : candidates.filter(c => c.requisitionId === filterReqId);

  const tabs = [
    { key: 'requisitions' as const, label: 'Requisitions' },
    { key: 'pipeline' as const, label: 'Hiring Pipeline' },
    { key: 'candidates' as const, label: 'Candidates' },
    { key: 'interviews' as const, label: 'Interviews' },
  ];

  return (
    <div className="space-y-6">
      <ProcessGuide
        title="Recruitment"
        description="11-step hiring process from manpower planning to onboarding"
        steps={recruitmentWorkflowSteps}
        tips={[
          'All requisitions must reference an approved position in the manpower plan.',
          'Internal candidates get 1 week head start before external posting.',
          'Interview panels must have at least 3 members including the HOD.',
          'Background checks are mandatory for all management positions.',
          'Offer letters must be issued within 5 working days of candidate acceptance.',
        ]}
      />
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card"><div><p className="stat-label">Active Requisitions</p><p className="stat-value">{activeReqs.length}</p></div><Briefcase size={22} className="text-blue-600" /></div>
        <div className="stat-card"><div><p className="stat-label">Total Applicants</p><p className="stat-value">{totalApplicants}</p></div><Users size={22} className="text-muted-foreground" /></div>
        <div className="stat-card"><div><p className="stat-label">In Pipeline</p><p className="stat-value">{inPipeline}</p></div><Clock size={22} className="text-amber-500" /></div>
        <div className="stat-card"><div><p className="stat-label">Hired</p><p className="stat-value">{hired}</p></div><CheckCircle size={22} className="text-green-600" /></div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1 border-b overflow-x-auto">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${tab === t.key ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground'}`}>{t.label}</button>
          ))}
        </div>
        {tab === 'requisitions' && (
          <button onClick={() => setShowNewReq(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"><Plus size={16} /> Raise Requisition</button>
        )}
      </div>

      {/* REQUISITIONS */}
      {tab === 'requisitions' && (
        <div className="bg-card rounded-lg border overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Position</th><th>Department</th><th>Priority</th><th>Budget Range</th><th>Method</th><th>Status</th><th>Requested By</th><th>Actions</th></tr></thead>
            <tbody>
              {requisitions.map(r => (
                <tr key={r.id}>
                  <td><div><p className="font-medium">{r.position}</p><p className="text-xs text-muted-foreground">{r.id} · {r.type} · {r.location}</p></div></td>
                  <td>{r.department}</td>
                  <td><span className={r.priority === 'urgent' ? 'badge-rejected' : r.priority === 'high' ? 'badge-pending' : 'badge-info'}>{r.priority}</span></td>
                  <td className="text-sm">KES {(r.budgetedSalary.min / 1000).toFixed(0)}k – {(r.budgetedSalary.max / 1000).toFixed(0)}k</td>
                  <td className="text-sm">{r.fillingMethod || '—'}</td>
                  <td><span className={reqStatusColors[r.status]}>{r.status.replace(/_/g, ' ')}</span></td>
                  <td className="text-sm">{r.requestedBy}</td>
                  <td>
                    {r.status === 'pending_approval' && (
                      <button onClick={() => approveRequisition(r.id)} className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200">Approve</button>
                    )}
                    {r.status === 'approved' && (
                      <button onClick={() => setRequisitions(prev => prev.map(x => x.id === r.id ? { ...x, status: 'sourcing' } : x))} className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">Start Sourcing</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* HIRING PIPELINE (KANBAN) */}
      {tab === 'pipeline' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <select value={filterReqId} onChange={e => setFilterReqId(e.target.value)} className="px-3 py-2 rounded-md border bg-card text-sm">
              <option value="all">All Positions</option>
              {requisitions.filter(r => r.status !== 'draft').map(r => <option key={r.id} value={r.id}>{r.position}</option>)}
            </select>
          </div>
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-3 min-w-[1400px]">
              {kanbanColumns.map(col => {
                const colCandidates = filteredCandidates.filter(c => c.stage === col.key);
                return (
                  <div key={col.key} className="flex-1 min-w-[140px]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold uppercase text-muted-foreground">{col.label}</span>
                      <span className="text-xs bg-muted px-1.5 py-0.5 rounded-full">{colCandidates.length}</span>
                    </div>
                    <div className="space-y-2">
                      {colCandidates.map(c => (
                        <div key={c.id} onClick={() => setSelectedCandidate(c)} className={`bg-card rounded-lg border border-l-4 ${col.color} p-3 cursor-pointer hover:shadow-md transition-shadow`}>
                          <p className="font-medium text-sm">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.currentRole}</p>
                          <p className="text-xs text-muted-foreground">{c.currentCompany}</p>
                          {c.rating && (
                            <div className="flex items-center gap-1 mt-1">
                              <Star size={10} className="fill-amber-400 text-amber-400" />
                              <span className="text-xs">{c.rating}</span>
                            </div>
                          )}
                        </div>
                      ))}
                      {colCandidates.length === 0 && <div className="text-xs text-muted-foreground text-center py-4 bg-muted/30 rounded-lg border border-dashed">No candidates</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CANDIDATES TABLE */}
      {tab === 'candidates' && (
        <div className="bg-card rounded-lg border overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Candidate</th><th>Position</th><th>Source</th><th>Experience</th><th>Stage</th><th>Rating</th><th>Score</th><th>Actions</th></tr></thead>
            <tbody>
              {candidates.map(c => {
                const req = requisitions.find(r => r.id === c.requisitionId);
                return (
                  <tr key={c.id}>
                    <td><div><p className="font-medium">{c.name}</p><p className="text-xs text-muted-foreground">{c.currentCompany} · {c.currentRole}</p></div></td>
                    <td className="text-sm">{req?.position || c.requisitionId}</td>
                    <td><span className="badge-info">{c.source}</span></td>
                    <td>{c.experience} yrs</td>
                    <td><span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted">{candidateStages.find(s => s.key === c.stage)?.label}</span></td>
                    <td>{c.rating ? <span className="flex items-center gap-1"><Star size={12} className="fill-amber-400 text-amber-400" />{c.rating}</span> : '—'}</td>
                    <td className="font-bold">{c.interviewScore || '—'}</td>
                    <td><button onClick={() => setSelectedCandidate(c)} className="text-xs px-2 py-1 rounded border hover:bg-muted">View</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* INTERVIEWS */}
      {tab === 'interviews' && (
        <div className="bg-card rounded-lg border overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Candidate</th><th>Position</th><th>Type</th><th>Panel</th><th>Date & Time</th><th>Score</th><th>Recommendation</th><th>Status</th></tr></thead>
            <tbody>
              {interviews.map(int => (
                <tr key={int.id}>
                  <td className="font-medium">{int.candidateName}</td>
                  <td className="text-sm">{int.position}</td>
                  <td><span className="badge-info">{int.type}</span></td>
                  <td className="text-xs">{int.panelMembers.join(', ')}</td>
                  <td className="text-sm">{int.scheduledDate} · {int.scheduledTime}</td>
                  <td className="font-bold">{int.score || '—'}</td>
                  <td>{int.recommendation ? <span className={int.recommendation.includes('hire') ? 'badge-active' : int.recommendation === 'maybe' ? 'badge-pending' : 'badge-rejected'}>{int.recommendation.replace('_', ' ')}</span> : '—'}</td>
                  <td><span className={int.status === 'completed' ? 'badge-active' : int.status === 'scheduled' ? 'badge-info' : 'badge-rejected'}>{int.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CANDIDATE DETAIL MODAL */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
          <div className="bg-card rounded-lg border p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">{selectedCandidate.name}</h3>
              <button onClick={() => setSelectedCandidate(null)}><X size={20} /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2"><Mail size={14} />{selectedCandidate.email}</div>
              <div className="flex items-center gap-2"><Phone size={14} />{selectedCandidate.phone}</div>
              <div className="flex items-center gap-2"><Building2 size={14} />{selectedCandidate.currentCompany} — {selectedCandidate.currentRole}</div>
              <div className="flex items-center gap-2"><FileText size={14} />{selectedCandidate.education}</div>
              <div><strong>Experience:</strong> {selectedCandidate.experience} years</div>
              <div><strong>Source:</strong> {selectedCandidate.source}</div>
              <div><strong>Stage:</strong> <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted">{candidateStages.find(s => s.key === selectedCandidate.stage)?.label}</span></div>
              {selectedCandidate.interviewScore && <div><strong>Interview Score:</strong> {selectedCandidate.interviewScore}/100</div>}
              {selectedCandidate.offerAmount && <div><strong>Offer:</strong> KES {selectedCandidate.offerAmount.toLocaleString()} — {selectedCandidate.offerStatus}</div>}
              <div><strong>Notes:</strong> {selectedCandidate.notes}</div>
              {/* Stage advancement buttons */}
              <div className="pt-3 border-t">
                <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Move to Stage</p>
                <div className="flex flex-wrap gap-1">
                  {candidateStages.filter(s => s.key !== selectedCandidate.stage && s.key !== 'rejected').map(s => (
                    <button key={s.key} onClick={() => advanceCandidate(selectedCandidate.id, s.key)} className="text-xs px-2 py-1 rounded border hover:bg-muted">{s.label}</button>
                  ))}
                  <button onClick={() => advanceCandidate(selectedCandidate.id, 'rejected')} className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200">Reject</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW REQUISITION MODAL */}
      {showNewReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
          <div className="bg-card rounded-lg border p-6 w-full max-w-md max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4"><h3 className="font-semibold">Raise New Requisition</h3><button onClick={() => setShowNewReq(false)}><X size={20} /></button></div>
            <form onSubmit={handleNewReq} className="space-y-3">
              <div><label className="text-sm font-medium">Position *</label><input name="position" required className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              <div><label className="text-sm font-medium">Department *</label><input name="department" required className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              <div><label className="text-sm font-medium">Justification *</label><textarea name="justification" required className="w-full mt-1 px-3 py-2 rounded-md border text-sm" rows={2} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium">Location</label><input name="location" className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
                <div><label className="text-sm font-medium">Type</label>
                  <select name="type" className="w-full mt-1 px-3 py-2 rounded-md border text-sm"><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option></select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium">Salary Min (KES)</label><input type="number" name="salaryMin" className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
                <div><label className="text-sm font-medium">Salary Max (KES)</label><input type="number" name="salaryMax" className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium">Priority</label>
                  <select name="priority" className="w-full mt-1 px-3 py-2 rounded-md border text-sm"><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option><option value="low">Low</option></select>
                </div>
                <div><label className="text-sm font-medium">Filling Method</label>
                  <select name="method" className="w-full mt-1 px-3 py-2 rounded-md border text-sm"><option value="external">External</option><option value="internal">Internal</option><option value="both">Both</option></select>
                </div>
              </div>
              <button type="submit" className="w-full py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium">Submit Requisition</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
