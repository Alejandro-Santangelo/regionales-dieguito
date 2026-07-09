import { auth } from "@/lib/auth";
import Link from "next/link";
import { SignOutButton } from "./SignOutButton";
import { CartBadge } from "./CartBadge";

export async function AuthNav() {
  const session = await auth();
  const user = session?.user;

  return (
    <>
      {user ? (
        <>
          <CartBadge />
          <span className="text-sm text-zinc-500 hidden sm:block">
            {user.name || user.email}
          </span>
          <SignOutButton />
        </>
      ) : (
        <>
          <Link
            href="/auth/login"
            className="text-zinc-600 hover:text-zinc-900 font-medium transition-colors"
          >
            Ingresar
          </Link>
          <Link
            href="/auth/register"
            className="bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-amber-500 transition-colors"
          >
            Registrarse y Comprar
          </Link>
        </>
      )}
    </>
  );
}
