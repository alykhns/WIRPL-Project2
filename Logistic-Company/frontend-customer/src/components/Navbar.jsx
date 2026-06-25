"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

export default function Navbar() {
  const { user, initialized, init, logout } = useAuthStore();
  const count = useCartStore((s) => s.items.reduce((sum, i) => sum + i.qty, 0));

  useEffect(() => {
    init();
  }, [init]);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-gray-900">
          BabaExpress<span className="text-orange-600">.</span>
        </Link>

        <div className="flex items-center gap-5 text-sm">
          <Link href="/products" className="text-gray-700 hover:text-gray-900">
            Produk
          </Link>

          <Link href="/cart" className="relative text-gray-700 hover:text-gray-900">
            <ShoppingCart size={20} />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          {!initialized ? null : user ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-gray-600 sm:inline">Hai, {user.name}</span>
              <button
                onClick={logout}
                className="flex items-center gap-1 text-gray-700 hover:text-red-600"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/login" className="text-gray-700 hover:text-gray-900">
                Login
              </Link>
              <Link
                href="/auth/register"
                className="rounded-lg bg-gray-900 px-3 py-1.5 text-white hover:bg-gray-800"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
