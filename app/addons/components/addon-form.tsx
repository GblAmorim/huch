"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addonSchema, type AddonInput } from "@/lib/schemas";
import { useAddons } from "@/lib/hooks/use-addons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MoneyInput } from "@/components/common/money-input";
import { Addon, NewAddon } from "@/lib/types";
import { useMemo } from "react";

const EMPTY_VALUES: AddonInput = {
  name: "",
  type: "accessory",
  packageQuantity: 0,
  packageSize: 0,
  purchasePrice: 0,
  purchaseUrl: "",
  costPerUnit: 0,
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
    () => ({
      ...EMPTY_VALUES,
      ...(addon ?? {}),
    }),
    [addon],
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddonInput>({
    resolver: zodResolver(addonSchema),
    defaultValues,
  });

  async function onSubmit(data: AddonInput) {
    const costPerUnitInCents = (data.packageSize / data.purchasePrice) * 100;
    const quantityBought = data.packageQuantity * data.packageSize;
    const stockQuantity = data.stockQuantity
      ? data.stockQuantity + quantityBought
      : quantityBought;
    const payload: NewAddon = {
      ...data,
      costPerUnit: costPerUnitInCents,
      stockQuantity,
      purchaseUrl: data.purchaseUrl ?? "",
      note: data.note ?? "",
    };
    console.log(payload);
    try {
      // await create(payload);
      toast.success("Addon cadastrado!");
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao cadastrar");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5 md:col-span-1">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            placeholder="Ex: Embalagem bolha"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="type">Tipo</Label>
          <select
            id="type"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            {...register("type")}
          >
            <option value="accessory">Acessório (produção)</option>
            <option value="packaging">Embalagem (logística)</option>
          </select>
          {errors.type && (
            <p className="text-sm text-destructive">{errors.type.message}</p>
          )}
        </div>
        <div className="flex gap-4">
          <div className="space-y-1.5 md:col-span-1">
            <Label htmlFor="packageSize">Tamanho do Pacote</Label>
            <Input
              id="packageSize"
              type="number"
              step={1}
              placeholder="Ex: 100"
              {...register("packageSize", { valueAsNumber: true })}
            />
            {errors.packageSize && (
              <p className="text-sm text-destructive">
                {errors.packageSize.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5 md:col-span-1">
            <Label htmlFor="purchasePrice">Preço de compra</Label>
            <Controller
              control={control}
              name="purchasePrice"
              render={
                ({ field }) => (
                  // isEditing ? (
                  //   <MoneyInput
                  //     value={field.value / 100}
                  //     onChange={field.onChange}
                  //     disabled={true}
                  //   />
                  // ) : (
                  <MoneyInput value={field.value} onChange={field.onChange} />
                )
                // )
              }
            />
            {errors.purchasePrice && (
              <p className="text-sm text-destructive">
                {errors.purchasePrice.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="space-y-1.5 md:col-span-1">
            <Label htmlFor="packageQuantity">Quantidade Comprada</Label>
            <Input
              id="packageQuantity"
              type="number"
              placeholder="Ex: 1"
              {...register("packageQuantity", { valueAsNumber: true })}
            />
            {errors.packageQuantity && (
              <p className="text-sm text-destructive">
                {errors.packageQuantity.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5 md:col-span-1">
            <Label htmlFor="purchaseUrl">URL da Compra</Label>
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
        </div>
        <div className="space-y-2">
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
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Cadastrar addon"}
      </Button>
    </form>
  );
}
