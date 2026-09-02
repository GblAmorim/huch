import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    laborCosts.modelingLaborCost + laborCosts.totalPostPrintingLaborCost;

  const accessoryTotal = addonsCosts.oneByOne
    .filter((addon) => addon.type === "accessory")
    .reduce((total, addon) => total + addon.cost, 0);

  const packingTotal = addonsCosts.oneByOne
    .filter((addon) => addon.type === "packing")
    .reduce((total, addon) => total + addon.cost, 0);

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
            <Accordion type="single" collapsible>
              <AccordionItem value="filament-details" className="border-none">
                <AccordionTrigger
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "w-auto font-medium no-underline hover:no-underline"
                  )}
                >
                  Ver detalhes
                </AccordionTrigger>
                <AccordionContent>
                  {filamentCosts.oneByOne.map((filament, index) => (
                    <div key={index}>
                      <Row
                        label={`Filamento ${index + 1} (${filament.usedAmountG}g, ${fmt(filament.pricePerKg)}/Kg)`}
                        value={fmt(filament.cost)}
                      />
                      <Row
                        label={`Desperdício ${index + 1} (${filament.wasteG}g)`}
                        value={fmt(filament.wasteCost)}
                      />
                      <Row
                        label={`Total ${index + 1} (${filament.filamentWithWasteG}g)`}
                        value={fmt(filament.filamentWithWasteCost)}
                      />
                    </div>
                  ))}
                  <Row
                    label={`Material (${filamentCosts.totalFilamentG.toFixed(2)}g)`}
                    value={fmt(filamentCosts.totalFilamentCost)}
                  />
                  <Row
                    label={`Desperdício (${filamentCosts.totalFilamentWasteG.toFixed(2)}g)`}
                    value={fmt(filamentCosts.totalFilamentWasteCost)}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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
              label="Modelagem/Customização"
              value={fmt(laborCosts.modelingLaborCost)}
            />
            <Row
              label="Trabalho Pós-impressão por Peça"
              value={fmt(laborCosts.postPrintingLaborOnePieceCost)}
            />
            <Row
              label="Trabalho Pós-impressão Total"
              value={fmt(laborCosts.totalPostPrintingLaborCost)}
            />
            <Row label="Subtotal mão de obra" value={fmt(laborTotal)} bold />
          </div>

          <div className="border-t" />

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              Acessórios e Embalagens
            </p>
            <Accordion type="single" collapsible>
              <AccordionItem value="addons-details" className="border-none">
                <AccordionTrigger
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "w-auto font-medium no-underline hover:no-underline",
                  )}
                >
                  Ver detalhes
                </AccordionTrigger>
                <AccordionContent>
                  {addonsCosts.oneByOne.map((addon, index) => (
                    <Row
                      key={index}
                      label={`${addon.type === "accessory" ? "Acessório" : "Embalagem"
                        }: ${addon.name}`}
                      value={fmt(addon.cost)}
                    />
                  ))}
                  <Row label="Total de acessórios" value={fmt(accessoryTotal)} />
                  <Row label="Total de embalagens" value={fmt(packingTotal)} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Row
              label="Total acessórios / embalagens"
              value={fmt(addonsCosts.totalAddonsCost)}
              bold
            />
          </div>

          <div className="border-t" />
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
            Custo Logístico
          </p>

          <div>
            <Row
              label="Total de embalagens"
              value={fmt(result.packingAddonsCost)}
            />
            <Row
              label="Transporte (todas as peças)"
              value={fmt(result.transportCost)}
            />
            <Row
              label="Transporte (por peça)"
              value={fmt(result.transportCost / result.piecesQuantity)}
            />
            <Row
              label="Total logística e embalagens"
              value={fmt(result.logisticCosts)}
              bold
            />
          </div>

          <div className="border-t" />

          <div>
            <Row
              label="Custo Total de Produção"
              value={fmt(result.totalProductionCost)}
              bold
            />
            <Row
              label="Custo Total Produção e Envio"
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
    </div >
  );
}
