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
import { formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Filament } from "@/lib/types";

interface FilamentTableProps {
  onEdit?: (filament: Filament) => void;
}

export function FilamentTable({ onEdit }: FilamentTableProps) {
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
          <TableHead>Ação</TableHead>
          <TableHead>Marca</TableHead>
          <TableHead>Material</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Cor</TableHead>
          <TableHead>Custo/kg</TableHead>
          <TableHead>Estoque</TableHead>
          <TableHead>Calibração</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Notas</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filaments.map((f) => (
          <TableRow key={f.id}>
            <TableCell>
              <Button
                size="icon-xs"
                type="button"
                variant="outline"
                onClick={() => onEdit?.(f)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </TableCell>
            <TableCell className="font-medium">{f.brand}</TableCell>
            <TableCell>{f.material}</TableCell>
            <TableCell>{f.type}</TableCell>
            <TableCell>{f.color}</TableCell>
            <TableCell>{formatMoney(f.pricePerKg)}</TableCell>
            <TableCell>{f.stockQuantity / 1000} Kg</TableCell>
            <TableCell>{f.calibrationFlow}</TableCell>
            <TableCell>{f.active ? "Ativo" : "Inativo"}</TableCell>
            <TableCell>{f.note}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
