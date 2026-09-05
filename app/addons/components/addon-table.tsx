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

export function AddonTable() {
  const { addons, loading } = useAddons();

  if (loading) return <p className="text-muted-foreground">Carregando...</p>;
  if (addons.length === 0)
    return <p className="text-muted-foreground">Nenhum addon cadastrado.</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead className="text-right">Custo unitário</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {addons.map((a) => (
          <TableRow key={a.id}>
            <TableCell className="font-medium">{a.name}</TableCell>
            <TableCell>
              {a.type === "accessory"
                ? "Acessório (produção)"
                : "Embalagem (logística)"}
            </TableCell>
            <TableCell className="text-right font-mono">
              {a.costPerUnit.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </TableCell>
            <TableCell>{a.active ? "Ativo" : "Inativo"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
