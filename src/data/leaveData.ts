// Leave Management Module Data — Full Workflow

export interface LeaveType {
  id: string;
  name: string;
  annualEntitlement: number;
  unit: 'days';
  carryOver: boolean;
  maxCarryOver: number;
  requiresApproval: boolean;
  documentRequired: boolean;
}

export interface LeaveBalance {
  employeeId: string;
  employeeName: string;
  department: string;
  balances: Record<string, { entitled: number; taken: number; pending: number; available: number }>;
}

export type LeaveApprovalStage = 'submitted' | 'supervisor_approved' | 'hrbp_reviewed' | 'hr_head_approved' | 'approved' | 'rejected' | 'cancelled';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  stage: LeaveApprovalStage;
  supervisorName: string;
  supervisorApproved: boolean | null;
  supervisorDate: string | null;
  hrbpName: string;
  hrbpReviewed: boolean | null;
  hrbpDate: string | null;
  hrHeadApproved: boolean | null;
  hrHeadDate: string | null;
  relieverName: string | null;
  relieverAccepted: boolean | null;
  handoverNotes: string;
  leaveAllowanceProcessed: boolean;
  recalled: boolean;
  recallDate: string | null;
  recallReason: string;
  createdDate: string;
}

export interface AnnualLeaveSchedule {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  q1: { start: string; end: string; days: number } | null;
  q2: { start: string; end: string; days: number } | null;
  q3: { start: string; end: string; days: number } | null;
  q4: { start: string; end: string; days: number } | null;
  totalPlanned: number;
  status: 'draft' | 'submitted' | 'approved';
}

export const leaveTypes: LeaveType[] = [
  { id: 'LT-001', name: 'Annual Leave', annualEntitlement: 21, unit: 'days', carryOver: true, maxCarryOver: 5, requiresApproval: true, documentRequired: false },
  { id: 'LT-002', name: 'Sick Leave', annualEntitlement: 10, unit: 'days', carryOver: false, maxCarryOver: 0, requiresApproval: true, documentRequired: true },
  { id: 'LT-003', name: 'Maternity Leave', annualEntitlement: 90, unit: 'days', carryOver: false, maxCarryOver: 0, requiresApproval: true, documentRequired: true },
  { id: 'LT-004', name: 'Paternity Leave', annualEntitlement: 14, unit: 'days', carryOver: false, maxCarryOver: 0, requiresApproval: true, documentRequired: true },
  { id: 'LT-005', name: 'Compassionate Leave', annualEntitlement: 5, unit: 'days', carryOver: false, maxCarryOver: 0, requiresApproval: true, documentRequired: false },
  { id: 'LT-006', name: 'Study Leave', annualEntitlement: 10, unit: 'days', carryOver: false, maxCarryOver: 0, requiresApproval: true, documentRequired: true },
];

