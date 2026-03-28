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
  "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work. - Steve Jobs",
  "The best way to predict the future is to create it. - Peter Drucker",
  "Hardships often prepare ordinary people for an extraordinary destiny. - C.S. Lewis",
  "Do not wait to strike till the iron is hot, but make it hot by striking. - William Butler Yeats",
  "Don’t watch the clock; do what it does. Keep going. - Sam Levenson",
  "I never dreamed about success. I worked for it. - Estee Lauder",
  "Start where you are. Use what you have. Do what you can. - Arthur Ashe",
  "You don’t have to be great to start, but you have to start to be great. - Zig Ziglar",
  "Great things are not done by impulse, but by a series of small things brought together. - Vincent Van Gogh",
  "Fall seven times and stand up eight. - Japanese Proverb",
  "Discipline is the bridge between goals and accomplishment. - Jim Rohn",
  "Opportunities don’t happen. You create them. - Chris Grosser",
  "Do something today that your future self will thank you for. - Sean Patrick Flanery",
  "Success usually comes to those who are too busy to be looking for it. - Henry David Thoreau",
  "Don’t be pushed around by the fears in your mind. Be led by the dreams in your heart. - Roy T. Bennett",
  "The harder you work for something, the greater you’ll feel when you achieve it. - Unknown",
  "Don’t limit your challenges. Challenge your limits. - Unknown",
  "Everything you’ve ever wanted is on the other side of fear. - George Addair",
  "Greatness comes from embracing struggle, not avoiding it. - Unknown",
  "Your passion is waiting for your courage to catch up. - Isabelle Lafleche",
  "Motivation is what gets you started. Habit is what keeps you going. - Jim Ryun",
  "Do not go where the path may lead, go instead where there is no path and leave a trail. - Ralph Waldo Emerson",
  "The road to success is dotted with many tempting parking spaces. - Will Rogers",
  "It always seems impossible until it’s done. - Nelson Mandela",
  "Energy and persistence conquer all things. - Benjamin Franklin",
  "Small daily improvements over time lead to stunning results. - Robin Sharma",
  "Don’t stop when you’re tired. Stop when you’re done. - Unknown",
  "Success is walking from failure to failure with no loss of enthusiasm. - Winston Churchill",
  "Act as if what you do makes a difference. It does. - William James",
  "You miss 100% of the shots you don’t take. - Wayne Gretzky",
  "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
  "Don’t wait for opportunity. Create it. - George Bernard Shaw",
  "Doubt kills more dreams than failure ever will. - Suzy Kassem",
  "Success is the sum of small efforts, repeated day in and day out. - Robert Collier",
  "Push yourself, because no one else is going to do it for you. - Unknown",
  "Hustle in silence and let your success make the noise. - Frank Ocean",
  "Ambition is enthusiasm with a purpose. - Frank Tyger",
  "You don’t get what you wish for. You get what you work for. - Unknown",
  "The best revenge is massive success. - Frank Sinatra",
  "Do the hard jobs first. The easy jobs will take care of themselves. - Dale Carnegie",
  "Be so good they can’t ignore you. - Steve Martin",
  "Don’t fear failure. Fear being in the exact same place next year as you are today. - Unknown",
  "Start before you’re ready. - Steven Pressfield",
  "The key to success is to focus our conscious mind on things we desire not things we fear. - Brian Tracy",
  "Success doesn’t come from what you do occasionally, it comes from what you do consistently. - Marie Forleo"
];

