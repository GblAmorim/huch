import { NextResponse } from "next/server";
import { getAllRecords } from "@/lib/services/record.service";

export async function GET() {
  const records = await getAllRecords();
  return NextResponse.json(records);
}
