// Attendance Module Data — Full Workflow

export interface BiometricEnrollment {
  employeeId: string;
  employeeName: string;
  department: string;
  enrollmentDate: string;
  method: 'Fingerprint' | 'Facial Recognition' | 'Card' | 'Mobile App';
  status: 'enrolled' | 'pending' | 'failed';
  deviceLocation: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  hours: number | null;
  overtime: number | null;
  status: 'Present' | 'Late' | 'Absent' | 'Half Day' | 'On Leave' | 'Remote';
  source: 'Biometric' | 'Mobile App' | 'Manual' | 'System';
  location: string;
  shiftType: 'Day' | 'Night' | 'Flexible';
  notes: string;
  policyViolation: string | null;
}

export interface AttendancePolicy {
  id: string;
  name: string;
  description: string;
  shiftStart: string;
  shiftEnd: string;
  graceMinutes: number;
  halfDayHours: number;
  minHours: number;
  overtimeAfter: number;
  overtimeRate: number;
  appliesTo: string;
  status: 'active' | 'draft';
}

export interface OvertimeEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  regularHours: number;
  overtimeHours: number;
  rate: number;
  amount: number;
  approvedBy: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
}

export interface MonthlyAttendanceSummary {
  employeeId: string;
  employeeName: string;
  department: string;
  month: string;
  workingDays: number;
  present: number;
  late: number;
  absent: number;
  halfDay: number;
  onLeave: number;
  remote: number;
  totalHours: number;
  overtimeHours: number;
  attendanceRate: number;
}

export const biometricEnrollments: BiometricEnrollment[] = [
  { employeeId: 'PAR-0023', employeeName: 'Grace Muthoni', department: 'Engineering', enrollmentDate: '2024-06-15', method: 'Fingerprint', status: 'enrolled', deviceLocation: 'Nairobi HQ — Main Entrance' },
  { employeeId: 'PAR-0087', employeeName: 'David Ochieng', department: 'Sales', enrollmentDate: '2023-03-20', method: 'Fingerprint', status: 'enrolled', deviceLocation: 'Nairobi HQ — Main Entrance' },
  { employeeId: 'PAR-0145', employeeName: 'Amina Hassan', department: 'Finance', enrollmentDate: '2022-09-10', method: 'Facial Recognition', status: 'enrolled', deviceLocation: 'Nairobi HQ — Finance Wing' },
  { employeeId: 'PAR-0201', employeeName: 'Peter Kamau', department: 'Operations', enrollmentDate: '2024-01-05', method: 'Card', status: 'enrolled', deviceLocation: 'Mombasa Office' },
  { employeeId: 'PAR-0312', employeeName: 'Jane Wanjiku', department: 'Human Resources', enrollmentDate: '2021-11-20', method: 'Fingerprint', status: 'enrolled', deviceLocation: 'Nairobi HQ — HR Floor' },
  { employeeId: 'PAR-0099', employeeName: 'Samuel Kiprop', department: 'IT', enrollmentDate: '2023-07-01', method: 'Mobile App', status: 'enrolled', deviceLocation: 'Remote / Multi-site' },
  { employeeId: 'PAR-0456', employeeName: 'Lucy Akinyi', department: 'Marketing', enrollmentDate: '2025-01-15', method: 'Fingerprint', status: 'enrolled', deviceLocation: 'Nairobi HQ — Main Entrance' },
  { employeeId: 'PAR-0178', employeeName: 'Brian Mwangi', department: 'Engineering', enrollmentDate: '2024-08-20', method: 'Facial Recognition', status: 'enrolled', deviceLocation: 'Nairobi HQ — Tech Block' },
  { employeeId: 'PAR-5001', employeeName: 'New Hire — Mercy Odhiambo', department: 'Sales', enrollmentDate: '', method: 'Fingerprint', status: 'pending', deviceLocation: 'Kisumu Office' },
  { employeeId: 'PAR-5002', employeeName: 'New Hire — Collins Wekesa', department: 'Operations', enrollmentDate: '', method: 'Card', status: 'failed', deviceLocation: 'Nakuru Branch' },
];

