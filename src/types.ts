export type TaskCategory = 'Operations' | 'Sales' | 'Product' | 'Learning' | 'General';
export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Pending' | 'Completed' | 'Overdue';

export interface MicroTask {
  id: string;
  title: string;
  completed: boolean;
  points: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus | 'Failed';
  dueDate: string; // ISO string
  timeBlock?: string; // e.g., "09:00 - 10:30"
  isRepeatable?: boolean;
  points: number;
  leverage: 'RGA' | 'Support';
  microTasks?: MicroTask[];
  penalty?: number;
}

export interface Metric {
  id: string;
  name: string;
  value: number;
  unit: string;
  date: string; // ISO string
}

export interface JournalEntry {
  id: string;
  date: string; // ISO string
  whatWorked: string;
  whatFailed: string;
  lessonsLearned: string;
  tags: string[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'Book' | 'Podcast' | 'Mentor' | 'Article' | 'Other';
  link?: string;
  notes: string;
  keyLessons: string[];
  dateAdded: string;
  fileData?: string; // Base64 string for PDF
  fileName?: string;
}

export interface SkillLevels {
  Operations: number;
  Sales: number;
  Product: number;
  Learning: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  unlockedAt?: string;
}

export interface StageCompletion {
  stage: string;
  date: string;
  deanComment: string;
  gpa: number;
}

export interface UserProgress {
  companyValuation: number; // Academic & Project Value
  currentStageIndex: number;
  mrr: number; // Project Funding
  savings: number; // Personal savings to survive
  burnRate: number; // Personal monthly expenses
  runwayDays: number; // Days of life left
  pressure: number; // 0-100
  streak: number;
  lastCheckIn?: string;
  status: 'The Wilderness' | 'Ramen Profitable' | 'The Scale-Up' | 'Graduated' | 'Expelled';
  isWeekLocked: boolean;
  weeklyCompletionRate: number;
  skillLevels: SkillLevels;
  badges: Badge[];
  accountabilityPartnerEmail?: string;
  isFocusModeActive: boolean;
  difficultyMultiplier: number;
  lastFailedAuditAnalysis?: string;
  resilienceScore: number;
  stageHistory: StageCompletion[];
  progressPercentage: number;
  completedLevels: string[];
  roadmapMode: 'Startup' | 'BEAT';
}

export interface MarketShock {
  id: string;
  title: string;
  description: string;
  severity: 'Moderate' | 'High' | 'Critical';
  dateTriggered: string;
  responsePlan?: string;
  resolved: boolean;
}
