"use client";

import { useCallback, useEffect, useState } from "react";
import type { PricingRecord } from "@/lib/types";

export function useRecords() {
  const [records, setRecords] = useState<PricingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function fetchRecords() {
      try {
        const res = await fetch("/api/records");
        if (res.ok && !ignore) {
          const data = await res.json();
          setRecords(data);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchRecords();

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const reload = useCallback(() => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  }, []);

  return { records, loading, reload };
}
