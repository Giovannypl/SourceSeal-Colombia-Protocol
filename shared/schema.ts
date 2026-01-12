
import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// --- TABLES ---

export const seals = pgTable("seals", {
  id: serial("id").primaryKey(),
  contentId: text("content_id").notNull(),
  wallet: text("wallet").notNull(),
  zkpCommitment: text("zkp_commitment").notNull(),
  sealHash: text("seal_hash").notNull(),
  metadata: jsonb("metadata").notNull(),
  consentGiven: boolean("consent_given").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  sealId: integer("seal_id").notNull(), // Foreign key logically
  reporterId: text("reporter_id"), // Optional anonymous ID
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const enforcements = pgTable("enforcements", {
  id: serial("id").primaryKey(),
  sealId: integer("seal_id").notNull(),
  level: integer("level").notNull(), // 1, 2, 3
  action: text("action").notNull(),
  authority: text("authority").notNull(),
  financialUsd: integer("financial_usd").default(0),
  status: text("status").default("active"), // active, closed
  createdAt: timestamp("created_at").defaultNow(),
});

// --- SCHEMAS ---

export const insertSealSchema = createInsertSchema(seals).omit({ 
  id: true, 
  sealHash: true, 
  zkpCommitment: true, // Generated on server
  metadata: true,      // Generated on server
  createdAt: true 
}).extend({
  secret: z.number().min(1, "Secret must be provided for ZKP"),
});

export const insertReportSchema = createInsertSchema(reports).omit({ 
  id: true, 
  createdAt: true 
});

// --- TYPES ---

export type Seal = typeof seals.$inferSelect;
export type InsertSeal = z.infer<typeof insertSealSchema>;

export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;

export type Enforcement = typeof enforcements.$inferSelect;

// --- API TYPES ---

export type CreateSealRequest = InsertSeal;

export type SealResponse = Seal & {
  reportCount: number;
  enforcementLevel: number;
};
