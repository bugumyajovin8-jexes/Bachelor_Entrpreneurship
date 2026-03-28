import React from 'react';
import { motion, useTransform, MotionValue } from 'motion/react';
import { MapPin, CheckCircle2, Lock } from 'lucide-react';
import { cn } from '../lib/utils';

interface RailwayMilestoneProps {
  level: any;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  zPos: number;
  yPos: number;
  isCompleted: boolean;
}

export const RailwayMilestone: React.FC<RailwayMilestoneProps> = ({ level, index, total, scrollYProgress, zPos, yPos, isCompleted }) => {
  const start = Math.max(0, index / total - 0.1);
  const middle = Math.max(0, Math.min(1, index / total));
  const end = Math.min(1, index / total + 0.1);

  // Ensure they are monotonically increasing
  const inputRange = [
    start,
    Math.max(start, middle),
    Math.max(Math.max(start, middle), end)
  ];

  const opacity = useTransform(
    scrollYProgress, 
    inputRange, 
    [1, 1, 0]
  );
  const scale = useTransform(
    scrollYProgress, 
    inputRange, 
    [0.5, 1, 0.5]
  );

  return (
    <motion.div
      style={{ 
        z: zPos,
        y: yPos,
        scale,
        opacity
      }}
      className="absolute w-full max-w-md p-6 rounded-3xl border backdrop-blur-md bg-zinc-900/80 border-zinc-800 shadow-2xl"
    >
      <div className="flex items-center gap-3 mb-2">
        <MapPin className={cn(isCompleted ? "text-emerald-400" : "text-zinc-600")} size={20} />
        <span className="text-xs font-black uppercase tracking-widest text-zinc-400">{level.id}</span>
      </div>
      <h3 className="text-lg font-black tracking-tight mb-1">{level.title}</h3>
      <p className="text-sm text-zinc-300">{level.achievement}</p>
      
      <div className={cn(
        "absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-4 border-zinc-950 flex items-center justify-center z-10",
        isCompleted ? "bg-emerald-500" : "bg-zinc-700"
      )}>
        {isCompleted ? <CheckCircle2 className="text-white" size={16} /> : <Lock className="text-zinc-950" size={12} />}
      </div>
    </motion.div>
  );
};
