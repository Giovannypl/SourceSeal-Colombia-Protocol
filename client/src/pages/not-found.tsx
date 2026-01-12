import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="relative">
        <div className="absolute inset-0 bg-destructive/20 blur-3xl rounded-full" />
        <AlertTriangle className="w-24 h-24 text-destructive mb-8 relative z-10" />
      </div>
      
      <h1 className="text-6xl font-display font-black text-foreground mb-4 tracking-tighter">404</h1>
      <p className="text-xl font-mono text-muted-foreground mb-8 text-center max-w-md">
        The requested resource protocol could not be resolved.
      </p>

      <Link href="/">
        <button className="px-8 py-3 bg-primary text-primary-foreground font-display font-bold tracking-wide hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,255,255,0.4)]">
          RETURN TO DASHBOARD
        </button>
      </Link>
    </div>
  );
}
