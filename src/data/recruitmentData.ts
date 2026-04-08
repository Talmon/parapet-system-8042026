// Recruitment Module Data — Full Workflow

export interface Requisition {
  id: string;
  position: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  justification: string;
  requestedBy: string;
  approvedBy: string | null;
  budgetedSalary: { min: number; max: number };
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'draft' | 'pending_approval' | 'approved' | 'sourcing' | 'interviewing' | 'offer_stage' | 'filled' | 'cancelled';
  createdDate: string;
  approvedDate: string | null;
  fillingMethod: 'internal' | 'external' | 'both' | null;
}

export type CandidateStage =
  | 'applied'
  | 'screening'
  | 'shortlisted'
  | 'interview_scheduled'
  | 'interviewed'
  | 'evaluated'
  | 'selected'
  | 'background_check'
  | 'offer_sent'
  | 'offer_accepted'
  | 'offer_rejected'
  | 'hired'
  | 'rejected';

export interface Candidate {
  id: string;
  requisitionId: string;
  name: string;
  email: string;
  phone: string;
  currentCompany: string;
  currentRole: string;
  experience: number;
  education: string;
  source: 'HRMIS' | 'LinkedIn' | 'Job Board' | 'Referral' | 'Agency' | 'Walk-in';
  appliedDate: string;
  stage: CandidateStage;
  rating: number | null;
  notes: string;
  interviewScore: number | null;
  backgroundCheckStatus: 'pending' | 'passed' | 'failed' | null;
  offerAmount: number | null;
  offerStatus: 'pending' | 'accepted' | 'rejected' | 'negotiating' | null;
}

export interface InterviewPanel {
  id: string;
  requisitionId: string;
  candidateId: string;
  candidateName: string;
  position: string;
  panelMembers: string[];
  scheduledDate: string;
  scheduledTime: string;
  type: 'Technical' | 'Behavioral' | 'Panel' | 'HR' | 'Final';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  feedback: string;
  score: number | null;
  recommendation: 'strongly_hire' | 'hire' | 'maybe' | 'no_hire' | null;
}

export const candidateStages: { key: CandidateStage; label: string }[] = [
  { key: 'applied', label: 'Applied' },
  { key: 'screening', label: 'Screening' },
  { key: 'shortlisted', label: 'Shortlisted' },
  { key: 'interview_scheduled', label: 'Interview Scheduled' },
  { key: 'interviewed', label: 'Interviewed' },
  { key: 'evaluated', label: 'Evaluated' },
  { key: 'selected', label: 'Selected' },
  { key: 'background_check', label: 'Background Check' },
  { key: 'offer_sent', label: 'Offer Sent' },
  { key: 'offer_accepted', label: 'Offer Accepted' },
  { key: 'offer_rejected', label: 'Offer Rejected' },
  { key: 'hired', label: 'Hired' },
  { key: 'rejected', label: 'Rejected' },
];

export const initialRequisitions: Requisition[] = [
  { id: 'REQ-001', position: 'Senior Software Engineer', department: 'Engineering', location: 'Nairobi', type: 'Full-time', justification: 'Team expansion for Product Alpha', requestedBy: 'James Otieno', approvedBy: 'CEO', budgetedSalary: { min: 350000, max: 500000 }, priority: 'urgent', status: 'interviewing', createdDate: '2026-03-01', approvedDate: '2026-03-05', fillingMethod: 'external' },
  { id: 'REQ-002', position: 'Financial Analyst', department: 'Finance', location: 'Nairobi', type: 'Full-time', justification: 'Replacement for resigned employee', requestedBy: 'John Maina', approvedBy: 'CHRO', budgetedSalary: { min: 180000, max: 280000 }, priority: 'high', status: 'offer_stage', createdDate: '2026-03-10', approvedDate: '2026-03-12', fillingMethod: 'both' },
  { id: 'REQ-003', position: 'Marketing Manager', department: 'Marketing', location: 'Mombasa', type: 'Full-time', justification: 'New regional office leadership', requestedBy: 'Dennis Rotich', approvedBy: 'COO', budgetedSalary: { min: 250000, max: 400000 }, priority: 'medium', status: 'sourcing', createdDate: '2026-03-15', approvedDate: '2026-03-18', fillingMethod: 'external' },
  { id: 'REQ-004', position: 'DevOps Engineer', department: 'IT', location: 'Remote', type: 'Contract', justification: 'Cloud migration project support', requestedBy: 'Samuel Kiprop', approvedBy: 'CTO', budgetedSalary: { min: 300000, max: 450000 }, priority: 'urgent', status: 'interviewing', createdDate: '2026-02-20', approvedDate: '2026-02-22', fillingMethod: 'external' },
  { id: 'REQ-005', position: 'HR Coordinator', department: 'Human Resources', location: 'Nairobi', type: 'Full-time', justification: 'Support growing workforce administration', requestedBy: 'Jane Wanjiku', approvedBy: null, budgetedSalary: { min: 120000, max: 180000 }, priority: 'medium', status: 'pending_approval', createdDate: '2026-03-25', approvedDate: null, fillingMethod: null },
  { id: 'REQ-006', position: 'Sales Representative', department: 'Sales', location: 'Kisumu', type: 'Full-time', justification: 'Western region expansion', requestedBy: 'Sarah Wambui', approvedBy: 'COO', budgetedSalary: { min: 100000, max: 160000 }, priority: 'low', status: 'filled', createdDate: '2026-02-01', approvedDate: '2026-02-03', fillingMethod: 'both' },
  { id: 'REQ-007', position: 'Data Analyst Intern', department: 'IT', location: 'Nairobi', type: 'Internship', justification: 'Graduate internship program Q2', requestedBy: 'Samuel Kiprop', approvedBy: null, budgetedSalary: { min: 30000, max: 50000 }, priority: 'low', status: 'draft', createdDate: '2026-04-01', approvedDate: null, fillingMethod: null },
];

