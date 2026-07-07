import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";

const dbPath = path.join(__dirname, "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Sembrando la base de datos...");

  // Crear usuario admin "Cacho"
  const adminPassword = await bcrypt.hash("%Cacho497249", 12);
  const adminUser = await prisma.user.upsert({
    where: { email: "cacho@regionales.com" },
    update: {},
    create: {
      name: "Cacho",
      username: "Cacho",
      email: "cacho@regionales.com",
      password: adminPassword,
      role: "admin",
    },
  });

  console.log(`✅ Admin creado: ${adminUser.username} (${adminUser.email})`);

  // Crear usuario admin "Payo"
  const payoPassword = await bcrypt.hash("PayoTrolo", 12);
  const payoUser = await prisma.user.upsert({
    where: { email: "payo@regionales.com" },
    update: {},
    create: {
      name: "Payo",
      username: "Payo",
      email: "payo@regionales.com",
      password: payoPassword,
      role: "admin",
    },
  });

  console.log(`✅ Admin creado: ${payoUser.username} (${payoUser.email})`);

  // Crear usuario de prueba
  const user = await prisma.user.upsert({
    where: { email: "diego@regionales.com" },
    update: {},
    create: {
      name: "Diego",
      email: "diego@regionales.com",
    },
  });

  console.log(`✅ Usuario creado: ${user.email}`);

  // Productos de ejemplo - Mates
  const mates = [
    {
      name: "Mate Clásico de Calabaza",
      description:
        "Mate tradicional de calabaza con virola de plata 925. Ideal para disfrutar del mate amargo o dulce. Incluye bombilla de acero inoxidable.",
      price: 4500,
      category: "mate",
      images: JSON.stringify([
        "/images/productos/mate-clasico.svg",
        "/images/productos/bombilla-acero.svg",
      ]),
      stock: 15,
      featured: true,
    },
    {
      name: "Mate Torpedo de Madera",
      description:
        "Mate torpedo artesanal tallado en madera de algarrobo. Diseño ergonómico con terminación laqueada. Resistente y duradero.",
      price: 5800,
      category: "mate",
      images: JSON.stringify(["/images/productos/mate-torpedo.svg"]),
      stock: 8,
      featured: true,
    },
    {
      name: "Mate Imperial de Cuero",
      description:
        "Mate imperial forrado en cuero vacuno con virola de alpaca. Incluye bombilla pico de loro. Un clásico de la tradición argentina.",
      price: 7200,
      category: "mate",
      images: JSON.stringify([
        "/images/productos/mate-clasico.svg",
        "/images/productos/mate-torpedo.svg",
      ]),
      stock: 5,
      featured: true,
    },
    {
      name: "Mate Camionero",
      description:
        "Mate camionero de tamaño grande. Capacidad de 250ml. Perfecto para largas jornadas. Base antideslizante incluida.",
      price: 3900,
      category: "mate",
      images: JSON.stringify(["/images/productos/mate-clasico.svg"]),
      stock: 20,
      featured: false,
    },
    {
      name: "Mate Pintado a Mano",
      description:
        "Mate decorado artesanalmente con pintura esmaltada. Diseños únicos e irrepetibles. Cada pieza es una obra de arte.",
      price: 6500,
      category: "mate",
      images: JSON.stringify(["/images/productos/mate-torpedo.svg"]),
      stock: 3,
      featured: true,
    },
  ];

  // Productos de ejemplo - Bombillas
  const bombillas = [
    {
      name: "Bombilla de Acero Inoxidable",
      description:
        "Bombilla de acero inoxidable 18/8. Filtro tipo cuchara. Resistente a la corrosión. Fácil de limpiar.",
      price: 1800,
      category: "bombilla",
      images: JSON.stringify(["/images/productos/bombilla-acero.svg"]),
      stock: 30,
      featured: true,
    },
    {
      name: "Bombilla de Plata 925",
      description:
        "Bombilla artesanal de plata 925 con detalles ornamentales. Filtro tipo cuchara. Incluye estuche de regalo.",
      price: 8500,
      category: "bombilla",
      images: JSON.stringify(["/images/productos/bombilla-plata.svg"]),
      stock: 10,
      featured: true,
    },
    {
      name: "Bombilla Pico de Loro",
      description:
        "Bombilla estilo pico de loro en alpaca. Diseño clásico con filtro tipo cuchara. Ideal para mate amargo.",
      price: 3200,
      category: "bombilla",
      images: JSON.stringify(["/images/productos/bombilla-acero.svg"]),
      stock: 12,
      featured: false,
    },
    {
      name: "Set de 4 Bombillas",
      description:
        "Juego de 4 bombillas de acero inoxidable. Ideal para compartir con amigos. Cada una con diseño diferente.",
      price: 5500,
      category: "bombilla",
      images: JSON.stringify([
        "/images/productos/bombilla-acero.svg",
        "/images/productos/bombilla-plata.svg",
      ]),
      stock: 7,
      featured: true,
    },
    {
      name: "Bombilla Dorada 18K",
      description:
        "Bombilla bañada en oro 18K. Edición limitada. Filtro tipo cuchara con diseño exclusivo. Presentación de lujo.",
      price: 15000,
      category: "bombilla",
      images: JSON.stringify(["/images/productos/bombilla-plata.svg"]),
      stock: 2,
      featured: true,
    },
  ];

  // Insertar productos
  const allProducts = [...mates, ...bombillas];

  for (const product of allProducts) {
    await prisma.product.create({
      data: {
        ...product,
        userId: user.id,
      },
    });
    console.log(`  ✅ Producto creado: ${product.name}`);
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
