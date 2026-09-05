"use client";

import type { PricingRecord } from "@/lib/types";
import { formatMoney } from "@/lib/utils";

const LABEL_PRODUCTION: Array<{
  key: keyof typeof import("@/lib/types");
  label: string;
}> = [];

export function ProductDetail({ record }: { record: PricingRecord }) {
  const { printingData, addons, labor, result } = record;

  const productionRows = [
    { label: "Material (filamento)", value: result.materialCost },
    { label: "Energia", value: result.energyCost },
    { label: "Mão de obra de impressão", value: result.laborCost },
    { label: "Acessórios", value: result.accessoriesCost },
    { label: "Trabalho manual/modelagem", value: result.productLaborCost },
    { label: "Custos indiretos", value: result.overheadCost },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* Produção */}
      <div className="space-y-1.5">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Custos de produção
        </h4>
        {productionRows.map((row) => (
          <div key={row.label} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{row.label}</span>
            <span className="font-mono">{formatMoney(row.value)}</span>
          </div>
        ))}
        <div className="flex justify-between border-t pt-1.5 text-sm font-semibold">
          <span>Total produção</span>
          <span className="font-mono">
            {formatMoney(result.totalProductionCost)}
          </span>
        </div>
      </div>

      {/* Logística */}
      <div className="space-y-1.5">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Custos de logística
        </h4>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Embalagem</span>
          <span className="font-mono">{formatMoney(result.packagingCost)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Entrega (frete/gasolina)
          </span>
          <span className="font-mono">{formatMoney(result.shippingCost)}</span>
        </div>
        <div className="flex justify-between border-t pt-1.5 text-sm font-semibold">
          <span>Total logística</span>
          <span className="font-mono">
            {formatMoney(result.totalLogisticsCost)}
          </span>
        </div>

        <div className="border-t pt-3">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Dados da impressão
          </h4>
          <p className="text-sm text-muted-foreground">
            {printingData.quantity} peça(s) · {printingData.filamentWeightG}g ·{" "}
            {printingData.printTimeHours}h · falha {printingData.failureRate}%
            {typeof printingData.distanceKm === "number" &&
            printingData.distanceKm > 0
              ? ` · ${printingData.distanceKm}km`
              : ""}
          </p>
        </div>
      </div>

      {/* Preços */}
      <div className="space-y-1.5">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Preço por meio de pagamento
        </h4>
        {result.payments.map((payment) => (
          <div key={payment.method} className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {payment.label}{" "}
              {payment.feePercent > 0 && (
                <span className="text-xs">(+{payment.feePercent}%)</span>
              )}
            </span>
            <span className="font-mono font-semibold text-green-600">
              {formatMoney(payment.finalPrice)}
            </span>
          </div>
        ))}
      </div>

      {/* Addons e trabalho manual */}
      {(addons.length > 0 || labor.length > 0) && (
        <div className="md:col-span-3 border-t pt-3">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {addons.length > 0 && (
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Addons
                </h4>
                <div className="space-y-1">
                  {addons.map((addon, i) => (
                    <p key={i} className="text-sm">
                      {addon.name} × {addon.quantity} —{" "}
                      <span className="font-mono">
                        {formatMoney(addon.total)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {" "}
                        (
                        {addon.type === "accessory" ? "acessório" : "embalagem"}
                        )
                      </span>
                    </p>
                  ))}
                </div>
              </div>
            )}
            {labor.length > 0 && (
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Trabalho manual
                </h4>
                <div className="space-y-1">
                  {labor.map((item, i) => (
                    <p key={i} className="text-sm">
                      {item.description} — {item.hours}h ×{" "}
                      {formatMoney(item.costPerHour)}/h ={" "}
                      <span className="font-mono">
                        {formatMoney(item.total)}
                      </span>
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
