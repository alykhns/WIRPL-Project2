"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import CartItem from "@/components/CartItem";
import { formatIDR } from "@/lib/format";

export default function Cart() {
  const { items, clearCart, totalItems, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Keranjang kosong</h1>
        <p className="mt-2 text-gray-500">Belum ada barang di keranjang kamu.</p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-lg bg-gray-900 px-5 py-2.5 font-medium text-white hover:bg-gray-800"
        >
          Lihat Produk
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Keranjang</h1>
        <button onClick={clearCart} className="text-sm text-gray-500 hover:text-red-600">
          Kosongkan
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white px-5">
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5">
        <div>
          <p className="text-sm text-gray-500">{totalItems()} barang</p>
          <p className="text-xl font-bold text-gray-900">{formatIDR(totalPrice())}</p>
        </div>
        <Link
          href="/checkout"
          className="rounded-lg bg-orange-600 px-6 py-2.5 font-medium text-white hover:bg-orange-700"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}
