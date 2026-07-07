"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-sm text-zinc-500 hover:text-zinc-700 font-medium transition-colors"
    >
      Cerrar sesión
    </button>
  );
}
