import {
  pgTable,
  text,
  real,
  timestamp,
  uuid,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";

// ── Filamentos (cadastro + precificação) ──────────────
export const filaments = pgTable("filaments", {
  id: uuid("id").primaryKey().defaultRandom(),
  brand: text("brand").notNull(),
  material: text("material").notNull(), // PLA, PETG, ABS, TPU...
  type: text("type").notNull(),
  cost: real("cost").notNull(), // R$
  quantityBoughtG: real("quantity_bought_g").notNull(), // g
  calibrationFlow: real("calibration_flow").default(0).notNull(), // mm³/s
  pricePerKg: real("price_per_kg").notNull(), // R$/kg
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Addons (acessórios = produção | embalagens = logística) ──
export const addons = pgTable("addons", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'accessory' | 'packaging'
  costPerUnit: real("cost_per_unit").notNull(), // R$ por unidade
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Dados fixos (PricingBaseline) — linha única ──────
export const pricingBaseline = pgTable("pricing_baseline", {
  id: uuid("id").primaryKey().defaultRandom(),
  electricityCostPerKwh: real("electricity_cost_per_kwh").notNull(),
  printerPowerWatts: real("printer_power_watts").notNull(),
  laborCostPerHour: real("labor_cost_per_hour").notNull(),
  packagingCostPerOrder: real("packaging_cost_per_order").default(0).notNull(),
  shippingCostPerKm: real("shipping_cost_per_km").default(0).notNull(),
  profitMargin: real("profit_margin").notNull(),
  failureRate: real("failure_rate").default(5).notNull(),
  overheadPercentage: real("overhead_percentage").default(10).notNull(),
  paymentFees: jsonb("payment_fees").notNull(), // Record<PaymentMethod, number>
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Registros de precificação (snapshots) ────────────
export const pricingRecords = pgTable("pricing_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  pieceName: text("piece_name").notNull(),
  printingData: jsonb("printing_data").notNull(), // PrintingData
  addons: jsonb("addons").notNull(), // AddonLine[]
  labor: jsonb("labor").notNull(), // ProductLabor[]
  baselineSnapshot: jsonb("baseline_snapshot").notNull(), // PricingBaseline
  result: jsonb("result").notNull(), // PricingResult
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tipos inferidos (contrato do banco — usados nos services)
export type Filament = typeof filaments.$inferSelect;
export type NewFilament = typeof filaments.$inferInsert;
export type Addon = typeof addons.$inferSelect;
export type NewAddon = typeof addons.$inferInsert;
export type PricingBaseline = typeof pricingBaseline.$inferSelect;
export type NewPricingBaseline = typeof pricingBaseline.$inferInsert;
export type PricingRecord = typeof pricingRecords.$inferSelect;
export type NewPricingRecord = typeof pricingRecords.$inferInsert;

function createLabelTable(tableName: string) {
  return pgTable(tableName, {
    id: uuid("id").primaryKey().defaultRandom(),
    label: text("label").notNull().unique(),
    isCustom: boolean("is_custom").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  });
}

export const filamentBrands = createLabelTable("filament_brands");
export const filamentMaterials = createLabelTable("filament_materials");
export const filamentTypes = createLabelTable("filament_types");
export const filamentColors = createLabelTable("filament_colors");

// Tipos inferidos para services e formulários
export type FilamentBrand = typeof filamentBrands.$inferSelect;
export type NewFilamentBrand = typeof filamentBrands.$inferInsert;
export type FilamentMaterial = typeof filamentMaterials.$inferSelect;
export type NewFilamentMaterial = typeof filamentMaterials.$inferInsert;
export type FilamentType = typeof filamentTypes.$inferSelect;
export type NewFilamentType = typeof filamentTypes.$inferInsert;
export type FilamentColor = typeof filamentColors.$inferSelect;
export type NewFilamentColor = typeof filamentColors.$inferInsert;
