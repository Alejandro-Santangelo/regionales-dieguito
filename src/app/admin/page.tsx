import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function AdminPage() {
  const session = await auth();
  const user = session?.user;

  const productCount = await prisma.product.count();
  const userCount = await prisma.user.count();
  const orderCount = await prisma.order.count();
  const recentProducts = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { user: { select: { name: true } } },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">
            Panel de Administración
          </h1>
          <p className="text-zinc-500 mt-1">
            Bienvenido, {user?.name || "Admin"}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-3xl font-bold text-amber-700">{productCount}</p>
          <p className="text-zinc-600 mt-1">Productos</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-3xl font-bold text-amber-700">{userCount}</p>
          <p className="text-zinc-600 mt-1">Usuarios</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-3xl font-bold text-amber-700">{orderCount}</p>
          <p className="text-zinc-600 mt-1">Pedidos</p>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="flex gap-4 mb-8">
        <Link
          href="/admin/productos"
          className="bg-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-500 transition-colors"
        >
          Gestionar Productos
        </Link>
        <Link
          href="/admin/productos/nuevo"
          className="bg-white text-amber-700 border border-amber-300 px-6 py-3 rounded-lg font-medium hover:bg-amber-50 transition-colors"
        >
          + Nuevo Producto
        </Link>
      </div>

      {/* Productos recientes */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-zinc-900 mb-4">
          Productos Recientes
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-200">
                <th className="pb-3 text-sm font-medium text-zinc-500">
                  Producto
                </th>
                <th className="pb-3 text-sm font-medium text-zinc-500">
                  Categoría
                </th>
                <th className="pb-3 text-sm font-medium text-zinc-500">
                  Precio
                </th>
                <th className="pb-3 text-sm font-medium text-zinc-500">
                  Stock
                </th>
                <th className="pb-3 text-sm font-medium text-zinc-500">
                  Creado por
                </th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.map((product) => (
                <tr key={product.id} className="border-b border-zinc-100">
                  <td className="py-3 text-sm font-medium text-zinc-900">
                    {product.name}
                  </td>
                  <td className="py-3 text-sm text-zinc-500 capitalize">
                    {product.category}
                  </td>
                  <td className="py-3 text-sm text-zinc-700">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="py-3 text-sm text-zinc-700">
                    {product.stock}
                  </td>
                  <td className="py-3 text-sm text-zinc-500">
                    {product.user?.name || "—"}
                  </td>
                </tr>
              ))}
              {recentProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-zinc-400"
                  >
                    No hay productos todavía
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
