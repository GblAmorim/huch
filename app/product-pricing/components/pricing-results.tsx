import React from "react";
import { PricingResult } from "./pricing-result";

type Props = {
  pricingResults: PricingResult | null;
};

export const PricingResults = React.memo(function PricingResults({
  pricingResults,
}: Props) {
  if (!pricingResults) return null;
  return <PricingResult result={pricingResults} />;
});