export const initialCandidates: Candidate[] = [
  // REQ-001 candidates (Senior Software Engineer)
  { id: 'CAN-001', requisitionId: 'REQ-001', name: 'Victor Kipchoge', email: 'victor.k@gmail.com', phone: '+254712345678', currentCompany: 'Safaricom PLC', currentRole: 'Software Engineer', experience: 6, education: 'BSc Computer Science, UoN', source: 'LinkedIn', appliedDate: '2026-03-08', stage: 'selected', rating: 4.5, notes: 'Strong backend skills. Go/Python expert.', interviewScore: 88, backgroundCheckStatus: null, offerAmount: null, offerStatus: null },
  { id: 'CAN-002', requisitionId: 'REQ-001', name: 'Sophia Chepkoech', email: 'sophia.c@outlook.com', phone: '+254723456789', currentCompany: 'Andela', currentRole: 'Senior Developer', experience: 7, education: 'MSc Software Engineering, JKUAT', source: 'Job Board', appliedDate: '2026-03-09', stage: 'interviewed', rating: 4.2, notes: 'Full-stack with cloud experience.', interviewScore: 82, backgroundCheckStatus: null, offerAmount: null, offerStatus: null },
  { id: 'CAN-003', requisitionId: 'REQ-001', name: 'Mark Tanui', email: 'mark.t@yahoo.com', phone: '+254734567890', currentCompany: 'Google Kenya', currentRole: 'SDE II', experience: 5, education: 'BSc IT, Strathmore', source: 'Referral', appliedDate: '2026-03-10', stage: 'shortlisted', rating: 3.8, notes: 'Referred by James Otieno.', interviewScore: null, backgroundCheckStatus: null, offerAmount: null, offerStatus: null },
  { id: 'CAN-004', requisitionId: 'REQ-001', name: 'Diana Komen', email: 'diana.k@gmail.com', phone: '+254745678901', currentCompany: 'Twiga Foods', currentRole: 'Backend Engineer', experience: 4, education: 'BSc Mathematics, KU', source: 'LinkedIn', appliedDate: '2026-03-11', stage: 'rejected', rating: 2.5, notes: 'Insufficient senior-level experience.', interviewScore: null, backgroundCheckStatus: null, offerAmount: null, offerStatus: null },

  // REQ-002 candidates (Financial Analyst)
  { id: 'CAN-005', requisitionId: 'REQ-002', name: 'Albert Mutua', email: 'albert.m@gmail.com', phone: '+254756789012', currentCompany: 'Deloitte EA', currentRole: 'Associate Analyst', experience: 4, education: 'BCom Finance, UoN', source: 'Agency', appliedDate: '2026-03-15', stage: 'offer_sent', rating: 4.3, notes: 'CFA Level 2. Strong analytical skills.', interviewScore: 90, backgroundCheckStatus: 'passed', offerAmount: 250000, offerStatus: 'negotiating' },
  { id: 'CAN-006', requisitionId: 'REQ-002', name: 'Irene Wairimu', email: 'irene.w@outlook.com', phone: '+254767890123', currentCompany: 'KCB Group', currentRole: 'Financial Analyst', experience: 5, education: 'MBA Finance, USIU', source: 'Job Board', appliedDate: '2026-03-14', stage: 'evaluated', rating: 3.9, notes: 'Backup candidate. Good banking background.', interviewScore: 78, backgroundCheckStatus: null, offerAmount: null, offerStatus: null },

  // REQ-004 candidates (DevOps Engineer)
  { id: 'CAN-007', requisitionId: 'REQ-004', name: 'Caleb Bett', email: 'caleb.b@gmail.com', phone: '+254778901234', currentCompany: 'Microsoft ATIC', currentRole: 'Cloud Engineer', experience: 5, education: 'BSc Computer Science, Moi U', source: 'LinkedIn', appliedDate: '2026-02-25', stage: 'background_check', rating: 4.6, notes: 'AWS + Azure certified. Kubernetes expert.', interviewScore: 92, backgroundCheckStatus: 'pending', offerAmount: null, offerStatus: null },
  { id: 'CAN-008', requisitionId: 'REQ-004', name: 'Winnie Cheptoo', email: 'winnie.c@yahoo.com', phone: '+254789012345', currentCompany: 'Liqd Africa', currentRole: 'DevOps Lead', experience: 8, education: 'MSc Network Security, Strathmore', source: 'Referral', appliedDate: '2026-02-26', stage: 'interviewed', rating: 4.0, notes: 'Overqualified? May have salary expectations above budget.', interviewScore: 85, backgroundCheckStatus: null, offerAmount: null, offerStatus: null },

  // REQ-006 candidates (Sales Rep - filled)
  { id: 'CAN-009', requisitionId: 'REQ-006', name: 'Mercy Odhiambo', email: 'mercy.o@gmail.com', phone: '+254790123456', currentCompany: 'Kericho Gold', currentRole: 'Sales Exec', experience: 3, education: 'Diploma Business, KCA', source: 'Walk-in', appliedDate: '2026-02-10', stage: 'hired', rating: 4.1, notes: 'Great cultural fit. Western region network.', interviewScore: 80, backgroundCheckStatus: 'passed', offerAmount: 140000, offerStatus: 'accepted' },
];

