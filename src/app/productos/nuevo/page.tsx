"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";
import { useState } from "react";
import { createProduct } from "./actions";

const initialState = {
  error: null as string | null,
  success: false,
};

export default function NuevoProductoPage() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [state, formAction, pending] = useActionState(
    createProduct,
    initialState
  );

  if (state.success) {
    router.push("/productos");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-zinc-900 mb-8">
        Nuevo Producto
      </h1>

      <form action={formAction} className="space-y-6">
        {/* Nombre */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-zinc-700 mb-1"
          >
            Nombre del producto *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="Ej: Mate clásico de calabaza"
            className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors"
          />
        </div>

        {/* Descripción */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-zinc-700 mb-1"
          >
            Descripción *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            placeholder="Describe tu producto..."
            className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors resize-none"
          />
        </div>

        {/* Precio y Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-zinc-700 mb-1"
            >
              Precio ($) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              required
              min={0}
              step={0.01}
              placeholder="0.00"
              className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors"
            />
          </div>
          <div>
            <label
              htmlFor="stock"
              className="block text-sm font-medium text-zinc-700 mb-1"
            >
              Stock *
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              required
              min={0}
              placeholder="0"
              className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Categoría */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-zinc-700 mb-1"
          >
            Categoría *
          </label>
          <select
            id="category"
            name="category"
            required
            className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors bg-white"
          >
            <option value="">Seleccionar categoría</option>
            <option value="mate">Mate</option>
            <option value="bombilla">Bombilla</option>
          </select>
        </div>

        {/* Imágenes */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Imágenes del producto
          </label>
          <input type="hidden" name="images" value={JSON.stringify(images)} />
          <ImageUploader images={images} onChange={setImages} />
        </div>

        {/* Error */}
        {state.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {state.error}
          </div>
        )}

        {/* Botón submit */}
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Guardando...
            </span>
          ) : (
            "Guardar Producto"
          )}
        </button>
      </form>
    </div>
  );
}
