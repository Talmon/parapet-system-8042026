import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { employees } from '@/data/hrData';
import { Search } from 'lucide-react';

const departments = ['All Departments', ...new Set(employees.map(e => e.department))];
const statuses = ['All Status', 'Active', 'On Leave', 'Consultant'];

export default function EmployeeDirectory() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState(searchParams.get('department') || 'All Departments');
  const [status, setStatus] = useState(searchParams.get('type') === 'consultant' ? 'Consultant' : 'All Status');
  const [page, setPage] = useState(1);
  const perPage = 50;

  const filtered = useMemo(() => {
    return employees.filter(e => {
      const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase());
      const matchDept = dept === 'All Departments' || e.department === dept;
      const matchStatus = status === 'All Status' || (status === 'Consultant' ? e.type === 'Consultant' : e.status === status);
      return matchSearch && matchDept && matchStatus;
    });
  }, [search, dept, status]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, ID, or email..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-md border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select value={dept} onChange={e => { setDept(e.target.value); setPage(1); }} className="px-3 py-2.5 rounded-md border bg-card text-sm">
          {departments.map(d => <option key={d}>{d}</option>)}
        </select>
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className="px-3 py-2.5 rounded-md border bg-card text-sm">
          {statuses.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length.toLocaleString()} employees shown</p>

      <div className="bg-card rounded-lg border overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>ID</th>
              <th>Department</th>
              <th>Job Title</th>
              <th>Type</th>
              <th>Status</th>
              <th className="text-right">Gross Pay</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(emp => (
              <tr key={emp.id} className="cursor-pointer" onClick={() => navigate(`/employees/${emp.id}`)}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                      {emp.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{emp.name}</p>
                      <p className="text-xs text-muted-foreground">{emp.email}</p>
                    </div>
                  </div>
                </td>
                <td className="text-muted-foreground">{emp.id}</td>
                <td>{emp.department}</td>
                <td>{emp.jobTitle}</td>
                <td><span className={emp.type === 'Consultant' ? 'badge-consultant' : 'badge-employee'}>{emp.type}</span></td>
                <td><span className={emp.status === 'Active' ? 'badge-active' : 'badge-pending'}>{emp.status}</span></td>
                <td className="text-right font-medium">Ksh {emp.grossPay.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 rounded border text-sm disabled:opacity-50 hover:bg-muted">Previous</button>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 rounded border text-sm disabled:opacity-50 hover:bg-muted">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
