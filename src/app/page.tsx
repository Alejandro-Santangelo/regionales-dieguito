import Link from "next/link";
import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await prisma.producto.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  const matesCount = await prisma.producto.count({
    where: { categoria: "mate" },
  });
  const bombillasCount = await prisma.producto.count({
    where: { categoria: "bombilla" },
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 sm:py-28">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl sm:text-6xl leading-tight" style={{ fontFamily: "'Monotype Corsiva', 'Monotype Corsiva', cursive" }}>
              Regionales Dieguito
            </h1>
            <p className="mt-4 text-2xl sm:text-3xl text-amber-100" style={{ fontFamily: "'Monotype Corsiva', cursive" }}>
              Fabricación y venta de Articulos Regionales , especialidad en Mates y Bombillas , de Córdoba al Mundo
            </p>
            <p className="mt-2 text-xl sm:text-2xl text-amber-200" style={{ fontFamily: "'Monotype Corsiva', cursive" }}>
              Sierras de Córdoba - Argentina
            </p>
            <div className="flex gap-4 mt-8 justify-center">
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

      {/* Productos Recientes */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white drop-shadow-lg">
            Productos Destacados
          </h2>
          <Link
            href="/productos"
            className="text-amber-200 hover:text-amber-100 font-medium drop-shadow-lg"
          >
            Ver todos →
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 bg-white/90 backdrop-blur-sm rounded-xl border border-zinc-200">
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
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white drop-shadow-lg text-center mb-8">
            Categorías
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link
              href="/productos?categoria=mate"
              className="group relative h-48 rounded-xl overflow-hidden bg-gradient-to-r from-amber-800/90 to-amber-600/90 backdrop-blur-sm"
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
              className="group relative h-48 rounded-xl overflow-hidden bg-gradient-to-r from-zinc-700/90 to-zinc-500/90 backdrop-blur-sm"
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
      <footer className="bg-zinc-900/90 backdrop-blur-sm text-zinc-400 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="font-semibold text-white">Regionales Dieguito</p>
          <p className="mt-1 text-sm">
            Mates y bombillas artesanales
          </p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <a
              href="tel:+5493541678903"
              className="inline-flex items-center gap-2 text-amber-300 hover:text-amber-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Llamar
            </a>
            <a
              href="https://wa.me/5493541678903"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          </div>
          <p className="mt-4 text-sm text-amber-200">
            +54 9 3541 67-8903
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
