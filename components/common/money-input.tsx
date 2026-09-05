import { Input } from "@/components/ui/input";

interface MoneyInputProps {
  value: number; // valor em reais
  onChange: (value: number) => void;
  placeholder?: string;
}

export function MoneyInput({
  value,
  onChange,
  placeholder = "0,00",
}: MoneyInputProps) {
  const cents = Math.round(value * 100);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    const newCents =
      digits === "" ? 0 : Math.min(parseInt(digits, 10), 99999999);
    onChange(newCents / 100);
  };

  const formatted = (cents / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <Input
      value={formatted}
      onChange={handleChange}
      inputMode="numeric"
      placeholder={placeholder}
    />
  );
}
