"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { PricingResult } from "@/lib/schemas";

interface Props {
  onCalculated: (result: PricingResult & { productName: string }) => void;
}

export function UsedAddonsForm({ onCalculated }: Props) {
  const [accessoryName, setAccessoryName] = useState("");
  const [accessoryUnitPrice, setAccessoryUnitPrice] = useState("");
  const [accessoryQuantity, setAccessoryQuantity] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!accessoryName || accessoryName.trim() === "") {
      toast.error("Nome do acessório inválido");
      return;
    }
    if (
      isNaN(parseFloat(accessoryUnitPrice)) ||
      parseFloat(accessoryUnitPrice) < 0
    ) {
      toast.error("Custo unitário do acessório inválido");
      return;
    }
    if (
      isNaN(parseInt(accessoryQuantity)) ||
      parseInt(accessoryQuantity) <= 0
    ) {
      toast.error("Quantidade do acessório inválida");
      return;
    }

    const res = await fetch("/api/pricing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accessoryName,
        accessoryUnitPrice: parseFloat(accessoryUnitPrice),
        accessoryQuantity: parseInt(accessoryQuantity),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      onCalculated({ ...data, productName });
      toast.success("Preço calculado e salvo!");
      setAccessoryName("");
      setAccessoryUnitPrice("");
      setAccessoryQuantity("");
    } else {
      const err = await res.json();
      toast.error(err.error ?? "Erro ao calcular preço");
    }
  }

  return (
    <div>
      <div className="space-y-1.5">
        <div className="flex gap-2">
          <div className="space-y-1.5">
            <Label htmlFor="accessoryName">Nome</Label>
            <Input
              className="w-35 overflow-auto whitespace-nowrap"
              id="accessoryName"
              type="text"
              placeholder="Ex: Caixa de papelão"
              value={accessoryName}
              onChange={(e) => setAccessoryName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="accessoryUnitPrice">Custo Un (R$)</Label>
            <Input
              id="accessoryUnitPrice"
              type="number"
              step="0.01"
              placeholder="5,00"
              value={accessoryUnitPrice}
              onChange={(e) => setAccessoryUnitPrice(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="accessoryQuantity">Quantidade</Label>
            <Input
              id="accessoryQuantity"
              type="number"
              step="1"
              placeholder="5"
              value={accessoryQuantity}
              onChange={(e) => setAccessoryQuantity(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
