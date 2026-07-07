"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import ImageUploader from "@/components/ImageUploader";

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string;
  stock: number;
}

export function EditProductForm({ product }: { product: ProductData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<string[]>(
    product.images ? JSON.parse(product.images) : []
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: formData.get("price"),
      category: formData.get("category"),
      images,
      stock: formData.get("stock"),
    };

    const res = await fetch(`/api/productos/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error || "Error al actualizar");
      setLoading(false);
      return;
    }

    router.push("/admin/productos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Nombre del producto
        </label>
        <input
          type="text"
          name="name"
          required
          defaultValue={product.name}
          className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Descripción
        </label>
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={product.description}
          className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Precio ($)
          </label>
          <input
            type="number"
            name="price"
            required
            step="0.01"
            min="0"
            defaultValue={product.price}
            className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Stock
          </label>
          <input
            type="number"
            name="stock"
            required
            min="0"
            defaultValue={product.stock}
            className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Categoría
        </label>
        <select
          name="category"
          required
          defaultValue={product.category}
          className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
        >
          <option value="mate">Mate</option>
          <option value="bombilla">Bombilla</option>
        </select>
      </div>

      {/* Imágenes con ImageUploader */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          Imágenes del producto
        </label>
        <input type="hidden" name="images" value={JSON.stringify(images)} />
        <ImageUploader images={images} onChange={setImages} />
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-amber-600 text-white py-2 rounded-lg font-medium hover:bg-amber-500 transition-colors disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/productos")}
          className="px-6 py-2 border border-zinc-300 rounded-lg font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
