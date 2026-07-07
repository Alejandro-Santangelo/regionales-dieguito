import Link from "next/link";
import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

interface ProductosPageProps {
  searchParams: Promise<{ categoria?: string }>;
}

export default async function ProductosPage({
  searchParams,
}: ProductosPageProps) {
  const { categoria } = await searchParams;

  const where = categoria ? { category: categoria } : {};

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Productos</h1>
          <p className="text-zinc-500 mt-1">
            {categoria === "mate"
              ? "Mates artesanales"
              : categoria === "bombilla"
              ? "Bombillas artesanales"
              : "Todos nuestros productos"}
          </p>
        </div>
        <Link
          href="/productos/nuevo"
          className="bg-amber-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-amber-500 transition-colors text-center"
        >
          + Nuevo Producto
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-8">
        <Link
          href="/productos"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !categoria
              ? "bg-amber-600 text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          Todos
        </Link>
        <Link
          href="/productos?categoria=mate"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            categoria === "mate"
              ? "bg-amber-600 text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          Mates
        </Link>
        <Link
          href="/productos?categoria=bombilla"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            categoria === "bombilla"
              ? "bg-amber-600 text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          Bombillas
        </Link>
      </div>

      {/* Grid de productos */}
      {products.length === 0 ? (
        <div className="text-center py-20">
          <svg
            className="w-20 h-20 mx-auto text-zinc-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <h3 className="mt-4 text-xl font-medium text-zinc-700">
            {categoria
              ? `No hay ${categoria === "mate" ? "mates" : "bombillas"} disponibles`
              : "No hay productos disponibles"}
          </h3>
          <p className="mt-2 text-zinc-500">
            {categoria
              ? "Vuelve pronto o revisa otras categorías."
              : "Agrega tu primer producto para empezar a vender."}
          </p>
          {!categoria && (
            <Link
              href="/productos/nuevo"
              className="inline-block mt-6 bg-amber-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-amber-500 transition-colors"
            >
              Agregar Producto
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
}
