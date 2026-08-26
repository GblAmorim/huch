import { useReducer, useMemo } from "react";
import { productPricingReducer } from "./reducer";
import { initialState } from "./initialState";
import { ProductPricingState, ProductPricingAction } from "./types";

export function useProductPricing() {
  const [state, dispatch] = useReducer(productPricingReducer, initialState);

  const canCalculate = useMemo(() => {
    if (state.status === "calculating") return false;
    if (!state.produtoNome.trim()) return false;
    if (state.dadosImpressao.tempoImpressaoHoras <= 0) return false;
    if (state.dadosImpressao.filamentos.length === 0) return false;
    if (
      state.dadosImpressao.filamentos.some(
        (f) => !f.filamentoId || f.gramas <= 0,
      )
    )
      return false;
    return true;
  }, [state.produtoNome, state.dadosImpressao, state.status]);

  const canSave = state.status === "calculated" && state.result !== null;

  return { state, dispatch, canCalculate, canSave };
}
