"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";

export default function AdminNuevoProductoPage() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: formData.get("price"),
      stock: formData.get("stock"),
      category: formData.get("category"),
      images,
    };

    const res = await fetch("/api/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error || "Error al crear el producto");
      setLoading(false);
      return;
    }

    router.push("/admin/productos");
    router.refresh();
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-zinc-900 mb-8">
        Nuevo Producto
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
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
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando...
              </span>
            ) : (
              "Guardar Producto"
            )}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/productos")}
            className="px-6 py-3 border border-zinc-300 rounded-lg font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
