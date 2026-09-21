import {
  pgTable,
  text,
  real,
  timestamp,
  uuid,
  jsonb,
  boolean,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import {
  AddonType,
  ConsumptionType,
  ContainedUnit,
  PurchaseUnit,
} from "../types";

// ── Filamentos (cadastro + precificação) ──────────────
export const filaments = pgTable(
  "filaments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    brand: text("brand").notNull(),
    material: text("material").notNull(), // PLA, PETG, ABS, TPU...
    type: text("type").notNull(),
    color: text("color").notNull(),
    calibrationFlow: real("calibration_flow").default(0).notNull(), // mm³/s
    rollSize: real("roll_size").notNull(), // g
    rollPrice: real("roll_price").notNull(), // R$
    stockQuantity: real("stock_quantity").notNull(), // quantidade em estoque
    pricePerKg: real("price_per_kg").notNull(), // R$/kg
    note: text("note"),
    active: boolean("active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("filaments_brand_material_type_color_unique").on(
      table.brand,
      table.material,
      table.type,
      table.color,
    ),
  ],
);

// ── Addons (acessórios = produção | embalagens = logística) ──
export const addons = pgTable("addons", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: text("type").$type<AddonType>().notNull(), // 'accessory' | 'packaging'

  // ── Como você comprou ──
  purchasePrice: real("purchase_price").notNull(),
  purchaseUnit: text("purchase_unit")
    .$type<PurchaseUnit>()
    .notNull()
    .default("pack"),
  packageQuantity: real("package_quantity").notNull().default(1), // quantos pacotes/rolos
  containedAmount: real("contained_amount").notNull().default(1), // conteúdo de 1 pacote/rolo
  containedUnit: text("contained_unit")
    .$type<ContainedUnit>()
    .notNull()
    .default("unit"),

  // ── Como você usa no produto ──
  consumptionType: text("consumption_type")
    .$type<ConsumptionType>()
    .notNull()
    .default("exact"),
  consumptionUnit: text("consumption_unit")
    .$type<ContainedUnit>()
    .notNull()
    .default("unit"),
  quantityUsed: real("quantity_used").notNull().default(0),
  wastePercentage: real("waste_percentage").notNull().default(0),
  isPerOrder: boolean("is_per_order").notNull().default(false),

  // ── Derivados (calculados no service, nunca digitados) ──
  costPerUnit: real("cost_per_unit").notNull().default(0), // custo por 1 containedUnit
  estimatedCostPerProduct: real("estimated_cost_per_product")
    .notNull()
    .default(0),

  // ── Extras ──
  purchaseUrl: text("purchase_url").notNull().default(""),
  stockQuantity: real("stock_quantity").notNull().default(0),
  note: text("note").notNull().default(""),
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
