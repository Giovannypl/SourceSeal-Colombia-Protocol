import { cn } from "@/lib/utils";
import { AlertTriangle, ShieldCheck, Activity } from "lucide-react";

interface StatusBadgeProps {
  level: number;
}

export function StatusBadge({ level }: StatusBadgeProps) {
  if (level === 0) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-mono font-bold uppercase tracking-wider rounded-sm">
        <ShieldCheck className="w-3.5 h-3.5" />
        Verified
      </div>
    );
  }

  if (level === 1) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-mono font-bold uppercase tracking-wider rounded-sm">
        <Activity className="w-3.5 h-3.5" />
        Level 1 Alert
      </div>
    );
  }
  
  // Levels 2 and 3
  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1 border text-xs font-mono font-bold uppercase tracking-wider rounded-sm animate-pulse",
      level === 2 
        ? "bg-orange-500/10 border-orange-500/30 text-orange-400" 
        : "bg-red-500/10 border-red-500/30 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]"
    )}>
      <AlertTriangle className="w-3.5 h-3.5" />
      Level {level} Enforcement
    </div>
  );
}
