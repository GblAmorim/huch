export const initialState: ProductPricingState = {
  productName: "Teste",
  desiredProfit: 10,
  printingData: {
    printTimeHours: 14,
    printTimeMinutes: 36,
    totalPrintTimeMinutes: 0,
    piecesQuantity: 60,
    usedFilaments: [
      { id: crypto.randomUUID(), filamentId: "1", usedAmountG: 405 },
      { id: crypto.randomUUID(), filamentId: "4", usedAmountG: 13 }
    ],
    failureChancePercentage: 15,
  },
  productLabor: {
    modelingTimeHours: 1,
    modelingTimeMinutes: 0,
    totalModelingTimeMinutes: 0,
    postPrintTimeHours: 0,
    postPrintTimeMinutes: 10,
    totalPostPrintTimeMinutes: 0,
  },
  usedAddons: [{ id: crypto.randomUUID(), type: "accessory", addonId: "1", quantity: 60 }],
  status: "idle",
  result: null,
  error: null,
};
