"use client";

import { useFilaments } from "@/lib/hooks/use-filaments";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function FilamentTable() {
  const { filaments, loading } = useFilaments();

  if (loading) return <p className="text-muted-foreground">Carregando...</p>;
  if (filaments.length === 0)
    return (
      <p className="text-muted-foreground">Nenhum filamento cadastrado.</p>
    );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Marca</TableHead>
          <TableHead>Material</TableHead>
          <TableHead className="text-right">Custo/kg</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filaments.map((f) => (
          <TableRow key={f.id}>
            <TableCell className="font-medium">{f.name}</TableCell>
            <TableCell>{f.brand}</TableCell>
            <TableCell>{f.material}</TableCell>
            <TableCell className="text-right font-mono">
              {f.costPerKg.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </TableCell>
            <TableCell>{f.active ? "Ativo" : "Inativo"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
