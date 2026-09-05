"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  dispatch: React.Dispatch<ProductPricingAction>;
  registeredAddons: PricingBaseline["addons"];
}

export function UsedAddonsForm({ dispatch, registeredAddons }: Props) {
  const [accessoryName, setAccessoryName] = useState("");
  const [accessoryUnitPrice, setAccessoryUnitPrice] = useState("");
  const [accessoryQuantity, setAccessoryQuantity] = useState("");

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
