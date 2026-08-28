import { useReducer, useMemo } from "react";
import { productPricingReducer } from "@/app/product-pricing/reducer";
import { initialState } from "@/app/product-pricing/initialState";

export function usePricingBaseline() {
  const [state, dispatch] = useReducer(productPricingReducer, initialState);

  const canCalculate = useMemo(() => {
    if (state.status === "calculating") return false;
    if (!state.productName.trim()) return false;
    if (state.printingData.printTimeMinutes <= 0) return false;
    if (state.printingData.usedFilaments.length === 0) return false;
    if (
      state.printingData.usedFilaments.some(
        (f) => !f.filamentId || f.usedAmountG <= 0,
      )
    )
      return false;
    return true;
  }, [state.productName, state.printingData, state.status]);

  const canSave = state.status === "calculated" && state.result !== null;

  return { state, dispatch, canCalculate, canSave };
}
