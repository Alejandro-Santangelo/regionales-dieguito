"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";

export function AddToCartButton({
  productId,
  disabled,
}: {
  productId: string;
  disabled: boolean;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleAddToCart() {
    if (!session) {
      signIn(undefined, { callbackUrl: `/productos/${productId}` });
      return;
    }

    setLoading(true);

    const res = await fetch("/api/carrito", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 }),
    });

    if (res.ok) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }

    setLoading(false);
  }

  return (
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
  );
}
