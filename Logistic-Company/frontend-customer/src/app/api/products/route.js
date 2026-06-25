import { NextResponse } from "next/server";
import { store } from "@/lib/server/store";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim().toLowerCase();
  const category = (searchParams.get("category") || "").trim().toLowerCase();

  let products = store.products;
  if (q) {
    products = products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }
  if (category) {
    products = products.filter((p) => p.category.toLowerCase() === category);
  }

  return NextResponse.json({ products });
}
