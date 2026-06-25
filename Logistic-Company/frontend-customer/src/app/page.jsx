import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">
        BabaExpress
      </h1>
      <p className="mx-auto mt-4 max-w-md text-gray-500">
        Belanja perlengkapan logistik & lacak pengiriman dalam satu aplikasi.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/products"
          className="rounded-lg bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-800"
        >
          Mulai Belanja
        </Link>
        <Link
          href="/auth/login"
          className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
        >
          Masuk
        </Link>
      </div>
    </div>
  );
}
