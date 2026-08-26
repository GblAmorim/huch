"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  result: {
    materialCost: number;
    energyCost: number;
    laborCost: number;
    overheadCost: number;
    totalCost: number;
    finalPrice: number;
    pieceName: string;
  } | null;
}

export function PriceSummary({ result }: Props) {
  if (!result) return null;

  const rows = [
    { label: "Material", value: result.materialCost },
    { label: "Energia", value: result.energyCost },
    { label: "Mão de obra", value: result.laborCost },
    { label: "Custos indiretos", value: result.overheadCost },
    { label: "Custo total", value: result.totalCost },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultado — {result.pieceName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{r.label}</span>
            <span className="font-mono">
              {r.value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>
        ))}
        <div className="border-t pt-2 flex justify-between text-lg font-bold">
          <span>Preço final</span>
          <span className="font-mono text-green-600">
            {result.finalPrice.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
