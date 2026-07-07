import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  const user = session?.user;
  const role = (user as any)?.role;

  if (role === "admin") {
    return NextResponse.redirect(new URL("/admin", process.env.NEXTAUTH_URL || "http://localhost:3000"));
  }

  return NextResponse.redirect(new URL("/", process.env.NEXTAUTH_URL || "http://localhost:3000"));
}
