import { db } from "../db";
import { pricingRecords } from "../db/schema";
import { desc } from "drizzle-orm";
import type { NewPricingRecord } from "../db/schema";

export async function getAllRecords() {
  return db
    .select()
    .from(pricingRecords)
    .orderBy(desc(pricingRecords.createdAt));
}

export async function createRecord(data: NewPricingRecord) {
  const [record] = await db.insert(pricingRecords).values(data).returning();
  return record;
}
