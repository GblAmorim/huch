import { eq, desc } from "drizzle-orm";
import { db } from "../db";
import { filaments } from "../db/schema";
import type { NewFilament } from "../db/schema";

export async function getAllFilaments(activeOnly = false) {
  if (activeOnly) {
    return db
      .select()
      .from(filaments)
      .where(eq(filaments.active, true))
      .orderBy(desc(filaments.createdAt));
  }
  return db.select().from(filaments).orderBy(desc(filaments.createdAt));
}

export async function createFilament(data: NewFilament) {
  const [created] = await db.insert(filaments).values(data).returning();
  return created;
}

export async function updateFilament(id: string, data: Partial<NewFilament>) {
  const [updated] = await db
    .update(filaments)
    .set(data)
    .where(eq(filaments.id, id))
    .returning();
  return updated;
}

export async function deleteFilament(id: string) {
  await db.delete(filaments).where(eq(filaments.id, id));
}
