"use client";

import { useState } from "react";
import type { PricingRecord, PricingResult } from "@/lib/types";
import type { PricingRequestInput } from "@/lib/schemas";

export interface PricingCalculation {
  result: PricingResult;
  record: PricingRecord;
}

export function usePricing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = async (data: PricingRequestInput) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Erro ao calcular preço");
      }
      const payload = await res.json();
      return payload as PricingCalculation;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { calculate, loading, error };
}
