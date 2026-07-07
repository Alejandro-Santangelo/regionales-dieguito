import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user || (user as { role?: string }).role !== "admin") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description, price, stock, category, images } = body;

    // Validaciones
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "El nombre del producto es obligatorio" },
        { status: 400 }
      );
    }

    if (!description || description.trim().length === 0) {
      return NextResponse.json(
        { error: "La descripción es obligatoria" },
        { status: 400 }
      );
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      return NextResponse.json(
        { error: "El precio debe ser un número positivo" },
        { status: 400 }
      );
    }

    const stockNum = parseInt(stock || "0", 10);
    if (isNaN(stockNum) || stockNum < 0) {
      return NextResponse.json(
        { error: "El stock debe ser un número válido" },
        { status: 400 }
      );
    }

    if (!category || !["mate", "bombilla"].includes(category)) {
      return NextResponse.json(
        { error: "Seleccioná una categoría válida (mate o bombilla)" },
        { status: 400 }
      );
    }

    let productImages: string[] = images || [];
    if (!Array.isArray(productImages)) {
      productImages = [];
    }

    // Si no hay imágenes, usar una imagen por defecto según categoría
    if (productImages.length === 0) {
      productImages = [
        category === "mate"
          ? "/images/productos/mate-clasico.svg"
          : "/images/productos/bombilla-acero.svg",
      ];
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        price: priceNum,
        stock: stockNum,
        category,
        images: JSON.stringify(productImages),
        userId: user.id as string,
      },
    });

    revalidatePath("/");
    revalidatePath("/productos");
    revalidatePath("/admin/productos");

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error al crear producto:", error);
    return NextResponse.json(
      { error: "Error al crear el producto" },
      { status: 500 }
    );
  }
}
