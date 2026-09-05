import { eq } from "drizzle-orm";
import { db } from "../db";
import { pricingBaseline } from "../db/schema";
import type { NewPricingBaseline, PricingBaseline as PricingBaselineRow } from "../db/schema";
import type { PricingBaseline, PaymentMethod } from "../types";

function toDomainBaseline(row: PricingBaselineRow): PricingBaseline {
  return {
    ...row,
    updatedAt: row.updatedAt.toISOString(),
    paymentFees: row.paymentFees as Record<PaymentMethod, number>,
  };
}

export async function getBaseline() {
  const rows = await db.select().from(pricingBaseline).limit(1);
  return rows[0] ? toDomainBaseline(rows[0]) : null;
}

export async function upsertBaseline(data: NewPricingBaseline) {
  const existing = await db.select().from(pricingBaseline).limit(1);
  const existingRow = existing[0] ?? null;

  if (existingRow) {
    const [updated] = await db
      .update(pricingBaseline)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(pricingBaseline.id, existingRow.id))
      .returning();
    return toDomainBaseline(updated);
  }

  const [created] = await db.insert(pricingBaseline).values(data).returning();
  return toDomainBaseline(created);
}
