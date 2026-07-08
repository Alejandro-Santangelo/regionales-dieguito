import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:Cacho3103@localhost:5432/regionales-dieguito";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Sembrando la base de datos...");

  // Crear usuario admin "Cacho"
  const adminPassword = await bcrypt.hash("%Cacho497249", 12);
  const adminUser = await prisma.usuario.upsert({
    where: { email: "cacho@regionales.com" },
    update: {},
    create: {
      nombre: "Cacho",
      usuario: "Cacho",
      email: "cacho@regionales.com",
      hashContrasena: adminPassword,
      contrasena: "%Cacho497249",
      rol: "admin",
    },
  });

  console.log(`✅ Admin creado: ${adminUser.usuario} (${adminUser.email})`);

  // Crear usuario admin "Payo"
  const payoPassword = await bcrypt.hash("PayoTrolo", 12);
  const payoUser = await prisma.usuario.upsert({
    where: { email: "payo@regionales.com" },
    update: {},
    create: {
      nombre: "Payo",
      usuario: "Payo",
      email: "payo@regionales.com",
      hashContrasena: payoPassword,
      contrasena: "PayoTrolo",
      rol: "admin",
    },
  });

  console.log(`✅ Admin creado: ${payoUser.usuario} (${payoUser.email})`);

  // Crear usuario de prueba
  const user = await prisma.usuario.upsert({
    where: { email: "diego@regionales.com" },
    update: {},
    create: {
      nombre: "Diego",
      email: "diego@regionales.com",
    },
  });

  console.log(`✅ Usuario creado: ${user.email}`);

  // Productos de ejemplo - Mates
  const mates = [
    {
      nombre: "Mate Clásico de Calabaza",
      descripcion:
        "Mate tradicional de calabaza con virola de plata 925. Ideal para disfrutar del mate amargo o dulce. Incluye bombilla de acero inoxidable.",
      precio: 4500,
      categoria: "mate",
      imagenes: JSON.stringify([
        "/images/productos/mate-clasico.svg",
        "/images/productos/bombilla-acero.svg",
      ]),
      stock: 15,
      destacado: true,
    },
    {
      nombre: "Mate Torpedo de Madera",
      descripcion:
        "Mate torpedo artesanal tallado en madera de algarrobo. Diseño ergonómico con terminación laqueada. Resistente y duradero.",
      precio: 5800,
      categoria: "mate",
      imagenes: JSON.stringify(["/images/productos/mate-torpedo.svg"]),
      stock: 8,
      destacado: true,
    },
    {
      nombre: "Mate Imperial de Cuero",
      descripcion:
        "Mate imperial forrado en cuero vacuno con virola de alpaca. Incluye bombilla pico de loro. Un clásico de la tradición argentina.",
      precio: 7200,
      categoria: "mate",
      imagenes: JSON.stringify([
        "/images/productos/mate-clasico.svg",
        "/images/productos/mate-torpedo.svg",
      ]),
      stock: 5,
      destacado: true,
    },
    {
      nombre: "Mate Camionero",
      descripcion:
        "Mate camionero de tamaño grande. Capacidad de 250ml. Perfecto para largas jornadas. Base antideslizante incluida.",
      precio: 3900,
      categoria: "mate",
      imagenes: JSON.stringify(["/images/productos/mate-clasico.svg"]),
      stock: 20,
      destacado: false,
    },
    {
      nombre: "Mate Pintado a Mano",
      descripcion:
        "Mate decorado artesanalmente con pintura esmaltada. Diseños únicos e irrepetibles. Cada pieza es una obra de arte.",
      precio: 6500,
      categoria: "mate",
      imagenes: JSON.stringify(["/images/productos/mate-torpedo.svg"]),
      stock: 3,
      destacado: true,
    },
  ];

  // Productos de ejemplo - Bombillas
  const bombillas = [
    {
      nombre: "Bombilla de Acero Inoxidable",
      descripcion:
        "Bombilla de acero inoxidable 18/8. Filtro tipo cuchara. Resistente a la corrosión. Fácil de limpiar.",
      precio: 1800,
      categoria: "bombilla",
      imagenes: JSON.stringify(["/images/productos/bombilla-acero.svg"]),
      stock: 30,
      destacado: true,
    },
    {
      nombre: "Bombilla de Plata 925",
      descripcion:
        "Bombilla artesanal de plata 925 con detalles ornamentales. Filtro tipo cuchara. Incluye estuche de regalo.",
      precio: 8500,
      categoria: "bombilla",
      imagenes: JSON.stringify(["/images/productos/bombilla-plata.svg"]),
      stock: 10,
      destacado: true,
    },
    {
      nombre: "Bombilla Pico de Loro",
      descripcion:
        "Bombilla estilo pico de loro en alpaca. Diseño clásico con filtro tipo cuchara. Ideal para mate amargo.",
      precio: 3200,
      categoria: "bombilla",
      imagenes: JSON.stringify(["/images/productos/bombilla-acero.svg"]),
      stock: 12,
      destacado: false,
    },
    {
      nombre: "Set de 4 Bombillas",
      descripcion:
        "Juego de 4 bombillas de acero inoxidable. Ideal para compartir con amigos. Cada una con diseño diferente.",
      precio: 5500,
      categoria: "bombilla",
      imagenes: JSON.stringify([
        "/images/productos/bombilla-acero.svg",
        "/images/productos/bombilla-plata.svg",
      ]),
      stock: 7,
      destacado: true,
    },
    {
      nombre: "Bombilla Dorada 18K",
      descripcion:
        "Bombilla bañada en oro 18K. Edición limitada. Filtro tipo cuchara con diseño exclusivo. Presentación de lujo.",
      precio: 15000,
      categoria: "bombilla",
      imagenes: JSON.stringify(["/images/productos/bombilla-plata.svg"]),
      stock: 2,
      destacado: true,
    },
  ];

  // Insertar productos
  const allProducts = [...mates, ...bombillas];

  for (const product of allProducts) {
    await prisma.producto.create({
      data: {
        ...product,
        usuarioId: user.id,
      },
    });
    console.log(`  ✅ Producto creado: ${product.nombre}`);
  }

  console.log(`\n🎉 ¡Base de datos sembrada exitosamente!`);
  console.log(`   - ${mates.length} mates`);
  console.log(`   - ${bombillas.length} bombillas`);
}

main()
  .catch((e) => {
    console.error("❌ Error durante la siembra:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
