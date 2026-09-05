"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PrintingDataForm } from "./components/printing-data-form";
import { LaborDataForm } from "./components/product-labor-form";
import { Button } from "@/components/ui/button";
import { useProductPricing } from "@/lib/hooks/useProductPricing";
import { price } from "./price";
import { UsedAddonsList } from "./components/used-addons-list";
import { PricingResults } from "./components/pricing-results";
import { Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatMoney } from "@/lib/utils";

const ProductPricingPage = () => {
  const { state, dispatch, canCalculate } = useProductPricing();
  const [isFormOpen, setIsFormOpen] = useState(true);
  const { pricingBaselineData }: { pricingBaselineData: PricingBaseline } = {
    pricingBaselineData: {
      printer: {
        model: "Bambu Lab A1 Combo",
        value: 700000,
        lifeCycleHr: 24000,
        energyConsumptionKw: 0.3, // Depois armazenar a % para cálculo
        filamentWastePercentage: 2,
        defaultFailureChancePercentage: 15,
      },
      energy: {
        valueKwH: 84,
      },
      filaments: {
        list: [
          {
            id: "1",
            brand: "3D Prime",
            material: "PLA Basic",
            color: "Verde",
            pricePerKg: 8100,
            remainingInStockG: 500,
            note: "Filamento PLA básico da 3D Prime",
          },
          {
            id: "2",
            brand: "3D Prime",
            material: "PLA Troca de Cor",
            color: "Branco",
            pricePerKg: 6000,
            remainingInStockG: 500,
            note: "Filamento PLA básico troca de cor da 3D Prime",
          },
          {
            id: "3",
            brand: "Sunlu",
            material: "PLA Premium",
            color: "Azul",
            pricePerKg: 10000,
            remainingInStockG: 100,
            note: "Filamento PLA Premium Azul da Sunlu",
          },
          {
            id: "4",
            brand: "3D Prime",
            material: "PLA Basic",
            color: "Branco",
            pricePerKg: 8100,
            remainingInStockG: 500,
            note: "Filamento PLA básico da 3D Prime",
          },
        ],
      },
      addons: [
        {
          id: "1",
          name: "Argolas de Chaveiro",
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
        {
          id: "3",
          name: "Fita Adesiva",
          unitPrice: 10,
          type: "packing",
          purchasePrice: 4637,
          packageQuantity: 100,
          purchaseUrl: "https://example.com/fita-adesiva",
          stockQuantity: 100,
          note: "Fita adesiva para embalagem",
        },
      ],
      labor: {
        modelingLaborCostPerHour: 3000,
        postPrintingLaborCostPerHour: 1500,
      },
      logistics: {
        gasPricePerLitter: 600,
        kmPerLitter: 12,
        distanceKm: 5,
      },
      taxes: {
        riskReservePercentage: 2,
        governmentTaxPercentage: 8,
        creditCartFeePercentage: 5,
        commissionFeePercentage: 20,
        profitType: "number",
        defaultDesiredProfit: null,
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
      setIsFormOpen(false);
    } catch (error) {
      setIsFormOpen(true);
      dispatch({
        type: "CALCULATE_ERROR",
        payload: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return (
    <div className="p-6">
      <form onSubmit={handlePrice}>
        <Accordion
          type="single"
          collapsible
          disabled={state.status === "idle"}
          value={isFormOpen ? "pricing-form" : ""}
          onValueChange={(value) => setIsFormOpen(value === "pricing-form")}
        >
          <AccordionItem value="pricing-form" className="border-none">
            <Card>
              <CardHeader>
                <AccordionTrigger className="p-0 hover:no-underline">
                  <CardTitle>Precificação</CardTitle>
                </AccordionTrigger>
              </CardHeader>

              <AccordionContent>
                <CardContent>
                  <div className="space-y-4">
                    <h2>Dados da Impressão</h2>
                    <PrintingDataForm
                      baselineData={pricingBaselineData}
                      dispatch={dispatch}
                      usedFilaments={state.printingData.usedFilaments}
                    />
                    <Card>
                      <CardHeader className="relative">
                        <CardTitle>Tempo de Mão de Obra</CardTitle>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              className="absolute -top-2 right-2"
                            >
                              <Info className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent align="end" className="w-64 p-4">
                            <PopoverHeader>
                              <PopoverTitle>Custos:</PopoverTitle>
                              <PopoverDescription>
                                <p>
                                  Modelagem:{" "}
                                  {formatMoney(
                                    pricingBaselineData.labor
                                      .modelingLaborCostPerHour,
                                  )}{" "}
                                  R$/h
                                </p>
                                <p>
                                  Montagem:{" "}
                                  {formatMoney(
                                    pricingBaselineData.labor
                                      .postPrintingLaborCostPerHour,
                                  )}{" "}
                                  R$/h
                                </p>
                              </PopoverDescription>
                            </PopoverHeader>
                          </PopoverContent>
                        </Popover>
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
                  </div>
                </CardContent>
                <div className="mt-4 flex justify-center">
                  <Button
                    type="submit"
                    disabled={!canCalculate || state.status === "calculating"}
                    className="w-3/4"
                  >
                    {state.status === "calculating"
                      ? "Calculando..."
                      : "Calcular Preço"}
                  </Button>
                </div>
              </AccordionContent>
              {state.status === "error" && state.error && (
                <p className="text-sm text-destructive">{state.error}</p>
              )}
            </Card>
          </AccordionItem>
        </Accordion>
      </form>
      <PricingResults pricingResults={state.result} />
    </div>
  );
};

export default ProductPricingPage;
