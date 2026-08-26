import {
  pgTable,
  text,
  real,
  timestamp,
  uuid,
  jsonb,
} from "drizzle-orm/pg-core";

// Dados fixos configuráveis (linha única, atualizada via PUT)
export const config = pgTable("config", {
  id: uuid("id").primaryKey().defaultRandom(),
  filamentCostPerKg: real("filament_cost_per_kg").notNull(),
  electricityCostPerKwh: real("electricity_cost_per_kwh").notNull(),
  printerPowerWatts: real("printer_power_watts").notNull(),
  laborCostPerHour: real("labor_cost_per_hour").notNull(),
  profitMargin: real("profit_margin").notNull(),
  failureRate: real("failure_rate").default(5),
  overheadPercentage: real("overhead_percentage").default(10),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Registros de peças precificadas
export const pricingRecords = pgTable("pricing_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  pieceName: text("piece_name").notNull(),
  filamentWeightG: real("filament_weight_g").notNull(),
  printTimeHours: real("print_time_hours").notNull(),
  configSnapshot: jsonb("config_snapshot").notNull(),
  materialCost: real("material_cost").notNull(),
  energyCost: real("energy_cost").notNull(),
  laborCost: real("labor_cost").notNull(),
  overheadCost: real("overhead_cost").notNull(),
  totalCost: real("total_cost").notNull(),
  finalPrice: real("final_price").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Config = typeof config.$inferSelect;
export type PricingRecord = typeof pricingRecords.$inferSelect;
export type NewPricingRecord = typeof pricingRecords.$inferInsert;
