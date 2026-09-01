export function price(
  form: ProductPricingState,
  baseline: PricingBaseline,
): PricingResult {
  const pricingDetails: PricingDetails[] = [];

  // 1. CUSTO DE FILAMENTOS
  const usedFilaments = form.printingData.usedFilaments;
  const registeredFilaments = baseline.filaments;

  const filamentCostOneByOne = usedFilaments.flatMap(usedFilament => {
    const isRegistered = registeredFilaments.list.find((registeredFilament) => registeredFilament.id === usedFilament.filamentId);
    if (!isRegistered || usedFilament.usedAmountG <= 0) return [];
    const usedFilamentCost = (usedFilament.usedAmountG / 1000) * isRegistered.pricePerKg;
    const wasteG = (usedFilament.usedAmountG * (baseline.filaments.wastePercentage / 100));
    const wasteCost = wasteG * isRegistered.pricePerKg;
    const usedFilamenWithWasteCost = usedFilamentCost + wasteCost;
    const usedFilamentWithWasteG = usedFilament.usedAmountG + wasteG;
    return [ { cost: usedFilamentCost, wasteG, wasteCost, filamentWithWasteCost: usedFilamenWithWasteCost, filamentWithWasteG: usedFilamentWithWasteG, usedAmountG: usedFilament.usedAmountG, pricePerKg: isRegistered.pricePerKg }];
  });
  const totalFilamentG = filamentCostOneByOne.reduce((total, usedFilament) => {
    return total + (usedFilament.usedAmountG || 0);
  }, 0);
  pricingDetails.push({
    label: "Peso total de filamentos gastos",
    value: totalFilamentG,
    formula: "Σ (gramas usados)",
  });

  const totalFilamentCost = filamentCostOneByOne.reduce((total, usedFilament) => {
    return total + (usedFilament.cost || 0);
  }, 0);
  pricingDetails.push({
    label: "Valor total do filamento usado",
    value: totalFilamentCost,
    formula: "Σ (gramas usados ÷ 1000) × valor/Kg",
  });

  const totalFilamentWasteG = filamentCostOneByOne.reduce((total, usedFilament) => {
    return total + (usedFilament.wasteG || 0);
  }, 0);
  pricingDetails.push({
    label: "Peso total do desperdício de filamentos",
    value: totalFilamentWasteG,
    formula: "Σ (gramas de desperdício)",
  });

  const totalFilamentWasteCost = filamentCostOneByOne.reduce((total, usedFilament) => {
    return total + (usedFilament.wasteCost || 0);
  }, 0);
  pricingDetails.push({
    label: "Valor total do desperdício de filamentos",
    value: totalFilamentWasteCost,
    formula: "Σ (gramas ÷ 1000) × valor/Kg",
  });

  const totalFilamentWithWasteG = filamentCostOneByOne.reduce((total, usedFilament) => {
    return total + (usedFilament.filamentWithWasteG || 0);
  }, 0);
  pricingDetails.push({
    label: "Peso total de filamentos com desperdício",
    value: totalFilamentWithWasteG,
    formula: "Σ (gramas ÷ 1000) × valor/Kg",
  });

  const totalFilamentWithWasteCost = filamentCostOneByOne.reduce((total, usedFilament) => {
    return total + (usedFilament.filamentWithWasteCost || 0);
  }, 0);
  pricingDetails.push({
    label: "Valor total de filamentos com desperdício",
    value: totalFilamentWithWasteCost,
    formula: "Σ (gramas ÷ 1000) × valor/Kg",
  });

  const filamentCosts: PricingResult['filamentCosts'] = {
    oneByOne: filamentCostOneByOne,
    totalFilamentG,
    totalFilamentCost,
    totalFilamentWasteG,
    totalFilamentWasteCost,
    totalFilamentWithWasteG,
    totalFilamentWithWasteCost,
  };

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
    filamentCosts,
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
