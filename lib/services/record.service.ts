import { eq, desc } from "drizzle-orm";
import { db } from "../db";
import { pricingRecords } from "../db/schema";
import type { NewPricingRecord } from "../db/schema";

export async function getAllRecords() {
  return db
    .select()
    .from(pricingRecords)
    .orderBy(desc(pricingRecords.createdAt));
}

export async function getRecordById(id: string) {
  const [record] = await db
    .select()
    .from(pricingRecords)
    .where(eq(pricingRecords.id, id));
  return record ?? null;
}

export async function createRecord(data: NewPricingRecord) {
  const [record] = await db.insert(pricingRecords).values(data).returning();
  return record;
}
