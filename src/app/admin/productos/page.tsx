import { prisma } from "@/lib/db";
import Link from "next/link";
import { DeleteButton } from "./delete-button";

export default async function AdminProductosPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="bg-amber-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-500 transition-colors"
        >
          + Nuevo Producto
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th className="px-6 py-4 text-sm font-medium text-zinc-500">
                Producto
              </th>
              <th className="px-6 py-4 text-sm font-medium text-zinc-500">
                Categoría
              </th>
              <th className="px-6 py-4 text-sm font-medium text-zinc-500">
                Precio
              </th>
              <th className="px-6 py-4 text-sm font-medium text-zinc-500">
                Stock
              </th>
              <th className="px-6 py-4 text-sm font-medium text-zinc-500">
                Creado por
              </th>
              <th className="px-6 py-4 text-sm font-medium text-zinc-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {product.images && JSON.parse(product.images)[0] && (
                      <img
                        src={JSON.parse(product.images)[0]}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover bg-zinc-100"
                      />
                    )}
                    <span className="font-medium text-zinc-900">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm capitalize text-zinc-500">
                  {product.category}
                </td>
                <td className="px-6 py-4 text-sm text-zinc-700">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-zinc-700">
                  {product.stock}
                </td>
                <td className="px-6 py-4 text-sm text-zinc-500">
                  {product.user?.name || "—"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/productos/${product.id}/editar`}
                      className="text-sm text-amber-600 hover:text-amber-500 font-medium"
                    >
                      Editar
                    </Link>
                    <DeleteButton productId={product.id} />
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-zinc-400">
                  No hay productos todavía
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
