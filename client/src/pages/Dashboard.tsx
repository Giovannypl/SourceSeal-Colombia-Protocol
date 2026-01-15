import { Link } from "wouter";
import { useSeals } from "@/hooks/use-seals";
import { CyberCard } from "@/components/CyberCard";
import { CreateSealDialog } from "@/components/CreateSealDialog";
import { StatusBadge } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, ArrowRight, ShieldCheck, Database, FileCode } from "lucide-react";
import { useState } from "react";
import * as React from "react";

export default function Dashboard() {
  const { data: seals, isLoading, error } = useSeals();
  const [search, setSearch] = useState("");

  const filteredSeals = seals?.filter(seal => 
    seal.contentId.toLowerCase().includes(search.toLowerCase()) || 
    seal.wallet.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20">
      {/* Header / Hero Section */}
      <header className="border-b border-border/40 bg-card/30 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 border border-primary/50 flex items-center justify-center rounded-sm">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-display font-black tracking-widest text-foreground">
                SOURCE<span className="text-primary">SEAL</span>
              </h1>
              <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
                Protocol v1.2 // Law 1978
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <Button 
               variant="outline" 
               size="sm" 
               className="font-mono text-xs border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground"
               onClick={() => {
                 if (confirm("¿Estás seguro de que quieres detener todas las acciones de cumplimiento?")) {
                   import("@/lib/queryClient").then(({ apiRequest, queryClient }) => {
                     apiRequest("POST", "/api/enforcement/stop-all").then(() => {
                       queryClient.invalidateQueries({ queryKey: ["/api/seals"] });
                     });
                   });
                 }
               }}
               data-testid="button-stop-all"
             >
               DETENER TODO
             </Button>
             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-background/50 border border-primary/20 rounded-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-mono text-primary/80">SYSTEM ONLINE</span>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Stats / Intro */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CyberCard className="bg-gradient-to-br from-card to-card/50">
             <div className="flex items-start justify-between mb-4">
               <div className="p-2 bg-primary/10 rounded-sm border border-primary/20">
                 <ShieldCheck className="w-6 h-6 text-primary" />
               </div>
               <span className="text-4xl font-display font-bold text-foreground">
                 {isLoading ? "-" : seals?.length}
               </span>
             </div>
             <h3 className="font-mono text-sm text-muted-foreground uppercase tracking-wider">Active Seals</h3>
          </CyberCard>

          <CyberCard className="bg-gradient-to-br from-card to-card/50">
             <div className="flex items-start justify-between mb-4">
               <div className="p-2 bg-destructive/10 rounded-sm border border-destructive/20">
                 <FileCode className="w-6 h-6 text-destructive" />
               </div>
               <span className="text-4xl font-display font-bold text-foreground">
                 {isLoading ? "-" : seals?.filter(s => s.enforcementLevel > 0).length}
               </span>
             </div>
             <h3 className="font-mono text-sm text-muted-foreground uppercase tracking-wider">Enforcement Actions</h3>
          </CyberCard>
          
          <CyberCard className="bg-gradient-to-br from-card to-card/50 flex flex-col justify-center items-center text-center space-y-4">
             <h3 className="font-display font-bold text-lg">NEW CONTENT REGISTRATION</h3>
             <CreateSealDialog />
          </CyberCard>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="SEARCH BY CONTENT ID OR WALLET..." 
              className="pl-10 font-mono text-sm bg-card border-primary/20 focus:border-primary/60 h-12 uppercase"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {/* Filter buttons could go here */}
          </div>
        </div>

        {/* Main List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-4">
            <h2 className="text-lg font-display font-bold text-primary flex items-center gap-2">
              <Database className="w-5 h-5" />
              REGISTRY
            </h2>
            <span className="text-xs font-mono text-muted-foreground">
              SHOWING {filteredSeals?.length || 0} RECORDS
            </span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="p-10 text-center border border-destructive/30 bg-destructive/5 rounded-lg text-destructive">
              Error loading registry. System offline.
            </div>
          ) : filteredSeals?.length === 0 ? (
            <div className="p-20 text-center border border-dashed border-border rounded-lg text-muted-foreground font-mono">
              NO RECORDS FOUND IN DATABASE
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredSeals?.map((seal) => (
                <Link key={seal.id} href={`/seal/${seal.id}`} className="block">
                  <div className="group relative bg-card border border-border hover:border-primary/50 transition-all duration-200 p-4 sm:px-6 sm:py-5 cursor-pointer hover:shadow-[0_0_20px_-10px_rgba(0,255,255,0.3)]">
                    {/* Hover indicator */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-bottom" />
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                            {seal.contentId}
                          </h3>
                          <StatusBadge level={seal.enforcementLevel} />
                        </div>
                        <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                           <span className="flex items-center gap-1">
                             ID: <span className="text-foreground">{seal.id}</span>
                           </span>
                           <span className="hidden sm:inline">|</span>
                           <span className="truncate max-w-[200px] sm:max-w-none">
                             WALLET: {seal.wallet}
                           </span>
                           <span className="hidden sm:inline">|</span>
                           <span>
                             {new Date(seal.createdAt!).toLocaleDateString()}
                           </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 md:pl-10">
                        {seal.reportCount > 0 && (
                          <div className="text-xs font-mono font-bold text-destructive flex items-center gap-1">
                             <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                             {seal.reportCount} REPORTS
                          </div>
                        )}
                        <Button size="sm" variant="outline" className="font-mono text-xs border-primary/30 group-hover:bg-primary group-hover:text-primary-foreground">
                          VIEW DETAILS <ArrowRight className="w-3 h-3 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
