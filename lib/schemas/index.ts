import { z } from "zod";
import type { PaymentMethod } from "../types";

export const PAYMENT_METHODS = [
  "pix",
  "credit_card",
  "shopee",
  "mercado_livre",
  "boleto",
  "cash",
] as const;

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  pix: "Pix",
  credit_card: "Cartão de crédito",
  shopee: "Shopee",
  mercado_livre: "Mercado Livre",
  boleto: "Boleto",
  cash: "Dinheiro",
};

export const DEFAULT_PAYMENT_FEES: Record<PaymentMethod, number> = {
  pix: 0,
  credit_card: 3.99,
  shopee: 12,
  mercado_livre: 14,
  boleto: 1.5,
  cash: 0,
};

export const paymentMethodSchema = z.enum(PAYMENT_METHODS);

export const paymentFeesSchema = z.record(
  paymentMethodSchema,
  z.number().min(0).max(50),
);

export const filamentSchema = z.object({
  brand: z.string().min(1, "Marca é obrigatória"),
  material: z.string().min(1, "Material é obrigatório"),
  type: z.string().min(1, "Tipo é obrigatório"),
  color: z.string().min(1, "Cor é obrigatória"),
  rollSize: z.number().int().positive("Selecione o tamanho do rolo"),
  rollPrice: z.number().positive("Custo por kg deve ser positivo"),
  calibrationFlow: z.number().optional(),
  pricePerKg: z.number().optional(),
  stockQuantity: z.number().optional(),
  note: z.string().optional(),
  active: z.boolean(),
});

export const filamentFormSchema = filamentSchema.extend({
  rollQuantity: z.number().int().min(1, "Informe a quantidade de rolos"),
});

export const PURCHASE_UNITS = [
  "unit",
  "pack",
  "roll",
  "bottle",
  "box",
] as const;
export const CONTAINED_UNITS = [
  "unit",
  "m",
  "cm",
  "kg",
  "g",
  "l",
  "ml",
  "m2",
] as const;
export const CONSUMPTION_TYPES = ["exact", "estimated", "perOrder"] as const;

/**
 * Schema do FORMULÁRIO (o que o usuário digita).
 * NÃO inclui costPerUnit/estimatedCostPerProduct — são derivados
 * calculados no service. Sem .default() para manter z.input === z.output.
 */
export const addonSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.enum(["accessory", "packaging"], { message: "Tipo inválido" }),

  // Compra
  purchasePrice: z.number().positive("Preço de compra deve ser positivo"),
  purchaseUnit: z.enum(PURCHASE_UNITS, {
    message: "Formato de compra inválido",
  }),
  packageQuantity: z
    .number()
    .positive("Informe quantos pacotes/rolos você comprou"),
  containedAmount: z
    .number()
    .positive("Informe o conteúdo de cada pacote/rolo"),
  containedUnit: z.enum(CONTAINED_UNITS, {
    message: "Unidade de conteúdo inválida",
  }),

  // Consumo
  consumptionType: z.enum(CONSUMPTION_TYPES, {
    message: "Modo de consumo inválido",
  }),
  consumptionUnit: z.enum(CONTAINED_UNITS, {
    message: "Unidade de consumo inválida",
  }),
  quantityUsed: z
    .number()
    .nonnegative("Quantidade usada não pode ser negativa"),
  wastePercentage: z.number().min(0, "Mínimo 0%").max(100, "Máximo 100%"),
  isPerOrder: z.boolean(),

  // Extras
  purchaseUrl: z.string().optional(),
  stockQuantity: z.number().nonnegative().optional(),
  note: z.string().optional(),
  active: z.boolean(),
});

/**
 * Schema da API — aceita os derivados se vierem do cliente,
 * mas o service SEMPRE recalcula (servidor é fonte da verdade).
 */
export const addonCreateSchema = addonSchema.extend({
  costPerUnit: z.number().nonnegative().optional(),
  estimatedCostPerProduct: z.number().nonnegative().optional(),
});

// ── Baseline: listas dinâmicas ──
export const printerAddonSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  cost: z.number().nonnegative(),
  powerWatts: z.number().nonnegative(),
  lifespanHours: z.number().nonnegative(),
});

export const taxItemSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  kind: z.enum(["percentage", "fixed"]),
  value: z.number().nonnegative(),
  origin: z.enum(["government", "marketplace"]),
  base: z.enum(["price", "cost", "order"]),
  incidence: z.enum(["commission", "passThrough"]),
});

