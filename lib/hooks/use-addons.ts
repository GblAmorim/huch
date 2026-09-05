"use client";

import { useCallback, useEffect, useState } from "react";
import type { Addon, NewAddon } from "@/lib/types";

export function useAddons(activeOnly = false) {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function fetchAddons() {
      try {
        const res = await fetch(
          `/api/addons${activeOnly ? "?active=true" : ""}`,
        );
        if (!res.ok) throw new Error("Erro ao carregar addons");
        const data = await res.json();
        if (!ignore) {
          setAddons(data);
          setError(null);
        }
      } catch (err) {
        if (!ignore)
          setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchAddons();

    return () => {
      ignore = true;
    };
  }, [activeOnly, reloadKey]);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    setReloadKey((k) => k + 1);
  }, []);

  const create = useCallback(async (data: NewAddon) => {
    const res = await fetch("/api/addons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Erro ao criar addon");
    }
    const created = await res.json();
    setAddons((prev) => [created, ...prev]);
    return created as Addon;
  }, []);

  return { addons, loading, error, reload, create };
}
