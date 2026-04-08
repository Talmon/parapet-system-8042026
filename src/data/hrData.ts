// Seed-based pseudo-random for deterministic data
const seededRandom = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

const rng = seededRandom(42);

const firstNames = [
  'James','Mary','John','Patricia','Robert','Jennifer','Michael','Linda','David','Elizabeth',
  'William','Barbara','Richard','Susan','Joseph','Jessica','Thomas','Sarah','Charles','Karen',
  'Grace','Peter','Amina','Samuel','Lucy','Brian','Jane','Faith','Kevin','Mercy',
  'Daniel','Esther','George','Rose','Francis','Alice','Stephen','Margaret','Paul','Agnes',
  'Moses','Catherine','Henry','Beatrice','Patrick','Eunice','Timothy','Gladys','Andrew','Joyce',
  'Mark','Winnie','Dennis','Charity','Martin','Irene','Joshua','Martha','Victor','Doris',
  'Simon','Naomi','Benjamin','Ruth','Anthony','Carol','Nathan','Gloria','Emmanuel','Diana',
  'Felix','Susan','Philip','Anne','Isaac','Christine','Cyrus','Jackline','Jacob','Pamela',
  'Luke','Helen','Edwin','Sophia','Oscar','Regina','Albert','Miriam','Caleb','Dorothy',
  'Vincent','Lilian','Wilson','Josephine','Kelvin','Cynthia','Collins','Maureen','Ian','Lydia'
];

const lastNames = [
  'Anderson','Lopez','Williams','Maina','Thomas','Ochieng','Nyokabi','Wambui','Kamau','Wanjiku',
  'Kiprop','Akinyi','Mwangi','Kosgei','Wekesa','Otieno','Hassan','Muthoni','Odhiambo','Kariuki',
  'Njoroge','Kimani','Cheruiyot','Rotich','Langat','Komen','Chepkoech','Kipruto','Bett','Korir',
  'Mutua','Musyoka','Ndungu','Gitau','Wairimu','Mugo','Njeri','Macharia','Wangari','Mwende',
  'Kiptoo','Chepkemoi','Sang','Kibet','Rono','Limo','Cheptoo','Kipchoge','Tanui','Kemboi'
];

const departments = [
  'Engineering', 'Finance', 'Sales', 'Operations', 'Marketing', 'IT',
  'Human Resources', 'Legal', 'Administration', 'Customer Support',
  'Procurement', 'Research & Development'
];

const deptWeights = [18, 10, 14, 13, 9, 11, 6, 4, 5, 6, 2, 2];
const totalWeight = deptWeights.reduce((a, b) => a + b, 0);

const jobTitles: Record<string, string[]> = {
  'Engineering': ['Software Engineer', 'Senior Developer', 'DevOps Engineer', 'QA Engineer', 'Tech Lead', 'System Architect', 'Frontend Developer', 'Backend Developer'],
  'Finance': ['Accountant', 'Controller', 'Financial Analyst', 'Auditor', 'Tax Specialist', 'Payroll Officer', 'Credit Analyst'],
  'Sales': ['Account Manager', 'Sales Representative', 'Business Development Manager', 'Sales Lead', 'Key Account Executive', 'Regional Sales Manager'],
  'Operations': ['Operations Manager', 'Logistics Coordinator', 'Supply Chain Analyst', 'Facilities Manager', 'Project Coordinator', 'Operations Analyst'],
  'Marketing': ['Marketing Manager', 'Brand Specialist', 'Digital Marketing Executive', 'Content Creator', 'SEO Specialist', 'Campaign Manager'],
  'IT': ['IT Support Specialist', 'Network Administrator', 'Database Admin', 'Security Analyst', 'System Administrator', 'IT Manager'],
  'Human Resources': ['HR Manager', 'Training Specialist', 'Recruiter', 'HR Coordinator', 'Compensation Analyst', 'Employee Relations Officer'],
  'Legal': ['Compliance Officer', 'Legal Counsel', 'Contracts Manager', 'Paralegal', 'Risk Analyst'],
  'Administration': ['Admin Assistant', 'Office Manager', 'Executive Assistant', 'Receptionist', 'Data Entry Clerk'],
  'Customer Support': ['Team Lead', 'Support Specialist', 'Customer Success Manager', 'Help Desk Analyst', 'Service Coordinator'],
  'Procurement': ['Procurement Officer', 'Buyer', 'Vendor Manager', 'Supply Coordinator'],
  'Research & Development': ['Research Scientist', 'R&D Engineer', 'Product Developer', 'Innovation Lead'],
};

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  jobTitle: string;
  type: 'Employee' | 'Consultant';
  status: 'Active' | 'On Leave' | 'Suspended' | 'Terminated';
  grossPay: number;
  joinDate: string;
}