export const leaveBalances: LeaveBalance[] = [
  { employeeId: 'PAR-0023', employeeName: 'Grace Muthoni', department: 'Engineering', balances: { 'Annual Leave': { entitled: 21, taken: 5, pending: 5, available: 11 }, 'Sick Leave': { entitled: 10, taken: 1, pending: 0, available: 9 }, 'Study Leave': { entitled: 10, taken: 0, pending: 0, available: 10 } } },
  { employeeId: 'PAR-0087', employeeName: 'David Ochieng', department: 'Sales', balances: { 'Annual Leave': { entitled: 21, taken: 8, pending: 0, available: 13 }, 'Sick Leave': { entitled: 10, taken: 2, pending: 0, available: 8 }, 'Study Leave': { entitled: 10, taken: 3, pending: 0, available: 7 } } },
  { employeeId: 'PAR-0145', employeeName: 'Amina Hassan', department: 'Finance', balances: { 'Annual Leave': { entitled: 21, taken: 3, pending: 5, available: 13 }, 'Sick Leave': { entitled: 10, taken: 0, pending: 0, available: 10 }, 'Study Leave': { entitled: 10, taken: 5, pending: 0, available: 5 } } },
  { employeeId: 'PAR-0201', employeeName: 'Peter Kamau', department: 'Operations', balances: { 'Annual Leave': { entitled: 21, taken: 10, pending: 0, available: 11 }, 'Sick Leave': { entitled: 10, taken: 3, pending: 0, available: 7 }, 'Compassionate': { entitled: 5, taken: 2, pending: 0, available: 3 } } },
  { employeeId: 'PAR-0312', employeeName: 'Jane Wanjiku', department: 'Human Resources', balances: { 'Annual Leave': { entitled: 21, taken: 0, pending: 0, available: 21 }, 'Maternity Leave': { entitled: 90, taken: 0, pending: 90, available: 0 } } },
  { employeeId: 'PAR-0099', employeeName: 'Samuel Kiprop', department: 'IT', balances: { 'Annual Leave': { entitled: 21, taken: 6, pending: 3, available: 12 }, 'Sick Leave': { entitled: 10, taken: 0, pending: 0, available: 10 } } },
  { employeeId: 'PAR-0456', employeeName: 'Lucy Akinyi', department: 'Marketing', balances: { 'Annual Leave': { entitled: 21, taken: 4, pending: 1, available: 16 }, 'Sick Leave': { entitled: 10, taken: 1, pending: 1, available: 8 } } },
  { employeeId: 'PAR-0178', employeeName: 'Brian Mwangi', department: 'Engineering', balances: { 'Annual Leave': { entitled: 21, taken: 2, pending: 14, available: 5 }, 'Paternity Leave': { entitled: 14, taken: 0, pending: 14, available: 0 } } },
];

