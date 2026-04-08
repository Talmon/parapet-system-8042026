// Performance Module Data — Full Workflow
export interface CompanyGoal {
  id: string;
  title: string;
  description: string;
  category: string;
  targetDate: string;
  progress: number;
  owner: string;
  status: 'on_track' | 'at_risk' | 'behind' | 'completed';
}

export interface DepartmentGoal {
  id: string;
  companyGoalId: string;
  department: string;
  title: string;
  target: number;
  actual: number;
  unit: string;
  hodName: string;
  status: 'on_track' | 'at_risk' | 'behind' | 'completed';
}

export interface IndividualTarget {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  departmentGoalId: string;
  title: string;
  description: string;
  weight: number;
  targetValue: number;
  actualValue: number;
  unit: string;
  dueDate: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'exceeded';
}

export type AppraisalStage =
  | 'targets_set'
  | 'tracking'
  | 'check_in'
  | 'appraisal_issued'
  | 'self_assessment'
  | 'manager_evaluation'
  | 'hod_approval'
  | 'hr_processing'
  | 'results_presented'
  | 'decision_made';

export interface Appraisal {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  reviewer: string;
  hodName: string;
  cycle: string;
  stage: AppraisalStage;
  selfRating: number | null;
  managerRating: number | null;
  finalRating: number | null;
  selfComments: string;
  managerComments: string;
  goalsCompleted: number;
  goalsTotal: number;
  decision: 'pending' | 'reward' | 'pip' | 'training' | 'promotion' | null;
  decisionDetails: string;
  submittedDate: string | null;
  completedDate: string | null;
}

export interface CheckIn {
  id: string;
  appraisalId: string;
  employeeName: string;
  date: string;
  notes: string;
  actionItems: string;
  managerNotes: string;
}

export interface PIP {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  startDate: string;
  endDate: string;
  reason: string;
  objectives: string[];
  progress: number;
  status: 'active' | 'completed' | 'extended' | 'terminated';
  reviewDates: string[];
}

export const appraisalStages: { key: AppraisalStage; label: string; color: string }[] = [
  { key: 'targets_set', label: 'Targets Set', color: 'bg-slate-400' },
  { key: 'tracking', label: 'Tracking', color: 'bg-blue-400' },
  { key: 'check_in', label: 'Check-in', color: 'bg-cyan-400' },
  { key: 'appraisal_issued', label: 'Appraisal Issued', color: 'bg-indigo-400' },
  { key: 'self_assessment', label: 'Self-Assessment', color: 'bg-purple-400' },
  { key: 'manager_evaluation', label: 'Manager Eval', color: 'bg-violet-400' },
  { key: 'hod_approval', label: 'HOD Approval', color: 'bg-amber-400' },
  { key: 'hr_processing', label: 'HR Processing', color: 'bg-orange-400' },
  { key: 'results_presented', label: 'Results Presented', color: 'bg-emerald-400' },
  { key: 'decision_made', label: 'Decision Made', color: 'bg-green-500' },
];

export const companyGoals: CompanyGoal[] = [
  { id: 'CG-001', title: 'Increase Revenue by 25%', description: 'Achieve KES 5B revenue target for FY 2026', category: 'Financial', targetDate: '2026-12-31', progress: 42, owner: 'CEO', status: 'on_track' },
  { id: 'CG-002', title: 'Reduce Employee Turnover to <5%', description: 'Improve retention through engagement and development', category: 'People', targetDate: '2026-12-31', progress: 65, owner: 'CHRO', status: 'on_track' },
  { id: 'CG-003', title: 'Launch 3 New Products', description: 'Deliver innovative product lines to market', category: 'Growth', targetDate: '2026-12-31', progress: 33, owner: 'CTO', status: 'at_risk' },
  { id: 'CG-004', title: 'Achieve ISO 27001 Certification', description: 'Information security management system certification', category: 'Compliance', targetDate: '2026-09-30', progress: 78, owner: 'CISO', status: 'on_track' },
  { id: 'CG-005', title: 'Customer Satisfaction Score >90%', description: 'Improve NPS and customer experience', category: 'Customer', targetDate: '2026-12-31', progress: 22, owner: 'COO', status: 'behind' },
];

