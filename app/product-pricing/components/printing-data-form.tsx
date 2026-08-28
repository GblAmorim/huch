"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { UsedFilamentList } from "./used-filament-list";

interface Props {
  baselineData: PricingBaseline;
  dispatch: React.Dispatch<ProductPricingAction>;
  usedFilaments: UsedFilament[];
}

export function PrintingDataForm({
  baselineData,
  dispatch,
  usedFilaments,
}: Props) {
  const [productName, setProductName] = useState("");
  const [printTimeHours, setPrintTimeHours] = useState("");
  const [printTimeMinutes, setPrintTimeMinutes] = useState("");
  const [desiredProfit, setDesiredProfit] = useState("");
  const [piecesQuantity, setPiecesQuantity] = useState("1");
  const [failureChance, setFailureChance] = useState("");

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
      <UsedFilamentList
        registeredFilaments={baselineData.filaments}
        dispatch={dispatch}
        usedFilaments={usedFilaments}
      ></UsedFilamentList>
    </div>
  );
}
