import { z } from "zod";

export const configSchema = z.object({
  filamentCostPerKg: z
    .number()
    .positive("Custo do filamento deve ser positivo"),
  electricityCostPerKwh: z
    .number()
    .positive("Custo de energia deve ser positivo"),
  printerPowerWatts: z.number().positive("Potência deve ser positiva"),
  laborCostPerHour: z
    .number()
    .nonnegative("Custo de mão de obra não pode ser negativo"),
  profitMargin: z.number().min(0).max(500, "Margem irreal"),
  failureRate: z.number().min(0).max(100, "Taxa de falha inválida"),
  overheadPercentage: z.number().min(0).max(100, "Overhead inválido"),
});

export const variableDataSchema = z.object({
  pieceName: z.string().min(1, "Nome da peça é obrigatório"),
  filamentWeightG: z.number().positive("Peso do filamento deve ser positivo"),
  printTimeHours: z.number().positive("Tempo de impressão deve ser positivo"),
});

export const pricingCalcSchema = z.object({
  filamentWeightG: z.number().positive(),
  printTimeHours: z.number().positive(),
  config: configSchema,
});

export type ConfigInput = z.infer<typeof configSchema>;
export type VariableDataInput = z.infer<typeof variableDataSchema>;
export type PricingCalcInput = z.infer<typeof pricingCalcSchema>;
export type PricingResult = {
  materialCost: number;
  energyCost: number;
  laborCost: number;
  overheadCost: number;
  totalCost: number;
  finalPrice: number;
};
