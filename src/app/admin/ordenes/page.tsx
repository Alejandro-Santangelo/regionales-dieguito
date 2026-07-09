import { prisma } from "@/lib/db";
import Link from "next/link";
import { OrderActions } from "@/components/OrderActions";

export default async function AdminOrdenesPage() {
  const orders = await prisma.orden.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      usuario: { select: { nombre: true, email: true } },
      items: {
        include: { producto: { select: { nombre: true, imagenes: true } } },
      },
    },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Órdenes / Pedidos</h1>
          <p className="text-zinc-500 mt-1">
            Gestioná los pedidos de todos los clientes
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-xl font-semibold text-zinc-700 mb-2">
            No hay pedidos todavía
          </h2>
          <p className="text-zinc-500">
            Cuando los clientes finalicen una compra, los pedidos aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              {/* Cabecera de la orden */}
              <div className="px-6 py-4 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm text-zinc-500">
                    Orden #{order.id.slice(0, 8)}
                  </p>
                  <p className="font-medium text-zinc-900">
                    {order.usuario.nombre || order.usuario.email || "Usuario"}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {new Date(order.createdAt).toLocaleDateString("es-AR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <OrderActions
                    orderId={order.id}
                    currentStatus={order.estado}
                  />
                  <span className="text-lg font-bold text-amber-700">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Items de la orden */}
              <div className="px-6 py-4">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-zinc-100">
                      <th className="pb-2 text-xs font-medium text-zinc-400 uppercase">
                        Producto
                      </th>
                      <th className="pb-2 text-xs font-medium text-zinc-400 uppercase">
                        Cant.
                      </th>
                      <th className="pb-2 text-xs font-medium text-zinc-400 uppercase">
                        Precio
                      </th>
                      <th className="pb-2 text-xs font-medium text-zinc-400 uppercase text-right">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id} className="border-b border-zinc-50">
                        <td className="py-2 text-sm text-zinc-900">
                          {item.producto.nombre}
                        </td>
                        <td className="py-2 text-sm text-zinc-600">
                          {item.cantidad}
                        </td>
                        <td className="py-2 text-sm text-zinc-600">
                          ${item.precio.toFixed(2)}
                        </td>
                        <td className="py-2 text-sm text-zinc-900 text-right font-medium">
                          ${(item.precio * item.cantidad).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
