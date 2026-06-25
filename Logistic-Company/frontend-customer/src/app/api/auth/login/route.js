import { NextResponse } from "next/server";
import { store, publicUser } from "@/lib/server/store";
import { verifyPassword, signToken } from "@/lib/server/auth";

export async function POST(req) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ message: "Body permintaan tidak valid" }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";

  if (!email || !password) {
    return NextResponse.json({ message: "Email dan password wajib diisi" }, { status: 400 });
  }

  const user = store.users.get(email);
  if (!user || !verifyPassword(password, user.password)) {
    return NextResponse.json({ message: "Email atau password salah" }, { status: 401 });
  }

  const safe = publicUser(user);
  const token = signToken({ sub: user.id, email: user.email, name: user.name });

  return NextResponse.json({ user: safe, token });
}
