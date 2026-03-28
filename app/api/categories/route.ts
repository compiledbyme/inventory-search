import { NextResponse } from "next/server";
import { searchEngine } from "@/lib/searchEngine";

export async function GET() {
  const categories = searchEngine.getCategories();
  return NextResponse.json({ categories });
}
