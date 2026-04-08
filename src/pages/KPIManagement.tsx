import { useState } from 'react';
import { initialKpis, KPI } from '@/data/hrData';
import { Plus, X, TrendingUp, TrendingDown, Minus, BarChart3, Pencil, Trash2, Eye } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import ProcessGuide from '@/components/ProcessGuide';
import { useAuth } from '@/contexts/AuthContext';

const kpiWorkflowSteps = [
  { step: 1, title: 'Define Company KPIs', who: 'HOD', description: 'Senior leadership defines company-wide KPIs linked to strategic objectives for the year.' },
  { step: 2, title: 'Department KPI Cascade', who: 'HOD', description: 'Company KPIs are cascaded to department level with specific, measurable targets.' },
  { step: 3, title: 'Individual Target Assignment', who: 'Supervisor', description: 'Managers assign individual KPIs to employees, linking them to department targets.' },
  { step: 4, title: 'Continuous Tracking', who: 'System', description: 'KPI actuals are updated regularly (monthly or quarterly) in the HRMIS.' },
  { step: 5, title: 'Review & Reporting', who: 'HR Manager', description: 'HR generates KPI reports for management review, highlighting trends and outliers.' },
  { step: 6, title: 'Corrective Action or Recognition', who: 'HOD', description: 'Based on KPI results, decisions are made to reward high performers or initiate improvement plans.', branch: { condition: 'KPI target met', yes: 'Recognition / reward / increment', no: 'Corrective action / support / training' } },
];

const categories = ['Retention', 'Recruitment', 'Engagement', 'Development', 'Payroll', 'Attendance', 'Productivity', 'Diversity', 'Compliance', 'Other'];
const frequencies = ['Monthly', 'Quarterly', 'Annual'] as const;