export const fixedCostItemSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  value: z.number().nonnegative(),
  category: z.enum([
    "Pessoal",
    "Espaço",
    "Software",
    "Marketing",
    "Seguros",
    "Outros",
  ]),
});

// ── Baseline: formulário completo ──
// Sem .default(): o form fornece defaultValues (z.input === z.output).
export const baselineSchema = z.object({
  printerBrand: z.string(),
  printerModel: z.string(),
  printerCost: z.number().nonnegative().optional(),
  printerPowerWatts: z
    .number()
    .positive("Potência máxima deve ser positiva")
    .optional(),
  printerPowerAvgWatts: z.number().nonnegative().optional(),
  printerLifespanHours: z.number().nonnegative().optional(),
  printerAddons: z.array(printerAddonSchema),
  electricityFlag: z.enum(["green", "yellow", "red1", "red2", "scarcity"]),
  electricityCostPerKwh: z
    .number()
    .positive("Custo de energia deve ser positivo")
    .optional(),
  modelingCostPerHour: z.number().nonnegative().optional(),
  postPrintingCostPerHour: z.number().nonnegative().optional(),
  hasOwnDelivery: z.boolean(),
  fuelCostPerLiter: z.number().nonnegative().optional(),
  vehicleConsumptionKmPerLiter: z.number().nonnegative().optional(),
  kmPerDelivery: z.number().nonnegative().optional(),
  deliveriesPerRoute: z.number().int().min(1).optional(),
  extraCostPerKm: z.number().nonnegative().optional(),
  packagingCostPerOrder: z.number().nonnegative().optional(),
  shippingCostPerKm: z.number().nonnegative().optional(),
  fixedCosts: z.array(fixedCostItemSchema),
  productiveHoursPerMonth: z.number().int().min(1).optional(),
  taxes: z.array(taxItemSchema),
  profitMargin: z.number().min(0).max(500).optional(),
  failureRate: z.number().min(0).max(100).optional(),
  paymentFees: paymentFeesSchema,
});

export const printingDataSchema = z.object({
  filamentId: z.string().min(1, "Selecione um filamento"),
  filamentName: z.string().min(1),
  filamentCostPerKg: z.number().positive(),
  filamentWeightG: z.number().positive("Peso deve ser positivo"),
  printTimeHours: z.number().positive("Tempo deve ser positivo"),
  quantity: z.number().int().min(1),
  failureRate: z.number().min(0).max(100),
  distanceKm: z.number().nonnegative().optional(), // .optional() NÃO cria assimetria
});

export const addonLineSchema = z.object({
  addonId: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(["accessory", "packaging"]),
  costPerUnit: z.number().positive(),
  quantity: z.number().int().min(1),
  total: z.number().nonnegative(),
});

export const productLaborSchema = z.object({
  description: z.string().min(1, "Descreva o trabalho"),
  hours: z.number().positive("Horas devem ser positivas"),
  costPerHour: z.number().nonnegative(),
  total: z.number().nonnegative(),
});

export const pricingRequestSchema = z.object({
  pieceName: z.string().min(1, "Nome da peça é obrigatório"),
  printingData: printingDataSchema,
  addons: z.array(addonLineSchema),
  labor: z.array(productLaborSchema),
});

export const labelOptionSchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, "Informe um nome")
    .max(60, "Máximo de 60 caracteres"),
});

// Tipos inferidos — agora Input === Output
export type FilamentInput = z.infer<typeof filamentSchema>;
export type FilamentFormValues = z.infer<typeof filamentFormSchema>;
export type AddonInput = z.infer<typeof addonSchema>;
export type AddonCreateInput = z.infer<typeof addonCreateSchema>;
export type PrinterAddonInput = z.infer<typeof printerAddonSchema>;
export type TaxItemInput = z.infer<typeof taxItemSchema>;
export type FixedCostItemInput = z.infer<typeof fixedCostItemSchema>;
export type BaselineInput = z.infer<typeof baselineSchema>;
export type PrintingDataInput = z.infer<typeof printingDataSchema>;
export type AddonLineInput = z.infer<typeof addonLineSchema>;
export type ProductLaborInput = z.infer<typeof productLaborSchema>;
export type PricingRequestInput = z.infer<typeof pricingRequestSchema>;
