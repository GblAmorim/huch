export function price(
  form: ProductPricingState,
  baseline: PricingBaseline,
): PricingResult {
  const pricingDetails: PricingDetails[] = [];

  // 1. CUSTO DE FILAMENTOS
  // cada filamento usado: (gramas / 1000) * valorPorKg
  const filamentCost = form.printingData.usedFilaments.reduce((total, f) => {
    const registered = baseline.filaments.find((fc) => fc.id === f.filamentId);
    if (!registered || f.usedAmountG <= 0) return total;
    const custo = (f.usedAmountG / 1000) * registered.pricePerKg;
    return total + custo;
  }, 0);

  pricingDetails.push({
    label: "Filamentos",
    value: filamentCost,
    formula: "Σ (gramas ÷ 1000) × valor/Kg",
  });

  // 2. CUSTO DE ENERGIA
  // consumoKW × tempoHoras × .valueKwH
  const energyCost =
    baseline.printer.energyConsumptionKw *
    form.printingData.printTimeHours *
    baseline.energy.valueKwH;

  pricingDetails.push({
    label: "Energia",
    value: energyCost,
    formula: `${baseline.printer.energyConsumptionKw} kW × ${form.printingData.printTimeHours}h × R$ ${baseline.energy.valueKwH}/kWh`,
  });

  // 3. DEPRECIAÇÃO DA IMPRESSORA
  // (printer value ÷ lifeCycleHr) × .printTimeHours
  const depreciationCost =
    (baseline.printer.value / baseline.printer.lifeCycleHr) *
    form.printingData.printTimeHours;

  pricingDetails.push({
    label: "Depreciação da impressora",
    value: depreciationCost,
    formula: `(R$ ${baseline.printer.value} ÷ ${baseline.printer.lifeCycleHr}h) × ${form.printingData.printTimeHours}h`,
  });

  // 4. MÃO DE OBRA
  // (tempoPreparo + tempoPosProcessamento) em horas × valorHora
  const totalLaborTimeMinutes =
    form.productLabor.modelingTimeMinutes +
    form.productLabor.postPrintTimeMinutes;
  const totalHorasMO = totalLaborTimeMinutes / 60;
  const laborCost = totalHorasMO * baseline.labor.modelingLaborCostPerHour;

  pricingDetails.push({
    label: "Mão de obra",
    value: laborCost,
    formula: `${totalLaborTimeMinutes}min × R$ ${baseline.labor.modelingLaborCostPerHour}/h`,
  });

  // 5. ACESSÓRIOS
  const addonsCost = form.usedAddons.usedAddons.reduce((total, a) => {
    const cadastrado = baseline.addons.find((ac) => ac.id === a.addonId);
    if (!cadastrado) return total;
    return total + cadastrado.unitPrice * a.quantity;
  }, 0);

  pricingDetails.push({
    label: "Acessórios",
    value: addonsCost,
  });

  // 6. EMBALAGENS (placeholder — depende de como embalagens estão cadastradas)
  const custoEmbalagens = 0; // TODO: implementar quando estrutura de embalagens estiver definida

  pricingDetails.push({
    label: "Embalagens",
    value: custoEmbalagens,
  });

  // 7. CUSTO DE FALHAS
  // taxaFalha (do form ou padrão) × custoBase
  const taxaFalha =
    form.printingData.failureChancePercentage > 0
      ? form.printingData.failureChancePercentage
      : baseline.taxes.standardFailureChance;

  const productionBaseCost =
    filamentCost +
    energyCost +
    depreciationCost +
    laborCost +
    addonsCost +
    custoEmbalagens;

  const failureCost = productionBaseCost * (taxaFalha / 100);

  pricingDetails.push({
    label: `Custo de falhas (${taxaFalha}%)`,
    value: failureCost,
    formula: `${taxaFalha}% × custo base`,
  });

  // 8. TOTAL DE PRODUÇÃO
  const totalProductionCost = productionBaseCost + failureCost;

  pricingDetails.push({
    label: "Custo total de produção",
    value: totalProductionCost,
  });

  // 9. MARGEM E IMPOSTOS
  const standardProfit =
    totalProductionCost * (baseline.taxes.standardProfit / 100);
  const baseComLucro = totalProductionCost + standardProfit;
  const governmentTaxes = baseComLucro * (baseline.taxes.governmentTax / 100);
  const finalPrice = baseComLucro + governmentTaxes;

  pricingDetails.push({
    label: `Margem de lucro (${baseline.taxes.standardProfit}%)`,
    value: standardProfit,
  });
  pricingDetails.push({
    label: `Impostos (${baseline.taxes.governmentTax}%)`,
    value: governmentTaxes,
  });
  pricingDetails.push({ label: "Preço final", value: finalPrice });

  return {
    filamentCost,
    energyCost,
    depreciationCost,
    laborCost,
    addonsCost,
    failureCost,
    totalProductionCost,
    profit: standardProfit,
    taxes: governmentTaxes,
    finalPrice: finalPrice,
    details: pricingDetails,
  };
}