export const departmentGoals: DepartmentGoal[] = [
  { id: 'DG-001', companyGoalId: 'CG-001', department: 'Sales', title: 'Achieve KES 2B in direct sales', target: 2000, actual: 920, unit: 'M KES', hodName: 'Sarah Wambui', status: 'on_track' },
  { id: 'DG-002', companyGoalId: 'CG-001', department: 'Marketing', title: 'Generate 5,000 qualified leads', target: 5000, actual: 2100, unit: 'leads', hodName: 'Dennis Rotich', status: 'at_risk' },
  { id: 'DG-003', companyGoalId: 'CG-002', department: 'Human Resources', title: 'Implement mentorship program', target: 100, actual: 72, unit: '% completion', hodName: 'Jane Wanjiku', status: 'on_track' },
  { id: 'DG-004', companyGoalId: 'CG-003', department: 'Engineering', title: 'Deliver MVP for Product Alpha', target: 100, actual: 45, unit: '% completion', hodName: 'James Otieno', status: 'at_risk' },
  { id: 'DG-005', companyGoalId: 'CG-004', department: 'IT', title: 'Complete security audit & remediation', target: 100, actual: 85, unit: '% completion', hodName: 'Samuel Kiprop', status: 'on_track' },
  { id: 'DG-006', companyGoalId: 'CG-005', department: 'Customer Support', title: 'Reduce avg response time to <2hrs', target: 2, actual: 3.1, unit: 'hours', hodName: 'Lucy Akinyi', status: 'behind' },
];

export const individualTargets: IndividualTarget[] = [
  { id: 'IT-001', employeeId: 'PAR-0023', employeeName: 'Grace Muthoni', department: 'Engineering', departmentGoalId: 'DG-004', title: 'Complete API integration module', description: 'Build and test 15 API endpoints', weight: 30, targetValue: 15, actualValue: 12, unit: 'endpoints', dueDate: '2026-06-30', status: 'in_progress' },
  { id: 'IT-002', employeeId: 'PAR-0023', employeeName: 'Grace Muthoni', department: 'Engineering', departmentGoalId: 'DG-004', title: 'Code review participation', description: 'Review minimum 50 PRs this quarter', weight: 20, targetValue: 50, actualValue: 38, unit: 'PRs', dueDate: '2026-06-30', status: 'in_progress' },
  { id: 'IT-003', employeeId: 'PAR-0087', employeeName: 'David Ochieng', department: 'Sales', departmentGoalId: 'DG-001', title: 'Close KES 200M in new business', description: 'Acquire and close enterprise deals', weight: 40, targetValue: 200, actualValue: 145, unit: 'M KES', dueDate: '2026-06-30', status: 'in_progress' },
  { id: 'IT-004', employeeId: 'PAR-0087', employeeName: 'David Ochieng', department: 'Sales', departmentGoalId: 'DG-001', title: 'Build pipeline of KES 500M', description: 'Create and maintain sales pipeline', weight: 30, targetValue: 500, actualValue: 520, unit: 'M KES', dueDate: '2026-06-30', status: 'exceeded' },
  { id: 'IT-005', employeeId: 'PAR-0145', employeeName: 'Amina Hassan', department: 'Finance', departmentGoalId: 'DG-001', title: 'Monthly financial close by Day 3', description: 'Close books within 3 working days', weight: 35, targetValue: 100, actualValue: 100, unit: '% compliance', dueDate: '2026-06-30', status: 'completed' },
  { id: 'IT-006', employeeId: 'PAR-0201', employeeName: 'Peter Kamau', department: 'Operations', departmentGoalId: 'DG-006', title: 'Reduce operational downtime', description: 'Achieve 99.5% uptime across facilities', weight: 40, targetValue: 99.5, actualValue: 97.8, unit: '%', dueDate: '2026-06-30', status: 'in_progress' },
  { id: 'IT-007', employeeId: 'PAR-0099', employeeName: 'Samuel Kiprop', department: 'IT', departmentGoalId: 'DG-005', title: 'Complete penetration testing', description: 'Run quarterly pen tests on all systems', weight: 35, targetValue: 4, actualValue: 3, unit: 'tests', dueDate: '2026-06-30', status: 'in_progress' },
  { id: 'IT-008', employeeId: 'PAR-0456', employeeName: 'Lucy Akinyi', department: 'Marketing', departmentGoalId: 'DG-002', title: 'Run 12 campaign cycles', description: 'Execute monthly marketing campaigns', weight: 30, targetValue: 12, actualValue: 4, unit: 'campaigns', dueDate: '2026-12-31', status: 'in_progress' },
];

