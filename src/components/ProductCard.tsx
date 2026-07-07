import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string;
  stock: number;
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  category,
  images,
  stock,
}: ProductCardProps) {
  const imageList: string[] = JSON.parse(images);
  const mainImage = imageList[0] || "/images/productos/mate-clasico.svg";

  return (
    <Link
      href={`/productos/${id}`}
      className="group bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
    >
      <div className="relative aspect-square bg-zinc-50 overflow-hidden">
        <Image
          src={mainImage}
          alt={name}
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
        {category === "mate" && (
          <span className="absolute top-2 left-2 bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
            Mate
          </span>
        )}
        {category === "bombilla" && (
          <span className="absolute top-2 left-2 bg-zinc-100 text-zinc-800 text-xs font-medium px-2 py-1 rounded-full">
            Bombilla
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-zinc-900 truncate">{name}</h3>
        <p className="text-sm text-zinc-500 line-clamp-2 mt-1">
          {description}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-amber-700">
            ${price.toFixed(2)}
          </span>
          {stock > 0 && stock <= 5 && (
            <span className="text-xs text-orange-500">
              Quedan {stock}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
