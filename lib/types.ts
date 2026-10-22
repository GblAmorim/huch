// ============================================================
// DOMÍNIO: Filament
// Registrado no cadastro e usado na precificação
// para calcular o custo de material do produto
// ============================================================

export interface Filament {
  id: string;
  brand: string;
  material: string;
  type: string;
  color: string;
  calibrationFlow: number;
  rollSize: number;
  rollPrice: number;
  stockQuantity: number;
  pricePerKg: number;
  note: string;
  active: boolean;
  createdAt: string;
}

export interface NewFilament {
  brand: string;
  material: string;
  type: string;
  color: string;
  calibrationFlow: number;
  rollSize: number;
  rollPrice: number;
  stockQuantity: number;
  pricePerKg: number;
  note: string;
  active?: boolean;
}

// ============================================================
// DOMÍNIO: Addons
// Registrado no cadastro e usado na precificação:
//  - 'accessory'  → custo de PRODUÇÃO (parafusos, rolamentos)
//  - 'packaging'  → custo de LOGÍSTICA (embalagem, proteção)
// ============================================================

export type AddonType = "accessory" | "packaging";

/** Como o item foi comprado (usado para rotular o campo de conteúdo) */
export type PurchaseUnit = "unit" | "pack" | "roll" | "bottle" | "box";

/** Em que o conteúdo é medido — define a família de conversão */
export type ContainedUnit =
  | "unit"
  | "m"
  | "cm"
  | "kg"
  | "g"
  | "l"
  | "ml"
  | "m2";

/** Como o item entra no produto */
export type ConsumptionType = "exact" | "estimated" | "perOrder";

/** Registro persistido (o que vem da API — datas serializadas em string) */
export interface Addon {
  id: string;
  name: string;
  type: AddonType;
  purchasePrice: number;
  purchaseUnit: PurchaseUnit;
  packageQuantity: number;
  containedAmount: number;
  containedUnit: ContainedUnit;
  consumptionType: ConsumptionType;
  consumptionUnit: ContainedUnit;
  quantityUsed: number;
  wastePercentage: number;
  isPerOrder: boolean;
  costPerUnit: number; // derivado: custo por 1 containedUnit
  estimatedCostPerProduct: number; // derivado: custo por peça (ou por pedido)
  purchaseUrl: string;
  stockQuantity: number;
  note: string;
  active: boolean;
  createdAt: string;
}

/** Payload de criação (o que o cliente ENVIA — sem os derivados) */
export interface NewAddon {
  name: string;
  type: AddonType;
  purchasePrice: number;
  purchaseUnit: PurchaseUnit;
  packageQuantity: number;
  containedAmount: number;
  containedUnit: ContainedUnit;
  consumptionType: ConsumptionType;
  consumptionUnit: ContainedUnit;
  quantityUsed: number;
  wastePercentage: number;
  isPerOrder: boolean;
  purchaseUrl?: string;
  stockQuantity?: number;
  note?: string;
  active?: boolean;
}

// Addon selecionado em uma precificação (com quantidade)
export interface AddonLine {
  addonId: string;
  name: string;
  type: AddonType;
  costPerUnit: number;
  quantity: number;
  total: number;
}

// ============================================================
// DOMÍNIO: Baseline — equipamentos, custos fixos e impostos
// ============================================================

/** Equipamento adicional da impressora (AMS, exaustor, iluminação…) */
export interface PrinterEquipment {
  name: string;
  cost: number; // R$ pago
  powerWatts: number; // consumo médio em uso (W)
  lifespanHours: number; // vida útil estimada (h)
}

export type TaxKind = "percentage" | "fixed";
export type TaxOrigin = "government" | "marketplace";
export type TaxBase = "price" | "cost" | "order";
export type TaxIncidence = "commission" | "passThrough";

/** Item de imposto/taxa cadastrado dinamicamente */
export interface TaxItem {
  name: string;
  kind: TaxKind; // % ou R$ fixo
  value: number;
  origin: TaxOrigin; // governo ou marketplace
  base: TaxBase; // sobre preço de venda, sobre custo, ou por pedido
  incidence: TaxIncidence; // comissão (divide) ou repasse (soma)
}

export type FixedCostCategory =
  | "Pessoal"
  | "Espaço"
  | "Software"
  | "Marketing"
  | "Seguros"
  | "Outros";

/** Custo fixo mensal cadastrado dinamicamente */
export interface FixedCostItem {
  name: string;
  value: number; // R$/mês
  category: FixedCostCategory;
}

/** Bandeira tarifária — metadado informativo (o kWh final já a embute) */
export type ElectricityFlag = "green" | "yellow" | "red1" | "red2" | "scarcity";

