import { useState } from 'react';
import {
  companyGoals, departmentGoals, individualTargets, initialAppraisals, checkIns, initialPIPs, appraisalStages,
  type Appraisal, type AppraisalStage, type PIP
} from '@/data/performanceData';
import { Star, ChevronRight, X, Plus, AlertTriangle, TrendingUp, Award, BookOpen, CheckCircle, Clock, ArrowRight, Pencil, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import ProcessGuide from '@/components/ProcessGuide';
import { useAuth } from '@/contexts/AuthContext';

const performanceWorkflowSteps = [
  { step: 1, title: 'Company & Department Goals Set', who: 'HOD', description: 'At the start of the financial year, company and department goals are cascaded down from leadership.', tip: 'Goals should be SMART — Specific, Measurable, Achievable, Relevant, Time-bound.' },
  { step: 2, title: 'Individual Targets Set', who: 'Supervisor', description: 'Week 1 of the FY: managers set individual performance targets linked to department goals.' },
  { step: 3, title: 'Continuous Performance Tracking', who: 'System', description: 'The HRMIS tracks KPIs, task completion, and performance indicators throughout the quarter.' },
  { step: 4, title: 'Regular Check-ins', who: 'Supervisor', description: 'Scheduled one-on-ones between employee and supervisor to review progress and address blockers.' },
  { step: 5, title: 'Appraisal Forms Issued', who: 'HR Manager', description: 'At end of quarter, HR issues formal appraisal forms to all employees and managers.' },
  { step: 6, title: 'Employee Self-Assessment', who: 'Employee', description: 'Employee completes a self-assessment scoring their own performance against targets.' },
  { step: 7, title: 'Manager/HOD Evaluation', who: 'HOD', description: 'Week 1 of new quarter: manager evaluates employee, reviews self-assessment, and provides scores.' },
  { step: 8, title: 'HOD Approval & Submission to HR', who: 'HOD', description: 'Head of Department validates all evaluations for their team and submits to HR.' },
  { step: 9, title: 'HR Processing', who: 'HR Manager', description: 'HR collates all appraisals, checks for bias, normalizes scores, and prepares the final results.' },
  { step: 10, title: 'Results Presented to HODs/TM', who: 'HR Manager', description: 'HR presents performance results to HODs and Top Management for review and decisions.' },
  { step: 11, title: 'Performance Decision', who: 'HOD', description: 'Based on results, a performance decision is made for each employee.', branch: { condition: 'Meeting targets', yes: 'Reward Employee (bonus, increment, recognition)', no: 'Corrective Action — PIP or Training Plan' } },
  { step: 12, title: 'Implement Decision & Monitor', who: 'HR Manager', description: 'HR implements the decision (processes reward or initiates PIP), then monitors progress in the next cycle.' },
];

const stageIndex = (s: AppraisalStage) => appraisalStages.findIndex(x => x.key === s);

const decisionColors: Record<string, string> = {
  reward: 'badge-active',
  promotion: 'badge-info',
  training: 'badge-pending',
  pip: 'badge-rejected',
  pending: 'text-muted-foreground',
};
const decisionIcons: Record<string, React.ReactNode> = {
  reward: <Award size={14} />, promotion: <TrendingUp size={14} />,
  training: <BookOpen size={14} />, pip: <AlertTriangle size={14} />,
};

export default function Performance() {
  const { hasRole, user } = useAuth();
  const canManage = hasRole('admin', 'hr_manager', 'supervisor');
  const isEmployee = user?.role === 'employee';
  const [tab, setTab] = useState<'pipeline' | 'goals' | 'appraisals' | 'checkins' | 'pips'>('pipeline');
  const [selfTab, setSelfTab] = useState<'appraisal' | 'targets' | 'checkins' | 'selfassess'>('appraisal');
  const [appraisals, setAppraisals] = useState<Appraisal[]>(initialAppraisals);
  const [pips, setPips] = useState<PIP[]>(initialPIPs);
  const [selectedAppraisal, setSelectedAppraisal] = useState<Appraisal | null>(null);
  const [showAdvance, setShowAdvance] = useState<Appraisal | null>(null);

  const completed = appraisals.filter(a => a.stage === 'decision_made');
  const avgRating = completed.filter(a => a.finalRating).reduce((s, a) => s + (a.finalRating || 0), 0) / (completed.filter(a => a.finalRating).length || 1);
  const totalGoals = individualTargets.length;
  const completedGoals = individualTargets.filter(t => t.status === 'completed' || t.status === 'exceeded').length;

  const advanceStage = (appraisal: Appraisal) => {
    const idx = stageIndex(appraisal.stage);
    if (idx >= appraisalStages.length - 1) return;
    const nextStage = appraisalStages[idx + 1].key;
    setAppraisals(prev => prev.map(a => a.id === appraisal.id ? { ...a, stage: nextStage } : a));
    setShowAdvance(null);
    toast.success(`${appraisal.employeeName} advanced to "${appraisalStages[idx + 1].label}"`);
  };

  const makeDecision = (appraisalId: string, decision: string) => {
    setAppraisals(prev => prev.map(a => a.id === appraisalId ? { ...a, decision: decision as Appraisal['decision'], stage: 'decision_made' as AppraisalStage, completedDate: '2026-04-08' } : a));
    toast.success(`Decision recorded: ${decision}`);
  };

  const tabs = [
    { key: 'pipeline' as const, label: 'Workflow Pipeline' },
    { key: 'goals' as const, label: 'Company & Dept Goals' },
    { key: 'appraisals' as const, label: 'Appraisals' },
    { key: 'checkins' as const, label: 'Check-ins' },
    { key: 'pips' as const, label: 'PIPs' },
  ];

  // ── EMPLOYEE SELF-SERVICE VIEW ──────────────────────────────────────────────
  if (isEmployee) {
    const myAppraisal = appraisals.find(a => a.employeeName === user?.name) || appraisals[0];
    const myTargets = individualTargets.filter(t => t.employeeId === user?.employeeId).slice(0, 5);
    const fallbackTargets = individualTargets.slice(0, 5);
    const targets = myTargets.length > 0 ? myTargets : fallbackTargets;
    const myCheckIns = checkIns.filter(c => c.employeeName === user?.name);
    const fallbackCheckIns = checkIns.slice(0, 3);
    const displayCheckIns = myCheckIns.length > 0 ? myCheckIns : fallbackCheckIns;

    return (
      <div className="space-y-6">
        <ProcessGuide
          title="Performance Management"
          description="Understand the quarterly review process and what's expected of you"
          steps={performanceWorkflowSteps}
          tips={[
            'Complete your self-assessment honestly — it carries significant weight.',
            'Discuss your targets with your supervisor in Week 1 of each quarter.',
            'Raise any concerns about your targets or workload during check-ins.',
          ]}
        />

        {/* My performance snapshot */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card"><div><p className="stat-label">My Rating</p><p className="stat-value">{myAppraisal?.selfRating?.toFixed(1) ?? '—'}/5.0</p><p className="stat-sub">Self assessment</p></div><Star size={20} className="text-amber-500" /></div>
          <div className="stat-card"><div><p className="stat-label">Manager Rating</p><p className="stat-value">{myAppraisal?.managerRating?.toFixed(1) ?? 'Pending'}</p><p className="stat-sub">Q1 2026</p></div><Star size={20} className="text-blue-500" /></div>
          <div className="stat-card"><div><p className="stat-label">Goals Completed</p><p className="stat-value">{targets.filter(t => t.status === 'completed' || t.status === 'exceeded').length}/{targets.length}</p></div><CheckCircle size={20} className="text-green-600" /></div>
          <div className="stat-card"><div><p className="stat-label">Appraisal Stage</p><p className="stat-value text-sm">{appraisalStages.find(s => s.key === myAppraisal?.stage)?.label ?? '—'}</p></div><ArrowRight size={20} className="text-primary" /></div>
        </div>

        {/* Self tabs */}
        <div className="flex gap-1 border-b">
          {([['appraisal', 'My Appraisal'], ['targets', 'My Targets'], ['checkins', 'My Check-ins'], ['selfassess', 'Self-Assessment']] as const).map(([k, l]) => (
            <button key={k} onClick={() => setSelfTab(k)} className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${selfTab === k ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground'}`}>{l}</button>
          ))}
        </div>

        {/* My appraisal */}
        {selfTab === 'appraisal' && myAppraisal && (
          <div className="bg-card rounded-xl border p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{myAppraisal.employeeName}</h3>
                <p className="text-sm text-muted-foreground">{myAppraisal.department} · {myAppraisal.id} · Q1 2026</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${appraisalStages.find(s=>s.key===myAppraisal.stage)?.color} text-white`}>
                {appraisalStages.find(s=>s.key===myAppraisal.stage)?.label}
              </span>
            </div>
            {/* Progress pipeline */}
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wide">Review Progress</p>
              <div className="flex gap-1">
                {appraisalStages.map((s, i) => (
                  <div key={s.key} className="flex-1 flex flex-col items-center gap-1">
                    <div className={`h-2 w-full rounded-full ${i <= stageIndex(myAppraisal.stage) ? s.color : 'bg-muted'}`} />
                    <span className="text-[9px] text-center text-muted-foreground leading-tight hidden sm:block">{s.label.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-muted/30 rounded-lg p-3"><p className="text-xs text-muted-foreground mb-1">Self Assessment Score</p><p className="font-bold text-lg">{myAppraisal.selfRating ?? '—'}/5.0</p></div>
              <div className="bg-muted/30 rounded-lg p-3"><p className="text-xs text-muted-foreground mb-1">Manager Evaluation</p><p className="font-bold text-lg">{myAppraisal.managerRating ?? 'Pending'}{myAppraisal.managerRating ? '/5.0' : ''}</p></div>
            </div>
            {myAppraisal.managerComments && <div className="bg-blue-50 border border-blue-200 rounded-lg p-3"><p className="text-xs font-semibold text-blue-700 mb-1">Manager Comments</p><p className="text-sm text-blue-800">{myAppraisal.managerComments}</p></div>}
            {myAppraisal.decision && myAppraisal.decision !== 'pending' && (
              <div className={`rounded-lg p-3 border ${myAppraisal.decision === 'reward' || myAppraisal.decision === 'promotion' ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                <p className="text-xs font-semibold mb-1">{myAppraisal.decision === 'reward' ? '🏆 Performance Reward' : myAppraisal.decision === 'promotion' ? '🚀 Promotion' : myAppraisal.decision === 'pip' ? '⚠ Performance Improvement Plan' : '📚 Training Recommended'}</p>
                <p className="text-sm">Decision recorded by HR. Your manager will discuss next steps with you.</p>
              </div>
            )}
          </div>
        )}

        {/* My targets */}
        {selfTab === 'targets' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">My Individual Targets — Q1 2026</h3>
              <span className="text-sm text-muted-foreground">{targets.filter(t=>t.status==='completed'||t.status==='exceeded').length}/{targets.length} completed</span>
            </div>
            {targets.map(t => (
              <div key={t.id} className="bg-card rounded-lg border p-4">
                <div className="flex items-start justify-between mb-2">
                  <div><p className="font-medium">{t.title}</p><p className="text-xs text-muted-foreground mt-0.5">{t.description}</p></div>
                  <span className={t.status==='completed'||t.status==='exceeded' ? 'badge-active' : t.status==='behind' ? 'badge-rejected' : 'badge-pending'}>{t.status}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-muted-foreground">Progress:</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${t.status==='completed'||t.status==='exceeded'?'bg-green-500':t.status==='behind'?'bg-red-500':'bg-primary'}`} style={{width:`${Math.min(100,(t.actual/t.target)*100)}%`}} />
                  </div>
                  <span className="font-medium">{t.actual}/{t.target} {t.unit}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* My check-ins */}
        {selfTab === 'checkins' && (
          <div className="space-y-3">
            <h3 className="font-semibold">My Check-in History</h3>
            {displayCheckIns.map(c => (
              <div key={c.id} className="bg-card rounded-lg border p-4">
                <div className="flex justify-between mb-1">
                  <p className="font-medium text-sm">{c.date} — {c.type} Check-in</p>
                  <span className={c.status === 'completed' ? 'badge-active' : 'badge-pending'}>{c.status}</span>
                </div>
                {c.notes && <p className="text-sm text-muted-foreground">{c.notes}</p>}
                {c.actionItems?.length > 0 && <div className="mt-2 space-y-1">{c.actionItems.map((item: string, i: number) => <p key={i} className="text-xs text-muted-foreground flex items-center gap-1"><span className="text-primary">•</span>{item}</p>)}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Self assessment form */}
        {selfTab === 'selfassess' && (
          <div className="bg-card rounded-xl border p-6 space-y-4">
            <h3 className="font-semibold">Q1 2026 Self-Assessment</h3>
            <p className="text-sm text-muted-foreground">Rate your own performance for Q1 2026. Be honest and specific — this is reviewed alongside your manager's evaluation.</p>
            <div className="space-y-4">
              {['Achievement of Targets', 'Quality of Work', 'Teamwork & Collaboration', 'Initiative & Innovation', 'Attendance & Punctuality'].map((criterion, i) => (
                <div key={criterion}>
                  <div className="flex justify-between mb-1"><label className="text-sm font-medium">{criterion}</label><span className="text-xs text-muted-foreground">Rate 1–5</span></div>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} className="h-9 w-9 rounded-lg border hover:bg-primary hover:text-primary-foreground text-sm font-medium transition-colors">{n}</button>
                    ))}
                  </div>
                </div>
              ))}
              <div><label className="text-sm font-medium">Overall Comments</label><textarea className="w-full mt-1 px-3 py-2 rounded-md border text-sm" rows={3} placeholder="Describe your key achievements, challenges, and areas for growth..." /></div>
              <button onClick={() => toast.success('Self-assessment submitted successfully')} className="w-full py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium">Submit Self-Assessment</button>
            </div>
          </div>
        )}
      </div>
    );
  }
  // ── END EMPLOYEE VIEW ───────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <ProcessGuide
        title="Performance Management"
        description="12-step quarterly review cycle from goal setting to rewards or corrective action"
        steps={performanceWorkflowSteps}
        tips={[
          'Individual targets must be set in Week 1 of the financial year.',
          'Self-assessments should be completed before manager evaluation.',
          'All ratings are normalized by HR to prevent biased scoring.',
          'PIP duration is typically 60-90 days with weekly check-ins.',
          'Rewards are processed through payroll after Top Management approval.',
        ]}
      />
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card"><div><p className="stat-label">Appraisals Completed</p><p className="stat-value">{completed.length}/{appraisals.length}</p></div><CheckCircle size={22} className="text-green-600" /></div>
        <div className="stat-card"><div><p className="stat-label">Avg. Final Rating</p><p className="stat-value">{avgRating.toFixed(1)}/5.0</p></div><Star size={22} className="text-amber-500" /></div>
        <div className="stat-card"><div><p className="stat-label">Goals Progress</p><p className="stat-value">{completedGoals}/{totalGoals}</p></div><TrendingUp size={22} className="text-blue-600" /></div>
        <div className="stat-card"><div><p className="stat-label">Active PIPs</p><p className="stat-value">{pips.filter(p => p.status === 'active').length}</p></div><AlertTriangle size={22} className="text-red-500" /></div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1 border-b overflow-x-auto">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${tab === t.key ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground'}`}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* PIPELINE VIEW */}
      {tab === 'pipeline' && (
        <div className="space-y-4">
          {/* Visual flow */}
          <div className="bg-card rounded-lg border p-4 overflow-x-auto">
            <h3 className="font-semibold mb-4">Performance Review Pipeline — Q1 2026</h3>
            <div className="flex gap-1 items-center min-w-[900px]">
              {appraisalStages.map((stage, i) => {
                const count = appraisals.filter(a => a.stage === stage.key).length;
                return (
                  <div key={stage.key} className="flex items-center">
                    <div className={`flex flex-col items-center px-2 py-3 rounded-lg min-w-[90px] ${count > 0 ? 'bg-muted' : 'bg-muted/30'}`}>
                      <div className={`w-8 h-8 rounded-full ${stage.color} flex items-center justify-center text-white text-xs font-bold`}>{count}</div>
                      <span className="text-[10px] font-medium text-center mt-1 leading-tight">{stage.label}</span>
                    </div>
                    {i < appraisalStages.length - 1 && <ChevronRight size={16} className="text-muted-foreground mx-0.5 flex-shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Appraisals by stage */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {appraisals.map(a => (
              <div key={a.id} className="bg-card rounded-lg border p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-sm">{a.employeeName}</p>
                    <p className="text-xs text-muted-foreground">{a.department} · {a.id}</p>
                  </div>
                  {a.decision && <span className={`${decisionColors[a.decision]} inline-flex items-center gap-1`}>{decisionIcons[a.decision]} {a.decision}</span>}
                </div>
                {/* Mini pipeline */}
                <div className="flex gap-0.5 mb-3">
                  {appraisalStages.map((s, i) => (
                    <div key={s.key} className={`h-1.5 flex-1 rounded-full ${i <= stageIndex(a.stage) ? s.color : 'bg-muted'}`} />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted">{appraisalStages.find(s => s.key === a.stage)?.label}</span>
                  <div className="flex gap-1">
                    <button onClick={() => setSelectedAppraisal(a)} className="text-xs px-2 py-1 rounded border hover:bg-muted">View</button>
                    {a.stage !== 'decision_made' && (
                      <button onClick={() => setShowAdvance(a)} className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground hover:opacity-90">Advance</button>
                    )}
                  </div>
                </div>
                {a.finalRating && (
                  <div className="flex items-center gap-1 mt-2">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <Star key={si} size={12} className={si < Math.round(a.finalRating!) ? 'fill-amber-400 text-amber-400' : 'text-muted'} />
                    ))}
                    <span className="text-xs ml-1">{a.finalRating}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COMPANY & DEPARTMENT GOALS */}
      {tab === 'goals' && (
        <div className="space-y-6">
          <div className="bg-card rounded-lg border">
            <div className="p-4 border-b"><h3 className="font-semibold">Company Strategic Goals — FY 2026</h3></div>
            <div className="divide-y">
              {companyGoals.map(g => (
                <div key={g.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">{g.title}</p>
                      <p className="text-xs text-muted-foreground">{g.description} · Owner: {g.owner}</p>
                    </div>
                    <span className={g.status === 'on_track' ? 'badge-active' : g.status === 'at_risk' ? 'badge-pending' : g.status === 'behind' ? 'badge-rejected' : 'badge-info'}>{g.status.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${g.progress}%` }} />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">{g.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-lg border">
            <div className="p-4 border-b"><h3 className="font-semibold">Department Goals (Cascaded)</h3></div>
            <table className="data-table">
              <thead><tr><th>Department</th><th>Goal</th><th>Target</th><th>Actual</th><th>Progress</th><th>HOD</th><th>Status</th></tr></thead>
              <tbody>
                {departmentGoals.map(dg => (
                  <tr key={dg.id}>
                    <td className="font-medium">{dg.department}</td>
                    <td>{dg.title}</td>
                    <td>{dg.target.toLocaleString()} {dg.unit}</td>
                    <td className="font-bold">{dg.actual.toLocaleString()} {dg.unit}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, (dg.actual / dg.target) * 100)}%` }} />
                        </div>
                        <span className="text-xs">{Math.round((dg.actual / dg.target) * 100)}%</span>
                      </div>
                    </td>
                    <td className="text-sm">{dg.hodName}</td>
                    <td><span className={dg.status === 'on_track' ? 'badge-active' : dg.status === 'at_risk' ? 'badge-pending' : 'badge-rejected'}>{dg.status.replace('_', ' ')}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-card rounded-lg border">
            <div className="p-4 border-b"><h3 className="font-semibold">Individual Targets</h3></div>
            <table className="data-table">
              <thead><tr><th>Employee</th><th>Target</th><th>Weight</th><th>Progress</th><th>Due</th><th>Status</th></tr></thead>
              <tbody>
                {individualTargets.map(t => (
                  <tr key={t.id}>
                    <td><div><p className="font-medium">{t.employeeName}</p><p className="text-xs text-muted-foreground">{t.department}</p></div></td>
                    <td><div><p className="font-medium text-sm">{t.title}</p><p className="text-xs text-muted-foreground">{t.description}</p></div></td>
                    <td className="font-bold">{t.weight}%</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${t.status === 'exceeded' ? 'bg-green-500' : 'bg-primary'}`} style={{ width: `${Math.min(100, (t.actualValue / t.targetValue) * 100)}%` }} />
                        </div>
                        <span className="text-xs">{t.actualValue}/{t.targetValue}</span>
                      </div>
                    </td>
                    <td className="text-sm">{t.dueDate}</td>
                    <td><span className={t.status === 'completed' || t.status === 'exceeded' ? 'badge-active' : t.status === 'in_progress' ? 'badge-info' : 'badge-pending'}>{t.status.replace('_', ' ')}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* APPRAISALS TABLE */}
      {tab === 'appraisals' && (
        <div className="bg-card rounded-lg border overflow-x-auto">
          <div className="p-4 border-b"><h3 className="font-semibold">All Appraisals — Q1 2026</h3></div>
          <table className="data-table">
            <thead><tr><th>Employee</th><th>Department</th><th>Reviewer</th><th>Goals</th><th>Self</th><th>Manager</th><th>Final</th><th>Stage</th><th>Decision</th><th>Actions</th></tr></thead>
            <tbody>
              {appraisals.map(a => (
                <tr key={a.id}>
                  <td className="font-medium">{a.employeeName}</td>
                  <td>{a.department}</td>
                  <td>{a.reviewer}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${(a.goalsCompleted / a.goalsTotal) * 100}%` }} />
                      </div>
                      <span className="text-xs">{a.goalsCompleted}/{a.goalsTotal}</span>
                    </div>
                  </td>
                  <td>{a.selfRating || '—'}</td>
                  <td>{a.managerRating || '—'}</td>
                  <td className="font-bold">{a.finalRating || '—'}</td>
                  <td><span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted">{appraisalStages.find(s => s.key === a.stage)?.label}</span></td>
                  <td>{a.decision ? <span className={`${decisionColors[a.decision]} inline-flex items-center gap-1`}>{decisionIcons[a.decision]} {a.decision}</span> : '—'}</td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => setSelectedAppraisal(a)} className="text-xs px-2 py-1 rounded border hover:bg-muted">Details</button>
                      {a.stage === 'results_presented' && !a.decision && (
                        <div className="flex gap-1">
                          <button onClick={() => makeDecision(a.id, 'reward')} className="text-xs px-1.5 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200">Reward</button>
                          <button onClick={() => makeDecision(a.id, 'pip')} className="text-xs px-1.5 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200">PIP</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CHECK-INS */}
      {tab === 'checkins' && (
        <div className="bg-card rounded-lg border">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">Regular Check-ins</h3>
          </div>
          <div className="divide-y">
            {checkIns.map(ci => (
              <div key={ci.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">{ci.employeeName.charAt(0)}</div>
                    <div>
                      <p className="font-medium text-sm">{ci.employeeName}</p>
                      <p className="text-xs text-muted-foreground">Check-in on {ci.date}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                  <div className="bg-muted/50 rounded-md p-3">
                    <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Employee Notes</p>
                    <p className="text-sm">{ci.notes}</p>
                  </div>
                  <div className="bg-muted/50 rounded-md p-3">
                    <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Action Items</p>
                    <p className="text-sm">{ci.actionItems}</p>
                  </div>
                  <div className="bg-muted/50 rounded-md p-3">
                    <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Manager Feedback</p>
                    <p className="text-sm">{ci.managerNotes}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PIPs */}
      {tab === 'pips' && (
        <div className="space-y-4">
          {pips.map(pip => (
            <div key={pip.id} className="bg-card rounded-lg border p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-destructive" />
                    <p className="font-semibold">{pip.employeeName}</p>
                    <span className={pip.status === 'active' ? 'badge-rejected' : pip.status === 'completed' ? 'badge-active' : 'badge-pending'}>{pip.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{pip.department} · {pip.startDate} to {pip.endDate}</p>
                </div>
                <span className="text-sm font-bold">{pip.progress}% complete</span>
              </div>
              <p className="text-sm mb-3"><strong>Reason:</strong> {pip.reason}</p>
              <div className="mb-3">
                <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Objectives</p>
                <ul className="space-y-1">
                  {pip.objectives.map((obj, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${i < Math.ceil(pip.objectives.length * pip.progress / 100) ? 'border-green-500 bg-green-500' : 'border-muted-foreground'}`}>
                        {i < Math.ceil(pip.objectives.length * pip.progress / 100) && <CheckCircle size={10} className="text-white" />}
                      </div>
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-destructive rounded-full" style={{ width: `${pip.progress}%` }} />
                </div>
                <span className="text-xs font-medium">{pip.progress}%</span>
              </div>
              <div className="flex gap-2 mt-3">
                <p className="text-xs text-muted-foreground">Review dates: {pip.reviewDates.join(' · ')}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* APPRAISAL DETAIL MODAL */}
      {selectedAppraisal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
          <div className="bg-card rounded-lg border p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Appraisal: {selectedAppraisal.employeeName}</h3>
              <button onClick={() => setSelectedAppraisal(null)}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Department:</span> <strong>{selectedAppraisal.department}</strong></div>
                <div><span className="text-muted-foreground">Reviewer:</span> <strong>{selectedAppraisal.reviewer}</strong></div>
                <div><span className="text-muted-foreground">HOD:</span> <strong>{selectedAppraisal.hodName}</strong></div>
                <div><span className="text-muted-foreground">Cycle:</span> <strong>{selectedAppraisal.cycle}</strong></div>
              </div>
              {/* Stage progress */}
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Workflow Progress</p>
                <div className="flex gap-0.5">
                  {appraisalStages.map((s, i) => (
                    <div key={s.key} className={`h-2 flex-1 rounded-full ${i <= stageIndex(selectedAppraisal.stage) ? s.color : 'bg-muted'}`} title={s.label} />
                  ))}
                </div>
                <p className="text-xs mt-1">Current: <strong>{appraisalStages.find(s => s.key === selectedAppraisal.stage)?.label}</strong></p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-muted/50 rounded-md p-3 text-center">
                  <p className="text-xs text-muted-foreground">Self Rating</p>
                  <p className="text-xl font-bold">{selectedAppraisal.selfRating || '—'}</p>
                </div>
                <div className="bg-muted/50 rounded-md p-3 text-center">
                  <p className="text-xs text-muted-foreground">Manager Rating</p>
                  <p className="text-xl font-bold">{selectedAppraisal.managerRating || '—'}</p>
                </div>
                <div className="bg-muted/50 rounded-md p-3 text-center">
                  <p className="text-xs text-muted-foreground">Final Rating</p>
                  <p className="text-xl font-bold">{selectedAppraisal.finalRating || '—'}</p>
                </div>
              </div>
              {selectedAppraisal.selfComments && (
                <div className="bg-muted/30 rounded-md p-3">
                  <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Self-Assessment Comments</p>
                  <p className="text-sm">{selectedAppraisal.selfComments}</p>
                </div>
              )}
              {selectedAppraisal.managerComments && (
                <div className="bg-muted/30 rounded-md p-3">
                  <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Manager Comments</p>
                  <p className="text-sm">{selectedAppraisal.managerComments}</p>
                </div>
              )}
              {selectedAppraisal.decision && (
                <div className="bg-muted/30 rounded-md p-3">
                  <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Decision</p>
                  <p className="text-sm"><span className={`${decisionColors[selectedAppraisal.decision]} inline-flex items-center gap-1`}>{decisionIcons[selectedAppraisal.decision]} {selectedAppraisal.decision}</span></p>
                  <p className="text-sm mt-1">{selectedAppraisal.decisionDetails}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADVANCE CONFIRMATION */}
      {showAdvance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="bg-card rounded-lg border p-6 w-full max-w-sm">
            <h3 className="font-semibold mb-2">Advance Stage</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Move <strong>{showAdvance.employeeName}</strong> from "{appraisalStages.find(s => s.key === showAdvance.stage)?.label}" to "{appraisalStages[stageIndex(showAdvance.stage) + 1]?.label}"?
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAdvance(null)} className="px-4 py-2 rounded-md border text-sm">Cancel</button>
              <button onClick={() => advanceStage(showAdvance)} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-1"><ArrowRight size={14} /> Advance</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
