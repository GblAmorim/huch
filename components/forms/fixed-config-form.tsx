"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const FIELDS = [
  {
    key: "filamentCostPerKg",
    label: "Custo do filamento (R$/kg)",
    placeholder: "85.00",
  },
  {
    key: "electricityCostPerKwh",
    label: "Energia (R$/kWh)",
    placeholder: "0.75",
  },
  {
    key: "printerPowerWatts",
    label: "Potência da impressora (W)",
    placeholder: "120",
  },
  {
    key: "laborCostPerHour",
    label: "Mão de obra (R$/h)",
    placeholder: "25.00",
  },
  { key: "profitMargin", label: "Margem de lucro (%)", placeholder: "30" },
  { key: "failureRate", label: "Taxa de falha (%)", placeholder: "5" },
  {
    key: "overheadPercentage",
    label: "Custos indiretos (%)",
    placeholder: "10",
  },
] as const;

type ConfigData = Record<string, string>;

export function FixedConfigForm() {
  const [data, setData] = useState<ConfigData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((cfg) => {
        if (cfg) {
          const mapped: ConfigData = {};
          for (const f of FIELDS) {
            mapped[f.key] = String(cfg[f.key] ?? "");
          }
          setData(mapped);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  function handleChange(key: string, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload: Record<string, number> = {};
    for (const f of FIELDS) {
      const val = parseFloat(data[f.key] ?? "0");
      if (isNaN(val)) {
        toast.error(`Valor inválido para: ${f.label}`);
        setSaving(false);
        return;
      }
      payload[f.key] = val;
    }

    const res = await fetch("/api/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success("Configuração salva!");
    } else {
      toast.error("Erro ao salvar configuração");
    }
    setSaving(false);
  }

  if (loading)
    return <p className="text-muted-foreground">Carregando configuração...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FIELDS.map((f) => (
          <div key={f.key} className="space-y-1.5">
            <Label htmlFor={f.key}>{f.label}</Label>
            <Input
              id={f.key}
              type="number"
              step="0.01"
              placeholder={f.placeholder}
              value={data[f.key] ?? ""}
              onChange={(e) => handleChange(f.key, e.target.value)}
            />
          </div>
        ))}
      </div>
      <Button type="submit" disabled={saving}>
        {saving ? "Salvando..." : "Salvar configuração"}
      </Button>
    </form>
  );
}
