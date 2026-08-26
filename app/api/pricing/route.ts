import { NextResponse } from "next/server";
import { calculatePrice } from "@/lib/services/pricing.service";
import { getConfig } from "@/lib/services/config.service";
import { createRecord } from "@/lib/services/record.service";
import { pricingCalcSchema } from "@/lib/schemas";

export async function POST(req: Request) {
  const body = await req.json();

  // Se não vier config no body, busca do banco
  if (!body.config) {
    const cfg = await getConfig();
    if (!cfg) {
      return NextResponse.json(
        { error: "Configure os dados fixos antes de calcular" },
        { status: 400 },
      );
    }
    body.config = cfg;
  }

  const parsed = pricingCalcSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { filamentWeightG, printTimeHours, config: cfg } = parsed.data;
  const result = calculatePrice(filamentWeightG, printTimeHours, cfg);

  // Salva o registro
  const record = await createRecord({
    pieceName: body.pieceName ?? "Peça sem nome",
    filamentWeightG,
    printTimeHours,
    configSnapshot: cfg,
    ...result,
  });

  return NextResponse.json({ ...result, record });
}
