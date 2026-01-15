import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import * as React from "react";

interface CyberCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  variant?: "default" | "alert" | "success";
}

export function CyberCard({ children, className, title, variant = "default" }: CyberCardProps) {
  const borderColors = {
    default: "border-primary/30 hover:border-primary/60",
    alert: "border-destructive/50 hover:border-destructive",
    success: "border-green-500/50 hover:border-green-500",
  };

  const glowColors = {
    default: "shadow-[0_0_15px_-5px_rgba(0,255,255,0.1)]",
    alert: "shadow-[0_0_15px_-5px_rgba(255,0,0,0.2)]",
    success: "shadow-[0_0_15px_-5px_rgba(0,255,0,0.2)]",
  };

  const cornerColors = {
    default: "border-primary",
    alert: "border-destructive",
    success: "border-green-500",
  };

  return (
    <div className={cn(
      "relative bg-card/80 backdrop-blur-md border transition-all duration-300 group",
      borderColors[variant],
      glowColors[variant],
      className
    )}>
      {/* Decorative corners */}
      <div className={cn("absolute -top-[1px] -left-[1px] w-2 h-2 border-t-2 border-l-2 transition-colors", cornerColors[variant])} />
      <div className={cn("absolute -top-[1px] -right-[1px] w-2 h-2 border-t-2 border-r-2 transition-colors", cornerColors[variant])} />
      <div className={cn("absolute -bottom-[1px] -left-[1px] w-2 h-2 border-b-2 border-l-2 transition-colors", cornerColors[variant])} />
      <div className={cn("absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b-2 border-r-2 transition-colors", cornerColors[variant])} />

      {/* Header if title exists */}
      {title && (
        <div className="px-6 py-3 border-b border-border/50 flex items-center justify-between">
          <h3 className="font-display font-bold text-lg tracking-wider text-foreground/90 uppercase truncate">
            {title}
          </h3>
          <div className="flex gap-1">
             <div className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-primary/50 transition-colors" />
             <div className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-primary/70 transition-colors" />
             <div className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-primary transition-colors" />
          </div>
        </div>
      )}

      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
