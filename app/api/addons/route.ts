import { NextResponse } from "next/server";
import { getAllAddons, createAddon } from "@/lib/services/addon.service";
import { addonCreateSchema } from "@/lib/schemas";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get("active") === "true";
    const addons = await getAllAddons(activeOnly);
    return NextResponse.json(addons);
  } catch (err) {
    console.error("GET /api/addons:", err);
    return NextResponse.json(
      { error: "Erro ao listar addons" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = addonCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const created = await createAddon(parsed.data);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /api/addons:", err);
    return NextResponse.json(
      { error: "Erro ao salvar addon" },
      { status: 500 },
    );
  }
}
