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
import { formatMoney } from "@/lib/utils";
import { Trash2 } from "lucide-react";
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
    <div className="space-y-3 pb-2">
      <div className="flex gap-4">
        <div className="space-y-2">
          <Label htmlFor="filamentForPrint">Filamento {index + 1}</Label>
          <Select
            value={filament.filamentId}
            onValueChange={(value) => onUpdate({ filamentId: value })}
          >
            <SelectTrigger className="w-55">
              {filamentSelected ? (
                <span className="overflow-auto whitespace-nowrap">
                  {filamentSelected.material} - {filamentSelected.color}
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
                        {filament.material} - {filament.color} -{" "}
                        {formatMoney(filament.pricePerKg)} R$/Kg
                      </SelectItem>
                    ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 flex flex-col">
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
          {canRemove && (
            <Button
              className="self-end"
              type="button"
              size="icon-sm"
              variant="destructive"
              onClick={onRemove}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});
