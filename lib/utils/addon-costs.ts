import type { ContainedUnit, ConsumptionType, PurchaseUnit } from "@/lib/types";

// ─────────────────────────────────────────────────────────────
// Metadados das unidades
// ─────────────────────────────────────────────────────────────

type UnitFamily = "count" | "length" | "mass" | "volume" | "area";

interface UnitMeta {
  family: UnitFamily;
  /** fator para converter 1 unidade desta → unidade-base da família */
  toBase: number;
  label: string;
}

export const CONTAINED_UNIT_META: Record<ContainedUnit, UnitMeta> = {
  unit: { family: "count", toBase: 1, label: "un" },
  m: { family: "length", toBase: 1, label: "m" },
  cm: { family: "length", toBase: 0.01, label: "cm" },
  kg: { family: "mass", toBase: 1, label: "kg" },
  g: { family: "mass", toBase: 0.001, label: "g" },
  l: { family: "volume", toBase: 1, label: "l" },
  ml: { family: "volume", toBase: 0.001, label: "ml" },
  m2: { family: "area", toBase: 1, label: "m²" },
};

export const ALL_CONTAINED_UNITS = Object.keys(
  CONTAINED_UNIT_META,
) as ContainedUnit[];

export const CONTAINED_UNIT_OPTIONS: { value: ContainedUnit; label: string }[] =
  [
    { value: "unit", label: "Unidade (un)" },
    { value: "m", label: "Metro (m)" },
    { value: "cm", label: "Centímetro (cm)" },
    { value: "kg", label: "Quilograma (kg)" },
    { value: "g", label: "Grama (g)" },
    { value: "l", label: "Litro (l)" },
    { value: "ml", label: "Mililitro (ml)" },
    { value: "m2", label: "Metro quadrado (m²)" },
  ];

export const PURCHASE_UNIT_OPTIONS: {
  value: PurchaseUnit;
  label: string;
  contentLabel: string;
}[] = [
  { value: "pack", label: "Pacote", contentLabel: "Conteúdo de cada pacote" },
  { value: "roll", label: "Rolo", contentLabel: "Conteúdo de cada rolo" },
  { value: "bottle", label: "Frasco", contentLabel: "Conteúdo de cada frasco" },
  { value: "box", label: "Caixa", contentLabel: "Conteúdo de cada caixa" },
  {
    value: "unit",
    label: "Unidade",
    contentLabel: "Conteúdo por unidade comprada",
  },
];

export const CONSUMPTION_TYPE_OPTIONS: {
  value: ConsumptionType;
  label: string;
  hint: string;
}[] = [
  {
    value: "exact",
    label: "Quantidade exata",
    hint: "Você sabe exatamente quanto usa por peça (ex: 2 parafusos).",
  },
  {
    value: "estimated",
    label: "Quantidade estimada",
    hint: "Você não sabe o exato e quer aplicar uma margem de sobra (ex: fita adesiva).",
  },
  {
    value: "perOrder",
    label: "Custo fixo por pedido",
    hint: "Cobrado uma vez por pedido, não por peça (ex: caixa personalizada).",
  },
];

export function unitLabel(unit: ContainedUnit): string {
  return CONTAINED_UNIT_META[unit]?.label ?? unit;
}

/** Unidades compatíveis (mesma família) — ex: 'm' → ['m', 'cm'] */
export function compatibleUnits(unit: ContainedUnit): ContainedUnit[] {
  const family = CONTAINED_UNIT_META[unit]?.family ?? "count";
  return ALL_CONTAINED_UNITS.filter(
    (u) => CONTAINED_UNIT_META[u].family === family,
  );
}

/** Converte entre unidades da mesma família. Retorna NaN se incompatíveis. */
export function convertUnits(
  value: number,
  from: ContainedUnit,
  to: ContainedUnit,
): number {
  const f = CONTAINED_UNIT_META[from];
  const t = CONTAINED_UNIT_META[to];
  const n = Number(value);
  if (!f || !t || !Number.isFinite(n)) return NaN;
  if (f.family !== t.family) return NaN;
  return (n * f.toBase) / t.toBase;
}

// ─────────────────────────────────────────────────────────────
// Cálculo de custo
// ─────────────────────────────────────────────────────────────

export interface AddonCostInput {
  purchasePrice: number;
  packageQuantity: number;
  containedAmount: number;
  containedUnit: ContainedUnit;
  consumptionType: ConsumptionType;
  consumptionUnit: ContainedUnit;
  quantityUsed: number;
  wastePercentage: number;
  isPerOrder?: boolean;
}

export interface AddonCostResult {
  /** Custo de 1 containedUnit (ex: R$ 0,30 por metro) */
  costPerUnit: number;
  /** Conteúdo total comprado, na containedUnit (ex: 50 m) */
  totalContainedAmount: number;
  /** Quantidade usada, convertida para a containedUnit */
  usedInContainedUnit: number;
  /** Fator de sobra aplicado (1 = nenhum) */
  wasteFactor: number;
  /** Custo por aplicação do addon (por peça ou por pedido) */
  estimatedCostPerProduct: number;
  /** true quando compra e consumo estão em famílias diferentes */
  unitMismatch: boolean;
  /** true quando o custo é cobrado uma vez por pedido */
  isPerOrder: boolean;
}

function num(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function computeAddonCosts(input: AddonCostInput): AddonCostResult {
  const price = Math.max(0, num(input.purchasePrice));
  const contained = Math.max(0, num(input.containedAmount));
  const packages = Math.max(0, num(input.packageQuantity));
  const waste = Math.min(100, Math.max(0, num(input.wastePercentage)));

  // Regra 1: custo na unidade de conteúdo (preço ÷ conteúdo de 1 pacote/rolo)
  const costPerUnit = contained > 0 ? price / contained : 0;
  const totalContainedAmount = packages * contained;

  // Regra 2: normalização de unidade (30 cm → 0,30 m)
  const converted = convertUnits(
    num(input.quantityUsed),
    input.consumptionUnit,
    input.containedUnit,
  );
  const unitMismatch = Number.isNaN(converted);
  const usedInContainedUnit = unitMismatch ? 0 : converted;

  // Regra 3: custo por aplicação conforme o modo de consumo
  const isPerOrder =
    Boolean(input.isPerOrder) || input.consumptionType === "perOrder";
  const wasteFactor =
    input.consumptionType === "estimated" ? 1 + waste / 100 : 1;
  const estimatedCostPerProduct =
    usedInContainedUnit * costPerUnit * wasteFactor;

  return {
    costPerUnit,
    totalContainedAmount,
    usedInContainedUnit,
    wasteFactor,
    estimatedCostPerProduct,
    unitMismatch,
    isPerOrder,
  };
}
