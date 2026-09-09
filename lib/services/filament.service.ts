import { eq, desc, and, ilike } from "drizzle-orm";
import { db } from "../db";
import { filaments } from "../db/schema";
import type { NewFilament } from "../db/schema";
import { ensureLabelExists } from "./label-option-service";

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

export class DuplicateFilamentError extends Error {
  constructor() {
    super("Filamento já cadastrado");
    this.name = "DuplicateFilamentError";
  }
}

export async function findDuplicateFilament(data: {
  brand: string;
  material: string;
  type: string;
  color: string;
}) {
  const [existing] = await db
    .select({ id: filaments.id })
    .from(filaments)
    .where(
      and(
        ilike(filaments.brand, data.brand),
        ilike(filaments.material, data.material),
        ilike(filaments.type, data.type),
        ilike(filaments.color, data.color),
      ),
    )
    .limit(1);

  return existing ?? null;
}

export async function createFilament(data: NewFilament) {
  await ensureLabelExists("brand", data.brand);
  await ensureLabelExists("material", data.material);
  await ensureLabelExists("type", data.type);
  await ensureLabelExists("color", data.color);

  const duplicate = await findDuplicateFilament(data);
  if (duplicate) {
    throw new DuplicateFilamentError();
  }

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
