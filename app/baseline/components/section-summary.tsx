export function SectionSummary({
  lines,
}: {
  lines: { label: string; value: string; formula?: string }[];
}) {
  return (
    <div className="mt-4 space-y-1 rounded-md border border-dashed bg-muted/20 p-3 text-xs">
      <p className="font-semibold uppercase tracking-wide text-muted-foreground">
        Como este valor é calculado
      </p>
      {lines.map((line) => (
        <div
          key={line.label}
          className="flex items-start justify-between gap-2"
        >
          <div>
            <p className="text-muted-foreground">{line.label}</p>
            {line.formula && (
              <p className="font-mono text-[11px] text-muted-foreground/70">
                {line.formula}
              </p>
            )}
          </div>
          <span className="font-mono font-semibold">{line.value}</span>
        </div>
      ))}
    </div>
  );
}
