"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createProduct(
  initialState: { error: string | null; success: boolean },
  formData: FormData
): Promise<{ error: string | null; success: boolean }> {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string, 10);
    const category = formData.get("category") as string;
    const imagesRaw = formData.get("images") as string;

    // Validaciones
    if (!name || name.trim().length === 0) {
      return { error: "El nombre del producto es obligatorio", success: false };
    }

    if (!description || description.trim().length === 0) {
      return { error: "La descripción es obligatoria", success: false };
    }

    if (isNaN(price) || price <= 0) {
      return { error: "El precio debe ser un número positivo", success: false };
    }

    if (isNaN(stock) || stock < 0) {
      return { error: "El stock debe ser un número válido", success: false };
    }

    if (!category || !["mate", "bombilla"].includes(category)) {
      return {
        error: "Seleccioná una categoría válida (mate o bombilla)",
        success: false,
      };
    }

    let images: string[] = [];
    try {
      images = JSON.parse(imagesRaw || "[]");
    } catch {
      images = [];
    }

    // Si no hay imágenes, usar una imagen por defecto según categoría
    if (images.length === 0) {
      images = [
        category === "mate"
          ? "/images/productos/mate-clasico.svg"
          : "/images/productos/bombilla-acero.svg",
      ];
    }

    // Crear producto (usuario temporal para desarrollo)
    // En producción, usar el usuario autenticado
    const user = await prisma.usuario.findFirst();
    if (!user) {
      return {
        error: "No hay usuarios registrados. Creá una cuenta primero.",
        success: false,
      };
    }

    await prisma.producto.create({
      data: {
        nombre: name.trim(),
        descripcion: description.trim(),
        precio: price,
        stock: stock,
        categoria: category,
        imagenes: JSON.stringify(images),
        usuarioId: user.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/productos");

    return { error: null, success: true };
  } catch (error) {
    console.error("Error al crear producto:", error);
    return {
      error: "Ocurrió un error al guardar el producto. Intentalo de nuevo.",
      success: false,
    };
  }
}
