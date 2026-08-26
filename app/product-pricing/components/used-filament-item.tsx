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
import { useState } from "react";
import { toast } from "sonner";

export const UsedFilamentItem = () => {
  const [selectedFilament, setSelectedFilament] = useState("");
  const [filamentToPrintG, setFilamentToPrintG] = useState("");
  const filaments = [
    {
      id: "1",
      type: "PLA BASIC",
      pricePerKg: 8910,
      brand: "3D Prime",
      color: "Preto",
      note: "Filamento bom",
      remainingInStockG: 500,
    },
    {
      id: "2",
      type: "PLA Premium HT High Speed",
      pricePerKg: 10341,
      brand: "3D Prime",
      color: "Branco",
      note: "Filamento bom",
      remainingInStockG: 500,
    },
    {
      id: "3",
      type: "PLA Transição de Cor",
      pricePerKg: 6570,
      brand: "3D Prime",
      color: "Azul",
      note: "Filamento bom",
      remainingInStockG: 500,
    },
  ];
  const selectedItem = filaments.find((f) => f.id === selectedFilament);

  const filamentUsedG = parseFloat(filamentToPrintG);
  if (!selectedItem) {
    toast.error("Selecione um filamento");
    return;
  }
  if (!selectedItem) {
    toast.error("Selecione um filamento");
    return;
  }
  if (isNaN(filamentUsedG) || filamentUsedG <= 0) {
    toast.error("Peso do filamento inválido");
    return;
  }

  return (
    <div className="space-y-1.5">
      <div className="flex gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="filamentForPrint">Filamento usado</Label>
          <div>
            <Select
              value={selectedFilament}
              onValueChange={setSelectedFilament}
            >
              <SelectTrigger className="w-55">
                {selectedItem ? (
                  <span className="overflow-auto whitespace-nowrap">
                    {selectedItem.type} - {selectedItem.color}
                  </span>
                ) : (
                  <SelectValue placeholder="Selecione o filamento"></SelectValue>
                )}
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  {filaments.map((item) => (
                    <SelectItem key={item.id} value={item.id} textValue="teste">
                      {item.brand} - {item.type} - {item.color} -{" "}
                      {item.pricePerKg} R$/Kg
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="filamentToPrintG">Quantidade (g)</Label>
          <Input
            id="filamentToPrintG"
            type="number"
            step="0.1"
            placeholder="25,5"
            value={filamentToPrintG}
            onChange={(e) => setFilamentToPrintG(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
