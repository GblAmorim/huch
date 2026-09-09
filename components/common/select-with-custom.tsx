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
import { useState } from "react";

const OTHER_OPTION = "__other__";

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
}

export function SelectWithCustom<TFieldValues extends FieldValues>({
  name,
  options,
  placeholder = "Selecione...",
  className,
  control,
  loading = false,
  disabled = false,
}: SelectWithCustomProps<TFieldValues>) {
  const [customMode, setCustomMode] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const hasExistingCustom =
          field.value !== "" &&
          field.value !== undefined &&
          !options.some((option) => option.label === field.value);

        const showCustomInput = customMode || hasExistingCustom;

        return (
          <>
            <Select
              value={field.value}
              disabled={loading || disabled}
              onValueChange={(value) => {
                if (value === OTHER_OPTION) {
                  setCustomMode(true);
                  field.onChange("");
                } else {
                  setCustomMode(false);
                  field.onChange(value);
                }
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
            {showCustomInput && (
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