// ============================================================
// DOMÍNIO: PricingBaseline
// Formulário de dados "fixos" — base para o cálculo
// ============================================================
export interface PricingBaseline {
  id: string;
  // ── Impressora ──
  printerBrand?: string;
  printerModel?: string;
  printerCost?: number;
  printerPowerWatts: number;
  printerPowerAvgWatts?: number;
  printerLifespanHours?: number;
  printerAddons?: PrinterEquipment[];
  // ── Energia ──
  electricityFlag?: ElectricityFlag;
  electricityCostPerKwh: number;
  // ── Mão de obra ──
  laborCostPerHour: number;
  modelingCostPerHour?: number;
  assemblyCostPerHour?: number;
  finishingCostPerHour?: number;
  // ── Transporte ──
  hasOwnDelivery?: boolean;
  fuelCostPerLiter?: number;
  vehicleConsumptionKmPerLiter?: number;
  kmPerDelivery?: number;
  deliveriesPerRoute?: number;
  extraCostPerKm?: number;
  packagingCostPerOrder: number;
  shippingCostPerKm: number;
  // ── Custos fixos ──
  fixedCosts?: FixedCostItem[];
  productiveHoursPerMonth?: number;
  // ── Impostos ──
  taxes?: TaxItem[];
  // ── Margem e pagamentos ──
  profitMargin: number;
  failureRate: number;
  overheadPercentage: number;
  paymentFees: Record<PaymentMethod, number>;
  updatedAt: string;
}

export interface NewPricingBaseline {
  printerBrand?: string;
  printerModel?: string;
  printerCost?: number;
  printerPowerWatts: number;
  printerPowerAvgWatts?: number;
  printerLifespanHours?: number;
  printerAddons?: PrinterEquipment[];
  electricityFlag?: ElectricityFlag;
  electricityCostPerKwh: number;
  laborCostPerHour: number;
  modelingCostPerHour?: number;
  assemblyCostPerHour?: number;
  finishingCostPerHour?: number;
  hasOwnDelivery?: boolean;
  fuelCostPerLiter?: number;
  vehicleConsumptionKmPerLiter?: number;
  kmPerDelivery?: number;
  deliveriesPerRoute?: number;
  extraCostPerKm?: number;
  packagingCostPerOrder: number;
  shippingCostPerKm: number;
  fixedCosts?: FixedCostItem[];
  productiveHoursPerMonth?: number;
  taxes?: TaxItem[];
  profitMargin: number;
  failureRate: number;
  overheadPercentage: number;
  paymentFees: Record<PaymentMethod, number>;
}

// ============================================================
// DOMÍNIO: PrintingData
// Dados da impressão — usados na precificação
// ============================================================
export interface PrintingData {
  filamentId: string; // FK → Filament
  filamentName: string; // snapshot para histórico
  filamentCostPerKg: number; // snapshot do custo no momento do cálculo
  filamentWeightG: number; // gramas usados na peça
  printTimeHours: number; // tempo de impressão
  quantity: number; // quantidade de peças
  failureRate: number; // % chance de falha (pode vir da baseline ou ser sobrescrita)
  distanceKm?: number; // distância percorrida para envio (km)
}

// ============================================================
// DOMÍNIO: ProductLabor
// Trabalho de modelagem ou manual pós-impressão
// (lixar, montar, colocar acessório, pintar, etc.)
// ============================================================
export interface ProductLabor {
  description: string; // ex: "Lixamento e pintura"
  hours: number; // horas trabalhadas
  costPerHour: number; // R$/h
  total: number; // hours * costPerHour
}

// ============================================================
// DOMÍNIO: Resultado da precificação
// Resultado do "variável" com o "fixo" + valores por meio de pagamento
// ============================================================
export type PaymentMethod =
  | "pix"
  | "credit_card"
  | "shopee"
  | "mercado_livre"
  | "boleto"
  | "cash";

export interface PaymentFee {
  method: PaymentMethod;
  label: string; // ex: "Pix", "Cartão de crédito"
  feePercent: number; // % taxa do meio de pagamento
  finalPrice: number; // preço final já com a taxa aplicada
}

export interface PricingResult {
  // Custos de produção
  materialCost: number; // filamento
  energyCost: number; // energia
  laborCost: number; // mão de obra de impressão
  accessoriesCost: number; // addons tipo 'accessory'
  productLaborCost: number; // trabalho manual/modelagem
  overheadCost: number; // custos indiretos
  totalProductionCost: number; // soma de tudo acima

  // Custos de logística
  packagingCost: number; // addons tipo 'packaging'
  shippingCost: number; // gasolina/frete
  totalLogisticsCost: number; // packaging + shipping

  // Totais
  totalCost: number; // produção + logística
  basePrice: number; // totalCost + margem (preço do produto, sem taxa)
  payments: PaymentFee[]; // preço final por meio de pagamento
}

// ============================================================
// Registro persistido (tabela pricing_records)
// ============================================================
export interface PricingRecord {
  id: string;
  pieceName: string;
  printingData: PrintingData;
  addons: AddonLine[];
  labor: ProductLabor[];
  baselineSnapshot: PricingBaseline; // snapshot dos dados fixos no momento
  result: PricingResult;
  createdAt: string;
}

export interface NewPricingRecord {
  pieceName: string;
  printingData: PrintingData;
  addons: AddonLine[];
  labor: ProductLabor[];
  baselineSnapshot: PricingBaseline;
  result: PricingResult;
}
