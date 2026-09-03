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
    filamentWastePercentage: number;
    defaultFailureChancePercentage: number | null;
  };
  energy: {
    valueKwH: number;
  };
  taxes: {
    profitType: "percentage" | "number";
    defaultDesiredProfit: number | null;
    creditCartFeePercentage: number;
    commissionFeePercentage: number;
    governmentTaxPercentage: number;
    riskReservePercentage: number;
    platformFee: number;
  };
  filaments: {
    list: RegisteredFilament[];
  };
  logistics: {
    gasPricePerLitter: number;
    kmPerLitter: number;
    distanceKm: number;
  };
  labor: {
    modelingLaborCostPerHour: number;
    postPrintingLaborCostPerHour: number;
  };
  addons: RegisteredAddons[];
};

type UsedFilament = {
  id: string;
  filamentId: string;
  usedAmountG: number;
};

type UsedAddon = {
  id: string;
  type: "accessory" | "packing";
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
  totalPostPrintTimeMinutes: number;
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
    oneByOne: {
      cost: number;
      wasteG: number;
      wasteCost: number;
      filamentWithWasteCost: number;
      filamentWithWasteG: number;
      usedAmountG: number;
      pricePerKg: number;
    }[];
    totalFilamentG: number;
    totalFilamentCost: number;
    totalFilamentWasteG: number;
    totalFilamentWithWasteG: number;
    totalFilamentWasteCost: number;
    totalFilamentWithWasteCost: number;
  };
  printingCosts: {
    depreciationCost: number;
    energyCost: number;
    failureCost: number;
  };
  fixedCosts: number;
  laborCosts: {
    modelingLaborCost: number;
    postPrintingLaborCost: number;
  };
  addonsCosts: {
    totalAddonsCost: number;
    oneByOne: {
      name: string;
      cost: number;
      type: "accessory" | "packing";
      unitPrice: number;
    }[];
  };
  packingAddonsCost: number;
  piecesQuantity: number;
  transportCost: number;
  logisticCosts: number;
  totalProductionCost: number;
  totalProductionCostWithLogisticsAndPacking: number;
  taxes: number;
  finalPrices: {
    finalPlatformPrice: number;
    finalPriceCreditCard: number;
    finalPricePix: number;
  };
  details: PricingDetails[];
};

type PricingDetails = {
  label: string;
  value: number;
  formula?: string;
};

type ProductPricingAction =
  | {
      type: "UPDATE_PRINTING_DATA";
      payload: { field: Partial<PrintingData> };
    }
  | {
      type: "UPDATE_PRODUCT_LABOR";
      payload: { field: Partial<ProductLabor> };
    }
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
