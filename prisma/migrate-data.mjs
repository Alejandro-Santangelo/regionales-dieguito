/**
 * Script para migrar datos de SQLite a PostgreSQL
 * 
 * Uso: node prisma/migrate-data.mjs
 * 
 * Requisitos:
 * 1. Tener PostgreSQL corriendo con la base de datos "regionales-dieguito" creada
 * 2. Haber ejecutado: npx prisma migrate dev --name init
 * 3. Tener DATABASE_URL apuntando a PostgreSQL en .env
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Cliente para PostgreSQL (base de datos destino)
const connectionString = process.env.DATABASE_URL || "postgresql://postgres:Cacho3103@localhost:5432/regionales-dieguito";
const pgAdapter = new PrismaPg({ connectionString });
const pgPrisma = new PrismaClient({ adapter: pgAdapter });

// Conexión directa a SQLite
const dbPath = path.join(__dirname, "dev.db");
const sqlite = new Database(dbPath);

function rowToObj(row) {
  if (!row) return null;
  const obj = {};
  for (const key of Object.keys(row)) {
    let val = row[key];
    // SQLite guarda booleanos como 0/1, convertirlos a boolean real
    if (val === 0 || val === 1) {
      // Solo convertir si la key es un campo booleano conocido
      if (key === 'featured' || key === 'emailVerified') {
        val = val === 1;
      }
    }
    obj[key] = val;
  }
  return obj;
}

async function migrate() {
  console.log("🚀 Iniciando migración de datos de SQLite a PostgreSQL...\n");

  // 1. Migrar usuarios
  console.log("📦 Migrando usuarios...");
  const users = sqlite.prepare("SELECT * FROM User").all();
  console.log(`   Encontrados ${users.length} usuarios en SQLite`);
  for (const user of users) {
    const u = rowToObj(user);
    await pgPrisma.user.upsert({
      where: { id: u.id },
      update: {
        name: u.name,
        username: u.username,
        email: u.email,
        emailVerified: u.emailVerified ? new Date(u.emailVerified) : null,
        image: u.image,
        password: u.password,
        role: u.role,
      },
      create: {
        id: u.id,
        name: u.name,
        username: u.username,
        email: u.email,
        emailVerified: u.emailVerified ? new Date(u.emailVerified) : null,
        image: u.image,
        password: u.password,
        role: u.role,
        createdAt: new Date(u.createdAt),
        updatedAt: new Date(u.updatedAt),
      },
    });
    console.log(`   ✅ Usuario: ${u.email || u.username || u.id}`);
  }

  // 2. Migrar cuentas (accounts)
  console.log("\n📦 Migrando cuentas...");
  const accounts = sqlite.prepare("SELECT * FROM Account").all();
  console.log(`   Encontradas ${accounts.length} cuentas en SQLite`);
  for (const account of accounts) {
    const a = rowToObj(account);
    await pgPrisma.account.upsert({
      where: {
        provider_providerAccountId: {
          provider: a.provider,
          providerAccountId: a.providerAccountId,
        },
      },
      update: {
        type: a.type,
        refresh_token: a.refresh_token,
        access_token: a.access_token,
        expires_at: a.expires_at,
        token_type: a.token_type,
        scope: a.scope,
        id_token: a.id_token,
        session_state: a.session_state,
      },
      create: {
        id: a.id,
        userId: a.userId,
        type: a.type,
        provider: a.provider,
        providerAccountId: a.providerAccountId,
        refresh_token: a.refresh_token,
        access_token: a.access_token,
        expires_at: a.expires_at,
        token_type: a.token_type,
        scope: a.scope,
        id_token: a.id_token,
        session_state: a.session_state,
      },
    });
    console.log(`   ✅ Cuenta: ${a.provider} - ${a.providerAccountId}`);
  }

  // 3. Migrar sesiones
  console.log("\n📦 Migrando sesiones...");
  const sessions = sqlite.prepare("SELECT * FROM Session").all();
  console.log(`   Encontradas ${sessions.length} sesiones en SQLite`);
  for (const session of sessions) {
    const s = rowToObj(session);
    await pgPrisma.session.upsert({
      where: { sessionToken: s.sessionToken },
      update: {
        expires: new Date(s.expires),
      },
      create: {
        id: s.id,
        sessionToken: s.sessionToken,
        userId: s.userId,
        expires: new Date(s.expires),
      },
    });
    console.log(`   ✅ Sesión: ${s.sessionToken}`);
  }

  // 4. Migrar tokens de verificación
  console.log("\n📦 Migrando tokens de verificación...");
  const tokens = sqlite.prepare("SELECT * FROM VerificationToken").all();
  console.log(`   Encontrados ${tokens.length} tokens en SQLite`);
  for (const token of tokens) {
    const t = rowToObj(token);
    await pgPrisma.verificationToken.upsert({
      where: {
        identifier_token: {
          identifier: t.identifier,
          token: t.token,
        },
      },
      update: {
        expires: new Date(t.expires),
      },
      create: {
        identifier: t.identifier,
        token: t.token,
        expires: new Date(t.expires),
      },
    });
    console.log(`   ✅ Token: ${t.identifier}`);
  }

  // 5. Migrar productos
  console.log("\n📦 Migrando productos...");
  const products = sqlite.prepare("SELECT * FROM Product").all();
  console.log(`   Encontrados ${products.length} productos en SQLite`);
  for (const product of products) {
    const p = rowToObj(product);
    await pgPrisma.product.upsert({
      where: { id: p.id },
      update: {
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        images: p.images,
        stock: p.stock,
        featured: p.featured,
      },
      create: {
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        images: p.images,
        stock: p.stock,
        featured: p.featured,
        userId: p.userId,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
      },
    });
    console.log(`   ✅ Producto: ${p.name}`);
  }

  // 6. Migrar carritos
  console.log("\n📦 Migrando carritos...");
  const carts = sqlite.prepare("SELECT * FROM Cart").all();
  console.log(`   Encontrados ${carts.length} carritos en SQLite`);
  for (const cart of carts) {
    const c = rowToObj(cart);
    await pgPrisma.cart.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id,
        userId: c.userId,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt),
      },
    });
    console.log(`   ✅ Carrito: ${c.id}`);
  }

  // 7. Migrar items del carrito
  console.log("\n📦 Migrando items del carrito...");
  const cartItems = sqlite.prepare("SELECT * FROM CartItem").all();
  console.log(`   Encontrados ${cartItems.length} items de carrito en SQLite`);
  for (const item of cartItems) {
    const ci = rowToObj(item);
    await pgPrisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: ci.cartId,
          productId: ci.productId,
        },
      },
      update: {
        quantity: ci.quantity,
      },
      create: {
        id: ci.id,
        cartId: ci.cartId,
        productId: ci.productId,
        quantity: ci.quantity,
      },
    });
    console.log(`   ✅ CartItem: ${ci.id}`);
  }

  // 8. Migrar órdenes
  console.log("\n📦 Migrando órdenes...");
  const orders = sqlite.prepare("SELECT * FROM `Order`").all();
  console.log(`   Encontradas ${orders.length} órdenes en SQLite`);
  for (const order of orders) {
    const o = rowToObj(order);
    await pgPrisma.order.upsert({
      where: { id: o.id },
      update: {
        total: o.total,
        status: o.status,
        paymentId: o.paymentId,
      },
      create: {
        id: o.id,
        userId: o.userId,
        total: o.total,
        status: o.status,
        paymentId: o.paymentId,
        createdAt: new Date(o.createdAt),
        updatedAt: new Date(o.updatedAt),
      },
    });
    console.log(`   ✅ Orden: ${o.id}`);
  }

  // 9. Migrar items de órdenes
  console.log("\n📦 Migrando items de órdenes...");
  const orderItems = sqlite.prepare("SELECT * FROM OrderItem").all();
  console.log(`   Encontrados ${orderItems.length} items de orden en SQLite`);
  for (const item of orderItems) {
    const oi = rowToObj(item);
    await pgPrisma.orderItem.upsert({
      where: { id: oi.id },
      update: {
        quantity: oi.quantity,
        price: oi.price,
      },
      create: {
        id: oi.id,
        orderId: oi.orderId,
        productId: oi.productId,
        quantity: oi.quantity,
        price: oi.price,
      },
    });
    console.log(`   ✅ OrderItem: ${oi.id}`);
  }

  console.log("\n🎉 ¡Migración completada exitosamente!");
}

migrate()
  .catch((e) => {
    console.error("❌ Error durante la migración:", e);
    process.exit(1);
  })
  .finally(async () => {
    sqlite.close();
    await pgPrisma.$disconnect();
  });
