"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface CartItem {
  quantity: number;
}

export function CartBadge() {
  const { data: session } = useSession();
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    if (!session) return;

    let cancelled = false;

    async function fetchCartCount() {
      try {
        const res = await fetch("/api/carrito");
        if (cancelled) return;
        const data = await res.json();
        const count = data.items?.reduce((sum: number, item: CartItem) => sum + item.quantity, 0) || 0;
        if (!cancelled) setItemCount(count);
      } catch {
        // Si hay error, mantener el valor actual
      }
    }

    fetchCartCount();

    const handleCartUpdate = () => fetchCartCount();
    window.addEventListener("cart-updated", handleCartUpdate);
    return () => {
      cancelled = true;
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, [session]);

  if (!session) return null;

  return (
    <Link
      href="/carrito"
      className="relative text-zinc-600 hover:text-zinc-900 font-medium transition-colors"
    >
      Carrito
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-4 bg-amber-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 leading-none">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}
