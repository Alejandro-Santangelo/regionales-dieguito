"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { CartToast } from "@/components/CartToast";

export function AddToCartButton({
  productId,
  disabled,
  stock,
}: {
  productId: string;
  disabled: boolean;
  stock: number;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const maxQuantity = Math.min(stock, 100);

  async function handleAddToCart() {
    if (!session) {
      signIn(undefined, { callbackUrl: `/productos/${productId}` });
      return;
    }

    setLoading(true);

    const res = await fetch("/api/carrito", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    });

    if (res.ok) {
      setAdded(true);
      setShowToast(true);
      // Disparar evento para actualizar el badge del carrito
      window.dispatchEvent(new Event("cart-updated"));
      setTimeout(() => setAdded(false), 2000);
    }

    setLoading(false);
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Selector de cantidad */}
        {!disabled && !added && (
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-white/70">
              Cantidad:
            </label>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="w-9 h-9 rounded-lg border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                -
              </button>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-16 h-9 rounded-lg border border-white/30 bg-white/10 text-white text-center font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {Array.from({ length: maxQuantity }, (_, i) => i + 1).map(
                  (n) => (
                    <option key={n} value={n} className="text-zinc-900">
                      {n}
                    </option>
                  )
                )}
              </select>
              <button
                onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                disabled={quantity >= maxQuantity}
                className="w-9 h-9 rounded-lg border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
            <span className="text-xs text-white/50">
              (máx. {maxQuantity})
            </span>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleAddToCart}
            disabled={disabled || loading}
            className={`flex-1 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              added
                ? "bg-green-600 text-white"
                : "bg-amber-600 text-white hover:bg-amber-500"
            }`}
          >
            {disabled
              ? "Sin stock"
              : loading
              ? "Agregando..."
              : added
              ? "✓ Agregado"
              : "Agregar al Carrito"}
          </button>
        </div>
      </div>
      <CartToast
        message={`${quantity} ${quantity === 1 ? "producto" : "productos"} agregado${quantity === 1 ? "" : "s"} al carrito`}
        visible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}
