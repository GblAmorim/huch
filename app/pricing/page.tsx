"use client";

import { useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { VariableDataForm } from "@/app/pricing/components/variable-data-form";
import type { PricingResult } from "@/lib/types";
import { PriceSummary } from "./components/price-summary";

export default function PricingPage() {
  const [result, setResult] = useState<PricingResult | null>(null);

  return (
    <PageContainer
      title="Precificação"
      description="Cadastre os dados da peça e calcule o preço final"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VariableDataForm onResult={(r) => setResult(r.result)} />
        <PriceSummary result={result} />
      </div>
    </PageContainer>
  );
}
