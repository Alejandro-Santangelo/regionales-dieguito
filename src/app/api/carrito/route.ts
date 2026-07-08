import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// Obtener carrito del usuario
export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ items: [], total: 0 });
  }

  const user = await prisma.usuario.findUnique({
    where: { email: session.user.email },
    include: {
      carrito: {
        include: {
          items: {
            include: {
              producto: true,
            },
          },
        },
      },
    },
  });

  if (!user?.carrito) {
    return NextResponse.json({ items: [], total: 0 });
  }

  const items = user.carrito.items.map((item) => ({
    id: item.id,
    productId: item.productoId,
    name: item.producto.nombre,
    price: item.producto.precio,
    image: item.producto.imagenes ? JSON.parse(item.producto.imagenes)[0] : null,
    quantity: item.cantidad,
    stock: item.producto.stock,
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

  const user = await prisma.usuario.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  // Obtener o crear carrito
  let cart = await prisma.carrito.findUnique({
    where: { usuarioId: user.id },
  });

  if (!cart) {
    cart = await prisma.carrito.create({
      data: { usuarioId: user.id },
    });
  }

  // Verificar si el producto ya está en el carrito
  const existingItem = await prisma.carritoItem.findUnique({
    where: {
      carritoId_productoId: {
        carritoId: cart.id,
        productoId: productId,
      },
    },
  });

  if (existingItem) {
    // Actualizar cantidad
    await prisma.carritoItem.update({
      where: { id: existingItem.id },
      data: { cantidad: existingItem.cantidad + quantity },
    });
  } else {
    // Agregar nuevo item
    await prisma.carritoItem.create({
      data: {
        carritoId: cart.id,
        productoId: productId,
        cantidad: quantity,
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

  await prisma.carritoItem.update({
    where: { id: itemId },
    data: { cantidad: quantity },
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

  await prisma.carritoItem.delete({
    where: { id: itemId },
  });

  return NextResponse.json({ message: "Producto eliminado del carrito" });
}
