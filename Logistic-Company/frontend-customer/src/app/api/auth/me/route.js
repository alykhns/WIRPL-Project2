import { NextResponse } from "next/server";
import { store, publicUser } from "@/lib/server/store";
import { getBearerToken, verifyToken } from "@/lib/server/auth";

export async function GET(req) {
  const token = getBearerToken(req);
  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ message: "Token tidak valid atau kedaluwarsa" }, { status: 401 });
  }

  const user = store.users.get(payload.email);
  if (!user) {
    return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ user: publicUser(user) });
}
