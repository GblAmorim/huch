import { NextResponse } from "next/server";
import { getAllAddons, createAddon } from "@/lib/services/addon.service";
import { addonSchema } from "@/lib/schemas";

export async function GET() {
  const addons = await getAllAddons();
  return NextResponse.json(addons);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = addonSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const created = await createAddon(parsed.data);
  return NextResponse.json(created, { status: 201 });
}
