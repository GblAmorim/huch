import { NextResponse } from "next/server";
import { updateFilament } from "@/lib/services/filament.service";
import { filamentSchema } from "@/lib/schemas";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const parsed = filamentSchema.partial().safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const updated = await updateFilament(id, parsed.data);
    if (!updated) {
      return NextResponse.json(
        { error: "Filamento não encontrado" },
        { status: 404 },
      );
    }
    return NextResponse.json(updated);
  } catch (err) {
    console.error("PATCH /api/filaments/[id]:", err);
    return NextResponse.json(
      { error: "Erro ao atualizar filamento" },
      { status: 500 },
    );
  }
}