export const initialInterviews: InterviewPanel[] = [
  { id: 'INT-001', requisitionId: 'REQ-001', candidateId: 'CAN-001', candidateName: 'Victor Kipchoge', position: 'Senior Software Engineer', panelMembers: ['James Otieno', 'Grace Muthoni', 'HR Rep'], scheduledDate: '2026-03-22', scheduledTime: '10:00 AM', type: 'Technical', status: 'completed', feedback: 'Strong system design. Clean code approach. Passed coding challenge.', score: 88, recommendation: 'strongly_hire' },
  { id: 'INT-002', requisitionId: 'REQ-001', candidateId: 'CAN-002', candidateName: 'Sophia Chepkoech', position: 'Senior Software Engineer', panelMembers: ['James Otieno', 'Samuel Kiprop'], scheduledDate: '2026-03-23', scheduledTime: '2:00 PM', type: 'Technical', status: 'completed', feedback: 'Good technical breadth. Slightly less depth in system design.', score: 82, recommendation: 'hire' },
  { id: 'INT-003', requisitionId: 'REQ-002', candidateId: 'CAN-005', candidateName: 'Albert Mutua', position: 'Financial Analyst', panelMembers: ['John Maina', 'Amina Hassan', 'HR Rep'], scheduledDate: '2026-03-25', scheduledTime: '9:00 AM', type: 'Panel', status: 'completed', feedback: 'Excellent analytical presentation. Strong financial modeling.', score: 90, recommendation: 'strongly_hire' },
  { id: 'INT-004', requisitionId: 'REQ-004', candidateId: 'CAN-007', candidateName: 'Caleb Bett', position: 'DevOps Engineer', panelMembers: ['Samuel Kiprop', 'Brian Mwangi'], scheduledDate: '2026-03-20', scheduledTime: '11:00 AM', type: 'Technical', status: 'completed', feedback: 'Outstanding cloud architecture knowledge. Live demo was impressive.', score: 92, recommendation: 'strongly_hire' },
  { id: 'INT-005', requisitionId: 'REQ-001', candidateId: 'CAN-003', candidateName: 'Mark Tanui', position: 'Senior Software Engineer', panelMembers: ['James Otieno', 'Grace Muthoni'], scheduledDate: '2026-04-10', scheduledTime: '10:00 AM', type: 'Technical', status: 'scheduled', feedback: '', score: null, recommendation: null },
  { id: 'INT-006', requisitionId: 'REQ-004', candidateId: 'CAN-008', candidateName: 'Winnie Cheptoo', position: 'DevOps Engineer', panelMembers: ['Samuel Kiprop', 'Brian Mwangi', 'CTO'], scheduledDate: '2026-03-21', scheduledTime: '3:00 PM', type: 'Panel', status: 'completed', feedback: 'Extremely experienced but salary expectations may be above budget.', score: 85, recommendation: 'hire' },
];
