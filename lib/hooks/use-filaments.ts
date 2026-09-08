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
    const raw = await res.text();
    let body: unknown = null;
    if (raw) {
      try {
        body = JSON.parse(raw);
      } catch {
        body = null;
      }
    }

    if (!res.ok) {
      const message =
        body && typeof body === 'object' && 'error' in body
          ? String((body as { error: string }).error)
          : `Erro ${res.status} ao criar filamento. Verifique o console do servidor.`;
      throw new Error(message);
    }

    if (res.status === 204 || body === null) {
      setFilaments((prev) => [{ ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() } as Filament, ...prev]);
      return null;
    }

    const created = body as Filament;
    setFilaments((prev) => [created, ...prev]);
    return created;
  }, []);

  return { filaments, loading, error, reload, create };
}
