import { NextResponse } from "next/server";
import { getBaseline, upsertBaseline } from "@/lib/services/baseline.service";
import { baselineSchema } from "@/lib/schemas";

export async function GET() {
  const baseline = await getBaseline();
  return NextResponse.json(baseline);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const parsed = baselineSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const saved = await upsertBaseline(parsed.data);
  return NextResponse.json(saved);
}