export const initialLeaveRequests: LeaveRequest[] = [
  { id: 'LV-001', employeeId: 'PAR-0023', employeeName: 'Grace Muthoni', department: 'Engineering', leaveType: 'Annual Leave', startDate: '2026-04-14', endDate: '2026-04-18', days: 5, reason: 'Family vacation to Mombasa', stage: 'hrbp_reviewed', supervisorName: 'James Otieno', supervisorApproved: true, supervisorDate: '2026-04-06', hrbpName: 'Jane Wanjiku', hrbpReviewed: true, hrbpDate: '2026-04-07', hrHeadApproved: null, hrHeadDate: null, relieverName: 'Brian Mwangi', relieverAccepted: true, handoverNotes: 'Brian to handle Sprint 12 tasks. Jira board updated.', leaveAllowanceProcessed: false, recalled: false, recallDate: null, recallReason: '', createdDate: '2026-04-05' },
  { id: 'LV-002', employeeId: 'PAR-0087', employeeName: 'David Ochieng', department: 'Sales', leaveType: 'Sick Leave', startDate: '2026-04-07', endDate: '2026-04-08', days: 2, reason: 'Flu and fever', stage: 'approved', supervisorName: 'Sarah Wambui', supervisorApproved: true, supervisorDate: '2026-04-07', hrbpName: 'Jane Wanjiku', hrbpReviewed: true, hrbpDate: '2026-04-07', hrHeadApproved: true, hrHeadDate: '2026-04-07', relieverName: 'Mark Kemboi', relieverAccepted: true, handoverNotes: 'Mark to follow up with KCB account.', leaveAllowanceProcessed: false, recalled: false, recallDate: null, recallReason: '', createdDate: '2026-04-07' },
  { id: 'LV-003', employeeId: 'PAR-0145', employeeName: 'Amina Hassan', department: 'Finance', leaveType: 'Annual Leave', startDate: '2026-04-21', endDate: '2026-04-25', days: 5, reason: 'Personal matters', stage: 'submitted', supervisorName: 'John Maina', supervisorApproved: null, supervisorDate: null, hrbpName: 'Jane Wanjiku', hrbpReviewed: null, hrbpDate: null, hrHeadApproved: null, hrHeadDate: null, relieverName: null, relieverAccepted: null, handoverNotes: '', leaveAllowanceProcessed: false, recalled: false, recallDate: null, recallReason: '', createdDate: '2026-04-06' },
  { id: 'LV-004', employeeId: 'PAR-0201', employeeName: 'Peter Kamau', department: 'Operations', leaveType: 'Compassionate Leave', startDate: '2026-04-02', endDate: '2026-04-03', days: 2, reason: 'Family bereavement', stage: 'approved', supervisorName: 'Francis Ndungu', supervisorApproved: true, supervisorDate: '2026-04-02', hrbpName: 'Jane Wanjiku', hrbpReviewed: true, hrbpDate: '2026-04-02', hrHeadApproved: true, hrHeadDate: '2026-04-02', relieverName: 'Collins Wekesa', relieverAccepted: true, handoverNotes: 'Collins to cover warehouse operations.', leaveAllowanceProcessed: true, recalled: false, recallDate: null, recallReason: '', createdDate: '2026-04-01' },
  { id: 'LV-005', employeeId: 'PAR-0312', employeeName: 'Jane Wanjiku', department: 'Human Resources', leaveType: 'Maternity Leave', startDate: '2026-05-01', endDate: '2026-07-29', days: 90, reason: 'Maternity leave', stage: 'approved', supervisorName: 'HR Director', supervisorApproved: true, supervisorDate: '2026-03-15', hrbpName: 'HR Director', hrbpReviewed: true, hrbpDate: '2026-03-15', hrHeadApproved: true, hrHeadDate: '2026-03-16', relieverName: 'Faith Njeri', relieverAccepted: true, handoverNotes: 'Faith to act as HR Coordinator. All pending cases documented.', leaveAllowanceProcessed: true, recalled: false, recallDate: null, recallReason: '', createdDate: '2026-03-10' },
  { id: 'LV-006', employeeId: 'PAR-0099', employeeName: 'Samuel Kiprop', department: 'IT', leaveType: 'Annual Leave', startDate: '2026-04-28', endDate: '2026-04-30', days: 3, reason: 'Personal travel', stage: 'rejected', supervisorName: 'IT Director', supervisorApproved: false, supervisorDate: '2026-04-06', hrbpName: 'Jane Wanjiku', hrbpReviewed: null, hrbpDate: null, hrHeadApproved: null, hrHeadDate: null, relieverName: null, relieverAccepted: null, handoverNotes: '', leaveAllowanceProcessed: false, recalled: false, recallDate: null, recallReason: '', createdDate: '2026-04-05' },
  { id: 'LV-007', employeeId: 'PAR-0456', employeeName: 'Lucy Akinyi', department: 'Marketing', leaveType: 'Sick Leave', startDate: '2026-04-10', endDate: '2026-04-10', days: 1, reason: 'Migraine', stage: 'supervisor_approved', supervisorName: 'Dennis Rotich', supervisorApproved: true, supervisorDate: '2026-04-10', hrbpName: 'Jane Wanjiku', hrbpReviewed: null, hrbpDate: null, hrHeadApproved: null, hrHeadDate: null, relieverName: null, relieverAccepted: null, handoverNotes: '', leaveAllowanceProcessed: false, recalled: false, recallDate: null, recallReason: '', createdDate: '2026-04-10' },
  { id: 'LV-008', employeeId: 'PAR-0178', employeeName: 'Brian Mwangi', department: 'Engineering', leaveType: 'Paternity Leave', startDate: '2026-04-15', endDate: '2026-04-28', days: 14, reason: 'Birth of child', stage: 'hr_head_approved', supervisorName: 'James Otieno', supervisorApproved: true, supervisorDate: '2026-04-04', hrbpName: 'Jane Wanjiku', hrbpReviewed: true, hrbpDate: '2026-04-05', hrHeadApproved: true, hrHeadDate: '2026-04-06', relieverName: 'Grace Muthoni', relieverAccepted: true, handoverNotes: 'Grace to lead Sprint 12-13. Code review duties assigned to Samuel.', leaveAllowanceProcessed: false, recalled: false, recallDate: null, recallReason: '', createdDate: '2026-04-03' },
  { id: 'LV-009', employeeId: 'PAR-0055', employeeName: 'Faith Njeri', department: 'Customer Support', leaveType: 'Annual Leave', startDate: '2026-05-05', endDate: '2026-05-09', days: 5, reason: 'Annual vacation', stage: 'submitted', supervisorName: 'Lucy Akinyi', supervisorApproved: null, supervisorDate: null, hrbpName: 'Jane Wanjiku', hrbpReviewed: null, hrbpDate: null, hrHeadApproved: null, hrHeadDate: null, relieverName: null, relieverAccepted: null, handoverNotes: '', leaveAllowanceProcessed: false, recalled: false, recallDate: null, recallReason: '', createdDate: '2026-04-07' },
  { id: 'LV-010', employeeId: 'PAR-0201', employeeName: 'Peter Kamau', department: 'Operations', leaveType: 'Annual Leave', startDate: '2026-03-10', endDate: '2026-03-14', days: 5, reason: 'Family event in Nakuru', stage: 'approved', supervisorName: 'Francis Ndungu', supervisorApproved: true, supervisorDate: '2026-03-05', hrbpName: 'Jane Wanjiku', hrbpReviewed: true, hrbpDate: '2026-03-06', hrHeadApproved: true, hrHeadDate: '2026-03-06', relieverName: 'Collins Wekesa', relieverAccepted: true, handoverNotes: 'Handover done.', leaveAllowanceProcessed: true, recalled: true, recallDate: '2026-03-12', recallReason: 'Emergency warehouse flooding — required on site.', createdDate: '2026-03-01' },
];