const generateWeekRecords = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const days = ['2026-04-07', '2026-04-06', '2026-04-05', '2026-04-04', '2026-04-03'];
  const emps = [
    { id: 'PAR-0023', name: 'Grace Muthoni', dept: 'Engineering' },
    { id: 'PAR-0087', name: 'David Ochieng', dept: 'Sales' },
    { id: 'PAR-0145', name: 'Amina Hassan', dept: 'Finance' },
    { id: 'PAR-0201', name: 'Peter Kamau', dept: 'Operations' },
    { id: 'PAR-0312', name: 'Jane Wanjiku', dept: 'Human Resources' },
    { id: 'PAR-0099', name: 'Samuel Kiprop', dept: 'IT' },
    { id: 'PAR-0456', name: 'Lucy Akinyi', dept: 'Marketing' },
    { id: 'PAR-0178', name: 'Brian Mwangi', dept: 'Engineering' },
    { id: 'PAR-0055', name: 'Faith Njeri', dept: 'Customer Support' },
    { id: 'PAR-0333', name: 'Kevin Langat', dept: 'Finance' },
    { id: 'PAR-0210', name: 'Esther Cheruiyot', dept: 'Legal' },
    { id: 'PAR-0400', name: 'Patrick Musyoka', dept: 'Administration' },
  ];
  const patterns: Record<string, { clockIn: string; clockOut: string; status: AttendanceRecord['status']; ot: number; source: AttendanceRecord['source']; violation: string | null }[]> = {
    'PAR-0023': [{ clockIn: '07:55', clockOut: '17:10', status: 'Present', ot: 1, source: 'Biometric', violation: null }, { clockIn: '08:02', clockOut: '17:05', status: 'Present', ot: 1, source: 'Biometric', violation: null }, { clockIn: '07:50', clockOut: '18:00', status: 'Present', ot: 2, source: 'Biometric', violation: null }, { clockIn: '08:00', clockOut: '17:00', status: 'Present', ot: 0, source: 'Biometric', violation: null }, { clockIn: '08:05', clockOut: '17:15', status: 'Present', ot: 1, source: 'Biometric', violation: null }],
    'PAR-0087': [{ clockIn: '09:20', clockOut: '17:30', status: 'Late', ot: 0, source: 'Biometric', violation: 'Late arrival — 80 min past grace' }, { clockIn: '09:15', clockOut: '17:30', status: 'Late', ot: 0, source: 'Biometric', violation: 'Late arrival — 75 min past grace' }, { clockIn: '08:10', clockOut: '17:00', status: 'Present', ot: 0, source: 'Biometric', violation: null }, { clockIn: '08:30', clockOut: '17:15', status: 'Present', ot: 0, source: 'Biometric', violation: null }, { clockIn: '09:00', clockOut: '17:00', status: 'Late', ot: 0, source: 'Biometric', violation: 'Late — 3rd time this month' }],
    'PAR-0145': [{ clockIn: '07:50', clockOut: '17:00', status: 'Present', ot: 1, source: 'Biometric', violation: null }, { clockIn: '07:55', clockOut: '17:00', status: 'Present', ot: 1, source: 'Biometric', violation: null }, { clockIn: '07:45', clockOut: '18:30', status: 'Present', ot: 2.5, source: 'Biometric', violation: null }, { clockIn: '08:00', clockOut: '17:00', status: 'Present', ot: 0, source: 'Biometric', violation: null }, { clockIn: '07:55', clockOut: '17:00', status: 'Present', ot: 1, source: 'Biometric', violation: null }],
    'PAR-0201': [{ clockIn: '', clockOut: '', status: 'On Leave', ot: 0, source: 'System', violation: null }, { clockIn: '', clockOut: '', status: 'Absent', ot: 0, source: 'System', violation: 'Unauthorized absence — no leave request' }, { clockIn: '08:00', clockOut: '13:00', status: 'Half Day', ot: 0, source: 'Biometric', violation: null }, { clockIn: '08:00', clockOut: '17:00', status: 'Present', ot: 0, source: 'Biometric', violation: null }, { clockIn: '08:10', clockOut: '17:00', status: 'Present', ot: 0, source: 'Biometric', violation: null }],
    'PAR-0312': [{ clockIn: '', clockOut: '', status: 'On Leave', ot: 0, source: 'System', violation: null }, { clockIn: '', clockOut: '', status: 'On Leave', ot: 0, source: 'System', violation: null }, { clockIn: '', clockOut: '', status: 'On Leave', ot: 0, source: 'System', violation: null }, { clockIn: '', clockOut: '', status: 'On Leave', ot: 0, source: 'System', violation: null }, { clockIn: '', clockOut: '', status: 'On Leave', ot: 0, source: 'System', violation: null }],
    'PAR-0099': [{ clockIn: '07:30', clockOut: '18:30', status: 'Remote', ot: 3, source: 'Mobile App', violation: null }, { clockIn: '07:45', clockOut: '18:00', status: 'Present', ot: 2, source: 'Biometric', violation: null }, { clockIn: '08:00', clockOut: '19:00', status: 'Remote', ot: 3, source: 'Mobile App', violation: null }, { clockIn: '07:30', clockOut: '17:30', status: 'Present', ot: 2, source: 'Biometric', violation: null }, { clockIn: '07:45', clockOut: '18:00', status: 'Remote', ot: 2, source: 'Mobile App', violation: null }],
    'PAR-0456': [{ clockIn: '08:35', clockOut: '16:30', status: 'Late', ot: 0, source: 'Biometric', violation: 'Late + early departure' }, { clockIn: '08:30', clockOut: '17:00', status: 'Present', ot: 0, source: 'Biometric', violation: null }, { clockIn: '08:20', clockOut: '17:00', status: 'Present', ot: 0, source: 'Biometric', violation: null }, { clockIn: '08:45', clockOut: '17:00', status: 'Late', ot: 0, source: 'Biometric', violation: 'Late arrival' }, { clockIn: '08:10', clockOut: '17:00', status: 'Present', ot: 0, source: 'Biometric', violation: null }],
    'PAR-0178': [{ clockIn: '08:00', clockOut: '17:30', status: 'Present', ot: 1.5, source: 'Biometric', violation: null }, { clockIn: '08:10', clockOut: '17:15', status: 'Present', ot: 1, source: 'Biometric', violation: null }, { clockIn: '08:05', clockOut: '17:00', status: 'Present', ot: 0, source: 'Biometric', violation: null }, { clockIn: '07:55', clockOut: '17:30', status: 'Present', ot: 1.5, source: 'Biometric', violation: null }, { clockIn: '08:00', clockOut: '17:00', status: 'Present', ot: 0, source: 'Biometric', violation: null }],
    'PAR-0055': [{ clockIn: '08:00', clockOut: '17:00', status: 'Present', ot: 0, source: 'Biometric', violation: null }, { clockIn: '08:05', clockOut: '17:00', status: 'Present', ot: 0, source: 'Biometric', violation: null }, { clockIn: '08:00', clockOut: '17:30', status: 'Present', ot: 0.5, source: 'Biometric', violation: null }, { clockIn: '08:00', clockOut: '17:00', status: 'Present', ot: 0, source: 'Biometric', violation: null }, { clockIn: '08:10', clockOut: '17:00', status: 'Present', ot: 0, source: 'Biometric', violation: null }],
    'PAR-0333': [{ clockIn: '08:00', clockOut: '17:00', status: 'Present', ot: 0, source: 'Biometric', violation: null }, { clockIn: '', clockOut: '', status: 'Absent', ot: 0, source: 'System', violation: 'Absent — sick leave not submitted' }, { clockIn: '08:00', clockOut: '17:00', status: 'Present', ot: 0, source: 'Biometric', violation: null }, { clockIn: '08:15', clockOut: '17:00', status: 'Present', ot: 0, source: 'Biometric', violation: null }, { clockIn: '08:00', clockOut: '17:00', status: 'Present', ot: 0, source: 'Biometric', violation: null }],
    'PAR-0210': [{ clockIn: '08:00', clockOut: '17:00', status: 'Present', ot: 0, source: 'Biometric', violation: null }, { clockIn: '08:00', clockOut: '17:00', status: 'Present', ot: 0, source: 'Biometric', violation: null }, { clockIn: '08:00', clockOut: '13:00', status: 'Half Day', ot: 0, source: 'Biometric', violation: null }, { clockIn: '08:00', clockOut: '17:00', status: 'Present', ot: 0, source: 'Biometric', violation: null }, { clockIn: '08:00', clockOut: '17:30', status: 'Present', ot: 0.5, source: 'Biometric', violation: null }],
    'PAR-0400': [{ clockIn: '07:45', clockOut: '17:00', status: 'Present', ot: 1, source: 'Biometric', violation: null }, { clockIn: '07:50', clockOut: '17:00', status: 'Present', ot: 1, source: 'Biometric', violation: null }, { clockIn: '08:00', clockOut: '17:00', status: 'Present', ot: 0, source: 'Biometric', violation: null }, { clockIn: '07:55', clockOut: '17:15', status: 'Present', ot: 1, source: 'Biometric', violation: null }, { clockIn: '08:00', clockOut: '17:00', status: 'Present', ot: 0, source: 'Biometric', violation: null }],
  };
  let counter = 0;
  for (const day of days) {
    for (const emp of emps) {
      const dayIdx = days.indexOf(day);
      const p = patterns[emp.id]?.[dayIdx];
      if (p) {
        const hrs = p.clockIn && p.clockOut ? parseFloat(((parseInt(p.clockOut.split(':')[0]) + parseInt(p.clockOut.split(':')[1]) / 60) - (parseInt(p.clockIn.split(':')[0]) + parseInt(p.clockIn.split(':')[1]) / 60)).toFixed(1)) : null;
        records.push({
          id: `ATT-${String(++counter).padStart(4, '0')}`,
          employeeId: emp.id, employeeName: emp.name, department: emp.dept,
          date: day, clockIn: p.clockIn || null, clockOut: p.clockOut || null,
          hours: hrs, overtime: p.ot || null, status: p.status,
          source: p.source, location: 'Nairobi HQ', shiftType: 'Day',
          notes: '', policyViolation: p.violation,
        });
      }
    }
  }
  return records;
};

