import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { AuthNav } from "@/components/AuthNav";
import { SessionProvider } from "@/components/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Regionales Dieguito - Mates y Bombillas Artesanales",
  description:
    "Tienda online de mates y bombillas artesanales. Tradición argentina en cada detalle.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          {/* Navbar */}
          <nav className="bg-white border-b border-zinc-200 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
              <Link
                href="/"
                className="text-xl font-bold text-amber-800 hover:text-amber-700 transition-colors"
              >
                Regionales Dieguito
              </Link>
              <div className="flex items-center gap-6">
                <Link
                  href="/productos"
                  className="text-zinc-600 hover:text-zinc-900 font-medium transition-colors"
                >
                  Productos
                </Link>
                <AuthNav />
              </div>
            </div>
          </nav>

          <main className="flex-1">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