function pickDept(): string {
  const r = rng() * totalWeight;
  let cumulative = 0;
  for (let i = 0; i < departments.length; i++) {
    cumulative += deptWeights[i];
    if (r < cumulative) return departments[i];
  }
  return departments[0];
}

function generateEmployees(count: number): Employee[] {
  const employees: Employee[] = [];
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(rng() * firstNames.length)];
    const lastName = lastNames[Math.floor(rng() * lastNames.length)];
    const dept = pickDept();
    const titles = jobTitles[dept];
    const jobTitle = titles[Math.floor(rng() * titles.length)];
    const isConsultant = rng() < 0.15;
    const isOnLeave = rng() < 0.04;
    const gross = Math.round((80000 + rng() * 520000) / 100) * 100;
    const year = 2018 + Math.floor(rng() * 8);
    const month = 1 + Math.floor(rng() * 12);
    const day = 1 + Math.floor(rng() * 28);

    employees.push({
      id: `PAR-${String(i + 1).padStart(4, '0')}`,
      name: `${firstName} ${lastName}`,
      email: `emp${i + 1}@parapet.co.ke`,
      department: dept,
      jobTitle,
      type: isConsultant ? 'Consultant' : 'Employee',
      status: isOnLeave ? 'On Leave' : 'Active',
      grossPay: gross,
      joinDate: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    });
  }
  return employees;
}

export const employees = generateEmployees(1527);

// Derived stats
export const activeEmployees = employees.filter(e => e.status === 'Active');
export const onLeaveEmployees = employees.filter(e => e.status === 'On Leave');
export const consultants = employees.filter(e => e.type === 'Consultant');
export const permanentStaff = employees.filter(e => e.type === 'Employee');

export const totalGrossPayroll = employees.filter(e => e.status === 'Active' || e.status === 'On Leave')
  .reduce((sum, e) => sum + e.grossPay, 0);

// Kenyan statutory deductions (simplified)
export const calculateDeductions = (gross: number) => {
  // PAYE (simplified progressive)
  let paye = 0;
  if (gross > 32333) {
    const taxable = gross - 2400; // personal relief approx
    if (taxable <= 24000) paye = taxable * 0.1;
    else if (taxable <= 32333) paye = 2400 + (taxable - 24000) * 0.25;
    else paye = 2400 + 2083 + (taxable - 32333) * 0.3;
    paye = Math.max(0, paye - 2400); // monthly personal relief
  }
  // SHIF (2.75% each)
  const shif = gross * 0.0275;
  // NSSF Tier I + II
  const nssf = Math.min(gross * 0.06, 2160);
  // Housing Levy (1.5% each)
  const housing = gross * 0.015;
  
  return { paye, shif, nssf, housing, totalDeductions: paye + shif + nssf + housing };
};

export const payrollSummary = (() => {
  let totalPaye = 0, totalShif = 0, totalNssf = 0, totalHousing = 0;
  employees.filter(e => e.status !== 'Terminated').forEach(e => {
    const d = calculateDeductions(e.grossPay);
    totalPaye += d.paye;
    totalShif += d.shif;
    totalNssf += d.nssf;
    totalHousing += d.housing;
  });
  const totalStatutory = totalPaye + totalShif + totalNssf + totalHousing;
  return {
    totalGross: totalGrossPayroll,
    totalNet: totalGrossPayroll - totalStatutory,
    totalStatutory,
    paye: totalPaye,
    shif: totalShif,
    nssf: totalNssf,
    housing: totalHousing,
  };
})();

export const departmentHeadcount = departments.map(dept => ({
  name: dept.length > 8 ? dept.substring(0, 8) : dept,
  fullName: dept,
  count: employees.filter(e => e.department === dept && e.status !== 'Terminated').length,
}));

// Leave data
export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
}

