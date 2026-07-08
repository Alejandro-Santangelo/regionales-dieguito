import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagenes: string;
  stock: number;
}

export default function ProductCard({
  id,
  nombre,
  descripcion,
  precio,
  categoria,
  imagenes,
  stock,
}: ProductCardProps) {
  const imageList: string[] = JSON.parse(imagenes);
  const mainImage = imageList[0] || "/images/productos/mate-clasico.svg";

  return (
    <Link
      href={`/productos/${id}`}
      className="group bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
    >
      <div className="relative aspect-square bg-zinc-50 overflow-hidden">
        <Image
          src={mainImage}
          alt={nombre}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Sin stock
            </span>
          </div>
        )}
        {categoria === "mate" && (
          <span className="absolute top-2 left-2 bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
            Mate
          </span>
        )}
        {categoria === "bombilla" && (
          <span className="absolute top-2 left-2 bg-zinc-100 text-zinc-800 text-xs font-medium px-2 py-1 rounded-full">
            Bombilla
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white truncate">{nombre}</h3>
        <p className="text-sm text-white/80 line-clamp-2 mt-1">
          {descripcion}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-amber-300">
            ${precio.toFixed(2)}
          </span>
          {stock > 0 && stock <= 5 && (
            <span className="text-xs text-amber-200">
              Quedan {stock}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
