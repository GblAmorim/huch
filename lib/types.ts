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
  cost: number;
  quantityBoughtG: number;
  pricePerKg: number;
  active: boolean;
  createdAt: string;
}

export interface NewFilament {
  brand: string;
  material: string;
  type: string;
  color: string;
  calibrationFlow: number;
  cost: number;
  quantityBoughtG: number;
  pricePerKg: number;
  active?: boolean;
}

// ============================================================
// DOMÍNIO: Addons
// Registrado no cadastro e usado na precificação:
//  - 'accessory'  → custo de PRODUÇÃO (parafusos, rolamentos, peças externas)
//  - 'packaging'  → custo de LOGÍSTICA (embalagem, proteção)
// ============================================================
export type AddonType = "accessory" | "packaging";

export interface Addon {
  id: string;
  name: string;
  type: AddonType;
  costPerUnit: number; // R$ por unidade
  active: boolean;
  createdAt: string;
}

export interface NewAddon {
  name: string;
  type: AddonType;
  costPerUnit: number;
  active?: boolean;
}

// Addon selecionado em uma precificação (com quantidade)
export interface AddonLine {
  addonId: string;
  name: string;
  type: AddonType;
  costPerUnit: number;
  quantity: number;
  total: number; // costPerUnit * quantity
}

// ============================================================
// DOMÍNIO: PricingBaseline
// Formulário de dados "fixos" — base para o cálculo
// ============================================================
export interface PricingBaseline {
  id: string;
  // Custos de produção
  electricityCostPerKwh: number; // R$/kWh
  printerPowerWatts: number; // W
  laborCostPerHour: number; // R$/h (mão de obra de impressão)
  // Custos de logística (default 0 — opcional no MVP)
  packagingCostPerOrder: number; // R$ por pedido (embalagem/proteção)
  shippingCostPerKm: number; // R$/km (gasolina/frete)
  // Margens e taxas
  profitMargin: number; // % (ex: 30 = 30%)
  failureRate: number; // % taxa de falha padrão
  overheadPercentage: number; // % custos indiretos
  updatedAt: string;
  paymentFees: Record<PaymentMethod, number>;
}

export interface NewPricingBaseline {
  electricityCostPerKwh: number;
  printerPowerWatts: number;
  laborCostPerHour: number;
  packagingCostPerOrder?: number;
  shippingCostPerKm?: number;
  profitMargin: number;
  failureRate?: number;
  overheadPercentage?: number;
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
