import { NextResponse } from "next/server";
import { asc, ilike } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  filamentBrands,
  filamentMaterials,
  filamentTypes,
  filamentColors,
} from "@/lib/db/schema";
import { labelOptionSchema } from "@/lib/schemas";

const tables = {
  brand: filamentBrands,
  material: filamentMaterials,
  type: filamentTypes,
  color: filamentColors,
} as const;

type Kind = keyof typeof tables;

function getTable(kind: string): typeof filamentBrands | null {
  if (kind in tables) return tables[kind as Kind] as typeof filamentBrands;
  return null;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ kind: string }> },
) {
  const { kind } = await params;
  const table = getTable(kind);
  if (!table) {
    return NextResponse.json(
      { error: "Tipo de opção inválido" },
      { status: 400 },
    );
  }

  const rows = await db.select().from(table).orderBy(asc(table.label));
  return NextResponse.json(rows);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ kind: string }> },
) {
  const { kind } = await params;
  const table = getTable(kind);
  if (!table) {
    return NextResponse.json(
      { error: "Tipo de opção inválido" },
      { status: 400 },
    );
  }

  const body = await req.json();
  const parsed = labelOptionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const existing = await db
    .select({ id: table.id })
    .from(table)
    .where(ilike(table.label, parsed.data.label))
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json(
      { error: "Já existe um item com esse nome" },
      { status: 409 },
    );
  }

  const [created] = await db
    .insert(table)
    .values({ label: parsed.data.label, isCustom: true })
    .returning();
  return NextResponse.json(created, { status: 201 });
}
