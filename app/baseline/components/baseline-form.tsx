"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  baselineSchema,
  PAYMENT_METHODS,
  PAYMENT_LABELS,
  type BaselineInput,
} from "@/lib/schemas";
import type { PaymentMethod } from "@/lib/types";
import { useBaseline } from "@/lib/hooks/use-baseline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function BaselineForm() {
  const { baseline, loading, saving, save } = useBaseline();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BaselineInput>({
    resolver: zodResolver(baselineSchema),
    defaultValues: {
      electricityCostPerKwh: 0,
      printerPowerWatts: 0,
      laborCostPerHour: 0,
      packagingCostPerOrder: 0,
      shippingCostPerKm: 0,
      profitMargin: 30,
      failureRate: 5,
      overheadPercentage: 10,
      paymentFees: {
        pix: 0,
        credit_card: 3.99,
        shopee: 12,
        mercado_livre: 14,
        boleto: 1.5,
        cash: 0,
      },
    },
  });

  // Carrega a baseline existente e preenche o formulário
  useEffect(() => {
    if (baseline) {
      reset({
        electricityCostPerKwh: baseline.electricityCostPerKwh,
        printerPowerWatts: baseline.printerPowerWatts,
        laborCostPerHour: baseline.laborCostPerHour,
        packagingCostPerOrder: baseline.packagingCostPerOrder,
        shippingCostPerKm: baseline.shippingCostPerKm,
        profitMargin: baseline.profitMargin,
        failureRate: baseline.failureRate,
        overheadPercentage: baseline.overheadPercentage,
        paymentFees: baseline.paymentFees,
      });
    }
  }, [baseline, reset]);

  async function onSubmit(data: BaselineInput) {
    try {
      await save(data);
      toast.success("Dados fixos salvos!");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao salvar dados fixos",
      );
    }
  }

  if (loading)
    return <p className="text-muted-foreground">Carregando configuração...</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* ── Custos de produção ─────────────────────────── */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Custos de produção
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="electricityCostPerKwh">Energia (R$/kWh)</Label>
            <Input
              id="electricityCostPerKwh"
              type="number"
              step="0.01"
              placeholder="0.75"
              {...register("electricityCostPerKwh", { valueAsNumber: true })}
            />
            {errors.electricityCostPerKwh && (
              <p className="text-sm text-destructive">
                {errors.electricityCostPerKwh.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="printerPowerWatts">
              Potência da impressora (W)
            </Label>
            <Input
              id="printerPowerWatts"
              type="number"
              step="1"
              placeholder="120"
              {...register("printerPowerWatts", { valueAsNumber: true })}
            />
            {errors.printerPowerWatts && (
              <p className="text-sm text-destructive">
                {errors.printerPowerWatts.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="laborCostPerHour">Mão de obra (R$/h)</Label>
            <Input
              id="laborCostPerHour"
              type="number"
              step="0.01"
              placeholder="25.00"
              {...register("laborCostPerHour", { valueAsNumber: true })}
            />
            {errors.laborCostPerHour && (
              <p className="text-sm text-destructive">
                {errors.laborCostPerHour.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Custos de logística ────────────────────────── */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Custos de logística
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="packagingCostPerOrder">
              Embalagem por pedido (R$)
            </Label>
            <Input
              id="packagingCostPerOrder"
              type="number"
              step="0.01"
              placeholder="3.00"
              {...register("packagingCostPerOrder", { valueAsNumber: true })}
            />
            {errors.packagingCostPerOrder && (
              <p className="text-sm text-destructive">
                {errors.packagingCostPerOrder.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="shippingCostPerKm">Entrega (R$/km)</Label>
            <Input
              id="shippingCostPerKm"
              type="number"
              step="0.01"
              placeholder="1.50"
              {...register("shippingCostPerKm", { valueAsNumber: true })}
            />
            {errors.shippingCostPerKm && (
              <p className="text-sm text-destructive">
                {errors.shippingCostPerKm.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Margens e taxas ────────────────────────────── */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Margens e taxas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="profitMargin">Margem de lucro (%)</Label>
            <Input
              id="profitMargin"
              type="number"
              step="0.1"
              placeholder="30"
              {...register("profitMargin", { valueAsNumber: true })}
            />
            {errors.profitMargin && (
              <p className="text-sm text-destructive">
                {errors.profitMargin.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="failureRate">Taxa de falha (%)</Label>
            <Input
              id="failureRate"
              type="number"
              step="0.1"
              placeholder="5"
              {...register("failureRate", { valueAsNumber: true })}
            />
            {errors.failureRate && (
              <p className="text-sm text-destructive">
                {errors.failureRate.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="overheadPercentage">Custos indiretos (%)</Label>
            <Input
              id="overheadPercentage"
              type="number"
              step="0.1"
              placeholder="10"
              {...register("overheadPercentage", { valueAsNumber: true })}
            />
            {errors.overheadPercentage && (
              <p className="text-sm text-destructive">
                {errors.overheadPercentage.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Taxas por meio de pagamento ────────────────── */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Taxas por meio de pagamento (%)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {PAYMENT_METHODS.map((method) => {
            const feePath =
              `paymentFees.${method}` as `paymentFees.${PaymentMethod}`;
            return (
              <div key={method} className="space-y-1.5">
                <Label htmlFor={feePath}>{PAYMENT_LABELS[method]}</Label>
                <Input
                  id={feePath}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register(feePath, { valueAsNumber: true })}
                />
              </div>
            );
          })}
        </div>
      </section>

      <Button type="submit" disabled={saving}>
        {saving ? "Salvando..." : "Salvar dados fixos"}
      </Button>
    </form>
  );
}
