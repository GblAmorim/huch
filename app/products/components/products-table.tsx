"use client";

import { useState } from "react";
import Link from "next/link";
import { useRecords } from "@/lib/hooks/use-records";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatMoney, formatDate } from "@/lib/utils";
import type { PricingRecord } from "@/lib/types";
import { ProductDetail } from "./product-details";

export function ProductsTable() {
  const { records, loading, reload } = useRecords();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  if (loading) {
    return <p className="text-muted-foreground">Carregando produtos...</p>;
  }

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <p className="text-muted-foreground">
          Nenhum produto precificado ainda. Faça o primeiro cálculo na página de
          precificação.
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href="/pricing">Ir para Precificação</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={reload}>
          Atualizar lista
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Peça</TableHead>
            <TableHead className="text-right">Qtd</TableHead>
            <TableHead>Filamento</TableHead>
            <TableHead className="text-right">Peso (g)</TableHead>
            <TableHead className="text-right">Tempo (h)</TableHead>
            <TableHead className="text-right">Custo total</TableHead>
            <TableHead className="text-right">Preço base</TableHead>
            <TableHead>Data</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => {
            const expanded = expandedId === record.id;
            return (
              <ProductRow
                key={record.id}
                record={record}
                expanded={expanded}
                onToggle={() => toggleExpand(record.id)}
              />
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function ProductRow({
  record,
  expanded,
  onToggle,
}: {
  record: PricingRecord;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { pieceName, printingData, result } = record;

  return (
    <>
      <TableRow onClick={onToggle} className="cursor-pointer">
        <TableCell className="font-medium">{pieceName}</TableCell>
        <TableCell className="text-right">{printingData.quantity}</TableCell>
        <TableCell>
          {printingData.filamentName}{" "}
          <span className="text-xs text-muted-foreground">
            ({formatMoney(printingData.filamentCostPerKg)}/kg)
          </span>
        </TableCell>
        <TableCell className="text-right">
          {printingData.filamentWeightG}
        </TableCell>
        <TableCell className="text-right">
          {printingData.printTimeHours}
        </TableCell>
        <TableCell className="text-right font-mono">
          {formatMoney(result.totalCost)}
        </TableCell>
        <TableCell className="text-right font-mono font-bold text-green-600">
          {formatMoney(result.basePrice)}
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">
          {formatDate(record.createdAt)}
        </TableCell>
        <TableCell className="text-right">
          <Button variant="ghost" size="sm">
            {expanded ? "Ocultar" : "Detalhes"}
          </Button>
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow>
          <TableCell colSpan={9} className="bg-muted/30 p-4">
            <ProductDetail record={record} />
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
