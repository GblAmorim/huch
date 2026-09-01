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
    filamentWastePercentage: number
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
  filaments: {
    list: RegisteredFilament[];
    wastePercentage: number;
  };
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
  totalPrintTimeMinutes: number;
  usedFilaments: UsedFilament[];
  piecesQuantity: number;
  failureChancePercentage: number;
};

type ProductLabor = {
  modelingTimeHours: number;
  modelingTimeMinutes: number;
  totalModelingTimeMinutes: number;
  postPrintTimeHours: number;
  postPrintTimeMinutes: number;
  postPrintTotalTimeMinutes: number;
};

type ProductPricingState = {
  productName: string;
  desiredProfit: number;
  printingData: PrintingData;
  productLabor: ProductLabor;
  usedAddons: UsedAddon[];
  status: "idle" | "calculating" | "calculated" | "saving" | "saved" | "error";
  result: PricingResult | null;
  error: string | null;
};

type PricingResult = {
  filamentCosts: {
    oneByOne: [
      {
        cost: number;
        wasteG: number;
        wasteCost: number;
        filamentWithWasteCost: number;
        filamentWithWasteG: number;
        usedAmountG: number;
        pricePerKg: number;
      }
    ]
    totalFilamentG: number;
    totalFilamentCost: number;
    totalFilamentWasteG: number;
    totalFilamentWithWasteG: number;
    totalFilamentWasteCost: number;
    totalFilamentWithWasteCost: number;
  }
  printerCosts: {
    depreciationCost: number;
    energyCost: number;
    failureChanceCost: number;
  }
  laborCosts: {
    modelingLaborCost: number;
    postPrintingLaborCost: number;
  }
  addonsCosts: {
    totalAddonsCost: number;
    oneByOne: [
      {
        cost: number;
      }
    ]
  };
  fixedCosts: number;
  logisticCosts: number;
  totalProductionCost: number;
  totalProductionCostWithLogisticsAndPacking: number;
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
  }
  | { type: "ADD_ADDON" }
  | { type: "REMOVE_ADDON"; payload: { id: string } }
  | {
    type: "UPDATE_ADDON";
    payload: { id: string; field: Partial<UsedAddon> };
  }
  | { type: "CALCULATE_START" }
  | { type: "CALCULATE_SUCCESS"; payload: PricingResult }
  | { type: "CALCULATE_ERROR"; payload: string }
  | { type: "RESET" };
