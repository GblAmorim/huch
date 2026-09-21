"use client";

import { useAddons } from "@/lib/hooks/use-addons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatBRL } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Addon } from "@/lib/types";

interface AddonTableProps {
  onEdit?: (addon: Addon) => void;
}

export function AddonTable({ onEdit }: AddonTableProps) {
  const { addons, loading } = useAddons();

  if (loading) return <p className="text-muted-foreground">Carregando...</p>;
  if (addons.length === 0)
    return (
      <p className="text-muted-foreground">Nenhum adicional cadastrado.</p>
    );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ação</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead className="text-right">Custo Unitário</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Estoque</TableHead>
          <TableHead>Tipo de Uso</TableHead>
          <TableHead>Qtd Utilizada</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {addons.map((addon) => (
          <TableRow key={addon.id}>
            <TableCell>
              <Button
                size="icon-xs"
                type="button"
                variant="outline"
                onClick={() => onEdit?.(addon)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </TableCell>
            <TableCell className="font-medium">{addon.name}</TableCell>
            <TableCell className="text-right font-mono">
              {formatBRL(addon.estimatedCostPerProduct, 2)}
            </TableCell>
            <TableCell>
              {addon.type === "accessory" ? "Acessório" : "Embalagem"}
            </TableCell>
            <TableCell>
              {addon.stockQuantity} {addon.containedUnit}
            </TableCell>
            <TableCell>
              {addon.consumptionType === "estimated"
                ? "Estimado"
                : addon.consumptionType === "exact"
                  ? "Exato"
                  : "Por Pedido"}
            </TableCell>
            <TableCell>
              {addon.quantityUsed} {addon.consumptionUnit}
            </TableCell>
            <TableCell>{addon.active ? "Ativo" : "Inativo"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
