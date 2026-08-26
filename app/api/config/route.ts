import { NextResponse } from "next/server";
import { getConfig, upsertConfig } from "@/lib/services/config.service";
import { configSchema } from "@/lib/schemas";

export async function GET() {
  const cfg = await getConfig();
  return NextResponse.json(cfg);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const parsed = configSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const saved = await upsertConfig(parsed.data);
  return NextResponse.json(saved);
}
