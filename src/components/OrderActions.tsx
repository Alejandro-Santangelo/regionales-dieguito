"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface OrderActionsProps {
  orderId: string;
  currentStatus: string;
}

const statusConfig: Record<string, { label: string; color: string; nextStates: { label: string; estado: string; color: string }[] }> = {
  pending: {
    label: "Pendiente",
    color: "bg-yellow-100 text-yellow-800",
    nextStates: [
      { label: "Aceptar", estado: "paid", color: "bg-green-600 hover:bg-green-500 text-white" },
      { label: "Anular", estado: "cancelled", color: "bg-red-600 hover:bg-red-500 text-white" },
    ],
  },
  paid: {
    label: "Pagado",
    color: "bg-green-100 text-green-800",
    nextStates: [
      { label: "Marcar como Enviado", estado: "shipped", color: "bg-blue-600 hover:bg-blue-500 text-white" },
      { label: "Anular", estado: "cancelled", color: "bg-red-600 hover:bg-red-500 text-white" },
    ],
  },
  shipped: {
    label: "Enviado",
    color: "bg-blue-100 text-blue-800",
    nextStates: [
      { label: "Marcar como Entregado", estado: "delivered", color: "bg-green-600 hover:bg-green-500 text-white" },
    ],
  },
  delivered: {
    label: "Entregado",
    color: "bg-green-100 text-green-800",
    nextStates: [],
  },
  cancelled: {
    label: "Cancelado",
    color: "bg-red-100 text-red-800",
    nextStates: [],
  },
};

export function OrderActions({ orderId, currentStatus }: OrderActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const config = statusConfig[currentStatus] || {
    label: currentStatus,
    color: "bg-zinc-100 text-zinc-800",
    nextStates: [],
  };

  async function handleUpdateStatus(estado: string) {
    if (!confirm(`¿Estás seguro de cambiar el estado a "${statusConfig[estado]?.label || estado}"?`)) {
      return;
    }

    setLoading(estado);
    setError(null);

    try {
      const res = await fetch(`/api/ordenes/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al actualizar");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
      {config.nextStates.map((action) => (
        <button
          key={action.estado}
          onClick={() => handleUpdateStatus(action.estado)}
          disabled={loading !== null}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${action.color}`}
        >
          {loading === action.estado ? "..." : action.label}
        </button>
      ))}
      {error && (
        <span className="text-xs text-red-600 ml-2">{error}</span>
      )}
    </div>
  );
}
