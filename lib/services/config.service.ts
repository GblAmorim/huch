import { db } from "../db";
import { config } from "../db/schema";
import { eq } from "drizzle-orm";
import type { ConfigInput } from "../schemas";

export async function getConfig() {
  const rows = await db.select().from(config).limit(1);
  return rows[0] ?? null;
}

export async function upsertConfig(data: ConfigInput) {
  const existing = await getConfig();

  if (existing) {
    const [updated] = await db
      .update(config)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(config.id, existing.id))
      .returning();
    return updated;
  }

  const [created] = await db.insert(config).values(data).returning();
  return created;
}
