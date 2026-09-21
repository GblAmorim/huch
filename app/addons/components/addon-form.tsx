"use client";

import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addonSchema, type AddonInput } from "@/lib/schemas";
import { useAddons } from "@/lib/hooks/use-addons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MoneyInput } from "@/components/common/money-input";
import type { Addon, ContainedUnit } from "@/lib/types";
import {
  compatibleUnits,
  computeAddonCosts,
  CONSUMPTION_TYPE_OPTIONS,
  CONTAINED_UNIT_OPTIONS,
  PURCHASE_UNIT_OPTIONS,
  unitLabel,
} from "@/lib/utils/addon-costs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatBRL } from "@/lib/utils/formatters";

const SELECT_CLASS =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm";

const EMPTY_VALUES: AddonInput = {
  name: "",
  type: "accessory",
  purchasePrice: 0,
  purchaseUnit: "pack",
  packageQuantity: 1,
  containedAmount: 1,
  containedUnit: "unit",
  consumptionType: "exact",
  consumptionUnit: "unit",
  quantityUsed: 1,
  wastePercentage: 0,
  isPerOrder: false,
  purchaseUrl: "",
  stockQuantity: 0,
  note: "",
  active: true,
};

interface AddonFormProps {
  addon?: Addon | null;
  onSaved?: () => void;
}

