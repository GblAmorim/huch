import { Input } from "@/components/ui/input";

interface MoneyInputProps {
  value?: number;
  onChange: (value: number) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function MoneyInput({
  value,
  onChange,
  placeholder = "0,00",
  disabled = false,
}: MoneyInputProps) {
  const hasValue = typeof value === "number" && Number.isFinite(value);
  const cents = hasValue ? Math.round(value * 100) : 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    const newCents =
      digits === "" ? 0 : Math.min(parseInt(digits, 10), 99999999);
    onChange(newCents / 100);
  };

  const formatted = hasValue
    ? (cents / 100).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "";

  return (
    <Input
      value={formatted}
      onChange={handleChange}
      inputMode="numeric"
      placeholder={placeholder}
      disabled={disabled}
    />
  );
}
