"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
  stock: number;
}

export default function CarritoPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    try {
      const res = await fetch("/api/carrito");
      const data = await res.json();
      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Error al cargar carrito:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateQuantity(itemId: string, quantity: number) {
    if (quantity < 1) return;

    await fetch("/api/carrito", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, quantity }),
    });

    loadCart();
  }

  async function removeItem(itemId: string) {
    await fetch("/api/carrito", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId }),
    });

    loadCart();
  }

  async function checkout() {
    setCheckingOut(true);
    try {
      const res = await fetch("/api/ordenes", {
        method: "POST",
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Error al procesar la compra");
        return;
      }

      alert("¡Compra finalizada con éxito!");
      router.push("/");
      router.refresh();
    } catch (error) {
      alert("Error al procesar la compra");
    } finally {
      setCheckingOut(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-center text-zinc-500">Cargando carrito...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-zinc-900 mb-8">Mi Carrito</h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-semibold text-zinc-700 mb-2">
            Tu carrito está vacío
          </h2>
          <p className="text-zinc-500 mb-6">
            Agregá productos para empezar a comprar
          </p>
          <Link
            href="/productos"
            className="inline-block bg-amber-600 text-white px-6 py-3 rounded-full font-medium hover:bg-amber-500 transition-colors"
          >
            Ver Productos
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border border-zinc-200 p-4 flex items-center gap-4"
              >
                <div className="relative w-20 h-20 bg-zinc-50 rounded-lg overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-300">
                      📦
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/productos/${item.productId}`}
                    className="font-medium text-zinc-900 hover:text-amber-700 truncate block"
                  >
                    {item.name}
                  </Link>
                  <p className="text-amber-700 font-bold mt-1">
                    ${item.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-600 hover:bg-zinc-50 disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-600 hover:bg-zinc-50 disabled:opacity-30"
                  >
                    +
                  </button>
                </div>

                <div className="text-right min-w-[80px]">
                  <p className="font-bold text-zinc-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-400 p-2"
                  title="Eliminar"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Resumen y Finalizar Compra */}
          <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-zinc-900">Total</span>
              <span className="text-2xl font-bold text-amber-700">
                ${total.toFixed(2)}
              </span>
            </div>
            <button
              onClick={checkout}
              disabled={checkingOut}
              className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-500 transition-colors disabled:opacity-50"
            >
              {checkingOut ? "Procesando..." : "Finalizar Compra"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