export function AddonForm({ addon, onSaved }: AddonFormProps) {
  const isEditing = Boolean(addon);
  const { create } = useAddons();

  const defaultValues = useMemo<AddonInput>(
    () => ({ ...EMPTY_VALUES, ...(addon ?? {}) }),
    [addon],
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddonInput>({
    resolver: zodResolver(addonSchema),
    defaultValues,
  });

  const values = watch();

  const preview = computeAddonCosts({
    purchasePrice: values.purchasePrice,
    packageQuantity: values.packageQuantity,
    containedAmount: values.containedAmount,
    containedUnit: values.containedUnit,
    consumptionType: values.consumptionType,
    consumptionUnit: values.consumptionUnit,
    quantityUsed: values.quantityUsed,
    wastePercentage: values.wastePercentage,
    isPerOrder: values.isPerOrder,
  });

  const purchaseUnitMeta =
    PURCHASE_UNIT_OPTIONS.find((o) => o.value === values.purchaseUnit) ??
    PURCHASE_UNIT_OPTIONS[0];
  const consumptionUnits = compatibleUnits(values.containedUnit);
  const contentUnitLabel = unitLabel(values.containedUnit);
  const consumptionUnitLabel = unitLabel(values.consumptionUnit);
  const isPerOrderMode = values.consumptionType === "perOrder";
  const isEstimated = values.consumptionType === "estimated";

  async function onSubmit(data: AddonInput) {
    try {
      await create({
        ...data,
        isPerOrder: data.isPerOrder || data.consumptionType === "perOrder",
      });
      toast.success(
        isEditing ? "Adicional atualizado!" : "Adicional cadastrado!",
      );
      if (!isEditing) reset(EMPTY_VALUES);
      onSaved?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao cadastrar");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            placeholder="Ex: Fita adesiva transparente"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="type">Tipo</Label>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select
                value={field.value ? field.value : undefined}
                onValueChange={(value) => field.onChange(value)}
                disabled={isEditing}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="accessory">
                      Acessório (produção)
                    </SelectItem>
                    <SelectItem value="packaging">
                      Embalagem (logística)
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.type && (
            <p className="text-sm text-destructive">{errors.type.message}</p>
          )}
        </div>
      </div>

      <fieldset className="space-y-4 rounded-md border p-4">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Como você comprou
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex gap-6">
            <div className="space-y-1.5 w-48">
              <Label htmlFor="purchaseUnit">Formato de compra</Label>
              <Controller
                control={control}
                name="purchaseUnit"
                render={({ field }) => (
                  <Select
                    value={field.value ? field.value : undefined}
                    onValueChange={(value) => field.onChange(value)}
                    disabled={isEditing}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {PURCHASE_UNIT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="containedAmount">
                {purchaseUnitMeta.contentLabel}
              </Label>
              <Input
                id="containedAmount"
                type="number"
                step="0.01"
                min="0"
                placeholder="Ex: 50"
                {...register("containedAmount", { valueAsNumber: true })}
              />
              {errors.containedAmount && (
                <p className="text-sm text-destructive">
                  {errors.containedAmount.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-6">
            <div className="space-y-1.5 w-48">
              <Label htmlFor="packageQuantity">Quantidade comprada</Label>
              <Input
                id="packageQuantity"
                type="number"
                step="1"
                min="1"
                {...register("packageQuantity", { valueAsNumber: true })}
              />
              {errors.packageQuantity && (
                <p className="text-sm text-destructive">
                  {errors.packageQuantity.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>
                Preço pago (por {purchaseUnitMeta.label.toLowerCase()})
              </Label>
              <Controller
                control={control}
                name="purchasePrice"
                render={({ field }) => (
                  <MoneyInput value={field.value} onChange={field.onChange} />
                )}
              />
              {errors.purchasePrice && (
                <p className="text-sm text-destructive">
                  {errors.purchasePrice.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="containedUnit">Unidade do conteúdo</Label>
            <Controller
              control={control}
              name="containedUnit"
              render={({ field }) => (
                <select
                  id="containedUnit"
                  className={SELECT_CLASS}
                  value={field.value}
                  onChange={(e) => {
                    const next = e.target.value as ContainedUnit;
                    field.onChange(next);
                    setValue("consumptionUnit", compatibleUnits(next)[0], {
                      shouldValidate: true,
                    });
                  }}
                >
                  {CONTAINED_UNIT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-md border p-4">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Como você usa no produto
        </legend>

        <div className="space-y-1.5 md:w-1/2">
          <Label htmlFor="consumptionType">Modo de consumo</Label>
          <select
            id="consumptionType"
            className={SELECT_CLASS}
            {...register("consumptionType")}
          >
            {CONSUMPTION_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            {
              CONSUMPTION_TYPE_OPTIONS.find(
                (o) => o.value === values.consumptionType,
              )?.hint
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="quantityUsed">
              {isPerOrderMode
                ? "Quantidade por pedido"
                : "Quantidade usada por peça"}
            </Label>
            <div className="flex gap-2">
              <Input
                id="quantityUsed"
                type="number"
                step="0.01"
                min="0"
                placeholder="1"
                className=""
                {...register("quantityUsed", { valueAsNumber: true })}
              />
              <select
                className={`${SELECT_CLASS} w-28`}
                {...register("consumptionUnit")}
              >
                {consumptionUnits.map((u) => (
                  <option key={u} value={u}>
                    {unitLabel(u)}
                  </option>
                ))}
              </select>
            </div>
            {errors.quantityUsed && (
              <p className="text-sm text-destructive">
                {errors.quantityUsed.message}
              </p>
            )}
          </div>

          {isEstimated && (
            <div className="space-y-1.5">
              <Label htmlFor="wastePercentage">Sobra/perda estimada (%)</Label>
              <Input
                id="wastePercentage"
                type="number"
                step="1"
                min="0"
                max="100"
                placeholder="Ex: 10"
                {...register("wastePercentage", { valueAsNumber: true })}
              />
              {errors.wastePercentage && (
                <p className="text-sm text-destructive">
                  {errors.wastePercentage.message}
                </p>
              )}
            </div>
          )}
        </div>
      </fieldset>

      <div className="space-y-2 rounded-md border bg-muted/30 p-4 text-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Prévia do cálculo
        </p>

        {preview.unitMismatch ? (
          <p className="text-destructive">
            As unidades de compra e consumo são incompatíveis.
          </p>
        ) : (
          <>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Custo por {contentUnitLabel}
              </span>
              <span className="font-mono">
                {formatBRL(preview.costPerUnit, 2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {preview.isPerOrder ? "Custo por pedido" : "Custo por peça"}
                {preview.wasteFactor > 1 &&
                  ` (+${values.wastePercentage || 0}% de sobra)`}
              </span>
              <span className="font-mono font-semibold text-green-600">
                {formatBRL(preview.estimatedCostPerProduct, 2)}
              </span>
            </div>
            <p className="border-t pt-2 text-xs text-muted-foreground">
              {formatBRL(values.purchasePrice || 0)} ÷{" "}
              {preview.totalContainedAmount /
                Math.max(1, values.packageQuantity || 1)}{" "}
              {contentUnitLabel} = {formatBRL(preview.costPerUnit, 2)} por{" "}
              {contentUnitLabel} · estoque total: {preview.totalContainedAmount}{" "}
              {contentUnitLabel} · consumo: {values.quantityUsed || 0}{" "}
              {consumptionUnitLabel}
            </p>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="purchaseUrl">URL da compra</Label>
          <Input
            id="purchaseUrl"
            type="url"
            placeholder="Ex: https://www.exemplo.com"
            {...register("purchaseUrl")}
          />
          {errors.purchaseUrl && (
            <p className="text-sm text-destructive">
              {errors.purchaseUrl.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="note">Nota</Label>
          <Input
            id="note"
            type="text"
            placeholder="Digite uma nota"
            {...register("note")}
          />
          {errors.note && (
            <p className="text-sm text-destructive">{errors.note.message}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full md:w-auto"
      >
        {isSubmitting
          ? "Salvando..."
          : isEditing
            ? "Salvar alterações"
            : "Cadastrar Adicional"}
      </Button>
    </form>
  );
}