export const attendanceRecords: AttendanceRecord[] = generateWeekRecords();

export const attendancePolicies: AttendancePolicy[] = [
  { id: 'POL-001', name: 'Standard Day Shift', description: 'Default policy for office-based employees', shiftStart: '08:00', shiftEnd: '17:00', graceMinutes: 15, halfDayHours: 5, minHours: 8, overtimeAfter: 8, overtimeRate: 1.5, appliesTo: 'All office employees', status: 'active' },
  { id: 'POL-002', name: 'Operations Night Shift', description: 'For operations staff on night rotation', shiftStart: '18:00', shiftEnd: '06:00', graceMinutes: 10, halfDayHours: 5, minHours: 8, overtimeAfter: 8, overtimeRate: 2.0, appliesTo: 'Operations night crew', status: 'active' },
  { id: 'POL-003', name: 'Flexible / Remote', description: 'For staff with flexible work arrangements', shiftStart: '07:00', shiftEnd: '19:00', graceMinutes: 0, halfDayHours: 4, minHours: 8, overtimeAfter: 9, overtimeRate: 1.5, appliesTo: 'IT, Engineering (approved)', status: 'active' },
  { id: 'POL-004', name: 'Field Sales', description: 'For field-based sales team members', shiftStart: '08:00', shiftEnd: '17:00', graceMinutes: 30, halfDayHours: 4, minHours: 8, overtimeAfter: 9, overtimeRate: 1.0, appliesTo: 'Sales (field)', status: 'draft' },
];

