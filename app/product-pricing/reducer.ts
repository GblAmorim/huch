import { initialState } from "./initialState";

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

    case "REMOVE_FILAMENT":
      return {
        ...state,
        printingData: {
          ...state.printingData,
          usedFilaments: state.printingData.usedFilaments.filter(
            (filament) => filament.id !== action.payload.id,
          ),
        },
      };

    case "UPDATE_FILAMENT":
      return {
        ...state,
        printingData: {
          ...state.printingData,
          usedFilaments: state.printingData.usedFilaments.map((f) =>
            f.id === action.payload.id ? { ...f, ...action.payload.field } : f,
          ),
        },
      };

    case "ADD_ADDON":
      return {
        ...state,
        usedAddons: [
          ...state.usedAddons,
          {
            id: crypto.randomUUID(),
            addonId: "",
            quantity: 0,
          },
        ],
      };

    case "REMOVE_ADDON":
      return {
        ...state,
        usedAddons: state.usedAddons.filter(
          (addon) => addon.id !== action.payload.id,
        ),
      };

    case "UPDATE_ADDON":
      return {
        ...state,
        usedAddons: state.usedAddons.map((a) =>
          a.id === action.payload.id ? { ...a, ...action.payload.field } : a,
        ),
      };

    case "CALCULATE_START":
      return { ...state, status: "calculating", error: null, result: null };

    case "CALCULATE_SUCCESS":
      return { ...state, status: "calculated", result: action.payload };

    case "CALCULATE_ERROR":
      return { ...state, status: "error", error: action.payload };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}
