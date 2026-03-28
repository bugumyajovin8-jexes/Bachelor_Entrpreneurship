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
  progressPercentage: 0,
  completedLevels: [],
  roadmapMode: 'BEAT',
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

export const STARTUP_STAGES = [
  {
    name: 'The Wilderness',
    mrrTarget: 0,
    phases: [
      {
        name: 'Ideation & Validation',
        levels: [
          { id: '1.1.1', title: 'Problem Discovery', achievement: 'Interview 50 potential customers' },
          { id: '1.1.2', title: 'Solution Design', achievement: 'Design a low-fidelity prototype' },
          { id: '1.1.3', title: 'Landing Page', achievement: 'Launch a waitlist with 100 signups' },
          { id: '1.1.4', title: 'MVP Build', achievement: 'Build the core functional product' },
        ]
      },
      {
        name: 'Early Traction',
        levels: [
          { id: '1.2.1', title: 'First User', achievement: 'Get your first non-friend user' },
          { id: '1.2.2', title: 'Feedback Loop', achievement: 'Implement 3 major user requests' },
          { id: '1.2.3', title: 'Initial Sales', achievement: 'Close your first $100 in revenue' },
          { id: '1.2.4', title: 'Product-Market Fit', achievement: 'Reach 10 daily active users' },
        ]
      }
    ]
  },
  {
    name: 'Ramen Profitable',
    mrrTarget: 1000,
    phases: [
      {
        name: 'Growth & Optimization',
        levels: [
          { id: '2.1.1', title: 'Marketing Engine', achievement: 'Find one scalable acquisition channel' },
          { id: '2.1.2', title: 'Conversion Rate', achievement: 'Optimize landing page to 5%+ conversion' },
          { id: '2.1.3', title: 'Retention', achievement: 'Maintain 40%+ month-1 retention' },
          { id: '2.1.4', title: 'Pricing Strategy', achievement: 'Test and finalize pricing tiers' },
        ]
      },
      {
        name: 'Scaling Operations',
        levels: [
          { id: '2.2.1', title: 'First Hire', achievement: 'Hire your first contractor or employee' },
          { id: '2.2.2', title: 'Automation', achievement: 'Automate 50% of manual operations' },
          { id: '2.2.3', title: 'Brand Identity', achievement: 'Establish a professional brand presence' },
          { id: '2.2.4', title: 'Profitability', achievement: 'Cover all personal and business expenses' },
        ]
      }
    ]
  },
  {
    name: 'The Scale-Up',
    mrrTarget: 10000,
    phases: [
      {
        name: 'Market Leadership',
        levels: [
          { id: '3.1.1', title: 'Sales Team', achievement: 'Build a high-performing sales process' },
          { id: '3.1.2', title: 'Enterprise Deals', achievement: 'Close your first enterprise contract' },
          { id: '3.1.3', title: 'Strategic Partnerships', achievement: 'Sign 2 major industry partners' },
          { id: '3.1.4', title: 'Global Reach', achievement: 'Expand to your first international market' },
        ]
      },
      {
        name: 'Dominance',
        levels: [
          { id: '3.2.1', title: 'Series A Ready', achievement: 'Prepare metrics for institutional funding' },
          { id: '3.2.2', title: 'Ecosystem Build', achievement: 'Launch a developer API or marketplace' },
          { id: '3.2.3', title: 'Brand Authority', achievement: 'Become a top-3 player in your niche' },
          { id: '3.2.4', title: 'Exit Strategy', achievement: 'Define long-term liquidity options' },
        ]
      }
    ]
  }
];

