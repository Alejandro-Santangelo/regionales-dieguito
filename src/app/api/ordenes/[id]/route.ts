import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// Actualizar estado de una orden (solo admin)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const user = await prisma.usuario.findUnique({
    where: { email: session.user.email },
  });

  if (user?.rol !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id } = await params;
  const { estado } = await request.json();

  const estadosValidos = ["pending", "paid", "shipped", "delivered", "cancelled"];
  if (!estadosValidos.includes(estado)) {
    return NextResponse.json(
      { error: "Estado no válido" },
      { status: 400 }
    );
  }

  try {
    const orden = await prisma.orden.findUnique({
      where: { id },
    });

    if (!orden) {
      return NextResponse.json(
        { error: "Orden no encontrada" },
        { status: 404 }
      );
    }

    // Validar transiciones de estado permitidas
    const transicionesPermitidas: Record<string, string[]> = {
      pending: ["paid", "cancelled"],
      paid: ["shipped", "cancelled"],
      shipped: ["delivered"],
      delivered: [],
      cancelled: [],
    };

    const transiciones = transicionesPermitidas[orden.estado] || [];
    if (!transiciones.includes(estado)) {
      return NextResponse.json(
        {
          error: `No se puede cambiar de "${orden.estado}" a "${estado}". Transiciones permitidas: ${transiciones.join(", ") || "ninguna"}`,
        },
        { status: 400 }
      );
    }

    const ordenActualizada = await prisma.orden.update({
      where: { id },
      data: { estado },
    });

    return NextResponse.json({
      message: "Estado actualizado correctamente",
      orden: ordenActualizada,
    });
  } catch (error) {
    console.error("Error al actualizar orden:", error);
    return NextResponse.json(
      { error: "Error al actualizar la orden" },
      { status: 500 }
    );
  }
}