export const overtimeEntries: OvertimeEntry[] = [
  { id: 'OT-001', employeeId: 'PAR-0023', employeeName: 'Grace Muthoni', department: 'Engineering', date: '2026-04-05', regularHours: 8, overtimeHours: 2, rate: 1.5, amount: 0, approvedBy: 'James Otieno', status: 'approved' },
  { id: 'OT-002', employeeId: 'PAR-0099', employeeName: 'Samuel Kiprop', department: 'IT', date: '2026-04-07', regularHours: 8, overtimeHours: 3, rate: 1.5, amount: 0, approvedBy: null, status: 'pending' },
  { id: 'OT-003', employeeId: 'PAR-0145', employeeName: 'Amina Hassan', department: 'Finance', date: '2026-04-05', regularHours: 8, overtimeHours: 2.5, rate: 1.5, amount: 0, approvedBy: 'John Maina', status: 'approved' },
  { id: 'OT-004', employeeId: 'PAR-0178', employeeName: 'Brian Mwangi', department: 'Engineering', date: '2026-04-07', regularHours: 8, overtimeHours: 1.5, rate: 1.5, amount: 0, approvedBy: null, status: 'pending' },
  { id: 'OT-005', employeeId: 'PAR-0023', employeeName: 'Grace Muthoni', department: 'Engineering', date: '2026-04-07', regularHours: 8, overtimeHours: 1, rate: 1.5, amount: 0, approvedBy: null, status: 'pending' },
  { id: 'OT-006', employeeId: 'PAR-0400', employeeName: 'Patrick Musyoka', department: 'Administration', date: '2026-04-04', regularHours: 8, overtimeHours: 1, rate: 1.5, amount: 0, approvedBy: 'Admin Head', status: 'processed' },
];