export const leaveRequests: LeaveRequest[] = [
  { id: 'LV-001', employeeId: 'PAR-0023', employeeName: 'Grace Muthoni', department: 'Engineering', leaveType: 'Annual Leave', startDate: '2026-04-14', endDate: '2026-04-18', days: 5, status: 'pending' },
  { id: 'LV-002', employeeId: 'PAR-0087', employeeName: 'David Ochieng', department: 'Sales', leaveType: 'Sick Leave', startDate: '2026-04-07', endDate: '2026-04-08', days: 2, status: 'approved' },
  { id: 'LV-003', employeeId: 'PAR-0145', employeeName: 'Amina Hassan', department: 'Finance', leaveType: 'Annual Leave', startDate: '2026-04-21', endDate: '2026-04-25', days: 5, status: 'pending' },
  { id: 'LV-004', employeeId: 'PAR-0201', employeeName: 'Peter Kamau', department: 'Operations', leaveType: 'Compassionate', startDate: '2026-04-02', endDate: '2026-04-03', days: 2, status: 'approved' },
  { id: 'LV-005', employeeId: 'PAR-0312', employeeName: 'Jane Wanjiku', department: 'Human Resources', leaveType: 'Maternity Leave', startDate: '2026-05-01', endDate: '2026-07-29', days: 90, status: 'approved' },
  { id: 'LV-006', employeeId: 'PAR-0099', employeeName: 'Samuel Kiprop', department: 'IT', leaveType: 'Annual Leave', startDate: '2026-04-28', endDate: '2026-04-30', days: 3, status: 'rejected' },
  { id: 'LV-007', employeeId: 'PAR-0456', employeeName: 'Lucy Akinyi', department: 'Marketing', leaveType: 'Sick Leave', startDate: '2026-04-10', endDate: '2026-04-10', days: 1, status: 'pending' },
  { id: 'LV-008', employeeId: 'PAR-0178', employeeName: 'Brian Mwangi', department: 'Engineering', leaveType: 'Paternity Leave', startDate: '2026-04-15', endDate: '2026-04-28', days: 14, status: 'pending' },
];

// Attendance
export interface AttendanceRecord {
  employeeId: string;
  employeeName: string;
  department: string;
  clockIn: string | null;
  clockOut: string | null;
  hours: number | null;
  overtime: number | null;
  status: 'Present' | 'Late' | 'Absent' | 'Half Day';
}

export const attendanceRecords: AttendanceRecord[] = [
  { employeeId: 'PAR-0023', employeeName: 'Grace Muthoni', department: 'Engineering', clockIn: '08:02', clockOut: '17:05', hours: 9, overtime: 1, status: 'Present' },
  { employeeId: 'PAR-0087', employeeName: 'David Ochieng', department: 'Sales', clockIn: '09:15', clockOut: '17:30', hours: 8.25, overtime: null, status: 'Late' },
  { employeeId: 'PAR-0145', employeeName: 'Amina Hassan', department: 'Finance', clockIn: '07:55', clockOut: '17:00', hours: 9, overtime: 1, status: 'Present' },
  { employeeId: 'PAR-0201', employeeName: 'Peter Kamau', department: 'Operations', clockIn: null, clockOut: null, hours: null, overtime: null, status: 'Absent' },
  { employeeId: 'PAR-0312', employeeName: 'Jane Wanjiku', department: 'Human Resources', clockIn: '08:00', clockOut: '13:00', hours: 5, overtime: null, status: 'Half Day' },
  { employeeId: 'PAR-0099', employeeName: 'Samuel Kiprop', department: 'IT', clockIn: '07:45', clockOut: '18:00', hours: 10.25, overtime: 2.25, status: 'Present' },
  { employeeId: 'PAR-0456', employeeName: 'Lucy Akinyi', department: 'Marketing', clockIn: '08:30', clockOut: '17:00', hours: 8.5, overtime: 0.5, status: 'Present' },
  { employeeId: 'PAR-0178', employeeName: 'Brian Mwangi', department: 'Engineering', clockIn: '08:10', clockOut: '17:15', hours: 9, overtime: 1, status: 'Present' },
];

// Performance
export interface PerformanceReview {
  employeeName: string;
  department: string;
  reviewer: string;
  goalsCompleted: number;
  goalsTotal: number;
  rating: number | null;
  status: 'completed' | 'in_progress' | 'scheduled';
}

export const performanceReviews: PerformanceReview[] = [
  { employeeName: 'Grace Muthoni', department: 'Engineering', reviewer: 'James Otieno', goalsCompleted: 4, goalsTotal: 5, rating: 4.5, status: 'completed' },
  { employeeName: 'David Ochieng', department: 'Sales', reviewer: 'Sarah Wambui', goalsCompleted: 4, goalsTotal: 6, rating: 3.8, status: 'completed' },
  { employeeName: 'Amina Hassan', department: 'Finance', reviewer: 'John Maina', goalsCompleted: 3, goalsTotal: 4, rating: 4.2, status: 'completed' },
  { employeeName: 'Peter Kamau', department: 'Operations', reviewer: 'Lucy Akinyi', goalsCompleted: 2, goalsTotal: 5, rating: null, status: 'in_progress' },
  { employeeName: 'Jane Wanjiku', department: 'Human Resources', reviewer: 'Brian Mwangi', goalsCompleted: 0, goalsTotal: 4, rating: null, status: 'scheduled' },
  { employeeName: 'Samuel Kiprop', department: 'IT', reviewer: 'Grace Muthoni', goalsCompleted: 5, goalsTotal: 5, rating: 4.7, status: 'completed' },
  { employeeName: 'Lucy Akinyi', department: 'Marketing', reviewer: 'David Ochieng', goalsCompleted: 3, goalsTotal: 4, rating: 3.5, status: 'completed' },
];

