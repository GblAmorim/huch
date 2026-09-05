import { Input } from "@/components/ui/input";

interface FloatInputProps {
  value: number;
  onChange: (value: number) => void;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export function FloatInput({
  value,
  onChange,
  minimumFractionDigits = 2,
  maximumFractionDigits = 2,
}: FloatInputProps) {
  const scaled = Math.round(value * 1000);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    const newScaled = digits === "" ? 0 : Math.min(parseInt(digits, 10), 999);
    onChange(newScaled / 1000);
  };

  const formatted = (scaled / 1000).toLocaleString("pt-BR", {
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: maximumFractionDigits,
  });

  return (
    <Input
      value={formatted}
      onChange={handleChange}
      inputMode="numeric"
      placeholder="0,000"
    />
  );
}
