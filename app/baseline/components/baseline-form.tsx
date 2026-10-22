"use client";

import {
  Controller,
  useFieldArray,
  useForm,
  type Control,
  type FieldErrors,
  type FieldPath,
  type FieldPathByValue, // ← novo
  type UseFormRegister,
} from "react-hook-form";
import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { baselineSchema, type BaselineInput } from "@/lib/schemas";
import { useBaseline } from "@/lib/hooks/use-baseline";
import { DEFAULT_PAYMENT_FEES, PAYMENT_LABELS } from "@/lib/schemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MoneyInput } from "@/components/common/money-input";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import {
  computeBaselineCosts,
  FIXED_COST_CATEGORIES,
  FLAG_OPTIONS,
  formatBRL,
} from "@/lib/utils/baseline-costs";
import { PaymentMethod } from "@/lib/types";

const EMPTY_VALUES: BaselineInput = {
  printerBrand: "",
  printerModel: "",
  printerCost: 0,
  printerPowerWatts: 0,
  printerPowerAvgWatts: 0,
  printerLifespanHours: 0,
  printerAddons: [],
  electricityFlag: "green",
  electricityCostPerKwh: 0,
  laborCostPerHour: 0,
  modelingCostPerHour: 0,
  assemblyCostPerHour: 0,
  finishingCostPerHour: 0,
  hasOwnDelivery: false,
  fuelCostPerLiter: 0,
  vehicleConsumptionKmPerLiter: 0,
  kmPerDelivery: 0,
  deliveriesPerRoute: 1,
  extraCostPerKm: 0,
  packagingCostPerOrder: 0,
  shippingCostPerKm: 0,
  fixedCosts: [],
  productiveHoursPerMonth: 160,
  taxes: [],
  profitMargin: 30,
  failureRate: 5,
  overheadPercentage: 10,
  paymentFees: { ...DEFAULT_PAYMENT_FEES },
};

// ── Campos reutilizáveis ──────────────────────────────────

const SELECT_CLASS =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm";