// Recruitment
export interface JobPosting {
  id: string;
  position: string;
  department: string;
  location: string;
  type: string;
  postedDate: string;
  applicants: number;
  shortlisted: number;
  interviews: number;
  status: 'active' | 'closed' | 'draft';
}

export const jobPostings: JobPosting[] = [
  { id: 'JOB-001', position: 'Senior Software Engineer', department: 'Engineering', location: 'Nairobi', type: 'Full-time', postedDate: '2026-03-15', applicants: 45, shortlisted: 8, interviews: 3, status: 'active' },
  { id: 'JOB-002', position: 'Financial Analyst', department: 'Finance', location: 'Nairobi', type: 'Full-time', postedDate: '2026-03-20', applicants: 32, shortlisted: 6, interviews: 2, status: 'active' },
  { id: 'JOB-003', position: 'Marketing Manager', department: 'Marketing', location: 'Mombasa', type: 'Full-time', postedDate: '2026-03-10', applicants: 28, shortlisted: 5, interviews: 4, status: 'active' },
  { id: 'JOB-004', position: 'DevOps Engineer', department: 'IT', location: 'Remote', type: 'Contract', postedDate: '2026-03-01', applicants: 52, shortlisted: 10, interviews: 5, status: 'active' },
  { id: 'JOB-005', position: 'HR Coordinator', department: 'Human Resources', location: 'Nairobi', type: 'Full-time', postedDate: '2026-03-25', applicants: 18, shortlisted: 4, interviews: 0, status: 'active' },
  { id: 'JOB-006', position: 'Sales Representative', department: 'Sales', location: 'Kisumu', type: 'Full-time', postedDate: '2026-02-01', applicants: 60, shortlisted: 12, interviews: 6, status: 'closed' },
];

// Expenses
export interface ExpenseClaim {
  id: string;
  employeeName: string;
  department: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  hasReceipt: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'reimbursed';
}

export const expenseClaims: ExpenseClaim[] = [
  { id: 'EXP-001', employeeName: 'Grace Muthoni', department: 'Engineering', category: 'Travel', description: 'Client site visit – Mombasa', amount: 35000, date: '2026-04-01', hasReceipt: true, status: 'pending' },
  { id: 'EXP-002', employeeName: 'David Ochieng', department: 'Sales', category: 'Entertainment', description: 'Client dinner meeting', amount: 12500, date: '2026-03-28', hasReceipt: true, status: 'approved' },
  { id: 'EXP-003', employeeName: 'Amina Hassan', department: 'Finance', category: 'Training', description: 'CPA revision course', amount: 45000, date: '2026-03-20', hasReceipt: true, status: 'reimbursed' },
  { id: 'EXP-004', employeeName: 'Peter Kamau', department: 'Operations', category: 'Transport', description: 'Uber rides – site inspections', amount: 8700, date: '2026-04-02', hasReceipt: false, status: 'pending' },
  { id: 'EXP-005', employeeName: 'Jane Wanjiku', department: 'Human Resources', category: 'Office Supplies', description: 'Stationery for onboarding kits', amount: 5200, date: '2026-03-30', hasReceipt: true, status: 'approved' },
  { id: 'EXP-006', employeeName: 'Samuel Kiprop', department: 'IT', category: 'Software', description: 'Annual JetBrains license', amount: 28000, date: '2026-03-15', hasReceipt: true, status: 'rejected' },
];

// KPIs
export interface KPI {
  id: string;
  name: string;
  category: string;
  target: number;
  actual: number;
  unit: string;
  frequency: 'Monthly' | 'Quarterly' | 'Annual';
  owner: string;
  department: string;
  status: 'on_track' | 'at_risk' | 'behind';
  trend: number[];
  createdDate: string;
}

