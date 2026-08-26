"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { PricingResult } from "@/lib/schemas";

interface Props {
  onCalculated: (result: PricingResult & { productName: string }) => void;
}

export function LaborDataForm({ onCalculated }: Props) {
  const [modelingTimeHours, setModelingTimeHours] = useState("");
  const [modelingTimeMinutes, setModelingTimeMinutes] = useState("");
  const [modelingLaborCost, setModelingLaborCost] = useState("");
  const [postPrintTimeHours, setPostPrintTimeHours] = useState("");
  const [postPrintTimeMinutes, setPostPrintTimeMinutes] = useState("");
  const [postPrintLaborCost, setPostPrintLaborCost] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const totalModelingTimeMinutes =
      parseFloat(modelingTimeHours) * 60 + parseFloat(modelingTimeMinutes);
    const totalPostPrintTimeMinutes =
      parseFloat(postPrintTimeHours) * 60 + parseFloat(postPrintTimeMinutes);

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

    const res = await fetch("/api/pricing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        modelingTimeMinutes: totalModelingTimeMinutes,
        modelingLaborCost: parseFloat(modelingLaborCost),
        postPrintTimeMinutes: totalPostPrintTimeMinutes,
        postPrintLaborCost: parseFloat(postPrintLaborCost),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      onCalculated({ ...data, productName });
      toast.success("Preço calculado e salvo!");
      setModelingTimeHours("");
      setModelingTimeMinutes("");
      setModelingLaborCost("");
      setPostPrintTimeHours("");
      setPostPrintTimeMinutes("");
      setPostPrintLaborCost("");
    } else {
      const err = await res.json();
      toast.error(err.error ?? "Erro ao calcular preço");
    }
  }

  return (
    <div>
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
            <Label htmlFor="modelingLaborCost">Valor da Modelagem (R$/H)</Label>
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
            <Label htmlFor="postPrintLaborCost">Valor da Montagem (R$/H)</Label>
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
    </div>
  );
}
