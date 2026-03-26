import { Task, Metric, JournalEntry, Resource, UserProgress } from './types';

export const INITIAL_PROGRESS: UserProgress = {
  companyValuation: 0,
  currentStageIndex: 0,
  mrr: 0,
  savings: 12000,
  burnRate: 2000,
  runwayDays: 180, // 6 months of survival
  pressure: 0,
  streak: 0,
  status: 'The Wilderness',
  isWeekLocked: false,
  weeklyCompletionRate: 100,
  skillLevels: {
    Operations: 1,
    Sales: 1,
    Product: 1,
    Learning: 1,
  },
  badges: [],
  isFocusModeActive: false,
  difficultyMultiplier: 1.0,
  resilienceScore: 0,
  stageHistory: [],
};

export const MOTIVATIONAL_QUOTES = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  "Don't be embarrassed by your failures, learn from them and start again. - Richard Branson",
  "It's not about ideas. It's about making ideas happen. - Scott Belsky",
  "The secret of change is to focus all of your energy, not on fighting the old, but on building the new. - Socrates",
  "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.",
  "The best way to predict the future is to create it. - Peter Drucker",
  "Hardships often prepare ordinary people for an extraordinary destiny. - C.S. Lewis"
];

export const LIFECYCLE_STAGES = [
  { name: 'The Wilderness', mrrTarget: 2500 },
  { name: 'Ramen Profitable', mrrTarget: 10000 },
  { name: 'The Scale-Up', mrrTarget: 100000 }
];

export const DEFAULT_METRICS = [
  "Customers Contacted",
  "Paying Customers",
  "Revenue ($)",
  "Operational Processes Completed",
  "Product Iterations"
];

export const HARD_TRUTHS = [
  "90% of startups fail. You are likely in that 90% unless you outwork everyone else.",
  "Your idea is worthless. Execution is the only thing that matters.",
  "Nobody cares about your product as much as you do. They only care about their own problems.",
  "Burnout is real, and it will hit you when you least expect it. Resilience is your only shield.",
  "Most of your assumptions about your customers are wrong. Go talk to them.",
  "Fundraising is not a milestone. It's a debt you have to pay back with interest.",
  "Your friends and family won't understand why you're doing this. You will be lonely.",
  "Success takes twice as long and costs three times as much as you planned.",
  "The market doesn't owe you anything. You have to take what you want.",
  "If it was easy, everyone would be a billionaire. It's supposed to be hard."
];
