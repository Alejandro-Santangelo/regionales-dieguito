import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// Crear una orden desde el carrito (finalizar compra)
export async function POST() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const user = await prisma.usuario.findUnique({
      where: { email: session.user.email },
      include: {
        carrito: {
          include: {
            items: {
              include: { producto: true },
            },
          },
        },
      },
    });

    if (!user?.carrito || user.carrito.items.length === 0) {
      return NextResponse.json(
        { error: "El carrito está vacío" },
        { status: 400 }
      );
    }

    // Calcular total
    const total = user.carrito.items.reduce(
      (sum, item) => sum + item.producto.precio * item.cantidad,
      0
    );

    // Crear la orden con sus items
    const order = await prisma.orden.create({
      data: {
        usuarioId: user.id,
        total,
        estado: "pending",
        items: {
          create: user.carrito.items.map((item) => ({
            productoId: item.productoId,
            cantidad: item.cantidad,
            precio: item.producto.precio,
          })),
        },
      },
    });

    // Vaciar el carrito
    await prisma.carritoItem.deleteMany({
      where: { carritoId: user.carrito.id },
    });

    return NextResponse.json(
      { message: "Compra finalizada exitosamente", orderId: order.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear orden:", error);
    return NextResponse.json(
      { error: "Error al procesar la compra" },
      { status: 500 }
    );
  }
}
