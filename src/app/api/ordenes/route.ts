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
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        cart: {
          include: {
            items: {
              include: { product: true },
            },
          },
        },
      },
    });

    if (!user?.cart || user.cart.items.length === 0) {
      return NextResponse.json(
        { error: "El carrito está vacío" },
        { status: 400 }
      );
    }

    // Calcular total
    const total = user.cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Crear la orden con sus items
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total,
        status: "pending",
        items: {
          create: user.cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });

    // Vaciar el carrito
    await prisma.cartItem.deleteMany({
      where: { cartId: user.cart.id },
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