export const initialAppraisals: Appraisal[] = [
  { id: 'APR-001', employeeId: 'PAR-0023', employeeName: 'Grace Muthoni', department: 'Engineering', reviewer: 'James Otieno', hodName: 'James Otieno', cycle: 'Q1 2026', stage: 'decision_made', selfRating: 4.5, managerRating: 4.3, finalRating: 4.4, selfComments: 'Exceeded expectations on API delivery.', managerComments: 'Excellent technical contributor. Strong team player.', goalsCompleted: 4, goalsTotal: 5, decision: 'reward', decisionDetails: 'Salary increment of 12% effective July 2026', submittedDate: '2026-03-28', completedDate: '2026-04-05' },
  { id: 'APR-002', employeeId: 'PAR-0087', employeeName: 'David Ochieng', department: 'Sales', reviewer: 'Sarah Wambui', hodName: 'Sarah Wambui', cycle: 'Q1 2026', stage: 'hr_processing', selfRating: 4.0, managerRating: 3.8, finalRating: null, selfComments: 'Pipeline exceeded target. Working on closing ratios.', managerComments: 'Good pipeline management. Needs improvement in closing.', goalsCompleted: 3, goalsTotal: 5, decision: null, decisionDetails: '', submittedDate: '2026-03-30', completedDate: null },
  { id: 'APR-003', employeeId: 'PAR-0145', employeeName: 'Amina Hassan', department: 'Finance', reviewer: 'John Maina', hodName: 'John Maina', cycle: 'Q1 2026', stage: 'manager_evaluation', selfRating: 4.2, managerRating: null, finalRating: null, selfComments: 'Consistently met month-end closing deadlines.', managerComments: '', goalsCompleted: 3, goalsTotal: 4, decision: null, decisionDetails: '', submittedDate: '2026-04-01', completedDate: null },
  { id: 'APR-004', employeeId: 'PAR-0201', employeeName: 'Peter Kamau', department: 'Operations', reviewer: 'Lucy Akinyi', hodName: 'Francis Ndungu', cycle: 'Q1 2026', stage: 'self_assessment', selfRating: null, managerRating: null, finalRating: null, selfComments: '', managerComments: '', goalsCompleted: 2, goalsTotal: 5, decision: null, decisionDetails: '', submittedDate: null, completedDate: null },
  { id: 'APR-005', employeeId: 'PAR-0312', employeeName: 'Jane Wanjiku', department: 'Human Resources', reviewer: 'Brian Mwangi', hodName: 'Jane Wanjiku', cycle: 'Q1 2026', stage: 'appraisal_issued', selfRating: null, managerRating: null, finalRating: null, selfComments: '', managerComments: '', goalsCompleted: 2, goalsTotal: 4, decision: null, decisionDetails: '', submittedDate: null, completedDate: null },
  { id: 'APR-006', employeeId: 'PAR-0099', employeeName: 'Samuel Kiprop', department: 'IT', reviewer: 'Grace Muthoni', hodName: 'Samuel Kiprop', cycle: 'Q1 2026', stage: 'decision_made', selfRating: 4.8, managerRating: 4.7, finalRating: 4.7, selfComments: 'Led security initiative. All targets exceeded.', managerComments: 'Outstanding performance. Ready for promotion.', goalsCompleted: 5, goalsTotal: 5, decision: 'promotion', decisionDetails: 'Promoted to Senior IT Manager effective May 2026', submittedDate: '2026-03-25', completedDate: '2026-04-03' },
  { id: 'APR-007', employeeId: 'PAR-0456', employeeName: 'Lucy Akinyi', department: 'Marketing', reviewer: 'Dennis Rotich', hodName: 'Dennis Rotich', cycle: 'Q1 2026', stage: 'decision_made', selfRating: 2.8, managerRating: 2.5, finalRating: 2.6, selfComments: 'Campaign delivery was delayed due to vendor issues.', managerComments: 'Below expectations. Needs structured improvement plan.', goalsCompleted: 1, goalsTotal: 4, decision: 'pip', decisionDetails: 'Performance Improvement Plan - 90 days starting April 2026', submittedDate: '2026-03-27', completedDate: '2026-04-04' },
  { id: 'APR-008', employeeId: 'PAR-0178', employeeName: 'Brian Mwangi', department: 'Engineering', reviewer: 'James Otieno', hodName: 'James Otieno', cycle: 'Q1 2026', stage: 'tracking', selfRating: null, managerRating: null, finalRating: null, selfComments: '', managerComments: '', goalsCompleted: 1, goalsTotal: 4, decision: null, decisionDetails: '', submittedDate: null, completedDate: null },
  { id: 'APR-009', employeeId: 'PAR-0055', employeeName: 'Faith Njeri', department: 'Customer Support', reviewer: 'Lucy Akinyi', hodName: 'Lucy Akinyi', cycle: 'Q1 2026', stage: 'hod_approval', selfRating: 3.5, managerRating: 3.6, finalRating: null, selfComments: 'Managed increased ticket volume effectively.', managerComments: 'Solid performance. Room for growth in leadership.', goalsCompleted: 3, goalsTotal: 4, decision: null, decisionDetails: '', submittedDate: '2026-03-29', completedDate: null },
  { id: 'APR-010', employeeId: 'PAR-0333', employeeName: 'Kevin Langat', department: 'Finance', reviewer: 'John Maina', hodName: 'John Maina', cycle: 'Q1 2026', stage: 'decision_made', selfRating: 3.2, managerRating: 3.0, finalRating: 3.1, selfComments: 'Struggled with new reporting system transition.', managerComments: 'Needs training on new ERP system.', goalsCompleted: 2, goalsTotal: 5, decision: 'training', decisionDetails: 'Enrolled in ERP Advanced Training - 4 weeks', submittedDate: '2026-03-26', completedDate: '2026-04-02' },
];

