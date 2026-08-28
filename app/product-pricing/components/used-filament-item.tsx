import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

type Props = {
  filament: UsedFilament;
  index: number;
  registeredFilaments: RegisteredFilament[];
  onUpdate: (field: Partial<UsedFilament>) => void;
  onRemove: () => void;
  canRemove: boolean;
};

export const UsedFilamentItem = React.memo(function UsedFilamentItem({
  filament,
  index,
  registeredFilaments,
  onUpdate,
  onRemove,
  canRemove,
}: Props) {
  const filamentSelected = registeredFilaments.find(
    (f) => f.id === filament.filamentId,
  );

  const filamentBrands = [...new Set(registeredFilaments.map((f) => f.brand))];

  return (
    <div className="space-y-1.5">
      <div className="flex gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="filamentForPrint">Filamento {index + 1}</Label>
          <Select
            value={filament.filamentId}
            onValueChange={(value) => onUpdate({ filamentId: value })}
          >
            <SelectTrigger className="w-55">
              {filamentSelected ? (
                <span className="overflow-auto whitespace-nowrap">
                  {filamentSelected.type} - {filamentSelected.color}
                </span>
              ) : (
                <SelectValue placeholder="Selecione o filamento"></SelectValue>
              )}
            </SelectTrigger>
            <SelectContent position="popper">
              {filamentBrands.map((brand) => (
                <SelectGroup key={brand}>
                  <SelectLabel>{brand}</SelectLabel>
                  {registeredFilaments
                    .filter((filament) => filament.brand === brand)
                    .map((filament) => (
                      <SelectItem key={filament.id} value={filament.id}>
                        {filament.type} - {filament.color} -{" "}
                        {filament.pricePerKg} R$/Kg
                      </SelectItem>
                    ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="filamentToPrintG">Quantidade (g)</Label>
          <Input
            id="filamentToPrintG"
            type="number"
            step="0.1"
            placeholder="25,5"
            value={filament.usedAmountG}
            onChange={(e) =>
              onUpdate({ usedAmountG: parseFloat(e.target.value) || 0 })
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
