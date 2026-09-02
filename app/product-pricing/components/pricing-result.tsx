import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  result: PricingResult;
};

function fmt(centavos: number): string {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div
      className={`flex justify-between py-1 text-sm ${bold ? "font-semibold" : ""}`}
    >
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}

export function PricingResult({ result }: Props) {
  const { filamentCosts, printingCosts, laborCosts, addonsCosts, finalPrices } =
    result;

  const printingTotal =
    printingCosts.depreciationCost +
    printingCosts.energyCost +
    printingCosts.failureCost;

  const laborTotal =
    laborCosts.modelingLaborCost + laborCosts.postPrintingLaborCost;

  return (
    <div className="space-y-4">
      {/* Preços de venda */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-primary">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm text-muted-foreground">
              Plataforma
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">
              {fmt(finalPrices.finalPlatformPrice)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm text-muted-foreground">
              Cartão de Crédito
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {fmt(finalPrices.finalPriceCreditCard)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm text-muted-foreground">Pix</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {fmt(finalPrices.finalPricePix)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detalhamento de custos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detalhamento dos Custos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              Filamentos
            </p>
            {filamentCosts.oneByOne.map((filament, index) => (
              <Row
                key={index}
                label={`Filamento ${index + 1} (${filament.usedAmountG}g, ${fmt(filament.pricePerKg)}/Kg)`}
                value={fmt(filament.filamentWithWasteCost)}
              />
            ))}
            <Row
              label={`Material (${filamentCosts.totalFilamentG.toFixed(1)}g)`}
              value={fmt(filamentCosts.totalFilamentCost)}
            />
            <Row
              label={`Desperdício (${filamentCosts.totalFilamentWasteG.toFixed(1)}g)`}
              value={fmt(filamentCosts.totalFilamentWasteCost)}
            />
            <Row
              label={`Total c/ desperdício (${filamentCosts.totalFilamentWithWasteG.toFixed(1)}g)`}
              value={fmt(filamentCosts.totalFilamentWithWasteCost)}
              bold
            />
          </div>

          <div className="border-t" />

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              Impressão
            </p>
            <Row
              label="Depreciação da impressora"
              value={fmt(printingCosts.depreciationCost)}
            />
            <Row label="Energia elétrica" value={fmt(printingCosts.energyCost)} />
            <Row label="Risco de falhas" value={fmt(printingCosts.failureCost)} />
            <Row label="Subtotal impressão" value={fmt(printingTotal)} bold />
          </div>

          <div className="border-t" />

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              Mão de Obra
            </p>
            <Row
              label="Modelagem 3D"
              value={fmt(laborCosts.modelingLaborCost)}
            />
            <Row
              label="Pós-processamento"
              value={fmt(laborCosts.postPrintingLaborCost)}
            />
            <Row label="Subtotal mão de obra" value={fmt(laborTotal)} bold />
          </div>

          <div className="border-t" />

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              Acessórios e Embalagens
            </p>
            <Row
              label="Total acessórios / embalagens"
              value={fmt(addonsCosts.totalAddonsCost)}
              bold
            />
          </div>

          <div className="border-t" />

          <div>
            <Row
              label="Custo logístico"
              value={fmt(result.logisticCosts)}
            />
            <Row
              label="Custo total de produção"
              value={fmt(result.totalProductionCost)}
              bold
            />
            <Row
              label="Custo total c/ logística e embalagem"
              value={fmt(result.totalProductionCostWithLogisticsAndPacking)}
              bold
            />
          </div>

          <div className="border-t" />

          <Row
            label={`Margem de impostos e taxas`}
            value={`${result.taxes.toFixed(2)}%`}
            bold
          />
        </CardContent>
      </Card>
    </div>
  );
}
