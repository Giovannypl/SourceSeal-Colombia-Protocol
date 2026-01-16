
import { db } from "./db";
import {
  seals, reports, enforcements, securityEvents,
  type Seal,
  type InsertReport, type Report,
  type Enforcement, type SecurityEvent, type InsertSecurityEvent
} from "../shared/schema";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  // Seals
  createSeal(seal: Omit<Seal, "id" | "createdAt">): Promise<Seal>;
  getSeals(): Promise<(Seal & { reportCount: number; enforcementLevel: number })[]>;
  getSeal(id: number): Promise<Seal | undefined>;
  
  // Reports
  createReport(report: InsertReport): Promise<Report>;
  getReportsBySealId(sealId: number): Promise<Report[]>;
  getReportCount(sealId: number): Promise<number>;

  // Enforcements
  createEnforcement(enforcement: Omit<Enforcement, "id" | "createdAt">): Promise<Enforcement>;
  getEnforcementsBySealId(sealId: number): Promise<Enforcement[]>;
  getLatestEnforcement(sealId: number): Promise<Enforcement | undefined>;
  getSealByZkp(zkp: string): Promise<Seal | undefined>;
  stopAllEnforcements(): Promise<void>;

  // Security Events
  createSecurityEvent(event: InsertSecurityEvent): Promise<SecurityEvent>;
}

export class DatabaseStorage implements IStorage {
  async createSeal(sealData: Omit<Seal, "id" | "createdAt">): Promise<Seal> {
    const [seal] = await db.insert(seals).values(sealData).returning();
    return seal;
  }

  async getSeals(): Promise<(Seal & { reportCount: number; enforcementLevel: number })[]> {
    const allSeals = await db.select().from(seals);
    
    // Enrich with computed data (inefficient for large datasets, but fine for MVP)
    const results = await Promise.all(allSeals.map(async (seal) => {
      const reportCount = await this.getReportCount(seal.id);
      const latestEnforcement = await this.getLatestEnforcement(seal.id);
      return {
        ...seal,
        reportCount,
        enforcementLevel: latestEnforcement ? latestEnforcement.level : 0,
      };
    }));
    
    return results;
  }

  async getSeal(id: number): Promise<Seal | undefined> {
    const [seal] = await db.select().from(seals).where(eq(seals.id, id));
    return seal;
  }

  async getSealByZkp(zkp: string): Promise<Seal | undefined> {
    const [seal] = await db.select().from(seals).where(eq(seals.zkpCommitment, zkp));
    return seal;
  }

  async createReport(report: InsertReport): Promise<Report> {
    const [newReport] = await db.insert(reports).values(report).returning();
    return newReport;
  }

  async getReportsBySealId(sealId: number): Promise<Report[]> {
    return await db.select().from(reports).where(eq(reports.sealId, sealId));
  }

  async getReportCount(sealId: number): Promise<number> {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(reports)
      .where(eq(reports.sealId, sealId));
    return Number(result.count);
  }

  async createEnforcement(enforcement: Omit<Enforcement, "id" | "createdAt">): Promise<Enforcement> {
    const [newEnforcement] = await db.insert(enforcements).values(enforcement).returning();
    return newEnforcement;
  }

  async getEnforcementsBySealId(sealId: number): Promise<Enforcement[]> {
    return await db.select().from(enforcements).where(eq(enforcements.sealId, sealId));
  }

  async getLatestEnforcement(sealId: number): Promise<Enforcement | undefined> {
    const [latest] = await db
      .select()
      .from(enforcements)
      .where(eq(enforcements.sealId, sealId))
      .orderBy(sql`${enforcements.createdAt} DESC`)
      .limit(1);
    return latest;
  }

  async stopAllEnforcements(): Promise<void> {
    await db.delete(enforcements);
    await db.delete(reports);
  }

  async createSecurityEvent(event: InsertSecurityEvent): Promise<SecurityEvent> {
    const [newEvent] = await db.insert(securityEvents).values(event).returning();
    return newEvent;
  }
}

export const storage = new DatabaseStorage();
