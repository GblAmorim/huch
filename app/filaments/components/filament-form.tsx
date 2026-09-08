"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { filamentSchema, type FilamentInput } from "@/lib/schemas";
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
import { Filament } from "@/lib/types";

const OTHER_OPTION = "other";

const EMPTY_VALUES: FilamentInput = {
  brand: "",
  material: "",
  type: "",
  color: "",
  cost: 0,
  calibrationFlow: 0,
  quantityBoughtG: 0,
  note: "",
  active: true,
};

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

  const {
    register,
    control,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FilamentInput>({
    resolver: zodResolver(filamentSchema),
    defaultValues: EMPTY_VALUES,
    values: filament ?? undefined,
  });

  async function onSubmit(data: FilamentInput) {
    const hasUnfilledCustom = [
      data.brand,
      data.material,
      data.type,
      data.color,
    ].some((value) => value === OTHER_OPTION);
    if (hasUnfilledCustom) {
      toast.error("Preencha os campos selecionados como 'Outro'.");
      return;
    }

    const costInCents = data.cost * 100;
    const pricePerKg = costInCents / (data.quantityBoughtG / 1000);
    const payload = {
      ...data,
      cost: costInCents,
      calibrationFlow: data.calibrationFlow ?? 0,
      pricePerKg,
    };
    try {
      if (isEditing && filament) {
        await update(filament.id, payload);
        toast.success("Filamento atualizado.");
        onSaved?.();
      } else {
        await create(payload);
        toast.success("Filamento cadastrado.");
        reset(undefined, {
          keepErrors: false,
          keepIsSubmitted: false,
          keepTouched: false,
          keepIsValid: false,
        });
      }
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
                  placeholder="Selecione a Marca"
                  className="w-full"
                  control={control}
                  loading={brands.loading}
                  disabled={isEditing}
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
                    placeholder="Selecione o Material"
                    className="w-full"
                    control={control}
                    loading={materials.loading}
                    disabled={isEditing}
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
                    placeholder="Selecione o Tipo"
                    className="w-full"
                    control={control}
                    loading={types.loading}
                    disabled={isEditing}
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
                  placeholder="Selecione a Cor"
                  className="w-full"
                  control={control}
                  loading={colors.loading}
                  disabled={isEditing}
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

            <div className="flex gap-6">
              <div className="space-y-2">
                <Label htmlFor="cost">Custo do Rolo (R$)</Label>
                <Controller
                  control={control}
                  name="cost"
                  render={({ field }) => (
                    <MoneyInput value={field.value} onChange={field.onChange} />
                  )}
                />
                {errors.cost && (
                  <p className="text-sm text-destructive">
                    {errors.cost.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantityBoughtG">Quantidade (g)</Label>
                <Input
                  id="quantityBoughtG"
                  type="number"
                  step="1"
                  placeholder="500"
                  {...register("quantityBoughtG", { valueAsNumber: true })}
                />
                {errors.quantityBoughtG && (
                  <p className="text-sm text-destructive">
                    {errors.quantityBoughtG.message}
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
