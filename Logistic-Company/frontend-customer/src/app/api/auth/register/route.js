import { NextResponse } from "next/server";
import { store, publicUser } from "@/lib/server/store";
import { hashPassword, signToken } from "@/lib/server/auth";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ message: "Body permintaan tidak valid" }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";

  const errors = {};
  if (!name) errors.name = "Nama wajib diisi";
  if (!email) errors.email = "Email wajib diisi";
  else if (!emailRegex.test(email)) errors.email = "Format email tidak valid";
  if (!password) errors.password = "Password wajib diisi";
  else if (password.length < 6) errors.password = "Password minimal 6 karakter";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ message: "Validasi gagal", errors }, { status: 400 });
  }

  if (store.users.has(email)) {
    return NextResponse.json({ message: "Email sudah terdaftar" }, { status: 409 });
  }

  const user = {
    id: store.nextUserId++,
    name,
    email,
    password: hashPassword(password),
  };
  store.users.set(email, user);

  const safe = publicUser(user);
  const token = signToken({ sub: user.id, email: user.email, name: user.name });

  return NextResponse.json({ user: safe, token }, { status: 201 });
}
