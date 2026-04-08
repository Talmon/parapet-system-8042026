import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { employees } from '@/data/hrData';
import { Search, Plus, Pencil, Trash2, Eye, X, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import ProcessGuide from '@/components/ProcessGuide';
import { useAuth } from '@/contexts/AuthContext';

const employeeWorkflowSteps = [
  { step: 1, title: 'Employee Onboarded via Recruitment', who: 'HR Manager', description: 'New employee record is created after a successful recruitment process and signed contract.' },
  { step: 2, title: 'Employee Profile Setup', who: 'HR Manager', description: 'Full profile created: personal details, job info, banking details, emergency contacts, and statutory numbers (KRA PIN, NSSF, SHIF).' },
  { step: 3, title: 'Benefits Enrollment', who: 'HR Manager', description: 'Employee is enrolled in NSSF, SHIF, medical scheme, and any other applicable benefits.' },
  { step: 4, title: 'Biometric Registration', who: 'HR Manager', description: 'Employee registered on attendance biometric system for time and attendance tracking.' },
  { step: 5, title: 'Continuous Record Updates', who: 'HR Manager', description: 'Records updated for promotions, transfers, salary changes, disciplinary actions, and leave.' },
  { step: 6, title: 'Performance & Career Management', who: 'Supervisor', description: 'Quarterly performance reviews linked to employee profile for career progression tracking.' },
  { step: 7, title: 'Offboarding / Exit', who: 'HR Manager', description: 'When an employee exits, record is updated with exit date, reason, and clearance confirmation.' },
];

const departments = ['All Departments', ...new Set(employees.map(e => e.department))];
const statuses = ['All Status', 'Active', 'On Leave', 'Consultant'];

export default function EmployeeDirectory() {
  const { hasRole } = useAuth();
  const canManage = hasRole('admin', 'hr_manager');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
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
      <ProcessGuide
        title="Employee Directory"
        description="7-step employee lifecycle from onboarding to offboarding"
        steps={employeeWorkflowSteps}
        tips={[
          'All statutory IDs (KRA PIN, NSSF, SHIF) are mandatory before first payroll.',
          'Banking details must be verified before processing any salary payments.',
          'Employee records must be updated within 5 days of any change.',
          'Termination records must include clearance confirmation and final pay details.',
        ]}
      />
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
        {canManage && (
          <button onClick={() => setShowAddEmployee(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium whitespace-nowrap hover:opacity-90">
            <UserPlus size={16} /> Add Employee
          </button>
        )}
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
              <th>Actions</th>
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
                <td onClick={e => e.stopPropagation()}>
                  <div className="flex gap-1">
                    <button onClick={() => navigate(`/employees/${emp.id}`)} className="p-1 hover:bg-muted rounded" title="View Profile"><Eye size={15} className="text-muted-foreground" /></button>
                    {canManage && <button onClick={() => toast.info('Edit employee coming soon')} className="p-1 hover:bg-muted rounded" title="Edit"><Pencil size={15} className="text-muted-foreground" /></button>}
                    {canManage && <button onClick={() => setDeleteConfirm(emp.id)} className="p-1 hover:bg-destructive/10 rounded" title="Delete"><Trash2 size={15} className="text-destructive" /></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Page {page} of {totalPages} · Showing {paginated.length} of {filtered.length} employees</p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 rounded border text-sm disabled:opacity-50 hover:bg-muted">Previous</button>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 rounded border text-sm disabled:opacity-50 hover:bg-muted">Next</button>
          </div>
        </div>
      )}

      {showAddEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
          <div className="bg-card rounded-lg border p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-lg">Add New Employee</h3><button onClick={() => setShowAddEmployee(false)}><X size={20} /></button></div>
            <form onSubmit={e => { e.preventDefault(); setShowAddEmployee(false); toast.success('Employee added successfully (demo)'); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2"><label className="text-sm font-medium">Full Name</label><input name="name" required className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
                <div><label className="text-sm font-medium">Email</label><input type="email" name="email" required className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
                <div><label className="text-sm font-medium">Phone</label><input name="phone" className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
                <div><label className="text-sm font-medium">Department</label>
                  <select name="department" className="w-full mt-1 px-3 py-2 rounded-md border text-sm">
                    {['Engineering', 'Finance', 'HR', 'IT', 'Marketing', 'Operations', 'Sales'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div><label className="text-sm font-medium">Job Title</label><input name="jobTitle" required className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
                <div><label className="text-sm font-medium">Employee Type</label>
                  <select name="type" className="w-full mt-1 px-3 py-2 rounded-md border text-sm"><option>Employee</option><option>Consultant</option></select>
                </div>
                <div><label className="text-sm font-medium">Gross Pay (Ksh)</label><input type="number" name="grossPay" required className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
                <div><label className="text-sm font-medium">Join Date</label><input type="date" name="joinDate" required className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
                <div><label className="text-sm font-medium">KRA PIN</label><input name="kraPin" className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
                <div><label className="text-sm font-medium">NSSF No.</label><input name="nssf" className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              </div>
              <button type="submit" className="w-full py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium">Add Employee</button>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="bg-card rounded-lg border p-6 w-full max-w-sm text-center">
            <Trash2 size={32} className="text-destructive mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Delete Employee Record?</h3>
            <p className="text-sm text-muted-foreground mb-1">ID: {deleteConfirm}</p>
            <p className="text-sm text-muted-foreground mb-4">This is a demo action and will not persist.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2 rounded-md border text-sm">Cancel</button>
              <button onClick={() => { setDeleteConfirm(null); toast.success('Employee record marked for deletion (demo)'); }} className="flex-1 px-4 py-2 rounded-md bg-destructive text-destructive-foreground text-sm font-medium">Confirm Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
