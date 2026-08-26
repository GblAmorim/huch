type RegisteredFilament = {
  id: string;
  brand: string;
  type: string;
  color: string;
  pricePerKg: number;
  remainingInStockG: number;
  note: string;
};

type RegisteredAddons = {
  id: string;
  name: string;
  unitPrice: number;
  type: "accessory" | "packing";
  purchasePrice: number;
  packageQuantity: number;
  purchaseUrl: string;
  stockQuantity: number;
  note: string;
};

type PricingBaseline = {
  printer: {
    model: string;
    value: number;
    energyConsumptionKw: number;
    lifeCycleHr: number;
  };
  energy: {
    valueKwH: number;
  };
  taxes: {
    standardFailureChance: number;
    profitType: "percentage" | "number";
    standardProfit: number;
    creditCartFeePercentage: number;
    commissionFeePercentage: number;
    governmentTax: number;
    platformFee: number;
    riskReservePercentage: number;
  };
  filaments: RegisteredFilament[];
  addons: RegisteredAddons[];
  labor: {
    modelingLaborCostPerHour: number;
    postPrintingLaborCostPerHour: number;
  };
};

type UsedFilament = {
  id: string;
  filamentId: string;
  usedAmountG: number;
};

type UsedAddon = {
  id: string;
  addonId: string;
  quantity: number;
};

type PrintingData = {
  printTimeHours: number;
  printTimeMinutes: number;
  usedFilaments: UsedFilament[];
  piecesQuantity: number;
  failureChancePercentage: number;
};

type ProductLabor = {
  modelingTimeHours: number;
  modelingTimeMinutes: number;
  postPrintTimeHours: number;
  postPrintTimeMinutes: number;
};

type Addons = {
  addons: UsedAddon[];
};

type ProductPricingState = {
  productName: string;
  desiredProfit: number;
  printingData: PrintingData;
  productLabor: ProductLabor;
  addons: Addons;
  status: "idle" | "calculating" | "calculated" | "saving" | "saved" | "error";
  result: PricingResult | null;
  error: string | null;
};

type PricingResult = {
  filamentCost: number;
  energyCost: number;
  depreciationCost: number;
  laborCost: number;
  addonsCost: number;
  failureCost: number;
  totalProductionCost: number;
  taxes: number;
  profit: number;
  finalPrice: number;
  details: PricingDetails[];
};

type PricingDetails = {
  label: string;
  value: number;
  formula?: string;
};

type ProductPricingAction =
  | { type: "ADD_FILAMENT" }
  | { type: "REMOVE_FILAMENT"; payload: { id: string } }
  | {
      type: "UPDATE_FILAMENT";
      payload: { id: string; field: Partial<UsedFilament> };
    };
