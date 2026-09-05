"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addonSchema, type AddonInput } from "@/lib/schemas";
import { useAddons } from "@/lib/hooks/use-addons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function AddonForm() {
  const { create } = useAddons();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddonInput>({
    resolver: zodResolver(addonSchema),
    defaultValues: {
      name: "",
      type: "accessory",
      costPerUnit: 0,
      active: true,
    },
  });

  async function onSubmit(data: AddonInput) {
    try {
      await create(data);
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
        <div className="space-y-1.5">
          <Label htmlFor="costPerUnit">Custo unitário (R$)</Label>
          <Input
            id="costPerUnit"
            type="number"
            step="0.01"
            placeholder="2.50"
            {...register("costPerUnit", { valueAsNumber: true })}
          />
          {errors.costPerUnit && (
            <p className="text-sm text-destructive">
              {errors.costPerUnit.message}
            </p>
          )}
        </div>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Cadastrar addon"}
      </Button>
    </form>
  );
}
