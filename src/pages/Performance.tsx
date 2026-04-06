import { useState } from 'react';
import { performanceReviews } from '@/data/hrData';
import { Star } from 'lucide-react';

export default function Performance() {
  const [tab, setTab] = useState<'reviews' | 'okrs'>('reviews');
  const completed = performanceReviews.filter(r => r.status === 'completed');
  const avgRating = completed.reduce((s, r) => s + (r.rating || 0), 0) / completed.length;
  const totalGoals = performanceReviews.reduce((s, r) => s + r.goalsTotal, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card"><div><p className="stat-label">Reviews Completed</p><p className="stat-value">{completed.length}/{performanceReviews.length}</p></div></div>
        <div className="stat-card"><div><p className="stat-label">Avg. Rating</p><p className="stat-value">{avgRating.toFixed(1)}</p></div></div>
        <div className="stat-card"><div><p className="stat-label">Goals Tracked</p><p className="stat-value">{totalGoals}</p></div></div>
        <div className="stat-card"><div><p className="stat-label">Review Cycle</p><p className="stat-value">Q1 2026</p></div></div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-1 border-b">
          <button onClick={() => setTab('reviews')} className={`px-4 py-2 text-sm font-medium border-b-2 ${tab === 'reviews' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground'}`}>Performance Reviews</button>
          <button onClick={() => setTab('okrs')} className={`px-4 py-2 text-sm font-medium border-b-2 ${tab === 'okrs' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground'}`}>Company Goals (OKRs)</button>
        </div>
        <button className="px-4 py-2 rounded-md border bg-card text-sm font-medium hover:bg-muted">Start New Cycle</button>
      </div>

      {tab === 'reviews' && (
        <div className="bg-card rounded-lg border overflow-x-auto">
          <div className="p-4 flex items-center justify-between border-b">
            <h3 className="font-semibold">Employee Reviews — Q1 2026</h3>
          </div>
          <table className="data-table">
            <thead><tr><th>Employee</th><th>Department</th><th>Reviewer</th><th>Goals</th><th>Rating</th><th>Status</th></tr></thead>
            <tbody>
              {performanceReviews.map((r, i) => (
                <tr key={i}>
                  <td className="font-medium">{r.employeeName}</td>
                  <td>{r.department}</td>
                  <td>{r.reviewer}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${(r.goalsCompleted / r.goalsTotal) * 100}%` }} />
                      </div>
                      <span className="text-sm">{r.goalsCompleted}/{r.goalsTotal}</span>
                    </div>
                  </td>
                  <td>
                    {r.rating ? (
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, si) => (
                          <Star key={si} size={14} className={si < Math.round(r.rating!) ? 'fill-warning text-warning' : 'text-muted'} />
                        ))}
                        <span className="ml-1 text-sm">{r.rating}</span>
                      </div>
                    ) : '—'}
                  </td>
                  <td><span className={r.status === 'completed' ? 'badge-active' : r.status === 'in_progress' ? 'badge-info' : 'badge-pending'}>{r.status.replace('_', ' ')}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'okrs' && (
        <div className="bg-card rounded-lg border p-6">
          <p className="text-muted-foreground">Company OKRs and departmental goals tracking for Q1 2026.</p>
        </div>
      )}
    </div>
  );
}
