"use client";

import { PriceSummary } from "@/components/common/price-summary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PricingResult } from "@/lib/schemas";
import { useState } from "react";
import { PrintingDataForm } from "./components/printing-data-form";
import { LaborDataForm } from "./components/product-labor-form";
import { UsedAddonsForm } from "./components/used-addons-form";
import { Button } from "@/components/ui/button";

const PriceProductPage = () => {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    // const res = await fetch("/api/pricing", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     productName,
    //     printTimeMinutes: totalPrintTimeMinutes,
    //     desiredProfit: parseFloat(desiredProfit),
    //     piecesQuantity: parseInt(piecesQuantity),
    //     failureChance: parseInt(failureChance),
    //     selectedFilament,
    //     filamentToPrintG: filamentUsedG,
    //     modelingTimeMinutes: totalModelingTimeMinutes,
    //     modelingLaborCost: parseFloat(modelingLaborCost),
    //     postPrintTimeMinutes: totalPostPrintTimeMinutes,
    //     postPrintLaborCost: parseFloat(postPrintLaborCost),
    //     accessoryName,
    //     accessoryUnitPrice: parseFloat(accessoryUnitPrice),
    //     accessoryQuantity: parseInt(accessoryQuantity),
    //   }),
    // });

    // if (res.ok) {
    //   const data = await res.json();
    //   onCalculated({ ...data, productName });
    //   toast.success("Preço calculado e salvo!");
    //   setProductName("");
    //   setPrintTimeHours("");
    //   setPrintTimeMinutes("");
    //   setDesiredProfit("");
    //   setPiecesQuantity("");
    //   setFailureChance("");
    //   setSelectedFilament("");
    //   setFilamentToPrintG("");
    //   setModelingTimeHours("");
    //   setModelingTimeMinutes("");
    //   setModelingLaborCost("");
    //   setPostPrintTimeHours("");
    //   setPostPrintTimeMinutes("");
    //   setPostPrintLaborCost("");
    //   setAccessoryName("");
    //   setAccessoryUnitPrice("");
    //   setAccessoryQuantity("");
    // } else {
    //   const err = await res.json();
    //   toast.error(err.error ?? "Erro ao calcular preço");
    // }
    setLoading(false);
  }

  return (
    <div className="space-y-6 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1>Precificação de Produto</h1>
        <Card>
          <CardHeader>
            <CardTitle>Dados da Impressão</CardTitle>
          </CardHeader>
          <CardContent>
            <PrintingDataForm />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Mão de Obra</CardTitle>
          </CardHeader>
          <CardContent>
            <LaborDataForm />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Embalagem e Acessórios</CardTitle>
          </CardHeader>
          <CardContent>
            <UsedAddonsForm />
          </CardContent>
        </Card>
        <div className="space-y-1.5"></div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Calculando..." : "Calcular Preço"}
        </Button>
      </form>
    </div>
  );
};

export default PriceProductPage;
