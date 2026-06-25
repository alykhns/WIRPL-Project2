"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { formatIDR } from "@/lib/format";

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-3 flex h-28 items-center justify-center rounded-lg bg-gray-100 text-3xl">
        📦
      </div>
      <span className="text-xs font-medium uppercase tracking-wide text-orange-600">
        {product.category}
      </span>
      <h3 className="mt-1 font-semibold text-gray-900">{product.name}</h3>
      <p className="mt-1 line-clamp-2 flex-1 text-sm text-gray-500">{product.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-bold text-gray-900">{formatIDR(product.price)}</span>
        <button
          onClick={handleAdd}
          className="rounded-lg bg-gray-900 px-3 py-1.5 text-sm text-white hover:bg-gray-800"
        >
          {added ? "Ditambahkan ✓" : "Tambah"}
        </button>
      </div>
    </div>
  );
}
