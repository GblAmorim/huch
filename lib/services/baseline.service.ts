import { eq } from "drizzle-orm";
import { db } from "../db";
import { pricingBaseline } from "../db/schema";
import type {
  NewPricingBaseline,
  PricingBaseline as PricingBaselineRow,
} from "../db/schema";
import type {
  PricingBaseline,
  PaymentMethod,
  PrinterEquipment,
  ElectricityFlag,
  FixedCostItem,
  TaxItem,
} from "../types";

function toDomainBaseline(row: PricingBaselineRow): PricingBaseline {
  return {
    id: row.id,
    // 1. Impressora
    printerBrand: row.printerBrand,
    printerModel: row.printerModel,
    printerCost: row.printerCost,
    printerPowerWatts: row.printerPowerWatts,
    printerPowerAvgWatts: row.printerPowerAvgWatts,
    printerLifespanHours: row.printerLifespanHours,
    printerAddons: (row.printerAddons ?? []) as PrinterEquipment[],
    // 2. Energia
    electricityFlag: (row.electricityFlag ?? "green") as ElectricityFlag,
    electricityCostPerKwh: row.electricityCostPerKwh,
    // 3. Mão de obra
    laborCostPerHour: row.laborCostPerHour,
    modelingCostPerHour: row.modelingCostPerHour,
    assemblyCostPerHour: row.assemblyCostPerHour,
    finishingCostPerHour: row.finishingCostPerHour,
    // 4. Transporte
    hasOwnDelivery: row.hasOwnDelivery,
    fuelCostPerLiter: row.fuelCostPerLiter,
    vehicleConsumptionKmPerLiter: row.vehicleConsumptionKmPerLiter,
    kmPerDelivery: row.kmPerDelivery,
    deliveriesPerRoute: row.deliveriesPerRoute,
    extraCostPerKm: row.extraCostPerKm,
    packagingCostPerOrder: row.packagingCostPerOrder,
    shippingCostPerKm: row.shippingCostPerKm,
    // 5. Custos fixos
    fixedCosts: (row.fixedCosts ?? []) as FixedCostItem[],
    productiveHoursPerMonth: row.productiveHoursPerMonth,
    // 6. Impostos
    taxes: (row.taxes ?? []) as TaxItem[],
    // 7. Margem e pagamentos
    profitMargin: row.profitMargin,
    failureRate: row.failureRate,
    overheadPercentage: row.overheadPercentage,
    paymentFees: row.paymentFees as Record<PaymentMethod, number>,
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function getBaseline() {
  const rows = await db.select().from(pricingBaseline).limit(1);
  return rows[0] ? toDomainBaseline(rows[0]) : null;
}

export async function upsertBaseline(data: NewPricingBaseline) {
  const existing = await db.select().from(pricingBaseline).limit(1);
  const existingRow = existing[0] ?? null;

  const payload = {
    ...data,
    updatedAt: new Date(),
  };

  if (existingRow) {
    const [updated] = await db
      .update(pricingBaseline)
      .set(payload)
      .where(eq(pricingBaseline.id, existingRow.id))
      .returning();
    return toDomainBaseline(updated);
  }

  const [created] = await db
    .insert(pricingBaseline)
    .values(payload)
    .returning();
  return toDomainBaseline(created);
}
