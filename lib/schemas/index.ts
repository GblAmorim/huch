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
  cost: z.number().positive("Custo por kg deve ser positivo"),
  quantityBoughtG: z
    .number()
    .int()
    .min(1, "Quantidade comprada deve ser pelo menos 1"),
  calibrationFlow: z.number().optional(),
  pricePerKg: z.number().positive("Preço por kg deve ser positivo"),
  note: z.string().optional(),
  active: z.boolean(),
});

export const addonSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.enum(["accessory", "packaging"], { message: "Tipo inválido" }),
  costPerUnit: z.number().positive("Custo unitário deve ser positivo"),
  active: z.boolean(),
});

export const baselineSchema = z.object({
  electricityCostPerKwh: z
    .number()
    .positive("Custo de energia deve ser positivo"),
  printerPowerWatts: z.number().positive("Potência deve ser positiva"),
  laborCostPerHour: z.number().nonnegative("Mão de obra não pode ser negativa"),
  packagingCostPerOrder: z.number().nonnegative(),
  shippingCostPerKm: z.number().nonnegative(),
  profitMargin: z.number().min(0).max(500, "Margem irreal"),
  failureRate: z.number().min(0).max(100),
  overheadPercentage: z.number().min(0).max(100),
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
export type AddonInput = z.infer<typeof addonSchema>;
export type BaselineInput = z.infer<typeof baselineSchema>;
export type PrintingDataInput = z.infer<typeof printingDataSchema>;
export type AddonLineInput = z.infer<typeof addonLineSchema>;
export type ProductLaborInput = z.infer<typeof productLaborSchema>;
export type PricingRequestInput = z.infer<typeof pricingRequestSchema>;
