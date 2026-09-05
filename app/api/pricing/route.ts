import { NextResponse } from "next/server";
import { calculatePrice } from "@/lib/services/pricing.service";
import { getBaseline } from "@/lib/services/baseline.service";
import { createRecord } from "@/lib/services/record.service";
import { pricingRequestSchema } from "@/lib/schemas";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = pricingRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const baseline = await getBaseline();
  if (!baseline) {
    return NextResponse.json(
      { error: "Configure os dados fixos antes de calcular" },
      { status: 400 },
    );
  }

  const { pieceName, printingData, addons, labor } = parsed.data;
  const result = calculatePrice({ printingData, addons, labor, baseline });

  const record = await createRecord({
    pieceName,
    printingData,
    addons,
    labor,
    baselineSnapshot: baseline,
    result,
  });

  return NextResponse.json({ result, record });
}
