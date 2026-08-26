"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { PricingResult } from "@/lib/schemas";

interface Props {
  onCalculated: (result: PricingResult & { productName: string }) => void;
}

export function PrintingDataForm({ onCalculated }: Props) {
  const [productName, setProductName] = useState("");
  const [printTimeHours, setPrintTimeHours] = useState("");
  const [printTimeMinutes, setPrintTimeMinutes] = useState("");
  const [desiredProfit, setDesiredProfit] = useState("");
  const [piecesQuantity, setPiecesQuantity] = useState("1");
  const [failureChance, setFailureChance] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const totalPrintTimeMinutes =
      parseFloat(printTimeHours) * 60 + parseFloat(printTimeMinutes);

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

    const res = await fetch("/api/pricing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productName,
        printTimeMinutes: totalPrintTimeMinutes,
        desiredProfit: parseFloat(desiredProfit),
        piecesQuantity: parseInt(piecesQuantity),
        failureChance: parseInt(failureChance),
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
    } else {
      const err = await res.json();
      toast.error(err.error ?? "Erro ao calcular preço");
    }
  }

  return (
    <div>
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
    </div>
  );
}
