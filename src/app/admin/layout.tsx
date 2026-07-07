import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/auth/login?callbackUrl=/admin");
  }

  if ((user as { role?: string }).role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Admin Navigation */}
      <nav className="bg-white border-b border-zinc-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link
                href="/admin"
                className="text-lg font-bold text-amber-700"
              >
                Panel Admin
              </Link>
              <div className="flex items-center gap-4">
                <Link
                  href="/admin"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/productos"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  Productos
                </Link>
                <Link
                  href="/admin/productos/nuevo"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  + Nuevo
                </Link>
                <Link
                  href="/admin/ordenes"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  Órdenes
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-500">
                {user?.name || user?.email}
              </span>
              <Link
                href="/"
                className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
              >
                Ver tienda →
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
