"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PricingResult } from "@/lib/types";

interface Props {
  result: PricingResult | null;
}

export function PriceSummary({ result }: Props) {
  if (!result) return null;

  const productionRows = [
    { label: "Material (filamento)", value: result.materialCost },
    { label: "Energia", value: result.energyCost },
    { label: "Mão de obra de impressão", value: result.laborCost },
    { label: "Acessórios", value: result.accessoriesCost },
    { label: "Trabalho manual/modelagem", value: result.productLaborCost },
    { label: "Custos indiretos", value: result.overheadCost },
  ];

  const logisticsRows = [
    { label: "Embalagem", value: result.packagingCost },
    { label: "Entrega (frete/gasolina)", value: result.shippingCost },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultado da precificação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Produção */}
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Custos de produção
          </h4>
          <div className="space-y-1.5">
            {productionRows.map((r) => (
              <div key={r.label} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{r.label}</span>
                <span className="font-mono">{formatMoney(r.value)}</span>
              </div>
            ))}
            <div className="flex justify-between border-t pt-1.5 text-sm font-semibold">
              <span>Total produção</span>
              <span className="font-mono">
                {formatMoney(result.totalProductionCost)}
              </span>
            </div>
          </div>
        </div>

        {/* Logística */}
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Custos de logística
          </h4>
          <div className="space-y-1.5">
            {logisticsRows.map((r) => (
              <div key={r.label} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{r.label}</span>
                <span className="font-mono">{formatMoney(r.value)}</span>
              </div>
            ))}
            <div className="flex justify-between border-t pt-1.5 text-sm font-semibold">
              <span>Total logística</span>
              <span className="font-mono">
                {formatMoney(result.totalLogisticsCost)}
              </span>
            </div>
          </div>
        </div>

        {/* Preço base */}
        <div className="flex justify-between border-t pt-2 text-base font-bold">
          <span>Preço base</span>
          <span className="font-mono">{formatMoney(result.basePrice)}</span>
        </div>

        {/* Preço por meio de pagamento */}
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Preço por meio de pagamento
          </h4>
          <div className="space-y-1.5">
            {result.payments.map((p) => (
              <div key={p.method} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {p.label}{" "}
                  {p.feePercent > 0 && (
                    <span className="text-xs">(+{p.feePercent}%)</span>
                  )}
                </span>
                <span className="font-mono font-semibold text-green-600">
                  {formatMoney(p.finalPrice)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatMoney(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