export const initialKpis: KPI[] = [
  { id: 'KPI-001', name: 'Employee Turnover Rate', category: 'Retention', target: 5, actual: 3.2, unit: '%', frequency: 'Quarterly', owner: 'HR Manager', department: 'Human Resources', status: 'on_track', trend: [4.5, 4.1, 3.8, 3.2], createdDate: '2026-01-01' },
  { id: 'KPI-002', name: 'Time to Fill Position', category: 'Recruitment', target: 30, actual: 23, unit: 'days', frequency: 'Monthly', owner: 'Recruitment Lead', department: 'Human Resources', status: 'on_track', trend: [35, 32, 28, 23], createdDate: '2026-01-01' },
  { id: 'KPI-003', name: 'Employee Satisfaction Score', category: 'Engagement', target: 85, actual: 78, unit: '%', frequency: 'Quarterly', owner: 'HR Manager', department: 'Human Resources', status: 'at_risk', trend: [72, 75, 76, 78], createdDate: '2026-01-01' },
  { id: 'KPI-004', name: 'Training Hours per Employee', category: 'Development', target: 40, actual: 32, unit: 'hours', frequency: 'Quarterly', owner: 'L&D Manager', department: 'Human Resources', status: 'at_risk', trend: [8, 16, 24, 32], createdDate: '2026-01-01' },
  { id: 'KPI-005', name: 'Payroll Accuracy', category: 'Payroll', target: 99.5, actual: 99.8, unit: '%', frequency: 'Monthly', owner: 'Payroll Officer', department: 'Finance', status: 'on_track', trend: [99.2, 99.5, 99.7, 99.8], createdDate: '2026-01-01' },
  { id: 'KPI-006', name: 'Absenteeism Rate', category: 'Attendance', target: 3, actual: 4.1, unit: '%', frequency: 'Monthly', owner: 'HR Manager', department: 'Human Resources', status: 'behind', trend: [3.5, 3.8, 4.0, 4.1], createdDate: '2026-01-01' },
  { id: 'KPI-007', name: 'Revenue per Employee', category: 'Productivity', target: 500000, actual: 480000, unit: 'Ksh', frequency: 'Quarterly', owner: 'CFO', department: 'Finance', status: 'at_risk', trend: [420000, 450000, 465000, 480000], createdDate: '2026-01-01' },
  { id: 'KPI-008', name: 'Offer Acceptance Rate', category: 'Recruitment', target: 90, actual: 92, unit: '%', frequency: 'Quarterly', owner: 'Recruitment Lead', department: 'Human Resources', status: 'on_track', trend: [85, 88, 90, 92], createdDate: '2026-01-01' },
  { id: 'KPI-009', name: 'Diversity Index', category: 'Diversity', target: 0.8, actual: 0.72, unit: 'index', frequency: 'Annual', owner: 'HR Director', department: 'Human Resources', status: 'at_risk', trend: [0.65, 0.68, 0.70, 0.72], createdDate: '2026-01-01' },
  { id: 'KPI-010', name: 'Cost per Hire', category: 'Recruitment', target: 150000, actual: 135000, unit: 'Ksh', frequency: 'Quarterly', owner: 'Recruitment Lead', department: 'Human Resources', status: 'on_track', trend: [180000, 165000, 148000, 135000], createdDate: '2026-01-01' },
];

// Announcements
export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

export const announcements: Announcement[] = [
  { id: 'ANN-001', title: 'April 2026 Payroll Schedule', content: 'Payroll processing for April will commence on 25th April. Please ensure all timesheets are submitted by 22nd April.', author: 'HR Admin', date: '2026-04-01', priority: 'high', category: 'Payroll' },
  { id: 'ANN-002', title: 'Company Town Hall – Q1 Review', content: 'Join us for the Q1 2026 review on 15th April at 2:00 PM in the main conference hall. Virtual link will be shared.', author: 'CEO Office', date: '2026-04-03', priority: 'medium', category: 'General' },
  { id: 'ANN-003', title: 'New SHIF Registration Deadline', content: 'All employees must complete their SHIF registration by 30th April 2026. Please visit HR for assistance.', author: 'HR Admin', date: '2026-04-02', priority: 'high', category: 'Compliance' },
  { id: 'ANN-004', title: 'Staff Wellness Program Launch', content: 'We are excited to announce our new wellness program starting May 2026. Register with HR for gym membership benefits.', author: 'HR Wellness', date: '2026-04-04', priority: 'low', category: 'Wellness' },
  { id: 'ANN-005', title: 'IT Systems Maintenance', content: 'Scheduled maintenance on all IT systems on Saturday 12th April from 10 PM to 6 AM. Please save all work before then.', author: 'IT Admin', date: '2026-04-05', priority: 'medium', category: 'IT' },
];

export const formatCurrency = (amount: number): string => {
  return `Ksh ${amount.toLocaleString('en-KE')}`;
};
