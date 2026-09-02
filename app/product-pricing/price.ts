export function price(
  form: ProductPricingState,
  baseline: PricingBaseline,
): PricingResult {
  const pricingDetails: PricingDetails[] = [];

  // 1. CUSTO DE FILAMENTOS
  const usedFilaments = form.printingData.usedFilaments;
  const registeredFilaments = baseline.filaments;

  const filamentCostOneByOne = usedFilaments.flatMap((usedFilament) => {
    const isRegistered = registeredFilaments.list.find(
      (registeredFilament) => registeredFilament.id === usedFilament.filamentId,
    );
    if (!isRegistered || usedFilament.usedAmountG <= 0) return [];
    const usedFilamentCost =
      (usedFilament.usedAmountG / 1000) * isRegistered.pricePerKg;
    const wasteG =
      usedFilament.usedAmountG * (baseline.filaments.wastePercentage / 100);
    const wasteCost = (wasteG / 1000) * isRegistered.pricePerKg;
    const usedFilamentWithWasteCost = usedFilamentCost + wasteCost;
    const usedFilamentWithWasteG = usedFilament.usedAmountG + wasteG;
    return [
      {
        cost: usedFilamentCost,
        wasteG,
        wasteCost,
        filamentWithWasteCost: usedFilamentWithWasteCost,
        filamentWithWasteG: usedFilamentWithWasteG,
        usedAmountG: usedFilament.usedAmountG,
        pricePerKg: isRegistered.pricePerKg,
      },
    ];
  });
  const totalFilamentG = filamentCostOneByOne.reduce((total, usedFilament) => {
    return total + (usedFilament.usedAmountG || 0);
  }, 0);
  pricingDetails.push({
    label: "Peso total de filamentos gastos",
    value: totalFilamentG,
    formula: "Σ (gramas usados)",
  });

  const totalFilamentCost = filamentCostOneByOne.reduce(
    (total, usedFilament) => {
      return total + (usedFilament.cost || 0);
    },
    0,
  );
  pricingDetails.push({
    label: "Valor total do filamento usado",
    value: totalFilamentCost,
    formula: "Σ (gramas usados ÷ 1000) × valor/Kg",
  });

  const totalFilamentWasteG = filamentCostOneByOne.reduce(
    (total, usedFilament) => {
      return total + (usedFilament.wasteG || 0);
    },
    0,
  );
  pricingDetails.push({
    label: "Peso total do desperdício de filamentos",
    value: totalFilamentWasteG,
    formula: "Σ (gramas de desperdício)",
  });

  const totalFilamentWasteCost = filamentCostOneByOne.reduce(
    (total, usedFilament) => {
      return total + (usedFilament.wasteCost || 0);
    },
    0,
  );
  pricingDetails.push({
    label: "Valor total do desperdício de filamentos",
    value: totalFilamentWasteCost,
    formula: "Σ (gramas ÷ 1000) × valor/Kg",
  });

  const totalFilamentWithWasteG = filamentCostOneByOne.reduce(
    (total, usedFilament) => {
      return total + (usedFilament.filamentWithWasteG || 0);
    },
    0,
  );
  pricingDetails.push({
    label: "Peso total de filamentos com desperdício",
    value: totalFilamentWithWasteG,
    formula: "Σ (gramas ÷ 1000) × valor/Kg",
  });

  const totalFilamentWithWasteCost = filamentCostOneByOne.reduce(
    (total, usedFilament) => {
      return total + (usedFilament.filamentWithWasteCost || 0);
    },
    0,
  );
  pricingDetails.push({
    label: "Valor total de filamentos com desperdício",
    value: totalFilamentWithWasteCost,
    formula: "Σ (gramas ÷ 1000) × valor/Kg",
  });

  const filamentCosts: PricingResult["filamentCosts"] = {
    oneByOne: filamentCostOneByOne,
    totalFilamentG,
    totalFilamentCost,
    totalFilamentWasteG,
    totalFilamentWasteCost,
    totalFilamentWithWasteG,
    totalFilamentWithWasteCost,
  };

  // 2. CUSTOS DA IMPRESSÃO
  // (printer value ÷ lifeCycleHr) × .printTimeHours
  const depreciationCost =
    (baseline.printer.value / baseline.printer.lifeCycleHr) *
    (form.printingData.totalPrintTimeMinutes / 60);

  pricingDetails.push({
    label: "Depreciação da impressora",
    value: depreciationCost,
    formula: `(R$ ${baseline.printer.value} ÷ ${baseline.printer.lifeCycleHr}h) × ${(
      form.printingData.totalPrintTimeMinutes / 60
    ).toFixed(2)}h`,
  });

  const energyCost =
    baseline.printer.energyConsumptionKw *
    0.67 *
    (form.printingData.totalPrintTimeMinutes / 60) *
    baseline.energy.valueKwH;

  pricingDetails.push({
    label: "Energia",
    value: energyCost,
    formula: `${baseline.printer.energyConsumptionKw} kW × ${form.printingData.printTimeHours}h × R$ ${baseline.energy.valueKwH}/kWh`,
  });

  const failureCost =
    (depreciationCost + energyCost + totalFilamentWithWasteCost) *
    (baseline.taxes.standardFailureChance / 100);

  pricingDetails.push({
    label: `Custo de falhas (${baseline.taxes.standardFailureChance}%)`,
    value: failureCost,
    formula: `custo total de filamento gasto com desperdício + custo da depreciação + custo da energia consumida x ${baseline.taxes.standardFailureChance}% de chance de falha`,
  });

  const printingCosts: PricingResult["printingCosts"] = {
    depreciationCost,
    energyCost,
    failureCost,
  };

  // 3. CUSTOS FIXOS (gastos mensais fixos como internet, condomínio, aluguel, etc)
  const totalFixedCosts = 0; // TODO: Implementar cálculo de custos fixos

  // 4. MÃO DE OBRA
  const modelingLaborCost =
    (baseline.labor.modelingLaborCostPerHour *
      (form.productLabor.totalModelingTimeMinutes / 60)) /
    form.printingData.piecesQuantity;

  pricingDetails.push({
    label: "Custo da Modelagem",
    value: modelingLaborCost,
    formula: `valor da hora de modelagem × tempo total de modelagem ÷ quantidade de peças`,
  });

  const postPrintingLaborCost =
    baseline.labor.postPrintingLaborCostPerHour *
    (form.productLabor.totalPostPrintTimeMinutes / 60);

  pricingDetails.push({
    label: "Custo do Pós-Processamento (Montagem/Acabamento)",
    value: postPrintingLaborCost,
    formula: `valor da hora de pós-processamento × tempo total de pós-processamento`,
  });

  const laborCosts: PricingResult["laborCosts"] = {
    modelingLaborCost,
    postPrintingLaborCost,
  };

  // 5. ACESSÓRIOS
  const addonsCostOneByOne = form.usedAddons.flatMap((usedAddon) => {
    const cadastrado = baseline.addons.find(
      (registeredAddon) => registeredAddon.id === usedAddon.addonId,
    );
    if (!cadastrado) return [];
    return [
      { cost: cadastrado.unitPrice * usedAddon.quantity, type: usedAddon.type },
    ];
  });

  const packingAddonsCost = addonsCostOneByOne
    .filter((addon) => addon.type === "packing")
    .reduce((total, addon) => total + addon.cost, 0);

  const accessoryAddonsCost = addonsCostOneByOne
    .filter((addon) => addon.type === "accessory")
    .reduce((total, addon) => total + addon.cost, 0);

  const totalAddonsCost = addonsCostOneByOne.reduce((total, usedAddon) => {
    return total + usedAddon.cost;
  }, 0);

  pricingDetails.push({
    label: "Custo Total dos Acessórios",
    value: totalAddonsCost,
    formula: "Σ (preço unitário × quantidade)",
  });

  const addonsCosts: PricingResult["addonsCosts"] = {
    totalAddonsCost,
    oneByOne: addonsCostOneByOne,
  };

  // 6. CUSTOS LOGÍSTICOS (gastos com transporte, embalagem, etc)
  const transportCost =
    ((baseline.logistics.distanceKm / baseline.logistics.kmPerLitter) *
      baseline.logistics.gasPricePerLitter) /
    form.printingData.piecesQuantity;

  pricingDetails.push({
    label: "Custo do Transporte",
    value: transportCost,
    formula: `(distância ÷ km/litro) × preço do litro de combustível ÷ quantidade de peças`,
  });

  const logisticCosts =
    packingAddonsCost +
    (baseline.logistics.distanceKm / baseline.logistics.kmPerLitter) *
      baseline.logistics.gasPricePerLitter;

  pricingDetails.push({
    label: "Custo logístico total",
    value: logisticCosts,
    formula: "Σ (custo de transporte + custo de embalagem)",
  });

  // 8. TOTAL DE PRODUÇÃO E TOTAL ENVIO
  const totalProductionCost =
    totalFilamentWithWasteCost +
    energyCost +
    depreciationCost +
    failureCost +
    totalFixedCosts +
    modelingLaborCost +
    postPrintingLaborCost +
    accessoryAddonsCost;

  pricingDetails.push({
    label: "Custo total de produção",
    value: totalProductionCost,
    formula:
      "Σ (custos de filamento, energia, depreciação, falhas, mão de obra e acessórios)",
  });

  const totalProductionCostWithLogisticsAndPacking =
    totalProductionCost + logisticCosts + packingAddonsCost;

  pricingDetails.push({
    label: "Custo total de produção + logística + embalagem",
    value: totalProductionCostWithLogisticsAndPacking,
    formula:
      "custo total de produção + custo logístico total + custo de embalagem",
  });

  // 9. MARGEM E IMPOSTOS
  const totalTaxes =
    baseline.taxes.riskReservePercentage +
    baseline.taxes.governmentTax +
    baseline.taxes.creditCartFeePercentage +
    baseline.taxes.commissionFeePercentage;

  const finalPlatformPrice =
    (totalProductionCostWithLogisticsAndPacking +
      form.desiredProfit +
      baseline.taxes.platformFee) /
    (1 -
      (baseline.taxes.riskReservePercentage +
        baseline.taxes.governmentTax +
        baseline.taxes.creditCartFeePercentage +
        baseline.taxes.commissionFeePercentage) /
        100);
  pricingDetails.push({
    label: "Preço final (Plataforma)",
    value: finalPlatformPrice,
    formula: `(custo total de produção + lucro desejado + taxa da plataforma) ÷ (1 - (reserva de risco + impostos + taxa do cartão de crédito + comissão da plataforma))`,
  });

  const finalPriceCreditCard =
    (totalProductionCostWithLogisticsAndPacking + form.desiredProfit) /
    (1 -
      (baseline.taxes.riskReservePercentage +
        baseline.taxes.governmentTax +
        baseline.taxes.creditCartFeePercentage) /
        100);
  pricingDetails.push({
    label: "Preço final (Cartão de Crédito)",
    value: finalPriceCreditCard,
  });

  const finalPricePix =
    (totalProductionCostWithLogisticsAndPacking + form.desiredProfit) /
    (1 -
      (baseline.taxes.riskReservePercentage + baseline.taxes.governmentTax) /
        100);
  pricingDetails.push({ label: "Preço final (Pix)", value: finalPricePix });

  return {
    filamentCosts,
    printingCosts,
    fixedCosts: totalFixedCosts,
    laborCosts,
    addonsCosts,
    logisticCosts,
    totalProductionCost,
    totalProductionCostWithLogisticsAndPacking,
    taxes: totalTaxes,
    finalPrices: {
      finalPlatformPrice,
      finalPriceCreditCard,
      finalPricePix,
    },
    details: pricingDetails,
  };
}
