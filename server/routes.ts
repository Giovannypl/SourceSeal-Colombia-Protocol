
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import crypto from "crypto";
import { db } from "./db";
import { securityEvents } from "@shared/schema";
import { sql } from "drizzle-orm";
import { ZKPSovereign } from "./zkp_sovereign";

// --- LOGIC FROM PYTHON SOURCE ---

const ETHICAL_SHARD_CONFIG = {
  SHARD_ID: "ETHIC_AI_FILTER_COL_01",
  ZKP_COMMITMENT: "238", // Tu compromiso maestro de integridad
  LEGAL_BASE: "LEY_1978_COL"
};

// Constants
const UMBRALES_DANO = {
  nivel1: 3,      // Reduced for demo (Original: 100)
  nivel2: 5000,   // USD
  nivel3: 10000   // USD
};

const LEY_1978 = {
  art6: "Protección datos personales",
  art10: "Responsabilidad proveedor",
  art13: "Consentimiento expreso",
  art20: "Sanciones por infracciones TIC"
};

// BigInt literals are not available when targeting lower than ES2020.
const ZKP_P = BigInt(509);
const ZKP_G = BigInt(5);

function generarZKP(secret: number): string {
  // commitment = (g ^ secret) % p
  const secretBI = BigInt(secret);
  // BigInt exponentiation - using a simple loop for compatibility if needed, 
  // but BigInt support usually includes ** if BigInt itself is supported.
  const commitment = (ZKP_G ** secretBI) % ZKP_P;
  return commitment.toString();
}

function hashMetadata(metadata: object): string {
  return crypto.createHash('sha256').update(JSON.stringify(metadata)).digest('hex');
}

// Enforcement Logic
async function evaluateDamage(sealId: number, financialUsd: number = 0) {
  const reportCount = await storage.getReportCount(sealId);
  const currentEnforcements = await storage.getLatestEnforcement(sealId);
  const currentLevel = currentEnforcements?.level || 0;

  let newLevel = 0;
  let action = "";
  let authority = "";

  // Check Level 2 & 3 (Financial)
  if (financialUsd >= UMBRALES_DANO.nivel3) {
    newLevel = 3;
    action = "Sanción económica + bloqueo de cuentas";
    authority = "Fiscalía General";
  } else if (financialUsd >= UMBRALES_DANO.nivel2) {
    newLevel = 2;
    action = "Investigación fiscalía + solicitud datos judicial";
    authority = "Fiscalía Seccional";
  }
  
  // Check Level 1 (Reports) - Only if not already at higher level by finance
  if (newLevel < 1 && reportCount >= UMBRALES_DANO.nivel1) {
    newLevel = 1;
    action = "Revisión por comité ético digital";
    authority = "Comité Ético Digital";
  }

  // Only trigger if new level is higher than current
  if (newLevel > currentLevel) {
    return await storage.createEnforcement({
      sealId,
      level: newLevel,
      action,
      authority,
      financialUsd,
      status: "active"
    });
  }
  
  return null;
}

