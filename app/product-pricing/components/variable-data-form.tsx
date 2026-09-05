"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  onCalculated: (result: PricingResult & { productName: string }) => void;
}

export function VariableDataForm({ onCalculated }: Props) {
  const [productName, setProductName] = useState("");
  const [printTimeHours, setPrintTimeHours] = useState("");
  const [printTimeMinutes, setPrintTimeMinutes] = useState("");
  const [desiredProfit, setDesiredProfit] = useState("");
  const [piecesQuantity, setPiecesQuantity] = useState("1");
  const [failureChance, setFailureChance] = useState("");
  const [selectedFilament, setSelectedFilament] = useState("");
  const [filamentToPrintG, setFilamentToPrintG] = useState("");
  const [modelingTimeHours, setModelingTimeHours] = useState("");
  const [modelingTimeMinutes, setModelingTimeMinutes] = useState("");
  const [modelingLaborCost, setModelingLaborCost] = useState("");
  const [postPrintTimeHours, setPostPrintTimeHours] = useState("");
  const [postPrintTimeMinutes, setPostPrintTimeMinutes] = useState("");
  const [postPrintLaborCost, setPostPrintLaborCost] = useState("");
  const [accessoryName, setAccessoryName] = useState("");
  const [accessoryUnitPrice, setAccessoryUnitPrice] = useState("");
  const [accessoryQuantity, setAccessoryQuantity] = useState("");
  const [loading, setLoading] = useState(false);
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const filamentUsedG = parseFloat(filamentToPrintG);
    const totalPrintTimeMinutes =
      parseFloat(printTimeHours) * 60 + parseFloat(printTimeMinutes);
    const totalModelingTimeMinutes =
      parseFloat(modelingTimeHours) * 60 + parseFloat(modelingTimeMinutes);
    const totalPostPrintTimeMinutes =
      parseFloat(postPrintTimeHours) * 60 + parseFloat(postPrintTimeMinutes);

    if (!productName.trim()) {
      toast.error("Informe o nome da peça");
      return;
    }
    if (isNaN(totalPrintTimeMinutes) || totalPrintTimeMinutes <= 0) {
      toast.error("Tempo de impressão inválido");
      return;
    }
    if (isNaN(parseFloat(desiredProfit)) || parseFloat(desiredProfit) < 0) {
      toast.error("Lucro desejado inválido");
      return;
    }
    if (isNaN(parseInt(piecesQuantity)) || parseInt(piecesQuantity) <= 0) {
      toast.error("Quantidade de peças inválida");
      return;
    }
    if (
      failureChance &&
      (isNaN(parseInt(failureChance)) ||
        parseInt(failureChance) < 0 ||
        parseInt(failureChance) > 100)
    ) {
      toast.error("Chance de falha inválida");
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
    if (isNaN(totalModelingTimeMinutes) || totalModelingTimeMinutes <= 0) {
      toast.error("Tempo de modelagem inválido");
      return;
    }
    if (
      isNaN(parseFloat(modelingLaborCost)) ||
      parseFloat(modelingLaborCost) < 0
    ) {
      toast.error("Valor da modelagem inválido");
      return;
    }
    if (isNaN(totalPostPrintTimeMinutes) || totalPostPrintTimeMinutes <= 0) {
      toast.error("Tempo de montagem inválido");
      return;
    }
    if (
      isNaN(parseFloat(postPrintLaborCost)) ||
      parseFloat(postPrintLaborCost) < 0
    ) {
      toast.error("Valor da montagem inválido");
      return;
    }
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

    setLoading(true);
    const res = await fetch("/api/pricing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productName,
        printTimeMinutes: totalPrintTimeMinutes,
        desiredProfit: parseFloat(desiredProfit),
        piecesQuantity: parseInt(piecesQuantity),
        failureChance: parseInt(failureChance),
        selectedFilament,
        filamentToPrintG: filamentUsedG,
        modelingTimeMinutes: totalModelingTimeMinutes,
        modelingLaborCost: parseFloat(modelingLaborCost),
        postPrintTimeMinutes: totalPostPrintTimeMinutes,
        postPrintLaborCost: parseFloat(postPrintLaborCost),
        accessoryName,
        accessoryUnitPrice: parseFloat(accessoryUnitPrice),
        accessoryQuantity: parseInt(accessoryQuantity),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      onCalculated({ ...data, productName });
      toast.success("Preço calculado e salvo!");
      setProductName("");
      setPrintTimeHours("");
      setPrintTimeMinutes("");
      setDesiredProfit("");
      setPiecesQuantity("");
      setFailureChance("");
      setSelectedFilament("");
      setFilamentToPrintG("");
      setModelingTimeHours("");
      setModelingTimeMinutes("");
      setModelingLaborCost("");
      setPostPrintTimeHours("");
      setPostPrintTimeMinutes("");
      setPostPrintLaborCost("");
      setAccessoryName("");
      setAccessoryUnitPrice("");
      setAccessoryQuantity("");
    } else {
      const err = await res.json();
      toast.error(err.error ?? "Erro ao calcular preço");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="productName">Nome da Peça</Label>
        <Input
          id="productName"
          placeholder="Ex: Suporte para celular v2"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="printTimeHours">Tempo de Impressão</Label>
          <div className="flex items-center gap-1">
            <div>
              <Input
                className="w-18 text-right"
                id="printTimeHours"
                type="number"
                placeholder="HHHH"
                value={printTimeHours}
                onChange={(e) => setPrintTimeHours(e.target.value)}
              />
            </div>
            <span className="text-sm font-semibold">:</span>
            <div>
              <Input
                className="w-13 text-center"
                id="printTimeMinutes"
                type="number"
                max={59}
                placeholder="MM"
                value={printTimeMinutes}
                onChange={(e) => setPrintTimeMinutes(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="desiredProfit">Lucro Desejado (R$)</Label>
          <div>
            <Input
              id="desiredProfit"
              type="number"
              step="0.01"
              placeholder="5,00"
              value={desiredProfit}
              onChange={(e) => setDesiredProfit(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="piecesQuantity">Quantidade de Peças</Label>
          <Input
            id="piecesQuantity"
            type="number"
            min={1}
            placeholder="1"
            value={piecesQuantity}
            onChange={(e) => setPiecesQuantity(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="failureChance">Chance de Falha (%)</Label>
          <div>
            <Input
              id="failureChance"
              type="number"
              min={0}
              max={100}
              placeholder="10"
              value={failureChance}
              onChange={(e) => setFailureChance(e.target.value)}
            />
          </div>
        </div>
      </div>
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
                      <SelectItem
                        key={item.id}
                        value={item.id}
                        textValue="teste"
                      >
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
        <span>Mão de Obra</span>
        <div className="space-y-1.5">
          <div className="space-y-1.5 flex gap-2">
            <div className="space-y-1.5 w-50">
              <Label htmlFor="modelingTimeHours">Tempo de Modelagem</Label>
              <div className="flex items-center gap-1">
                <div>
                  <Input
                    className="w-15 text-center"
                    id="modelingTimeHours"
                    type="number"
                    placeholder="HHH"
                    value={modelingTimeHours}
                    onChange={(e) => setModelingTimeHours(e.target.value)}
                  />
                </div>
                <span className="text-sm font-semibold">:</span>
                <div>
                  <Input
                    className="w-13 text-center"
                    id="modelingTimeMinutes"
                    type="number"
                    max={59}
                    placeholder="MM"
                    value={modelingTimeMinutes}
                    onChange={(e) => setModelingTimeMinutes(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="modelingLaborCost">
                Valor da Modelagem (R$/H)
              </Label>
              <div>
                <Input
                  id="modelingLaborCost"
                  type="number"
                  step="0.01"
                  placeholder="5,00"
                  value={modelingLaborCost}
                  onChange={(e) => setModelingLaborCost(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="space-y-1.5 flex gap-2">
            <div className="space-y-1.5 w-50">
              <Label htmlFor="postPrintTimeHours">Tempo de Montagem</Label>
              <div className="flex items-center gap-1">
                <div>
                  <Input
                    className="w-15 text-center"
                    id="postPrintTimeHours"
                    type="number"
                    placeholder="HHH"
                    value={postPrintTimeHours}
                    onChange={(e) => setPostPrintTimeHours(e.target.value)}
                  />
                </div>
                <span className="text-sm font-semibold">:</span>
                <div>
                  <Input
                    className="w-13 text-center"
                    id="postPrintTimeMinutes"
                    type="number"
                    max={59}
                    placeholder="MM"
                    value={postPrintTimeMinutes}
                    onChange={(e) => setPostPrintTimeMinutes(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="postPrintLaborCost">
                Valor da Montagem (R$/H)
              </Label>
              <div>
                <Input
                  id="postPrintLaborCost"
                  type="number"
                  step="0.01"
                  placeholder="5,00"
                  value={postPrintLaborCost}
                  onChange={(e) => setPostPrintLaborCost(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <span>Acessórios e Embalagens</span>
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
      <div className="space-y-1.5"></div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Calculando..." : "Calcular Preço"}
      </Button>
    </form>
  );
}
