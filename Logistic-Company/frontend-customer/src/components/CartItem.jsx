"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatIDR } from "@/lib/format";

export default function CartItem({ item }) {
  const { updateQty, removeItem } = useCartStore();

  return (
    <div className="flex items-center gap-4 border-b border-gray-100 py-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-100 text-xl">
        📦
      </div>

      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{item.name}</h3>
        <p className="text-sm text-gray-500">{formatIDR(item.price)}</p>
      </div>

      <div className="flex items-center rounded-lg border border-gray-200">
        <button
          onClick={() => updateQty(item.id, item.qty - 1)}
          className="px-2 py-1.5 text-gray-600 hover:text-gray-900 disabled:opacity-40"
          disabled={item.qty <= 1}
          aria-label="Kurangi"
        >
          <Minus size={14} />
        </button>
        <span className="w-8 text-center text-sm">{item.qty}</span>
        <button
          onClick={() => updateQty(item.id, item.qty + 1)}
          className="px-2 py-1.5 text-gray-600 hover:text-gray-900"
          aria-label="Tambah"
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="w-24 text-right font-semibold text-gray-900">
        {formatIDR(item.price * item.qty)}
      </div>

      <button
        onClick={() => removeItem(item.id)}
        className="text-gray-400 hover:text-red-600"
        aria-label="Hapus"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
