import Link from "next/link";
import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  const matesCount = await prisma.product.count({
    where: { category: "mate" },
  });
  const bombillasCount = await prisma.product.count({
    where: { category: "bombilla" },
  });

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-700 via-amber-600 to-amber-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 sm:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              Regionales Dieguito
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-amber-100">
              Los mejores mates y bombillas artesanales. Tradición argentina
              en cada detalle.
            </p>
            <div className="flex gap-4 mt-8">
              <Link
                href="/productos?categoria=mate"
                className="inline-flex items-center gap-2 bg-white text-amber-800 px-6 py-3 rounded-full font-semibold hover:bg-amber-50 transition-colors"
              >
                Ver Mates
              </Link>
              <Link
                href="/productos?categoria=bombilla"
                className="inline-flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-amber-400 transition-colors"
              >
                Ver Bombillas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-4 -mt-10">
        <div className="grid grid-cols-2 gap-4 sm:gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-3xl font-bold text-amber-700">{matesCount}</p>
            <p className="text-zinc-600 mt-1">Mates disponibles</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-3xl font-bold text-amber-700">
              {bombillasCount}
            </p>
            <p className="text-zinc-600 mt-1">Bombillas disponibles</p>
          </div>
        </div>
      </section>

      {/* Productos Recientes */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-zinc-900">
            Productos Destacados
          </h2>
          <Link
            href="/productos"
            className="text-amber-700 hover:text-amber-600 font-medium"
          >
            Ver todos →
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-zinc-200">
            <svg
              className="w-16 h-16 mx-auto text-zinc-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-zinc-700">
              No hay productos todavía
            </h3>
            <p className="mt-2 text-zinc-500">
              Comienza agregando tu primer producto.
            </p>
            <Link
              href="/productos/nuevo"
              className="inline-block mt-4 bg-amber-600 text-white px-6 py-2 rounded-full font-medium hover:bg-amber-500 transition-colors"
            >
              Agregar Producto
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </section>

      {/* Categorías */}
      <section className="bg-white border-t border-zinc-200 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-zinc-900 text-center mb-8">
            Categorías
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link
              href="/productos?categoria=mate"
              className="group relative h-48 rounded-xl overflow-hidden bg-gradient-to-r from-amber-800 to-amber-600"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <svg
                    className="w-16 h-16 mx-auto mb-2 opacity-80"
                    viewBox="0 0 200 250"
                    fill="currentColor"
                  >
                    <path d="M60,60 Q55,60 50,70 L30,200 Q25,220 40,230 L160,230 Q175,220 170,200 L150,70 Q145,60 140,60 Z" />
                  </svg>
                  <h3 className="text-2xl font-bold">Mates</h3>
                  <p className="text-amber-200">
                    {matesCount} productos
                  </p>
                </div>
              </div>
            </Link>
            <Link
              href="/productos?categoria=bombilla"
              className="group relative h-48 rounded-xl overflow-hidden bg-gradient-to-r from-zinc-700 to-zinc-500"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <svg
                    className="w-12 h-16 mx-auto mb-2 opacity-80"
                    viewBox="0 0 100 300"
                    fill="currentColor"
                  >
                    <rect x="42" y="50" width="16" height="200" rx="3" />
                    <rect
                      x="38"
                      y="30"
                      width="24"
                      height="20"
                      rx="5"
                    />
                  </svg>
                  <h3 className="text-2xl font-bold">Bombillas</h3>
                  <p className="text-zinc-300">
                    {bombillasCount} productos
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 text-zinc-400 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="font-semibold text-white">Regionales Dieguito</p>
          <p className="mt-1 text-sm">
            Mates y bombillas artesanales
          </p>
          <p className="mt-4 text-xs">
            © {new Date().getFullYear()} Regionales Dieguito. Todos los
            derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
