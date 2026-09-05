"use client";

import { useCallback, useEffect, useState } from "react";
import type { Filament, NewFilament } from "@/lib/types";

export function useFilaments(activeOnly = false) {
  const [filaments, setFilaments] = useState<Filament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function fetchFilaments() {
      try {
        const res = await fetch(
          `/api/filaments${activeOnly ? "?active=true" : ""}`,
        );
        if (!res.ok) throw new Error("Erro ao carregar filamentos");
        const data = await res.json();
        if (!ignore) {
          setFilaments(data);
          setError(null);
        }
      } catch (err) {
        if (!ignore)
          setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchFilaments();

    return () => {
      ignore = true;
    };
  }, [activeOnly, reloadKey]);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    setReloadKey((k) => k + 1);
  }, []);

  const create = useCallback(async (data: NewFilament) => {
    const res = await fetch("/api/filaments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Erro ao criar filamento");
    }
    const created = await res.json();
    setFilaments((prev) => [created, ...prev]);
    return created as Filament;
  }, []);

  return { filaments, loading, error, reload, create };
}
