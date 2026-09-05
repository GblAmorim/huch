"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pricingRequestSchema, type PricingRequestInput } from "@/lib/schemas";
import { useFilaments } from "@/lib/hooks/use-filaments";
import { useAddons } from "@/lib/hooks/use-addons";
import { usePricing, type PricingCalculation } from "@/lib/hooks/use-pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Props {
  onResult: (result: PricingCalculation) => void;
}

export function VariableDataForm({ onResult }: Props) {
  const { filaments, loading: loadingFilaments } = useFilaments(true);
  const { addons, loading: loadingAddons } = useAddons(true);
  const { calculate, loading } = usePricing();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PricingRequestInput>({
    resolver: zodResolver(pricingRequestSchema),
    defaultValues: {
      pieceName: "",
      printingData: {
        filamentId: "",
        filamentName: "",
        filamentCostPerKg: 0,
        filamentWeightG: 0,
        printTimeHours: 0,
        quantity: 1,
        failureRate: 5,
        distanceKm: 0,
      },
      addons: [],
      labor: [],
    },
  });

  const addonsField = useFieldArray({ control, name: "addons" });
  const laborField = useFieldArray({ control, name: "labor" });

  const selectedFilamentId = watch("printingData.filamentId");

  useEffect(() => {
    const filament = filaments.find((f) => f.id === selectedFilamentId);
    if (filament) {
      setValue("printingData.filamentName", filament.name);
      setValue("printingData.filamentCostPerKg", filament.costPerKg);
    }
  }, [selectedFilamentId, filaments, setValue]);

  async function onSubmit(data: PricingRequestInput) {
    const result = await calculate(data);
    if (result) {
      onResult(result);
      toast.success("Preço calculado e salvo!");
    }
  }

  if (loadingFilaments || loadingAddons) {
    return <p className="text-muted-foreground">Carregando dados...</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* ── Dados da peça ─────────────────────────────── */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Dados da peça
        </h3>
        <div className="space-y-1.5">
          <Label htmlFor="pieceName">Nome da peça</Label>
          <Input
            id="pieceName"
            placeholder="Ex: Suporte para celular v2"
            {...register("pieceName")}
          />
          {errors.pieceName && (
            <p className="text-sm text-destructive">
              {errors.pieceName.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="filamentId">Filamento</Label>
            <select
              id="filamentId"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              {...register("printingData.filamentId")}
            >
              <option value="">Selecione...</option>
              {filaments.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} — {f.material} (
                  {f.costPerKg.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                  /kg)
                </option>
              ))}
            </select>
            {errors.printingData?.filamentId && (
              <p className="text-sm text-destructive">
                {errors.printingData.filamentId.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="filamentWeightG">Peso do filamento (g)</Label>
            <Input
              id="filamentWeightG"
              type="number"
              step="0.1"
              placeholder="25.5"
              {...register("printingData.filamentWeightG", {
                valueAsNumber: true,
              })}
            />
            {errors.printingData?.filamentWeightG && (
              <p className="text-sm text-destructive">
                {errors.printingData.filamentWeightG.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="printTimeHours">Tempo de impressão (h)</Label>
            <Input
              id="printTimeHours"
              type="number"
              step="0.1"
              placeholder="3.5"
              {...register("printingData.printTimeHours", {
                valueAsNumber: true,
              })}
            />
            {errors.printingData?.printTimeHours && (
              <p className="text-sm text-destructive">
                {errors.printingData.printTimeHours.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quantity">Quantidade de peças</Label>
            <Input
              id="quantity"
              type="number"
              step="1"
              placeholder="1"
              {...register("printingData.quantity", { valueAsNumber: true })}
            />
            {errors.printingData?.quantity && (
              <p className="text-sm text-destructive">
                {errors.printingData.quantity.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="failureRate">Chance de falha (%)</Label>
            <Input
              id="failureRate"
              type="number"
              step="0.1"
              placeholder="5"
              {...register("printingData.failureRate", { valueAsNumber: true })}
            />
            {errors.printingData?.failureRate && (
              <p className="text-sm text-destructive">
                {errors.printingData.failureRate.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="distanceKm">Distância de entrega (km)</Label>
            <Input
              id="distanceKm"
              type="number"
              step="0.1"
              placeholder="0"
              {...register("printingData.distanceKm", { valueAsNumber: true })}
            />
            {errors.printingData?.distanceKm && (
              <p className="text-sm text-destructive">
                {errors.printingData.distanceKm.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Addons (acessórios + embalagens) ──────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Addons (acessórios e embalagens)
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              addonsField.append({
                addonId: "",
                name: "",
                type: "accessory",
                costPerUnit: 0,
                quantity: 1,
                total: 0,
              })
            }
          >
            + Adicionar addon
          </Button>
        </div>

        {addonsField.fields.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhum addon adicionado.
          </p>
        )}

        {addonsField.fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-12 gap-3 items-end rounded-md border p-3"
          >
            <div className="col-span-5 space-y-1.5">
              <Label>Addon</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register(`addons.${index}.addonId`)}
                onChange={(e) => {
                  const addon = addons.find((a) => a.id === e.target.value);
                  if (addon) {
                    setValue(`addons.${index}.name`, addon.name);
                    setValue(`addons.${index}.type`, addon.type);
                    setValue(`addons.${index}.costPerUnit`, addon.costPerUnit);
                    setValue(
                      `addons.${index}.total`,
                      addon.costPerUnit *
                        (watch(`addons.${index}.quantity`) || 1),
                    );
                  }
                }}
              >
                <option value="">Selecione...</option>
                {addons.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} (
                    {a.type === "accessory" ? "Acessório" : "Embalagem"})
                  </option>
                ))}
              </select>
            </div>
            <div className="col">
              <Label>Qtd</Label>
              <Input
                type="number"
                min={1}
                {...register(`addons.${index}.quantity`, {
                  valueAsNumber: true,
                })}
                onChange={(e) => {
                  const qty = Number(e.target.value) || 1;
                  const cost = watch(`addons.${index}.costPerUnit`) || 0;
                  setValue(`addons.${index}.total`, cost * qty);
                }}
              />
            </div>
            <div className="col-span-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={() => addonsField.remove(index)}
              >
                Remover
              </Button>
            </div>
          </div>
        ))}
      </section>

      {/* ── Trabalho manual / modelagem ───────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Trabalho manual / modelagem
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              laborField.append({
                description: "",
                hours: 0,
                costPerHour: 0,
                total: 0,
              })
            }
          >
            + Adicionar trabalho
          </Button>
        </div>

        {laborField.fields.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhum trabalho manual adicionado.
          </p>
        )}

        {laborField.fields.map((field, index) => (
          <div key={field.id}>
            <div className="grid grid-cols-12 gap-3 items-end rounded-md border p-3">
              <div className="col-span-4 space-y-1.5">
                <Label>Descrição</Label>
                <Input
                  placeholder="Ex: Lixar e pintar"
                  {...register(`labor.${index}.description`)}
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Horas</Label>
                <Input
                  type="number"
                  step="0.1"
                  {...register(`labor.${index}.hours`, { valueAsNumber: true })}
                  onChange={(e) => {
                    const hours = Number(e.target.value) || 0;
                    const cost = watch(`labor.${index}.costPerHour`) || 0;
                    setValue(`labor.${index}.total`, hours * cost);
                  }}
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>R$/h</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register(`labor.${index}.costPerHour`, {
                    valueAsNumber: true,
                  })}
                  onChange={(e) => {
                    const cost = Number(e.target.value) || 0;
                    const hours = watch(`labor.${index}.hours`) || 0;
                    setValue(`labor.${index}.total`, hours * cost);
                  }}
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Total</Label>
                <Input
                  type="number"
                  readOnly
                  value={watch(`labor.${index}.total`) || 0}
                />
              </div>
              <div className="col-span-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => laborField.remove(index)}
                >
                  Remover
                </Button>
              </div>
            </div>
          </div>
        ))}
      </section>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Calculando..." : "Calcular e salvar"}
      </Button>
    </form>
  );
}
