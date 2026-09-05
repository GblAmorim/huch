import { NextResponse } from "next/server";
import {
  getAllFilaments,
  createFilament,
} from "@/lib/services/filament.service";
import { filamentSchema } from "@/lib/schemas";

export async function GET() {
  const filaments = await getAllFilaments();
  return NextResponse.json(filaments);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = filamentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const created = await createFilament(parsed.data);
  return NextResponse.json(created, { status: 201 });
}
