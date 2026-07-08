import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, username, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.usuario.findFirst({
      where: {
        OR: [
          { email },
          ...(username ? [{ usuario: username }] : []),
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { error: "Ya existe un usuario con ese email" },
          { status: 400 }
        );
      }
      if (username && existingUser.usuario === username) {
        return NextResponse.json(
          { error: "Ya existe un usuario con ese nombre de usuario" },
          { status: 400 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.usuario.create({
      data: {
        nombre: name,
        usuario: username || null,
        email,
        hashContrasena: hashedPassword,
        contrasena: password, // Guardamos en texto plano para recuperación
        rol: "user",
      },
    });

    return NextResponse.json(
      { message: "Usuario creado exitosamente", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al registrar:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
