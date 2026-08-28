import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

type Props = {
  addon: UsedAddon;
  index: number;
  registeredAddons: RegisteredAddons[];
  onUpdate: (field: Partial<UsedAddon>) => void;
  onRemove: () => void;
  canRemove: boolean;
};

export const UsedAddonItem = React.memo(function UsedAddonItem({
  addon,
  index,
  registeredAddons,
  onUpdate,
  onRemove,
  canRemove,
}: Props) {
  const addonSelected = registeredAddons.find((a) => a.id === addon.addonId);

  return (
    <div className="space-y-1.5">
      <div className="flex gap-4">
        <div className="space-y-1.5">
          <Label>Complemento {index + 1}</Label>
          {/* <div className="flex items-center justify-between gap-1">
            <span>Nome</span>
            <span>Estoque</span>
            <span>R$/Un</span>
          </div> */}
          <Select
            value={addon.addonId}
            onValueChange={(value) => onUpdate({ addonId: value })}
          >
            <SelectTrigger className="w-55">
              {addonSelected ? (
                <span className="overflow-auto whitespace-nowrap">
                  {addonSelected.name}
                </span>
              ) : (
                <SelectValue placeholder="Selecione o complemento"></SelectValue>
              )}
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                {registeredAddons.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name} - Estoque: {a.stockQuantity} - {a.unitPrice} R$/Un
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="usedAddonQuantity">Usados</Label>
          <Input
            id="usedAddonQuantity"
            type="number"
            step="1"
            placeholder="Usados: 1"
            value={addon.quantity}
            onChange={(e) =>
              onUpdate({ quantity: parseFloat(e.target.value) || 1 })
            }
          />
        </div>
      </div>
      {canRemove && (
        <Button size="xs" variant="destructive" onClick={onRemove}>
          Remover
        </Button>
      )}
    </div>
  );
});
// se o addon não estiver registrado, possibilitar cadastro ou semicadastro
