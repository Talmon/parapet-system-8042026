import { useState } from 'react';
import {
  attendanceRecords, biometricEnrollments, attendancePolicies, overtimeEntries, monthlySummaries,
  type AttendanceRecord, type OvertimeEntry
} from '@/data/attendanceData';
import { Clock, Users, AlertTriangle, CheckCircle, Fingerprint, Shield, Timer, TrendingUp, X, Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import ProcessGuide from '@/components/ProcessGuide';
import { useAuth } from '@/contexts/AuthContext';

const attendanceWorkflowSteps = [
  { step: 1, title: 'Biometric Enrolment', who: 'HR Manager', description: 'All employees and operations staff are enrolled in the biometric system (fingerprint/face ID) at their work location.' },
  { step: 2, title: 'Time In / Time Out Registration', who: 'Employee', description: 'Each workday, employees clock in and out using the biometric device or mobile app.' },
  { step: 3, title: 'Operations Attendance in Station', who: 'Supervisor', description: 'For field/station staff, supervisors mark attendance via the system or app and verify physical presence.' },
  { step: 4, title: 'Real-Time Attendance Capture', who: 'System', description: 'The system captures timestamps, location data, and attendance status in real time.' },
  { step: 5, title: 'Data Synchronization', who: 'System', description: 'Attendance data from all devices and locations is synchronized to the central HRMIS every hour.' },
  { step: 6, title: 'Attendance Monitoring', who: 'Supervisor', description: 'Supervisors review daily attendance dashboards and follow up on absences or late arrivals.' },
  { step: 7, title: 'Attendance Policy Validation', who: 'System', description: 'The system automatically flags policy violations (late arrivals, early departures, consecutive absences).' },
  { step: 8, title: 'Leave & Absence Handling', who: 'HR Manager', description: 'Approved leave is reconciled against attendance data; unexplained absences trigger an alert.' },
  { step: 9, title: 'Overtime & Payroll Processing', who: 'HR Manager', description: 'Overtime hours are extracted, approved by supervisors, and fed into payroll for computation.' },
  { step: 10, title: 'Reporting & Analytics', who: 'HR Manager', description: 'Monthly attendance reports are generated for HR, management, and statutory compliance purposes.' },
];

export default function Attendance() {
  const { hasRole } = useAuth();
  const canManage = hasRole('admin', 'hr_manager', 'supervisor');
  const [tab, setTab] = useState<'daily' | 'enrollment' | 'policies' | 'overtime' | 'reports'>('daily');
  const [selectedDate, setSelectedDate] = useState('2026-04-07');
  const [filterDept, setFilterDept] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [otEntries, setOtEntries] = useState<OvertimeEntry[]>(overtimeEntries);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

  const dayRecords = attendanceRecords.filter(r => r.date === selectedDate);
  const filteredRecords = dayRecords.filter(r => {
    const matchDept = filterDept === 'All' || r.department === filterDept;
    const matchStatus = filterStatus === 'All' || r.status === filterStatus;
    return matchDept && matchStatus;
  });

  const present = dayRecords.filter(r => r.status === 'Present' || r.status === 'Remote');
  const late = dayRecords.filter(r => r.status === 'Late');
  const absent = dayRecords.filter(r => r.status === 'Absent');
  const violations = dayRecords.filter(r => r.policyViolation);

  const departments = [...new Set(attendanceRecords.map(r => r.department))];
  const statuses = ['Present', 'Late', 'Absent', 'Half Day', 'On Leave', 'Remote'];

  const approveOvertime = (id: string) => {
    setOtEntries(prev => prev.map(o => o.id === id ? { ...o, status: 'approved' as const, approvedBy: 'HR Admin' } : o));
    toast.success('Overtime approved');
  };

  const tabs = [
    { key: 'daily' as const, label: 'Daily Attendance', icon: Clock },
    { key: 'enrollment' as const, label: 'Biometric Enrollment', icon: Fingerprint },
    { key: 'policies' as const, label: 'Attendance Policies', icon: Shield },
    { key: 'overtime' as const, label: 'Overtime & Payroll', icon: Timer },
    { key: 'reports' as const, label: 'Reports & Analytics', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <ProcessGuide
        title="Attendance Management"
        description="10-step process from biometric enrolment to payroll & analytics"
        steps={attendanceWorkflowSteps}
        tips={[
          'Biometric enrolment must be completed before an employee can clock in.',
          'Operations staff must be marked by supervisor if no biometric device is available on site.',
          'Three consecutive unexplained absences trigger an automatic HR alert.',
          'Overtime must be pre-approved; unapproved overtime cannot be paid.',
          'Monthly attendance reports feed directly into payroll computation.',
        ]}
      />
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card"><div><p className="stat-label">Present Today</p><p className="stat-value">{present.length}</p></div><CheckCircle size={22} className="text-green-600" /></div>
        <div className="stat-card"><div><p className="stat-label">Late Arrivals</p><p className="stat-value text-amber-600">{late.length}</p></div><Clock size={22} className="text-amber-600" /></div>
        <div className="stat-card"><div><p className="stat-label">Absent</p><p className="stat-value text-red-600">{absent.length}</p></div><Users size={22} className="text-red-600" /></div>
        <div className="stat-card"><div><p className="stat-label">Policy Violations</p><p className="stat-value text-red-500">{violations.length}</p></div><AlertTriangle size={22} className="text-red-500" /></div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b overflow-x-auto">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`px-3 py-2 text-sm font-medium border-b-2 whitespace-nowrap inline-flex items-center gap-1.5 ${tab === t.key ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground'}`}>
            <t.icon size={14} />{t.label}
          </button>
        ))}
      </div>

      {/* DAILY ATTENDANCE */}
      {tab === 'daily' && (
        <>
          <div className="flex flex-wrap gap-3 items-center">
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="px-3 py-2 rounded-md border bg-card text-sm" />
            <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="px-3 py-2 rounded-md border bg-card text-sm">
              <option value="All">All Departments</option>
              {departments.map(d => <option key={d}>{d}</option>)}
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 rounded-md border bg-card text-sm">
              <option value="All">All Status</option>
              {statuses.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="bg-card rounded-lg border overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Employee</th><th>Department</th><th>Clock In</th><th>Clock Out</th><th>Hours</th><th>OT</th><th>Source</th><th>Status</th><th>Violations</th></tr></thead>
              <tbody>
                {filteredRecords.map(r => (
                  <tr key={r.id} className="cursor-pointer" onClick={() => setSelectedRecord(r)}>
                    <td><div><p className="font-medium">{r.employeeName}</p><p className="text-xs text-muted-foreground">{r.employeeId}</p></div></td>
                    <td>{r.department}</td>
                    <td className="font-mono">{r.clockIn || '—'}</td>
                    <td className="font-mono">{r.clockOut || '—'}</td>
                    <td className="font-medium">{r.hours?.toFixed(1) || '—'}</td>
                    <td>{r.overtime ? <span className="font-medium text-blue-600">{r.overtime}h</span> : '—'}</td>
                    <td><span className="text-xs px-1.5 py-0.5 rounded bg-muted">{r.source}</span></td>
                    <td><span className={r.status === 'Present' || r.status === 'Remote' ? 'badge-active' : r.status === 'Late' ? 'badge-pending' : r.status === 'Absent' ? 'badge-rejected' : r.status === 'On Leave' ? 'badge-info' : 'badge-pending'}>{r.status}</span></td>
                    <td>{r.policyViolation ? <span className="text-xs text-destructive font-medium">⚠ {r.policyViolation}</span> : '—'}</td>
                  </tr>
                ))}
                {filteredRecords.length === 0 && <tr><td colSpan={9} className="text-center py-8 text-muted-foreground">No records for this date</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* BIOMETRIC ENROLLMENT */}
      {tab === 'enrollment' && (
        <div className="bg-card rounded-lg border overflow-x-auto">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">Biometric Enrollment Status</h3>
            <div className="text-sm text-muted-foreground">
              Enrolled: {biometricEnrollments.filter(b => b.status === 'enrolled').length}/{biometricEnrollments.length}
            </div>
          </div>
          <table className="data-table">
            <thead><tr><th>Employee</th><th>Department</th><th>Method</th><th>Enrollment Date</th><th>Device Location</th><th>Status</th></tr></thead>
            <tbody>
              {biometricEnrollments.map(b => (
                <tr key={b.employeeId}>
                  <td><div><p className="font-medium">{b.employeeName}</p><p className="text-xs text-muted-foreground">{b.employeeId}</p></div></td>
                  <td>{b.department}</td>
                  <td><span className="badge-info">{b.method}</span></td>
                  <td>{b.enrollmentDate || '—'}</td>
                  <td className="text-sm">{b.deviceLocation}</td>
                  <td><span className={b.status === 'enrolled' ? 'badge-active' : b.status === 'pending' ? 'badge-pending' : 'badge-rejected'}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* POLICIES */}
      {tab === 'policies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {attendancePolicies.map(p => (
            <div key={p.id} className="bg-card rounded-lg border p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold">{p.name}</h4>
                  <p className="text-xs text-muted-foreground">{p.description}</p>
                </div>
                <span className={p.status === 'active' ? 'badge-active' : 'badge-pending'}>{p.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-muted/50 rounded p-2"><span className="text-xs text-muted-foreground">Shift</span><p className="font-medium">{p.shiftStart} — {p.shiftEnd}</p></div>
                <div className="bg-muted/50 rounded p-2"><span className="text-xs text-muted-foreground">Grace Period</span><p className="font-medium">{p.graceMinutes} min</p></div>
                <div className="bg-muted/50 rounded p-2"><span className="text-xs text-muted-foreground">Min Hours</span><p className="font-medium">{p.minHours}h</p></div>
                <div className="bg-muted/50 rounded p-2"><span className="text-xs text-muted-foreground">OT Rate</span><p className="font-medium">{p.overtimeRate}x after {p.overtimeAfter}h</p></div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Applies to: {p.appliesTo}</p>
            </div>
          ))}
        </div>
      )}

      {/* OVERTIME */}
      {tab === 'overtime' && (
        <div className="bg-card rounded-lg border overflow-x-auto">
          <div className="p-4 border-b"><h3 className="font-semibold">Overtime Entries & Payroll Processing</h3></div>
          <table className="data-table">
            <thead><tr><th>Employee</th><th>Department</th><th>Date</th><th>Regular</th><th>OT Hours</th><th>Rate</th><th>Approved By</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {otEntries.map(o => (
                <tr key={o.id}>
                  <td className="font-medium">{o.employeeName}</td>
                  <td>{o.department}</td>
                  <td>{o.date}</td>
                  <td>{o.regularHours}h</td>
                  <td className="font-bold text-blue-600">{o.overtimeHours}h</td>
                  <td>{o.rate}x</td>
                  <td>{o.approvedBy || '—'}</td>
                  <td><span className={o.status === 'approved' ? 'badge-active' : o.status === 'processed' ? 'badge-info' : o.status === 'rejected' ? 'badge-rejected' : 'badge-pending'}>{o.status}</span></td>
                  <td>
                    {o.status === 'pending' && (
                      <button onClick={() => approveOvertime(o.id)} className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200">Approve</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* REPORTS */}
      {tab === 'reports' && (
        <div className="bg-card rounded-lg border overflow-x-auto">
          <div className="p-4 border-b"><h3 className="font-semibold">Monthly Attendance Summary — March 2026</h3></div>
          <table className="data-table">
            <thead><tr><th>Employee</th><th>Department</th><th>Present</th><th>Late</th><th>Absent</th><th>Half Day</th><th>On Leave</th><th>Remote</th><th>Total Hours</th><th>OT Hours</th><th>Rate</th></tr></thead>
            <tbody>
              {monthlySummaries.map(s => (
                <tr key={s.employeeId}>
                  <td className="font-medium">{s.employeeName}</td>
                  <td>{s.department}</td>
                  <td className="text-green-600 font-medium">{s.present}</td>
                  <td className={s.late > 2 ? 'text-amber-600 font-medium' : ''}>{s.late}</td>
                  <td className={s.absent > 0 ? 'text-red-600 font-medium' : ''}>{s.absent}</td>
                  <td>{s.halfDay}</td>
                  <td>{s.onLeave}</td>
                  <td>{s.remote}</td>
                  <td className="font-medium">{s.totalHours}h</td>
                  <td className="text-blue-600">{s.overtimeHours}h</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${s.attendanceRate >= 95 ? 'bg-green-500' : s.attendanceRate >= 80 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${s.attendanceRate}%` }} />
                      </div>
                      <span className="text-xs">{s.attendanceRate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* RECORD DETAIL MODAL */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="bg-card rounded-lg border p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{selectedRecord.employeeName}</h3>
              <button onClick={() => setSelectedRecord(null)}><X size={20} /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-muted-foreground">Date:</span> <strong>{selectedRecord.date}</strong></div>
                <div><span className="text-muted-foreground">Status:</span> <span className={selectedRecord.status === 'Present' ? 'badge-active' : selectedRecord.status === 'Late' ? 'badge-pending' : 'badge-rejected'}>{selectedRecord.status}</span></div>
                <div><span className="text-muted-foreground">Clock In:</span> <strong>{selectedRecord.clockIn || '—'}</strong></div>
                <div><span className="text-muted-foreground">Clock Out:</span> <strong>{selectedRecord.clockOut || '—'}</strong></div>
                <div><span className="text-muted-foreground">Hours:</span> <strong>{selectedRecord.hours?.toFixed(1) || '—'}</strong></div>
                <div><span className="text-muted-foreground">Overtime:</span> <strong>{selectedRecord.overtime || 0}h</strong></div>
                <div><span className="text-muted-foreground">Source:</span> <strong>{selectedRecord.source}</strong></div>
                <div><span className="text-muted-foreground">Shift:</span> <strong>{selectedRecord.shiftType}</strong></div>
              </div>
              {selectedRecord.policyViolation && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-xs font-semibold text-red-700 mb-1">⚠ Policy Violation</p>
                  <p className="text-sm text-red-600">{selectedRecord.policyViolation}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
