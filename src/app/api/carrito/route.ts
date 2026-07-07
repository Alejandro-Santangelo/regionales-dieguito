import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// Obtener carrito del usuario
export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ items: [], total: 0 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      cart: {
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  if (!user?.cart) {
    return NextResponse.json({ items: [], total: 0 });
  }

  const items = user.cart.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    name: item.product.name,
    price: item.product.price,
    image: item.product.images ? JSON.parse(item.product.images)[0] : null,
    quantity: item.quantity,
    stock: item.product.stock,
  }));

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return NextResponse.json({ items, total });
}

// Agregar item al carrito
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { productId, quantity = 1 } = await request.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  // Obtener o crear carrito
  let cart = await prisma.cart.findUnique({
    where: { userId: user.id },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: user.id },
    });
  }

  // Verificar si el producto ya está en el carrito
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  if (existingItem) {
    // Actualizar cantidad
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    // Agregar nuevo item
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });
  }

  return NextResponse.json({ message: "Producto agregado al carrito" });
}

// Actualizar cantidad de un item
export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { itemId, quantity } = await request.json();

  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });

  return NextResponse.json({ message: "Cantidad actualizada" });
}

// Eliminar item del carrito
export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { itemId } = await request.json();

  await prisma.cartItem.delete({
    where: { id: itemId },
  });

  return NextResponse.json({ message: "Producto eliminado del carrito" });
}