function MoneyField<TName extends FieldPathByValue<BaselineInput, number>>({
  control,
  name,
  label,
  hint,
}: {
  control: Control<BaselineInput>;
  name: TName;
  label: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          // field.value agora é tipado como number
          <MoneyInput value={field.value} onChange={field.onChange} />
        )}
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function NumberField({
  register,
  name,
  label,
  hint,
  step = "1",
  min = "0",
  errors,
}: {
  register: UseFormRegister<BaselineInput>;
  name: FieldPath<BaselineInput>;
  label: string;
  hint?: string;
  step?: string;
  min?: string;
  errors?: FieldErrors<BaselineInput>;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input
        type="number"
        step={step}
        min={min}
        {...register(name, { valueAsNumber: true })}
      />
      {errors?.[name as keyof FieldErrors<BaselineInput>] && (
        <p className="text-sm text-destructive">
          {String(errors?.[name as keyof FieldErrors<BaselineInput>]?.message)}
        </p>
      )}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function SelectController<
  TName extends FieldPathByValue<BaselineInput, string>,
>({
  control,
  name,
  label,
  options,
  placeholder = "Selecione...",
}: {
  control: Control<BaselineInput>;
  name: TName;
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}

// ── Form principal ─────────────────────────────────────────

export function BaselineForm() {
  const { baseline, loading, saving, save } = useBaseline();

  const defaultValues = useMemo<BaselineInput>(
    () => ({
      ...EMPTY_VALUES,
      ...(baseline ?? {}),
      paymentFees: {
        ...DEFAULT_PAYMENT_FEES,
        ...(baseline?.paymentFees ?? {}),
      },
    }),
    [baseline],
  );

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BaselineInput>({
    resolver: zodResolver(baselineSchema),
    defaultValues,
  });

  const addonsField = useFieldArray({ control, name: "printerAddons" });
  const taxesField = useFieldArray({ control, name: "taxes" });
  const fixedField = useFieldArray({ control, name: "fixedCosts" });

  const values = watch();
  const rates = useMemo(() => computeBaselineCosts(values), [values]);

  async function onSubmit(data: BaselineInput) {
    if (saving) return;
    try {
      await save(data);
      toast.success("Baseline salva com sucesso!");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao salvar baseline",
      );
    }
  }

  if (loading) {
    return <p className="text-muted-foreground">Carregando baseline...</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ── Coluna dos formulários ── */}
        <div className="space-y-6 lg:col-span-2">
          {/* 1. Impressora */}
          <Card>
            <CardHeader>
              <CardTitle>1. Dados da impressora</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Marca</Label>
                  <Input
                    placeholder="Ex: Bambu Lab"
                    {...register("printerBrand")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Modelo / identificação</Label>
                  <Input
                    placeholder="Ex: X1 Carbon"
                    {...register("printerModel")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <MoneyField
                  control={control}
                  name="printerCost"
                  label="Custo da impressora (R$)"
                  hint="Preço total pago, incluindo impostos"
                />
                <NumberField
                  register={register}
                  name="printerPowerWatts"
                  label="Potência máxima (W)"
                  errors={errors}
                />
                <NumberField
                  register={register}
                  name="printerPowerAvgWatts"
                  label="Potência média (W)"
                  hint="Deixe 0 para usar 60% da máxima"
                />
              </div>

              <NumberField
                register={register}
                name="printerLifespanHours"
                label="Vida útil estimada (horas de impressão)"
                hint="Ex: 6000h"
              />

              {/* Equipamentos adicionais */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Equipamentos adicionais (AMS, exaustor...)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      addonsField.append({
                        name: "",
                        cost: 0,
                        powerWatts: 0,
                        lifespanHours: 0,
                      })
                    }
                  >
                    <Plus className="h-4 w-4" /> Adicionar
                  </Button>
                </div>
                {addonsField.fields.map((field, i) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 gap-2 rounded-md border p-3 md:grid-cols-[1fr_auto_auto_auto_auto]"
                  >
                    <Input
                      placeholder="Nome (Ex: AMS)"
                      {...register(`printerAddons.${i}.name`)}
                    />
                    <Controller
                      control={control}
                      name={`printerAddons.${i}.cost`}
                      render={({ field }) => (
                        <MoneyInput
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    <Input
                      type="number"
                      placeholder="Potência (W)"
                      {...register(`printerAddons.${i}.powerWatts`, {
                        valueAsNumber: true,
                      })}
                    />
                    <Input
                      type="number"
                      placeholder="Vida útil (h)"
                      {...register(`printerAddons.${i}.lifespanHours`, {
                        valueAsNumber: true,
                      })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => addonsField.remove(i)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 2. Energia */}
          <Card>
            <CardHeader>
              <CardTitle>2. Energia</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <SelectController
                control={control}
                name="electricityFlag"
                label="Bandeira tarifária"
                options={FLAG_OPTIONS.map((f) => ({
                  value: f.value,
                  label: f.label,
                }))}
              />
              <MoneyField
                control={control}
                name="electricityCostPerKwh"
                label="Custo médio do kWh (R$)"
                hint="Valor final da sua conta de luz (a bandeira já está embutida)"
              />
            </CardContent>
          </Card>

          {/* 3. Mão de obra */}
          <Card>
            <CardHeader>
              <CardTitle>3. Mão de obra</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <MoneyField
                control={control}
                name="laborCostPerHour"
                label="Impressão — acompanhamento (R$/h)"
              />
              <MoneyField
                control={control}
                name="modelingCostPerHour"
                label="Modelagem 3D (R$/h)"
              />
              <MoneyField
                control={control}
                name="assemblyCostPerHour"
                label="Montagem das peças (R$/h)"
              />
              <MoneyField
                control={control}
                name="finishingCostPerHour"
                label="Acabamento / pintura (R$/h)"
              />
            </CardContent>
          </Card>

          {/* 4. Transporte */}
          <Card>
            <CardHeader>
              <CardTitle>4. Custos de transporte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Faço entregas próprias</Label>
                  <p className="text-xs text-muted-foreground">
                    Desative se o cliente busca ou usa transportadora
                  </p>
                </div>
                <Controller
                  control={control}
                  name="hasOwnDelivery"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>

              {values.hasOwnDelivery && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <MoneyField
                    control={control}
                    name="fuelCostPerLiter"
                    label="Preço do litro (R$/L)"
                  />
                  <NumberField
                    register={register}
                    name="vehicleConsumptionKmPerLiter"
                    label="Consumo médio (km/L)"
                  />
                  <NumberField
                    register={register}
                    name="kmPerDelivery"
                    label="Km médio por entrega"
                  />
                  <NumberField
                    register={register}
                    name="deliveriesPerRoute"
                    label="Entregas por rota"
                    min="1"
                  />
                  <MoneyField
                    control={control}
                    name="extraCostPerKm"
                    label="Custo extra por km (R$)"
                    hint="Pedágio + manutenção rateada"
                  />
                  <MoneyField
                    control={control}
                    name="shippingCostPerKm"
                    label="Frete base (R$/km)"
                  />
                  <MoneyField
                    control={control}
                    name="packagingCostPerOrder"
                    label="Embalagem por pedido (R$)"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* 5. Impostos */}
          <Card>
            <CardHeader>
              <CardTitle>5. Impostos e taxas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Cadastro dinâmico</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    taxesField.append({
                      name: "",
                      kind: "percentage",
                      value: 0,
                      origin: "government",
                      base: "price",
                      incidence: "commission",
                    })
                  }
                >
                  <Plus className="h-4 w-4" /> Adicionar imposto
                </Button>
              </div>

              {taxesField.fields.map((field, i) => (
                <div key={field.id} className="space-y-2 rounded-md border p-3">
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                    <Input
                      placeholder="Nome (Ex: ICMS, Comissão Shopee)"
                      {...register(`taxes.${i}.name`)}
                    />
                    <select
                      className={SELECT_CLASS}
                      {...register(`taxes.${i}.kind`)}
                    >
                      <option value="percentage">Porcentagem (%)</option>
                      <option value="fixed">Valor fixo (R$)</option>
                    </select>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Valor"
                      {...register(`taxes.${i}.value`, { valueAsNumber: true })}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                    <select
                      className={SELECT_CLASS}
                      {...register(`taxes.${i}.origin`)}
                    >
                      <option value="government">Governo</option>
                      <option value="marketplace">Marketplace</option>
                    </select>
                    <select
                      className={SELECT_CLASS}
                      {...register(`taxes.${i}.base`)}
                    >
                      <option value="price">Sobre preço de venda</option>
                      <option value="cost">Sobre o custo</option>
                      <option value="order">Por pedido</option>
                    </select>
                    <div className="flex items-center gap-2">
                      <select
                        className={SELECT_CLASS}
                        {...register(`taxes.${i}.incidence`)}
                      >
                        <option value="commission">
                          Comissão (reduz o líquido)
                        </option>
                        <option value="passThrough">
                          Repasse (soma ao preço)
                        </option>
                      </select>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => taxesField.remove(i)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 6. Custos fixos */}
          <Card>
            <CardHeader>
              <CardTitle>6. Custos fixos mensais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <NumberField
                register={register}
                name="productiveHoursPerMonth"
                label="Horas produtivas por mês"
                hint="Usadas para ratear os custos fixos por hora — default 160h"
              />

              <div className="flex items-center justify-between">
                <Label>Cadastro dinâmico (salários, aluguel...)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    fixedField.append({
                      name: "",
                      value: 0,
                      category: "Pessoal",
                    })
                  }
                >
                  <Plus className="h-4 w-4" /> Adicionar custo
                </Button>
              </div>

              {fixedField.fields.map((field, i) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 gap-2 rounded-md border p-3 md:grid-cols-[1fr_auto_auto_auto]"
                >
                  <Input
                    placeholder="Nome (Ex: Salário do auxiliar)"
                    {...register(`fixedCosts.${i}.name`)}
                  />
                  <Controller
                    control={control}
                    name={`fixedCosts.${i}.value`}
                    render={({ field }) => (
                      <MoneyInput
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <select
                    className={SELECT_CLASS}
                    {...register(`fixedCosts.${i}.category`)}
                  >
                    {FIXED_COST_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => fixedField.remove(i)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 7. Margem e pagamentos */}
          <Card>
            <CardHeader>
              <CardTitle>7. Margem e pagamentos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <NumberField
                  register={register}
                  name="profitMargin"
                  label="Margem de lucro (%)"
                  errors={errors}
                />
                <NumberField
                  register={register}
                  name="failureRate"
                  label="Taxa de falha (%)"
                  hint="Default por impressão"
                />
                <NumberField
                  register={register}
                  name="overheadPercentage"
                  label="Custos indiretos (%)"
                  hint="Herança do MVP — substituído pelo rateio dos fixos"
                />
              </div>

              <div className="space-y-2">
                <Label>Taxas por meio de pagamento (%)</Label>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {(Object.keys(DEFAULT_PAYMENT_FEES) as PaymentMethod[]).map(
                    (method) => (
                      <div key={method} className="space-y-1">
                        <Label className="text-xs">
                          {PAYMENT_LABELS[method]}
                        </Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          {...register(`paymentFees.${method}`, {
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                    ),
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" disabled={saving} className="w-full md:w-auto">
            {saving ? "Salvando..." : "Salvar baseline"}
          </Button>
        </div>

        {/* ── Painel de resumo ao vivo ── */}
        <div className="lg:col-span-1">
          <Card className="lg:sticky lg:top-24">
            <CardHeader>
              <CardTitle>Resumo do cálculo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <SummaryRow
                label="Energia por hora"
                value={rates.energyCostPerHour}
              />
              <SummaryRow
                label="Depreciação por hora"
                value={rates.depreciationPerHour}
                hint={`Impressora + ${rates.printerTotalCost > 0 ? formatBRL(rates.printerTotalCost) : "R$ 0"} ÷ vida útil`}
              />
              <SummaryRow
                label="Custos fixos por hora"
                value={rates.fixedCostPerHour}
                hint={`${formatBRL(rates.monthlyFixedTotal)}/mês ÷ ${values.productiveHoursPerMonth || 160}h`}
              />
              <SummaryRow
                label="Mão de obra (impressão)"
                value={rates.laborPrintingPerHour}
              />
              <Separator />
              <SummaryRow
                label="Total por hora (máquina)"
                value={rates.totalCostPerHour}
                bold
              />
              <Separator />
              <SummaryRow
                label="Mão de obra modelagem"
                value={rates.laborModelingPerHour}
              />
              <SummaryRow
                label="Mão de obra montagem"
                value={rates.laborAssemblyPerHour}
              />
              {values.hasOwnDelivery && (
                <>
                  <SummaryRow label="Custo por km" value={rates.costPerKm} />
                  <SummaryRow
                    label="Custo por entrega"
                    value={rates.costPerDelivery}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}

function SummaryRow({
  label,
  value,
  hint,
  bold,
}: {
  label: string;
  value: number;
  hint?: string;
  bold?: boolean;
}) {
  return (
    <div className="space-y-0.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-muted-foreground">{label}</span>
        <span className={`font-mono ${bold ? "font-bold text-green-600" : ""}`}>
          {formatBRL(value, 2)}
        </span>
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
