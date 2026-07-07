"use client";

import Image from "next/image";
import { useRef, useState } from "react";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUploader({
  images,
  onChange,
  maxImages = 5,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    const remaining = maxImages - images.length;
    const filesToUpload = Array.from(files).slice(0, remaining);

    for (const file of filesToUpload) {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Error al subir imagen");
        }

        const data = await res.json();
        onChange([...images, data.url]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al subir la imagen"
        );
      } finally {
        setUploading(false);
      }
    }

    // Reset input
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {images.map((url, index) => (
          <div key={index} className="relative group">
            <Image
              src={url}
              alt={`Imagen ${index + 1}`}
              width={120}
              height={120}
              className="rounded-lg object-cover border border-zinc-200"
              style={{ width: 120, height: 120 }}
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              ×
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <label className="flex items-center justify-center w-[120px] h-[120px] border-2 border-dashed border-zinc-300 rounded-lg cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition-colors">
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              multiple
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
            <div className="text-center">
              {uploading ? (
                <div className="flex flex-col items-center gap-1">
                  <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-zinc-500">Subiendo...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <svg
                    className="w-8 h-8 text-zinc-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="text-xs text-zinc-500">Agregar foto</span>
                </div>
              )}
            </div>
          </label>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <p className="text-xs text-zinc-400">
        {images.length}/{maxImages} imágenes. Formatos: JPG, PNG, WebP, SVG.
        Máx. 5MB cada una.
      </p>
    </div>
  );
}
