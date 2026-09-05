"use client";

import { useCallback, useEffect, useState } from "react";
import type { PricingBaseline } from "@/lib/types";
import type { BaselineInput } from "@/lib/schemas";

export function useBaseline() {
  const [baseline, setBaseline] = useState<PricingBaseline | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function fetchBaseline() {
      try {
        const res = await fetch("/api/baseline");
        if (res.ok && !ignore) {
          const data = await res.json();
          setBaseline(data);
        }
      } catch {
        // mantém o baseline atual em caso de erro
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchBaseline();

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const reload = useCallback(() => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  }, []);

  const save = useCallback(async (data: BaselineInput) => {
    setSaving(true);
    try {
      const res = await fetch("/api/baseline", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Erro ao salvar dados fixos");
      }
      const saved = await res.json();
      setBaseline(saved);
      return saved as PricingBaseline;
    } finally {
      setSaving(false);
    }
  }, []);

  return { baseline, loading, saving, reload, save };
}
