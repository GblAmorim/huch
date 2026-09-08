import { NextResponse } from "next/server";
import {
  getAllFilaments,
  createFilament,
  DuplicateFilamentError,
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
    return NextResponse.json({ error: "Dados inválidos", details: parsed.error.flatten() }, { status: 400 });
  }


  const data = parsed.data;
  const pricePerKg = data.pricePerKg ?? data.cost / data.quantityBoughtG;

  try {
    const created = await createFilament({ ...data, pricePerKg });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error('POST /api/filaments:', err);
    if (err instanceof DuplicateFilamentError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }

    return NextResponse.json({ error: 'Erro ao salvar filamento' }, { status: 500 });
  }
}
