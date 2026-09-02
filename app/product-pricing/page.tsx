"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrintingDataForm } from "./components/printing-data-form";
import { LaborDataForm } from "./components/product-labor-form";
import { Button } from "@/components/ui/button";
import { useProductPricing } from "@/lib/hooks/useProductPricing";
import { price } from "./price";
import { UsedAddonsList } from "./components/used-addons-list";
import { PricingResults } from "./components/pricing-results";

const ProductPricingPage = () => {
  const { state, dispatch, canCalculate } = useProductPricing();
  const {
    pricingBaselineData,
  }: { pricingBaselineData: PricingBaseline } = {
    pricingBaselineData: {
      printer: {
        model: "Bambu Lab A1 Combo",
        value: 700000,
        lifeCycleHr: 24000,
        energyConsumptionKw: 0.3 * 0.67, // Depois armazenar a % para cálculo
        filamentWastePercentage: 2, // Exemplo de desperdício de filamento em %
      },
      energy: {
        valueKwH: 84,
      },
      filaments: {
        list: [
          {
            id: "1",
            brand: "3D Prime",
            type: "PLA Basic",
            color: "Verde",
            pricePerKg: 8100,
            remainingInStockG: 500,
            note: "Filamento PLA básico da 3D Prime",
          },
          {
            id: "2",
            brand: "3D Prime",
            type: "PLA Troca de Cor",
            color: "Branco",
            pricePerKg: 6000,
            remainingInStockG: 500,
            note: "Filamento PLA básico troca de cor da 3D Prime",
          },
          {
            id: "3",
            brand: "Sunlu",
            type: "PLA Premium",
            color: "Azul",
            pricePerKg: 10000,
            remainingInStockG: 100,
            note: "Filamento PLA Premium Azul da Sunlu",
          },
        ],
        wastePercentage: 5,
      },
      addons: [
        {
          id: "1",
          name: "Argolas de chaveiro",
          unitPrice: 21,
          type: "accessory",
          purchasePrice: 2100,
          packageQuantity: 100,
          purchaseUrl: "https://example.com/argolas-chaveiro",
          stockQuantity: 100,
          note: "Argolas de chaveiro de aço inoxidável",
        },
        {
          id: "2",
          name: "Caixa de Papelão",
          unitPrice: 115,
          type: "packing",
          purchasePrice: 11460,
          packageQuantity: 100,
          purchaseUrl: "https://example.com/caixa-papelao",
          stockQuantity: 100,
          note: "Caixa de papelão para embalagem",
        },
      ],
      labor: {
        modelingLaborCostPerHour: 3000,
        postPrintingLaborCostPerHour: 1500,
      },
      logistics: {
        gasPricePerLitter: 600,
        kmPerLitter: 12,
        distanceKm: 10,
      },
      taxes: {
        standardFailureChance: 15,
        commissionFeePercentage: 20,
        creditCartFeePercentage: 5,
        governmentTax: 8,
        profitType: "number",
        standardProfit: 1000,
        riskReservePercentage: 2,
        platformFee: 400,
      },
    },
  };

  async function handlePrice(e: React.FormEvent) {
    e.preventDefault();
    if (!canCalculate) return;
    dispatch({ type: "CALCULATE_START" });
    try {
      const result = price(state, pricingBaselineData);
      dispatch({ type: "CALCULATE_SUCCESS", payload: result });
    } catch (error) {
      dispatch({
        type: "CALCULATE_ERROR",
        payload: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return (
    <div className="space-y-6 p-6">
      <form onSubmit={handlePrice} className="space-y-4">
        <h1>Precificação de Produto</h1>
        <Card>
          <CardHeader>
            <CardTitle>Dados da Impressão</CardTitle>
          </CardHeader>
          <CardContent>
            <PrintingDataForm
              baselineData={pricingBaselineData}
              dispatch={dispatch}
              usedFilaments={state.printingData.usedFilaments}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tempo de Mão de Obra</CardTitle>
          </CardHeader>
          <CardContent>
            <LaborDataForm
              dispatch={dispatch}
              baselineData={pricingBaselineData.labor}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Embalagens e Acessórios</CardTitle>
          </CardHeader>
          <CardContent>
            <UsedAddonsList
              registeredAddons={pricingBaselineData.addons}
              dispatch={dispatch}
              usedAddons={state.usedAddons}
            />
          </CardContent>
        </Card>
        <div className="space-y-1.5"></div>
        <Button
          type="submit"
          disabled={!canCalculate || state.status === "calculating"}
          className="w-full"
        >
          {state.status === "calculating" ? "Calculando..." : "Calcular Preço"}
        </Button>
        {state.status === "error" && state.error && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}
      </form>
      <PricingResults pricingResults={state.result} />
    </div>
  );
};

export default ProductPricingPage;
