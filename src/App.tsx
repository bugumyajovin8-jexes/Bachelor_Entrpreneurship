import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { BackupManager } from './components/BackupManager';
import { RailwayMap } from './components/RailwayMap';
import { 
  LayoutDashboard, 
  CheckSquare, 
  BarChart3, 
  BookOpen, 
  Library, 
  GraduationCap, 
  Settings, 
  Plus, 
  Calendar, 
  ChevronRight, 
  Search, 
  Filter, 
  TrendingUp, 
  Package,
  Award, 
  Clock,
  Moon,
  Sun,
  MoreVertical,
  Trash2,
  Edit3,
  ExternalLink,
  Quote,
  AlertTriangle,
  Zap,
  Target,
  Trophy,
  ShieldAlert,
  Flame,
  BrainCircuit,
  Lock,
  Unlock,
  BellRing,
  FileText,
  Eye,
  AlertCircle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { format, startOfWeek, endOfWeek, isSameDay, addDays, subDays, parseISO, differenceInDays } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { storage } from './services/storage';
import { Task, Metric, JournalEntry, Resource, UserProgress, TaskCategory, MarketShock } from './types';
import { MOTIVATIONAL_QUOTES, STARTUP_STAGES, BEAT_STAGES, INITIAL_PROGRESS, HARD_TRUTHS, DEFAULT_METRICS } from './constants';

// --- Components ---

const Card = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-100 dark:border-zinc-800", className)} {...props}>
    {children}
  </div>
);

const ProgressBar = ({ progress, label, subLabel }: { progress: number; label: string; subLabel?: string }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-end">
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
      <span className="text-xs text-zinc-500">{Math.round(progress)}%</span>
    </div>
    <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        className="h-full bg-indigo-600 rounded-full"
      />
    </div>
    {subLabel && <p className="text-[10px] text-zinc-400 uppercase tracking-wider">{subLabel}</p>}
  </div>
);

const Sidebar = ({ activeTab, setActiveTab, roadmapMode, onToggleRoadmapMode }: { activeTab: string; setActiveTab: (tab: any) => void; roadmapMode: 'Startup' | 'BEAT'; onToggleRoadmapMode: () => void }) => (
  <aside className="hidden md:flex flex-col w-72 bg-white dark:bg-zinc-950 border-r border-zinc-100 dark:border-zinc-900 h-screen sticky top-0 z-40 overflow-y-auto no-scrollbar">
    <div className="p-8">
      <div className="flex items-center gap-3 mb-12">
        <div className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none">
          {roadmapMode === 'BEAT' ? <GraduationCap size={28} /> : <Target size={28} />}
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="font-black text-sm tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
            {roadmapMode === 'BEAT' ? 'Crucible Institute of Entrepreneurship and Innovation' : 'Crucible Accelerator'}
          </h1>
          <div className="flex items-center gap-1 opacity-70">
            <span className="font-black text-[10px] tracking-widest dark:text-white uppercase">{roadmapMode === 'BEAT' ? 'B.E.A.T' : 'STARTUP'}</span>
            <span className="font-black text-[10px] tracking-widest text-indigo-600 uppercase">{roadmapMode === 'BEAT' ? 'College' : 'FOUNDER'}</span>
          </div>
          <p className="text-[10px] font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider mt-1 leading-snug border-l-2 border-indigo-500 pl-2">
            {roadmapMode === 'BEAT' ? 'Bachelor in Entrepreneurship & Applied Technology' : 'Mastering the Art of the Lean Startup'}
          </p>
        </div>
      </div>
      
      <div className="space-y-8">
        <div>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 ml-4">{roadmapMode === 'BEAT' ? 'Main Campus' : 'Headquarters'}</p>
          <nav className="space-y-1">
            <SidebarItem icon={LayoutDashboard} label={roadmapMode === 'BEAT' ? 'Campus Center' : 'Command Center'} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <SidebarItem icon={CheckSquare} label={roadmapMode === 'BEAT' ? 'Curriculum' : 'Mission Control'} active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} />
            <SidebarItem icon={BarChart3} label={roadmapMode === 'BEAT' ? 'Performance' : 'Growth Metrics'} active={activeTab === 'metrics'} onClick={() => setActiveTab('metrics')} />
          </nav>
        </div>

        <div>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 ml-4">Resources</p>
          <nav className="space-y-1">
            <SidebarItem icon={BookOpen} label="Journal" active={activeTab === 'journal'} onClick={() => setActiveTab('journal')} />
            <SidebarItem icon={Library} label="Library" active={activeTab === 'resources'} onClick={() => setActiveTab('resources')} />
            <SidebarItem icon={GraduationCap} label={roadmapMode === 'BEAT' ? 'Degree Progress' : 'Startup Roadmap'} active={activeTab === 'progress'} onClick={() => setActiveTab('progress')} />
            <SidebarItem icon={ShieldAlert} label="War Room" active={activeTab === 'warroom'} onClick={() => setActiveTab('warroom')} />
          </nav>
        </div>
        <div>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 ml-4">System</p>
          <div className="space-y-2">
            <BackupManager />
            <button 
              onClick={onToggleRoadmapMode}
              className="flex items-center gap-3 w-full px-5 py-3.5 rounded-2xl text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200 transition-all duration-300"
            >
              <Zap size={20} />
              <span className="text-sm font-bold tracking-tight">Switch to {roadmapMode === 'BEAT' ? 'Startup' : 'B.E.A.T'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div className="mt-auto p-8">
      <div className="p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black dark:text-white truncate tracking-tight">{roadmapMode === 'BEAT' ? 'B.E.A.T Scholar' : 'Startup Founder'}</p>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{roadmapMode === 'BEAT' ? 'Year 1 Student' : 'Early Stage'}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 w-2/3 rounded-full" />
          </div>
          <p className="text-[9px] text-zinc-400 font-bold text-right uppercase tracking-widest">{roadmapMode === 'BEAT' ? '65% to Sophomore' : '65% to Ramen Profitable'}</p>
        </div>
      </div>
    </div>
  </aside>
);

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any; label: string; active: boolean; onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 w-full px-5 py-3.5 rounded-2xl transition-all duration-300 group relative",
      active 
        ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none" 
        : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200"
    )}
  >
    <Icon size={20} className={cn("transition-transform duration-300", active ? "scale-110" : "group-hover:scale-110")} />
    <span className="text-sm font-bold tracking-tight">{label}</span>
    {active && (
      <motion.div 
        layoutId="sidebar-active-indicator" 
        className="absolute left-0 w-1 h-6 bg-white rounded-r-full" 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
    )}
  </button>
);

