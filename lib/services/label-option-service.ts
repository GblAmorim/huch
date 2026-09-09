import { ilike } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  filamentBrands,
  filamentMaterials,
  filamentTypes,
  filamentColors,
} from "@/lib/db/schema";

const labelTables = {
  brand: filamentBrands,
  material: filamentMaterials,
  type: filamentTypes,
  color: filamentColors,
} as const;

export type LabelKind = keyof typeof labelTables;

export async function ensureLabelExists(
  kind: LabelKind,
  label: string,
): Promise<void> {
  const table = labelTables[kind];
  const trimmed = label.trim();
  if (!trimmed) return;

  const existing = await db
    .select({ id: table.id })
    .from(table)
    .where(ilike(table.label, trimmed))
    .limit(1);

  if (existing.length === 0) {
    await db
      .insert(table)
      .values({ label: trimmed, isCustom: true })
      .onConflictDoNothing();
  }
}