export default function KPIManagement() {
  const { hasRole } = useAuth();
  const canManage = hasRole('admin', 'hr_manager');
  const [kpis, setKpis] = useState<KPI[]>(initialKpis);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState<KPI | null>(null);
  const [editKpi, setEditKpi] = useState<KPI | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const onTrack = kpis.filter(k => k.status === 'on_track').length;
  const atRisk = kpis.filter(k => k.status === 'at_risk').length;
  const behind = kpis.filter(k => k.status === 'behind').length;

  const filtered = kpis.filter(k => {
    const matchCat = filterCategory === 'All' || k.category === filterCategory;
    const matchStatus = filterStatus === 'All' || k.status === filterStatus;
    return matchCat && matchStatus;
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const target = parseFloat(fd.get('target') as string);
    const actual = parseFloat(fd.get('actual') as string);
    const pct = (actual / target) * 100;
    let status: KPI['status'] = 'on_track';
    if (pct < 70) status = 'behind';
    else if (pct < 90) status = 'at_risk';

    const newKpi: KPI = {
      id: `KPI-${String(kpis.length + 1).padStart(3, '0')}`,
      name: fd.get('name') as string,
      category: fd.get('category') as string,
      target,
      actual,
      unit: fd.get('unit') as string,
      frequency: fd.get('frequency') as KPI['frequency'],
      owner: fd.get('owner') as string,
      department: fd.get('department') as string,
      status,
      trend: [actual * 0.85, actual * 0.9, actual * 0.95, actual],
      createdDate: new Date().toISOString().split('T')[0],
    };
    setKpis(prev => [...prev, newKpi]);
    setShowCreate(false);
    toast.success(`KPI "${newKpi.name}" created successfully`);
  };

  const handleUpdateActual = (kpiId: string, newActual: number) => {
    setKpis(prev => prev.map(k => {
      if (k.id !== kpiId) return k;
      const pct = (newActual / k.target) * 100;
      let status: KPI['status'] = 'on_track';
      if (pct < 70) status = 'behind';
      else if (pct < 90) status = 'at_risk';
      return { ...k, actual: newActual, status, trend: [...k.trend.slice(1), newActual] };
    }));
    toast.success('KPI updated');
  };

  return (
    <div className="space-y-6">
      <ProcessGuide
        title="KPI Management"
        description="6-step cycle from KPI definition to recognition or corrective action"
        steps={kpiWorkflowSteps}
        tips={[
          'KPIs must be SMART and aligned to the strategic plan.',
          'Update actuals monthly to maintain accurate tracking.',
          'Cascade company KPIs to department and individual levels.',
          'KPI results feed directly into the performance appraisal process.',
        ]}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card"><div><p className="stat-label">Total KPIs</p><p className="stat-value">{kpis.length}</p></div><BarChart3 size={22} className="text-muted-foreground" /></div>
        <div className="stat-card" onClick={() => setFilterStatus('on_track')}><div><p className="stat-label">On Track</p><p className="stat-value text-success">{onTrack}</p></div><TrendingUp size={22} className="text-success" /></div>
        <div className="stat-card" onClick={() => setFilterStatus('at_risk')}><div><p className="stat-label">At Risk</p><p className="stat-value text-warning">{atRisk}</p></div><Minus size={22} className="text-warning" /></div>
        <div className="stat-card" onClick={() => setFilterStatus('behind')}><div><p className="stat-label">Behind</p><p className="stat-value text-destructive">{behind}</p></div><TrendingDown size={22} className="text-destructive" /></div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-3">
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="px-3 py-2 rounded-md border bg-card text-sm">
            <option value="All">All Categories</option>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 rounded-md border bg-card text-sm">
            <option value="All">All Status</option>
            <option value="on_track">On Track</option>
            <option value="at_risk">At Risk</option>
            <option value="behind">Behind</option>
          </select>
        </div>
        <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
          <Plus size={16} /> Create KPI
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(kpi => {
          const pct = Math.min(100, (kpi.actual / kpi.target) * 100);
          const trendData = kpi.trend.map((v, i) => ({ period: `P${i + 1}`, value: v }));
          return (
            <div key={kpi.id} className="bg-card rounded-lg border p-5 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedKpi(kpi)}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{kpi.name}</p>
                  <p className="text-xs text-muted-foreground">{kpi.category} · {kpi.frequency}</p>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <span className={kpi.status === 'on_track' ? 'badge-active' : kpi.status === 'at_risk' ? 'badge-pending' : 'badge-rejected'}>
                    {kpi.status.replace('_', ' ')}
                  </span>
                  {canManage && (
                    <>
                      <button onClick={e => { e.stopPropagation(); setEditKpi(kpi); }} className="p-1 hover:bg-muted rounded ml-1"><Pencil size={13} className="text-muted-foreground" /></button>
                      <button onClick={e => { e.stopPropagation(); setDeleteConfirm(kpi.id); }} className="p-1 hover:bg-destructive/10 rounded"><Trash2 size={13} className="text-destructive" /></button>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-2xl font-bold">{kpi.actual.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">/ {kpi.target.toLocaleString()} {kpi.unit}</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-3">
                <div className={`h-full rounded-full ${kpi.status === 'on_track' ? 'bg-success' : kpi.status === 'at_risk' ? 'bg-warning' : 'bg-destructive'}`} style={{ width: `${pct}%` }} />
              </div>
              <div className="h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <Line type="monotone" dataKey="value" stroke={kpi.status === 'on_track' ? 'hsl(142, 71%, 45%)' : kpi.status === 'at_risk' ? 'hsl(38, 92%, 50%)' : 'hsl(0, 72%, 51%)'} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Owner: {kpi.owner} · {kpi.department}</p>
            </div>
          );
        })}
      </div>

      {/* Create KPI Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="bg-card rounded-lg border p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Create New KPI</h3>
              <button onClick={() => setShowCreate(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div><label className="text-sm font-medium">KPI Name *</label><input name="name" required className="w-full mt-1 px-3 py-2 rounded-md border text-sm" placeholder="e.g., Employee Retention Rate" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium">Category</label>
                  <select name="category" className="w-full mt-1 px-3 py-2 rounded-md border text-sm">
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><label className="text-sm font-medium">Frequency</label>
                  <select name="frequency" className="w-full mt-1 px-3 py-2 rounded-md border text-sm">
                    {frequencies.map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="text-sm font-medium">Target *</label><input name="target" type="number" step="any" required className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
                <div><label className="text-sm font-medium">Current Value *</label><input name="actual" type="number" step="any" required className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
                <div><label className="text-sm font-medium">Unit</label><input name="unit" className="w-full mt-1 px-3 py-2 rounded-md border text-sm" placeholder="%, days, Ksh" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium">Owner</label><input name="owner" className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
                <div><label className="text-sm font-medium">Department</label><input name="department" className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              </div>
              <button type="submit" className="w-full py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Create KPI</button>
            </form>
          </div>
        </div>
      )}

      {/* KPI Detail Modal */}
      {selectedKpi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="bg-card rounded-lg border p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">{selectedKpi.name}</h3>
              <button onClick={() => setSelectedKpi(null)}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-muted-foreground">Category</p><p className="font-medium">{selectedKpi.category}</p></div>
                <div><p className="text-xs text-muted-foreground">Frequency</p><p className="font-medium">{selectedKpi.frequency}</p></div>
                <div><p className="text-xs text-muted-foreground">Target</p><p className="font-medium">{selectedKpi.target} {selectedKpi.unit}</p></div>
                <div><p className="text-xs text-muted-foreground">Current</p><p className="font-medium">{selectedKpi.actual} {selectedKpi.unit}</p></div>
                <div><p className="text-xs text-muted-foreground">Owner</p><p className="font-medium">{selectedKpi.owner}</p></div>
                <div><p className="text-xs text-muted-foreground">Department</p><p className="font-medium">{selectedKpi.department}</p></div>
              </div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedKpi.trend.map((v, i) => ({ period: `Period ${i + 1}`, value: v }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="hsl(217, 55%, 18%)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div>
                <label className="text-sm font-medium">Update Current Value</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="number"
                    step="any"
                    defaultValue={selectedKpi.actual}
                    id="kpi-update-val"
                    className="flex-1 px-3 py-2 rounded-md border text-sm"
                  />
                  <button
                    onClick={() => {
                      const el = document.getElementById('kpi-update-val') as HTMLInputElement;
                      handleUpdateActual(selectedKpi.id, parseFloat(el.value));
                      setSelectedKpi(null);
                    }}
                    className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="bg-card rounded-lg border p-6 w-full max-w-sm text-center">
            <Trash2 size={32} className="text-destructive mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Delete KPI?</h3>
            <p className="text-sm text-muted-foreground mb-4">This will remove the KPI and all its tracking data.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2 rounded-md border text-sm">Cancel</button>
              <button onClick={() => { setKpis(prev => prev.filter(k => k.id !== deleteConfirm)); setDeleteConfirm(null); toast.success('KPI deleted'); }} className="flex-1 px-4 py-2 rounded-md bg-destructive text-destructive-foreground text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
