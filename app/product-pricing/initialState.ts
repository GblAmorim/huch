export const initialState: ProductPricingState = {
  productName: "",
  desiredProfit: 0,
  printingData: {
    printTimeHours: 0,
    printTimeMinutes: 0,
    totalPrintTimeMinutes: 0,
    piecesQuantity: 1,
    usedFilaments: [
      { id: crypto.randomUUID(), filamentId: "", usedAmountG: 0 },
    ],
    failureChancePercentage: 0,
  },
  productLabor: {
    modelingTimeHours: 0,
    modelingTimeMinutes: 0,
    totalModelingTimeMinutes: 0,
    postPrintTimeHours: 0,
    postPrintTimeMinutes: 0,
    postPrintTotalTimeMinutes: 0,
  },
  usedAddons: [{ id: crypto.randomUUID(), addonId: "", quantity: 0 }],
  status: "idle",
  result: null,
  error: null,
};
