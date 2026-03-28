import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { CheckCircle2, Circle, GraduationCap, Target, ChevronRight } from 'lucide-react';

interface RailwayMapProps {
  completedLevels: string[];
  activeStages: any[];
  onClose: () => void;
}

export const RailwayMap: React.FC<RailwayMapProps> = ({ completedLevels, activeStages, onClose }) => {
  return (
    <div className="fixed inset-0 z-[99999] bg-white dark:bg-zinc-950 overflow-hidden flex flex-col">
      <header className="p-8 border-b border-zinc-100 dark:border-zinc-900 flex justify-between items-center bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
        <div>
          <h2 className="text-3xl font-black tracking-tighter dark:text-white">Curriculum Roadmap</h2>
          <p className="text-zinc-500 text-sm font-medium">Your journey through the Institute.</p>
        </div>
        <button 
          onClick={onClose} 
          className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-900 p-3 rounded-2xl transition-colors"
        >
          Close Roadmap
        </button>
      </header>
      
      <div className="flex-1 overflow-y-auto p-8 md:p-12 lg:p-20 no-scrollbar">
        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-zinc-100 dark:bg-zinc-900" />
          
          <div className="space-y-24 relative">
            {activeStages.map((stage, stageIndex) => (
              <div key={stage.name} className="relative">
                <div className="flex items-start gap-12">
                  <div className="relative z-10">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500",
                      stageIndex === 0 ? "bg-indigo-600 text-white scale-110" : "bg-white dark:bg-zinc-900 text-zinc-400 border border-zinc-100 dark:border-zinc-800"
                    )}>
                      {stageIndex === 0 ? <GraduationCap size={24} /> : <Target size={24} />}
                    </div>
                  </div>
                  
                  <div className="flex-1 pt-1">
                    <div className="mb-8">
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Stage {stageIndex + 1}</span>
                      <h3 className="text-4xl font-black tracking-tighter dark:text-white mt-1">{stage.name}</h3>
                      <p className="text-zinc-500 mt-2 max-w-xl font-medium">{stage.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {stage.phases.map((phase: any) => (
                        <div key={phase.name} className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                          <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">{phase.name}</h4>
                          <div className="space-y-3">
                            {phase.levels.map((level: any) => {
                              const isCompleted = completedLevels.includes(level.id);
                              return (
                                <div key={level.id} className="flex items-center gap-3">
                                  {isCompleted ? (
                                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                                  ) : (
                                    <Circle size={18} className="text-zinc-300 dark:text-zinc-700 shrink-0" />
                                  )}
                                  <span className={cn(
                                    "text-sm font-bold tracking-tight",
                                    isCompleted ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400"
                                  )}>
                                    {level.title}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
