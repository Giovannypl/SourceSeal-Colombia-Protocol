import { useState } from "react";
import { useCreateSeal } from "@/hooks/use-seals";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus, Shield } from "lucide-react";
import * as React from "react";

export function CreateSealDialog() {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateSeal();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    contentId: "",
    wallet: "",
    secret: "",
    consentGiven: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consentGiven) {
      toast({
        title: "Consent Required",
        description: "You must consent to data processing under Law 1978.",
        variant: "destructive",
      });
      return;
    }

    mutate({
      contentId: formData.contentId,
      wallet: formData.wallet,
      secret: Number(formData.secret),
      consentGiven: formData.consentGiven
    }, {
      onSuccess: () => {
        setOpen(false);
        setFormData({ contentId: "", wallet: "", secret: "", consentGiven: true });
        toast({
          title: "Seal Generated",
          description: "Content has been cryptographically sealed and logged.",
        });
      },
      onError: (err) => {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-display font-bold tracking-wide bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(0,255,255,0.3)]">
          <Plus className="w-4 h-4 mr-2" />
          NEW SEAL
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card/95 border-primary/20 backdrop-blur-xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-display text-primary">
            <Shield className="w-6 h-6" />
            GENERATE SOURCE SEAL
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="contentId" className="font-mono text-xs uppercase text-muted-foreground">Content ID / URI</Label>
            <Input
              id="contentId"
              value={formData.contentId}
              onChange={(e) => setFormData({ ...formData, contentId: e.target.value })}
              className="font-mono bg-background/50 border-primary/20 focus:border-primary/60"
              placeholder="post_x892_election_2026"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wallet" className="font-mono text-xs uppercase text-muted-foreground">Wallet Address</Label>
            <Input
              id="wallet"
              value={formData.wallet}
              onChange={(e) => setFormData({ ...formData, wallet: e.target.value })}
              className="font-mono bg-background/50 border-primary/20 focus:border-primary/60"
              placeholder="0x..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="secret" className="font-mono text-xs uppercase text-muted-foreground">ZKP Secret (Numeric)</Label>
            <Input
              id="secret"
              type="number"
              value={formData.secret}
              onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
              className="font-mono bg-background/50 border-primary/20 focus:border-primary/60"
              placeholder="42"
              required
            />
            <p className="text-[10px] text-primary/70 font-mono">*Used to generate Zero-Knowledge Proof commitment. Never stored raw.</p>
          </div>

          <div className="flex items-start space-x-3 p-4 border border-primary/10 bg-primary/5 rounded-sm">
            <Checkbox
              id="consent"
              checked={formData.consentGiven}
              onCheckedChange={(c) => setFormData({ ...formData, consentGiven: c === true })}
              className="mt-1 border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="consent"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Accept Legal Protocols
              </label>
              <p className="text-xs text-muted-foreground">
                I consent to data processing under Law 1978 (Arts 6, 10, 13) for content accountability.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button 
              type="submit" 
              disabled={isPending}
              className="w-full font-display font-bold bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  GENERATING PROOFS...
                </>
              ) : (
                "CREATE IMMUTABLE SEAL"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
