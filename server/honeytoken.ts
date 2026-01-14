import fs from 'fs';
import path from 'path';
import os from 'os';
import { storage } from './storage';
import { ZKPSovereign } from './zkp_sovereign';

export class HoneytokenTrap {
  private trapDir: string;
  private decoys: { name: string; content: string }[];
  private watchers: fs.FSWatcher[] = [];

  constructor() {
    this.trapDir = path.join(os.tmpdir(), 'secure_traps');
    this.decoys = [
      {
        name: 'sensitive_contacts.vcf',
        content: 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe (Confidential)\nTEL:+123456789\nEND:VCARD'
      },
      {
        name: 'private_keys.txt',
        content: '-----BEGIN RSA PRIVATE KEY-----\nMIICXAIBAAKBgQCqGKukO1De7zhZj6...\n-----END RSA PRIVATE KEY-----'
      }
    ];
  }

  public async deploy() {
    try {
      if (!fs.existsSync(this.trapDir)) {
        fs.mkdirSync(this.trapDir, { recursive: true });
      }

      for (const decoy of this.decoys) {
        const filePath = path.join(this.trapDir, decoy.name);
        fs.writeFileSync(filePath, decoy.content);
        this.monitor(filePath);
      }
      console.log(`[Honeytoken] Traps deployed in ${this.trapDir}`);
    } catch (error) {
      console.error('[Honeytoken] Deployment failed:', error);
    }
  }

  private monitor(filePath: string) {
    const watcher = fs.watch(filePath, async (eventType) => {
      // Monitor both 'change' and 'rename' (which happens on some systems for access)
      // Note: fs.watch is platform dependent, but 'change' is standard for writes.
      // Detecting pure reads is harder with fs.watch alone, but we'll flag any interaction.
      await this.triggerAlert(filePath, eventType);
    });
    this.watchers.push(watcher);
  }

  private async triggerAlert(filePath: string, eventType: string) {
    const fileName = path.basename(filePath);
    console.warn(`[SECURITY ALERT] Honeytoken access detected: ${fileName} (${eventType})`);
    
    try {
      // Generate a ZKP commitment for the file access event
      const contentHash = ZKPSovereign.generateContentCommitment(`${fileName}-${eventType}-${Date.now()}`);

      await storage.createSecurityEvent({
        type: 'HONEYTOKEN_TRIGGER',
        severity: 'HIGH',
        message: 'ALERTA DE SEGURIDAD: Intento de exfiltración de datos detectado mediante Honeytoken Trap',
        metadata: {
          file: fileName,
          eventType,
          contentHash,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('[Honeytoken] Failed to log alert:', error);
    }
  }

  public cleanup() {
    this.watchers.forEach(w => w.close());
    if (fs.existsSync(this.trapDir)) {
      fs.rmSync(this.trapDir, { recursive: true, force: true });
    }
  }
}

export const honeytokenTrap = new HoneytokenTrap();
