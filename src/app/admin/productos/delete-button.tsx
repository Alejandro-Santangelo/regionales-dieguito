"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    setLoading(true);
    const res = await fetch(`/api/productos/${productId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.refresh();
    } else {
      alert("Error al eliminar el producto");
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-sm text-red-600 hover:text-red-500 font-medium disabled:opacity-50"
    >
      {loading ? "Eliminando..." : "Eliminar"}
    </button>
  );
}