const NavItem = ({ icon: Icon, label, active, onClick }: { icon: any; label: string; active: boolean; onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors",
      active ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
    )}
  >
    <Icon size={20} />
    <span className="text-[10px] font-medium uppercase tracking-tighter">{label}</span>
  </button>
);

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks' | 'metrics' | 'journal' | 'resources' | 'progress' | 'warroom'>('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [viewingPdf, setViewingPdf] = useState<Resource | null>(null);
  const [marketShocks, setMarketShocks] = useState<MarketShock[]>([]);
  const [showMarketShockModal, setShowMarketShockModal] = useState(false);
  const [activeMarketShock, setActiveMarketShock] = useState<MarketShock | null>(null);
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = storage.getProgress();
    return { ...INITIAL_PROGRESS, ...saved };
  });
  const [theme, setTheme] = useState<'light' | 'dark'>(storage.getTheme());
  const [quote, setQuote] = useState("");
  const [mentorMessage, setMentorMessage] = useState<string>("Welcome back, Scholar. The Dean is watching. Let's get to work.");
  const [isGeneratingMentor, setIsGeneratingMentor] = useState(false);
  const [showPopQuiz, setShowPopQuiz] = useState(false);
  const [activePopQuiz, setActivePopQuiz] = useState<{ title: string; challenge: string; reward: number } | null>(null);

  // Modals
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMetricModal, setShowMetricModal] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showTractionAuditModal, setShowTractionAuditModal] = useState(false);
  const [showRailwayMap, setShowRailwayMap] = useState(false);

  const activeStages = useMemo(() => {
    return progress.roadmapMode === 'BEAT' ? BEAT_STAGES : STARTUP_STAGES;
  }, [progress.roadmapMode]);
  const [isTriggeringMarketShock, setIsTriggeringMarketShock] = useState(false);

  useEffect(() => {
    setTasks(storage.getTasks());
    setMetrics(storage.getMetrics());
    setJournal(storage.getJournal());
    setResources(storage.getResources());
    setMarketShocks(storage.getMarketShocks());
    setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Generate mentor message on load
    const savedProgress = storage.getProgress();
    const currentProgress = { ...INITIAL_PROGRESS, ...savedProgress };
    const currentTasks = storage.getTasks();
    generateMentorMessage(currentProgress, currentTasks);

    // Random Pop Quiz chance (10%)
    if (Math.random() < 0.1) {
      triggerPopQuiz();
    }

    // Random Market Shock chance (5%)
    if (Math.random() < 0.05) {
      triggerMarketShock();
    }

    // Pressure Check
    if (progress.pressure >= 100) {
      setMentorMessage("CRITICAL: You are at 100% Pressure. Burnout is imminent. Clear your backlog or face the consequences.");
    }
  }, [theme]);

  const generateMentorMessage = async (currentProgress: UserProgress, currentTasks: Task[]) => {
    setIsGeneratingMentor(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const model = "gemini-3-flash-preview";
      const todayTasks = currentTasks.filter(t => isSameDay(parseISO(t.dueDate), new Date()));
      const completedToday = todayTasks.filter(t => t.status === 'Completed').length;
      
      const rgaTasks = currentTasks.filter(t => t.leverage === 'RGA').length;
      const supportTasks = currentTasks.filter(t => t.leverage === 'Support').length;

      const prompt = `You are the 'Dean of the Entrepreneurship and Innovation Program', an outcome-obsessed, ruthless, and highly experienced academic and project mentor at "The Crucible Institute of Entrepreneurship and Innovation".
      The user is a student in the "${currentProgress.status}" stage. 
      Current Stats: 
      - Streak: ${currentProgress.streak}
      - Project Funding: $${currentProgress.mrr}
      - Expenses: $${currentProgress.burnRate}
      - Financial Runway: ${currentProgress.runwayDays} days
      - Academic & Project Value: $${currentProgress.companyValuation}
      - Status: ${currentProgress.status}
      - Labs Today: ${completedToday}/${todayTasks.length}
      - Academic Pressure: ${progress.pressure}%
      - RGA Tasks (Result Generating): ${rgaTasks}
      - Support Tasks (Non-Result): ${supportTasks}
      
      Rules for your response:
      1. Keep it under 3 sentences. Be punchy, brutal, and direct.
      2. If Support Tasks significantly outnumber RGA tasks, aggressively call them out for "playing house" and avoiding the real work of selling and building.
      3. If Runway is under 30 days, panic them.
      4. If Project Funding > Expenses, give a brief nod of respect but tell them to scale.
      5. If Pressure is > 70%, tell them burnout is a choice and they need to clear their desk.`;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });
      setMentorMessage(response.text || "The Dean is watching. Stay focused.");
    } catch (error) {
      console.error("Failed to generate mentor message:", error);
    } finally {
      setIsGeneratingMentor(false);
    }
  };

  const triggerPopQuiz = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const model = "gemini-3-flash-preview";
      const prompt = `Generate a quick "Pop Quiz" challenge for a B.E.A.T student.
      Current Stage: ${activeStages[progress.currentStageIndex]?.name || 'Graduated'}
      Skill Levels: ${JSON.stringify(progress.skillLevels)}
      Active Tasks: ${JSON.stringify(tasks.filter(t => t.status === 'Pending').map(t => t.title))}
      
      The challenge should be a small, actionable task they can do right now to improve their project.
      Respond in JSON format:
      {
        "title": "string (catchy title)",
        "challenge": "string (the task description)",
        "reward": number (between 20 and 100 points)
      }`;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const quiz = JSON.parse(response.text);
      setActivePopQuiz(quiz);
      setShowPopQuiz(true);
    } catch (error) {
      console.error("Failed to trigger dynamic pop quiz:", error);
      // Fallback
      const quizzes = [
        { title: "Market Shock", challenge: "A competitor just launched a similar product. Spend 30 mins analyzing their pricing.", reward: 50 },
        { title: "Server Crash", challenge: "Your landing page is down. Verify all links and forms are working perfectly.", reward: 30 },
      ];
      const quiz = quizzes[Math.floor(Math.random() * quizzes.length)];
      setActivePopQuiz(quiz);
      setShowPopQuiz(true);
    }
  };

  const triggerMarketShock = async () => {
    setIsTriggeringMarketShock(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const model = "gemini-3-flash-preview";
      const currentStageName = activeStages[progress.currentStageIndex]?.name || 'Graduated';
      const prompt = `Generate a "Market Shock" for a B.E.A.T student.
      Current Stage: ${currentStageName}
      
      The shock MUST be specific to their current lifecycle stage.
      Examples:
      - "The Wilderness": Zero Interest (no one cares about the project), Team conflict, Running out of personal savings.
      - "Ramen Profitable": Churn Spike, Server Meltdown from unexpected traffic, Key early employee quits.
      - "The Scale-Up": Major sponsor pulls out, Legal threat, Expenses spiral out of control.
      
      The shock should force the student to defend a pivot or major strategic decision to the Dean.
      Respond in JSON format:
      {
        "title": "string (urgent title)",
        "description": "string (detailed description of the market shock and why it demands a pivot)",
        "severity": "Moderate" | "High" | "Critical"
      }`;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const randomShock = JSON.parse(response.text);
      const newShock: MarketShock = {
        ...randomShock,
        id: Date.now().toString(),
        dateTriggered: new Date().toISOString(),
        resolved: false
      };
      
      const updatedShocks = [newShock, ...marketShocks];
      setMarketShocks(updatedShocks);
      storage.setMarketShocks(updatedShocks);
      setActiveMarketShock(newShock);
      setShowMarketShockModal(true);
    } catch (error) {
      console.error("Failed to trigger dynamic market shock:", error);
      // Fallback
      const shockPool: Omit<MarketShock, 'id' | 'dateTriggered' | 'resolved'>[] = [
        { title: "Zero Interest", description: "Your launch got 0 signups. The market doesn't care. You need to pivot.", severity: 'Critical' },
        { title: "Competitor Raised $50M", description: "A clone of your product just raised a massive Series A. How do you respond?", severity: 'High' },
      ];
      const randomShock = shockPool[Math.floor(Math.random() * shockPool.length)];
      const newShock: MarketShock = {
        ...randomShock,
        id: Date.now().toString(),
        dateTriggered: new Date().toISOString(),
        resolved: false
      };
      setMarketShocks([newShock, ...marketShocks]);
      setActiveMarketShock(newShock);
      setShowMarketShockModal(true);
    } finally {
      setIsTriggeringMarketShock(false);
    }
  };

  const [isResolvingMarketShock, setIsResolvingMarketShock] = useState(false);

  const resolveMarketShock = async (id: string, plan: string) => {
    setIsResolvingMarketShock(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const model = "gemini-3-flash-preview";
      const shock = marketShocks.find(s => s.id === id);
      if (!shock) return;

      const prompt = `Evaluate a student's pivot/response to a Market Shock, acting as the "Dean of the Entrepreneurship and Innovation Program".
      Market Shock Title: ${shock.title}
      Shock Description: ${shock.description}
      Student's Pivot/Response: "${plan}"
      
      Criteria:
      1. Is the pivot decisive and actionable?
      2. Does it address the root cause of the market shock?
      3. Is it realistic for a student project?
      
      Respond in JSON format:
      {
        "score": number (0 to 100),
        "feedback": "string (brutal but fair feedback from the Dean)",
        "resilienceGain": number (0 to 20)
      }`;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const evaluation = JSON.parse(response.text);
      
      const updatedShocks = marketShocks.map(s => 
        s.id === id ? { ...s, resolved: true, responsePlan: plan } : s
      );
      setMarketShocks(updatedShocks);
      storage.setMarketShocks(updatedShocks);
      
      // Reward based on AI evaluation
      updateProgress({
        ...progress,
        companyValuation: progress.companyValuation + evaluation.score * 100,
        resilienceScore: (progress.resilienceScore || 0) + evaluation.resilienceGain
      });
      
      setMentorMessage(`DEAN'S EVALUATION: ${evaluation.feedback}`);
      setShowMarketShockModal(false);
      setActiveMarketShock(null);
    } catch (error) {
      console.error("Failed to evaluate market shock response:", error);
      // Fallback
      const updatedShocks = marketShocks.map(s => 
        s.id === id ? { ...s, resolved: true, responsePlan: plan } : s
      );
      setMarketShocks(updatedShocks);
      storage.setMarketShocks(updatedShocks);
      updateProgress({
        ...progress,
        companyValuation: progress.companyValuation + 5000,
        resilienceScore: (progress.resilienceScore || 0) + 5
      });
      setShowMarketShockModal(false);
      setActiveMarketShock(null);
    } finally {
      setIsResolvingMarketShock(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    storage.setTheme(newTheme);
  };

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    storage.setTasks(newTasks);
  };

  const saveMetrics = (newMetrics: Metric[]) => {
    setMetrics(newMetrics);
    storage.setMetrics(newMetrics);
  };

  const saveJournal = (newEntries: JournalEntry[]) => {
    setJournal(newEntries);
    storage.setJournal(newEntries);
  };

  const saveResources = (newResources: Resource[]) => {
    setResources(newResources);
    storage.setResources(newResources);
  };

  const updateProgress = (newProgress: UserProgress) => {
    // Recalculate runwayDays based on current mrr and savings
    const netMonthlyBurn = Math.max(0, newProgress.burnRate - newProgress.mrr);
    const dailyBurn = netMonthlyBurn / 30;
    const runwayDays = dailyBurn > 0 ? Math.floor(newProgress.savings / dailyBurn) : 9999;
    
    const finalProgress = {
      ...newProgress,
      runwayDays,
      // If runway hits 0 and we are not profitable, we are expelled
      status: (runwayDays <= 0 && newProgress.mrr < newProgress.burnRate && newProgress.status !== 'Graduated') ? 'Expelled' : newProgress.status
    };

    setProgress(finalProgress);
    storage.setProgress(finalProgress);
  };

  const handleRollCall = () => {
    const now = new Date();
    const lastCheckIn = progress.lastCheckIn ? parseISO(progress.lastCheckIn) : null;
    
    let newStreak = progress.streak;
    let daysPassed = 0;

    if (lastCheckIn) {
      daysPassed = Math.max(0, differenceInDays(now, lastCheckIn));
    }

    if (!lastCheckIn || !isSameDay(lastCheckIn, subDays(now, 1))) {
      // If missed a day, reset streak (unless it's the first time)
      if (lastCheckIn && !isSameDay(lastCheckIn, now)) {
        newStreak = 1;
      } else if (!lastCheckIn) {
        newStreak = 1;
      }
    } else if (isSameDay(lastCheckIn, subDays(now, 1))) {
      newStreak = progress.streak + 1;
    }

    // Net Burn = BurnRate - MRR
    const netMonthlyBurn = Math.max(0, progress.burnRate - progress.mrr);
    const dailyBurn = netMonthlyBurn / 30;
    
    // Update savings based on days passed
    const newSavings = Math.max(0, progress.savings - (dailyBurn * daysPassed));

    const newProgress: UserProgress = {
      ...progress,
      streak: newStreak,
      lastCheckIn: now.toISOString(),
      savings: newSavings
    };
    updateProgress(newProgress);
  };

  const lockWeek = () => {
    updateProgress({ ...progress, isWeekLocked: true });
  };

  const unlockWeek = () => {
    updateProgress({ ...progress, isWeekLocked: false });
  };

  const completeTask = (id: string) => {
    const updatedTasks = tasks.map(t => {
      if (t.id === id && t.status !== 'Completed') {
        const isRGA = t.leverage === 'RGA';
        const pointsEarned = isRGA ? Math.round(t.points * progress.difficultyMultiplier * 100) : 0;
        
        // Skill Leveling
        const newSkillLevels = { ...progress.skillLevels };
        const category = t.category as keyof typeof newSkillLevels;
        if (category in newSkillLevels) {
          newSkillLevels[category] = Number((newSkillLevels[category] + 0.1).toFixed(1));
        }

        // Pressure reduction: Support tasks reduce it more
        const pressureReduction = isRGA ? 10 : 30;

        const newProgress = { 
          ...progress, 
          progressPercentage: Math.min(100, progress.progressPercentage + 1),
          skillLevels: newSkillLevels,
          pressure: Math.max(0, progress.pressure - pressureReduction)
        };
        updateProgress(newProgress);
        return { ...t, status: 'Completed' as const };
      }
      return t;
    });
    saveTasks(updatedTasks);
  };

  const handleMicroTaskToggle = (taskId: string, microId: string) => {
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId && t.microTasks) {
        const updatedMicro = t.microTasks.map(m => {
          if (m.id === microId) {
            const newCompleted = !m.completed;
            if (newCompleted) {
              updateProgress({
                ...progress,
                progressPercentage: Math.min(100, progress.progressPercentage + 0.5),
                pressure: Math.max(0, progress.pressure - 1)
              });
            } else {
              updateProgress({
                ...progress,
                progressPercentage: Math.max(0, progress.progressPercentage - 0.5),
                pressure: Math.min(100, progress.pressure + 1)
              });
            }
            return { ...m, completed: newCompleted };
          }
          return m;
        });
        return { ...t, microTasks: updatedMicro };
      }
      return t;
    });
    saveTasks(updatedTasks);
  };

  const toggleFocusMode = () => {
    updateProgress({ ...progress, isFocusModeActive: !progress.isFocusModeActive });
  };

  // --- Views ---

  const getCurrentLevel = () => {
    const stage = activeStages[progress.currentStageIndex];
    const phase = stage.phases.find(p => p.levels.some(l => !progress.completedLevels.includes(l.id)));
    const level = phase?.levels.find(l => !progress.completedLevels.includes(l.id));
    return { stage: stage.name, phase: phase?.name || 'Completed', level: level?.title || 'Completed' };
  };

  const currentLevel = getCurrentLevel();

  const DashboardView = () => {
    const todayTasks = tasks.filter(t => isSameDay(parseISO(t.dueDate), new Date()));
    const completedToday = todayTasks.filter(t => t.status === 'Completed').length;
    const completionRate = todayTasks.length > 0 ? (completedToday / todayTasks.length) * 100 : 0;
    const hasCheckedInToday = progress.lastCheckIn && isSameDay(parseISO(progress.lastCheckIn), new Date());

    return (
      <div className="space-y-8 pb-20">
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white md:text-4xl">Entrepreneurship and Innovation Student Dashboard</h1>
              <button 
                onClick={() => setShowRailwayMap(true)}
                className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm font-bold mt-1 hover:underline"
              >
                {currentLevel.stage} • {currentLevel.phase} • {currentLevel.level}
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={toggleFocusMode}
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-300 shadow-sm font-bold text-sm",
                progress.isFocusModeActive 
                  ? "bg-red-600 text-white animate-pulse shadow-red-200" 
                  : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50"
              )}
              title="Focus Mode"
            >
              {progress.isFocusModeActive ? <Lock size={18} /> : <Unlock size={18} />}
              <span className="hidden md:inline">{progress.isFocusModeActive ? 'Focus Active' : 'Focus Mode'}</span>
            </button>
            <button onClick={toggleTheme} className="p-3 rounded-2xl bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:bg-zinc-50">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-zinc-900 text-white border-none p-6 rounded-[2rem] shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-600/20 blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                    <TrendingUp size={24} className="text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 text-indigo-300">Project Funding</p>
                    <div className="flex items-center gap-4">
                      <h4 className="text-3xl font-black tracking-tighter">{progress.mrr.toLocaleString()} TZS</h4>
                      <div className="text-[9px] font-black bg-white/10 px-2 py-1 rounded-lg uppercase tracking-widest">FUNDING</div>
                    </div>
                  </div>
                </div>
              </Card>
              <Card className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] shadow-lg border-none relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-red-500" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Financial Runway</p>
                  </div>
                  <span className="text-xs font-black text-zinc-900 dark:text-white">{progress.runwayDays} Days</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (progress.runwayDays / 365) * 100)}%` }}
                    className={cn(
                      "h-full rounded-full",
                      progress.runwayDays < 30 ? "bg-red-600" : progress.runwayDays < 90 ? "bg-amber-500" : "bg-emerald-500"
                    )}
                  />
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Flame size={14} className="text-orange-500" />
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Academic Pressure</p>
                    </div>
                    <span className="text-[10px] font-black text-zinc-900 dark:text-white">{progress.pressure}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress.pressure}%` }}
                      className={cn(
                        "h-full rounded-full",
                        progress.pressure > 80 ? "bg-red-500" : 
                        progress.pressure > 50 ? "bg-orange-500" : "bg-indigo-600"
                      )}
                    />
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] shadow-lg border-none flex flex-col justify-between">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Zap size={18} className="text-orange-500" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Expenses vs Funding</p>
                  </div>
                  <span className="text-xs font-black text-zinc-900 dark:text-white">Net: {Math.max(0, progress.burnRate - progress.mrr).toLocaleString()} TZS/mo</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                      <span className="text-red-500">Expenses ({progress.burnRate.toLocaleString()} TZS)</span>
                      <span className="text-indigo-500">Funding ({progress.mrr.toLocaleString()} TZS)</span>
                    </div>
                    <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (progress.burnRate / Math.max(progress.burnRate + progress.mrr, 1)) * 100)}%` }}
                        className="h-full bg-red-500"
                      />
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (progress.mrr / Math.max(progress.burnRate + progress.mrr, 1)) * 100)}%` }}
                        className="h-full bg-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] shadow-lg border-none flex flex-col justify-between">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={18} className="text-emerald-500" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Academic & Project Value</p>
                  </div>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">{progress.companyValuation.toLocaleString()} TZS</span>
                </div>
                <div className="h-24 w-full -ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { val: Math.max(0, progress.companyValuation - 500) },
                      { val: Math.max(0, progress.companyValuation - 200) },
                      { val: Math.max(0, progress.companyValuation - 50) },
                      { val: progress.companyValuation }
                    ]}>
                      <defs>
                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="val" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {progress.status === 'Expelled' && (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-6 bg-red-600 text-white rounded-[2rem] shadow-xl shadow-red-100 dark:shadow-none flex items-center gap-6"
              >
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md">
                  <AlertTriangle size={32} />
                </div>
                <div>
                  <p className="font-black text-lg uppercase tracking-widest">Student Expelled</p>
                  <p className="text-sm opacity-90 font-medium max-w-md">Your financial runway has hit zero. You have been expelled from The Crucible Institute of Entrepreneurship and Innovation. The market has no mercy for those who cannot sustain themselves.</p>
                </div>
              </motion.div>
            )}

            {!hasCheckedInToday ? (
              <Card className="border-4 border-dashed border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/10 p-12 text-center rounded-[3rem] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600" />
                <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600 shadow-inner">
                  <BellRing size={48} />
                </div>
                <h3 className="text-3xl font-black text-indigo-900 dark:text-indigo-100 mb-3 tracking-tight">Morning Roll Call</h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-sm mx-auto text-lg">The campus is open. Validate your presence to maintain your streak and access today's curriculum.</p>
                <button 
                  onClick={handleRollCall}
                  className="px-12 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-2xl shadow-indigo-200 dark:shadow-none hover:scale-105 active:scale-95 transition-all text-lg"
                >
                  I'm Present & Ready
                </button>
              </Card>
            ) : (
              <Card className="bg-zinc-900 dark:bg-zinc-950 text-white border-none relative overflow-hidden p-6 md:p-8 rounded-[2rem] shadow-2xl">
                <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-indigo-600/20 to-transparent" />
                <div className="absolute -right-8 -top-8 opacity-10 rotate-12 text-indigo-500">
                  <BrainCircuit size={180} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center md:items-start">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex-shrink-0 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <GraduationCap size={28} className="text-white" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2 opacity-60">
                      <Zap size={12} className="fill-current text-amber-400" />
                      <span className="text-[9px] font-black uppercase tracking-[0.3em]">Dean's Daily Briefing</span>
                    </div>
                    <p className="text-lg md:text-xl font-serif italic leading-relaxed text-zinc-100">
                      {isGeneratingMentor ? (
                        <span className="flex items-center justify-center md:justify-start gap-3">
                          <motion.span 
                            animate={{ opacity: [0.4, 1, 0.4] }} 
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          >
                            Analyzing performance data...
                          </motion.span>
                        </span>
                      ) : `"${mentorMessage}"`}
                    </p>
                    <div className="mt-4 flex items-center gap-4">
                      <div className="h-px flex-1 bg-zinc-800" />
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Office of the Dean</span>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                <BarChart3 size={14} className="text-indigo-600" />
                Skill Matrix
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Object.entries(progress.skillLevels).map(([skill, level]) => {
                  const lvl = level as number;
                  const skillIcons: Record<string, any> = {
                    Operations: <Settings size={14} />,
                    Sales: <TrendingUp size={14} />,
                    Product: <Package size={14} />,
                    Learning: <BookOpen size={14} />
                  };
                  return (
                    <div key={skill} className="flex flex-col p-5 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                      <div className="flex justify-between items-start mb-3">
                        <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-400 group-hover:text-indigo-600 transition-colors">
                          {skillIcons[skill] || <Zap size={14} />}
                        </div>
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-2xl font-black text-zinc-900 dark:text-white">{Math.floor(lvl)}</span>
                          <span className="text-[10px] font-bold text-zinc-400">LVL</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">{skill}</span>
                      <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(lvl % 1) * 100}%` }}
                          className="h-full bg-indigo-600 rounded-full" 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <Card className="flex flex-col justify-between p-6 rounded-[2rem] border-none bg-white dark:bg-zinc-900 shadow-lg shadow-zinc-100 dark:shadow-none">
                <div className="p-3 w-fit rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mb-6">
                  <Award size={24} />
                </div>
                <div>
                  <p className="text-4xl font-black dark:text-white tracking-tighter">${progress.companyValuation.toLocaleString()}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mt-1">Total Value</p>
                </div>
              </Card>
              <Card className="flex flex-col justify-between p-6 rounded-[2rem] border-none bg-white dark:bg-zinc-900 shadow-lg shadow-zinc-100 dark:shadow-none">
                <div className="p-3 w-fit rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mb-6">
                  <Flame size={24} />
                </div>
                <div>
                  <p className="text-4xl font-black dark:text-white tracking-tighter">{progress.streak}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mt-1">Day Streak</p>
                </div>
              </Card>
            </div>

            <Card className="rounded-[2rem] p-8 border-none bg-zinc-900 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-3xl" />
              <h3 className="text-xs font-black mb-6 flex items-center gap-2 uppercase tracking-[0.2em] text-red-500">
                <ShieldAlert size={16} />
                The Brutal Reality
              </h3>
              <p className="text-lg font-serif italic leading-relaxed text-zinc-100 mb-6">
                "{HARD_TRUTHS[Math.floor((Date.now() / (1000 * 60 * 60 * 24)) % HARD_TRUTHS.length)]}"
              </p>
              <div className="pt-4 border-t border-zinc-800 flex justify-between items-center">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Daily Reality Check</span>
                <button 
                  onClick={() => {
                    const truth = HARD_TRUTHS[Math.floor(Math.random() * HARD_TRUTHS.length)];
                    setMentorMessage(`REALITY CHECK: ${truth}`);
                  }}
                  className="text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors"
                >
                  GIVE ME MORE TRUTH
                </button>
              </div>
            </Card>

            <Card className="rounded-[2rem] p-8 border-none bg-white dark:bg-zinc-900 shadow-lg shadow-zinc-100 dark:shadow-none">
              <h3 className="text-xs font-black mb-8 flex items-center gap-2 dark:text-white uppercase tracking-[0.2em] text-zinc-400">
                <GraduationCap size={16} className="text-indigo-600" />
                Degree Progress
              </h3>
              <div className="space-y-6">
                <ProgressBar 
                  progress={((Math.min(progress.currentStageIndex, activeStages.length - 1) + 1) / activeStages.length) * 100} 
                  label={activeStages[progress.currentStageIndex]?.name || 'Graduated'} 
                  subLabel={`Stage ${Math.min(progress.currentStageIndex + 1, activeStages.length)} of ${activeStages.length}`}
                />
                <div className="pt-4 border-t border-zinc-50 dark:border-zinc-800 flex justify-between items-center">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">GPA Equivalent</span>
                  <span className="text-sm font-black text-emerald-600">3.8 / 4.0</span>
                </div>
              </div>
            </Card>

            <Card className="rounded-[2rem] p-8 border-none bg-white dark:bg-zinc-900 shadow-lg shadow-zinc-100 dark:shadow-none">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xs font-black dark:text-white uppercase tracking-[0.2em] text-zinc-400">Today's Labs</h3>
                <span className="text-[10px] font-black px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  {completedToday}/{todayTasks.length} DONE
                </span>
              </div>
              <div className="space-y-4">
                {todayTasks.length > 0 ? (
                  todayTasks.map(task => (
                    <div key={task.id} className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-900 transition-all group cursor-pointer">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          completeTask(task.id);
                        }}
                        className={cn(
                          "w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all duration-300",
                          task.status === 'Completed' 
                            ? "bg-indigo-600 border-indigo-600 text-white scale-110" 
                            : "border-zinc-300 dark:border-zinc-700 group-hover:border-indigo-400 bg-white dark:bg-zinc-900"
                        )}
                      >
                        {task.status === 'Completed' && <CheckSquare size={16} />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <span className={cn(
                          "text-sm font-bold truncate block",
                          task.status === 'Completed' ? "text-zinc-400 line-through" : "text-zinc-800 dark:text-zinc-200"
                        )}>
                          {task.title}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">{task.category}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 px-4 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-3xl">
                    <Calendar size={32} className="mx-auto text-zinc-200 mb-3" />
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">No Labs Scheduled</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  const TasksView = () => {
    const [filter, setFilter] = useState<TaskCategory | 'All'>('All');
    const filteredTasks = tasks.filter(t => filter === 'All' || t.category === filter);

    return (
      <div className="space-y-8 pb-20">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
              <Calendar size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white md:text-4xl">Curriculum</h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Manage your weekly labs and assignments</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={progress.isWeekLocked ? unlockWeek : lockWeek}
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-300 shadow-sm font-bold text-sm",
                progress.isWeekLocked 
                  ? "bg-red-50 text-red-600 border border-red-100" 
                  : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50"
              )}
              title={progress.isWeekLocked ? "Unlock Week" : "Lock Week"}
            >
              {progress.isWeekLocked ? <Lock size={18} /> : <Unlock size={18} />}
              <span>{progress.isWeekLocked ? 'Week Locked' : 'Week Open'}</span>
            </button>
            <button 
              disabled={progress.isWeekLocked}
              onClick={() => setShowTaskModal(true)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none font-black text-sm transition-all hover:scale-105 active:scale-95",
                progress.isWeekLocked && "opacity-50 cursor-not-allowed grayscale"
              )}
            >
              <Plus size={20} />
              <span>New Lab</span>
            </button>
          </div>
        </header>

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {['All', 'Operations', 'Sales', 'Product', 'Learning'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                filter === cat 
                  ? "bg-indigo-600 text-white" 
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTasks.length > 0 ? (
            filteredTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).map(task => {
              const microCompleted = task.microTasks?.filter(m => m.completed).length || 0;
              const microTotal = task.microTasks?.length || 0;
              const microProgress = microTotal > 0 ? (microCompleted / microTotal) * 100 : 0;

              return (
                <Card key={task.id} className="p-6 rounded-[2rem] border-none bg-white dark:bg-zinc-900 shadow-lg shadow-zinc-100 dark:shadow-none hover:shadow-xl transition-all group flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className={cn(
                      "p-3 rounded-2xl",
                      task.category === 'Operations' ? "bg-blue-50 text-blue-600" :
                      task.category === 'Sales' ? "bg-emerald-50 text-emerald-600" :
                      task.category === 'Product' ? "bg-purple-50 text-purple-600" :
                      "bg-amber-50 text-amber-600"
                    )}>
                      {task.category === 'Operations' ? <Settings size={20} /> :
                       task.category === 'Sales' ? <TrendingUp size={20} /> :
                       task.category === 'Product' ? <Package size={20} /> :
                       <BookOpen size={20} />}
                    </div>
                    <span className={cn(
                      "text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-tighter",
                      task.priority === 'High' ? "bg-red-50 text-red-600" : 
                      task.priority === 'Medium' ? "bg-amber-50 text-amber-600" : 
                      "bg-blue-50 text-blue-600"
                    )}>
                      {task.priority} Priority
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <button 
                        onClick={() => completeTask(task.id)}
                        className={cn(
                          "mt-1 w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all flex-shrink-0",
                          task.status === 'Completed' 
                            ? "bg-indigo-600 border-indigo-600 text-white" 
                            : "border-zinc-200 dark:border-zinc-700 group-hover:border-indigo-400"
                        )}
                      >
                        {task.status === 'Completed' && <CheckSquare size={14} />}
                      </button>
                      <h4 className={cn(
                        "font-black text-lg leading-tight",
                        task.status === 'Completed' ? "text-zinc-400 line-through" : "text-zinc-900 dark:text-white"
                      )}>
                        {task.title}
                      </h4>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-6 font-medium leading-relaxed">
                      {task.description}
                    </p>
                    
                    {microTotal > 0 && (
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-400">
                          <span>Sub-Tasks</span>
                          <span>{microCompleted}/{microTotal}</span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${microProgress}%` }}
                            className="h-full bg-indigo-600 rounded-full" 
                          />
                        </div>
                        <div className="space-y-2">
                          {task.microTasks?.map(micro => (
                            <div key={micro.id} className="flex items-center gap-2 group/micro">
                              <button 
                                onClick={() => handleMicroTaskToggle(task.id, micro.id)}
                                className={cn(
                                  "w-4 h-4 rounded-md border flex items-center justify-center transition-all",
                                  micro.completed ? "bg-indigo-600 border-indigo-600 text-white" : "border-zinc-200 dark:border-zinc-700 group-hover/micro:border-indigo-400"
                                )}
                              >
                                {micro.completed && <CheckSquare size={10} />}
                              </button>
                              <span className={cn(
                                "text-[11px] font-bold",
                                micro.completed ? "text-zinc-400 line-through" : "text-zinc-600 dark:text-zinc-400"
                              )}>
                                {micro.title}
                              </span>
                              <span className="text-[9px] font-black text-indigo-500 ml-auto opacity-0 group-hover/micro:opacity-100 transition-opacity">
                                +{micro.points} PTS
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-zinc-50 dark:border-zinc-800 flex justify-between items-center mt-auto">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Clock size={14} />
                      <span className="text-[10px] font-black uppercase tracking-tighter">{task.timeBlock || 'Unscheduled'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Calendar size={14} />
                      <span className="text-[10px] font-black uppercase tracking-tighter">{format(parseISO(task.dueDate), 'MMM d')}</span>
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex p-4 rounded-full bg-zinc-50 dark:bg-zinc-800 text-zinc-300 mb-4">
                <CheckSquare size={40} />
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium">No tasks found in this category.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const MetricsView = () => {
    const chartData = useMemo(() => {
      const grouped = metrics.reduce((acc, m) => {
        const date = format(parseISO(m.date), 'MM/dd');
        if (!acc[date]) acc[date] = { date };
        acc[date][m.name] = m.value;
        return acc;
      }, {} as any);
      return Object.values(grouped);
    }, [metrics]);

    const uniqueMetricNames = Array.from(new Set(metrics.map(m => m.name))) as string[];

    return (
      <div className="space-y-8 pb-20">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white md:text-4xl">Performance</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Tracking your project's vital signs</p>
          </div>
          <button 
            onClick={() => setShowMetricModal(true)}
            className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none hover:scale-105 transition-transform"
          >
            <Plus size={24} />
          </button>
        </header>

        <Card className="p-8 rounded-[2rem] border-none shadow-2xl shadow-zinc-200 dark:shadow-none">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">Growth Trends</h3>
            <div className="flex gap-4">
              {uniqueMetricNames.map((name, i) => (
                <div key={name} className="flex items-center gap-2">
                  <div className={cn("w-3 h-3 rounded-full", i === 0 ? "bg-indigo-600" : "bg-emerald-500")} />
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">{name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIndigo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEmerald" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)', padding: '16px' }}
                />
                {uniqueMetricNames.map((name, i) => (
                  <Area 
                    key={name as string}
                    type="monotone" 
                    dataKey={name as string} 
                    stroke={i === 0 ? "#4f46e5" : "#10b981"} 
                    fillOpacity={1} 
                    fill={i === 0 ? "url(#colorIndigo)" : "url(#colorEmerald)"} 
                    strokeWidth={3}
                    animationDuration={1500}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uniqueMetricNames.map(name => {
            const metricGroup = metrics.filter(m => m.name === name).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            const latest = metricGroup[0];
            const previous = metricGroup[1];
            const change = previous ? ((latest.value - previous.value) / previous.value) * 100 : 0;

            return (
              <Card key={name} className="p-6 rounded-[2rem] hover:shadow-xl transition-all duration-300 group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em]">{name}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <p className="text-3xl font-black dark:text-white tracking-tighter">{latest?.value || 0}</p>
                      <span className="text-xs font-bold text-zinc-500">{latest?.unit}</span>
                    </div>
                  </div>
                  {change !== 0 && (
                    <div className={cn(
                      "px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1",
                      change > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    )}>
                      {change > 0 ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />}
                      {Math.abs(Math.round(change))}%
                    </div>
                  )}
                </div>
                <div className="h-16 w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[...metricGroup].reverse()}>
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#4f46e5" 
                        strokeWidth={3} 
                        dot={false} 
                        animationDuration={2000}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const JournalView = () => {
    const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(journal[0] || null);

    return (
      <div className="space-y-8 pb-20">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white md:text-4xl">Learning Journal</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Documenting the path to mastery</p>
          </div>
          <button 
            onClick={() => setShowJournalModal(true)}
            className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none hover:scale-105 transition-transform"
          >
            <Plus size={24} />
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-4 max-h-[70vh] overflow-y-auto pr-2 no-scrollbar">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input 
                type="text" 
                placeholder="Search lessons..." 
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white shadow-sm"
              />
            </div>

            {journal.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(entry => (
              <button 
                key={entry.id}
                onClick={() => setSelectedEntry(entry)}
                className={cn(
                  "w-full text-left p-5 rounded-[1.5rem] transition-all duration-300 border",
                  selectedEntry?.id === entry.id 
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none" 
                    : "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 hover:border-indigo-200"
                )}
              >
                <p className={cn("text-[10px] font-black uppercase tracking-widest mb-1", selectedEntry?.id === entry.id ? "text-indigo-100" : "text-zinc-400")}>
                  {format(parseISO(entry.date), 'MMM d, yyyy')}
                </p>
                <h4 className="font-bold truncate tracking-tight">{entry.lessonsLearned}</h4>
              </button>
            ))}
          </div>

          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {selectedEntry ? (
                <motion.div
                  key={selectedEntry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="p-10 rounded-[2.5rem] border-none shadow-2xl shadow-zinc-200 dark:shadow-none space-y-10">
                    <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-8">
                      <div>
                        <p className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mb-2">Daily Reflection</p>
                        <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">
                          {format(parseISO(selectedEntry.date), 'EEEE, MMMM do')}
                        </h2>
                      </div>
                      <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-3xl">
                        <Quote size={32} className="text-zinc-300" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-emerald-600">
                          <CheckSquare size={18} />
                          <h5 className="text-xs font-black uppercase tracking-widest">What Worked</h5>
                        </div>
                        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium bg-emerald-50/50 dark:bg-emerald-950/20 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900/30">
                          {selectedEntry.whatWorked}
                        </p>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-rose-600">
                          <AlertTriangle size={18} />
                          <h5 className="text-xs font-black uppercase tracking-widest">What Failed</h5>
                        </div>
                        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium bg-rose-50/50 dark:bg-rose-950/20 p-6 rounded-3xl border border-rose-100 dark:border-rose-900/30">
                          {selectedEntry.whatFailed}
                        </p>
                      </div>
                    </div>

                    <div className="p-8 bg-indigo-600 text-white rounded-[2rem] shadow-xl shadow-indigo-100 dark:shadow-none relative overflow-hidden">
                      <div className="absolute right-0 top-0 opacity-10 -rotate-12 translate-x-4 -translate-y-4">
                        <BrainCircuit size={120} />
                      </div>
                      <h5 className="text-xs font-black uppercase tracking-[0.2em] mb-4 opacity-80">The Core Lesson</h5>
                      <p className="text-2xl font-serif italic leading-relaxed">
                        "{selectedEntry.lessonsLearned}"
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-dashed border-zinc-200 dark:border-zinc-800">
                  <div className="p-6 bg-zinc-50 dark:bg-zinc-800 rounded-full text-zinc-300 mb-6">
                    <BookOpen size={64} />
                  </div>
                  <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tighter mb-2">Select a Reflection</h3>
                  <p className="text-zinc-500 max-w-xs">Choose an entry from the list to review your progress and lessons.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  };

  const ResourcesView = () => {
    return (
      <div className="space-y-8 pb-20">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white md:text-4xl">Library</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Your curated knowledge base</p>
          </div>
          <button 
            onClick={() => setShowResourceModal(true)}
            className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none hover:scale-105 transition-transform"
          >
            <Plus size={24} />
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map(res => (
            <Card key={res.id} className="flex flex-col p-6 rounded-[2rem] hover:shadow-xl transition-all duration-300 group border-none shadow-lg shadow-zinc-100 dark:shadow-none">
              <div className="flex justify-between items-start mb-6">
                <div className={cn(
                  "p-3 rounded-2xl",
                  res.type === 'Book' ? "bg-blue-50 text-blue-600" :
                  res.type === 'Podcast' ? "bg-purple-50 text-purple-600" :
                  res.type === 'Mentor' ? "bg-amber-50 text-amber-600" :
                  "bg-zinc-50 text-zinc-600"
                )}>
                  {res.type === 'Book' ? <BookOpen size={20} /> : 
                   res.type === 'Podcast' ? <Zap size={20} /> : 
                   res.type === 'Mentor' ? <Award size={20} /> : 
                   <Library size={20} />}
                </div>
                <div className="flex items-center gap-1">
                  {res.fileData && (
                    <button 
                      onClick={() => setViewingPdf(res)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-xl transition-colors"
                      title="Read PDF"
                    >
                      <Eye size={18} />
                    </button>
                  )}
                  {res.link && (
                    <a href={res.link} target="_blank" rel="noreferrer" className="p-2 text-zinc-400 hover:text-indigo-600 transition-colors">
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>
              <h4 className="font-black text-lg dark:text-white mb-3 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">{res.title}</h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3 mb-6 font-medium leading-relaxed">{res.notes}</p>
              
              <div className="mt-auto pt-6 border-t border-zinc-50 dark:border-zinc-800">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Target size={14} className="text-indigo-600" />
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Key Tactic</p>
                  </div>
                  {res.fileData && (
                    <span className="text-[9px] font-black px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-md uppercase">PDF Attached</span>
                  )}
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 font-bold italic leading-relaxed">
                  "{res.keyLessons[0] || 'No tactics added yet.'}"
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const requestTractionAudit = () => {
    const currentStage = activeStages[progress.currentStageIndex];
    if (currentStage && progress.mrr >= currentStage.mrrTarget) {
      setShowTractionAuditModal(true);
    }
  };

  const ProgressView = () => {
    const currentStage = activeStages[progress.currentStageIndex];
    const nextStage = activeStages[progress.currentStageIndex + 1];
    const mrrNeeded = currentStage?.mrrTarget || 0;
    const canAdvance = progress.mrr >= mrrNeeded && nextStage !== undefined;

    return (
      <div className="space-y-8 pb-20">
        <header>
          <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white md:text-4xl">Lifecycle Roadmap</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Stage {Math.min(progress.currentStageIndex + 1, activeStages.length)} of {activeStages.length} • {progress.status}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-8 rounded-[2.5rem] border-none shadow-xl shadow-zinc-100 dark:shadow-none bg-white dark:bg-zinc-900">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-8">Manage Finances</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Update Project Funding (TZS)</label>
                  <input 
                    type="number" 
                    value={progress.mrr} 
                    onChange={(e) => updateProgress({...progress, mrr: Number(e.target.value)})}
                    className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Update Academic Value (TZS)</label>
                  <input 
                    type="number" 
                    value={progress.companyValuation} 
                    onChange={(e) => updateProgress({...progress, companyValuation: Number(e.target.value)})}
                    className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Update Expenses (TZS)</label>
                  <input 
                    type="number" 
                    value={progress.burnRate} 
                    onChange={(e) => updateProgress({...progress, burnRate: Number(e.target.value)})}
                    className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>
              </div>
            </Card>
            <Card className="bg-zinc-900 text-white border-none p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
              <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-600/20 blur-[100px] -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">Current Stage</p>
                    <h2 className={cn(
                      "text-5xl font-black tracking-tighter",
                      progress.status === 'Expelled' ? "text-red-500" : "text-white"
                    )}>{progress.status}</h2>
                  </div>
                  <div className="p-5 bg-white/10 rounded-3xl backdrop-blur-xl border border-white/10">
                    <GraduationCap size={48} className="text-indigo-400" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Stage Progress</span>
                    <span className="text-2xl font-black text-indigo-400 tracking-tighter">
                      {mrrNeeded > 0 ? Math.min(100, Math.round((progress.mrr / mrrNeeded) * 100)) : (progress.mrr > 0 ? 100 : 0)}%
                    </span>
                  </div>
                  <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${mrrNeeded > 0 ? Math.min(100, (progress.mrr / mrrNeeded) * 100) : (progress.mrr > 0 ? 100 : 0)}%` }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.5)]" 
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                    <span>${progress.mrr.toLocaleString()} Funding / ${mrrNeeded.toLocaleString()} Target</span>
                    <span>Runway: {progress.runwayDays} Days</span>
                  </div>
                </div>

                {canAdvance && (
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={requestTractionAudit}
                    className="w-full mt-10 py-5 bg-white text-zinc-900 font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 text-lg uppercase tracking-tighter"
                  >
                    <Award size={24} className="text-indigo-600" />
                    Request Traction Audit
                  </motion.button>
                )}
              </div>
            </Card>

            <div className="space-y-4">
              <h3 className="text-xs font-black dark:text-white uppercase tracking-[0.2em] text-zinc-400 ml-4">Curriculum Roadmap</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeStages.map((stage, i) => (
                  <div 
                    key={stage.name}
                    className={cn(
                      "flex items-center gap-4 p-6 rounded-[2rem] border-2 transition-all duration-300",
                      i === progress.currentStageIndex 
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 shadow-lg shadow-indigo-100 dark:shadow-none" 
                        : i < progress.currentStageIndex 
                          ? "border-emerald-100 bg-emerald-50/30 dark:border-emerald-900/10"
                          : "border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 opacity-40"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg",
                      i === progress.currentStageIndex ? "bg-indigo-600 text-white" :
                      i < progress.currentStageIndex ? "bg-emerald-600 text-white" :
                      "bg-zinc-100 dark:bg-zinc-900 text-zinc-400"
                    )}>
                      {i < progress.currentStageIndex ? <CheckSquare size={24} /> : i + 1}
                    </div>
                    <div className="flex-1">
                      <p className={cn(
                        "font-black tracking-tight",
                        i === progress.currentStageIndex ? "text-indigo-900 dark:text-indigo-100" :
                        i < progress.currentStageIndex ? "text-emerald-900 dark:text-emerald-100" :
                        "text-zinc-400"
                      )}>
                        {stage.name}
                      </p>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
                        Target: ${stage.mrrTarget.toLocaleString()} Funding
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="p-8 rounded-[2.5rem] border-none shadow-xl shadow-zinc-100 dark:shadow-none bg-white dark:bg-zinc-900">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-8">Dean's List Status</h3>
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-black dark:text-white tracking-tight">Academic Value Index</p>
                    <p className="text-2xl font-black text-indigo-600">${progress.companyValuation.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-black dark:text-white tracking-tight">Survival Runway</p>
                    <p className="text-2xl font-black text-indigo-600">{progress.runwayDays} Days</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                    <Award size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-black dark:text-white tracking-tight">Major</p>
                    <p className="text-sm font-black text-indigo-600 uppercase tracking-widest">Project Operations</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 rounded-[2.5rem] bg-indigo-600 text-white border-none shadow-xl shadow-indigo-100 dark:shadow-none">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 opacity-80">Academic Integrity</h3>
              <p className="text-sm font-medium leading-relaxed mb-6">
                "Entrepreneurship is a marathon of integrity. Every task skipped is a debt to your future self."
              </p>
              <div className="flex items-center gap-3 p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                <ShieldAlert size={20} className="text-indigo-200" />
                <p className="text-[10px] font-bold uppercase tracking-widest">Verified Student ID: #829</p>
              </div>
            </Card>

            {progress.stageHistory && progress.stageHistory.length > 0 && (
              <Card className="p-8 rounded-[2.5rem] border-none shadow-xl shadow-zinc-100 dark:shadow-none bg-white dark:bg-zinc-900">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-8">Official Transcript</h3>
                <div className="space-y-6">
                  {progress.stageHistory.map((entry, i) => (
                    <div key={i} className="pb-6 border-b border-zinc-50 dark:border-zinc-800 last:border-none last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-black dark:text-white">{entry.stage}</h4>
                        <span className="text-xs font-black text-emerald-600">Academic Value Index +</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-2">{format(parseISO(entry.date), 'MMMM yyyy')}</p>
                      <p className="text-xs font-serif italic text-zinc-500 dark:text-zinc-400 leading-relaxed">"{entry.deanComment}"</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  };

  // --- Modals ---

  const TractionAuditModal = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [auditResult, setAuditResult] = useState<'passed' | 'failed' | null>(null);
    const [feedback, setFeedback] = useState('');

    const handleAuditSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      const currentStage = activeStages[progress.currentStageIndex];
      const nextStage = activeStages[progress.currentStageIndex + 1];
      
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
        const model = "gemini-3-flash-preview";
        const prompt = `You are the Dean of the Program. 
        Evaluate this student's Traction Audit for the stage: ${currentStage.name}. 
        They are trying to advance to: ${nextStage?.name || 'Graduation'}.
        
        Student's Reflection: "${feedback}"
        
        Criteria: 
        1. Does it show real entrepreneurial growth and focus on RGA (Result Generating Activities)?
        2. Is it honest about failures and expenses?
        3. Does it have a clear plan for scaling to the next level?
        
        Respond in JSON format:
        {
          "passed": boolean,
          "deanComment": "string (brutal but fair feedback, outcome-obsessed)"
        }`;

        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: { responseMimeType: "application/json" }
        });

        const result = JSON.parse(response.text);
        setAuditResult(result.passed ? 'passed' : 'failed');
        setFeedback(result.deanComment);

        if (result.passed) {
          const newHistory = [
            ...(progress.stageHistory || []),
            {
              stage: currentStage.name,
              date: new Date().toISOString(),
              deanComment: result.deanComment,
              gpa: 4.0 // Legacy field
            }
          ];
          updateProgress({
            ...progress,
            currentStageIndex: progress.currentStageIndex + 1,
            status: nextStage ? nextStage.name as any : 'Graduated',
            companyValuation: progress.companyValuation + (currentStage.mrrTarget * 10),
            resilienceScore: (progress.resilienceScore || 0) + 5,
            stageHistory: newHistory
          });
        }
      } catch (error) {
        console.error("Audit evaluation failed:", error);
        setAuditResult('passed');
        setFeedback("The Dean is unavailable, but your metrics speak for themselves. You pass by default, but don't get comfortable.");
        updateProgress({
          ...progress,
          currentStageIndex: progress.currentStageIndex + 1,
          status: nextStage ? nextStage.name as any : 'Graduated',
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-xl">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-3 bg-indigo-600" />
          
          {!auditResult ? (
            <div className="space-y-8">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-4xl font-black tracking-tighter dark:text-white">Traction Audit: {activeStages[progress.currentStageIndex]?.name}</h2>
                  <p className="text-zinc-500 font-medium mt-2">The Dean of the Program is ready for your defense.</p>
                </div>
                <div className="p-4 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 rounded-2xl">
                  <GraduationCap size={40} />
                </div>
              </div>

              <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl border border-zinc-100 dark:border-zinc-700">
                <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">The Challenge</h4>
                <p className="text-lg font-serif italic leading-relaxed dark:text-zinc-200">
                  "To advance to {activeStages[progress.currentStageIndex + 1]?.name || 'the next level'}, you must defend your progress. What was your biggest failure in this stage, and how did it make you a better student? Be brutally honest. The Dean hates fluff."
                </p>
              </div>

              <form onSubmit={handleAuditSubmit} className="space-y-6">
                <textarea 
                  required
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  placeholder="Type your defense here..."
                  className="w-full h-48 p-6 bg-zinc-100 dark:bg-zinc-800 rounded-3xl text-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:text-white resize-none"
                />
                <button 
                  disabled={isSubmitting}
                  className="w-full py-6 bg-indigo-600 text-white font-black rounded-2xl shadow-2xl shadow-indigo-200 dark:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all text-xl flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                        <Zap size={24} />
                      </motion.span>
                      Evaluating...
                    </span>
                  ) : (
                    <>
                      <Award size={24} />
                      Submit Final Defense
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center space-y-8">
              <div className={cn(
                "w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6",
                auditResult === 'passed' ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
              )}>
                {auditResult === 'passed' ? <Trophy size={48} /> : <AlertTriangle size={48} />}
              </div>
              
              <div>
                <h2 className="text-4xl font-black tracking-tighter dark:text-white mb-4">
                  {auditResult === 'passed' ? "AUDIT PASSED" : "AUDIT FAILED"}
                </h2>
                <div className="p-8 bg-zinc-50 dark:bg-zinc-800 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-700">
                  <p className="text-xl font-serif italic leading-relaxed dark:text-zinc-200">
                    "{feedback}"
                  </p>
                </div>
              </div>

              <button 
                onClick={() => {
                  setShowTractionAuditModal(false);
                  if (auditResult === 'failed') {
                    setAuditResult(null);
                    setFeedback('');
                  }
                }}
                className="w-full py-6 bg-zinc-900 text-white font-black rounded-2xl text-xl"
              >
                {auditResult === 'passed' ? "Enter Next Stage" : "Try Again"}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    );
  };

  const PopQuizModal = () => {
    if (!activePopQuiz) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-indigo-900/90 backdrop-blur-md">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-3xl p-8 text-center space-y-6 shadow-2xl"
        >
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-950 rounded-full flex items-center justify-center mx-auto text-indigo-600 animate-bounce">
            <BellRing size={40} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-indigo-900 dark:text-white uppercase tracking-tighter italic">POP QUIZ!</h2>
            <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mt-1">{activePopQuiz.title}</p>
          </div>
          <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
            {activePopQuiz.challenge}
          </p>
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900">
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">Reward</p>
            <p className="text-xl font-bold text-indigo-900 dark:text-indigo-100">+{activePopQuiz.reward} Credits</p>
          </div>
          <button 
            onClick={() => {
              updateProgress({
                ...progress,
                companyValuation: progress.companyValuation + activePopQuiz.reward * 10,
              });
              setShowPopQuiz(false);
            }}
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none"
          >
            Challenge Accepted
          </button>
        </motion.div>
      </div>
    );
  };

  const FocusModeOverlay = () => {
    if (!progress.isFocusModeActive) return null;
    const todayTasks = tasks.filter(t => isSameDay(parseISO(t.dueDate), new Date()));
    const completedToday = todayTasks.filter(t => t.status === 'Completed').length;
    
    if (completedToday > 0) return null;

    return (
      <div className="fixed inset-0 z-[200] bg-zinc-950 flex flex-col items-center justify-center p-8 text-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-red-600 mb-8"
        >
          <ShieldAlert size={80} />
        </motion.div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">FOCUS MODE ACTIVE</h2>
        <p className="text-zinc-400 mb-8 leading-relaxed">
          The Campus is locked. You have not completed a single task today. 
          The Dean has restricted access to all features until you take action.
        </p>
        <div className="w-full max-w-xs space-y-4">
          <button 
            onClick={() => {
              setActiveTab('tasks');
              updateProgress({ ...progress, isFocusModeActive: false });
            }}
            className="w-full py-4 bg-white text-black font-bold rounded-2xl"
          >
            Go to Curriculum
          </button>
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Action is the only way out.</p>
        </div>
      </div>
    );
  };

  const ExpelledOverlay = () => {
    if (progress.status !== 'Expelled') return null;

    return (
      <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8 text-center overflow-y-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full space-y-12"
        >
          <div className="relative inline-block">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="text-red-600 mb-8"
            >
              <ShieldAlert size={120} strokeWidth={1} />
            </motion.div>
            <div className="absolute -top-4 -right-4 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
              Final Notice
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl font-black text-white uppercase tracking-tighter italic leading-none">EXPELLED</h1>
            <p className="text-zinc-500 text-lg leading-relaxed">
              Your runway hit zero. The market has spoken. You are no longer a student of The Crucible Institute of Entrepreneurship and Innovation.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl text-left">
              <span className="text-[10px] text-zinc-600 uppercase tracking-widest block mb-1">Final Academic Value</span>
              <span className="text-xl font-mono text-white">${progress.companyValuation.toLocaleString()}</span>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl text-left">
              <span className="text-[10px] text-zinc-600 uppercase tracking-widest block mb-1">Peak Funding</span>
              <span className="text-xl font-mono text-white">${progress.mrr.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-4 pt-8">
            <button 
              onClick={() => {
                storage.setProgress(INITIAL_PROGRESS);
                window.location.reload();
              }}
              className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-zinc-200 transition-all uppercase tracking-widest text-sm"
            >
              Restart Journey
            </button>
            <p className="text-[10px] text-zinc-700 uppercase tracking-widest">The wilderness is waiting.</p>
          </div>
        </motion.div>
      </div>
    );
  };

  const TaskModal = () => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [cat, setCat] = useState<TaskCategory>('Operations');
    const [prio, setPrio] = useState<'Low' | 'Medium' | 'High'>('Medium');
    const [time, setTime] = useState('');
    const [leverage, setLeverage] = useState<'RGA' | 'Support'>('RGA');
    const [microTasks, setMicroTasks] = useState<{ title: string; points: number }[]>([]);
    const [newMicroTitle, setNewMicroTitle] = useState('');

    const addMicroTask = () => {
      if (newMicroTitle.trim()) {
        setMicroTasks([...microTasks, { title: newMicroTitle, points: 5 }]);
        setNewMicroTitle('');
      }
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newTask: Task = {
        id: Date.now().toString(),
        title,
        description: desc,
        category: cat,
        priority: prio,
        status: 'Pending',
        dueDate: new Date().toISOString(),
        timeBlock: time,
        leverage,
        points: prio === 'High' ? 50 : prio === 'Medium' ? 25 : 10,
        microTasks: microTasks.map((m, i) => ({ id: `${Date.now()}-${i}`, title: m.title, completed: false, points: m.points })),
        penalty: 10
      };
      saveTasks([...tasks, newTask]);
      // Every task adds to pressure
      updateProgress({ ...progress, pressure: Math.min(100, progress.pressure + 10) });
      setShowTaskModal(false);
    };

    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 space-y-6"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold dark:text-white">New Assignment</h2>
            <button onClick={() => setShowTaskModal(false)} className="text-zinc-400">
              <Plus size={24} className="rotate-45" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Task Title</label>
              <input 
                autoFocus
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                placeholder="e.g., Market Research Lab"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Leverage</label>
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => setLeverage('RGA')}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-xs font-black transition-all border-2",
                    leverage === 'RGA' 
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                      : "bg-zinc-100 dark:bg-zinc-800 border-transparent text-zinc-500"
                  )}
                >
                  RGA (Result)
                </button>
                <button 
                  type="button"
                  onClick={() => setLeverage('Support')}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-xs font-black transition-all border-2",
                    leverage === 'Support' 
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/20" 
                      : "bg-zinc-100 dark:bg-zinc-800 border-transparent text-zinc-500"
                  )}
                >
                  Support (Pressure)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Category</label>
                <select 
                  value={cat}
                  onChange={e => setCat(e.target.value as any)}
                  className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                >
                  <option>Operations</option>
                  <option>Sales</option>
                  <option>Product</option>
                  <option>Learning</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Priority</label>
                <select 
                  value={prio}
                  onChange={e => setPrio(e.target.value as any)}
                  className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Time Block</label>
              <input 
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                placeholder="e.g., 09:00 - 10:30"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Micro-Tasks (Labs)</label>
              <div className="flex gap-2">
                <input 
                  value={newMicroTitle}
                  onChange={e => setNewMicroTitle(e.target.value)}
                  className="flex-1 p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  placeholder="Add a step..."
                />
                <button 
                  type="button"
                  onClick={addMicroTask}
                  className="p-3 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 rounded-xl"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="space-y-2 mt-2 max-h-32 overflow-y-auto">
                {microTasks.map((m, i) => (
                  <div key={i} className="flex justify-between items-center p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg text-xs dark:text-zinc-300">
                    <span>{m.title}</span>
                    <span className="font-bold text-indigo-600">+{m.points} pts</span>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none mt-4">
              Enroll Task
            </button>
          </form>
        </motion.div>
      </div>
    );
  };

  const MetricModal = () => {
    const [name, setName] = useState(DEFAULT_METRICS[0]);
    const [value, setValue] = useState('');
    const [unit, setUnit] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newMetric: Metric = {
        id: Date.now().toString(),
        name,
        value: Number(value),
        unit: unit || (name.includes('$') ? '$' : 'units'),
        date: new Date().toISOString(),
      };
      saveMetrics([...metrics, newMetric]);
      setShowMetricModal(false);
    };

    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 space-y-6"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold dark:text-white">Record Metric</h2>
            <button onClick={() => setShowMetricModal(false)} className="text-zinc-400">
              <Plus size={24} className="rotate-45" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Metric Name</label>
              <select 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              >
                {DEFAULT_METRICS.map(m => <option key={m}>{m}</option>)}
                <option value="custom">Custom...</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Value</label>
                <input 
                  type="number"
                  required
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Unit</label>
                <input 
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                  className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  placeholder="e.g., users"
                />
              </div>
            </div>
            <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg mt-4">
              Log Data
            </button>
          </form>
        </motion.div>
      </div>
    );
  };

  const JournalModal = () => {
    const [worked, setWorked] = useState('');
    const [failed, setFailed] = useState('');
    const [lesson, setLesson] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        whatWorked: worked,
        whatFailed: failed,
        lessonsLearned: lesson,
        tags: [],
      };
      saveJournal([...journal, newEntry]);
      setShowJournalModal(false);
    };

    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 space-y-6"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold dark:text-white">Daily Reflection</h2>
            <button onClick={() => setShowJournalModal(false)} className="text-zinc-400">
              <Plus size={24} className="rotate-45" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">What worked today?</label>
              <textarea 
                required
                value={worked}
                onChange={e => setWorked(e.target.value)}
                className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white min-h-[80px]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">What failed today?</label>
              <textarea 
                required
                value={failed}
                onChange={e => setFailed(e.target.value)}
                className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white min-h-[80px]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Key Lesson Learned</label>
              <textarea 
                required
                value={lesson}
                onChange={e => setLesson(e.target.value)}
                className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white min-h-[80px]"
              />
            </div>
            <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg mt-4">
              Submit Reflection
            </button>
          </form>
        </motion.div>
      </div>
    );
  };

  const WarRoomView = () => {
    return (
      <div className="space-y-8 pb-20">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white md:text-4xl">War Room</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Manage and resolve market shocks</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={triggerMarketShock}
              disabled={isTriggeringMarketShock}
              className="px-4 py-2 bg-zinc-900 text-white text-xs font-black rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50 disabled:scale-100"
            >
              {isTriggeringMarketShock ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                  <Zap size={14} className="text-amber-400" />
                </motion.div>
              ) : (
                <Zap size={14} className="text-amber-400" />
              )}
              {isTriggeringMarketShock ? "PREPARING SHOCK..." : "SIMULATE SHOCK"}
            </button>
            <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Academic Value</p>
              <p className="text-xl font-black text-indigo-600 tracking-tighter">${progress.companyValuation.toLocaleString()}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
              <AlertCircle size={14} className="text-red-500" />
              Active Market Shocks
            </h3>
            
            {marketShocks.filter(c => !c.resolved).length === 0 ? (
              <Card className="p-12 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 bg-transparent">
                <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400">
                  <ShieldAlert size={32} />
                </div>
                <p className="text-zinc-500 font-medium">No active market shocks. Stay vigilant.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {marketShocks.filter(c => !c.resolved).map(shock => (
                  <Card key={shock.id} className="p-6 border-l-4 border-red-500 hover:shadow-xl transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={cn(
                            "text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest",
                            shock.severity === 'Critical' ? "bg-red-100 text-red-600" :
                            shock.severity === 'High' ? "bg-orange-100 text-orange-600" : "bg-amber-100 text-amber-600"
                          )}>
                            {shock.severity}
                          </span>
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            {format(parseISO(shock.dateTriggered), 'MMM d, HH:mm')}
                          </span>
                        </div>
                        <h4 className="text-xl font-black dark:text-white tracking-tight group-hover:text-red-500 transition-colors">{shock.title}</h4>
                      </div>
                      <button 
                        onClick={() => {
                          setActiveMarketShock(shock);
                          setShowMarketShockModal(true);
                        }}
                        className="px-4 py-2 bg-red-600 text-white text-xs font-black rounded-xl shadow-lg shadow-red-100 dark:shadow-none hover:scale-105 transition-transform"
                      >
                        DEFEND PIVOT
                      </button>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">{shock.description}</p>
                  </Card>
                ))}
              </div>
            )}

            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2 pt-8">
              <Trophy size={14} className="text-indigo-600" />
              Battle History
            </h3>
            <div className="space-y-4">
              {marketShocks.filter(c => c.resolved).map(shock => (
                <Card key={shock.id} className="p-6 bg-zinc-50/50 dark:bg-zinc-900/50 border-none">
                  <div className="flex justify-between items-start mb-4 opacity-70">
                    <div>
                      <h4 className="text-lg font-black dark:text-white tracking-tight">{shock.title}</h4>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Resolved on {format(parseISO(shock.dateTriggered), 'MMM d, yyyy')}</p>
                    </div>
                    <div className="p-2 bg-green-50 text-green-600 rounded-xl">
                      <Award size={20} />
                    </div>
                  </div>
                  <div className="p-4 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Pivot Defense</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300 italic font-medium">"{shock.responsePlan}"</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <Card className="p-8 bg-zinc-900 text-white border-none rounded-[2.5rem] relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-3xl" />
              <h4 className="text-xl font-black mb-4 tracking-tight relative z-10">Resilience Doctrine</h4>
              <ul className="space-y-4 relative z-10">
                {[
                  "Never quit on a bad day.",
                  "Crisis is just data in disguise.",
                  "Resilience is built in the struggle.",
                  "The obstacle is the way."
                ].map((rule, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-black flex-shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-sm text-zinc-300 font-medium italic">"{rule}"</p>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  const MarketShockModal = () => {
    const [plan, setPlan] = useState('');
    if (!activeMarketShock) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-red-950/90 backdrop-blur-xl">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[3rem] p-10 space-y-8 shadow-[0_0_100px_rgba(220,38,38,0.3)] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-4 bg-red-600 animate-pulse" />
          
          <div className="flex justify-between items-start">
            <div className="p-5 bg-red-600 text-white rounded-[2rem] shadow-xl shadow-red-200 dark:shadow-none">
              <AlertTriangle size={40} className="animate-pulse" />
            </div>
            <button 
              onClick={() => setShowMarketShockModal(false)}
              className="p-3 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl transition-all"
            >
              <Plus size={28} className="rotate-45" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className={cn(
                "text-xs font-black px-3 py-1 rounded-xl uppercase tracking-widest",
                activeMarketShock.severity === 'Critical' ? "bg-red-600 text-white" :
                activeMarketShock.severity === 'High' ? "bg-orange-600 text-white" : "bg-amber-600 text-white"
              )}>
                {activeMarketShock.severity} PRIORITY
              </span>
              <span className="text-xs font-black text-red-600 uppercase tracking-widest animate-pulse">MARKET SHOCK</span>
            </div>
            <h2 className="text-4xl font-black dark:text-white tracking-tighter leading-none">{activeMarketShock.title}</h2>
            <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl border border-zinc-100 dark:border-zinc-700">
              <p className="text-lg font-serif italic leading-relaxed dark:text-zinc-200">
                "{activeMarketShock.description}"
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] ml-2">Defend Your Pivot</label>
              <textarea 
                required
                value={plan}
                onChange={e => setPlan(e.target.value)}
                placeholder="Type your decisive pivot strategy here..."
                className="w-full p-6 bg-zinc-100 dark:bg-zinc-800 rounded-[2rem] text-lg focus:outline-none focus:ring-4 focus:ring-red-500/20 dark:text-white min-h-[160px] font-medium resize-none shadow-inner"
              />
            </div>
            <button 
              onClick={() => resolveMarketShock(activeMarketShock.id, plan)}
              disabled={!plan.trim() || isResolvingMarketShock}
              className="w-full py-6 bg-red-600 text-white font-black rounded-2xl shadow-2xl shadow-red-200 dark:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3 text-xl"
            >
              {isResolvingMarketShock ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                  <Zap size={28} />
                </motion.div>
              ) : (
                <Zap size={28} />
              )}
              {isResolvingMarketShock ? "EVALUATING..." : "EXECUTE PIVOT"}
            </button>
          </div>
        </motion.div>
      </div>
    );
  };
  const ResourceModal = () => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState<Resource['type']>('Book');
    const [notes, setNotes] = useState('');
    const [tactic, setTactic] = useState('');
    const [fileData, setFileData] = useState<string | undefined>(undefined);
    const [fileName, setFileName] = useState<string | undefined>(undefined);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.type !== 'application/pdf') {
          alert('Please upload a PDF file.');
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setFileData(reader.result as string);
          setFileName(file.name);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newResource: Resource = {
        id: Date.now().toString(),
        title,
        type,
        notes,
        keyLessons: [tactic],
        dateAdded: new Date().toISOString(),
        fileData,
        fileName
      };
      saveResources([...resources, newResource]);
      setShowResourceModal(false);
    };

    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 space-y-6 max-h-[90vh] overflow-y-auto no-scrollbar"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold dark:text-white">Add Knowledge</h2>
            <button onClick={() => setShowResourceModal(false)} className="text-zinc-400">
              <Plus size={24} className="rotate-45" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Title / Source</label>
              <input 
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Type</label>
              <select 
                value={type}
                onChange={e => setType(e.target.value as any)}
                className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              >
                <option>Book</option>
                <option>Podcast</option>
                <option>Mentor</option>
                <option>Article</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Notes</label>
              <textarea 
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white min-h-[80px]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Key Tactic</label>
              <input 
                value={tactic}
                onChange={setTactic ? e => setTactic(e.target.value) : undefined}
                className="w-full p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                placeholder="Actionable advice..."
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Upload PDF (Optional)</label>
              <div className="relative">
                <input 
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
                <label 
                  htmlFor="pdf-upload"
                  className="flex items-center gap-3 w-full p-3 bg-zinc-50 dark:bg-zinc-800/50 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl text-sm cursor-pointer hover:border-indigo-500 transition-colors"
                >
                  <FileText size={20} className="text-zinc-400" />
                  <span className="text-zinc-500 truncate">
                    {fileName || 'Choose PDF file...'}
                  </span>
                </label>
              </div>
            </div>
            <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg mt-4">
              Archive Knowledge
            </button>
          </form>
        </motion.div>
      </div>
    );
  };

  const PDFViewerModal = () => {
    if (!viewingPdf || !viewingPdf.fileData) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-zinc-900 w-full max-w-5xl h-[95vh] rounded-3xl flex flex-col overflow-hidden shadow-2xl"
        >
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 rounded-xl">
                <BookOpen size={20} />
              </div>
              <h2 className="text-xl font-black dark:text-white tracking-tight">{viewingPdf.title}</h2>
            </div>
            <button 
              onClick={() => setViewingPdf(null)}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400"
            >
              <Plus size={24} className="rotate-45" />
            </button>
          </div>
          <div className="flex-1 bg-zinc-100 dark:bg-zinc-950 p-4">
            <iframe 
              src={viewingPdf.fileData} 
              className="w-full h-full rounded-xl border-none shadow-inner"
              title={viewingPdf.title}
            />
          </div>
        </motion.div>
      </div>
    );
  };

  const toggleRoadmapMode = () => {
    const newMode = progress.roadmapMode === 'BEAT' ? 'Startup' : 'BEAT';
    updateProgress({ ...progress, roadmapMode: newMode, currentStageIndex: 0, completedLevels: [] });
    setMentorMessage(`Switching to ${newMode} mode. The Dean has adjusted your curriculum. Don't disappoint.`);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-indigo-100 selection:text-indigo-900 flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        roadmapMode={progress.roadmapMode}
        onToggleRoadmapMode={toggleRoadmapMode}
      />
      
      <FocusModeOverlay />
      <ExpelledOverlay />
      {showPopQuiz && <PopQuizModal />}
      {viewingPdf && <PDFViewerModal />}
      
      <div className="flex-1 min-h-screen flex flex-col relative overflow-hidden">
        <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto no-scrollbar max-w-6xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && <DashboardView />}
              {activeTab === 'tasks' && <TasksView />}
              {activeTab === 'metrics' && <MetricsView />}
              {activeTab === 'journal' && <JournalView />}
              {activeTab === 'resources' && <ResourcesView />}
              {activeTab === 'progress' && <ProgressView />}
              {activeTab === 'warroom' && <WarRoomView />}
            </motion.div>
          </AnimatePresence>
        </main>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-t border-zinc-100 dark:border-zinc-800 px-4 pb-safe flex justify-between items-center z-40">
          <NavItem icon={LayoutDashboard} label="Campus" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={CheckSquare} label="Tasks" active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} />
          <NavItem icon={BarChart3} label="Stats" active={activeTab === 'metrics'} onClick={() => setActiveTab('metrics')} />
          <NavItem icon={BookOpen} label="Journal" active={activeTab === 'journal'} onClick={() => setActiveTab('journal')} />
          <NavItem icon={Library} label="Library" active={activeTab === 'resources'} onClick={() => setActiveTab('resources')} />
          <NavItem icon={ShieldAlert} label="War" active={activeTab === 'warroom'} onClick={() => setActiveTab('warroom')} />
          <NavItem icon={GraduationCap} label="Degree" active={activeTab === 'progress'} onClick={() => setActiveTab('progress')} />
        </nav>

        {/* Modals */}
        <AnimatePresence>
          {showTaskModal && <TaskModal />}
          {showMetricModal && <MetricModal />}
          {showJournalModal && <JournalModal />}
          {showResourceModal && <ResourceModal />}
          {showMarketShockModal && <MarketShockModal />}
          {showTractionAuditModal && <TractionAuditModal />}
          {showRailwayMap && <RailwayMap completedLevels={progress.completedLevels} activeStages={activeStages} onClose={() => setShowRailwayMap(false)} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