export const STARTUP_STAGES = [
  {
    name: 'Stage 1: The Wilderness',
    mrrTarget: 2500,
    description: 'Survival, validation, first real traction. Most people quit here.',
    phases: [
      {
        name: 'Phase 1.1 — Problem Discovery (No Product Yet)',
        levels: [
          { id: '1.1.1', title: 'The Awareness', achievement: 'Clearly define ONE painful problem, write problem statement, define target user' },
          { id: '1.1.2', title: 'The Niche Lock', achievement: 'Pick a very specific audience (e.g., Small restaurant owners in Dar). Avoid broad markets.' },
          { id: '1.1.3', title: 'The First Conversations', achievement: 'Talk to 5 real people. Ask about pain, not your idea.' },
          { id: '1.1.4', title: 'The Pain Validation', achievement: 'Confirm people actually care. At least 3 say: "This is a real problem"' },
        ]
      },
      {
        name: 'Phase 1.2 — Solution Validation (Still No Full Product)',
        levels: [
          { id: '1.2.1', title: 'The Solution Draft', achievement: 'Define your solution in 1 page' },
          { id: '1.2.2', title: 'The Offer Test', achievement: 'Pitch solution WITHOUT building. "If I build this, would you pay?"' },
          { id: '1.2.3', title: 'The First YES', achievement: 'Get at least 1 serious interested user' },
          { id: '1.2.4', title: 'The Pre-Sell Attempt', achievement: 'Try to get someone to pay early. Even if they refuse → huge learning' },
        ]
      },
      {
        name: 'Phase 1.3 — MVP Creation',
        levels: [
          { id: '1.3.1', title: 'The MVP Scope', achievement: 'Define ONLY core feature' },
          { id: '1.3.2', title: 'The Build Sprint', achievement: 'Build MVP in 3–14 days' },
          { id: '1.3.3', title: 'The First Version Live', achievement: 'Product exists (even if ugly)' },
          { id: '1.3.4', title: 'The First Users', achievement: 'Get 3–5 users using it' },
        ]
      },
      {
        name: 'Phase 1.4 — Early Traction',
        levels: [
          { id: '1.4.1', title: 'The First Feedback Loop', achievement: 'Collect feedback from 5 users' },
          { id: '1.4.2', title: 'The First Improvement', achievement: 'Fix biggest complaint' },
          { id: '1.4.3', title: 'The First Paying Customer 💰', achievement: '1 real payment' },
          { id: '1.4.4', title: 'The Repeat Value', achievement: 'User keeps using product' },
        ]
      },
      {
        name: 'Phase 1.5 — From $1 → $1000 MRR',
        levels: [
          { id: '1.5.1', title: 'The Sales Habit', achievement: 'Contact 5–10 prospects daily' },
          { id: '1.5.2', title: 'The Conversion Understanding', achievement: 'Know why people buy or don’t' },
          { id: '1.5.3', title: 'The 5 Customers Milestone', achievement: '5 paying users' },
          { id: '1.5.4', title: 'The 500 MRR Milestone', achievement: 'Reach $500 MRR' },
          { id: '1.5.5', title: 'The Offer Refinement', achievement: 'Improve pricing or positioning' },
          { id: '1.5.6', title: 'The 1,000 MRR Milestone', achievement: 'Reach $1,000 MRR' },
        ]
      },
      {
        name: 'Phase 1.6 — Toward $2,500 MRR',
        levels: [
          { id: '1.6.1', title: 'The Traction Habit', achievement: 'Consistent daily growth activities' },
          { id: '1.6.2', title: 'The 2,500 MRR Milestone', achievement: 'Reach $2,500 MRR and exit The Wilderness' },
        ]
      }
    ]
  },
  {
    name: 'Stage 2: Ramen Profitable',
    mrrTarget: 10000,
    description: 'Stability + optimization + discipline.',
    phases: [
      {
        name: 'Phase 2.1 — Stabilization',
        levels: [
          { id: '2.1.1', title: 'The Survival Covered', achievement: 'Revenue covers basic costs' },
          { id: '2.1.2', title: 'The Process Documentation', achievement: 'Write down how sales work' },
          { id: '2.1.3', title: 'The KPI Awareness', achievement: 'Track conversion, churn, CAC' },
        ]
      },
      {
        name: 'Phase 2.2 — Growth Engine',
        levels: [
          { id: '2.2.1', title: 'The Channel Focus', achievement: 'Double down on 1 channel' },
          { id: '2.2.2', title: 'The Funnel Optimization', achievement: 'Improve conversion rate' },
          { id: '2.2.3', title: 'The 5,000 MRR Milestone', achievement: 'Reach $5,000 MRR' },
        ]
      },
      {
        name: 'Phase 2.3 — Systemization',
        levels: [
          { id: '2.3.1', title: 'The Automation Start', achievement: 'Automate repetitive tasks' },
          { id: '2.3.2', title: 'The First Hire / Partner', achievement: 'Offload one responsibility' },
          { id: '2.3.3', title: 'The Product Stability', achievement: 'Fewer bugs, consistent usage' },
        ]
      },
      {
        name: 'Phase 2.4 — Toward $10,000 MRR',
        levels: [
          { id: '2.4.1', title: 'The 10,000 MRR Milestone', achievement: 'Reach $10,000 MRR and become Ramen Profitable' },
        ]
      }
    ]
  },
  {
    name: 'Stage 3: Scale-Up',
    mrrTarget: 100000,
    description: 'Systems, leverage, leadership.',
    phases: [
      {
        name: 'Phase 3.1 — Growth Acceleration',
        levels: [
          { id: '3.1.1', title: 'The Scalable Channel', achievement: 'One channel brings consistent customers' },
          { id: '3.1.2', title: 'The Data-Driven Decisions', achievement: 'Use analytics for decisions' },
          { id: '3.1.3', title: 'The 20K MRR Milestone', achievement: 'Reach $20,000 MRR' },
        ]
      },
      {
        name: 'Phase 3.2 — Team & Systems',
        levels: [
          { id: '3.2.1', title: 'The Core Team Build', achievement: '2–5 key people' },
          { id: '3.2.2', title: 'The SOP Creation', achievement: 'Document all processes' },
          { id: '3.2.3', title: 'The Delegation Shift', achievement: 'You stop doing everything' },
        ]
      },
      {
        name: 'Phase 3.3 — Expansion',
        levels: [
          { id: '3.3.1', title: 'The New Market Entry', achievement: 'Expand audience or region' },
          { id: '3.3.2', title: 'The Product Line Expansion', achievement: 'Launch complementary products' },
          { id: '3.3.3', title: 'The 50K MRR Milestone', achievement: 'Reach $50,000 MRR' },
        ]
      },
      {
        name: 'Phase 3.4 — Toward $100K',
        levels: [
          { id: '3.4.1', title: 'The Machine', achievement: 'Business runs with systems' },
          { id: '3.4.2', title: 'The Competitive Moat', achievement: 'Hard to copy advantage' },
          { id: '3.4.3', title: 'The 75K MRR Milestone', achievement: 'Reach $75,000 MRR' },
          { id: '3.4.4', title: 'The 100K MRR Milestone 🎯', achievement: 'Reach $100,000 MRR. SCALE-UP COMPLETE' },
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
  "If it was easy, everyone would be a billionaire. It's supposed to be hard.",
  "Your competitors don’t care about your struggles. They are focused on winning.",
  "You will be rejected more times than you can count. Every 'no' is a lesson, not a failure.",
  "Vision without discipline is hallucination. Ideas are cheap, habits are priceless.",
  "You are not special. Talent without effort is irrelevant.",
  "Most partnerships fail. Trust cautiously and verify everything.",
  "Being busy is not the same as being productive. Focus is your only leverage.",
  "You will make decisions you regret. Own them, learn, and move faster next time.",
  "Mentors can guide you, but they can’t do the work for you.",
  "Luck exists, but it favors the prepared and ruthless.",
  "Passion is not enough. Skill, strategy, and stamina win every time.",
  "You will face impostor syndrome. Act anyway. Results quiet fear, not thoughts.",
  "Your first product will probably suck. Ship anyway, iterate fast.",
  "You will be misunderstood, criticized, and doubted. It’s the price of trying to create something meaningful.",
  "Time is your most limited resource. Protect it ruthlessly.",
  "Excuses are poison. If you want results, blame no one and start doing.",
  "Comfort kills ambition. Growth lives in discomfort.",
  "Most advice is irrelevant or outdated. Test everything yourself.",
  "You will fail in public. It hurts more than in private, but it teaches more.",
  "No one will validate your self-worth based on your startup. You validate it by shipping.",
  "Fear never goes away. Courage is acting despite it.",
  "You are not owed success. Every day you get is permission to prove yourself.",
  "Revenue is king. Without money, your dream is just fantasy.",
  "Your team will disappoint you. Learn to lead and compensate for weak links.",
  "You will be tempted to give up. That’s when the fight matters most.",
  "Your ego is your biggest enemy. Humility allows you to see reality.",
  "You will make enemies. It’s part of becoming relevant.",
  "There is no instant gratification in building something real. Pain is part of growth.",
  "Scaling too early will kill your company faster than competition.",
  "Customers rarely tell you the truth. Observe behavior, not opinions.",
  "You will work harder than anyone else thinks is necessary.",
  "The best ideas are obvious after someone else does them. Execution wins over originality.",
  "You will sleep less, eat worse, and sacrifice more than your peers.",
  "Expect to spend years grinding before anyone notices.",
  "No one will hire you for your vision. They hire you for results.",
  "You will feel alone at the top. That’s the price of leadership.",
  "Reputation is fragile. Protect it relentlessly.",
  "You will have moments where quitting looks smarter than continuing. It’s not.",
  "Technology will fail. Backups, redundancy, and preparation are your safety nets.",
  "Your competitors will copy faster than you innovate. Keep moving.",
  "Not all advice is good advice. Filter ruthlessly.",
  "You will make the same mistake multiple times before learning it.",
  "Your comfort zone is a trap. Step outside daily.",
  "You will be misunderstood by your market. Solve real problems, not perceived ones.",
  "Debt is a tool. Mismanaged, it’s a noose.",
  "The system is biased against beginners. Your work ethic is your weapon.",
  "You will be forced to fire people you like. Emotions are luxury you can’t afford.",
  "Scaling too slowly will leave you irrelevant. Scaling too fast will leave you bankrupt.",
  "Innovation isn’t optional—it’s survival.",
  "Your network is your leverage. Build it deliberately, not casually.",
  "No one will remember your effort. They only remember results.",
  "You are replaceable, but your mindset is unique.",
  "You will face crises you can’t anticipate. Adapt or die.",
  "Every day is a chance to fail spectacularly or advance subtly. Choose consciously.",
  "Most people quit mentally long before physically. Mental endurance is decisive.",
  "You will lose money. Accept it as tuition for learning.",
  "Your ego will blind you to mistakes. Check it daily.",
  "You will work with idiots. Learn to leverage or avoid them.",
  "Your health is a silent asset. Neglect it, and everything else fails.",
  "You will encounter ethical dilemmas. Decide early what lines you won’t cross.",
  "No one owes you loyalty. Earn it or lose it.",
  "You will have sleepless nights over decisions that seem small in hindsight.",
  "Your brand will take years to build, seconds to destroy.",
  "Your first investor will likely be your worst. Learn to negotiate.",
  "You will meet opportunists disguised as friends. Trust actions, not words.",
  "Markets are cyclical. Prepare for downturns as aggressively as for growth.",
  "You will face criticism from people who know nothing about your work.",
  "You will be bored with small wins. Focus on the compound effect of persistence.",
  "You can’t do it alone, but you must be willing to start alone.",
  "Every shortcut you take will cost more in the long run.",
  "Your competitors will sleep less and work harder. You must do more.",
  "You will outgrow some people in your life. Accept it without guilt.",
  "Most businesses fail from slow death, not sudden disaster.",
  "Your comfort will be stolen by ambition if you let it.",
  "You will misread signals. Fast correction is more important than avoiding mistakes.",
  "Your passion will be tested by rejection, scarcity, and bureaucracy.",
  "You will lose clients, customers, and allies. The smart recover faster.",
  "Your confidence will be tested by early failure. True belief is forged in fire.",
  "You will need to pivot repeatedly. Flexibility beats stubbornness.",
  "You will run out of resources before running out of ideas. Money matters.",
  "Your failures will be public, your wins private. Embrace the irony.",
  "You will sacrifice friendships for progress. Some relationships aren’t built for the grind.",
  "You will underestimate how hard it is to scale operations.",
  "Your vision will be mocked before it’s respected.",
  "You will have to be both a jack-of-all-trades and a master at some.",
  "Your decisions create consequences that you alone will bear.",
  "You will be tempted to quit when your competitors seem lucky. Luck is preparation showing up.",
  "You will have to say 'no' more than 'yes'. Discipline is your superpower.",
  "Your mind will be your biggest battlefield. Control it or be controlled.",
  "You will fail the people who trusted you. Accept responsibility and move forward.",
  "Your first success will be a trap if it makes you complacent.",
  "You will live in ambiguity. Clarity is rare; decision-making is constant.",
  "Your comfort will betray your ambition. Discomfort breeds results.",
  "You will feel exhausted, discouraged, and doubted. Keep going anyway.",
  "Your ambition will make enemies of mediocrity and comfort.",
  "Your growth will be lonely but necessary.",
  "You will never be fully ready. Start now, or forever wait.",
  "Your legacy is written in actions, not intentions.",
  "You will be forced to do things you hate. Mastering them is your edge.",
  "Your work ethic will be tested when visibility is zero. Persist anyway.",
  "You will fail to meet expectations—yours and others’. Learn from it.",
  "Your story will be misunderstood. Results speak louder than explanations.",
  "You will be challenged to outthink, outlast, and outwork everyone around you.",
  "You will live with constant pressure. Learn to thrive under it.",
  "Your only guarantee is that if you quit, nothing happens.",
  "Your potential is meaningless without relentless execution.",
  "You will be forced to adapt to survive. Resistance is optional failure.",
  "Your sacrifices are invisible to most. They are your currency.",
  "You will be tempted by shortcuts that destroy your foundation.",
  "You will face moral and ethical tests. Decide now who you are.",
  "Your impact is measured in what you ship, not what you dream.",
  "Your comfort is the enemy of excellence.",
  "You will be doubted even when correct. Prove it with results.",
  "Your grind will be lonely, but it’s the only path to mastery.",
  "You will realize most things you fear are imaginary. Action dissolves fear.",
  "Your resilience is more valuable than talent. Build it daily."
];
