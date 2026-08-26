export const initialState: ProductPricingState = {
  productName: "",
  desiredProfit: 0,
  printingData: {
    printTimeHours: 0,
    printTimeMinutes: 0,
    piecesQuantity: 1,
    usedFilaments: [
      { id: crypto.randomUUID(), filamentId: "", usedAmountG: 0 },
    ],
    failureChancePercentage: 0,
  },
  productLabor: {
    modelingTimeHours: 0,
    modelingTimeMinutes: 0,
    postPrintTimeHours: 0,
    postPrintTimeMinutes: 0,
  },
  addons: {
    addons: [{ id: crypto.randomUUID(), addonId: "", quantity: 0 }], // começa vazio — pode não ter addons
  },
  status: "idle",
  result: null,
  error: null,
};
