"use client";

import { useCallback, useEffect, useState } from "react";

export interface LabelOption {
  id: string;
  label: string;
  isCustom: boolean;
  createdAt: string;
}

export type LabelOptionKind = "brand" | "material" | "type" | "color";

export function useLabelOptions(kind: LabelOptionKind) {
  const [options, setOptions] = useState<LabelOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function fetchOptions() {
      try {
        const res = await fetch(`/api/filaments/${kind}`);
        if (res.ok && !ignore) {
          const data = await res.json();
          setOptions(data);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchOptions();
    return () => {
      ignore = true;
    };
  }, [kind, reloadKey]);

  const reload = useCallback(() => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  }, []);

  const createCustom = useCallback(
    async (label: string) => {
      const res = await fetch(`/api/filaments/${kind}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Erro ao criar opção");
      }
      const created = (await res.json()) as LabelOption;
      setOptions((prev) => [...prev, created]);
      return created;
    },
    [kind],
  );

  return { options, loading, reload, createCustom };
}
