import { Task, Metric, JournalEntry, Resource, UserProgress, MarketShock } from '../types';
import { INITIAL_PROGRESS } from '../constants';

const STORAGE_KEYS = {
  TASKS: 'ed_tasks',
  METRICS: 'ed_metrics',
  JOURNAL: 'ed_journal',
  RESOURCES: 'ed_resources',
  PROGRESS: 'ed_progress',
  THEME: 'ed_theme',
  MARKET_SHOCKS: 'ed_market_shocks',
};

export const storage = {
  getTasks: (): Task[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]'),
  setTasks: (tasks: Task[]) => localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks)),

  getMetrics: (): Metric[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.METRICS) || '[]'),
  setMetrics: (metrics: Metric[]) => localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(metrics)),

  getJournal: (): JournalEntry[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.JOURNAL) || '[]'),
  setJournal: (entries: JournalEntry[]) => localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(entries)),

  getMarketShocks: (): MarketShock[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.MARKET_SHOCKS) || '[]'),
  setMarketShocks: (shocks: MarketShock[]) => localStorage.setItem(STORAGE_KEYS.MARKET_SHOCKS, JSON.stringify(shocks)),

  getResources: (): Resource[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.RESOURCES) || '[]'),
  setResources: (resources: Resource[]) => localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources)),

  getProgress: (): UserProgress => JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS) || JSON.stringify(INITIAL_PROGRESS)),
  setProgress: (progress: UserProgress) => localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress)),
  
  getTheme: (): 'light' | 'dark' => (localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark') || 'light',
  setTheme: (theme: 'light' | 'dark') => localStorage.setItem(STORAGE_KEYS.THEME, theme),

  exportData: () => {
    const data: Record<string, string | null> = {};
    Object.values(STORAGE_KEYS).forEach((key) => {
      data[key] = localStorage.getItem(key);
    });
    return JSON.stringify(data);
  },

  importData: (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'string') {
          localStorage.setItem(key, value);
        }
      });
      return true;
    } catch (e) {
      console.error('Failed to import data', e);
      return false;
    }
  },
};
