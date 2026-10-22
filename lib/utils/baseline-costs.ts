import type {
  FixedCostItem,
  PrinterEquipment,
  PricingBaseline,
} from "@/lib/types";

// ─────────────────────────────────────────────────────────────
// Rateios da baseline — alimenta o painel de resumo ao vivo
// e o motor de precificação
// ─────────────────────────────────────────────────────────────

export interface BaselineCostRates {
  /** Potência média usada no cálculo (W) — fallback 60% da máxima */
  powerUsedWatts: number;
  /** Custo de energia por hora de impressão (R$/h) */
  energyCostPerHour: number;
  /** Custo total da impressora + equipamentos adicionais (R$) */
  printerTotalCost: number;
  /** Depreciação por hora (R$/h) */
  depreciationPerHour: number;
  /** Soma dos custos fixos mensais (R$/mês) */
  monthlyFixedTotal: number;
  /** Rateio dos custos fixos por hora (R$/h) */
  fixedCostPerHour: number;
  /** Mão de obra de impressão (R$/h) */
  laborPrintingPerHour: number;
  /** Mão de obra de modelagem (R$/h) */
  laborModelingPerHour: number;
  /** Mão de obra de montagem (R$/h) */
  laborAssemblyPerHour: number;
  /** Custo por km rodado (R$/km) — combustível + extras */
  costPerKm: number;
  /** Custo por entrega (R$/entrega) */
  costPerDelivery: number;
  /** Total "máquina rodando" por hora: energia + depreciação + fixos + impressão (R$/h) */
  totalCostPerHour: number;
}

const DEFAULT_PRODUCTIVE_HOURS = 160;

function num(value: number | undefined, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function sum(items: Array<{ value?: number }>): number {
  return items.reduce((acc, item) => acc + num(item.value), 0);
}

export function computeBaselineCosts(
  baseline: Partial<PricingBaseline>,
): BaselineCostRates {
  // 1. Potência média (0 = fallback 60% da máxima)
  const maxPower = num(baseline.printerPowerWatts);
  const avgPower = num(baseline.printerPowerAvgWatts);
  const powerUsedWatts = avgPower > 0 ? avgPower : maxPower * 0.6;

  // 2. Energia: kWh → kW × horas
  const energyCostPerHour =
    (powerUsedWatts / 1000) * num(baseline.electricityCostPerKwh);

  // 3. Depreciação: (impressora + equipamentos) ÷ vida útil em horas
  const addons: PrinterEquipment[] = baseline.printerAddons ?? [];
  const printerTotalCost =
    num(baseline.printerCost) + addons.reduce((acc, a) => acc + num(a.cost), 0);
  const lifespanHours = num(baseline.printerLifespanHours);
  const depreciationPerHour =
    lifespanHours > 0 ? printerTotalCost / lifespanHours : 0;

  // 4. Custos fixos: Σ valores ÷ horas produtivas
  const fixedList: FixedCostItem[] = baseline.fixedCosts ?? [];
  const monthlyFixedTotal = sum(fixedList as Array<{ value?: number }>);
  const productiveHours = num(
    baseline.productiveHoursPerMonth,
    DEFAULT_PRODUCTIVE_HOURS,
  );
  const fixedCostPerHour =
    productiveHours > 0 ? monthlyFixedTotal / productiveHours : 0;

  // 5. Mão de obra
  const laborPrintingPerHour = num(baseline.laborCostPerHour);
  const laborModelingPerHour = num(baseline.modelingCostPerHour);
  const laborAssemblyPerHour = num(baseline.assemblyCostPerHour);

  // 6. Transporte
  const fuelCostPerLiter = num(baseline.fuelCostPerLiter);
  const consumption = num(baseline.vehicleConsumptionKmPerLiter);
  const extraCostPerKm = num(baseline.extraCostPerKm);
  const costPerKm =
    consumption > 0
      ? fuelCostPerLiter / consumption + extraCostPerKm
      : extraCostPerKm;
  const kmPerDelivery = num(baseline.kmPerDelivery);
  const costPerDelivery = baseline.hasOwnDelivery
    ? costPerKm * kmPerDelivery
    : 0;

  // 7. Total por hora (máquina rodando)
  const totalCostPerHour =
    energyCostPerHour +
    depreciationPerHour +
    fixedCostPerHour +
    laborPrintingPerHour;

  return {
    powerUsedWatts,
    energyCostPerHour,
    printerTotalCost,
    depreciationPerHour,
    monthlyFixedTotal,
    fixedCostPerHour,
    laborPrintingPerHour,
    laborModelingPerHour,
    laborAssemblyPerHour,
    costPerKm,
    costPerDelivery,
    totalCostPerHour,
  };
}

export function formatBRL(value: number, fractionDigits = 2): string {
  const n = Number(value);
  return (Number.isFinite(n) ? n : 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

// Labels exibidos nos selects
export const FLAG_OPTIONS = [
  { value: "green", label: "Verde" },
  { value: "yellow", label: "Amarela" },
  { value: "red1", label: "Vermelha — Patamar 1" },
  { value: "red2", label: "Vermelha — Patamar 2" },
  { value: "scarcity", label: "Escassez hídrica" },
] as const;

export const FIXED_COST_CATEGORIES = [
  "Pessoal",
  "Espaço",
  "Software",
  "Marketing",
  "Seguros",
  "Outros",
] as const;
