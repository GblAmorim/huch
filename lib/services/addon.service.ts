import { eq, desc } from "drizzle-orm";
import { db } from "../db";
import { addons } from "../db/schema";
import type { NewAddon } from "../db/schema";
import { computeAddonCosts } from "../utils/addon-costs";

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
  // 1. Calcula os derivados (servidor é a fonte da verdade)
  const costs = computeAddonCosts({
    purchasePrice: data.purchasePrice,
    packageQuantity: data.packageQuantity,
    containedAmount: data.containedAmount,
    containedUnit: data.containedUnit,
    consumptionType: data.consumptionType,
    consumptionUnit: data.consumptionUnit,
    quantityUsed: data.quantityUsed,
    wastePercentage: data.wastePercentage,
    isPerOrder: data.isPerOrder,
  });

  // 2. Estoque: soma o conteúdo comprado ao estoque existente
  const bought = costs.totalContainedAmount;
  const stockQuantity = data.stockQuantity
    ? data.stockQuantity + bought
    : bought;

  // 3. Persiste
  const [created] = await db
    .insert(addons)
    .values({
      ...data,
      purchaseUrl: data.purchaseUrl ?? "",
      note: data.note ?? "",
      costPerUnit: costs.costPerUnit,
      estimatedCostPerProduct: costs.estimatedCostPerProduct,
      stockQuantity,
    })
    .returning();

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
