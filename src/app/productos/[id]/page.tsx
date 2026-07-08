import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { AddToCartButton } from "./add-to-cart-button";

export const dynamic = "force-dynamic";

interface ProductoDetalleProps {
  params: Promise<{ id: string }>;
}

export default async function ProductoDetallePage({
  params,
}: ProductoDetalleProps) {
  const { id } = await params;

  const session = await auth();
  const userRole = (session?.user as { role?: string })?.role;
  const isAdmin = userRole === "admin";

  const product = await prisma.producto.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  const imageList: string[] = JSON.parse(product.imagenes);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-white/70 mb-8">
        <Link href="/" className="hover:text-amber-300 transition-colors">
          Inicio
        </Link>
        <span>/</span>
        <Link
          href="/productos"
          className="hover:text-amber-300 transition-colors"
        >
          Productos
        </Link>
        <span>/</span>
        <Link
          href={`/productos?categoria=${product.categoria}`}
          className="hover:text-amber-300 transition-colors"
        >
          {product.categoria === "mate" ? "Mates" : "Bombillas"}
        </Link>
        <span>/</span>
        <span className="text-white font-medium truncate">
          {product.nombre}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Galería de imágenes */}
        <div>
          <div className="relative aspect-square bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden border border-zinc-200">
            <Image
              src={imageList[0] || "/images/productos/mate-clasico.svg"}
              alt={product.nombre}
              fill
              className="object-contain p-8"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Miniaturas */}
          {imageList.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {imageList.map((url, index) => (
                <div
                  key={index}
                  className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-zinc-200 bg-white/90 backdrop-blur-sm"
                >
                  <Image
                    src={url}
                    alt={`${product.nombre} - Imagen ${index + 1}`}
                    fill
                    className="object-contain p-2"
                    sizes="80px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            {product.categoria === "mate" ? (
              <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1 rounded-full">
                Mate
              </span>
            ) : (
              <span className="bg-zinc-100 text-zinc-800 text-xs font-medium px-2.5 py-1 rounded-full">
                Bombilla
              </span>
            )}
            {product.destacado && (
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-1 rounded-full">
                Destacado
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-white mt-2">
            {product.nombre}
          </h1>

          <p className="text-3xl font-bold text-amber-300 mt-4">
            ${product.precio.toFixed(2)}
          </p>

          <div className="mt-6">
            <h2 className="text-sm font-medium text-white/70">Descripción</h2>
            <p className="mt-2 text-white/80 leading-relaxed whitespace-pre-wrap">
              {product.descripcion}
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {/* Stock */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-sm text-green-300">
                    En stock ({product.stock} unidades)
                  </span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm text-red-400 font-medium">
                    Sin stock
                  </span>
                </>
              )}
            </div>

            {/* Fecha de publicación */}
            <p className="text-xs text-white/50">
              Publicado el{" "}
              {new Date(product.createdAt).toLocaleDateString("es-AR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 mt-8">
            {isAdmin ? (
              <Link
                href={`/admin/productos/${product.id}/editar`}
                className="flex-1 py-3 rounded-lg font-semibold text-center bg-amber-600 text-white hover:bg-amber-500 transition-colors"
              >
                Editar Producto
              </Link>
            ) : (
              <AddToCartButton
                productId={product.id}
                disabled={product.stock === 0}
              />
            )}
            <Link
              href="/productos"
              className="px-6 py-3 border border-white/30 rounded-lg font-medium text-white hover:bg-white/10 transition-colors"
            >
              Volver
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
