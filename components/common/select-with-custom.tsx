import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const OTHER_OPTION = "";

interface SelectOption {
  id: string;
  label: string;
}

interface SelectWithCustomProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  control: Control<TFieldValues>;
  loading?: boolean;
  disabled?: boolean;
  selected?: string;
}

export function SelectWithCustom<TFieldValues extends FieldValues>({
  name,
  options,
  placeholder = "Selecione...",
  className,
  control,
  loading = false,
  disabled = false,
  selected = "",
}: SelectWithCustomProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const isCustomValue =
          field.value !== "" &&
          field.value !== undefined &&
          !options.some((option) => option.label === field.value);

        return (
          <>
            <Select
              value={selected ?? field.value}
              disabled={loading || disabled}
              onValueChange={(value) => {
                field.onChange(value);
              }}
            >
              <SelectTrigger id={name} className={className}>
                {loading ? (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Carregando...
                  </span>
                ) : (
                  <SelectValue placeholder={placeholder} />
                )}
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {options.map((option) => (
                    <SelectItem key={option.id} value={option.label}>
                      {option.label}
                    </SelectItem>
                  ))}
                  <SelectItem value={OTHER_OPTION}>Outro</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {isCustomValue && (
              <Input
                placeholder="Digite"
                value={field.value}
                disabled={disabled}
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          </>
        );
      }}
    />
  );
}
