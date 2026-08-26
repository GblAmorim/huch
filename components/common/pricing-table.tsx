"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Record {
  id: string;
  pieceName: string;
  filamentWeightG: number;
  printTimeHours: number;
  materialCost: number;
  finalPrice: number;
  createdAt: string;
}

export function PricingTable() {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadRecords() {
    const res = await fetch("/api/records");
    const data = await res.json();
    setRecords(data);
    setLoading(false);
  }

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        await loadRecords();
      } catch {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  if (loading)
    return <p className="text-muted-foreground">Carregando registros...</p>;
  if (records.length === 0)
    return (
      <p className="text-muted-foreground">Nenhuma peça precificada ainda.</p>
    );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Peça</TableHead>
          <TableHead className="text-right">Filamento (g)</TableHead>
          <TableHead className="text-right">Tempo (h)</TableHead>
          <TableHead className="text-right">Material</TableHead>
          <TableHead className="text-right">Preço final</TableHead>
          <TableHead>Data</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((r) => (
          <TableRow key={r.id}>
            <TableCell className="font-medium">{r.pieceName}</TableCell>
            <TableCell className="text-right">{r.filamentWeightG}</TableCell>
            <TableCell className="text-right">{r.printTimeHours}</TableCell>
            <TableCell className="text-right">
              {r.materialCost.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </TableCell>
            <TableCell className="text-right font-bold text-green-600">
              {r.finalPrice.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {new Date(r.createdAt).toLocaleDateString("pt-BR")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
