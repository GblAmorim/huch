import { eq, desc } from "drizzle-orm";
import { db } from "../db";
import { addons } from "../db/schema";
import type { NewAddon } from "../db/schema";

export async function getAllAddons(activeOnly = false) {
  if (activeOnly) {
    return db
      .select()
      .from(addons)
      .where(eq(addons.active, true))
      .orderBy(desc(addons.createdAt));
  }
  return db.select().from(addons).orderBy(desc(addons.createdAt));
}

export async function createAddon(data: NewAddon) {
  const [created] = await db.insert(addons).values(data).returning();
  return created;
}

export async function updateAddon(id: string, data: Partial<NewAddon>) {
  const [updated] = await db
    .update(addons)
    .set(data)
    .where(eq(addons.id, id))
    .returning();
  return updated;
}

export async function deleteAddon(id: string) {
  await db.delete(addons).where(eq(addons.id, id));
}
