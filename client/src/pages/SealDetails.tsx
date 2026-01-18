import { useRoute } from "wouter";
import { useSeal, useCreateReport, useSimulateEnforcement } from "@/hooks/use-seals";
import { CyberCard } from "@/components/CyberCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Loader2, ShieldAlert, ArrowLeft, Terminal, Copy, CheckCircle2, Gavel } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SealDetails() {
  const [, params] = useRoute("/seal/:id");
  const id = Number(params?.id);
  const { data: seal, isLoading } = useSeal(id);
  
  // Back navigation helper
  const goBack = () => window.history.back();

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
        <p className="font-mono text-primary animate-pulse">DECRYPTING SEAL METADATA...</p>
      </div>
    </div>
  );

  if (!seal) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
       <div className="text-center space-y-4">
         <h1 className="text-4xl font-display font-bold text-destructive">404</h1>
         <p className="font-mono text-muted-foreground">SEAL NOT FOUND IN LEDGER</p>
         <Button onClick={goBack} variant="outline">RETURN TO BASE</Button>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-20 bg-background">
      <header className="border-b border-border/40 bg-card/30 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={goBack} className="text-muted-foreground hover:text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-lg tracking-wide">SEAL DETAILS: <span className="text-primary">{seal.contentId}</span></h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Status Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-card border border-border rounded-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-display font-bold">{seal.contentId}</h2>
              {seal.enforcements.length > 0 ? (
                 <StatusBadge level={seal.enforcements[0].level} />
              ) : (
                 <StatusBadge level={0} />
              )}
            </div>
            <p className="font-mono text-sm text-muted-foreground">
              CREATED: {new Date(seal.createdAt!).toLocaleString()}
            </p>
          </div>
          
          <div className="relative flex gap-3">
             <ReportDialog sealId={id} />
             <EnforcementDialog sealId={id} currentLevel={seal.enforcements.length > 0 ? seal.enforcements[0].level : 0} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Metadata Column */}
          <div className="md:col-span-2 space-y-8">
            {/* Blockchain Proof */}
            <CyberCard title="CRYPTOGRAPHIC PROOF" className="font-mono">
              <div className="space-y-6">
                 <div className="space-y-2">
                   <label className="text-xs uppercase text-muted-foreground">Wallet Authority</label>
                   <div className="p-3 bg-black/40 border border-primary/10 rounded flex items-center justify-between group">
                     <span className="text-sm truncate text-primary/90">{seal.wallet}</span>
                     <Copy className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-white" />
                   </div>
                 </div>

                 <div className="space-y-2">
                   <label className="text-xs uppercase text-muted-foreground">ZKP Commitment</label>
                   <div className="p-3 bg-black/40 border border-primary/10 rounded break-all text-xs text-muted-foreground">
                     {seal.zkpCommitment}
                   </div>
                 </div>

                 <div className="space-y-2">
                   <label className="text-xs uppercase text-muted-foreground">Immutable Hash</label>
                   <div className="p-3 bg-black/40 border border-primary/10 rounded break-all text-xs text-muted-foreground">
                     {seal.sealHash}
                   </div>
                 </div>
              </div>
            </CyberCard>

            {/* Legal Metadata */}
            <CyberCard title="LEGAL METADATA (JSON)">
              <div className="relative">
                <div className="absolute top-2 right-2 flex gap-1">
                   <div className="w-2 h-2 rounded-full bg-red-500/50" />
                   <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                   <div className="w-2 h-2 rounded-full bg-green-500/50" />
                </div>
                <pre className="p-4 bg-black/60 rounded border border-white/5 overflow-x-auto text-xs font-mono text-green-400/90 leading-relaxed">
                  {JSON.stringify(seal.metadata, null, 2)}
                </pre>
              </div>
            </CyberCard>
          </div>

          {/* Activity Column */}
          <div className="space-y-8">
            {/* Reports Section */}
            <CyberCard title="CITIZEN REPORTS" variant={seal.reports.length > 0 ? "alert" : "default"}>
               {seal.reports.length === 0 ? (
                 <div className="text-center py-8 text-muted-foreground font-mono text-sm">
                   <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500/50" />
                   NO REPORTS FILED
                 </div>
               ) : (
                 <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                   {seal.reports.map(report => (
                     <div key={report.id} className="p-3 bg-destructive/5 border border-destructive/20 rounded space-y-2">
                       <div className="flex justify-between text-[10px] text-destructive uppercase font-bold">
                         <span>REPORT #{report.id}</span>
                         <span>{new Date(report.createdAt!).toLocaleDateString()}</span>
                       </div>
                       <p className="text-xs text-foreground/80 font-mono">
                         "{report.description}"
                       </p>
                     </div>
                   ))}
                 </div>
               )}
            </CyberCard>

            {/* Enforcements Section */}
            <CyberCard title="ENFORCEMENT CHAIN" variant={seal.enforcements.length > 0 ? "alert" : "default"}>
               {seal.enforcements.length === 0 ? (
                 <div className="text-center py-8 text-muted-foreground font-mono text-sm">
                   NO ACTIVE ACTIONS
                 </div>
               ) : (
                 <div className="space-y-4">
                   {seal.enforcements.map(enforcement => (
                     <div key={enforcement.id} className="relative p-4 border border-destructive bg-destructive/10 rounded overflow-hidden">
                       <div className="absolute -right-4 -top-4 text-destructive/10">
                         <Gavel className="w-24 h-24 rotate-12" />
                       </div>
                       <div className="relative z-10 space-y-2">
                         <div className="flex items-center gap-2">
                           <StatusBadge level={enforcement.level} />
                         </div>
                         <h4 className="font-bold text-sm text-destructive uppercase">
                           {enforcement.action}
                         </h4>
                         <div className="text-xs font-mono text-muted-foreground pt-2 border-t border-destructive/20 mt-2">
                           AUTHORITY: {enforcement.authority}
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
            </CyberCard>
          </div>
        </div>
      </main>
    </div>
  );
}

// -----------------------------------------------------------------------------
// SUB-COMPONENTS (Dialogs)
// -----------------------------------------------------------------------------

function ReportDialog({ sealId }: { sealId: number }) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateReport();
  const { toast } = useToast();
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ sealId, description, reporterId: "anon_" + Math.random().toString(36).substr(2, 5) }, {
      onSuccess: () => {
        setOpen(false);
        setDescription("");
        toast({ title: "Report Submitted", description: "The report has been logged for review." });
      },
      onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" })
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive">
          <ShieldAlert className="w-4 h-4 mr-2" />
          REPORT
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card/95 border-destructive/30 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-destructive font-display tracking-wide flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" />
            FILE CITIZEN REPORT
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive font-mono">
            WARNING: False reporting is punishable under Law 1978 Art 20.
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description of Violation</label>
            <div className="flex gap-2 mb-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="text-[10px] h-7 border-red-500/30 text-red-400 hover:bg-red-500/10"
                onClick={() => setDescription("Contenido íntimo generado por IA sin consentimiento (LEY 1978)")}
              >
                LEY 1978 AI VIOLATION
              </Button>
            </div>
            <Textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the harmful content or violation..."
              className="bg-background/50 border-destructive/20 focus:border-destructive/50 min-h-[100px]"
              required
            />
          </div>
          <Button type="submit" variant="destructive" className="w-full font-bold" disabled={isPending}>
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "SUBMIT REPORT"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EnforcementDialog({ sealId, currentLevel }: { sealId: number, currentLevel: number }) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useSimulateEnforcement();
  const { toast } = useToast();
  const [financialUsd, setFinancialUsd] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ sealId, financialUsd: Number(financialUsd) }, {
      onSuccess: (data) => {
        setOpen(false);
        setFinancialUsd("");
        // @ts-ignore - handling backend response shape
        const msg = data.message || `Enforcement Level ${data.level} Activated`;
        toast({ title: "Simulation Complete", description: msg });
      },
      onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" })
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
          <Terminal className="w-4 h-4 mr-2" />
          SIMULATE
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card/95 border-primary/30 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-primary font-display tracking-wide flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            ENFORCEMENT SIMULATOR
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="p-3 bg-primary/10 border border-primary/20 rounded text-xs font-mono">
            Simulate financial flow or damage metrics to trigger automatic enforcement thresholds.
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Enforcement Level</label>
            <div className="w-full bg-background/50 p-2 rounded border border-border">
               <StatusBadge level={currentLevel} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Simulated Financial Flow (USD)</label>
            <Input 
              type="number"
              value={financialUsd}
              onChange={(e) => setFinancialUsd(e.target.value)}
              placeholder="e.g. 5000"
              className="bg-background/50 border-primary/20 font-mono"
              required
            />
            <p className="text-[10px] text-muted-foreground font-mono">
              Thresholds: &gt;$5,000 (Level 2), &gt;$10,000 (Level 3)
            </p>
          </div>

          <Button type="submit" className="w-full font-bold bg-primary text-primary-foreground hover:bg-primary/90" disabled={isPending}>
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "RUN SIMULATION"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
