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

const OTHER_OPTION = "other";

interface SelectOption {
  id: string;
  label: string;
}

interface SelectWithCustomProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  onValueChange: (value: string) => void;
  className?: string;
  control: Control<TFieldValues>;
  loading?: boolean;
}

export function SelectWithCustom<TFieldValues extends FieldValues>({
  name,
  options,
  placeholder = "Selecione...",
  value,
  onValueChange,
  className,
  control,
  loading = false,
}: SelectWithCustomProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <>
          <Select
            value={value}
            disabled={loading}
            onValueChange={(value) => {
              onValueChange(value);
              field.onChange(value === OTHER_OPTION ? "" : value);
            }}
          >
            <SelectTrigger id={name} className={className}>
              {loading ? (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Carregando...
                </span>
              ) : (
                <SelectValue placeholder={placeholder}></SelectValue>
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
          {value === OTHER_OPTION && (
            <Input
              placeholder="Digite"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        </>
      )}
    />
  );
}
