import { attendanceRecords } from '@/data/hrData';
import { useNavigate } from 'react-router-dom';

export default function Attendance() {
  const navigate = useNavigate();
  const present = attendanceRecords.filter(r => r.status === 'Present');
  const late = attendanceRecords.filter(r => r.status === 'Late');
  const absent = attendanceRecords.filter(r => r.status === 'Absent');
  const totalOT = attendanceRecords.reduce((s, r) => s + (r.overtime || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card"><div><p className="stat-label">Present Today</p><p className="stat-value">{present.length}</p></div></div>
        <div className="stat-card"><div><p className="stat-label">Late Arrivals</p><p className="stat-value">{late.length}</p></div></div>
        <div className="stat-card"><div><p className="stat-label">Absent</p><p className="stat-value">{absent.length}</p></div></div>
        <div className="stat-card"><div><p className="stat-label">Overtime Hours</p><p className="stat-value">{totalOT}h</p></div></div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Attendance — Friday, 3 April 2026</h3>
        <div className="flex gap-3">
          <select className="px-3 py-2 rounded-md border bg-card text-sm"><option>All Departments</option></select>
          <button className="px-4 py-2 rounded-md border bg-card text-sm font-medium hover:bg-muted">Export</button>
        </div>
      </div>

      <div className="bg-card rounded-lg border overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>Employee</th><th>Department</th><th>→ Clock In</th><th>← Clock Out</th><th>Hours</th><th>Overtime</th><th>Status</th></tr></thead>
          <tbody>
            {attendanceRecords.map(r => (
              <tr key={r.employeeId} className="cursor-pointer" onClick={() => navigate(`/employees/${r.employeeId}`)}>
                <td><div><p className="font-medium">{r.employeeName}</p><p className="text-xs text-muted-foreground">{r.employeeId}</p></div></td>
                <td>{r.department}</td>
                <td>{r.clockIn || '—'}</td>
                <td>{r.clockOut || '—'}</td>
                <td className="font-medium">{r.hours ?? '—'}</td>
                <td>{r.overtime ? <span className="text-info font-medium">{r.overtime}h</span> : '—'}</td>
                <td>
                  <span className={
                    r.status === 'Present' ? 'badge-active' :
                    r.status === 'Late' ? 'badge-pending' :
                    r.status === 'Absent' ? 'badge-rejected' : 'badge-info'
                  }>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
