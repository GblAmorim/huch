export function productPricingReducer(
  state: ProductPricingState,
  action: ProductPricingAction,
): ProductPricingState {
  switch (action.type) {
    case "ADD_FILAMENT":
      return {
        ...state,
        printingData: {
          ...state.printingData,
          usedFilaments: [
            ...state.printingData.usedFilaments,
            {
              id: crypto.randomUUID(),
              filamentId: "",
              usedAmountG: 0,
            },
          ],
        },
      };

    default:
      return state;
  }
}
