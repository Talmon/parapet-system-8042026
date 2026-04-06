import { useState } from 'react';
import { jobPostings, JobPosting } from '@/data/hrData';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';

export default function Recruitment() {
  const [jobs, setJobs] = useState<JobPosting[]>(jobPostings);
  const [tab, setTab] = useState<'postings' | 'pipeline' | 'candidates'>('postings');
  const [showNew, setShowNew] = useState(false);

  const active = jobs.filter(j => j.status === 'active');
  const totalApplicants = jobs.reduce((s, j) => s + j.applicants, 0);
  const inPipeline = jobs.filter(j => j.status === 'active').reduce((s, j) => s + j.shortlisted, 0);
  const avgTime = 23;

  const handlePost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newJob: JobPosting = {
      id: `JOB-${String(jobs.length + 1).padStart(3, '0')}`,
      position: fd.get('position') as string,
      department: fd.get('department') as string,
      location: fd.get('location') as string,
      type: fd.get('type') as string,
      postedDate: new Date().toISOString().split('T')[0],
      applicants: 0, shortlisted: 0, interviews: 0,
      status: 'active',
    };
    setJobs(prev => [newJob, ...prev]);
    setShowNew(false);
    toast.success('Job posted successfully');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card"><div><p className="stat-label">Active Openings</p><p className="stat-value">{active.length}</p></div></div>
        <div className="stat-card"><div><p className="stat-label">Total Applicants</p><p className="stat-value">{totalApplicants}</p></div></div>
        <div className="stat-card"><div><p className="stat-label">In Pipeline</p><p className="stat-value">{inPipeline}</p></div></div>
        <div className="stat-card"><div><p className="stat-label">Avg. Time to Hire</p><p className="stat-value">{avgTime} days</p></div></div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-1 border-b">
          {(['postings', 'pipeline', 'candidates'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 ${tab === t ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground'}`}>
              {t === 'postings' ? 'Job Postings' : t === 'pipeline' ? 'Hiring Pipeline' : 'Candidates'}
            </button>
          ))}
        </div>
        <button onClick={() => setShowNew(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-md border bg-card text-sm font-medium hover:bg-muted">
          <Plus size={16} /> Post New Job
        </button>
      </div>

      {tab === 'postings' && (
        <div className="bg-card rounded-lg border overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Position</th><th>Department</th><th>Location</th><th>Applicants</th><th>Shortlisted</th><th>Interviews</th><th>Status</th></tr></thead>
            <tbody>
              {jobs.map(j => (
                <tr key={j.id}>
                  <td><div><p className="font-medium">{j.position}</p><p className="text-xs text-muted-foreground">{j.type} · Posted {j.postedDate}</p></div></td>
                  <td>{j.department}</td>
                  <td>{j.location}</td>
                  <td className="font-bold">{j.applicants}</td>
                  <td>{j.shortlisted}</td>
                  <td>{j.interviews}</td>
                  <td><span className={j.status === 'active' ? 'badge-active' : j.status === 'closed' ? 'badge-rejected' : 'badge-pending'}>{j.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === 'pipeline' && <div className="bg-card rounded-lg border p-6"><p className="text-muted-foreground">Visual hiring pipeline with drag-and-drop stages.</p></div>}
      {tab === 'candidates' && <div className="bg-card rounded-lg border p-6"><p className="text-muted-foreground">Candidate database with search and filtering.</p></div>}

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="bg-card rounded-lg border p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4"><h3 className="font-semibold">Post New Job</h3><button onClick={() => setShowNew(false)}><X size={20} /></button></div>
            <form onSubmit={handlePost} className="space-y-4">
              <div><label className="text-sm font-medium">Position</label><input name="position" required className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              <div><label className="text-sm font-medium">Department</label><input name="department" required className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium">Location</label><input name="location" className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
                <div><label className="text-sm font-medium">Type</label>
                  <select name="type" className="w-full mt-1 px-3 py-2 rounded-md border text-sm">
                    <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium">Post Job</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