export const BEAT_STAGES = [
  {
    name: 'Year 1: Foundation & Discovery',
    mrrTarget: 0,
    phases: [
      {
        name: 'Semester 1',
        levels: [
          { id: '1.1.1', title: 'Programming Basics', achievement: 'Python (AI/ML) & C/C++ basics' },
          { id: '1.1.2', title: 'Electronics 101', achievement: 'Arduino & basic sensors' },
          { id: '1.1.3', title: 'Math & Physics', achievement: 'Linear algebra & Mechanics' },
          { id: '1.1.4', title: 'Self-Discipline', achievement: 'Daily habits & journaling' },
        ]
      },
      {
        name: 'Semester 2',
        levels: [
          { id: '1.2.1', title: 'IoT Prototype', achievement: 'Build a small IoT sensor system' },
          { id: '1.2.2', title: 'Data Analysis', achievement: 'Python ML models & Kaggle' },
          { id: '1.2.3', title: 'Business Exposure', achievement: 'Read Lean Startup & Zero to One' },
          { id: '1.2.4', title: 'Micro-projects', achievement: 'Experiment with freelancing' },
        ]
      }
    ]
  },
  {
    name: 'Year 2: Deep Technical Mastery',
    mrrTarget: 1000,
    phases: [
      {
        name: 'Semester 3',
        levels: [
          { id: '2.1.1', title: 'Advanced AI/ML', achievement: 'Deep learning & computer vision' },
          { id: '2.1.2', title: 'Embedded Systems', achievement: 'RTOS & microcontrollers (STM32/Pi)' },
          { id: '2.1.3', title: 'IoT Pipelines', achievement: 'MQTT & cloud integration' },
          { id: '2.1.4', title: 'Full-Stack Dev', achievement: 'Python, JS, SQL apps' },
        ]
      },
      {
        name: 'Semester 4',
        levels: [
          { id: '2.2.1', title: 'Robotics Prototype', achievement: 'AI-powered robot/drone' },
          { id: '2.2.2', title: 'Smart IoT System', achievement: 'Predictive maintenance analytics' },
          { id: '2.2.3', title: 'SaaS MVP', achievement: 'Small SaaS or IoT service MVP' },
          { id: '2.2.4', title: 'Micro-Project', achievement: 'First product-market learning' },
        ]
      }
    ]
  },
  {
    name: 'Year 3: Product & Market Leadership',
    mrrTarget: 10000,
    phases: [
      {
        name: 'Semester 5',
        levels: [
          { id: '3.1.1', title: 'Edge AI', achievement: 'Deploy ML models on embedded devices' },
          { id: '3.1.2', title: 'Advanced Robotics', achievement: 'Path planning, PID, SLAM' },
          { id: '3.1.3', title: 'Hardware Design', achievement: 'PCB design & power management' },
          { id: '3.1.4', title: 'Leadership', achievement: 'Managing teams & mentoring' },
        ]
      },
      {
        name: 'Semester 6',
        levels: [
          { id: '3.2.1', title: 'Logistics Platform', achievement: 'Launch IoT platform with AI' },
          { id: '3.2.2', title: 'Autonomous Robot', achievement: 'Build delivery/warehouse robot' },
          { id: '3.2.3', title: 'Real-world Deployment', achievement: 'Deploy AI+IoT in real scenarios' },
          { id: '3.2.4', title: 'Core Company Launch', achievement: 'Scale operations & strategy' },
        ]
      }
    ]
  },
  {
    name: 'Year 4: Global Innovation & Future Tech',
    mrrTarget: 100000,
    phases: [
      {
        name: 'Semester 7',
        levels: [
          { id: '4.1.1', title: 'Swarm AI', achievement: 'Multi-agent AI & industrial robotics' },
          { id: '4.1.2', title: 'Quantum Foundations', achievement: 'Algorithms for AI acceleration' },
          { id: '4.1.3', title: 'Next-Gen Hardware', achievement: 'Nanotech & advanced energy' },
          { id: '4.1.4', title: 'Strategic Vision', achievement: 'Influence & global partnerships' },
        ]
      },
      {
        name: 'Semester 8',
        levels: [
          { id: '4.2.1', title: 'National Infrastructure', achievement: 'Scale digital logistics' },
          { id: '4.2.2', title: 'Transport Integration', achievement: 'Autonomous robotics for delivery' },
          { id: '4.2.3', title: 'Quantum Prototypes', achievement: 'Optimization algorithms' },
          { id: '4.2.4', title: 'Global Expansion', achievement: 'Strategic acquisitions & thought leadership' },
        ]
      }
    ]
  }
];

export const LIFECYCLE_STAGES = BEAT_STAGES; // Default for backward compatibility if needed, but we'll use a dynamic selector in App.tsx

export const DEFAULT_METRICS = [
  "Mentors Contacted",
  "Active Users",
  "Project Funding ($)",
  "Labs Completed",
  "Product Iterations"
];

export const HARD_TRUTHS = [
  "90% of projects fail. You are likely in that 90% unless you outwork everyone else.",
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