export const checkIns: CheckIn[] = [
  { id: 'CI-001', appraisalId: 'APR-001', employeeName: 'Grace Muthoni', date: '2026-02-15', notes: 'On track with API development. 10/15 endpoints complete.', actionItems: 'Focus on remaining 5 endpoints. Start documentation.', managerNotes: 'Good progress. Ensure test coverage >80%.' },
  { id: 'CI-002', appraisalId: 'APR-001', employeeName: 'Grace Muthoni', date: '2026-03-15', notes: 'Completed 12 endpoints. Documentation 60% done.', actionItems: 'Complete documentation. Prepare for code freeze.', managerNotes: 'Excellent trajectory. Consider mentoring junior devs.' },
  { id: 'CI-003', appraisalId: 'APR-002', employeeName: 'David Ochieng', date: '2026-02-10', notes: 'Pipeline at KES 380M. Need more enterprise leads.', actionItems: 'Attend 3 industry events. Schedule 10 discovery calls.', managerNotes: 'Pipeline growing well. Focus on conversion rate.' },
  { id: 'CI-004', appraisalId: 'APR-004', employeeName: 'Peter Kamau', date: '2026-03-01', notes: 'Facility uptime at 97.2%. Working on backup systems.', actionItems: 'Complete generator maintenance. Review SLAs.', managerNotes: 'Uptime below target. Escalate generator repairs.' },
];

export const initialPIPs: PIP[] = [
  { id: 'PIP-001', employeeId: 'PAR-0456', employeeName: 'Lucy Akinyi', department: 'Marketing', startDate: '2026-04-07', endDate: '2026-07-07', reason: 'Below expectations in Q1 2026 performance review. Campaign delivery consistently delayed.', objectives: ['Deliver 3 campaigns on schedule within 30 days', 'Attend project management training by Apr 30', 'Achieve 80% stakeholder satisfaction score', 'Submit weekly progress reports to HOD'], progress: 15, status: 'active', reviewDates: ['2026-05-07', '2026-06-07', '2026-07-07'] },
  { id: 'PIP-002', employeeId: 'PAR-0789', employeeName: 'Collins Wekesa', department: 'Sales', startDate: '2026-01-15', endDate: '2026-04-15', reason: 'Failed to meet quarterly sales targets for 2 consecutive quarters.', objectives: ['Close KES 50M in new business monthly', 'Maintain 20 active prospects in pipeline', 'Complete advanced sales methodology training'], progress: 72, status: 'active', reviewDates: ['2026-02-15', '2026-03-15', '2026-04-15'] },
];
