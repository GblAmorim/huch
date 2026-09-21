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

    // Lê sempre como texto — nunca quebra por corpo vazio/não-JSON
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
        body && typeof body === "object" && "error" in body
          ? String((body as { error: unknown }).error)
          : `Erro ${res.status} ao criar addon`;
      throw new Error(message);
    }

    if (!body) throw new Error("Resposta vazia do servidor");

    const created = body as Addon;
    setAddons((prev) => [created, ...prev]);
    return created;
  }, []);

  return { addons, loading, error, reload, create };
}
