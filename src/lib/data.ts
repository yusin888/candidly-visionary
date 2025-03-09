// Mock data for the CandidAI dashboard

export interface Candidate {
  id: string;
  name: string;
  role: string;
  status: 'initial' | 'soft_skills' | 'detailed_scoring' | 'final_ranking' | 'hired' | 'rejected';
  experience: number;
  educationScore: number;
  softSkillsScore: number;
  technicalScore: number;
  finalScore: number;
  avatar?: string;
  applied: string; // date string
  lastUpdated: string; // date string
}

export interface PipelineStage {
  name: string;
  count: number;
  percentage: number;
}

export interface AnalyticsData {
  label: string;
  value: number;
  color?: string;
}

// Status label mapping
export const statusLabels = {
  initial: 'Initial Filtering',
  soft_skills: 'Soft Skills Evaluation',
  detailed_scoring: 'Detailed Scoring',
  final_ranking: 'Final Ranking',
  hired: 'Hired',
  rejected: 'Rejected'
};

// Status colors
export const statusColors = {
  initial: 'bg-blue-100 text-blue-800',
  soft_skills: 'bg-purple-100 text-purple-800',
  detailed_scoring: 'bg-yellow-100 text-yellow-800',
  final_ranking: 'bg-green-100 text-green-800',
  hired: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800'
};

// Mock candidates
export const candidates: Candidate[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    role: 'Senior Software Engineer',
    status: 'final_ranking',
    experience: 8,
    educationScore: 92,
    softSkillsScore: 88,
    technicalScore: 95,
    finalScore: 91.7,
    applied: '2023-05-15T10:30:00Z',
    lastUpdated: '2023-05-22T14:45:00Z'
  },
  {
    id: '2',
    name: 'Samantha Lee',
    role: 'UX/UI Designer',
    status: 'detailed_scoring',
    experience: 5,
    educationScore: 84,
    softSkillsScore: 92,
    technicalScore: 88,
    finalScore: 88.0,
    applied: '2023-05-16T09:15:00Z',
    lastUpdated: '2023-05-21T11:30:00Z'
  },
  {
    id: '3',
    name: 'Michael Chen',
    role: 'Product Manager',
    status: 'soft_skills',
    experience: 6,
    educationScore: 90,
    softSkillsScore: 76,
    technicalScore: 82,
    finalScore: 82.7,
    applied: '2023-05-17T13:45:00Z',
    lastUpdated: '2023-05-20T16:20:00Z'
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    role: 'Data Scientist',
    status: 'initial',
    experience: 3,
    educationScore: 95,
    softSkillsScore: 84,
    technicalScore: 90,
    finalScore: 89.7,
    applied: '2023-05-18T11:00:00Z',
    lastUpdated: '2023-05-19T09:10:00Z'
  },
  {
    id: '5',
    name: 'David Kim',
    role: 'DevOps Engineer',
    status: 'hired',
    experience: 7,
    educationScore: 88,
    softSkillsScore: 90,
    technicalScore: 94,
    finalScore: 90.7,
    applied: '2023-05-10T08:30:00Z',
    lastUpdated: '2023-05-23T15:45:00Z'
  },
  {
    id: '6',
    name: 'Jessica Taylor',
    role: 'Frontend Developer',
    status: 'rejected',
    experience: 2,
    educationScore: 82,
    softSkillsScore: 78,
    technicalScore: 75,
    finalScore: 78.3,
    applied: '2023-05-12T14:20:00Z',
    lastUpdated: '2023-05-18T10:35:00Z'
  },
  {
    id: '7',
    name: 'Robert Martinez',
    role: 'Backend Developer',
    status: 'detailed_scoring',
    experience: 4,
    educationScore: 86,
    softSkillsScore: 80,
    technicalScore: 89,
    finalScore: 85.0,
    applied: '2023-05-14T16:40:00Z',
    lastUpdated: '2023-05-21T13:25:00Z'
  },
  {
    id: '8',
    name: 'Lisa Wang',
    role: 'QA Engineer',
    status: 'soft_skills',
    experience: 5,
    educationScore: 84,
    softSkillsScore: 86,
    technicalScore: 90,
    finalScore: 86.7,
    applied: '2023-05-16T10:15:00Z',
    lastUpdated: '2023-05-20T11:50:00Z'
  },
  {
    id: '9',
    name: 'James Wilson',
    role: 'Systems Architect',
    status: 'final_ranking',
    experience: 9,
    educationScore: 94,
    softSkillsScore: 82,
    technicalScore: 96,
    finalScore: 90.7,
    applied: '2023-05-11T09:30:00Z',
    lastUpdated: '2023-05-22T16:40:00Z'
  },
  {
    id: '10',
    name: 'Olivia Garcia',
    role: 'Machine Learning Engineer',
    status: 'initial',
    experience: 2,
    educationScore: 96,
    softSkillsScore: 79,
    technicalScore: 88,
    finalScore: 87.7,
    applied: '2023-05-17T11:20:00Z',
    lastUpdated: '2023-05-19T14:30:00Z'
  }
];