export const monthlySummaries: MonthlyAttendanceSummary[] = [
  { employeeId: 'PAR-0023', employeeName: 'Grace Muthoni', department: 'Engineering', month: 'March 2026', workingDays: 22, present: 21, late: 0, absent: 0, halfDay: 0, onLeave: 1, remote: 3, totalHours: 184, overtimeHours: 18, attendanceRate: 95.5 },
  { employeeId: 'PAR-0087', employeeName: 'David Ochieng', department: 'Sales', month: 'March 2026', workingDays: 22, present: 16, late: 4, absent: 1, halfDay: 0, onLeave: 1, remote: 0, totalHours: 165, overtimeHours: 0, attendanceRate: 72.7 },
  { employeeId: 'PAR-0145', employeeName: 'Amina Hassan', department: 'Finance', month: 'March 2026', workingDays: 22, present: 22, late: 0, absent: 0, halfDay: 0, onLeave: 0, remote: 0, totalHours: 192, overtimeHours: 12, attendanceRate: 100 },
  { employeeId: 'PAR-0201', employeeName: 'Peter Kamau', department: 'Operations', month: 'March 2026', workingDays: 22, present: 18, late: 1, absent: 2, halfDay: 1, onLeave: 0, remote: 0, totalHours: 155, overtimeHours: 0, attendanceRate: 81.8 },
  { employeeId: 'PAR-0099', employeeName: 'Samuel Kiprop', department: 'IT', month: 'March 2026', workingDays: 22, present: 12, late: 0, absent: 0, halfDay: 0, onLeave: 0, remote: 10, totalHours: 210, overtimeHours: 30, attendanceRate: 100 },
  { employeeId: 'PAR-0456', employeeName: 'Lucy Akinyi', department: 'Marketing', month: 'March 2026', workingDays: 22, present: 18, late: 3, absent: 1, halfDay: 0, onLeave: 0, remote: 0, totalHours: 160, overtimeHours: 0, attendanceRate: 81.8 },
  { employeeId: 'PAR-0178', employeeName: 'Brian Mwangi', department: 'Engineering', month: 'March 2026', workingDays: 22, present: 21, late: 0, absent: 0, halfDay: 0, onLeave: 1, remote: 2, totalHours: 186, overtimeHours: 14, attendanceRate: 95.5 },
];
