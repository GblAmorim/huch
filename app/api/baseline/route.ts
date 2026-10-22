import { NextResponse } from "next/server";
import { getBaseline, upsertBaseline } from "@/lib/services/baseline.service";
import { baselineSchema } from "@/lib/schemas";

export async function GET() {
  try {
    const baseline = await getBaseline();
    return NextResponse.json(baseline);
  } catch (err) {
    console.error("GET /api/baseline:", err);
    return NextResponse.json(
      { error: "Erro ao carregar baseline" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = baselineSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const saved = await upsertBaseline(parsed.data);
    return NextResponse.json(saved);
  } catch (err) {
    console.error("PUT /api/baseline:", err);
    return NextResponse.json(
      { error: "Erro ao salvar baseline" },
      { status: 500 },
    );
  }
}