// --- ROUTES ---

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Health check endpoint for Railway deployment
  app.get("/health", (_req, res) => {
    res.status(200).send("OK");
  });

  // Create Seal
  app.post(api.seals.create.path, async (req, res) => {
    try {
      const input = api.seals.create.input.parse(req.body);

      // 1. ZKP Generation
      const zkpCommitment = generarZKP(input.secret);

      // 2. Metadata Construction
      const timestamp = new Date().toISOString();
      const metadata = {
        contenido_id: input.contentId,
        wallet: input.wallet,
        timestamp: timestamp,
        ley: "1978-COL",
        articulos: ["6", "10", "13"],
        zkp_commitment: zkpCommitment
      };

      // 3. Blockchain Seal (Hash)
      const sealHash = hashMetadata(metadata);

      // 4. Storage
      const seal = await storage.createSeal({
        contentId: input.contentId,
        wallet: input.wallet,
        consentGiven: input.consentGiven,
        zkpCommitment,
        sealHash,
        metadata
      });

      res.status(201).json(seal);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // List Seals
  app.get(api.seals.list.path, async (req, res) => {
    const seals = await storage.getSeals();
    res.json(seals);
  });

  // Get Seal Details
  app.get(api.seals.get.path, async (req, res) => {
    const id = Number(req.params.id);
    const seal = await storage.getSeal(id);
    if (!seal) return res.status(404).json({ message: "Seal not found" });

    const reports = await storage.getReportsBySealId(id);
    const enforcements = await storage.getEnforcementsBySealId(id);

    res.json({ ...seal, reports, enforcements });
  });

  // Create Report
  app.post(api.reports.create.path, async (req, res) => {
    try {
      const input = api.reports.create.input.parse(req.body);
      
      // Verify seal exists
      const seal = await storage.getSeal(input.sealId);
      if (!seal) return res.status(404).json({ message: "Target seal not found" });

      await storage.createReport(input);

      // Evaluate Logic (Trigger Enforcement?)
      const enforcement = await evaluateDamage(input.sealId);

      if (enforcement) {
        res.status(201).json(enforcement);
      } else {
        res.status(201).json({ message: "Report logged. No enforcement threshold reached yet." });
      }

    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Ethical Filter Module (Ley 1978)
  app.post(api.seals.ethicalFilter.path, async (req, res) => {
    try {
      const input = api.seals.ethicalFilter.input.parse(req.body);

      // 1. Validate ZKP Commitment 238 (or matching commitment)
      const seal = await storage.getSealByZkp(input.zkpCommitment);
      if (!seal) {
        return res.status(404).json({ message: "No se encontró un sello válido para este compromiso ZKP." });
      }

      // 2. Register Report
      await storage.createReport({
        sealId: seal.id,
        description: `[FILTRO ÉTICO LEY 1978] ${input.description}`,
        reporterId: "SISTEMA_ETICO_IA"
      });

      // 3. Trigger Enforcement Level 3 (Bloqueo Permanente)
      const enforcement = await storage.createEnforcement({
        sealId: seal.id,
        level: 3,
        action: "Sanción Económica + Bloqueo de Cuentas - LEY_1978_COL (Contenido Íntimo sin Consentimiento)",
        authority: "Fiscalía General",
        financialUsd: 0,
        status: "active"
      });

      res.status(201).json(enforcement);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Simulate Financial Event (For Demo)
  app.post(api.enforcement.simulate.path, async (req, res) => {
    try {
      const { sealId, financialUsd } = api.enforcement.simulate.input.parse(req.body);
      
      // Verify seal exists
      const seal = await storage.getSeal(sealId);
      if (!seal) return res.status(404).json({ message: "Seal not found" });

      const enforcement = await evaluateDamage(sealId, financialUsd);

      if (enforcement) {
        res.json(enforcement);
      } else {
        res.json({ message: `Financial event of $${financialUsd} recorded. No new enforcement triggered.` });
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // List Security Events
  app.get("/api/security-events", async (_req, res) => {
    try {
      const events = await db.select().from(securityEvents).orderBy(sql`${securityEvents.createdAt} DESC`);
      res.json(events);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // External Audit - Verify Integrity using ZKP
  app.post("/api/verify-integrity", async (req, res) => {
    try {
      const { proof, publicSignals } = req.body;

      if (!proof || !publicSignals) {
        return res.status(400).json({ message: "Proof and public signals are required for verification." });
      }

      // 1. Verify the cryptographic proof using ZKPSovereign
      const isValid = await ZKPSovereign.verifyIntegrity(proof, publicSignals);

      if (!isValid) {
        return res.status(401).json({ 
          verified: false, 
          message: "FALLO DE INTEGRIDAD: La prueba criptográfica no es válida." 
        });
      }

      // 2. Cross-reference public signal (content hash) with logged security events
      const contentHash = publicSignals[0];
      const [matchingEvent] = await db
        .select()
        .from(securityEvents)
        .where(sql`metadata->>'contentHash' = ${contentHash}`)
        .limit(1);

      res.json({
        verified: true,
        message: "INTEGRIDAD CONFIRMADA: La prueba ZKP es válida para el evento registrado.",
        eventDetected: !!matchingEvent,
        timestamp: new Date().toISOString()
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  return httpServer;
}