// Dashboard statistics
export const dashboardStats = [
  { label: 'Total Candidates', value: 245, icon: 'users' },
  { label: 'Open Positions', value: 12, icon: 'briefcase' },
  { label: 'Final Stage', value: 24, icon: 'check-circle' },
  { label: 'Avg. Time to Hire', value: '18 days', icon: 'clock' }
];

// Pipeline data
export const pipelineData: PipelineStage[] = [
  { name: 'Initial Filtering', count: 120, percentage: 100 },
  { name: 'Soft Skills Evaluation', count: 84, percentage: 70 },
  { name: 'Detailed Scoring', count: 52, percentage: 43 },
  { name: 'Final Ranking', count: 24, percentage: 20 },
  { name: 'Hired', count: 14, percentage: 12 }
];

// Role distribution
export const roleDistribution: AnalyticsData[] = [
  { label: 'Engineering', value: 38, color: '#3b82f6' },
  { label: 'Design', value: 22, color: '#8b5cf6' },
  { label: 'Product', value: 18, color: '#10b981' },
  { label: 'Data Science', value: 12, color: '#f59e0b' },
  { label: 'Marketing', value: 10, color: '#ef4444' }
];

// Experience distribution
export const experienceDistribution: AnalyticsData[] = [
  { label: '0-2 years', value: 35 },
  { label: '3-5 years', value: 25 },
  { label: '6-8 years', value: 20 },
  { label: '9-12 years', value: 15 },
  { label: '13+ years', value: 5 }
];

// Scores over time
export const scoresOverTime = [
  { month: 'Jan', education: 82, softSkills: 78, technical: 85 },
  { month: 'Feb', education: 84, softSkills: 80, technical: 84 },
  { month: 'Mar', education: 85, softSkills: 81, technical: 86 },
  { month: 'Apr', education: 83, softSkills: 83, technical: 85 },
  { month: 'May', education: 86, softSkills: 84, technical: 88 },
  { month: 'Jun', education: 88, softSkills: 85, technical: 89 }
];

// Latest TalentTalk insights
export const insights = [
  "Three candidates with machine learning experience qualified for final ranking today",
  "Average soft skills score for senior candidates is 85.3, a 3% increase from last month",
  "Bottleneck detected in soft skills evaluation stage - 16 candidates pending for over 5 days",
  "Diversity metrics improved by 12% this quarter compared to the previous",
  "New ML Engineer candidates have significantly higher technical scores than previous cohort"
];

// Candidate evaluation timeline events
export const timelineEvents = [
  { date: '2023-05-15', stage: 'Application Received', details: 'Resume submitted for Senior Software Engineer position' },
  { date: '2023-05-16', stage: 'Initial Screening', details: 'Resume and qualifications reviewed, education score: 92' },
  { date: '2023-05-18', stage: 'Soft Skills Evaluation', details: 'Communication, teamwork, and leadership assessed, soft skills score: 88' },
  { date: '2023-05-20', stage: 'Technical Assessment', details: 'Technical knowledge and problem-solving evaluated, technical score: 95' },
  { date: '2023-05-22', stage: 'Final Ranking', details: 'Candidate ranked in top 5 with final score of 91.7' }
];

// Sample chatbot messages
export const chatbotMessages = [
  { sender: 'user' as const, content: 'Show me the top candidates for the Software Engineer role' },
  { sender: 'bot' as const, content: 'I found 3 top-ranked candidates for Software Engineer positions. Alex Johnson is currently the highest rated with a 91.7 final score. Would you like me to show their detailed profiles?' },
  { sender: 'user' as const, content: 'What\'s the average technical score for Senior roles?' },
  { sender: 'bot' as const, content: 'The average technical score for Senior level roles is 92.4, which is 8% higher than the company average across all positions.' }
];
