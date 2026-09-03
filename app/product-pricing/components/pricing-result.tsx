import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  result: PricingResult;
};

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
      className={`flex min-w-0 flex-wrap items-start justify-between gap-x-4 gap-y-1 py-1 text-sm ${bold ? "font-semibold" : ""}`}
    >
      <span className="min-w-0 flex-1 whitespace-normal wrap-break-word text-muted-foreground">
        {label}
      </span>
      <span className="shrink-0 text-right">{value}</span>
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

  const accessoryTotal = addonsCosts.oneByOne
    .filter((addon) => addon.type === "accessory")
    .reduce((total, addon) => total + addon.cost, 0);

  const packingTotal = addonsCosts.oneByOne
    .filter((addon) => addon.type === "packing")
    .reduce((total, addon) => total + addon.cost, 0);

  return (
    <div className="space-y-4 mt-4">
      <h2 className="text-lg font-semibold">Preços de venda</h2>
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-primary">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm text-muted-foreground">
              Plataforma
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-primary">
              {formatMoney(finalPrices.finalPlatformPrice)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm text-muted-foreground">
              Cart. Crédito
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">
              {formatMoney(finalPrices.finalPriceCreditCard)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm text-muted-foreground">Pix</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">
              {formatMoney(finalPrices.finalPricePix)}
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detalhamento dos Custos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              Filamentos
            </p>
            <Row
              label={`Subtotal (${filamentCosts.totalFilamentWithWasteG.toFixed(1)}g)`}
              value={formatMoney(filamentCosts.totalFilamentWithWasteCost)}
              bold
            />
            <Accordion type="single" collapsible>
              <AccordionItem value="filament-details">
                <AccordionTrigger>Detalhes</AccordionTrigger>
                <AccordionContent>
                  {filamentCosts.oneByOne.map((filament, index) => (
                    <div key={index}>
                      <Row
                        label={`Filamento ${index + 1} (${filament.usedAmountG}g, ${formatMoney(filament.pricePerKg)}/Kg)`}
                        value={formatMoney(filament.cost)}
                      />
                      <Row
                        label={`Desperdício ${index + 1} (${filament.wasteG}g)`}
                        value={formatMoney(filament.wasteCost)}
                      />
                      <Row
                        label={`Total ${index + 1} (${filament.filamentWithWasteG}g)`}
                        value={formatMoney(filament.filamentWithWasteCost)}
                      />
                      <div className="border-t" />
                    </div>
                  ))}
                  <Row
                    label={`Material (${filamentCosts.totalFilamentG.toFixed(2)}g)`}
                    value={formatMoney(filamentCosts.totalFilamentCost)}
                  />
                  <Row
                    label={`Desperdício (${filamentCosts.totalFilamentWasteG.toFixed(2)}g)`}
                    value={formatMoney(filamentCosts.totalFilamentWasteCost)}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="border-t" />

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              Impressão
            </p>
            <Row
              label="Depreciação da impressora"
              value={formatMoney(printingCosts.depreciationCost)}
            />
            <Row
              label="Energia elétrica"
              value={formatMoney(printingCosts.energyCost)}
            />
            <Row
              label="Risco de falhas"
              value={formatMoney(printingCosts.failureCost)}
            />
            <Row label="Subtotal" value={formatMoney(printingTotal)} bold />
          </div>

          <div className="border-t" />

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              Mão de Obra
            </p>
            <Row
              label="Modelagem/Customização"
              value={formatMoney(laborCosts.modelingLaborCost)}
            />
            <Row
              label="Trabalho Pós-impressão"
              value={formatMoney(laborCosts.postPrintingLaborCost)}
            />
            <Row label="Subtotal" value={formatMoney(laborTotal)} bold />
          </div>

          <div className="border-t" />

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              Acessórios e Peças Adicionais
            </p>
            {addonsCosts.oneByOne
              .filter((addon) => addon.type === "accessory")
              .map((addon, index) => (
                <Row
                  key={`${addon.name}-${index}`}
                  label={`${index + 1}. ${addon.name} (${formatMoney(addon.unitPrice)})`}
                  value={formatMoney(addon.cost)}
                />
              ))}
            <Row label="Subtotal" value={formatMoney(accessoryTotal)} bold />
          </div>

          <div className="border-t" />
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
            Custo Logístico
          </p>

          <div>
            <Row
              label="Total embalagens"
              value={formatMoney(packingTotal)}
              bold
            />
            <Row
              label={`Transporte (Por peça ~${formatMoney(result.transportCost / result.piecesQuantity)})`}
              value={formatMoney(result.transportCost)}
            />
            <Row
              label="Subtotal"
              value={formatMoney(result.logisticCosts)}
              bold
            />
            <Accordion type="single" collapsible>
              <AccordionItem value="packing-details">
                <AccordionTrigger>Detalhes</AccordionTrigger>
                <AccordionContent>
                  {addonsCosts.oneByOne
                    .filter((addon) => addon.type === "packing")
                    .map((addon, index) => (
                      <Row
                        key={`${addon.name}-${index}`}
                        label={`${index + 1}. ${addon.name} (${formatMoney(addon.unitPrice)})`}
                        value={formatMoney(addon.cost)}
                      />
                    ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="border-t" />

          <div>
            <Row
              label="Custo Total de Produção"
              value={formatMoney(result.totalProductionCost)}
              bold
            />
            <Row
              label="Custo Total Produção e Envio"
              value={formatMoney(
                result.totalProductionCostWithLogisticsAndPacking,
              )}
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
