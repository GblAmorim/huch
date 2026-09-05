import type {
  AddonLine,
  PaymentMethod,
  PricingBaseline,
  PricingResult,
  PrintingData,
  ProductLabor,
} from "../types";
import { PAYMENT_LABELS } from "../schemas";

interface CalculatePriceParams {
  printingData: PrintingData;
  addons: AddonLine[];
  labor: ProductLabor[];
  baseline: PricingBaseline;
}

export function calculatePrice({
  printingData,
  addons,
  labor,
  baseline,
}: CalculatePriceParams): PricingResult {
  const qty = printingData.quantity;

  // ── Custos de produção ──────────────────────────────
  const materialCost =
    (printingData.filamentWeightG / 1000) *
    printingData.filamentCostPerKg *
    qty;
  const energyCost =
    (baseline.printerPowerWatts / 1000) *
    printingData.printTimeHours *
    baseline.electricityCostPerKwh *
    qty;
  const laborCost =
    printingData.printTimeHours * baseline.laborCostPerHour * qty;
  const accessoriesCost = sumByType(addons, "accessory");
  const productLaborCost = labor.reduce((sum, l) => sum + l.total, 0);
  const overheadCost =
    (materialCost +
      energyCost +
      laborCost +
      accessoriesCost +
      productLaborCost) *
    (baseline.overheadPercentage / 100);
  const totalProductionCost =
    materialCost +
    energyCost +
    laborCost +
    accessoriesCost +
    productLaborCost +
    overheadCost;

  // ── Custos de logística ─────────────────────────────
  const packagingCost =
    sumByType(addons, "packaging") + baseline.packagingCostPerOrder;
  const shippingCost =
    baseline.shippingCostPerKm * (printingData.distanceKm ?? 0);
  const totalLogisticsCost = packagingCost + shippingCost;

  // ── Totais ──────────────────────────────────────────
  const totalCost = totalProductionCost + totalLogisticsCost;
  const basePrice =
    totalCost *
    (1 + printingData.failureRate / 100) *
    (1 + baseline.profitMargin / 100);

  // ── Preço por meio de pagamento (gross-up) ──────────
  // finalPrice = basePrice / (1 - taxa) → você recebe o basePrice líquido
  const payments = (Object.keys(baseline.paymentFees) as PaymentMethod[]).map(
    (method) => {
      const feePercent = baseline.paymentFees[method];
      const finalPrice =
        feePercent > 0 ? basePrice / (1 - feePercent / 100) : basePrice;
      return {
        method,
        label: PAYMENT_LABELS[method] ?? method,
        feePercent,
        finalPrice: round2(finalPrice),
      };
    },
  );

  return {
    materialCost: round2(materialCost),
    energyCost: round2(energyCost),
    laborCost: round2(laborCost),
    accessoriesCost: round2(accessoriesCost),
    productLaborCost: round2(productLaborCost),
    overheadCost: round2(overheadCost),
    totalProductionCost: round2(totalProductionCost),
    packagingCost: round2(packagingCost),
    shippingCost: round2(shippingCost),
    totalLogisticsCost: round2(totalLogisticsCost),
    totalCost: round2(totalCost),
    basePrice: round2(basePrice),
    payments,
  };
}

function sumByType(addons: AddonLine[], type: AddonLine["type"]): number {
  return addons
    .filter((a) => a.type === type)
    .reduce((sum, a) => sum + a.total, 0);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
