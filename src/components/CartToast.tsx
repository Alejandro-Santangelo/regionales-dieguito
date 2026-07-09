"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface CartToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
}

export function CartToast({ message, visible, onClose }: CartToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="bg-white rounded-xl shadow-2xl border border-zinc-200 p-4 flex items-center gap-4 min-w-[280px]">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          <span className="text-green-600 text-lg">✓</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zinc-900">{message}</p>
        </div>
        <Link
          href="/carrito"
          className="text-sm font-semibold text-amber-700 hover:text-amber-600 whitespace-nowrap"
          onClick={onClose}
        >
          Ver Carrito
        </Link>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-600 p-1"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
