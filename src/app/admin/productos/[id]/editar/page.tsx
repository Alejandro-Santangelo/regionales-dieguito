import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { EditProductForm } from "./edit-form";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.producto.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-zinc-900 mb-8">
        Editar Producto
      </h1>
      <EditProductForm product={product} />
    </div>
  );
}