export const annualLeaveSchedules: AnnualLeaveSchedule[] = [
  { id: 'ALS-001', employeeId: 'PAR-0023', employeeName: 'Grace Muthoni', department: 'Engineering', q1: null, q2: { start: '2026-04-14', end: '2026-04-18', days: 5 }, q3: { start: '2026-08-10', end: '2026-08-21', days: 10 }, q4: { start: '2026-12-22', end: '2026-12-31', days: 6 }, totalPlanned: 21, status: 'approved' },
  { id: 'ALS-002', employeeId: 'PAR-0087', employeeName: 'David Ochieng', department: 'Sales', q1: { start: '2026-02-16', end: '2026-02-27', days: 10 }, q2: null, q3: { start: '2026-07-06', end: '2026-07-10', days: 5 }, q4: { start: '2026-12-15', end: '2026-12-19', days: 5 }, totalPlanned: 20, status: 'approved' },
  { id: 'ALS-003', employeeId: 'PAR-0145', employeeName: 'Amina Hassan', department: 'Finance', q1: null, q2: { start: '2026-04-21', end: '2026-04-25', days: 5 }, q3: null, q4: { start: '2026-11-23', end: '2026-12-04', days: 10 }, totalPlanned: 15, status: 'submitted' },
  { id: 'ALS-004', employeeId: 'PAR-0099', employeeName: 'Samuel Kiprop', department: 'IT', q1: null, q2: { start: '2026-06-15', end: '2026-06-26', days: 10 }, q3: null, q4: { start: '2026-12-22', end: '2026-12-31', days: 6 }, totalPlanned: 16, status: 'draft' },
  { id: 'ALS-005', employeeId: 'PAR-0178', employeeName: 'Brian Mwangi', department: 'Engineering', q1: null, q2: { start: '2026-04-15', end: '2026-04-28', days: 14 }, q3: { start: '2026-09-01', end: '2026-09-05', days: 5 }, q4: null, totalPlanned: 19, status: 'approved' },
];
