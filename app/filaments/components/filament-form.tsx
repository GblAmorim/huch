"use client";

import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  filamentFormSchema,
  FilamentFormValues,
  type FilamentInput,
} from "@/lib/schemas";
import { useFilaments } from "@/lib/hooks/use-filaments";
import { useLabelOptions } from "@/lib/hooks/use-select-other";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MoneyInput } from "@/components/common/money-input";
import { SelectWithCustom } from "@/components/common/select-with-custom";
import { FloatInput } from "@/components/common/float-input";
import { Card, CardContent } from "@/components/ui/card";
import { Filament, NewFilament } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EMPTY_VALUES: FilamentInput = {
  brand: "",
  material: "",
  type: "",
  color: "",
  calibrationFlow: 0,
  rollSize: 0,
  rollPrice: 0,
  note: "",
  active: true,
};

const rollSizes = [
  { value: 250, label: "250 g" },
  { value: 500, label: "500 g" },
  { value: 1000, label: "1 Kg" },
  { value: 2000, label: "2 Kg" },
];

interface FilamentFormProps {
  filament?: Filament | null;
  onSaved?: () => void;
}

export function FilamentForm({ filament, onSaved }: FilamentFormProps) {
  const isEditing = Boolean(filament);
  const { create, update } = useFilaments();
  const brands = useLabelOptions("brand");
  const materials = useLabelOptions("material");
  const types = useLabelOptions("type");
  const colors = useLabelOptions("color");
  const [brandOption, setBrandOption] = useState("");
  const [materialOption, setMaterialOption] = useState("");
  const [typeOption, setTypeOption] = useState("");
  const [colorOption, setColorOption] = useState("");

  const defaultValues = useMemo<FilamentFormValues>(
    () => ({
      ...EMPTY_VALUES,
      ...(filament ?? {}),
      rollQuantity: 1,
    }),
    [filament],
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FilamentFormValues>({
    resolver: zodResolver(filamentFormSchema),
    defaultValues,
  });

  console.log("values: ", filament);

  async function onSubmit(data: FilamentFormValues) {
    const { rollQuantity, ...rest } = data;
    const costInCents = isEditing ? rest.rollPrice : rest.rollPrice * 100;
    const weightToAddG = rollQuantity * rest.rollSize;
    const pricePerKg = costInCents / (weightToAddG / 1000);
    const stockQuantity = rest.stockQuantity
      ? rest.stockQuantity + weightToAddG
      : weightToAddG;

    try {
      if (isEditing && filament) {
        const updatePayload: NewFilament = {
          ...rest,
          pricePerKg,
          calibrationFlow: rest.calibrationFlow ?? 0,
          stockQuantity,
          note: rest.note ?? "",
        };
        await update(filament.id, updatePayload);
        toast.success("Filamento atualizado.");
        onSaved?.();
      } else {
        const createPayload: NewFilament = {
          ...rest,
          rollPrice: costInCents,
          calibrationFlow: rest.calibrationFlow ?? 0,
          pricePerKg,
          stockQuantity,
          note: rest.note ?? "",
        };
        await create(createPayload);
        toast.success("Filamento cadastrado.");
      }
      reset(undefined, {
        keepErrors: false,
        keepIsSubmitted: false,
        keepTouched: false,
        keepIsValid: false,
      });
      setBrandOption("");
      setMaterialOption("");
      setTypeOption("");
      setColorOption("");
      clearErrors();
    } catch (err) {
      console.log(err);

      toast.error(err instanceof Error ? err.message : "Erro ao cadastrar");
    }
  }

  return (
    <Card>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 flex flex-col justify-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="space-y-2">
                <Label htmlFor="brand">Marca</Label>
                <SelectWithCustom
                  name="brand"
                  options={brands.options}
                  value={brandOption}
                  onValueChange={(value) => {
                    setBrandOption(value);
                  }}
                  placeholder="Selecione a Marca"
                  className="w-full"
                  control={control}
                  loading={brands.loading}
                  disabled={isEditing}
                  selected={filament?.brand}
                />
                {errors.brand && (
                  <p className="text-sm text-destructive">
                    {errors.brand.message}
                  </p>
                )}
              </div>

              <div className="flex gap-6 mt-4">
                <div className="space-y-2 w-full">
                  <Label htmlFor="material">Material</Label>
                  <SelectWithCustom
                    name="material"
                    options={materials.options}
                    value={materialOption}
                    onValueChange={(value) => {
                      setMaterialOption(value);
                    }}
                    placeholder="Selecione o Material"
                    className="w-full"
                    control={control}
                    loading={materials.loading}
                    disabled={isEditing}
                    selected={filament?.material}
                  />
                  {errors.material && (
                    <p className="text-sm text-destructive">
                      {errors.material.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 w-full">
                  <Label htmlFor="type">Tipo</Label>
                  <SelectWithCustom
                    name="type"
                    options={types.options}
                    value={typeOption}
                    onValueChange={(value) => {
                      setTypeOption(value);
                    }}
                    placeholder="Selecione o Tipo"
                    className="w-full"
                    control={control}
                    loading={types.loading}
                    disabled={isEditing}
                    selected={filament?.type}
                  />
                  {errors.type && (
                    <p className="text-sm text-destructive">
                      {errors.type.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="space-y-2 w-full">
                <Label htmlFor="color">Cor</Label>
                <SelectWithCustom
                  name="color"
                  options={colors.options}
                  value={colorOption}
                  onValueChange={(value) => {
                    setColorOption(value);
                  }}
                  placeholder="Selecione a Cor"
                  className="w-full"
                  control={control}
                  loading={colors.loading}
                  disabled={isEditing}
                  selected={filament?.color}
                />
                {errors.color && (
                  <p className="text-sm text-destructive">
                    {errors.color.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 w-full">
                <Label htmlFor="calibrationFlow">Calibragem (Fator K)</Label>
                <Controller
                  control={control}
                  name="calibrationFlow"
                  render={({ field }) => (
                    <FloatInput
                      value={field.value ?? 0}
                      onChange={field.onChange}
                      minimumFractionDigits={3}
                      maximumFractionDigits={3}
                    />
                  )}
                />
                {errors.calibrationFlow && (
                  <p className="text-sm text-destructive">
                    {errors.calibrationFlow.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <p>Dados do Rolo</p>
              <div className="flex gap-6">
                <div className="space-y-2">
                  <Label htmlFor="rollSize">Tamanho</Label>
                  <Controller
                    control={control}
                    name="rollSize"
                    render={({ field }) => (
                      <Select
                        value={field.value ? String(field.value) : undefined}
                        onValueChange={(value) => field.onChange(Number(value))}
                        disabled={isEditing}
                      >
                        <SelectTrigger className="w-full">
                          {isEditing && field.value ? (
                            (rollSizes.find(
                              (r) => r.value === Number(field.value),
                            )?.label ?? `${field.value} g`)
                          ) : (
                            <SelectValue placeholder="Selecione" />
                          )}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {rollSizes.map((roll) => (
                              <SelectItem
                                key={roll.value}
                                value={String(roll.value)}
                              >
                                {roll.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.rollSize && (
                    <p className="text-sm text-destructive">
                      {errors.rollSize.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rollPrice">Custo (R$)</Label>
                  <Controller
                    control={control}
                    name="rollPrice"
                    render={({ field }) =>
                      isEditing ? (
                        <MoneyInput
                          value={field.value / 100}
                          onChange={field.onChange}
                          disabled={true}
                        />
                      ) : (
                        <MoneyInput
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )
                    }
                  />
                  {errors.rollPrice && (
                    <p className="text-sm text-destructive">
                      {errors.rollPrice.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rollQuantity">Quantidade</Label>
                  <Input
                    id="rollQuantity"
                    type="number"
                    step="1"
                    placeholder="1"
                    {...register("rollQuantity", { valueAsNumber: true })}
                  />
                  <p className="text-xs">
                    Estoque:{" "}
                    {filament?.stockQuantity
                      ? filament.stockQuantity / 1000
                      : 0}{" "}
                    Kg
                  </p>
                  {errors.rollQuantity && (
                    <p className="text-sm text-destructive">
                      {errors.rollQuantity.message}
                    </p>
                  )}
                </div>
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
                <p className="text-sm text-destructive">
                  {errors.note.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-4/5 self-center"
          >
            {isSubmitting
              ? "Salvando..."
              : isEditing
                ? "Salvar Alterações"
                : "Cadastrar filamento"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
