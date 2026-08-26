import type { ConfigInput, PricingResult } from "../schemas";

export function calculatePrice(
  filamentWeightG: number,
  printTimeHours: number,
  config: ConfigInput,
): PricingResult {
  const materialCost = (filamentWeightG / 1000) * config.filamentCostPerKg;
  const energyCost =
    (config.printerPowerWatts / 1000) *
    printTimeHours *
    config.electricityCostPerKwh;
  const laborCost = printTimeHours * config.laborCostPerHour;
  const overheadCost =
    (materialCost + energyCost + laborCost) * (config.overheadPercentage / 100);
  const totalCost = materialCost + energyCost + laborCost + overheadCost;
  const finalPrice =
    totalCost *
    (1 + config.failureRate / 100) *
    (1 + config.profitMargin / 100);

  return {
    materialCost: round2(materialCost),
    energyCost: round2(energyCost),
    laborCost: round2(laborCost),
    overheadCost: round2(overheadCost),
    totalCost: round2(totalCost),
    finalPrice: round2(finalPrice),
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
